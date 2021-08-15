import { useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "./Button";


const HandwrittenButton = ({onClick, children, href, disabled} : {
    onClick?: any,
    children: any, // string or JSX tags
    href?: string,
    disabled?: boolean,
}) => {
    const [isShown, setIsShown] = useState(false);
    // hover:bg-white border hover:border-transparent border-white  
    return (
        <div 
            className = "opacity-70 hover:text-black mb-2" 
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
        >
            <Button 
                disabled={disabled}
                className="z-30 opacity-70 -my-5 py-5 bg-scribble-hover"
                onClick={onClick}
            >
                <>
                <p className="text-2xl mr-2">{children}</p> 
                { isShown && <FaArrowRight /> } 
                {/* {isShown && <img src="/scribble.png" width={150} className="relative left-0 mx-auto" style={{zIndex: -1}}/>} */}
                </>
            </Button>
        </div>
    )
}

export default HandwrittenButton