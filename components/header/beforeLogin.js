"use client";

import { useRecoilValue } from "recoil";
import { languageState } from "../recoil/language";
import Link from "next/link";

export default function BeforeLogin() {
    const language = useRecoilValue(languageState);

    return (
        <>
            <Link href={"/about"}>{language?.about}</Link>
            <Link href={"/login"}>{language?.login}</Link>
        </>
    );
}
