import MessageBubble from "../components/MessageBubble/MessageBubble"

export const renderMessages = (obj, index, username) => {
    
    // Check if Message came from Sender
    const messageType = obj.username === username ? 'sent' : 'received'

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
                />
            ),
        }
    }
}
