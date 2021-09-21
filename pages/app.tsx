import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { SchoolModel } from "../models/School";
import { UserModel } from "../models/User";
import cleanForJSON from "../utils/cleanForJSON";
import dbConnect from "../utils/dbConnect";
import useSWR, { SWRResponse } from "swr";
import { DatedObj, EventObj, SchoolObj, UserObj } from "../utils/types";
import fetcher from "../utils/fetcher";
import EventCard from "../components/EventCard";
import Container from "../components/Container";
import Button from "../components/Button";
import {useState} from 'react';
import axios from "axios";
import router from "next/router";
import H1 from "../components/H1";

export default function App(props: { thisUser: DatedObj<UserObj> }) {
    // fetch and map all the event cards assoc with this school.
    // based on labels, decide on an order to show them.
    const { data: eventData, error: eventError }: SWRResponse<{ data: DatedObj<EventObj>[] }, any> = useSWR(`/api/event?school=${props.thisUser.school || "61216845561457369cdd35ae"}`, fetcher);
    const[i, setI] = useState<number>(0);

    function onAccept(eventId: string) {
        axios.post("/api/user", { preferredEvents: [...props.thisUser.preferredEvents.filter(e => e !== eventId), eventId]})
        .then(res => {
            if (res.data.error) console.log("you are a failure ", res.data.error) 
            else props.thisUser.preferredEvents = res.data.user.preferredEvents
        }).catch(e => console.log(e))
        .finally(() => setI(i+1));
    }

    function onReject(eventId: string) {
        axios.post("/api/user", { notWantedEvents: [...props.thisUser.notWantedEvents.filter(e => e !== eventId), eventId]})
        .then(res => {
            if (res.data.error) console.log("you are a failure ", res.data.error) 
            else props.thisUser.notWantedEvents = res.data.user.notWantedEvents
        }).catch(e => console.log(e))
        .finally(() => setI(i+1));
    }
    // if (eventData && eventData.data.length > i) router.push("/dashboard")

    return (
        <Container width="7xl">
            <div className="mb-12">
                <H1>Start matching</H1>
                <div className="flex justify-center"><div className="-mt-3 ml-10 border-secondary" style={{borderBottomWidth: 10, width: 270, zIndex: -1}}></div></div>
            </div>
            <img src="/heart.png" alt="Black heart" className="hidden sm:block h-16 absolute left-10 top-24"/>
            <img src="/heart.png" alt="Black heart" className="hidden sm:block h-16 absolute right-10 top-24"/>
            {eventData && eventData.data.length > i ? <div className="flex gap-14 items-center justify-center">             
                <Button onClick={() => onReject(eventData.data[i]._id)}>
                    <img src="/frown.png" className="mx-auto"></img>
                    <p className="font-semibold text-center">not interested - swipe left</p>
                </Button>
                <EventCard event={eventData.data[i]}/>
                <Button onClick={() => onAccept(eventData.data[i]._id)}>
                    <img src="/smile.png" className="mx-auto"></img>
                    <p className="font-semibold text-center">interested - swipe right</p>
                </Button>
            </div>:<p>Loading...</p>}
        </Container>
        
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return { redirect: { permanent: false, destination: "/" } };

    try {
        await dbConnect();
        const thisUser = await UserModel.findOne({ email: session.user.email });
        // const thisSchool = thisUser.school ? await SchoolModel.findOne({ _id: thisUser.school }) : await SchoolModel.findOne({ name: 'Marc Garneau Collegiate Institute' })
        return thisUser ? { props: { thisUser: cleanForJSON(thisUser) } } : { redirect: { permanent: false, destination: "/auth/welcome" } };
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};
