import classes from "./circle.module.css";

export default function NotiCircle({ hidden }) {
    return <div className={classes.circle} hidden={hidden}></div>;
}
