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


const dashboard = (props: {thisUser: DatedObj<UserObj>, preferredEvents: DatedObj<EventObj>[]}) => {
    const [preferredEvents, setPreferredEvents] = useState<DatedObj<EventObj>[]>(props.preferredEvents);
    console.log(props.preferredEvents.map(event => event._id))
    console.log(props.thisUser.preferredEvents)

    const handleOnDragEnd = (result) => {
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
    return (
        <Container>
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