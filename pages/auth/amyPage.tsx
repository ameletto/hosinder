import AmyComponent from "../../components/AmyComponent";

export default function yes(){
    const whoAmyLikes=["emma", "miranda", "laura"]
    return(
        
        whoAmyLikes.map(person => (
            <AmyComponent person={person}/>
        ))
    )
}



