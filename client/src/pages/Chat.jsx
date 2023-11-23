import React, { useEffect, useState, useRef } from "react";
import useSocket from "../hooks/useSocket"
import Input from "../components/Input";
import Button from "../components/Button";
import { renderMessages } from "../utils/renderMessages";
import { getCurrentTime } from "../../lib/TimeFunctions";
import { errorDuration, serverURL } from "../../lib/constants";
import ChatMenu from "../components/ChatMenu/ChatMenu";
import useError from "../hooks/useError";
import useToggle from "../hooks/useToggle";

export default function Chat({ username, currentRoom, setCurrentRoom }) {

    const socket = useSocket(serverURL)
    const errorMessage = useError(error)
    const [ error, setError ] = useState(null)
    const [ newRoom, setNewRoom ] = useState('')
    const [ message, setMessage ] = useState('')
    const [ currentConnections, setCurrentConnections ] = useState([])
    const [ receivedMessages, setReceivedMessages ] = useState([])
    const [ isMenuActive, toggleMenu ] = useToggle(false)
    const [ isRoomMenuActive, toggleRoomMenu ] = useToggle(false)
    const messageContainerRef = useRef()
    const shouldScrollRef = useRef(true)
    
    const sendMessage = () => {
        socket.emit('send-message', { room: currentRoom, message, sendTime: getCurrentTime() })
        setMessage('')
    }

    const handleMenuClick = () => {
        toggleMenu()
        if(isRoomMenuActive)
        {
            toggleRoomMenu()
        }
    }

    const handleMessageSubmit = e => {
        e.preventDefault()
        sendMessage()
        e.target.elements.message.value = ''
    }

    const handleRoomSubmit = e => {
        e.preventDefault()
        if(newRoom === currentRoom) 
        {
            setError('equal')
            e.target.elements.newroom.value = ''
            return
        }
        socket.emit('join-new-room', newRoom)
        setCurrentRoom(newRoom)
        toggleMenu()
        toggleRoomMenu()
    }
    
    //Function to evaluate if user scrolled to the bottom of MessageContainer
    const handleScroll = () => {
        shouldScrollRef.current = messageContainerRef.current.scrollTop === messageContainerRef.current.scrollHeight - messageContainerRef.current.clientHeight
    }
    

    //useEffects to fire before render
    useEffect(() => {
        if(socket)
        {
            socket.on('update-connections', connections => {
                setCurrentConnections(connections.map(([username, userID]) => ({ username: username, id: userID })))
            })
            
            socket.emit('join-room', currentRoom, username)
            
            socket.on('received-message', (data) => {
                const { username, message, sendTime } = data
                setReceivedMessages((prevMessages) => [...prevMessages, {username: username, message: message, sendTime: sendTime}])
            })
        }
        
    }, [socket])

    useEffect(() => {
        if(shouldScrollRef.current)
        {
            messageContainerRef.current.scrollTop = messageContainerRef.current.scrollHeight
        }
    }, [receivedMessages])

    useEffect(() => {
        setTimeout(() => {
            setError(null)
        }, errorDuration);
    }, [error])

    return (
        <>
            <div className="h-[98%] lg:w-[50%] lg:border lg:my-2 rounded-md">
                <div className="h-full flex flex-col relative">
                    <div className="h-[10%] bg-primary flex items-center justify-center text-clear-white relative">
                        <div className="absolute left-5">
                            <Button onClick={() => handleMenuClick()}>
                                <span className="material-symbols-outlined text-3xl">{isMenuActive ? 'close' : 'menu'}</span>
                            </Button>
                        </div>
                        <div>
                            <h1 className="text-3xl">Room: <span className="capitalize">{currentRoom}</span></h1>
                            <p className="text-xl">Currently Online: <span className="font-bold text-xl">{currentConnections.length}</span></p>
                        </div>
                    </div>
                    <ChatMenu 
                    className={'chat-menu absolute top-[10%] flex-col justify-center w-full h-32 z-10 md:w-60'} 
                    isMenuActive={isMenuActive} 
                    toggleMenu={toggleMenu}
                    isRoomMenuActive={isRoomMenuActive}
                    setIsRoomMenuActive={toggleRoomMenu}
                    setNewRoom={setNewRoom}
                    onSubmit={(e) => handleRoomSubmit(e)}
                    errorMessage={errorMessage}
                    />
                    <div className="h-[85%]">
                        <ul className="messages-display h-full flex flex-col overflow-y-scroll max-h-[100%]" ref={messageContainerRef} onScroll={() => handleScroll()}>
                            {
                                receivedMessages.map((obj, index) => {
                                    const { key, content } = renderMessages(obj, index, username);
                                    return React.cloneElement(content, { key });
                                })
                            }
                        </ul>
                    </div>
                    <div className="h-[3%] flex items-center justify-center w-full">
                        <form onSubmit={(e) => handleMessageSubmit(e)} className="flex w-full px-2">
                            <div className="w-[90%]">
                                <Input placeholder={'Message'} name={'message'} id={'message'} onChange={(e) => setMessage(e.target.value)} type={'text'} autoComplete={'off'}/>
                            </div>
                            <div className="w-[10%] flex items-center justify-center">
                                <Button 
                                className={`ml-2 h-10 w-16 md:w-20 xl:w-32 rounded-md bg-primary outline-accent text-clear-white flex items-center justify-center ${message ? 'cursor-pointer' : 'cursor-not-allowed'}`} 
                                disabled={message ? false : true}
                                >
                                <span className="material-symbols-outlined">send</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}