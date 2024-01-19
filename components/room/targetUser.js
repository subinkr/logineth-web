"use client";

import classes from "./targetUser.module.css";
import Link from "next/link";
import { useRecoilValue } from "recoil";
import { languageState } from "../recoil/language";

export default function TargetUser({ className, targetUser, followState }) {
    const language = useRecoilValue(languageState);

    return (
        <Link className={classes[className]} href={`/profile/${targetUser.id}`}>
            <div className={classes["image-wrapper"]}>
                <img className={classes.image} src={targetUser.image} />
            </div>
            <div className={classes["friend-status"]}>
                <div className={classes["friend-info"]}>
                    {targetUser.nickname}
                    <div className={classes["friend-id"]}>@{targetUser.id}</div>
                </div>
                <div className={classes["follow-state"]}>
                    {followState !== null
                        ? followState
                            ? language?.friend
                            : language?.follower
                        : ""}
                </div>
            </div>
        </Link>
    );
}
