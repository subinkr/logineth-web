"use client";

import { useEffect } from "react";
import deleteCookie from "./deleteCookie";
import { useSetRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";

export default function Logout() {
    const setProfile = useSetRecoilState(profileState);

    useEffect(() => {
        setProfile({});
        deleteCookie();
    }, []);

    return <>Good bye!</>;
}
