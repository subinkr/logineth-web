"use client";

import classes from "./page.module.css";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import checkLoginUser from "@/function/client/checkLoginUser";
import useWeb3 from "@/function/client/web3";
import NFT from "@/components/nft/nft";

export default function Home() {
    const [web3, contract] = useWeb3();
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [nfts, setNfts] = useState([]);
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
        if (contract) {
            runNFTs();
        }
    }, [contract]);

    const runNFTs = async () => {
        const nfts = await contract.methods.getTokenURIs().call();
        const prices = await contract.methods.getTokenPrices().call();

        const newNfts = [];
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
            newDescriptions.push(result.description);
        }
        setNfts(newNfts);
        setDescriptions(newDescriptions);
        setPrices(prices);
    };

    return (
        <div className={classes.gallery}>
            {nfts.map((nft, idx) => {
                return (
                    <NFT
                        key={idx}
                        nft={nft}
                        idx={idx}
                        loginUser={loginUser}
                        prices={prices}
                        descriptions={descriptions}
                        web3={web3}
                        contract={contract}
                    />
                );
            })}
        </div>
    );
}
