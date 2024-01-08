"use client";

import getCookie from "../server/getCookie";

export default function checkUser(setProfile) {
    const cookieCheck = async () => {
        const cookie = await getCookie();
        if (!cookie) {
            setProfile({});
        }
    };

    cookieCheck();
}
