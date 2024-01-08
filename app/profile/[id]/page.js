"use client";

import { profileState } from "@/components/recoil/profile";
import { useRecoilState } from "recoil";
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";
import getProfile from "./getProfile";
import checkLoginUser from "@/function/client/checkLoginUser";

export default function Profile({ params }) {
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        checkLoginUser(setLoginUser);
        if (!profile.id) {
            const runGetProfile = async () => {
                const result = await getProfile(params.id);
                setProfile(result);
            };
            runGetProfile();
        }
    }, []);

    return (
        <>
            <UserInfo profile={profile} loginUser={loginUser} />
        </>
    );
}
