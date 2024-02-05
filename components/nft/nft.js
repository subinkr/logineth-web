"use client";

import classes from "./nft.module.css";
import Button from "@/components/button/button";
import Input from "@/components/input/input";
import { useRef } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { languageState } from "../recoil/language";
import { messageState } from "../recoil/message";

export default function NFT({
    nft,
    idx,
    loginUser,
    prices,
    descriptions,
    web3,
    contract,
}) {
    const language = useRecoilValue(languageState);
    const setMessage = useSetRecoilState(messageState);
    const priceRef = useRef();

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
            from: loginUser.wallet,
            value: web3.utils.toWei(priceRef.current?.value, "ether"),
        });
    };

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
                    placeholder={web3.utils.fromWei(prices[idx], "ether")}
                    ref={priceRef}
                />
                <Button className="buy" onClick={() => buyToken(idx)}>
                    {language?.buy}
                </Button>
            </div>
            <div className={classes.description}>{descriptions[idx]}</div>
        </div>
    );
}
