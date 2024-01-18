"use client";

import classes from "./setting.module.css";
import { useEffect, useState } from "react";
import Language from "../settings/language";
import Screen from "../settings/screen";

export default function Setting() {
    const [setting, setSetting] = useState(true);

    useEffect(() => {
        setSetting(false);
    }, []);

    return (
        <div>
            <>
                <Screen hidden={!setting} />
                <Language hidden={!setting} />
            </>
            <button
                className={setting ? classes["setting-on"] : classes.setting}
                onClick={() => setSetting(!setting)}
            >
                ⚙️
            </button>
        </div>
    );
}
