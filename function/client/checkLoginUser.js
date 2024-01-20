"use client";

import getCookie from "../server/getCookie";

export default async function checkLoginUser(setLoginUser) {
    const cookie = await getCookie();
    if (!cookie) {
        setLoginUser({});
    }
}
