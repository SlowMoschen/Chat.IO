import { useEffect, useState } from "react";
import { timers } from "../../lib/constants";

const useError = (error) => {
    const [ errorMessage, setErrorMessage ] = useState(null)

    useEffect(() => {
        if(error)
        {
            switch(error)
            {
                case 'empty':
                    setErrorMessage('Cannot be empty')
                    break
                case 'taken':
                    setErrorMessage('Username already taken')
                    break
                case 'equal':
                    setErrorMessage('Already joined')
                    break
                case 'exist':
                    setErrorMessage('Username exists in Room')
                    break
                default:
                    setErrorMessage('An error occurred')
            }
        }

        const timer = setTimeout(() => {
            setErrorMessage(null)
        }, timers.errorDuration);

        return () => clearTimeout(timer)
    }, [error])


    return errorMessage
}

export default useError