import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { SchoolModel } from "../models/School";
import { UserModel } from "../models/User";
import cleanForJSON from "../utils/cleanForJSON";
import dbConnect from "../utils/dbConnect";
import useSWR, { SWRResponse } from "swr";
import { DatedObj, EventObj, SchoolObj } from "../utils/types";
import fetcher from "../utils/fetcher";
import EventCard from "../components/EventCard";
import Container from "../components/Container";
import Button from "../components/Button";
import {useState} from 'react';

export default function App(props: { thisSchool: DatedObj<SchoolObj> }) {
    // fetch and map all the event cards assoc with this school.
    // based on labels, decide on an order to show them.
    const { data: eventData, error: eventError }: SWRResponse<{ data: DatedObj<EventObj> }, any> = useSWR(`/api/event?school=${props.thisSchool._id}`, fetcher);
    console.log(eventData);
    console.log(eventError);
    const[i, setI] = useState<number>(0);
    return (
        <Container>
            <Button onClick={() => setI(i+1)}>
                <img src="/frown.png"></img>
                </Button>
            <Button onClick={() => setI(i+1)}>
                <img src="/smile.png"></img>
            </Button>
        {eventData ? <EventCard
            index={i}
            eventData={eventData}
        />:<p>Loading...</p>}
        </Container>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return { redirect: { permanent: false, destination: "/" } };

    try {
        await dbConnect();
        const thisUser = await UserModel.findOne({ email: session.user.email });
        const thisSchool = thisUser.school ? await SchoolModel.findOne({ _id: thisUser.school }) : await SchoolModel.findOne({ name: 'Marc Garneau Collegiate Institute' })
        return thisSchool ? { props: { thisSchool: cleanForJSON(thisSchool) } } : { redirect: { permanent: false, destination: "/auth/welcome" } };
    } catch (e) {
        console.log(e);
        return { notFound: true };
    }
};