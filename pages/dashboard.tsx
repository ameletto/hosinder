import React, { Component, useState } from 'react';
import ReactDOM from 'react-dom';
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd';
import EventCard from '../components/EventCard';
import Container from '../components/Container';
import H1 from '../components/H1';
import HandwrittenButton from '../components/HandwrittenButton';
import { GetServerSideProps } from 'next';
import { getSession } from 'next-auth/client';
import dbConnect from '../utils/dbConnect';
import { EventModel } from '../models/Event';
import { UserModel } from '../models/User';
import cleanForJSON from '../utils/cleanForJSON';
import { DatedObj, EventObj, UserObj } from '../utils/types';
import Modal from '../components/Modal';
import axios from 'axios';
import H3 from '../components/H3';

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

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    padding: grid,
    width: 250
});

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
    const [preferredEvents, setPreferredEvents] = useState<DatedObj<EventObj>[]>(props.preferredEvents);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [modalEvent, setModalEvent] = useState<DatedObj<EventObj>>(null);

    const getList = (id: string): DatedObj<EventObj>[] => flatListToRenderedEvents(preferredEvents)[Number(id.substring(10))]

    const onDragEnd = result => {
        const { source, destination } = result;

        // dropped outside the list
        if (!destination) return;

        let tempEvents;

        if (source.droppableId === destination.droppableId) {
            const items = reorder(
                getList(source.droppableId),
                source.index,
                destination.index
            );

            tempEvents = flatListToRenderedEvents(preferredEvents).map((subList, index) => index===Number(source.droppableId.substring(10)) ? items : subList)

        } else {
            // getList(source.droppableId)
            // getList(destination.droppableId)
            const result = move(
                getList(source.droppableId),
                getList(destination.droppableId),
                source,
                destination
            );
            // result[source.droppableId]

            tempEvents = flatListToRenderedEvents(preferredEvents)
            for (let id of [source.droppableId, destination.droppableId]) tempEvents[Number(id.substring(10))] = result[id]
            
        }
        tempEvents = renderedEventsToFlatList(tempEvents)
        
        axios.post("/api/user", {
            id: props.thisUser._id,
            preferredEvents: tempEvents.map(event => event._id),
        }).then(res => {
            props.thisUser.preferredEvents = res.data.user.preferredEvents
        })
        .catch(e => {console.log(e)});

        setPreferredEvents(tempEvents);

    };
    const onSubmit = () => {
        setIsLoading(true);
        axios.post("/api/submission", {
            user: props.thisUser._id,
            top3events: [preferredEvents[0], preferredEvents[1], preferredEvents[2]], // more elegant way to do this
        }).then(res => {
            console.log("you have submitted your top 3 events!", res.data);
        })
        .catch(e => {console.log(e)})
        .finally(() => {
            setIsLoading(false);
            setIsSubmitting(false);
        });
    }

    return (
        <Container className="max-w-5xl">
            <div className="mb-12">
                <H1>Choose Top 3</H1>
                <div className="flex justify-center"><div className="-mt-3 ml-10 border-primary" style={{borderBottomWidth: 10, width: 220, zIndex: -1}}></div></div>
            </div>
            <p>Here are all the events you swiped right on ;)<br/>Please drag them into order of preference and when ready, submit your event selection.</p>
            <div className="mt-8"><DragDropContext onDragEnd={onDragEnd}><div className="flex flex-col gap-8">
                {preferredEvents && flatListToRenderedEvents(preferredEvents).map((subList, index) => <Droppable droppableId={`droppable-${index}`} direction="horizontal">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            key={subList[0]._id}
                            // style={getListStyle(snapshot.isDraggingOver)}
                        >
                            {index === 1 && <h2 className="raleway text-3xl font-semibold text-gray-500 mt-8 mb-4">More matches</h2>}
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
                            {index === 0 && <div className="flex gap-8">
                                {["🥇", "🥈", "🥉"].map(medal => (
                                    <div className="w-72 text-4xl px-4 text-center mt-2">{medal}</div>
                                ))}
                            </div>}
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
            {/* <div className="absolute max-w-5xl flex gap-8 flex-wrap" style={{top: 260, zIndex: -10}}>
                {preferredEvents && preferredEvents.length > 0 && preferredEvents.map((event, index) => ( 
                    <div key={event._id}>
                        <div className="w-72 h-36 rounded-lg text-4xl flex justify-right p-4"><p>{
                            index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : ""
                        }</p></div>
                    </div>
                ) )}
            </div> */}

            <Modal isOpen={!!modalEvent} onRequestClose={() => setModalEvent(null)}>
                <div className="w-full flex justify-center">
                    {modalEvent && <EventCard event={modalEvent}/>}
                </div>
            </Modal>
            <Modal isOpen={isSubmitting} onRequestClose={() => setIsSubmitting(false)}>
                <H3 className="mb-2">Submit top 3 events</H3>
                <p>Are you sure you want to submit your events? Please confirm you are 100% sure about your top 3 choices:</p>
                <ul className="my-4 text-gray-500">
                    {preferredEvents && preferredEvents.map((event, index) => index < 3 && <li key={event._id} className="ml-2 my-2">• {event.name}</li>)}
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
        
        // sort the events with the order of thisUser.preferredEvents
        const sortedEvents = thisUser.preferredEvents.map(eventId => preferredEvents.find(
            e => e._id.toString() === eventId.toString())
        );
        
        return { props: { thisUser: cleanForJSON(thisUser), preferredEvents: cleanForJSON(sortedEvents) } } 
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
}