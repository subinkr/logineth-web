"use client";

import { profileState } from "@/components/recoil/profile";
import { useRecoilState } from "recoil";
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";
import getProfile from "./getProfile";
import checkUser from "@/function/client/checkUser";

export default function Profile({ params }) {
    const [profile, setProfile] = useRecoilState(profileState);
    const [thisProfile, setThisProfile] = useState({});

    useEffect(() => {
        checkUser(setProfile);
        if (!thisProfile.id) {
            const runGetProfile = async () => {
                const result = await getProfile(params.id);
                setThisProfile(result);
            };
            runGetProfile();
        }
    }, []);

    return (
        <>
            <UserInfo thisProfile={thisProfile} loginUser={profile} />
        </>
    );
}
