"use server";

import { cookies } from "next/headers";

export default async function getCookie() {
    const cookie = cookies().get("accessToken");

    return cookie?.value;
}
