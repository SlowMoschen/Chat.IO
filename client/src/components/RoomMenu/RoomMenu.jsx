import Button from "../Button";
import Input from "../Input";

export default function RoomMenu({ className, isRoomMenuActive}) {

    const handleSubmit = e => {
        e.preventDefault()
        console.log('work');
    }

    return (
        <div className={`${className} ${isRoomMenuActive ? 'flex' : 'hidden'}`}>
            <form onSubmit={(e) => handleSubmit(e)} className="w-full">
                <Input placeholder={'New Roomname'} type={'text'}/>
                <Button className={'bg-primary py-1 w-full text-clear-white text-xl rounded-md'}>Join</Button>
            </form>
        </div>
    )
}