"use client";

import classes from "./nfts.module.css";
import useWeb3 from "@/function/client/web3";
import { useState } from "react";
import Board from "@/components/board/board";

export default function NFTs({ targetUser, loginUser, language }) {
    const [web3, contract] = useWeb3();
    const [nfts, setNfts] = useState([]);
    const [names, setNames] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [owners, setOwners] = useState([]);
    const [prices, setPrices] = useState([]);

    // useEffect(() => {
    //     if (window.ethereum && contract) {
    //         runNFTs();
    //     }
    // }, [contract]);

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
            {contract ? (
                <div className={classes.nfts}>
                    {/* {owners.map((owner, idx) => {
                        if (owner.toLowerCase() === targetUser.wallet) {
                            return (
                                <Board
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
                    })} */}
                </div>
            ) : (
                <div>{language?.requireMetamask}</div>
            )}
        </>
    );
}
