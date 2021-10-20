import Link from "next/link";
import { ReactNode } from "react";

interface ButtonPropsBase {
    children: ReactNode,
    className?: string,
    disabled?: boolean,
}

interface ButtonPropsLink extends ButtonPropsBase {
    href: string,
    onClick?: never,
}

interface ButtonPropsButton extends ButtonPropsBase {
    href?: never,
    onClick: () => any,
}

type ButtonProps = ButtonPropsLink | ButtonPropsButton;

export default function Button({children, href, onClick, className, disabled}: ButtonProps) {
    const classNames = "disabled:opacity-25 disabled:cursor-not-allowed hover:text-black p-4 " + className;

    return href ? (
        <Link href={href}>
            <div className={classNames + " cursor-pointer"}>{children}</div>
        </Link>
    ) : (
        <button className={classNames} onClick={onClick} disabled={disabled}>{children}</button>
    );
}