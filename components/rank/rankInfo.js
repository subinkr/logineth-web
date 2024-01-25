"use client";

import { useRef, useState } from "react";
import Button from "../button/button";
import classes from "./rankInfo.module.css";
import Input from "../input/input";

export default function RankInfo({
    targetUser,
    loginUser,
    language,
    rank,
    ranks,
}) {
    const [showAddRow, setShowAddRow] = useState(false);
    const rowRef = useRef();

    const editRank = async (rankID) => {};

    const deleteRank = async (rankID) => {
        if (confirm("삭제하시겠습니까?")) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER}/rank/${rankID}`,
                {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${await getCookie()}`,
                    },
                }
            );
            const result = await response.json();
            if (response.ok) {
                const rankIdx = ranks.findIndex((rank) => rank.id === rankID);
                const newRanks = [...ranks];
                newRanks.splice(rankIdx, 1);
                setRanks(newRanks);
                ranksRef.current.scrollLeft = 0;
            }
            alert(result.message);
        }
    };

    const addRow = async (rankID) => {};

    const editRow = async (rowID) => {};

    const deleteRow = async (rowID) => {};

    return (
        <div className={classes.rank}>
            <div style={{ width: "100%" }}>
                <div className={classes["rank-title-wrapper"]}>
                    <div>{rank.title}</div>
                    {targetUser?.id === loginUser?.id && (
                        <div className={classes["button-wrapper"]}>
                            <Button
                                className="none"
                                onClick={() => editRank(rank.id)}
                            >
                                📝
                            </Button>
                            <Button
                                className="none"
                                onClick={() => deleteRank(rank.id)}
                            >
                                🗑️
                            </Button>
                        </div>
                    )}
                </div>
                <div className={classes.separator}></div>
                {rank.rows.map((row, idx) => (
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
                            <div
                                className={classes["button-wrapper"]}
                                style={{ marginTop: "10px" }}
                            >
                                <Button
                                    className="default"
                                    onClick={() => setShowAddRow(!showAddRow)}
                                >
                                    {language?.cancel}
                                </Button>
                                <Button
                                    type="submit"
                                    className="primary"
                                    onClick={() => addRow(rank.id)}
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
