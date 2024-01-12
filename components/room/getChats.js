"use server";

import getCookie from "@/function/server/getCookie";

export default async function getChats(roomID, page) {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/room/${roomID}/${page}`,
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
