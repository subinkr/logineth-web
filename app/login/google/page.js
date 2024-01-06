"use client";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import getAccessToken from "@/function/server/getAccessToken";

export default function LoginGooglePage() {
    const setProfile = useSetRecoilState(profileState);

    useEffect(() => {
        const googleOAuth = async () => {
            const token = window.location.hash
                .substring(1)
                .split("&")[0]
                .split("=")[1];
            const profile = await getAccessToken(token, "google");
            setProfile(profile);
            callRedirect("/");
        };
        googleOAuth();
    }, []);

    return <>Getting google user info</>;
}
