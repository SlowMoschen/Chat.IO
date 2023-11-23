import Button from "../Button";
import Input from "../Input";

export default function RoomMenu({ className, isRoomMenuActive, setNewRoom, onSubmit, errorMessage}) {

    return (
        <div className={`${className} ${isRoomMenuActive ? 'flex' : 'hidden'}`}>
            <form onSubmit={onSubmit} className="w-full">
                <Input placeholder={'New Roomname'} type={'text'} onChange={(e) => setNewRoom(e.target.value.trim().toLowerCase())} name={'newroom'} id={'new-room'} errorMessage={errorMessage}/>
                <Button className={'bg-primary py-1 w-full text-clear-white text-xl rounded-md'}>Join</Button>
            </form>
        </div>
    )
}