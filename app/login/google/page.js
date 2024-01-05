"use client";

import { useEffect } from "react";
import getAccessToken from "./getAccessToken";

export default function LoginGooglePage() {
    useEffect(() => {
        const googleOAuth = async () => {
            const token = window.location.hash
                .substring(1)
                .split("&")[0]
                .split("=")[1];
            await getAccessToken(token);
        };
        googleOAuth();
    }, []);
    return <>Getting google user info</>;
}
