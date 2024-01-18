"use client";

import { useRecoilState, useRecoilValue } from "recoil";
import classes from "./screen.module.css";
import { useEffect, useState } from "react";
import { languageState } from "../recoil/language";
import { profileState } from "../recoil/profile";
import getCookie from "@/function/server/getCookie";

export default function Screen({ hidden }) {
    const screen = ["dark", "white"];
    const language = useRecoilValue(languageState);
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (typeof loginUser.screen === "number") {
            setIdx(loginUser.screen);
        } else {
            setIdx(idx);
        }
    }, [loginUser]);

    useEffect(() => {
        document.documentElement.classList.remove(screen[(idx + 1) % 2]);
        document.documentElement.classList.add(screen[idx]);
    }, [idx]);

    const changeScreen = () => {
        const runScreen = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER}/setting/screen`,
                {
                    method: "post",
                    headers: {
                        Authorization: `Bearer ${await getCookie()}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        setting: (idx + 1) % 2,
                    }),
                }
            );
            const { user } = await response.json();
            setLoginUser(user);
        };

        if (typeof loginUser.screen === "number") {
            runScreen();
            setIdx(loginUser.screen);
        } else {
            setIdx(idx + 1);
        }
    };

    return (
        <div className={classes["screen-wrapper"]} hidden={hidden}>
            <button className={classes.screen} onClick={changeScreen}>
                🖥️ {language?.screen}
            </button>
        </div>
    );
}
