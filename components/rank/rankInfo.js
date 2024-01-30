"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../button/button";
import classes from "./rankInfo.module.css";
import Input from "../input/input";
import getCookie from "@/function/server/getCookie";
import callRedirect from "@/function/server/callRedirect";
import Row from "./row";

export default function RankInfo({
    targetUser,
    loginUser,
    language,
    rank,
    mousePosition,
}) {
    const [showAddRow, setShowAddRow] = useState(false);
    const [titleEdit, setTitleEdit] = useState(false);
    const [title, setTitle] = useState(rank.title);
    const [ranking, setRanking] = useState(rank.ranking.split("/"));
    const rowRef = useRef();
    const [moveRow, setMoveRow] = useState(null);
    const [positionRow, setPositionRow] = useState(null);

    const editTitle = (e) => {
        setTitle(e.target.value);
    };

    const editRank = async (e) => {
        e?.preventDefault();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/rank/${rank.id}`,
            {
                method: "put",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                    "Content-type": "Application/json",
                },
                body: JSON.stringify({ title, ranking: ranking.join("/") }),
            }
        );
        const result = await response.json();
        if (response.ok) {
            callRedirect("/");
        }
    };

    const deleteRank = async () => {
        if (confirm(language?.deleteAskMessage)) {
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
                callRedirect("/");
            }
            alert(language?.deleteMessage);
        }
    };

    const addRow = async (e) => {
        e.preventDefault();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/rank/${rank.id}`,
            {
                method: "post",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                    "Content-type": "Application/json",
                },
                body: JSON.stringify({ content: rowRef.current.value }),
            }
        );
        const { row } = await response.json();

        if (response.ok) {
            const newRanking = [...ranking];
            newRanking.push(row.id.toString());
            setRanking(newRanking.filter((item) => item.length));
        }
    };

    useEffect(() => {
        if (rank.ranking !== ranking.join("/")) {
            editRank();
        }
    }, [ranking]);

    useEffect(() => {
        if (positionRow) {
            const newRanking = [...ranking];
            const moveRanking = newRanking.splice(positionRow.from, 1);
            newRanking.splice(positionRow.to, 0, moveRanking);
            setRanking(newRanking);
        }
    }, [positionRow]);

    return (
        <div
            className={classes.rank}
            onMouseUp={() => setMoveRow(null)}
            style={
                moveRow
                    ? {
                          userSelect: "none",
                      }
                    : {}
            }
        >
            <div style={{ width: "100%" }}>
                <div className={classes["rank-title-wrapper"]}>
                    {titleEdit ? (
                        <div className={classes.edit}>
                            <form className={classes.form}>
                                <Input value={title} onChange={editTitle} />
                                <div className={classes["form-button-wrapper"]}>
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
                        <div className={classes["title-wrapper"]}>
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
                        </div>
                    )}
                </div>
                <div className={classes.separator}></div>
                {ranking?.map((rankRow, idx) => (
                    <div key={`rankRow-${idx}`}>
                        {rank.rows?.map(
                            (row) =>
                                rankRow === row.id.toString() && (
                                    <div
                                        key={`row-${idx}`}
                                        className={classes["row-wrapper"]}
                                        style={
                                            moveRow !== null
                                                ? {
                                                      marginBottom: 10,
                                                  }
                                                : {}
                                        }
                                    >
                                        {moveRow !== null && moveRow > idx ? (
                                            <div
                                                className={classes["move-row"]}
                                                onMouseLeave={() =>
                                                    setPositionRow(null)
                                                }
                                                onMouseUp={() => {
                                                    setPositionRow({
                                                        from: moveRow,
                                                        to: idx,
                                                    });
                                                }}
                                            ></div>
                                        ) : (
                                            <></>
                                        )}
                                        <Row
                                            className={
                                                idx < 3 ? `row${idx}` : "row"
                                            }
                                            rank={rank}
                                            row={row}
                                            targetUser={targetUser}
                                            loginUser={loginUser}
                                            language={language}
                                            ranking={ranking}
                                            setRanking={setRanking}
                                            idx={idx}
                                            moveRow={moveRow}
                                            setMoveRow={setMoveRow}
                                        />
                                        {moveRow === idx && (
                                            <div
                                                className={classes.move}
                                                style={{
                                                    position: "absolute",
                                                    left: `${
                                                        mousePosition.x + 10
                                                    }px`,
                                                    top: `${
                                                        mousePosition.y + 10
                                                    }px`,
                                                }}
                                            >
                                                {row.content}
                                            </div>
                                        )}
                                        {moveRow !== null && moveRow < idx ? (
                                            <div
                                                className={classes["move-row"]}
                                                onMouseLeave={() =>
                                                    setPositionRow(null)
                                                }
                                                onMouseUp={() => {
                                                    setPositionRow({
                                                        from: moveRow,
                                                        to: idx,
                                                    });
                                                }}
                                            ></div>
                                        ) : (
                                            <></>
                                        )}
                                    </div>
                                )
                        )}
                    </div>
                ))}
                {targetUser?.id === loginUser?.id &&
                    (showAddRow ? (
                        <form className={classes.form}>
                            <Input ref={rowRef} />
                            <div className={classes["form-button-wrapper"]}>
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
