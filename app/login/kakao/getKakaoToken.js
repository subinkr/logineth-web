"use server";

export default async function getKakaoToken(code) {
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

        return token;
    }
}
