import classes from "./input.module.css";

export default function Input(props) {
    return <input className={classes.input} {...props} />;
}
