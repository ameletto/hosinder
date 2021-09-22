import { ReactNode, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import SpinnerButton from "./SpinnerButton";


const HandwrittenButton = ({onClick, children, disabled, arrowRightOnHover = true, isLoading, py=5} : {
    onClick: () => any,
    children: string | ReactNode, 
    disabled?: boolean,
    arrowRightOnHover?: boolean,
    isLoading?: boolean, 
    py?: number
}) => {
    const [isShown, setIsShown] = useState(false);
    // hover:bg-white border hover:border-transparent border-white  
    return (
        <div 
            onMouseEnter={() => setIsShown(true)}
            onMouseLeave={() => setIsShown(false)}
        >
            <SpinnerButton 
                disabled={disabled}
                className={`z-30 -my-5 py-${py} bg-scribble-hover`}
                onClick={onClick}
                isLoading={isLoading}
            >
                <div className="flex items-center">
                    <div className={(isShown && arrowRightOnHover) ? "mr-2" : ""}>{children}</div>
                    { isShown && arrowRightOnHover && <FaArrowRight/> } 
                    {/* {isShown && <img src="/scribble.png" width={150} className="relative left-0 mx-auto" style={{zIndex: -1}}/>} */}
                </div>
            </SpinnerButton>
        </div>
    )
}

export default HandwrittenButton