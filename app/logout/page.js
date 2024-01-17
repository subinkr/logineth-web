"use client";

import { useEffect } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import deleteCookie from "@/function/server/deleteCookie";
import { languageState } from "@/components/recoil/language";

export default function Logout() {
    const setProfile = useSetRecoilState(profileState);
    const language = useRecoilValue(languageState);

    useEffect(() => {
        setProfile({});
        deleteCookie();
    }, []);

    return <>{language?.goodBye}</>;
}
