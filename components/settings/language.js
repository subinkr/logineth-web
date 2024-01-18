"use client";

import classes from "./language.module.css";
import { useRecoilState } from "recoil";
import { languageState } from "../recoil/language";
import { profileState } from "../recoil/profile";
import { english } from "../recoil/language/english";
import { korean } from "../recoil/language/korean";
import { useEffect, useState } from "react";
import getCookie from "@/function/server/getCookie";

export default function Language({ hidden }) {
    const languages = [english, korean];
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [language, setLanguage] = useRecoilState(languageState);
    const [idx, setIdx] = useState(0);

    useEffect(() => {
        if (loginUser.language) {
            setLanguage(languages[loginUser.language]);
            setIdx(loginUser.language);
        } else {
            setLanguage(languages[idx % languages.length]);
        }
    }, [loginUser]);

    const changeLanguage = () => {
        const runLanguage = async () => {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER}/setting/language`,
                {
                    method: "post",
                    headers: {
                        Authorization: `Bearer ${await getCookie()}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        setting: (idx + 1) % languages.length,
                    }),
                }
            );
            const { user } = await response.json();
            setLoginUser(user);
            setIdx((idx + 1) % languages.length);
        };

        if (typeof loginUser.language === "number") {
            runLanguage();
            setIdx(loginUser.language);
        } else {
            setIdx((idx + 1) % languages.length);
        }
        setLanguage(languages[(idx + 1) % languages.length]);
    };

    return (
        <div className={classes["language-wrapper"]} hidden={hidden}>
            <button className={classes.language} onClick={changeLanguage}>
                🌎 {language?.language}
            </button>
        </div>
    );
}
