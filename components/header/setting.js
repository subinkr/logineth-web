"use client";

import classes from "./setting.module.css";
import { useEffect, useState } from "react";
import Language from "../settings/language";
import Color from "../settings/color";
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
                    <Color />
                    <Language />
                </>
            ) : (
                <></>
            )}
            <button
                className={setting ? classes["setting-on"] : classes.setting}
                onClick={() => setSetting(!setting)}
            >
                ⚙️
            </button>
        </div>
    );
}
