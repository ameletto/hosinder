import axios from "axios";
import React, { Dispatch, SetStateAction, useState } from "react";
import HandwrittenButton from "./HandwrittenButton";
import Input from "./Input";
import Modal from "./Modal";
import Select from "react-select";
import H3 from "./H3";

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
            <H3>Tags (optional)</H3>
            <Select
                isMulti
                options = {[
                    {
                        label: "Individual",
                        value: "individual"
                    },
                    {
                        label: "Team",
                        value: "team"
                    },
                    {
                        label: "Knowledge test",
                        value: "KT"
                    },
                    {
                        label: "Skill performance",
                        value: "skill"
                    },
                ]}
                onChange={newSelectedOptions => setLabels(newSelectedOptions.map(option => option.value))}
                isDisabled={isLoading}
                className="w-full my-2 py-2"
            />
            <Input 
                type="textarea"
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
            <div className="my-4">
                <HandwrittenButton
                    // isLoading={isLoading}
                    onClick={onSubmit}
                    disabled={isLoading || name.length === 0}
                >
                    Create event!
                </HandwrittenButton>
            </div>
        </Modal>
    )
}

export default CreateEventModal
