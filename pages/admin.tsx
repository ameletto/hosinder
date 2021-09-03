import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import useSWR, { SWRResponse } from "swr";
import CreateEventModal from "../components/CreateEventModal";
import H3 from "../components/H3";
import HandwrittenButton from "../components/HandwrittenButton";
import SEO from "../components/SEO";
import { SchoolModel } from "../models/School";
import { UserModel } from "../models/User";
import cleanForJSON from "../utils/cleanForJSON";
import dbConnect from "../utils/dbConnect";
import fetcher from "../utils/fetcher";
import { DatedObj, EventObj, SchoolObjWithAdmins, UserObj } from "../utils/types";

const admin = (props: { thisUser: DatedObj<UserObj>, thisSchool: DatedObj<SchoolObjWithAdmins> }) => {
    const [isCreateEvent, setIsCreateEvent] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    
    const {data: events, error: eventsError}: SWRResponse<{data: DatedObj<EventObj>[]}, any> = useSWR(`/api/events?school=${props.thisSchool._id}&iter=${iter}`, fetcher);

    return (
        <div className="max-w-5xl">
            <SEO title={`${props.thisSchool.name} dashboard`} imgUrl={props.thisSchool.image || null}/>
            <h1>{props.thisSchool.name}</h1>
            <p>{props.thisSchool.description}</p>

            <div className="flex">
                <H3>Your events:</H3>
                <div className="ml-auto"><HandwrittenButton onClick={() => setIsCreateEvent(true)}><FaPlus/>New event</HandwrittenButton></div>
            </div>
            <CreateEventModal isOpen={isCreateEvent} setIsOpen={setIsCreateEvent} schoolId={props.thisSchool._id} iter={iter} setIter={setIter}/>
            {(events && events.data) && events.data.length > 0 ? events.data.map(e => (
                // Grid of events
                <div className="flex">
                    <div className="rounded-md border-primary w-1/3">
                        <h2>{e.name}</h2>
                        {e.image && <img src={e.image}/>}
                        <p>{e.description}</p>
                    </div>
                </div>
            )) : <p>No events yet. Create an event so your students can start tinder-matching themselves to 'em ;)</p>}

            <div className="flex">
                <H3>Your admins:</H3>
                <div className="ml-auto"><HandwrittenButton><FaPlus/>Add an admin</HandwrittenButton></div>
            </div>
            {props.thisSchool.adminArr.map(user => (
                <div className="flex justify-center p-4 oswald font-bold">
                <img
                    src={user.image}
                    alt={`Profile picture of ${user.name}`}
                    className="rounded-full h-14 w-14 mr-4"
                />
                <div>
                    <p className="text-xl">{user.name}</p>
                    <p className="text-xl">{user.email}</p>
                </div>
            </div>
            ))}


        </div>
    )
}

export default admin

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return {redirect: {permanent: false, destination: "/auth/welcome"}};

    try {
        await dbConnect();
        const thisUser = await UserModel.findOne({email: session.user.email});
            
        const thisSchool = await SchoolModel.aggregate([
            {$match: {...}},
            {$lookup: {
                from: "users",
                // localField: "admin",
                // foreignField: "_id",
                let: {"_id": "$admin"},
                pipeline: [
                    {$match: {$expr: {$and: [{$in: ["$_id", "$$_id"]}, ]}}},
                ],
                as: "adminArr", 
            }}    
        ]) 
        return !thisUser ? {redirect: {permanent: false, destination: "/auth/newaccount"}} : {props: { thisUser: cleanForJSON(thisUser), thisSchool: cleanForJSON(thisSchool) }};
    } catch (e) {
        console.log(e);
        return {props: { }};
        // return an unexpected error occured
    }
};