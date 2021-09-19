import { DatedObj, EventObj, SchoolObj } from "../utils/types";

const EventCard = ({event, wide=true} : {event: DatedObj<EventObj>, wide?: boolean}) => {
    return (
        <div className={`border-dashed border-black rounded-lg raleway p-4 bg-white ${wide ? "w-96 md:w-150" : "w-72"}`} style={{borderWidth: wide ? 6 : 4}}>
            <p className="text-center p-4 font-bold" style={{fontSize: wide ? 40 : 20}}>{event.name}</p>
            {event.image && <img src={event.image} alt={`Image of ${event.name}`}/>}
            <p className="text-center text-xl p-4">{event.description}</p>
            {event.labels.map(label => <p className="text-center p-2 text-sm m-2 border-2 border-blue-300 rounded-full">{label}</p>)}
        </div>
    )
}

export default EventCard