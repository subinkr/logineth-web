"use client";

import { useRecoilValue } from "recoil";
import classes from "./page.module.css";
import { languageState } from "@/components/recoil/language";
import { profileState } from "@/components/recoil/profile";
import Button from "@/components/button/button";
import Image from "next/image";
import callRedirect from "@/function/server/callRedirect";

export default function About() {
    const language = useRecoilValue(languageState);
    const loginUser = useRecoilValue(profileState);

    return (
        <div className={classes["introduce-area"]}>
            <div className={classes["introduce-wrapper"]}>
                <div className={classes.introduce}>{language?.introduce}</div>
                {loginUser.id === undefined && (
                    <Button
                        className="default"
                        onClick={() => callRedirect("/login")}
                    >
                        {language?.login}
                    </Button>
                )}
            </div>
            <div className={classes["user-info-image"]}>
                <Image
                    src={"/userInfo.png"}
                    alt="userInfo.png"
                    width={920}
                    height={250}
                />
            </div>
            <div className={classes["rank-image"]}>
                <Image
                    src={"/rank.png"}
                    alt="rank.png"
                    width={450}
                    height={350}
                />
            </div>
            <div className={classes["friend-list-image"]}>
                <Image
                    src={"/friendList.png"}
                    alt="friendList.png"
                    width={300}
                    height={550}
                />
            </div>
        </div>
    );
}
