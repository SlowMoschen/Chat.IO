export default function Button({ onClick, children, className, disabled }) {
    return (
        <button 
        onClick={onClick} 
        className={className + ' hover:scale-105'}
        disabled={disabled}
        >
            {children}
        </button>
    )
}