import React, { useEffect, useState, useRef } from "react";
import useSocket from "../hooks/useSocket"
import Input from "../components/Input";
import Button from "../components/Button";
import { renderMessages } from "../../lib/renderMessages";
import { getCurrentTime } from "../utils/TimeFunctions";
import { timers, serverURL } from "../utils/constants";
import ChatMenu from "../components/ChatMenu/ChatMenu";
import useError from "../hooks/useError";
import useToggle from "../hooks/useToggle";
import useScrollHandler from "../hooks/useScrollHandler";
import RoomInfoMenu from "../components/RoomInfoMenu/RoomInfoMenu";
import { checkUsername } from "../utils/usernameFetch";

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
    const [ isRoomInfoActive, toggleRoomInfo ] = useToggle(false)
    const [ isNextMessageDM, toggleNextMessageDM ] = useToggle(false)
    const [ directMessageTo, setDirectMessageTo ] = useState('')
    const [ isTyping, setIsTyping ] = useState(false)
    const [ typingUser, setTypingUser ] = useState([])
    const messageContainerRef = useRef()
    const shouldScrollRef = useRef(true)
    
    const sendMessage = () => {
        socket.emit('send-message', { room: currentRoom, message, sendTime: getCurrentTime() })
        setMessage('')
    }
    
    const sendDirectMessage = () => {
        socket.emit('send-direct-message', { reciever: directMessageTo, message, sendTime: getCurrentTime(), room: currentRoom })
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

        if(isNextMessageDM)
        {
            sendDirectMessage()
            toggleNextMessageDM()
        }
        else
        {
            sendMessage()
        }

        e.target.elements.message.value = ''
    }

    const handleRoomSubmit = async e => {
        e.preventDefault()
        
        if(newRoom === currentRoom) 
        {
            setError('equal')
            e.target.elements.newroom.value = ''
            return
        }

        const body = {
            username: username.toLowerCase(),
            room: newRoom
        }

        const usernameTaken = await checkUsername(body)
        
        if(usernameTaken)
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
                const { username, message, sendTime, room, dm } = data
                setReceivedMessages((prevMessages) => [...prevMessages, {username: username, message: message, sendTime: sendTime, room: room, dm: dm}])
            })

            socket.on('user-started-typing', (username) => {
                setTypingUser((prevUsers) => [...prevUsers, username])
            })

            socket.on('user-stoped-typing', (username) => {
                setTypingUser(typingUser.filter(user => user !== username))
            })

            socket.on('recieved-direct-message', (data) => {
                const { sender, message, sendTime, room, dm } = data
                setReceivedMessages((prevMessages) => [...prevMessages, {username: sender, message: message, sendTime: sendTime, room: room, dm: dm}])
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
                    <div className="h-[12%] bg-primary flex items-center justify-center text-clear-white relative">
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
                                <div className="flex items-center justify-center">
                                    <span className="font-bold text-lg mr-2">{currentConnections.length}</span>
                                    <div className="online-dot"></div>
                                </div>
                            </div>
                            <div className="cursor-pointer">
                                <Button onClick={() => toggleRoomInfo()}>
                                    <span className="material-symbols-outlined">info</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                    <RoomInfoMenu
                    className={'room-info absolute top-[12%] text-clear-white right-0 flex-col items-center justify-center w-full h-fit min-h-[6rem] z-10 md:w-52'}
                    isRoomInfoActive={isRoomInfoActive}
                    currentConnections={currentConnections}
                    />
                    <ChatMenu 
                    className={'chat-menu absolute top-[12%] bg-accent flex-col justify-center w-full h-32 z-10 md:w-96'} 
                    isMenuActive={isMenuActive} 
                    toggleMenu={toggleMenu}
                    isRoomMenuActive={isRoomMenuActive}
                    setIsRoomMenuActive={toggleRoomMenu}
                    setNewRoom={setNewRoom}
                    onSubmit={(e) => handleRoomSubmit(e)}
                    errorMessage={errorMessage}
                    />
                    <div className="h-[85%] lg:h-[83%]">
                        <ul className="messages-display h-full flex flex-col overflow-y-scroll max-h-[100%] pb-2" ref={messageContainerRef} onScroll={() => handleScroll()}>
                            {
                                receivedMessages.map((obj, index) => {
                                    const { key, content } = renderMessages(obj, index, username, toggleNextMessageDM, setDirectMessageTo);
                                    return React.cloneElement(content, { key });
                                })
                            }
                        </ul>
                    </div>
                    <div className="h-[3%] flex items-center justify-center w-full">
                        {
                            isNextMessageDM 
                            ?   <div className="absolute bg-grey-bg w-full h-32 z-0">
                                    <div className="absolute top-2 left-2">Direct Message to: {directMessageTo}</div>
                                    <div className="absolute right-2 top-2 cursor-pointer" onClick={() => toggleNextMessageDM()}>
                                        <span className="material-symbols-outlined">close</span>
                                    </div>
                                </div>
                            : ''
                        }
                        <form onSubmit={(e) => handleMessageSubmit(e)} className="flex w-full px-2">
                            <div className="w-[90%] z-10">
                                <Input 
                                placeholder={'Message'} 
                                name={'message'} 
                                id={'message'} 
                                onChange={(e) => handleInputChange(e)} 
                                onBlur={() => socket.emit('stoped-typing')}
                                type={'text'} autoComplete={'off'}
                                />
                            </div>
                            <div className="w-[10%] flex items-center justify-center z-10">
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