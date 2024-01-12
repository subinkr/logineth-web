import { forwardRef } from "react";
import classes from "./input.module.css";

function Input(props, ref) {
    return <input className={classes.input} {...props} ref={ref} />;
}

export default Input = forwardRef(Input);
