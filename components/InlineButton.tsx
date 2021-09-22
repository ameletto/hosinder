import Link from "next/link";
import { ReactNode } from "react";

const InlineButton = ({onClick, children, href, isDisabled, className} : {
    onClick?: any,
    children: string | ReactNode,
    href?: string,
    isDisabled?: boolean,
    className?: string,
}) => {
    return (
        <button
            disabled={isDisabled}
            className={`text-gray-500 rounded-md px-2 py-1 text-sm transition font-bold hover:bg-black hover:bg-gray-100 focus:outline-none disabled:cursor-not-allowed ${className && className}`}
            onClick={onClick}
        >
            {href ? (
                <Link href={href}>
                    {children}
                </Link>
            ) : (
                    <div className="flex items-center">
                        {children}
                    </div>
                )}
        </button>
    )
}

export default InlineButton