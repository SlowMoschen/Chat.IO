import Button from "../Button";

export default function MessageMenu({ toggleNextMessageDM, toggleMessageMenu, setDirectMessageTo }) {
    return (
        <div className="absolute bottom-0 right-0 p-2">
            <Button 
            className={'bg-primary py-1 px-2 rounded-md'} 
            onClick={(e) =>{
                toggleNextMessageDM()
                toggleMessageMenu()
                const username = e.target.parentElement.parentElement.children[0].textContent
                setDirectMessageTo(username)
            }}>DM to User</Button>
        </div>
    )
}