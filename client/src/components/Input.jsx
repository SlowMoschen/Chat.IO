export default function Input({ placeholder, type, name, id, errorMessage, onChange, autoComplete, onBlur}) {
    const inputClasses = errorMessage ? 'border border-red w-full pl-2 h-10 rounded-md outline-accent' : "border border-accent/[.4] w-full pl-2 h-10 rounded-md outline-accent"

    return (
        <>
            <div className="flex flex-col w-full my-2 relative">
                {/* <label className="text-xl font-bold">{label}</label> */}
                <input type={type} name={name} id={id} className={inputClasses} placeholder={placeholder} onChange={onChange} autoComplete={autoComplete} onBlur={onBlur}/>
                <div className="absolute right-2 top-2 text-red font-bold">{errorMessage}</div>
            </div>
        </>
    )
}