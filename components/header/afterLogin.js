"use client";

import Link from "next/link";
import Rooms from "../room/rooms";
import { useRecoilValue } from "recoil";
import { languageState } from "../recoil/language";
import PostMetadata from "../metadata/postMetadata";

export default function AfterLogin() {
    const language = useRecoilValue(languageState);

    return (
        <>
            <Link href={"/about"}>{language?.about}</Link>
            <Link href={"/profile"}>{language?.profile}</Link>
            <Link href={"/logout"}>{language?.logout}</Link>
            <Rooms />
            <PostMetadata />
        </>
    );
}
