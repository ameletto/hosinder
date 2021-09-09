const H1 = ({children, className} : {
    children: string,
    className?: string,
}) => {
    return (
        <p className={`text-2xl font-semibold text-gray-700 ${className}`}>{children}</p>
    )
}

export default H1