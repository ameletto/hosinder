import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import HandwrittenButton from "./HandwrittenButton";
import Input from "./Input";
import Modal from "./Modal";

const CreateSchoolModal = ({isOpen, setIsOpen, userId, setSchoolId}: {
    isOpen: boolean,
    setIsOpen: Dispatch<SetStateAction<boolean>>,
    userId: string,
    setSchoolId: Dispatch<SetStateAction<string>>,
}) => {
    const [name, setName] = useState<string>("");
    const [description, setDescription ] = useState<string>("");
    const [image, setImage ] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>(null);
    const [isExec, setIsExec] = useState<boolean>(false);
    console.log(name, encodeURIComponent(name))

    function onSubmit() {
        setIsLoading(true);
        console.log("is submitting")

        axios.post("/api/school", {
            name: name,
            admin: [userId],
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
            onRequestClose={() => setIsOpen(false)}
        >
            <Input 
                type="text"
                name="Name"
                value={name}
                setValue={setName}
                placeholder="Garc Marneau Nerdlegiate Institute"
            />
            <Input 
                type="text"
                name="Description (optional)"
                value={description}
                setValue={setDescription}
                placeholder="Home to the HOSA champions"
            />
            <Input 
                type="text"
                name="Image URL (optional)"
                value={image}
                setValue={setImage}
                placeholder="https://upload.wikimedia.org/wikipedia/en/d/dc/MGCI_Emblem2.png"
            />
            <div className="my-2 py-2 flex items-center">
                <input type="checkbox" id="isExec" onChange={e => setIsExec(e.target.checked)} className="cursor-pointer"/>
                <label htmlFor="isExec" className="cursor-pointer ml-2">
                    I confirm I am a executive member of {name}'s HOSA chapter 
                    or have otherwise received permission to register {name} on HOSA Tinder.
                </label>
            </div>
            {error && (
                <p className="text-red-500">{error}</p>
            )}
            <HandwrittenButton
                isLoading={isLoading}
                onClick={onSubmit}
                disabled={isLoading || name.length === 0 || !isExec}
            >
                Create school!
            </HandwrittenButton>
        </Modal>
    )
}

export default CreateSchoolModal
