import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Container from "../components/Container"
import { EventModel } from "../models/Event";
import { UserModel } from "../models/User";
import cleanForJSON from "../utils/cleanForJSON";
import dbConnect from "../utils/dbConnect";
import { DatedObj, EventObj, UserObj } from "../utils/types";
import { DragDropContext, Droppable, Draggable, resetServerContext } from "react-beautiful-dnd";
import EventCard from "../components/EventCard";
import axios from "axios";
import { useState } from "react";
import HandwrittenButton from "../components/HandwrittenButton";
import Modal from "../components/Modal";
import Button from "../components/Button";

// TODO: allow admin of school to see all submissions.
// TODO: congratulatory page for submitting events, maybe go to social media page of all submissions? 
// also maybe throw some confetti like vercel.
const dashboard = (props: {thisUser: DatedObj<UserObj>, preferredEvents: DatedObj<EventObj>[]}) => {
    const [preferredEvents, setPreferredEvents] = useState<DatedObj<EventObj>[]>(props.preferredEvents);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleOnDragEnd = (result) => {
        // result is array of EventObjs in the order of the drag & drop.
        if (!result.destination) return;
        const items = Array.from(preferredEvents);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);
        setPreferredEvents(items);

        axios.post("/api/user", {
            id: props.thisUser._id,
            preferredEvents: items.map(event => event._id),
        }).then(res => {
            console.log(res.data.user.preferredEvents)
            props.thisUser.preferredEvents = res.data.user.preferredEvents
        })
        .catch(e => {console.log(e)});
    }

    const onSubmit = () => {
        axios.post("/api/submission", {
            user: props.thisUser._id,
            top3events: [preferredEvents[0], preferredEvents[1], preferredEvents[2]], // more elegant way to do this
        }).then(res => {
            console.log("you have submitted your top 3 events!", res.data)
        })
        .catch(e => {console.log(e)})
        .finally(() => setIsSubmitting(false));
    }

    return (
        <Container>
            <p>Here are all your matches ;)<br/>Please drag them into order of preference and hit submit to submit your top 3 event selections.</p>
            <DragDropContext onDragEnd={handleOnDragEnd}>
                <Droppable droppableId="tasks-master">
                    {(provided) => (
                        <div ref={provided.innerRef} {...provided.droppableProps}>
                            {preferredEvents && preferredEvents.length > 0 && preferredEvents.map((event, index) => ( 
                                // create a list of draggables
                                <Draggable key={event._id} draggableId={event._id.toString()} index={index}>
                                    {provided => (
                                        <div
                                            ref={provided.innerRef}
                                            {...provided.draggableProps}
                                            {...provided.dragHandleProps}
                                            className="my-4"
                                        >
                                            <EventCard event={event}/>
                                        </div>
                                    )}
                                </Draggable>
                            ) )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            <HandwrittenButton onClick={() => setIsSubmitting(true)} disabled={!preferredEvents}>Submit!</HandwrittenButton>
            <Modal isOpen={isSubmitting} setIsOpen={setIsSubmitting}>
                <p>Are you sure you want to submit your events? Please make sure you are 100% sure about your top 3 choices, as this action cannot be undone.</p>
                <div className="flex gap-2">
                    <HandwrittenButton onClick={onSubmit}>Submit</HandwrittenButton>
                    <Button onClick={() => setIsSubmitting(false)}>Cancel</Button>
                </div>
            </Modal>
        </Container>
    )
}

export default dashboard


export const getServerSideProps: GetServerSideProps = async (context) => {
    resetServerContext()

    const session = await getSession(context);

    if (!session) return { redirect: { permanent: false, destination: "/" } };

    try {
        await dbConnect();
        const thisUser = await UserModel.findOne({ email: session.user.email });
        const preferredEvents = thisUser.preferredEvents ? await EventModel.find({ _id: {$in: thisUser.preferredEvents} }) : []
        
        // sort the events with the order of thisUser.preferredEvents
        const sortedEvents = thisUser.preferredEvents.map(eventId => preferredEvents.find(
            e => e._id.toString() === eventId.toString())
        );
        
        return { props: { thisUser: cleanForJSON(thisUser), preferredEvents: cleanForJSON(sortedEvents) } } 
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};