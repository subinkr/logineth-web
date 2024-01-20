"use client";

import Button from "@/components/button/button";
import classes from "./page.module.css";

export default function Login() {
    const github = () => {
        window.open(
            "https://github.com/login/oauth/authorize" +
                `?client_id=${process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}`,
            "_self"
        );
    };

    const google = () => {
        window.open(
            "https://accounts.google.com/o/oauth2/v2/auth" +
                `?client_id=${process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}` +
                `&redirect_uri=${process.env.NEXT_PUBLIC_GOOGLE_REDIRECT}` +
                "&response_type=token" +
                "&scope=https://www.googleapis.com/auth/userinfo.email",
            "_self"
        );
    };

    const kakao = () => {
        window.open(
            "https://kauth.kakao.com/oauth/authorize" +
                `?client_id=${process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID}` +
                `&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT}` +
                "&response_type=code",
            "_self"
        );
    };

    return (
        <div className={classes.login}>
            <Button className={"react-button"} onClick={github}>
                Github
            </Button>
            <Button className={"react-button"} onClick={google}>
                Google
            </Button>
            <Button className={"react-button"} onClick={kakao}>
                Kakao
            </Button>
        </div>
    );
}
