"use client";

import { profileState } from "@/components/recoil/profile";
import { useRecoilState } from "recoil";
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";
import getProfile from "./getProfile";
import checkUser from "@/function/client/checkUser";

export default function Profile({ params }) {
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [profile, setProfile] = useState({});

    useEffect(() => {
        checkUser(setLoginUser);
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
