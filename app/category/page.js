"use client";

import classes from "./page.module.css";
import { languageState } from "@/components/recoil/language";
import { profileState } from "@/components/recoil/profile";
import Link from "next/link";
import { useRecoilValue } from "recoil";

export default function Category() {
    const language = useRecoilValue(languageState);
    const loginUser = useRecoilValue(profileState);

    return (
        <div className={classes.category}>
            {loginUser.id ? (
                <>
                    <Link className={classes.link} href={"/logout"}>
                        {language?.logout}
                    </Link>
                </>
            ) : (
                <div className={classes.list}>
                    <Link className={classes.link} href={"/about"}>
                        {language?.about}
                    </Link>
                    <Link className={classes.link} href={"/login"}>
                        {language?.login}
                    </Link>
                </div>
            )}
        </div>
    );
}
