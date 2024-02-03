"use client";

import { useState } from "react";
import Button from "../button/button";
import classes from "./row.module.css";
import getCookie from "@/function/server/getCookie";
import Input from "../input/input";

export default function Row({
    className,
    rank,
    row,
    targetUser,
    loginUser,
    language,
    ranking,
    setRanking,
    idx,
    setMoveRow,
}) {
    const [edit, setEdit] = useState(false);
    const [content, setContent] = useState(row.content);

    const editContent = (e) => {
        setContent(e.target.value);
    };

    const editRow = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/rank/${rank.id}/${row.id}`,
            {
                method: "put",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                    "Content-Type": "Application/json",
                },
                body: JSON.stringify({ content }),
            }
        );
        const result = await response.json();
        row.content = content;
        setEdit(!edit);
    };

    const deleteRow = async () => {
        if (confirm(language?.deleteAskMessage)) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER}/rank/${rank.id}/${row.id}`,
                {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${await getCookie()}`,
                    },
                }
            );
            const result = await response.json();
            if (result.message) {
                const idx = ranking.findIndex(
                    (rankID) => rankID === row.id.toString()
                );
                const newRanking = [...ranking];
                newRanking.splice(idx, 1);
                setRanking(newRanking);
                alert(language?.deleteMessage);
            }
        }
    };

    return (
        <div className={classes[className]}>
            {edit ? (
                <form className={classes.form}>
                    <Input value={content} onChange={editContent} />
                    <div className={classes["form-button-wrapper"]}>
                        <Button
                            onClick={() => {
                                setContent(row.content);
                                setEdit(!edit);
                            }}
                        >
                            {language?.cancel}
                        </Button>
                        <Button
                            type="submit"
                            className="primary"
                            onClick={editRow}
                        >
                            {language?.save}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className={classes["row-area"]}>
                    <div
                        className={classes.move}
                        onMouseDown={() => setMoveRow(idx)}
                    >
                        ↕
                    </div>
                    <div className={classes["row-content"]}>{content}</div>
                    {targetUser?.id === loginUser?.id && (
                        <div className={classes["button-wrapper"]}>
                            <Button
                                className="none"
                                onClick={() => setEdit(!edit)}
                            >
                                📝
                            </Button>
                            <Button className="none" onClick={deleteRow}>
                                🗑️
                            </Button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
