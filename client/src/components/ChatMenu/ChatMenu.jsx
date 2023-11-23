import Button from "../Button";
import './ChatMenu.css'
import { useNavigate } from "react-router-dom"
import RoomMenu from "../RoomMenu/RoomMenu";


export default function ChatMenu({ setIsMenuActive, isMenuActive, className, isRoomMenuActive, setIsRoomMenuActive }) {

    const redirect = useNavigate()

    const joinNewRoom = () => {
        setIsRoomMenuActive(true)
    }

    return (
        <div className={`${className} ${isMenuActive ? 'flex' : 'hidden'}`}>
            {
                isRoomMenuActive
                ? <RoomMenu isRoomMenuActive={isRoomMenuActive} className={'flex flex-col w-full px-3'}/>
                :
                <>
                <Button 
                className={'flex items-center justify-between mx-2 my-1 px-3 py-2 rounded-md bg-primary text-clear-white'}
                onClick={() => joinNewRoom()}
                >
                    <p>Join new Chatroom</p>
                    <span className="material-symbols-outlined ml-3">meeting_room</span>
                </Button>
                <Button 
                className={'flex items-center justify-between mx-2 my-1 px-3 py-2 rounded-md bg-primary text-clear-white'}
                onClick={() => redirect('/')}
                >
                    <p>Logout</p>
                    <span className="material-symbols-outlined ml-3">logout</span>
                </Button>
                </>  
            }
        </div>
    )
}