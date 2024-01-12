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
                            <Link href={"/logout"}>Logout</Link>
                            <Rooms />
                        </>
                    ) : (
                        <>
                            <Link href={"/about"}>About</Link>
                            <Link href={"/services"}>Our services</Link>
                            <Link href={"/login"}>Login</Link>
                        </>
                    )}
                </div>
            </header>
        </>
    );
}
