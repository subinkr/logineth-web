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
    const ranksRef = useRef();
    const rowRef = useRef();

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        titleRef.current?.focus();
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
            setRanks([result.rank, ...ranks]);
            setShowCreateRank(!showCreateRank);
            titleRef.current.value = "";
            ranksRef.current.scrollLeft = 0;
        } else {
            alert(result.message);
        }
    };

    return (
        <>
            <div className={classes.title}>{language?.rank}</div>
            <>
                <div ref={ranksRef} className={classes["rank-wrapper"]}>
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
                                            className="default"
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
                    {ranks.map((rank, idx) => (
                        <RankInfo
                            key={`rank-${idx}`}
                            targetUser={targetUser}
                            loginUser={loginUser}
                            language={language}
                            rank={rank}
                            ranks={ranks}
                            setRanks={setRanks}
                            ranksRef={ranksRef}
                        />
                    ))}
                </div>
            </>
        </>
    );
}
