"use client";

import { useRecoilValue } from "recoil";
import classes from "./findFriends.module.css";
import { languageState } from "../recoil/language";
import Button from "../button/button";
import { useEffect, useRef } from "react";

export default function FindFriends({ setFindFriends }) {
    const language = useRecoilValue(languageState);
    const inputRef = useRef();

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    const search = async (e) => {
        e.preventDefault();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/friend/find/1?keyword=${inputRef.current.value}`
        );
        const result = await response.json();
        console.log(result);
        inputRef.current.value = "";
    };

    const closeFindFriends = () => {
        setFindFriends(false);
    };

    return (
        <>
            <div className={classes.room}>
                <form>
                    <input ref={inputRef} className={classes.header} />
                    <Button className="search" type="submit" onClick={search}>
                        🔍
                    </Button>
                </form>
            </div>
            <Button className={"default"} onClick={closeFindFriends}>
                {language?.close}
            </Button>
        </>
    );
}
