"use client";

import classes from "./button.module.css";

export default function Button({ className, onClick, type, hidden, children }) {
    return (
        <button
            className={classes[className]}
            onClick={onClick}
            type={type}
            hidden={hidden}
        >
            {children}
        </button>
    );
}
