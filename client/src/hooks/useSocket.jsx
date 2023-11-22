import { useEffect, useState } from "react";
import { io } from 'socket.io-client'

const useSocket = serverUrl => {
    const [ socket, setSocket ] = useState(null)

    useEffect(() => {
        const newSocket = io(serverUrl)

        newSocket.on('connect', () => {
            console.log(`Socket: ${newSocket.id} connected`)
        })
        
        newSocket.on('disconnect', () => {
            setSocket(null)
            console.log('Socket Disconnected')
        })
        
        setSocket(newSocket)
        
        return () => {
            newSocket.disconnect()
        }
    }, [])

    return socket
}

export default useSocket