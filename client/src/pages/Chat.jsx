import React, { useEffect, useState, useRef } from "react";
import useSocket from "../hooks/useSocket"
import Input from "../components/Input";
import Button from "../components/Button";
import { renderMessages } from "../utils/renderMessages";
import { getCurrentTime } from "../../lib/TimeFunctions";
import ChatMenu from "../components/ChatMenu/ChatMenu";

export default function Chat({ username, room }) {

    const socket = useSocket('http://localhost:3001')
    const [ currentConnections, setCurrentConnections ] = useState([])
    const [ message, setMessage ] = useState('')
    const [ receivedMessages, setReceivedMessages ] = useState([])
    const [ isMenuActive, setIsMenuActive ] = useState(false)
    const [ isRoomMenuActive, setIsRoomMenuActive ] = useState(false)
    const messageContainerRef = useRef()
    const shouldScrollRef = useRef(true)
    
    const sendMessage = () => {
        socket.emit('send-message', { room: room, message, sendTime: getCurrentTime() })
        setMessage('')
    }

    const handleSubmit = e => {
        e.preventDefault()
        sendMessage()
        e.target.elements.message.value = ''
    }
    
    const handleScroll = () => {
        shouldScrollRef.current = messageContainerRef.current.scrollTop === messageContainerRef.current.scrollHeight - messageContainerRef.current.clientHeight
    }
    
    useEffect(() => {
        if(socket)
        {
            socket.on('update-connections', connections => {
                setCurrentConnections(connections.map(([username, userID]) => ({ username: username, id: userID })))
            })
            
            socket.emit('join-room', room, username)
            
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

    return (
        <>
            <div className="h-[98%] lg:w-[50%] lg:border lg:my-2 rounded-md">
                <div className="h-full flex flex-col relative">
                    <div className="h-[10%] bg-primary flex items-center justify-center text-clear-white relative">
                        <div className="absolute left-5">
                            <Button onClick={() => {
                                setIsMenuActive(!isMenuActive)
                                setIsRoomMenuActive(false)
                                }}>
                                <span className="material-symbols-outlined text-3xl">{isMenuActive ? 'close' : 'menu'}</span>
                            </Button>
                        </div>
                        <div>
                            <h1 className="text-3xl">Room: <span className="capitalize">{room}</span></h1>
                            <p className="text-xl">Currently Online: <span className="font-bold text-xl">{currentConnections.length}</span></p>
                        </div>
                    </div>
                    <ChatMenu 
                    className={'chat-menu absolute top-[10%] flex-col justify-center w-full h-32 z-10 md:w-60'} 
                    isMenuActive={isMenuActive} 
                    setIsMenuActive={setIsMenuActive}
                    isRoomMenuActive={isRoomMenuActive}
                    setIsRoomMenuActive={setIsRoomMenuActive}
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
                        <form onSubmit={(e) => handleSubmit(e)} className="flex w-full px-2">
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