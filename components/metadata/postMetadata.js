"use client";

import classes from "./postMetadata.module.css";
import Button from "../button/button";
import { useRecoilValue } from "recoil";
import { languageState } from "../recoil/language";
import { profileState } from "../recoil/profile";
import { useEffect, useState } from "react";
import callRedirect from "@/function/server/callRedirect";

export default function PostMetadata() {
    const loginUser = useRecoilValue(profileState);
    const language = useRecoilValue(languageState);
    const [wallet, setWallet] = useState("");

    useEffect(() => {
        setWallet(loginUser?.wallet);
    }, [loginUser]);

    return (
        <>
            <div className={classes["post-metadata-area"]}>
                {wallet && (
                    <Button
                        className="post-metadata"
                        onClick={() => callRedirect("/board")}
                    >
                        {language?.postMetadata}
                    </Button>
                )}
            </div>
        </>
    );
}
