"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function getAccessToken(token) {
    if (token) {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/login/oauth/google`,
            {
                method: "post",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    token,
                }),
            }
        );
        const result = await response.json();
        cookies().set({
            name: "accessToken",
            value: result.accessToken,
            httpOnly: true,
            path: "/",
        });
        redirect("/");
    }
}
