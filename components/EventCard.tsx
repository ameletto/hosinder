import { DatedObj, EventObj, SchoolObj } from "../utils/types";

const EventCard = ({event} : {event: DatedObj<EventObj>}) => {
    return (
        <div className="max-w-7xl border-dashed border-black rounded-lg work-sans p-4" style={{borderWidth: 6}}>
            <p className="text-center text-5xl p-4 font-bold">{event.name}</p>
            <p className="text-center text-xl p-4">{event.description}</p>
            {event.labels.map(label => <p className="text-center text-xl p-4 border-blue-300 rounded-full">{label}</p>)}
        </div>
    )
}

export default EventCard