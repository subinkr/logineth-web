"use client";

import { profileState } from "@/components/recoil/profile";
import classes from "./nfts.module.css";
import { languageState } from "@/components/recoil/language";
import useWeb3 from "@/function/client/web3";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

export default function NFTs() {
    const [web3, contract] = useWeb3();
    const loginUser = useRecoilValue(profileState);
    const language = useRecoilValue(languageState);
    const [nfts, setNfts] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [owners, setOwners] = useState([]);
    const [prices, setPrices] = useState([]);

    useEffect(() => {
        if (contract) {
            runNFTs();
        }
    }, [contract]);

    const runNFTs = async () => {
        const nfts = await contract.methods.getTokenURIs().call();
        const owners = await contract.methods.getOwners().call();
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
        setOwners(owners);
        setPrices(prices);
        console.log(owners);
        console.log(loginUser.wallet);
    };

    return (
        <>
            <div className={classes.title}>NFTs</div>
            <div className={classes.nfts}>
                {owners.map((owner, idx) => {
                    if (owner.toLowerCase() === loginUser.wallet) {
                        return (
                            <img
                                className={classes.image}
                                key={idx}
                                src={nfts[idx]}
                            />
                        );
                    }
                })}
            </div>
        </>
    );
}
