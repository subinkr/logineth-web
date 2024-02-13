"use client";

import classes from "./board.module.css";
import Button from "@/components/button/button";
import Input from "@/components/input/input";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { languageState } from "../recoil/language";
import { messageState } from "../recoil/message";
import callRedirect from "@/function/server/callRedirect";

export default function Board({ board, loginUser, web3, contract }) {
    const language = useRecoilValue(languageState);
    const setMessage = useSetRecoilState(messageState);
    const [price, setPrice] = useState(null);
    const priceRef = useRef();

    useEffect(() => {
        runTokenInfo();
    }, []);

    const runTokenInfo = async () => {
        if (board.tokenID !== null) {
            const tokenInfo = await contract.methods
                .getTokenInfo(BigInt(board.tokenID))
                .call();
            setPrice(tokenInfo.tokenPrice);
        } else {
            setPrice(0);
        }
    };

    const buyToken = async () => {
        setMessage(
            <div>
                <div className={classes.message}>
                    {language?.processingTransaction}
                </div>
                <div className={classes.message}>{language?.pleaseWait}</div>
            </div>
        );

        await contract.methods.buyToken(board.tokenID).send({
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
            <div
                className={classes.profile}
                onClick={() =>
                    callRedirect(`/profile/${board.__originalAuthor__.id}`)
                }
            >
                <img
                    className={classes["profile-image"]}
                    src={board.__originalAuthor__.image}
                />
                <div>{board.__originalAuthor__.nickname}</div>
            </div>
            <div className={classes["image-wrapper"]}>
                <img
                    src={board.image}
                    className={classes["main-content"]}
                    onClick={() => {
                        setMessage(
                            <img className={classes.image} src={board.image} />
                        );
                    }}
                />
                {price === null ? (
                    <div className={classes["board-info"]}>
                        {language?.loading}
                    </div>
                ) : price ? (
                    <div className={classes.buy}>
                        <Input
                            placeholder={web3.utils.fromWei(price, "ether")}
                            ref={priceRef}
                        />
                        <Button className="buy" onClick={buyToken}>
                            {language?.buy}
                        </Button>
                    </div>
                ) : (
                    <div className={classes["board-info"]}>
                        {language?.notNFT}
                    </div>
                )}
            </div>
            <div className={classes.name}>{board.name}</div>
            <textarea
                className={classes.description}
                value={board.description}
                readOnly
            ></textarea>
        </div>
    );
}
