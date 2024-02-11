"use client";

import classes from "./nft.module.css";
import Button from "@/components/button/button";
import Input from "@/components/input/input";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { languageState } from "../recoil/language";
import { messageState } from "../recoil/message";
import callRedirect from "@/function/server/callRedirect";

export default function NFT({ nft, idx, loginUser, web3, contract }) {
    const language = useRecoilValue(languageState);
    const setMessage = useSetRecoilState(messageState);
    const [price, setPrice] = useState(null);
    const priceRef = useRef();

    useEffect(() => {
        runTokenInfo();
    }, []);

    const runTokenInfo = async () => {
        console.log(nft.tokenID);
        if (nft.tokenID !== null) {
            const tokenInfo = await contract.methods
                .getTokenInfo(BigInt(nft.tokenID))
                .call();
            setPrice(tokenInfo.tokenPrice);
        }
    };

    const buyToken = async (idx) => {
        setMessage(
            <div>
                <div className={classes.message}>
                    {language?.processingTransaction}
                </div>
                <div className={classes.message}>{language?.pleaseWait}</div>
            </div>
        );

        await contract.methods.buyToken(idx).send({
            from: loginUser?.wallet,
            value: web3.utils.toWei(priceRef.current?.value, "ether"),
        });

        setMessage(
            <div className={classes.message}>
                {language?.completeTransaction}
            </div>
        );

        setTimeout(() => {
            setMessage(null);
        }, 1000);

        callRedirect("/profile");
    };

    return (
        <div className={classes["nft-wrapper"]}>
            <div className={classes.name}>{nft.name}</div>
            <div className={classes["image-wrapper"]}>
                <img
                    src={nft.image}
                    className={classes["main-content"]}
                    onClick={() => {
                        setMessage(
                            <img className={classes.image} src={nft.image} />
                        );
                    }}
                />
                {price ? (
                    <div className={classes.buy}>
                        <Input
                            placeholder={web3.utils.fromWei(price, "ether")}
                            ref={priceRef}
                        />
                        <Button className="buy" onClick={() => buyToken(idx)}>
                            {language?.buy}
                        </Button>
                    </div>
                ) : (
                    <div className={classes["not-nft"]}>{language?.notNFT}</div>
                )}
            </div>
            <textarea
                className={classes.description}
                value={nft.description}
                readOnly
            ></textarea>
        </div>
    );
}
