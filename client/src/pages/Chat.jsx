import React, { useEffect, useState, useRef } from "react";
import useSocket from "../hooks/useSocket"
import Input from "../components/Input";
import Button from "../components/Button";
import { renderMessages } from "../utils/renderMessages";
import { getCurrentTime } from "../../lib/TimeFunctions";
import { timers, serverURL } from "../../lib/constants";
import ChatMenu from "../components/ChatMenu/ChatMenu";
import useError from "../hooks/useError";
import useToggle from "../hooks/useToggle";
import useScrollHandler from "../hooks/useScrollHandler";

export default function Chat({ username, currentRoom, setCurrentRoom }) {

    const socket = useSocket(serverURL)
    const [ error, setError ] = useState(null)
    const errorMessage = useError(error)
    const [ newRoom, setNewRoom ] = useState('')
    const [ message, setMessage ] = useState('')
    const [ currentConnections, setCurrentConnections ] = useState([])
    const [ receivedMessages, setReceivedMessages ] = useState([])
    const [ isMenuActive, toggleMenu ] = useToggle(false)
    const [ isRoomMenuActive, toggleRoomMenu ] = useToggle(false)
    const [ isTyping, setIsTyping ] = useState(false)
    const [ typingUser, setTypingUser ] = useState([])
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

    const handleRoomSubmit = async e => {
        e.preventDefault()
        let isTaken
        
        if(newRoom === currentRoom) 
        {
            setError('equal')
            e.target.elements.newroom.value = ''
            return
        }

        const checkForUsername = async () => {
            try
            {
                const response = await fetch(serverURL, {
                    method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username: username, room: newRoom})
                })
                const data = await response.json()
                isTaken = data
            }
            catch (error)
            {
                console.error(error)
            }
        }
        await checkForUsername()
        
        if(isTaken)
        {
            setError('exist')
            return
        }
        socket.emit('join-new-room', newRoom)
        setCurrentRoom(newRoom)
        toggleMenu()
        toggleRoomMenu()
    }

    const handleInputChange = e => {
        setMessage(e.target.value)
        setIsTyping(true)
        
        // Only emit once to server
        if(!isTyping)
        {
            socket.emit('start-typing')
        }

        setTimeout(() => {
            setIsTyping(false)
            if(isTyping)
            {
                socket.emit('stoped-typing')
            }
        }, timers.isTypingDuration);
    }
    
    //Hook to scroll always to bottom of MessageContainer unless user scrolls up
    const handleScroll = useScrollHandler(messageContainerRef, shouldScrollRef, receivedMessages)
    
    //useEffects to fire before render
    useEffect(() => {
        if(socket)
        {
            socket.on('update-connections', connections => {
                setCurrentConnections(connections.map(([username, userID]) => ({ username: username, id: userID })))
            })
            
            socket.emit('join-room', currentRoom, username)
            
            socket.on('received-message', (data) => {
                const { username, message, sendTime, room } = data
                setReceivedMessages((prevMessages) => [...prevMessages, {username: username, message: message, sendTime: sendTime, room: room}])
            })

            socket.on('user-started-typing', (username) => {
                setTypingUser((prevUsers) => [...prevUsers, username])
            })

            socket.on('user-stoped-typing', (username) => {
                setTypingUser(typingUser.filter(user => user !== username))
            })
        }        
    }, [socket])


    useEffect(() => {
        setTimeout(() => {
            setError(null)
        }, timers.errorDuration);
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
                        <div className="text-center">
                            <h1 className="text-2xl">Room: <span className="capitalize text-xl">{currentRoom}</span></h1>
                            <p className="is-typing-display">
                                {
                                typingUser.length === 1 
                                ? `${typingUser[0].username} is typing...` 
                                : typingUser.length > 1
                                ? `Multiple Users are typing...`
                                : ''
                                }
                            </p>
                        </div>
                        <div className="absolute right-2 md:right-5 flex flex-col justify-end text-center">
                            <div className="flex flex-col justify-center items-center">
                                <span className="material-symbols-outlined h-7 text-3xl">groups</span>
                                <div className="online-dot"></div>
                            </div>
                            <span className="font-bold text-lg">{currentConnections.length}</span>
                        </div>
                    </div>
                    <ChatMenu 
                    className={'chat-menu absolute top-[10%] flex-col justify-center w-full h-32 z-10 md:w-96'} 
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
                                <Input 
                                placeholder={'Message'} 
                                name={'message'} 
                                id={'message'} 
                                onChange={(e) => handleInputChange(e)} 
                                onBlur={() => socket.emit('stoped-typing')}
                                type={'text'} autoComplete={'off'}
                                />
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