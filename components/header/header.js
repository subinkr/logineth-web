import Link from "next/link";
import { cookies } from "next/headers";
import classes from "./header.module.css";
import Rooms from "../room/rooms";

export default function Header() {
    return (
        <>
            <header className={classes.header}>
                <Link href={"/"}>LOGINETH</Link>
                <div className={classes.category}>
                    {cookies().get("accessToken")?.value ? (
                        <>
                            <Link href={"/logout"}>로그아웃</Link>
                            <Rooms />
                        </>
                    ) : (
                        <>
                            <Link href={"/about"}>서비스 소개</Link>
                            <Link href={"/login"}>로그인</Link>
                        </>
                    )}
                </div>
            </header>
        </>
    );
}
