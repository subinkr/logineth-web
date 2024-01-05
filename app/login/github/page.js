"use client";

import { useEffect } from "react";
import getGithubToken from "./getGithubToken";
import getAccessToken from "../getAccessToken";

export default function LoginGithubPage() {
    useEffect(() => {
        const githubOAuth = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            const token = await getGithubToken(code);
            await getAccessToken(token, "github");
        };
        githubOAuth();
    }, []);
    return <>Getting github user info</>;
}
