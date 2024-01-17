"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function getCookie() {
    const cookie = cookies().get("accessToken");

    if (!cookie) {
        redirect("/logout");
    }

    return cookie.value;
}
