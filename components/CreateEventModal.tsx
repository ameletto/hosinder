import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
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
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    console.log(name, encodeURIComponent(name))

    function onSubmit() {
        setIsLoading(true);
        console.log("is submitting")

        axios.post("/api/event", {
            name: name,
            school: schoolId,
            description: description,
            image: image,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                console.log(res.data.error)
                setIsLoading(false);
            } else {
                console.log(res.data);
                setIter(iter + 1);
                setIsOpen(false);
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
            setIsOpen={setIsOpen}
        >
            <Input 
                type="text"
                name="Name"
                value={name}
                setValue={setName}
                placeholder="HOSA Bowl"
            />
            <Input 
                type="text"
                name="Description (optional)"
                value={description}
                setValue={setDescription}
                placeholder="Unfortunately, this is not a bowl of HOSA swag."
            />
            <Input 
                type="text"
                name="Image URL (optional)"
                value={image}
                setValue={setImage}
                placeholder="https://upload.wikimedia.org/wikipedia/en/d/dc/MGCI_Emblem2.png"
            />
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <HandwrittenButton
                // isLoading={isLoading}
                onClick={onSubmit}
                disabled={isLoading || name.length === 0}
            >
                Create school!
            </HandwrittenButton>
        </Modal>
    )
}

export default CreateEventModal
