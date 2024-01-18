"use client";

import { useRecoilValue } from "recoil";
import classes from "./color.module.css";
import { useEffect, useState } from "react";
import { languageState } from "../recoil/language";
import { profileState } from "../recoil/profile";

export default function Color({ hidden }) {
    const colors = ["dark", "white"];
    const language = useRecoilValue(languageState);
    const loginUser = useRecoilValue(profileState);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (loginUser.color) {
            setIdx(loginUser.color);
        } else {
            setIdx(idx);
        }
    }, [loginUser]);

    useEffect(() => {
        document.documentElement.classList.remove(colors[(idx + 1) % 2]);
        document.documentElement.classList.add(colors[idx]);
    }, [idx]);

    return (
        <div className={classes["color-wrapper"]} hidden={hidden}>
            <button
                className={classes.color}
                onClick={() => setIdx((idx + 1) % 2)}
            >
                🖥️ {language?.color}
            </button>
        </div>
    );
}
