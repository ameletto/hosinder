import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import HandwrittenButton from "./HandwrittenButton";
import Modal from "./Modal";

const CreateSchoolModal = ({isOpen, setIsOpen, userId, setSchoolId}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    userId?: string,
    setSchoolId: Dispatch<SetStateAction<string>>,
}) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription ] = useState<string>("");
    const [image, setImage ] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);

    function onSubmit() {
        setIsLoading(true);
        console.log("is submitting")

        axios.post("/api/school", {
            name: name,
            admin: [userId || ""],
            description: description,
            image: image,
        }).then(res => {
            if (res.data.error) {
                setError(res.data.error);
                console.log(res.data.error)
                setIsLoading(false);
            } else {
                console.log(res.data);
                setSchoolId(res.data.id);
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
            <input 
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
            />
            <input 
                type="text"
                value={description}
                onChange={e => setDescription(e.target.value)}
            />
            <input 
                type="text"
                value={image}
                onChange={e => setImage(e.target.value)}
            />
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            {/* I confirm I am an exec. */}
            <HandwrittenButton
                // isLoading={isLoading}
                onClick={onSubmit}
                disabled={isLoading || name !== encodeURIComponent(name) || name.length === 0}
            >
                Create school!
            </HandwrittenButton>
        </Modal>
    )
}

export default CreateSchoolModal
