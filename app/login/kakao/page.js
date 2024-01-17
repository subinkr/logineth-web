"use client";

import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import getKakaoToken from "./getKakaoToken";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import getAccessToken from "@/function/server/getAccessToken";
import { languageState } from "@/components/recoil/language";

export default function LoginKakaoPage() {
    const setProfile = useSetRecoilState(profileState);
    const language = useRecoilValue(languageState);

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

    return <>{language?.kakao}</>;
}
