"use client";

import classes from "./setting.module.css";
import { useEffect, useState } from "react";
import Language from "./language";
import { useRecoilState } from "recoil";
import { profileState } from "../recoil/profile";

export default function Setting() {
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [setting, setSetting] = useState(true);
    const [language, setLanguage] = useState("");

    useEffect(() => {
        setSetting(false);
    }, []);

    useEffect(() => {
        setLanguage(loginUser.language);
        if (setting && language === loginUser.language) {
            setSetting(false);
        }
        if (!setting) {
            setSetting(true);
            setLoginUser({ ...loginUser });
        }
    }, [loginUser]);

    return (
        <div>
            {setting ? (
                <>
                    <Language />
                </>
            ) : (
                <></>
            )}
            <button
                className={classes.setting}
                onClick={() => setSetting(!setting)}
            >
                ⚙️
            </button>
        </div>
    );
}
