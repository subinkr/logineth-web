"use server";

import getCookie from "@/function/server/getCookie";

export default async function getFollowingUsers() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/following`,
        {
            method: "get",
            headers: {
                Authorization: `Bearer ${await getCookie()}`,
            },
        }
    );
    const result = await response.json();

    return result;
}
