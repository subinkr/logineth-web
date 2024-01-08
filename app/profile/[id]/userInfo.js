"use client";

import Button from "@/components/button/button";
import classes from "./userInfo.module.css";
import getCookie from "@/function/server/getCookie";
import deleteCookie from "@/function/server/deleteCookie";
import { useEffect, useRef, useState } from "react";
import Input from "@/components/input/input";

export default function UserInfo({ profile, loginUser }) {
    const [edit, setEdit] = useState(false);
    const [image, setImage] = useState("");
    const [nickname, setNickname] = useState("");
    const [bio, setBio] = useState("");
    const inputRef = useRef(null);

    const withdraw = async () => {
        if (confirm("탈퇴하시겠습니까? 데이터는 복구할 수 없습니다.")) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER}/register/withdraw/${profile.id}`,
                {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${await getCookie()}`,
                    },
                }
            );
            const result = await response.json();
            alert(result.message);

            await deleteCookie();
        }
    };

    const saveEdit = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/profile/${profile.id}/edit`,
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
        setEdit(false);

        alert(result.message);
    };

    const fileSelect = async (e) => {
        const file = e.target.files[0];
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
            setImage(image ? image : profile?.image);
            setNickname(nickname ? nickname : profile?.nickname);
        }
    }, [edit]);

    return (
        <>
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
                                src={image ? image : profile?.image}
                            />
                        )}
                    </div>
                    <div className={classes.info}>
                        {edit ? (
                            <Input value={nickname} onChange={editNickname} />
                        ) : (
                            <div>{nickname ? nickname : profile?.nickname}</div>
                        )}
                        <div className={classes.created}>
                            {profile?.createdAt
                                ? new Date(
                                      Date.parse(profile?.createdAt)
                                  ).toLocaleDateString(undefined, {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                  })
                                : "User not exist"}
                        </div>
                    </div>
                </div>
                {profile?.id ? (
                    profile?.id === loginUser?.id ? (
                        edit ? (
                            <div className={classes.buttons}>
                                <Button onClick={() => setEdit(false)}>
                                    Cancel
                                </Button>
                                <Button type="primary" onClick={saveEdit}>
                                    Save
                                </Button>
                            </div>
                        ) : (
                            <div className={classes.buttons}>
                                <Button onClick={() => setEdit(true)}>
                                    Edit
                                </Button>
                                <Button type="danger" onClick={withdraw}>
                                    Withdraw
                                </Button>
                            </div>
                        )
                    ) : (
                        <>
                            <Button>Follow</Button>
                        </>
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
