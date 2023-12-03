import useToggle from '../../hooks/useToggle'
import MessageMenu from '../MessageMenu/MessageMenu'
import './MessageBubble.css'

export default function MessageBubble({ message, username, key, type, sendTime, toggleNextMessageDM, setDirectMessageTo }) {

    const [ isMessageMenuActive, toggleMessageMenu ] = useToggle(false)
    let bubbleClass
    switch(type)
    {
        case 'sent':
            bubbleClass = 'sent-bubble'
            break
        case 'sent dm':
            bubbleClass = 'sent-bubble direct-message'
            break
        case 'received':
            bubbleClass = 'recieved-bubble'
            break
        case 'received dm':
            bubbleClass = 'recieved-bubble direct-message'
            break
        default:
            bubbleClass = 'user-state-bubble'
    }

    return (
        <li key={key} className={`message-bubble ${bubbleClass} relative`}>
            <div className='sender'>
                {
                    bubbleClass === 'sent-bubble direct-message'
                    ? <p className='italic text-sm mr-1'>DM to:</p>
                    : bubbleClass === 'recieved-bubble direct-message'
                    ? <p className='italic text-sm mr-1'>DM from:</p>
                    : ''
                }
                <p className='capitalize'>
                    {username}
                </p>
            </div>
            <div className='message'>
                <p>{message}</p>
            </div>
            <div className='time'>
                <p>{sendTime}</p>
            </div>
            {
                bubbleClass !== 'user-state-bubble' && bubbleClass !== 'sent-bubble' && bubbleClass !== 'sent-bubble dm'
                ?   <div className='cursor-pointer absolute right-2 top-2' onClick={() => toggleMessageMenu()}>
                        <span className="material-symbols-outlined">more_vert</span>
                    </div>
                : ''
            }
            {
                isMessageMenuActive
                ? <MessageMenu toggleNextMessageDM={toggleNextMessageDM} toggleMessageMenu={toggleMessageMenu} setDirectMessageTo={setDirectMessageTo}/>
                : ''
            }
        </li>
    )
}