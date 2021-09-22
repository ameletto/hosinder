const CuteGradientCircle = ({className, style} : {className: string, style?}) => {
    return (
        <div 
            className={`rounded-full ${className}`} 
            style={{ 
                background: "radial-gradient(rgba(183,225,252,1) 30%, rgba(212,208,254,0.5) 60%, rgba(255,255,255,0) 100%)", 
                zIndex: -10,
                ...style,
            }}
        />
    )
}

export default CuteGradientCircle
