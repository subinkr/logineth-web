"use client";

import { useRecoilValue } from "recoil";
import classes from "./findFriends.module.css";
import { languageState } from "../recoil/language";
import Button from "../button/button";
import { useEffect, useRef, useState } from "react";
import TargetUser from "./targetUser";

export default function FindFriends({ setFindFriends }) {
    const language = useRecoilValue(languageState);
    const inputRef = useRef();
    const usersRef = useRef();
    const [users, setUsers] = useState({});

    const callback = () => {
        if (users.nextPage) {
            if (
                usersRef.current.scrollTop >
                usersRef.current.offsetHeight * 0.8
            ) {
                getNextPage();
                return usersRef.current.removeEventListener("scroll", callback);
            }
        }
    };

    useEffect(() => {
        inputRef.current.focus();
    }, []);

    useEffect(() => {
        if (users.nextPage) {
            usersRef.current.addEventListener("scroll", callback);
        }
    }, [users]);

    const search = async (e) => {
        e.preventDefault();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/friend/find/1?keyword=${inputRef.current.value}`
        );
        const result = await response.json();
        setUsers(result);
    };

    const getNextPage = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/friend/find/${users.nextPage}?keyword=${inputRef.current.value}`
        );
        const result = await response.json();
        users.findUsers.push(...result.findUsers);
        setUsers({ ...result, findUsers: users.findUsers });
    };

    const closeFindFriends = () => {
        setFindFriends(false);
    };

    return (
        <>
            <div className={classes.room}>
                <form className={classes.form}>
                    <input ref={inputRef} className={classes.header} />
                    <Button className="search" type="submit" onClick={search}>
                        🔍
                    </Button>
                </form>
                <div className={classes.users} ref={usersRef}>
                    {users?.findUsers?.length ? (
                        users.findUsers.map((user, idx) => (
                            <TargetUser
                                key={`users-${idx}`}
                                className="default"
                                targetUser={user}
                                followState={null}
                            />
                        ))
                    ) : (
                        <div className={classes["not-found"]}>
                            {language?.notFound}
                        </div>
                    )}
                </div>
                <button
                    className={classes["small-close"]}
                    onClick={closeFindFriends}
                >
                    {language?.close}
                </button>
            </div>
            <div className={classes.close}>
                <Button className={"default"} onClick={closeFindFriends}>
                    {language?.close}
                </Button>
            </div>
        </>
    );
}
