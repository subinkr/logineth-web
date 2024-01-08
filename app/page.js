"use client";

import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import checkLoginUser from "@/function/client/checkLoginUser";

export default function Home() {
    const [loginUser, setLoginUser] = useRecoilState(profileState);

    useEffect(() => {
        const setRedirect = async () => {
            if (loginUser.id) {
                callRedirect(`/profile/${loginUser.id}`);
            } else {
                callRedirect("/about");
            }
        };

        checkLoginUser(setLoginUser);
        setRedirect();
    }, []);

    return <></>;
}
