import './RoomInfoMenu.css'

export default function RoomInfoMenu({ isRoomInfoActive, className, currentConnections }) {
    return (
        <div className={`${className} ${isRoomInfoActive ? 'flex' : 'hidden'}`}>
            <span className='text-xl font-bold my-2'>Currently connected:</span>
            <div className='w-full'>
                <ul className='w-full p-2'>
                    {currentConnections.map((user, index) => {
                        return (
                            <li key={index} className='capitalize mt-1'>{user.username}</li>
                        )
                    })}
                </ul>
            </div>
        </div>
    )
}