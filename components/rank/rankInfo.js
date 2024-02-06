"use client";

import { useEffect, useRef, useState } from "react";
import Button from "../button/button";
import classes from "./rankInfo.module.css";
import Input from "../input/input";
import getCookie from "@/function/server/getCookie";
import Row from "./row";

export default function RankInfo({
    targetUser,
    loginUser,
    language,
    rank,
    mousePosition,
    idx,
    ranks,
    setRanks,
}) {
    const [showAddRow, setShowAddRow] = useState(false);
    const [deleteRow, setDeleteRow] = useState(false);
    const [titleEdit, setTitleEdit] = useState(false);
    const [title, setTitle] = useState(rank.title);
    const [ranking, setRanking] = useState(rank.ranking.split("/"));
    const [rows, setRows] = useState(rank.rows);
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

        if (response.ok) {
            setPositionRow(null);
            rank.title = title;
            setTitleEdit(false);
            setShowAddRow(false);
            setDeleteRow(false);
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
                const newRanks = [...ranks];
                newRanks.splice(idx, 1);
                setRanks(newRanks);
                alert(language?.deleteMessage);
            }
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
            setRows([...rows, row]);
        }
    };

    useEffect(() => {
        if (titleEdit || showAddRow || deleteRow || positionRow) {
            editRank();
        }
    }, [ranking]);

    useEffect(() => {
        if (moveRow === null && positionRow) {
            const newRanking = [...ranking];
            const newRows = [...rows];
            const [moveRanking] = newRanking.splice(positionRow.from, 1);
            const [targetRow] = newRows.splice(positionRow.from, 1);
            newRanking.splice(positionRow.to, 0, moveRanking);
            newRows.splice(positionRow.to, 0, targetRow);
            setRanking(newRanking);
            setRows(newRows);
        }
    }, [moveRow]);

    return (
        <div className={classes.rank} onMouseUp={() => setMoveRow(null)}>
            <div style={{ width: "100%" }}>
                <div
                    className={classes["rank-title-wrapper"]}
                    style={
                        moveRow !== null
                            ? {
                                  marginBottom: 0,
                              }
                            : {}
                    }
                >
                    {titleEdit ? (
                        <div className={classes.edit}>
                            <form className={classes.form}>
                                <Input value={title} onChange={editTitle} />
                                <div className={classes["form-button-wrapper"]}>
                                    <Button
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
                        {rows?.map(
                            (row) =>
                                rankRow === row.id.toString() && (
                                    <div
                                        key={`row-${row.id}`}
                                        className={classes["row-wrapper"]}
                                        style={
                                            moveRow !== null
                                                ? {
                                                      marginBottom: 0,
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
                                            <>
                                                {moveRow === idx ? (
                                                    <div
                                                        style={
                                                            moveRow !== null
                                                                ? {
                                                                      marginBottom:
                                                                          "20px",
                                                                  }
                                                                : {}
                                                        }
                                                    ></div>
                                                ) : (
                                                    <></>
                                                )}
                                            </>
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
                                            setDeleteRow={setDeleteRow}
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
                                            <>
                                                {moveRow === idx ? (
                                                    <div
                                                        style={
                                                            moveRow !== null
                                                                ? {
                                                                      marginBottom:
                                                                          "20px",
                                                                  }
                                                                : {}
                                                        }
                                                    ></div>
                                                ) : (
                                                    <></>
                                                )}
                                            </>
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
