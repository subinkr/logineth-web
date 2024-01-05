"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function getAccessToken(code) {
    if (code) {
        const githubTokenResponse = await fetch(
            "https://github.com/login/oauth/access_token",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    Accept: "application/json",
                },
                body: `client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}&client_secret=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_SECRET}&code=${code}`,
            }
        );
        const githubTokenResult = await githubTokenResponse.json();

        const token = githubTokenResult.access_token;

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/login/oauth/github`,
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
