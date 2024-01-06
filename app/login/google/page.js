"use client";

import { useEffect } from "react";
import getAccessToken from "../getAccessToken";
import callRedirect from "../callRedirect";
import { useSetRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";

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
