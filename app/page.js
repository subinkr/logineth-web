"use client";

import classes from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import checkLoginUser from "@/function/client/checkLoginUser";
import useWeb3 from "@/function/client/web3";
import Board from "@/components/board/board";
import { languageState } from "@/components/recoil/language";
import { scrollState } from "@/components/recoil/scroll";

export default function Home() {
    const [web3, contract] = useWeb3();
    const scroll = useRecoilValue(scrollState);
    const language = useRecoilValue(languageState);
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [nftInfos, setNftInfos] = useState({});
    const [boards, setBoards] = useState([]);
    const mainRef = useRef();

    useEffect(() => {
        checkLoginUser(setLoginUser);
    }, []);

    useEffect(() => {
        const setRedirect = async () => {
            if (!loginUser.id) {
                callRedirect("/about");
            }
        };

        setRedirect();
    }, [loginUser]);

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
            `${process.env.NEXT_PUBLIC_API_SERVER}/board?nft=false&page=${page}`,
            {
                method: "get",
            }
        );
        const newNftInfos = await response.json();
        console.log(newNftInfos);

        setNftInfos(newNftInfos);
        setBoards([...boards, ...newNftInfos.boards]);
    };

    // useEffect(() => {
    //     if (window.ethereum && contract) {
    //         runNFTs();
    //     }
    // }, [contract]);

    // const runNFTs = async () => {
    //     const nfts = await contract.methods.getTokenURIs().call();
    //     const prices = await contract.methods.getTokenPrices().call();

    //     const newNfts = [];
    //     const newNames = [];
    //     const newDescriptions = [];
    //     for (let i = 0; i < nfts.length; i++) {
    //         const response = await fetch(
    //             `${process.env.NEXT_PUBLIC_IPFS_PATH}${nfts[i]}`,
    //             {
    //                 method: "get",
    //             }
    //         );
    //         const result = await response.json();
    //         newNfts.push(result.image);
    //         newNames.push(result.name);
    //         newDescriptions.push(result.description);
    //     }
    //     setNfts(newNfts);
    //     setNames(newNames);
    //     setDescriptions(newDescriptions);
    //     setPrices(prices);
    // };

    return (
        <div className={classes["main-area"]} ref={mainRef}>
            <div className={classes.title}>{language?.allBoards}</div>
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
                <>{language?.requireMetamask}</>
            )}
        </div>
    );
}
