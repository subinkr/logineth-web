"use client";

import { useRecoilValue } from "recoil";
import classes from "./color.module.css";
import { useEffect, useState } from "react";
import { languageState } from "../recoil/language";

export default function Color() {
    const colors = ["dark", "white"];
    const language = useRecoilValue(languageState);
    const [color, setColor] = useState(
        matchMedia("(prefers-color-scheme: dark)").matches ? 0 : 1
    );

    useEffect(() => {
        document.documentElement.classList.remove(colors[(color + 1) % 2]);
        document.documentElement.classList.add(colors[color]);
    }, [color]);

    return (
        <div className={classes["color-wrapper"]}>
            <button
                className={classes.color}
                onClick={() => setColor((color + 1) % 2)}
            >
                🖥️ {language?.color}
            </button>
        </div>
    );
}
