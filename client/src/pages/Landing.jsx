import { useNavigate } from "react-router-dom"
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'
import { useEffect, useState } from "react"
import useError from "../hooks/useError"
import { errorDuration } from "../../lib/constants"

export default function Landing({ setUsername, setRoom }) {

    const redirect = useNavigate()
    const [ error, setError ] = useState(null)
    const errorMessage = useError(error)

    const handleSubmit = async e => {
        e.preventDefault()
        const inputs = e.target.elements
        const username = inputs.username.value.trim()
        const room = inputs.room.value !== '' ? inputs.room.value.trim().toLowerCase() : 'global'
        let usernameTaken

        const checkUsername = async (username) => {
            try
            {
                const response = await fetch('http://localhost:3001', {
                    method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, room: room})
                })
                const data = await response.json()
                usernameTaken = data
            }
            catch (error)
            {
                console.error(error)
            }
        }
        await checkUsername(username.toLowerCase())

        if(usernameTaken)
        {
            setError('taken')
            inputs.username.value = ''
            return
        }
        
        if(inputs.username.value === '')
        {
            setError('empty')
            return
        }
        
        setUsername(username)
        setRoom(room)
        redirect('/chat')
        return
    }

    useEffect(() => {
        setTimeout(() => {
            setError(null)
        }, errorDuration);
    }, [error])


    return (
        <>
            <div className="bg-background flex-col flex items-center justify-center h-full px-2">
                <div>
                    <Logo className={'w-80'}/>
                </div>
                <div className="text-center mt-8">
                    <p className="text-xl">
                        Enter a <span className="font-semibold">custom Room name</span> to join a private Chatroom, 
                        <br/> or leave it empty to join the Globalchat.
                    </p>
                </div>
                <div className="mt-5 mb-3 w-4/5 max-w-md">
                    <form onSubmit={(e) => handleSubmit(e) }>
                        <Input type={'text'} placeholder={'Username'} name={'username'} id={'username'} errorMessage={errorMessage}/>
                        <Input type={'text'} placeholder={'Room'} name={'room'} id={'room'}/>
                        <Button className={'bg-accent w-full h-11 py-2 text-2xl font-bold rounded-md mt-2 outline-primary'}>Join</Button>
                    </form>
                </div>
            </div>
        </>
    )
}