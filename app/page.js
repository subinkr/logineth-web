"use client";

import classes from "./page.module.css";
import { useEffect, useRef, useState } from "react";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import callRedirect from "@/function/server/callRedirect";
import checkLoginUser from "@/function/client/checkLoginUser";
import Button from "@/components/button/button";
import Input from "@/components/input/input";
import { messageState } from "@/components/recoil/message";
import { languageState } from "@/components/recoil/language";
import useWeb3 from "@/function/client/web3";

export default function Home() {
    const [web3, contract] = useWeb3();
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const language = useRecoilValue(languageState);
    const setMessage = useSetRecoilState(messageState);
    const [nfts, setNfts] = useState([]);
    const [descriptions, setDescriptions] = useState([]);
    const [prices, setPrices] = useState([]);
    const priceRef = useRef();

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
                    <div key={idx} className={classes["image-wrapper"]}>
                        <img
                            width={300}
                            src={nft}
                            className={classes["main-content"]}
                            onClick={() => {
                                setMessage(<img width={"50%"} src={nft} />);
                            }}
                        />
                        <div className={classes.buy}>
                            <Input
                                placeholder={web3.utils.fromWei(
                                    prices[idx],
                                    "ether"
                                )}
                                ref={priceRef}
                            />
                            <Button
                                className="buy"
                                onClick={() => buyToken(idx)}
                            >
                                {language?.buy}
                            </Button>
                        </div>
                        <div className={classes.description}>
                            {descriptions[idx]}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
