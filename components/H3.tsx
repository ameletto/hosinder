const H3 = ({children, className = ""} : {children: string, className?: string}) => {
    return (
        <p className={`font-bold text-gray-700 ${className}`}>{children}</p>
    )
}

export default H3