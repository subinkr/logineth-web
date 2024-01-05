"use client";

import { useEffect } from "react";
import getAccessToken from "./getAccessToken";

export default function LoginGithubPage() {
    useEffect(() => {
        const githubOAuth = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            await getAccessToken(code);
        };
        githubOAuth();
    }, []);
    return <>Getting github user info</>;
}
