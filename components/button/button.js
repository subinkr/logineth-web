import classes from "./button.module.css";

export default function Button({ className, onClick, type, children }) {
    return (
        <button className={classes[className]} onClick={onClick} type={type}>
            {children}
        </button>
    );
}
