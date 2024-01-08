"use client";

import getCookie from "../server/getCookie";

export default function checkLoginUser(setProfile) {
    const cookieCheck = async () => {
        const cookie = await getCookie();
        if (!cookie) {
            setProfile({});
        }
    };

    cookieCheck();
}
