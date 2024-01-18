"use client";

import classes from "./setting.module.css";
import { useEffect, useState } from "react";
import Language from "./language";

export default function Setting() {
    const [setting, setSetting] = useState(true);

    useEffect(() => {
        setSetting(!setting);
    }, []);

    return (
        <div>
            {setting ? (
                <>
                    <Language />
                    <button
                        className={classes.setting}
                        onClick={() => setSetting(!setting)}
                    >
                        ⚙️
                    </button>
                </>
            ) : (
                <button
                    className={classes.setting}
                    onClick={() => setSetting(!setting)}
                >
                    ⚙️
                </button>
            )}
        </div>
    );
}
