"use client";

import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import deleteCookie from "@/function/server/deleteCookie";

export default function Logout() {
    const setProfile = useSetRecoilState(profileState);

    useEffect(() => {
        setProfile({});
        deleteCookie();
    }, []);

    return <>Good bye!</>;
}
