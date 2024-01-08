import classes from "./input.module.css";

export default function Input({ value, onChange }) {
    return (
        <input className={classes.input} value={value} onChange={onChange} />
    );
}
