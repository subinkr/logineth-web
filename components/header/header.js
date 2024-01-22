"use client";

import Link from "next/link";
import classes from "./header.module.css";
import AfterLogin from "./afterLogin";
import BeforeLogin from "./beforeLogin";

const Header = ({ cookie }) => {
    return (
        <div>
            <header className={classes.header}>
                <Link href={"/"}>LOGINETH</Link>
                <div className={classes.category}>
                    {cookie ? <AfterLogin /> : <BeforeLogin />}
                </div>
                <Link className={classes["small-category"]} href={"/category"}>
                    🍔
                </Link>
            </header>
        </div>
    );
};

export default Header;
