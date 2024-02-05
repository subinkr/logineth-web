import { forwardRef } from "react";
import classes from "./textarea.module.css";

function Textarea(props, ref) {
    return <textarea className={classes.textarea} {...props} ref={ref} />;
}

export default Textarea = forwardRef(Textarea);
