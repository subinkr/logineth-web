"use client";

import classes from "./rank.module.css";
import Button from "../button/button";
import { useEffect, useState } from "react";

export default function Rank({ targetUser, loginUser, language }) {
    const [ranks, setRanks] = useState([]);

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

    return (
        <>
            {ranks.length ? (
                <>
                    <div className={classes.title}>{language?.rank}</div>
                </>
            ) : (
                <>
                    {targetUser?.id === loginUser?.id && (
                        <div className={classes.title}>{language?.rank}</div>
                    )}
                </>
            )}
            {targetUser?.id === loginUser?.id && (
                <Button className="add">+</Button>
            )}
        </>
    );
}
