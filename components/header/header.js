import Link from "next/link";
import { cookies } from "next/headers";
import classes from "./header.module.css";

export default function Header() {
    return (
        <header className={classes.header}>
            <Link href={"/"}>TITLE</Link>
            <div className={classes.category}>
                <Link href={"/about"}>About</Link>
                <Link href={"/services"}>Our services</Link>
                {cookies().get("accessToken")?.value ? (
                    <Link href={"/logout"}>Logout</Link>
                ) : (
                    <Link href={"/login"}>Login</Link>
                )}
            </div>
        </header>
    );
}
