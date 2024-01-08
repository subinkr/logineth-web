"use server";

import getCookie from "@/function/server/getCookie";

export default async function getProfile(id) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/profile/${id}`,
        {
            headers: {
                Authorization: `Bearer ${await getCookie()}`,
            },
        }
    );
    const result = await response.json();
    const { user } = result;

    return user;
}
