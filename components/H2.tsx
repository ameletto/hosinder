const H2 = ({children, className = ""} : {children: string, className?: string}) => {
    return (
        <p className={`text-xl font-semibold text-gray-500 ${className}`}>{children}</p>
    )
}

export default H2