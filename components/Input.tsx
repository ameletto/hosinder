import H3 from "./H3";

const Input = ({name, value, setValue, type="text", id="", placeholder="", onChange} : {
    name?: string,
    value: string,
    setValue?: any,
    onChange?: any, // you need one of setValue and onChange
    type?: "text"|"textarea"|"date",
    id?: string,
    placeholder?: string,
}) => {
    return (
        <div className="my-8">
            {name && <H3>{name}</H3>}
            {(type == "text" || type == "date") && <input
                type={type}
                className="border-b w-full content my-2 py-2"
                placeholder={placeholder}
                value={value}
                id={id}
                onChange={onChange ? onChange : e => setValue(e.target.value)}
            />}
            {type == "textarea" && <textarea
                className="border-b w-full content my-2 py-2 btm-text-gray-500"
                rows={7}
                placeholder={placeholder}
                value={value}
                id={id}
                onChange={onChange ? onChange : e => setValue(e.target.value)}
            />}
        </div>
    )
}

export default Input