"use client";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import getGithubToken from "./getGithubToken";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import getAccessToken from "@/function/server/getAccessToken";

export default function LoginGithubPage() {
    const setProfile = useSetRecoilState(profileState);

    useEffect(() => {
        const githubOAuth = async () => {
            const url = new URL(window.location.href);
            const code = url.searchParams.get("code");
            const token = await getGithubToken(code);
            const profile = await getAccessToken(token, "github");
            setProfile(profile);
            callRedirect("/");
        };
        githubOAuth();
    }, []);

    return <>Getting github user info</>;
}
