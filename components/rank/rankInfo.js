"use client";

import { useRef, useState } from "react";
import Button from "../button/button";
import classes from "./rankInfo.module.css";
import Input from "../input/input";
import getCookie from "@/function/server/getCookie";

export default function RankInfo({
    targetUser,
    loginUser,
    language,
    rank,
    ranks,
    setRanks,
    ranksRef,
}) {
    const [showAddRow, setShowAddRow] = useState(false);
    const [titleEdit, setTitleEdit] = useState(false);
    const [title, setTitle] = useState(rank.title);
    const [ranking, setRanking] = useState(rank.ranking);
    const rowRef = useRef();

    const editTitle = (e) => {
        setTitle(e.target.value);
    };

    const editRank = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/rank/${rank.id}`,
            {
                method: "put",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                    "Content-type": "Application/json",
                },
                body: JSON.stringify({ title, ranking }),
            }
        );
        const result = await response.json();
        if (response.ok) {
            setTitleEdit(!titleEdit);
            rank.title = title;
        }
    };

    const deleteRank = async () => {
        if (confirm("삭제하시겠습니까?")) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER}/rank/${rank.id}`,
                {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${await getCookie()}`,
                    },
                }
            );
            const result = await response.json();
            if (response.ok) {
                const rankIdx = ranks.findIndex((item) => item.id === rank.id);
                const newRanks = [...ranks];
                newRanks.splice(rankIdx, 1);
                setRanks(newRanks);
                ranksRef.current.scrollLeft = 0;
            }
            alert(result.message);
        }
    };

    const addRow = async (e) => {
        e.preventDefault();
    };

    const editRow = async (rowID) => {};

    const deleteRow = async (rowID) => {};

    return (
        <div className={classes.rank}>
            <div style={{ width: "100%" }}>
                <div className={classes["rank-title-wrapper"]}>
                    {titleEdit ? (
                        <div className={classes.edit}>
                            <form className={classes.form}>
                                <Input value={title} onChange={editTitle} />
                                <div className={classes["button-wrapper"]}>
                                    <Button
                                        className="default"
                                        onClick={() => {
                                            setTitleEdit(!titleEdit);
                                            setTitle(rank.title);
                                        }}
                                    >
                                        {language?.cancel}
                                    </Button>
                                    <Button
                                        type="submit"
                                        className="primary"
                                        onClick={editRank}
                                    >
                                        {language?.save}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    ) : (
                        <>
                            <div className={classes.title}>{rank.title}</div>
                            {targetUser?.id === loginUser?.id && (
                                <div className={classes["button-wrapper"]}>
                                    <Button
                                        className="none"
                                        onClick={() => setTitleEdit(!titleEdit)}
                                    >
                                        📝
                                    </Button>
                                    <Button
                                        className="none"
                                        onClick={deleteRank}
                                    >
                                        🗑️
                                    </Button>
                                </div>
                            )}
                        </>
                    )}
                </div>
                <div className={classes.separator}></div>
                {rank.rows?.map((row, idx) => (
                    <div key={`row-${idx}`} className={classes["row-wrapper"]}>
                        {row.content}
                        <Button
                            className="none"
                            onClick={() => editRow(row.id)}
                        >
                            📝
                        </Button>
                        <Button
                            className="none"
                            onClick={() => deleteRow(row.id)}
                        >
                            🗑️
                        </Button>
                    </div>
                ))}
                {targetUser?.id === loginUser?.id &&
                    (showAddRow ? (
                        <form className={classes.form}>
                            <Input ref={rowRef} />
                            <div className={classes["button-wrapper"]}>
                                <Button
                                    className="default"
                                    onClick={() => setShowAddRow(!showAddRow)}
                                >
                                    {language?.cancel}
                                </Button>
                                <Button
                                    type="submit"
                                    className="primary"
                                    onClick={addRow}
                                >
                                    {language?.save}
                                </Button>
                            </div>
                        </form>
                    ) : (
                        <Button
                            className="row-add"
                            onClick={() => setShowAddRow(!showAddRow)}
                        >
                            +
                        </Button>
                    ))}
            </div>
        </div>
    );
}
