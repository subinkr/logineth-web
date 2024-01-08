"use client";

import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import getCookie from "@/function/server/getCookie";

export default function Home() {
    const profile = useRecoilValue(profileState);

    useEffect(() => {
        const setRedirect = async () => {
            if (profile.id && (await getCookie())) {
                callRedirect(`/profile/${profile.id}`);
            } else {
                callRedirect("/about");
            }
        };

        setRedirect();
    }, []);

    return <></>;
}
