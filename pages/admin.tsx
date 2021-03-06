import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import { useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import Select from "react-select";
import useSWR, { SWRResponse } from "swr";
import Container from "../components/Container";
import CreateEventModal from "../components/CreateEventModal";
import DeleteEventModal from "../components/DeleteEventModal";
import EditEventModal from "../components/EditEventModal";
import EventCard from "../components/EventCard";
import H1 from "../components/H1";
import H2 from "../components/H2";
import HandwrittenButton from "../components/HandwrittenButton";
import Modal from "../components/Modal";
import SEO from "../components/SEO";
import { SchoolModel } from "../models/School";
import { UserModel } from "../models/User";
import cleanForJSON from "../utils/cleanForJSON";
import dbConnect from "../utils/dbConnect";
import fetcher from "../utils/fetcher";
import { DatedObj, EventObj, SchoolObj, SchoolObjGraph, UserObj } from "../utils/types";

const admin = (props: { thisUser: DatedObj<UserObj>, thisSchool: DatedObj<SchoolObj> }) => {
    const [isCreateEvent, setIsCreateEvent] = useState<boolean>(false);
    const [isEditEvent, setIsEditEvent] = useState<boolean>(false);
    const [isAddAdmin, setIsAddAdmin] = useState<boolean>(false);
    const [isDeleteEvent, setIsDeleteEvent] = useState<boolean>(false);
    const [iter, setIter] = useState<number>(0);
    const [newAdmins, setNewAdmins] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [modalEvent, setModalEvent] = useState<DatedObj<EventObj>>(null);
    
    const {data: schoolData, error: schoolError}: SWRResponse<{data: DatedObj<SchoolObjGraph>}, any> = useSWR(`/api/school?id=${props.thisSchool._id}&iter=${iter}`, fetcher);
    const {data: studentsData, error: studentsError}: SWRResponse<{data: DatedObj<UserObj>[]}, any> = useSWR(`/api/user?school=${props.thisSchool._id}&removeAdmins=${true}`, fetcher);

    console.log((schoolData && schoolData.data) ? schoolData.data.eventsArr : [])

    function onAddAdmin() {
        setIsLoading(true);

        axios.post("/api/school", {
            id: props.thisSchool._id,
            admin: [...props.thisSchool.admin, ...newAdmins,],
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                console.log(res.data.error)
                setIsLoading(false);
            } else {
                console.log(res.data);
                setIsAddAdmin(false);
            }
        }).catch(e => {
            setIsLoading(false);
            setError("An unknown error occurred.");
            console.log(e);
        });
    }
    

    return (
        <Container width="7xl">
            <SEO title={`Dashboard: ${props.thisSchool.name}`} imgUrl={props.thisSchool.image || null}/>
            <H1 className="text-center">{props.thisSchool.name}</H1>
            <p>{props.thisSchool.description}</p>

            <div className="my-12">
                <div className="flex mb-1">
                    <H2>All events:</H2>

                    <div className="flex ml-auto">
                        <HandwrittenButton onClick={() => setIsCreateEvent(true)} arrowRightOnHover={false}>
                            <div className="flex items-center">
                                <FaPlus/><span className="ml-2">New event</span>
                            </div>
                        </HandwrittenButton>
                        <HandwrittenButton onClick={() => setIsEditEvent(true)} arrowRightOnHover={false}> 
                            <div className="flex items-center">
                                <FaEdit/><span className="ml-2">Edit event</span>
                            </div>
                        </HandwrittenButton>
                        <HandwrittenButton onClick={() => setIsDeleteEvent(true)} arrowRightOnHover={false}> 
                            <div className="flex items-center">
                                <FaTrash/><span className="ml-2">Delete events</span>
                            </div>
                        </HandwrittenButton>
                    </div>
                </div>
                <CreateEventModal isOpen={isCreateEvent} setIsOpen={setIsCreateEvent} schoolId={props.thisSchool._id} iter={iter} setIter={setIter}/>
                <EditEventModal isOpen={isEditEvent} setIsOpen={setIsEditEvent} allEvents={schoolData && schoolData.data ? schoolData.data.eventsArr : []} iter={iter} setIter={setIter}/>
                <DeleteEventModal isOpen={isDeleteEvent} setIsOpen={setIsDeleteEvent} schoolId={props.thisSchool._id} iter={iter} setIter={setIter} eventData={(schoolData && schoolData.data) ? schoolData.data.eventsArr : []}/>
                <div className="flex gap-8 flex-wrap overflow-hidden">
                    {(schoolData && schoolData.data) && schoolData.data.eventsArr.length > 0 ? (
                        <>
                        <p className="text-gray-400 text-sm w-full">Click on an event to see its full description.</p>
                        {schoolData.data.eventsArr.map(event => (
                            // Grid of events
                            <div onClick={() => setModalEvent(event)} className="cursor-pointer">
                                <EventCard event={event} wide={false}/>
                            </div>
                        ))}
                        </>
                    ) : <p>No events yet. Create an event so your students can start tinder-matching themselves to 'em ;)</p>}
                </div>
            </div>

            <div>
                <div className="flex mb-1">
                    <H2>{`${props.thisSchool.name}'s admins:`}</H2>
                    <div className="ml-auto">
                        <HandwrittenButton onClick={() => setIsAddAdmin(true)} arrowRightOnHover={false}>
                            <div className="flex items-center">
                                <FaPlus/><span className="ml-2">Add admins</span>
                            </div>
                        </HandwrittenButton>
                    </div>
                </div>
                <p className="text-gray-400 text-sm mb-4">Admins can add, edit, and delete events.</p>
                <div className="flex gap-4">
                    {schoolData && schoolData.data && schoolData.data.adminsArr.map(user => (
                        // TODO: click on user -> popup with more info?
                        <div className="flex justify-center p-4 font-bold rounded-md transition border border-transparent hover:border-gray-400" key={user._id}>
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

            <Modal isOpen={isAddAdmin} onRequestClose={() => setIsAddAdmin(false)}>
                <H2 className="mb-2">Add admin</H2>
                <p className="mb-4">Here is everyone that goes to {props.thisSchool.name}:</p>
                <Select 
                    isMulti
                    options={studentsData && studentsData.data && studentsData.data.map(s => ({
                        value: s._id,
                        label: s.name,
                    }))}
                    onChange={newSelectedOptions => setNewAdmins(newSelectedOptions.map(option => option.value))}
                    isDisabled={isLoading}
                    className="w-full"
                />
                {error && (
                    <p className="text-red-500">{error}</p>
                )}
                <div className="mt-96 mb-2"><HandwrittenButton onClick={onAddAdmin} py={3}>Add</HandwrittenButton></div>
            </Modal>
            <Modal isOpen={!!modalEvent} onRequestClose={() => setModalEvent(null)}>
                <div className="w-full flex justify-center">
                    {modalEvent && <EventCard event={modalEvent}/>}
                </div>
            </Modal>

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
        // return an unexpected error occured?
    }
};