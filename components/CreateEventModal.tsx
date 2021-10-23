import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import Select from "react-select";
import { globalLabels } from "./EventCard";
import H3 from "./H3";
import HandwrittenButton from "./HandwrittenButton";
import Input from "./Input";
import Modal from "./Modal";

const CreateEventModal = ({isOpen, setIsOpen, schoolId, iter, setIter}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    schoolId: string,
    iter: number,
    setIter: Dispatch<SetStateAction<number>>,
}) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription ] = useState<string>("");
    const [image, setImage ] = useState<string>("");
    const [labels, setLabels] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    function onSubmit() {
        setIsLoading(true);
        console.log("is submitting")

        axios.post("/api/event", {
            name: name,
            school: schoolId,
            description: description,
            image: image,
            labels: labels,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                console.log(res.data.error)
            } else {
                console.log(res.data);
                setIter(iter + 1);

                // Reset
                setName("");
                setDescription("");
                setImage("");
                setLabels([]);
                setIsOpen(false);
            }
        }).catch(e => {
            setError("An unknown error occurred.");
            console.log(e);
        }).finally(() => setIsLoading(false));
    }

    return (
        <Modal
            isOpen={isOpen}
            onRequestClose={() => setIsOpen(false)}
        >
            <EventForm 
                name={name}
                setName={setName}
                description={description}
                setDescription={setDescription}
                image={image}
                setImage={setImage}
                labels={labels}
                setLabels={setLabels}
                isLoading={isLoading}
            />
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <div className="my-4">
                <HandwrittenButton
                    // isLoading={isLoading}
                    onClick={onSubmit}
                    disabled={isLoading || name.length === 0 || description.length === 0}
                >
                    Create event!
                </HandwrittenButton>
            </div>
        </Modal>
    )
}

export default CreateEventModal

export const EventForm = ({name, setName, labels, setLabels, description, setDescription, image, setImage, isLoading} : {
    name: string,
    setName: Dispatch<SetStateAction<string>>,
    labels: string[],
    setLabels: Dispatch<SetStateAction<string[]>>,
    description: string,
    setDescription: Dispatch<SetStateAction<string>>,
    image: string,
    setImage: Dispatch<SetStateAction<string>>,
    isLoading: boolean
}) => {
    // so we don't have to repeat code across CreateEventModal and EditEventModal.
    return (
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
            value={labels.map(k => ({value: k, label: globalLabels[k]}))}
        />
        <Input 
            type="textarea"
            name="Description"
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
    )
}