import Link from "next/link";
import { cookies } from "next/headers";
import classes from "./header.module.css";
import AfterLogin from "./afterLogin";
import BeforeLogin from "./beforeLogin";

export default function Header() {
    return (
        <>
            <header className={classes.header}>
                <Link href={"/"}>LOGINETH</Link>
                <div className={classes.category}>
                    {cookies().get("accessToken")?.value ? (
                        <AfterLogin />
                    ) : (
                        <BeforeLogin />
                    )}
                </div>
            </header>
        </>
    );
}
