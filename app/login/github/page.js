"use client";

import classes from "./page.module.css";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import getGithubToken from "./getGithubToken";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import getAccessToken from "@/function/server/getAccessToken";
import { languageState } from "@/components/recoil/language";

export default function LoginGithubPage() {
    const setProfile = useSetRecoilState(profileState);
    const language = useRecoilValue(languageState);

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

    return <div className={classes.page}>{language?.github}</div>;
}
