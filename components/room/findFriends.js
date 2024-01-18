"use client";

import { useRecoilValue } from "recoil";
import classes from "./findFriends.module.css";
import { languageState } from "../recoil/language";
import Button from "../button/button";

export default function FindFriends({ setFindFriends }) {
    const language = useRecoilValue(languageState);

    const closeFindFriends = () => {
        setFindFriends(false);
    };

    return (
        <>
            <div className={classes.room}></div>
            <Button className={"default"} onClick={closeFindFriends}>
                {language?.close}
            </Button>
        </>
    );
}
