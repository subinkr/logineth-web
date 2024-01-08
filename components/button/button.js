import classes from "./button.module.css";

export default function Button({ type, onClick, children }) {
    return (
        <button
            className={type === "danger" ? classes.danger : null}
            onClick={onClick}
        >
            {children}
        </button>
    );
}
