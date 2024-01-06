"use client";

import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import { profileState } from "@/components/recoil/profile";

export default function Home() {
    const profile = useRecoilValue(profileState);

    useEffect(() => {
        if (profile.id) {
        }
    }, []);

    return <></>;
}
