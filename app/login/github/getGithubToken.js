"use server";

export default async function getGithubToken(code) {
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

        return token;
    }
}
