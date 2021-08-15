import Button from "./Button";
import {ReactNode} from "react";

interface SpinnerButtonPropsBase {
    children: ReactNode,
    isLoading: boolean,
    className?: string,
    disabled?: boolean,
}

interface SpinnerButtonPropsLink extends SpinnerButtonPropsBase {
    href: string,
    onClick?: never,
}

interface SpinnerButtonPropsButton extends SpinnerButtonPropsBase {
    href?: never,
    onClick: () => any,
}

type SpinnerButtonProps = SpinnerButtonPropsLink | SpinnerButtonPropsButton;

export default function SpinnerButton({children, href, onClick, className, isLoading, disabled}: SpinnerButtonProps){
    return (
        <div className="relative inline-block">
            {href ? (
                <Button href={href} className={className} disabled={disabled || isLoading}>
                    <div className={isLoading ? "invisible" : ""}>
                        {children}
                    </div>
                </Button>
            ) : (
                <Button onClick={onClick} className={className} disabled={disabled || isLoading}>
                    <div className={isLoading ? "invisible" : ""}>
                        {children}
                    </div>
                </Button>
            )}
            {isLoading && <div className="up-spinner"/>}
        </div>
    )
}