"use client";

import classes from "./nfts.module.css";
import useWeb3 from "@/function/client/web3";
import { useEffect, useState } from "react";
import NFT from "@/components/nft/nft";

export default function NFTs({ targetUser, loginUser }) {
    const [web3, contract] = useWeb3();
    const [nfts, setNfts] = useState([]);
    const [names, setNames] = useState([]);
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
        setOwners(owners);
        setPrices(prices);
    };

    return (
        <>
            <div className={classes.title}>NFTs</div>
            <div className={classes.nfts}>
                {owners.map((owner, idx) => {
                    if (owner.toLowerCase() === targetUser.wallet) {
                        return (
                            <NFT
                                key={idx}
                                nft={nfts[idx]}
                                idx={idx}
                                loginUser={loginUser}
                                price={prices[idx]}
                                name={names[idx]}
                                description={descriptions[idx]}
                                web3={web3}
                                contract={contract}
                            />
                        );
                    }
                })}
            </div>
        </>
    );
}
