import axios from 'axios';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import Link from "next/link";
import React, { useState } from 'react';
import { DragDropContext, Draggable, Droppable, resetServerContext } from 'react-beautiful-dnd';
import { FaArrowLeft } from 'react-icons/fa';
import Container from '../components/Container';
import EventCard from '../components/EventCard';
import H1 from '../components/H1';
import H3 from '../components/H3';
import HandwrittenButton from '../components/HandwrittenButton';
import InlineButton from '../components/InlineButton';
import Modal from '../components/Modal';
import { EventModel } from '../models/Event';
import { UserModel } from '../models/User';
import cleanForJSON from '../utils/cleanForJSON';
import dbConnect from '../utils/dbConnect';
import { DatedObj, EventObj, UserObj } from '../utils/types';

// a little function to help us with reordering the result
const reorder = (list: DatedObj<EventObj>[], startIndex, endIndex): DatedObj<EventObj>[] => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination) => {
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const flatListToRenderedEvents = (list: DatedObj<EventObj>[]): DatedObj<EventObj>[][] => {
    let i = 0
    let finalList = []
    for (let listItem of list) {
        if (i % 3 === 0) finalList.push([])
        finalList[finalList.length - 1].push(listItem)
        i++;
    }
    return finalList
}
const renderedEventsToFlatList = (list: DatedObj<EventObj>[][]): DatedObj<EventObj>[] => {
    let finalList = []
    for (let subList of list) {
        for (let event of subList) {
            finalList.push(event)
        }
    }
    return finalList
}

export default function dashboard(props: {thisUser: DatedObj<UserObj>, preferredEvents: DatedObj<EventObj>[]}) {
    const [preferredEvents, setPreferredEvents] = useState<DatedObj<EventObj>[]>(props.preferredEvents.length > 0 ? props.preferredEvents.filter(event => !props.thisUser.top3Events.includes(event._id)): []);
    // preferred events doesn't contain top 3 events.
    
    const [top3Events, setTop3Events] = useState<DatedObj<EventObj>[]>(props.thisUser.top3Events.map(e => props.preferredEvents.find(event => e === event._id)) || []);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalEvent, setModalEvent] = useState<DatedObj<EventObj>>(null);
    

    const getList = (id: string): DatedObj<EventObj>[] => Number(id.substring(10)) >= 0 ? flatListToRenderedEvents(preferredEvents)[Number(id.substring(10))] : top3Events

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) return;

        let tempEvents;
        tempEvents = flatListToRenderedEvents(preferredEvents);
        let tempTop3;
        tempTop3 = top3Events;

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            if (Number(source.droppableId.substring(10)) === -1)  tempTop3 = items
            else tempEvents = tempEvents.map((subList, index) => index===Number(source.droppableId.substring(10)) ? items : subList)

        } else {
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );
            // result[source.droppableId]
            // getList(source.droppableId): list of events of the row that the dragged event comes from.
            // getList(destination.droppableId)

            for (let id of [source.droppableId, destination.droppableId]) {
                if (Number(id.substring(10)) === -1) tempTop3 = result[id]
                else tempEvents[Number(id.substring(10))] = result[id]
            }
            
        }
        tempEvents = renderedEventsToFlatList(tempEvents)
        tempEvents = tempEvents.filter(e => !tempTop3.includes(e))

        if (tempTop3.length > 3) {
            const sourceClone = Array.from(tempTop3);
            const destClone = Array.from(tempEvents);
            const [removed] = sourceClone.splice(3, 1);

            destClone.splice(0, 0, removed);
            tempTop3 = sourceClone;
            tempEvents = destClone;
        }

        setPreferredEvents(tempEvents);
        setTop3Events(tempTop3)

        const top3EventsIDs = tempTop3.map(event => event._id)
        axios.post("/api/user", {
            id: props.thisUser._id,
            preferredEvents: [...tempTop3, ...tempEvents.map(event => event._id)],
            top3Events: top3EventsIDs
        }).then(res => {
            // props.thisUser.preferredEvents = res.data.user.preferredEvents
            console.log({preferredEvents: res.data.user.preferredEvents, top3Events: res.data.user.top3Events})
        })
        .catch(e => {console.log(e)});


    };
    const onSubmit = () => {
        setIsLoading(true);
        axios.post("/api/submission", {
            user: props.thisUser._id,
            top3events: top3Events,
        }).then(res => {
            console.log("you have submitted your top 3 events!", res.data);
            setIsSubmitting(false);
        })
        .catch(e => {console.log(e)})
        .finally(() =>  setIsLoading(false));
    }

    return (
        <Container className="max-w-5xl">
            <InlineButton href="/app"><div className="flex items-center"><FaArrowLeft/><span className="ml-2">Back to Tinder</span></div></InlineButton>
            <div className="mb-12">
                <H1>Choose Top 3</H1>
                <div className="flex justify-center"><div className="-mt-3 ml-10 border-primary" style={{borderBottomWidth: 10, width: 220, zIndex: -1}}></div></div>
            </div>
            { props.thisUser.preferredEvents.length > 0 ?
                <>
                <p>Here are all the events you swiped right on ;)<br/>Please drag them into order of preference and when ready, submit your event selection.</p>
                <div className="mt-8"><DragDropContext onDragEnd={onDragEnd}><div className="flex flex-col gap-8">
                <Droppable droppableId={`droppable--1`} direction="horizontal">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                            >
                                <div className="flex flex-col md:flex-row">
                                    {[0, 1, 2].map(i => (
                                        top3Events[i] ? <Draggable
                                            key={top3Events[i]._id}
                                            draggableId={top3Events[i]._id}
                                            index={i}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    // style={getItemStyle(
                                                    //     snapshot.isDragging,
                                                    //     provided.draggableProps.style
                                                    // )}
                                                    className="px-4"
                                                    onClick={() => setModalEvent(top3Events[i])}
                                                >
                                                    <EventCard event={top3Events[i]} wide={false} short={true}/>
                                                </div>
                                            )}
                                        </Draggable> : <div className="mx-4 px-4 w-72 h-36 rounded-lg text-4xl flex items-center justify-center border-4 border-primary border-dashed"/>
                                    ))}
                                </div>
                                {/* { provided.placeholder } */}
                                <div className="flex gap-8">
                                    {["🥇", "🥈", "🥉"].map(medal => (
                                        <div className="w-72 text-4xl px-4 text-center mt-2">{medal}</div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Droppable>
                    {preferredEvents && flatListToRenderedEvents(preferredEvents).map((subList, index) => <Droppable droppableId={`droppable-${index}`} direction="horizontal">
                        {(provided, snapshot) => (
                            <div
                                ref={provided.innerRef}
                                key={subList[0]._id}
                                // style={getListStyle(snapshot.isDraggingOver)}
                            >
                                {index === 0 && <h2 className="raleway text-3xl font-semibold text-gray-500 mt-8 mb-4">More matches</h2>}
                                <div className="flex flex-col md:flex-row">
                                    {subList.map((event, index) => (
                                        <Draggable
                                            key={event._id}
                                            draggableId={event._id}
                                            index={index}>
                                            {(provided, snapshot) => (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    // style={getItemStyle(
                                                    //     snapshot.isDragging,
                                                    //     provided.draggableProps.style
                                                    // )}
                                                    className="px-4"
                                                    onClick={() => setModalEvent(event)}
                                                >
                                                    <EventCard event={event} wide={false} short={true}/>
                                                </div>
                                            )}
                                        </Draggable>
                                    ))}
                                </div>
                                {/* {provided.placeholder} */}
                            </div>
                        )}
                    </Droppable>)}                
                </div></DragDropContext></div>
                <p className="text-gray-400 text-sm mt-8">
                    Went through Tinder so fast that you forgot all the details of each event? 
                    If that's the case, I am pleased to inform you that you need not panic no more as you can click on an event anytime 
                    to bring back your dear details.
                </p>
                
                <div className="mt-12">
                    <HandwrittenButton onClick={() => setIsSubmitting(true)} disabled={!preferredEvents}>Submit!</HandwrittenButton>
                </div>
                </> : <p>No events yet. Go to the <a className="hover:primary transition underline"><Link href="/app">tinder</Link></a> to match with some events!</p>
            }

            <Modal isOpen={!!modalEvent} onRequestClose={() => setModalEvent(null)}>
                <div className="w-full flex justify-center">
                    {modalEvent && <EventCard event={modalEvent}/>}
                </div>
            </Modal>
            <Modal isOpen={isSubmitting} onRequestClose={() => setIsSubmitting(false)}>
                <H3 className="mb-2">Submit top 3 events</H3>
                <p>Are you sure you want to submit your events? Please confirm you are 100% sure about your top 3 choices:</p>
                <ul className="my-4 text-gray-500">
                    {top3Events && top3Events.map((event, index) => <li key={event._id} className="ml-2 my-2">• {event.name}</li>)}
                </ul>
                <p>This action cannot be undone.</p>
                <div className="flex gap-4 mt-10 mb-4 justify-center">
                    <HandwrittenButton onClick={onSubmit} isLoading={isLoading}>Submit</HandwrittenButton>
                    <HandwrittenButton onClick={() => setIsSubmitting(false)}>Cancel</HandwrittenButton>
                </div>
            </Modal>
        </Container>
    );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
    resetServerContext()

    const session = await getSession(context);

    if (!session) return { redirect: { permanent: false, destination: "/" } };

    try {
        await dbConnect();
        const thisUser = await UserModel.findOne({ email: session.user.email });
        if (!thisUser) return { redirect: { permanent: false, destination: "/" } };
        const preferredEvents = thisUser.preferredEvents ? await EventModel.find({ _id: {$in: thisUser.preferredEvents} }) : []
        
        if (!thisUser.top3Events) {
            thisUser.top3Events = []
            await thisUser.save()
        }

        // sort the events with the order of thisUser.preferredEvents
        const sortedEvents = thisUser.preferredEvents.map(eventId => preferredEvents.find(
            e => e._id.toString() === eventId.toString())
        );

        // confirm top3events are in preferredEvents
        let x = thisUser.top3Events;
        x = x.filter(y => thisUser.preferredEvents.includes(y));
        if (x !== thisUser.top3Events) {
            thisUser.top3Events = x;
            await thisUser.save()
        }
        
        return { props: { thisUser: cleanForJSON(thisUser), preferredEvents: cleanForJSON(sortedEvents) } } 
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}