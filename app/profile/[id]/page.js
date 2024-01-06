"use client";

import { profileState } from "@/components/recoil/profile";
import { useRecoilValue } from "recoil";
import UserInfo from "./userInfo";
import { useEffect, useState } from "react";

export default function Profile({ params }) {
    const profile = useRecoilValue(profileState);
    const [thisProfile, setThisProfile] = useState({});

    useEffect(() => {
        if (!thisProfile.id) {
            const getProfile = async () => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_SERVER}/profile/${params.id}`
                );
                const result = await response.json();
                const { user } = result;
                setThisProfile(user);
            };
            getProfile();
        }
    }, [thisProfile]);

    return (
        <>
            <UserInfo thisProfile={thisProfile} loginUser={profile} />
        </>
    );
}
