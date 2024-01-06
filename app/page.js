"use client";

import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";

export default function Home() {
    const profile = useRecoilValue(profileState);
    console.log(profile);

    useEffect(() => {
        if (profile.id) {
            callRedirect(`/profile/${profile.id}`);
        } else {
            callRedirect("/about");
        }
    }, []);

    return <></>;
}
