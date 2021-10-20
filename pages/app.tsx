import axios from "axios";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/client";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  DragDropContext, Draggable, Droppable
} from "react-beautiful-dnd";
import useSWR, { SWRResponse } from "swr";
import Button from "../components/Button";
import Container from "../components/Container";
import EventCard from "../components/EventCard";
import H1 from "../components/H1";
import { UserModel } from "../models/User";
import cleanForJSON from "../utils/cleanForJSON";
import dbConnect from "../utils/dbConnect";
import fetcher from "../utils/fetcher";
import { DatedObj, EventObj, UserObj } from "../utils/types";

const getListStyle = (isDraggingOver) => ({
  background: isDraggingOver ? "radial-gradient(#B7E1FC, #ffffff)" : "white",
});

export default function App(props: { thisUser: DatedObj<UserObj> }) {
  // fetch and map all the event cards assoc with this school.
  // based on labels, decide on an order to show them.
  const {
    data: eventData,
    error: eventError,
  }: SWRResponse<{ data: DatedObj<EventObj>[] }, any> = useSWR(
    `/api/event?school=${props.thisUser.school || "61216845561457369cdd35ae"}`,
    fetcher
  );
  const [i, setI] = useState<number>(
    props.thisUser.notWantedEvents.length + props.thisUser.preferredEvents.length || 0
  );
  const [isPaused, setIsPaused] = useState<boolean>(false);
  useEffect(() => {
    if (i > 0 && i % 10 == 0) setIsPaused(true);
  }, [i]);

  function onAccept(eventId: string) {
    axios
      .post("/api/user", {
        preferredEvents: [
          ...props.thisUser.preferredEvents.filter((e) => e !== eventId),
          eventId,
        ],
        notWantedEvents: props.thisUser.preferredEvents.filter((e) => e !== eventId),
      })
      .then((res) => {
        if (res.data.error) console.log("you are a failure ", res.data.error);
        else {
          props.thisUser.preferredEvents = res.data.user.preferredEvents;
          props.thisUser.notWantedEvents = res.data.user.notWantedEvents;
          setI(i + 1);
        }
      })
      .catch((e) => console.log(e));
  }

  function onReject(eventId: string) {
    axios
      .post("/api/user", {
        preferredEvents: props.thisUser.preferredEvents.filter((e) => e !== eventId),
        notWantedEvents: [
          ...props.thisUser.notWantedEvents.filter((e) => e !== eventId),
          eventId,
        ],
      })
      .then((res) => {
        if (res.data.error) console.log("you are a failure ", res.data.error);
        else {
          props.thisUser.preferredEvents = res.data.user.preferredEvents;
          props.thisUser.notWantedEvents = res.data.user.notWantedEvents;
          setI(i + 1);
        }
      })
      .catch((e) => console.log(e));
  }

  return (
    <Container width="7xl">
      <div className="mb-12">
        <H1>
          {eventData && eventData.data.length <= i
            ? "Congratulations! You have went through all events 🎉"
            : "Start matching"}
        </H1>
        <div className="flex justify-center">
          <div
            className="-mt-3 ml-10 border-secondary"
            style={{ borderBottomWidth: 10, width: 270, zIndex: -1 }}
          ></div>
        </div>
      </div>
      <img
        src="/heart.png"
        alt="Black heart"
        className="hidden sm:block h-16 absolute left-10 top-24"
      />
      <img
        src="/heart.png"
        alt="Black heart"
        className="hidden sm:block h-16 absolute right-10 top-24"
      />
      {eventData ? (
        isPaused ? (
          <>
            <p className="text-center text-lg">
              You have went through {i} out of {eventData.data.length} events.
            </p>
            <Checkpoint>
              <Button
                href="/dashboard"
                className="hover:bg-primary flex flex-col items-center justify-center"
              >
                <p className="mb-4 text-gray-500 text-lg">
                  Think you found your perfect event?
                </p>
                <p className="border-2 border-gray-700 text-gray-700 rounded-3xl p-8">
                  See matches
                </p>
              </Button>
              <Button
                onClick={() => setIsPaused(false)}
                className="hover:bg-primary flex flex-col items-center justify-center"
              >
                <p className="mb-4 text-gray-500 text-lg">
                  Want to explore more events?
                </p>
                <p className="border-2 border-black rounded-3xl p-8">
                  Continue matching
                </p>
              </Button>
            </Checkpoint>
          </>
        ) : eventData.data.length > i ? (
          <>
          <div className="flex gap-14 items-center justify-center">
            <DragDropContext
              onDragEnd={function (result) {
                // dropped outside the 3 draggables
                if (!result.destination) return;
                if (result["destination"]["droppableId"] == "frown") {
                  onReject(eventData.data[i]._id);
                } else if (result["destination"]["droppableId"] == "smile") {
                  onAccept(eventData.data[i]._id);
                }
              }}
            >
              <Droppable droppableId="frown">
                {(provided, urmom) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(urmom.isDraggingOver)}
                    {...provided.droppableProps}
                    className="mt-4"
                  >
                    <Button onClick={() => onReject(eventData.data[i]._id)}>
                      <img src="/frown.png" className="mx-auto"></img>
                      <p className="font-semibold text-center">
                        not interested - swipe left
                      </p>
                    </Button>
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="eventCard">
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className="mt-4"
                  >
                    <Draggable key={"ur mom"} draggableId={"ur mom"} index={0}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <EventCard event={eventData.data[i]} />
                        </div>
                      )}
                    </Draggable>
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <Droppable droppableId="smile">
                {(provided, urdad) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(urdad.isDraggingOver)}
                    {...provided.droppableProps}
                    className="mt-4"
                  >
                    <Button onClick={() => onAccept(eventData.data[i]._id)}>
                      <img src="/smile.png" className="mx-auto"></img>
                      <p className="font-semibold text-center">
                        interested - swipe right
                      </p>
                    </Button>
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
          <p className="text-center mt-12 text-sm text-gray-400">Think you found your perfect event? <a className="underline transition hover:primary"><Link href="/dashboard">See your events.</Link></a></p>
          </>
        ) : (
          <Checkpoint>
            <Button
              href="/dashboard"
              className="hover:bg-primary flex items-center justify-center"
            >
              <p className="border-2 border-gray-700 text-gray-700 rounded-3xl p-8">
                See matches
              </p>
            </Button>
            <Button
              onClick={() => setI(0)}
              className="hover:bg-primary flex items-center justify-center"
            >
              <p className="border-2 border-black rounded-3xl p-8">
                Go through all events again
              </p>
            </Button>
          </Checkpoint>
        )
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
}

function Checkpoint({ children }) {
  return (
    <div
      className="md:absolute top-0 left-0 w-screen h-screen grid md:grid-cols-2 text-xl"
      style={{ zIndex: -20 }}
    >
      {children}
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = await getSession(context);

  if (!session) return { redirect: { permanent: false, destination: "/" } };

  try {
    await dbConnect();
    const thisUser = await UserModel.findOne({ email: session.user.email });
    // const thisSchool = thisUser.school ? await SchoolModel.findOne({ _id: thisUser.school }) : await SchoolModel.findOne({ name: 'Marc Garneau Collegiate Institute' })
    return thisUser
      ? { props: { thisUser: cleanForJSON(thisUser) } }
      : { redirect: { permanent: false, destination: "/auth/welcome" } };
  } catch (e) {
    console.log(e);
    return { notFound: true };
  }
};
