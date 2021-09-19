import { ReactNode, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import Button from "./Button";


const HandwrittenButton = ({onClick, children, disabled, arrowRightOnHover = true, isLoading} : {
    onClick: () => any,
    children: string | ReactNode, 
    disabled?: boolean,
    arrowRightOnHover?: boolean,
    isLoading?: boolean, 
}) => {
    const [isShown, setIsShown] = useState(false);
    // hover:bg-white border hover:border-transparent border-white  
    return (
        <div 
            className="relative inline-block"
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
        >
            <Button 
                disabled={disabled}
                className="z-30 -my-5 py-5 bg-scribble-hover"
                onClick={onClick}
            >
                <div className="flex items-center">
                    <div className={(isShown && arrowRightOnHover) ? "mr-2" : ""}>{children}</div>
                    { isShown && arrowRightOnHover && <FaArrowRight/> } 
                    {/* {isShown && <img src="/scribble.png" width={150} className="relative left-0 mx-auto" style={{zIndex: -1}}/>} */}
                </div>
            </Button>
            {isLoading && <div className="up-spinner"/>}
        </div>
    )
}

export default HandwrittenButton