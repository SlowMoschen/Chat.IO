import MessageBubble from "../src/components/MessageBubble/MessageBubble"

export const renderMessages = (obj, index, username, toggleNextMessageDM, setDirectMessageTo) => {
    
    // Check if Message came from Sender
    let messageType
    if(obj.dm === true)
    {
        if(obj.username === username.toLowerCase())
        {
            messageType = 'sent dm'
        }
        else
        {
            messageType = 'received dm'
        }

    }
    else
    {
        if(obj.username === username.toLowerCase())
        {
            messageType = 'sent'
        }
        else {
            messageType = 'received'
        }

    }
    // const messageType1 = obj.username === username.toLowerCase() ? 'sent' : obj.username !== username.toLowerCase() && obj.dm === true ? 'received dm' : 'received'

    // Check if Message is a Userstate Message
    const stateMessage =
        obj.message === '!user-joined!'
            ? `${obj.username} joined room: ${obj.room}`
            : obj.message === '!user-disconnected!'
            ? `${obj.username} disconnected from room: ${obj.room}`
            : '';

    if (stateMessage !== '') {
        return { key: index, content: <MessageBubble key={index} message={stateMessage} /> }
    } else {
        return {
            key: index,
            content: (
                <MessageBubble
                    key={index}
                    message={obj.message}
                    username={obj.username}
                    type={messageType}
                    sendTime={obj.sendTime}
                    toggleNextMessageDM={toggleNextMessageDM}
                    setDirectMessageTo={setDirectMessageTo}
                />
            ),
        }
    }
}
