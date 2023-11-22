import LogoSRC from '../assets/Logo.png'

export default function Logo({ className }) {
    return (
        <div>
            <img src={LogoSRC} alt="Chat.IO Logo" className={className} />
        </div>
    )
}