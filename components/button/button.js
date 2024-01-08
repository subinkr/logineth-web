import classes from "./button.module.css";

export default function Button({ type, onClick, children }) {
    return (
        <button className={classes[type]} onClick={onClick}>
            {children}
        </button>
    );
}
