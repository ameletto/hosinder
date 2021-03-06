import Parser from "html-react-parser";
import showdown from "showdown";
import showdownHtmlEscape from "showdown-htmlescape";
import { DatedObj, EventObj } from "../utils/types";

export const globalLabels = {
    // Maps database value to displayed value.
    KT: "Knowledge test",
    skill: "Skill performance (roleplay)",
    submission: "Submission (prepared in advance)",
    individual: "Individual",
    team: "Team",
} 

const EventCard = ({event, wide=true, short=false} : {event: DatedObj<EventObj>, wide?: boolean, short?: boolean}) => {
    const markdownConverter = new showdown.Converter({
        strikethrough: true,
        tasklists: true,
        tables: true,
        simpleLineBreaks: true,
        emoji: true,
        extensions: [showdownHtmlEscape],
    });
    return (
        <div className={`border-dashed border-black rounded-lg raleway p-4 bg-white ${wide ? "w-96 md:w-150" : `w-72 overflow-y-hidden overflow-x-hidden ${short ? "h-36" : "h-96"}`}`} style={{borderWidth: wide ? 6 : 4}}>
            <p className="text-center mx-4 mt-4 font-bold" style={{fontSize: wide ? 40 : 20}}>{event.name}</p>
            <div className="flex">
                {event.labels && event.labels.map((label, index) => <p 
                    key={label} 
                    className={`text-center p-2 text-sm m-2 border-2 rounded-full ${index % 2 === 0 ? "border-primary" : "border-secondary"}`}
                >
                    {globalLabels[label]}
                </p>)}
            </div>
            {event.image && <img src={event.image} alt={`Image of ${event.name}`} className="mx-auto"/>}
            {event.description && <div className={`prose p-4 raleway ${wide && "text-xl"}`}>{Parser(markdownConverter.makeHtml(event.description))}</div>}
        </div>
    )
}

export default EventCard