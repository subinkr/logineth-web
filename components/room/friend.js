import classes from "./friend.module.css";

export default function Friend({ onClick, children }) {
    return (
        <button className={classes.friend} onClick={onClick}>
            {children}
        </button>
    );
}
