"use client";

import { useEffect } from "react";
import getKakaoToken from "./getKakaoToken";
import getAccessToken from "../getAccessToken";

export default function LoginKakaoPage() {
    useEffect(() => {
        const kakaoOAuth = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            const token = await getKakaoToken(code);
            await getAccessToken(token, "kakao");
        };
        kakaoOAuth();
    }, []);
    return <>Getting kakao user info</>;
}
