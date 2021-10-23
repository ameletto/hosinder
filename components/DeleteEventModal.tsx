import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import Select from "react-select";
import { DatedObj, EventObj } from "../utils/types";
import H3 from "./H3";
import HandwrittenButton from "./HandwrittenButton";
import Modal from "./Modal";

const DeleteEventModal = ({ isOpen, setIsOpen, schoolId, iter, setIter, eventData }: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    schoolId: string,
    iter: number,
    setIter: Dispatch<SetStateAction<number>>,
    eventData: DatedObj<EventObj>[],
}) => {
    const [name, setName] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    function onDelete() {
        axios.delete("/api/event", {
            data: {
                id: name,
            },
        }).then((res) => {
            setIsOpen(false);
            setIter(iter+1);
            console.log(res.data.message)
        }).catch(e => {
            console.log(e);
        });
    }

    return (
        <Modal 
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
        >
            <H3>Name of event</H3>
            <Select
                options={
                    (eventData) ? eventData.map(urdad => ({
                        value: urdad._id,
                        label: urdad.name,
                    })) : []
                }
                onChange={option => setName(option.value)}
                isDisabled={isLoading}
                className="w-full mt-4 mb-96"
                isSearchable={true}
            />
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <div className="my-4">
                <HandwrittenButton
                    // isLoading={isLoading}
                    onClick={onDelete}
                >
                    Delete event!
                </HandwrittenButton>
            </div>
        </Modal>
    )
}

export default DeleteEventModal
