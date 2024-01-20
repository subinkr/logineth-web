import Link from "next/link";
import classes from "./smallSetting.module.css";

export default function SmallSetting() {
    return (
        <Link href={"/settings"}>
            <button className={classes.setting}>⚙️</button>
        </Link>
    );
}
