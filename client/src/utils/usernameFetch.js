import { serverURL } from "./constants"

export const checkUsername = async (body) => {
            try
            {
                const response = await fetch(serverURL, {
                    method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
                })
                const data = await response.json()
                return data
            }
            catch (error)
            {
                console.error(error)
            }
        }