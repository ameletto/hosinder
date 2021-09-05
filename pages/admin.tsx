import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import useSWR, { SWRResponse } from "swr";
import Container from "../components/Container";
import CreateEventModal from "../components/CreateEventModal";
import H2 from "../components/H2";
import H3 from "../components/H3";
import HandwrittenButton from "../components/HandwrittenButton";
import SEO from "../components/SEO";
import { SchoolModel } from "../models/School";
import { UserModel } from "../models/User";
import cleanForJSON from "../utils/cleanForJSON";
import dbConnect from "../utils/dbConnect";
import fetcher from "../utils/fetcher";
import { DatedObj, SchoolObj, SchoolObjGraph, UserObj } from "../utils/types";

const admin = (props: { thisUser: DatedObj<UserObj>, thisSchool: DatedObj<SchoolObj> }) => {
    const [isCreateEvent, setIsCreateEvent] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    
    const {data: schoolData, error: schoolError}: SWRResponse<{data: DatedObj<SchoolObjGraph>}, any> = useSWR(`/api/school?id=${props.thisSchool._id}&iter=${iter}`, fetcher);
    console.log(schoolData, schoolError)
    if (schoolData && schoolData.data) console.table(schoolData.data)

    return (
        <Container width="7xl">
            <SEO title={`${props.thisSchool.name} dashboard`} imgUrl={props.thisSchool.image || null}/>
            <H2 className="text-center">{props.thisSchool.name}</H2>
            <p>{props.thisSchool.description}</p>

            <div className="mb-8">
                <div className="flex">
                    <H3>Your events:</H3>
                    <div className="ml-auto"><HandwrittenButton onClick={() => setIsCreateEvent(true)}><FaPlus/>New event</HandwrittenButton></div>
                </div>
                <CreateEventModal isOpen={isCreateEvent} setIsOpen={setIsCreateEvent} schoolId={props.thisSchool._id} iter={iter} setIter={setIter}/>
                {(schoolData && schoolData.data) && schoolData.data.eventsArr.length > 0 ? schoolData.data.eventsArr.map(e => (
                    // Grid of events
                    <div className="flex">
                        <div className="rounded-md border-primary w-1/3">
                            <h2>{e.name}</h2>
                            {e.image && <img src={e.image}/>}
                            <p>{e.description}</p>
                        </div>
                    </div>
                )) : <p>No events yet. Create an event so your students can start tinder-matching themselves to 'em ;)</p>}
            </div>

            <div>
                <div className="flex">
                    <H3>Your admins:</H3>
                    <div className="ml-auto"><HandwrittenButton><FaPlus/>Add an admin</HandwrittenButton></div>
                </div>
                <div className="flex gap-4">
                    {schoolData && schoolData.data && schoolData.data.adminsArr.map(user => (
                        // click on user -> popup with more info?
                        <div className="flex justify-center p-4 oswald font-bold rounded-md transition border border-transparent hover:border-gray-400">
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
            </div>


        </Container>
    )
}

export default admin

export const getServerSideProps: GetServerSideProps = async (context) => {
    const session = await getSession(context);

    if (!session) return {redirect: {permanent: false, destination: "/auth/welcome"}};

    try {
        await dbConnect();
        const thisUser = await UserModel.findOne({email: session.user.email});
            
        const thisSchool = await SchoolModel.findOne({admin: {$all: [thisUser._id]}})
        if (!thisSchool) return {notFound: true};
        return !thisUser ? {redirect: {permanent: false, destination: "/auth/newaccount"}} : {props: { thisUser: cleanForJSON(thisUser), thisSchool: cleanForJSON(thisSchool) }};
    } catch (e) {
        console.log(e);
        return {notFound: true};
        // return an unexpected error occured
    }
};