import axios from "axios";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import Select from "react-select";
import { DatedObj, EventObj } from "../utils/types";
import { globalLabels } from "./EventCard";
import H3 from "./H3";
import HandwrittenButton from "./HandwrittenButton";
import Input from "./Input";
import Modal from "./Modal";

const EditEventModal = ({isOpen, setIsOpen, allEvents, iter, setIter}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    allEvents?: DatedObj<EventObj>[],
    iter: number,
    setIter: Dispatch<SetStateAction<number>>,
}) => {
    const [eventID, setEventID] = useState<string>(); 
    const [name, setName] = useState<string>("");
    const [description, setDescription ] = useState<string>("");
    const [image, setImage ] = useState<string>("");
    const [labels, setLabels] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    useEffect(() => {
        const event = allEvents.find(e => e._id === eventID)
        if (event) {
            setName(event.name);
            setDescription(event.description)
            setImage(event.image || "")
            setLabels(event.labels || [])
        } 
    }, [eventID])

    function onSubmit() {
        setIsLoading(true);
        console.log("is submitting")

        axios.post("/api/event", {
            id: eventID,
            name: name,
            description: description,
            image: image,
            labels: labels,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                console.log(res.data.error)
                setIsLoading(false);
            } else {
                console.log(res.data);
                setIter(iter + 1);
                setIsLoading(false);

                // Reset
                setName("");
                setDescription("");
                setImage("");
                setLabels([]);
                setIsOpen(false);
                setEventID("");
            }
        }).catch(e => {
            setIsLoading(false);
            setError("An unknown error occurred.");
            console.log(e);
        });
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => {
                setIsOpen(false)
                // Reset
                setName("");
                setDescription("");
                setImage("");
                setLabels([]);
                setEventID("");
            }}
        >
            <Select 
                options={allEvents && allEvents && allEvents.map(s => ({
                    value: s._id,
                    label: s.name,
                }))}
                onChange={option => setEventID(option.value)}
                isDisabled={!allEvents}
                className="w-full"
                isSearchable={true}
            />
            {!!eventID ? (
                <>
                <Input 
                    type="text"
                    name="Name"
                    value={name}
                    setValue={setName}
                    placeholder="HOSA Bowl"
                />            
                <H3>Tags (optional)</H3>
                <Select
                    isMulti
                    options = {Object.keys(globalLabels).map(k => ({value: k, label: globalLabels[k]}))}
                    onChange={newSelectedOptions => setLabels(newSelectedOptions.map(option => option.value))}
                    isDisabled={isLoading}
                    // value={labels}
                />
                <Input 
                    type="textarea"
                    name="Description (optional)"
                    value={description}
                    setValue={setDescription}
                    placeholder="Unfortunately, this is not a bowl of HOSA swag."
                />
                <p className="text-gray-400 text-sm -mt-8">
                    You can use markdown like **bold**, *italic*, [link text](https://your-url.com/), and ~~strikethrough~~. <a href="https://www.markdownguide.org/basic-syntax/" className="underline">Full markdown guide</a>
                </p>
                <Input 
                    type="text"
                    name="Image URL (optional)"
                    value={image}
                    setValue={setImage}
                    placeholder="https://upload.wikimedia.org/wikipedia/en/d/dc/MGCI_Emblem2.png"
                />
                </>
            ) : <div className="mt-96"></div>}
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <div className="my-4">
                <HandwrittenButton
                    // isLoading={isLoading}
                    onClick={onSubmit}
                    disabled={isLoading || name.length === 0 || description.length === 0}
                >
                    Save
                </HandwrittenButton>
            </div>
        </Modal>
    )
}

export default EditEventModal
