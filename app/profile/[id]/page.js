"use client";

import classes from "./page.module.css";
import { profileState } from "@/components/recoil/profile";
import { useRecoilState, useRecoilValue } from "recoil";
import UserInfo from "./userInfo";
import { useEffect, useRef, useState } from "react";
import getProfile from "./getProfile";
import checkLoginUser from "@/function/client/checkLoginUser";
import Rank from "./rank";
import { languageState } from "@/components/recoil/language";
import Boards from "./boards";

export default function Profile({ params }) {
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const language = useRecoilValue(languageState);
    const [targetUser, setTargetUser] = useState({});
    const mainRef = useRef();

    useEffect(() => {
        checkLoginUser(setLoginUser);
        if (!targetUser.id) {
            const runGetProfile = async () => {
                const result = await getProfile(params.id);
                setTargetUser(result);
            };
            runGetProfile();
        }
    }, []);

    return (
        <div className={classes.profile} ref={mainRef}>
            <UserInfo
                targetUser={targetUser}
                loginUser={loginUser}
                setLoginUser={setLoginUser}
                language={language}
            />
            {targetUser?.id && (
                <>
                    <Rank
                        targetUser={targetUser}
                        loginUser={loginUser}
                        language={language}
                    />
                    <Boards
                        targetUser={targetUser}
                        loginUser={loginUser}
                        language={language}
                    />
                </>
            )}
        </div>
    );
}
