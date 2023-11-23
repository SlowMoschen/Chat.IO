import './MessageBubble.css'

export default function MessageBubble({ message, username, key, type, sendTime }) {
    let bubbleClass
    switch(type)
    {
        case 'sent':
            bubbleClass = 'sent-bubble'
            break
        case 'received':
            bubbleClass = 'recieved-bubble'
            break
        default:
            bubbleClass = 'user-state-bubble'
    }

    return (
        <li key={key} className={`message-bubble ${bubbleClass}`}>
            <div className='sender'>
                <p>{username}</p>
            </div>
            <div className='message'>
                <p>{message}</p>
            </div>
            <div className='time'>
                <p>{sendTime}</p>
            </div>
        </li>
    )
}