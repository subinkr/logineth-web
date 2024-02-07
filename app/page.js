"use client";

import classes from "./page.module.css";
import { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import checkLoginUser from "@/function/client/checkLoginUser";
import useWeb3 from "@/function/client/web3";
import NFT from "@/components/nft/nft";
import { languageState } from "@/components/recoil/language";

export default function Home() {
    const [web3, contract] = useWeb3();
    const language = useRecoilValue(languageState);
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [nfts, setNfts] = useState([]);
    const [names, setNames] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [prices, setPrices] = useState([]);

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
            runNFTs();
        }
    }, [contract]);

    const runNFTs = async () => {
        const nfts = await contract.methods.getTokenURIs().call();
        const prices = await contract.methods.getTokenPrices().call();

        const newNfts = [];
        const newNames = [];
        const newDescriptions = [];
        for (let i = 0; i < nfts.length; i++) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_IPFS_PATH}${nfts[i]}`,
                {
                    method: "get",
                }
            );
            const result = await response.json();
            newNfts.push(result.image);
            newNames.push(result.name);
            newDescriptions.push(result.description);
        }
        setNfts(newNfts);
        setNames(newNames);
        setDescriptions(newDescriptions);
        setPrices(prices);
    };

    return (
        <div className={classes["main-area"]}>
            <div className={classes.title}>{language?.allNfts}</div>
            {window.ethereum ? (
                <div className={classes.gallery}>
                    {nfts.map((nft, idx) => {
                        return (
                            <NFT
                                key={idx}
                                nft={nft}
                                idx={idx}
                                loginUser={loginUser}
                                price={prices[idx]}
                                name={names[idx]}
                                description={descriptions[idx]}
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
