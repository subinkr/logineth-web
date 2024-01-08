import classes from "./button.module.css";

export default function Button({ type, children }) {
    return (
        <button className={type === "danger" ? classes.danger : null}>
            {children}
        </button>
    );
}
