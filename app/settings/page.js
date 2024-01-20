import classes from "./page.module.css";
import Language from "@/components/settings/language";
import Screen from "@/components/settings/screen";

export default function settings() {
    return (
        <div className={classes.settings}>
            <Screen />
            <Language />
        </div>
    );
}
