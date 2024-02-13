"use client";

import classes from "./boards.module.css";
import useWeb3 from "@/function/client/web3";
import { useEffect, useState } from "react";
import Board from "@/components/board/board";

export default function NFTs({ targetUser, loginUser, language, mainRef }) {
    const [web3, contract] = useWeb3();
    const [nftInfos, setNftInfos] = useState({});
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        if (window.ethereum && contract) {
            runBoards();
        }
    }, [contract]);

    useEffect(() => {
        if (
            nftInfos.nextPage &&
            scroll + window.innerHeight > mainRef.current.scrollHeight + 60
        ) {
            runBoards(nftInfos.nextPage);
        }
    }, [scroll]);

    const runBoards = async (page = 1) => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/board?user=${targetUser.id}&nft=false&page=${page}`,
            {
                method: "get",
            }
        );
        const newNftInfos = await response.json();

        setNftInfos(newNftInfos);
        setBoards([...boards, ...newNftInfos.boards]);
    };

    return (
        <>
            <div className={classes.title}>{language?.Boards}</div>
            {contract ? (
                <div className={classes.gallery}>
                    {boards.map((board, idx) => {
                        return (
                            <Board
                                key={idx}
                                board={board}
                                loginUser={loginUser}
                                web3={web3}
                                contract={contract}
                            />
                        );
                    })}
                </div>
            ) : (
                <div>{language?.requireMetamask}</div>
            )}
        </>
    );
}
