"use client";

import Button from "@/components/button/button";
import classes from "./userInfo.module.css";
import getCookie from "@/function/server/getCookie";
import deleteCookie from "@/function/server/deleteCookie";
import { useEffect, useRef, useState } from "react";
import Input from "@/components/input/input";
import Follow from "./follow";
import getDate from "@/function/client/getDate";

export default function UserInfo({ targetUser, loginUser, language }) {
    const [cookie, setCookie] = useState(null);
    const [edit, setEdit] = useState(false);
    const [image, setImage] = useState("");
    const [nickname, setNickname] = useState("");
    const [bio, setBio] = useState("");
    const inputRef = useRef(null);

    useEffect(() => {
        const runCookie = async () => {
            setCookie(await getCookie());
        };
        runCookie();
    }, []);

    const withdraw = async () => {
        if (confirm(language.withdrawAskMessage)) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER}/register/withdraw/${targetUser.id}`,
                {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${await getCookie()}`,
                    },
                }
            );
            const result = await response.json();
            alert(result.message && language.withdrawMessage);

            await deleteCookie();
        }
    };

    const saveEdit = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/profile/${targetUser.id}/edit`,
            {
                method: "put",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    image,
                    nickname,
                    bio,
                }),
            }
        );
        const result = await response.json();
        if (result.statusCode === 400) {
            alert(result.message && language.badEditMessage);
            return;
        }
        alert(result.message && language.saveEditMessage);
        targetUser.image = image;
        targetUser.nickname = nickname;
        setEdit(false);
    };

    const fileSelect = async (e) => {
        const file = e.target.files[0];
        if (!file.name) {
            return;
        }
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/image`,
            {
                method: "post",
                body: formData,
            }
        );
        const result = await response.json();
        setImage(result.image);
    };

    const editImage = () => {
        inputRef.current.click();
    };

    const editNickname = (e) => {
        setNickname(e.target.value);
    };

    useEffect(() => {
        if (edit) {
            setImage(image ? image : targetUser?.image);
            setNickname(nickname ? nickname : targetUser?.nickname);
        }
    }, [edit]);

    return (
        <>
            <div className={classes.title}>{language?.userInfo}</div>
            <div className={classes.box}>
                <div className={classes.user}>
                    <div className={classes["image-wrapper"]}>
                        {edit ? (
                            <>
                                <img
                                    className={classes["image-wrapper"]}
                                    src={image}
                                    onClick={editImage}
                                    style={{ cursor: "pointer" }}
                                />
                            </>
                        ) : (
                            <img
                                className={classes.image}
                                src={image ? image : targetUser?.image}
                            />
                        )}
                    </div>
                    <div className={classes.info}>
                        {edit ? (
                            <Input value={nickname} onChange={editNickname} />
                        ) : (
                            <div className={classes["user-text"]}>
                                <div>
                                    {nickname ? nickname : targetUser?.nickname}
                                </div>
                                <div className={classes["user-id"]}>
                                    @{targetUser?.id}
                                </div>
                            </div>
                        )}
                        <div className={classes.created}>
                            {targetUser?.createdAt
                                ? getDate(
                                      language?.locale,
                                      targetUser?.createdAt
                                  )
                                : language?.notExistUser}
                        </div>
                        {loginUser.wallet ? (
                            <div></div>
                        ) : (
                            <Button className="minimum">
                                {language?.connectMetamask}
                            </Button>
                        )}
                    </div>
                </div>
                {targetUser?.id ? (
                    targetUser?.id === loginUser?.id ? (
                        edit ? (
                            <div className={classes.buttons}>
                                <Button
                                    onClick={() => {
                                        setImage(targetUser?.image);
                                        setNickname(targetUser?.nickname);
                                        setEdit(false);
                                    }}
                                >
                                    {language?.cancel}
                                </Button>
                                <Button className="primary" onClick={saveEdit}>
                                    {language?.save}
                                </Button>
                            </div>
                        ) : (
                            <div className={classes.buttons}>
                                <Button onClick={() => setEdit(true)}>
                                    {language?.edit}
                                </Button>
                                <Button className="danger" onClick={withdraw}>
                                    {language?.withdraw}
                                </Button>
                            </div>
                        )
                    ) : cookie ? (
                        <Follow targetUser={targetUser} />
                    ) : (
                        <></>
                    )
                ) : (
                    <></>
                )}
            </div>
            <input
                type="file"
                accept="image/*"
                hidden
                ref={inputRef}
                onChange={fileSelect}
            />
        </>
    );
}
