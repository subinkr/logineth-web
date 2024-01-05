"use client";

import { useEffect } from "react";
import getAccessToken from "./getAccessToken";

export default function LoginKakaoPage() {
    useEffect(() => {
        const kakaoOAuth = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            await getAccessToken(code);
        };
        kakaoOAuth();
    }, []);
    return <>Getting kakao user info</>;
}
