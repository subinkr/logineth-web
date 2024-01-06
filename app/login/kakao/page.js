"use client";

import { useEffect } from "react";
import getKakaoToken from "./getKakaoToken";
import getAccessToken from "../getAccessToken";
import { useSetRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "../callRedirect";

export default function LoginKakaoPage() {
    const setProfile = useSetRecoilState(profileState);

    useEffect(() => {
        const kakaoOAuth = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            const token = await getKakaoToken(code);
            const profile = await getAccessToken(token, "kakao");
            setProfile(profile);
            callRedirect("/");
        };
        kakaoOAuth();
    }, []);

    return <>Getting kakao user info</>;
}
