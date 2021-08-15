import {ReactNode} from "react";
import Link from "next/link";

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
    const classNames = " " + className;

    return href ? (
        <Link href={href}>
            <a className={classNames}>{children}</a>
        </Link>
    ) : (
        <button className={classNames} onClick={onClick} disabled={disabled}>{children}</button>
    );
}