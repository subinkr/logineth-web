"use client";

import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";

export default function ToProfile() {
    const loginUser = useRecoilValue(profileState);

    useEffect(() => {
        callRedirect(`/profile/${loginUser.id}`);
    }, []);

    return <></>;
}
