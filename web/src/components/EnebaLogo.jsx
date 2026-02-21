export default function EnebaLogo({ className = '', ...props }) {
    return (
        <img
            src="https://img.icons8.com/color/480/eneba.png"
            alt="Eneba"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}