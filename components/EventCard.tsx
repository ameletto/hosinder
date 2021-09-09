import { DatedObj, EventObj, SchoolObj } from "../utils/types";

const EventCard = ({index, eventData} : {index: number, eventData: {data: DatedObj<EventObj>}}) => {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="max-w-7xl border-dashed border-8 border-black rounded-lg work-sans">
                <p className="flex items-center justify-center text-5xl p-4">{eventData.data[index].name}</p>
                <p className="flex items-center justify-center text-xl p-4">{eventData.data[index].description}</p>
                <p className="flex items-center justify-center text-xl p-4">{eventData.data[index].labels}</p>
            </div>
        </div>
    )
}

export default EventCard