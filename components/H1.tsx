const H1 = ({children, className} : {
    children: string,
    className?: string,
}) => {
    return (
        <h1 className={`text-4xl font-bold ${className && className}`}>{children}</h1>
    )
}

export default H1