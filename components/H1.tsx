const H1 = ({children, className} : {
    children: string,
    className?: string,
}) => {
    return (
        <p className={`font-semibold raleway text-4xl text-center ${className}`}>{children}</p>
    )
}

export default H1