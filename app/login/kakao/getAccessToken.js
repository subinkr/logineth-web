"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function getAccessToken(code) {
    if (code) {
        const kakaoTokenResponse = await fetch(
            "https://kauth.kakao.com/oauth/token",
            {
                method: "post",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: `grant_type=authorization_code&client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT}&code=${code}`,
            }
        );
        const kakaoTokenResult = await kakaoTokenResponse.json();

        const token = kakaoTokenResult.access_token;
        console.log(token);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/login/oauth/kakao`,
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
        console.log(result);
        cookies().set({
            name: "accessToken",
            value: result.accessToken,
            httpOnly: true,
            path: "/",
        });
        redirect("/");
    }
}
