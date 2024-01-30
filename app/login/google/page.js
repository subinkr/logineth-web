"use client";

import classes from "./page.module.css";
import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import getAccessToken from "@/function/server/getAccessToken";
import { languageState } from "@/components/recoil/language";

export default function LoginGooglePage() {
    const setProfile = useSetRecoilState(profileState);
    const language = useRecoilValue(languageState);

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

    return <div className={classes.page}>{language?.google}</div>;
}
