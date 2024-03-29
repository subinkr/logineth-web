"use client";

import classes from "./rank.module.css";
import Button from "@/components/button/button";
import Input from "@/components/input/input";
import RankInfo from "@/components/rank/rankInfo";
import getCookie from "@/function/server/getCookie";
import { useEffect, useRef, useState } from "react";

export default function Rank({ targetUser, loginUser, language }) {
    const [ranks, setRanks] = useState([]);
    const [showCreateRank, setShowCreateRank] = useState(false);
    const titleRef = useRef();
    const [mousePosition, setMousePosition] = useState(null);

    const callback = (e) => {
        setMousePosition({ x: e.pageX, y: e.pageY });
    };

    useEffect(() => {
        document.addEventListener("mousemove", callback);

        return () => {
            document.removeEventListener("mousemove", callback);
        };
    }, [mousePosition]);

    useEffect(() => {
        if (showCreateRank) {
            titleRef.current?.focus();
        } else {
            const runRanks = async () => {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_SERVER}/rank/${targetUser?.id}`,
                    {
                        method: "get",
                    }
                );
                const result = await response.json();
                setRanks(result.ranks);
            };

            runRanks();
        }
    }, [showCreateRank]);

    const createRank = async (e) => {
        e.preventDefault();

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/rank`,
            {
                method: "post",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: titleRef.current.value }),
            }
        );
        const result = await response.json();
        if (response.ok) {
            setRanks([{ ...result.rank, rows: [] }, ...ranks]);
            setShowCreateRank(!showCreateRank);
        } else {
            alert(result.message);
        }
    };

    return (
        <>
            <div className={classes.title}>{language?.rank}</div>
            <div className={classes["rank-area"]}>
                <div className={classes["rank-wrapper"]}>
                    <div
                        style={
                            (window.innerWidth - 920) / 2 - 16 >
                            window.innerWidth / 20 - 16
                                ? {
                                      width: (window.innerWidth - 920) / 2 - 16,
                                  }
                                : {
                                      width: window.innerWidth / 20 - 16,
                                  }
                        }
                    ></div>
                    {targetUser?.id === loginUser?.id &&
                        (showCreateRank ? (
                            <div className={classes["create-rank"]}>
                                <form className={classes.form}>
                                    <Input ref={titleRef} />
                                    <div
                                        className={classes["button-wrapper"]}
                                        style={{ marginTop: "10px" }}
                                    >
                                        <Button
                                            onClick={() =>
                                                setShowCreateRank(
                                                    !showCreateRank
                                                )
                                            }
                                        >
                                            {language?.cancel}
                                        </Button>
                                        <Button
                                            type="submit"
                                            className="primary"
                                            onClick={createRank}
                                        >
                                            {language?.save}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <Button
                                className="add"
                                onClick={() =>
                                    setShowCreateRank(!showCreateRank)
                                }
                            >
                                +
                            </Button>
                        ))}
                    {ranks.map((rank, idx) => {
                        return (
                            <div key={`rank-${rank.id}`}>
                                <RankInfo
                                    targetUser={targetUser}
                                    loginUser={loginUser}
                                    language={language}
                                    rank={rank}
                                    mousePosition={mousePosition}
                                    idx={idx}
                                    ranks={ranks}
                                    setRanks={setRanks}
                                />
                            </div>
                        );
                    })}
                    <div
                        style={
                            (window.innerWidth - 920) / 2 - 16 >
                            window.innerWidth / 20 - 16
                                ? {
                                      width: (window.innerWidth - 920) / 2 - 16,
                                  }
                                : {
                                      width: window.innerWidth / 20 - 16,
                                  }
                        }
                    ></div>
                </div>
            </div>
        </>
    );
}
