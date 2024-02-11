"use client";

import { v4 as UUID } from "uuid";
import Input from "@/components/input/input";
import classes from "./page.module.css";
import { messageState } from "@/components/recoil/message";
import { useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Textarea from "@/components/textarea/textarea";
import { profileState } from "@/components/recoil/profile";
import { languageState } from "@/components/recoil/language";
import useWeb3 from "@/function/client/web3";
import getCookie from "@/function/server/getCookie";
import callRedirect from "@/function/server/callRedirect";

export default function Board() {
    const [web3, contract] = useWeb3();
    const loginUser = useRecoilValue(profileState);
    const language = useRecoilValue(languageState);
    const setMessage = useSetRecoilState(messageState);
    const [img, setImg] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const [makeNFT, setMakeNFT] = useState(null);
    const nameRef = useRef();
    const descRef = useRef();
    const imgUploadRef = useRef();

    const imageUpload = async () => {
        if (!img) return;

        const fileData = new FormData();
        const fileExtension = img.name.split(".").pop();
        const imgName = `${UUID()}.${fileExtension}`;
        const newImg = new File([img], imgName, {
            type: img.type,
        });
        fileData.append("file", newImg);

        setMessage(
            <div>
                <div className={classes.message}>
                    {language?.startUploadImage}
                </div>
                <div className={classes.message}>{language?.pleaseWait}</div>
            </div>
        );

        const response = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "post",
                headers: {
                    accept: "application/json",
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    pinata_secret_api_key:
                        process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
                },
                body: fileData,
            }
        );

        if (response.ok) {
            setMessage(
                <div className={classes.message}>
                    {language?.completeUploadImage}
                </div>
            );
            if (!makeNFT) {
                setTimeout(() => {
                    setMessage(null);
                }, 1000);
            }

            const { IpfsHash } = await response.json();

            fetch(`https://api.pinata.cloud/pinning/unpin/${IpfsHash}`, {
                method: "delete",
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    pinata_secret_api_key:
                        process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
                },
            });

            return IpfsHash;
        }
    };

    const upload = async (board) => {
        const wallets = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (loginUser.wallet !== wallets[0]) {
            return alert(language?.notMatchWallet);
        }

        setMessage(
            <div>
                <div className={classes.message}>
                    {language?.startGenerateNft}
                </div>
                <div className={classes.message}>{language?.pleaseWait}</div>
            </div>
        );

        const jsonData = {
            name: board.name,
            description: board.description,
            image: board.image,
        };
        const jsonName = `${UUID()}.json`;
        const file = new File([JSON.stringify(jsonData)], jsonName, {
            type: "application/json",
        });

        const fileData = new FormData();
        fileData.append("file", file);
        const response = await fetch(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            {
                method: "post",
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    pinata_secret_api_key:
                        process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
                },
                body: fileData,
            }
        );
        if (response.ok) {
            setMessage(
                <div>
                    <div className={classes.message}>
                        {language?.completeUploadMetadata}
                    </div>
                    <div className={classes.message}>
                        {language?.pleaseConfirmTransaction}
                    </div>
                </div>
            );

            const { IpfsHash } = await response.json();
            let tokenID = null;

            fetch(`https://api.pinata.cloud/pinning/unpin/${IpfsHash}`, {
                method: "delete",
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    pinata_secret_api_key:
                        process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
                },
            });

            try {
                await contract.methods
                    .minting(IpfsHash, board.__originalAuthor__.wallet)
                    .send({
                        from: loginUser.wallet,
                    })
                    .on("receipt", (receipt) => {
                        const event = receipt.events.getTokenID;
                        tokenID = parseInt(event.returnValues.tokenID);
                    });
                return tokenID;
            } catch (e) {
                fetch(
                    `${process.env.NEXT_PUBLIC_API_SERVER}/board/${board.id}/cancel`,
                    {
                        method: "put",
                        headers: {
                            Authorization: `Bearer ${await getCookie()}`,
                        },
                    }
                );
                setMessage(
                    <div className={classes.message}>
                        {language?.canceledTransaction}
                    </div>
                );

                setTimeout(() => {
                    setMessage(null);
                }, 1000);

                return;
            }
        }
    };

    const post = async () => {
        if (!nameRef.current?.value || !descRef.current?.value || !imgSrc) {
            return alert(language?.inputNftInfo);
        }

        const imageHash = await imageUpload();

        const body = JSON.stringify({
            name: nameRef.current.value,
            description: descRef.current.value,
            image: `${process.env.NEXT_PUBLIC_IPFS_PATH}${imageHash}`,
        });

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/board`,
            {
                method: "post",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                    "Content-Type": "application/json",
                },
                body,
            }
        );
        const { board } = await response.json();

        nameRef.current.value = "";
        descRef.current.value = "";
        setImg(null);

        if (!makeNFT) {
            callRedirect("/profile");
        }

        return board;
    };

    const uploadNFT = async () => {
        const board = await post();

        const makeNFTResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/board/${board.id}/make`,
            {
                method: "put",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                },
            }
        );
        const makeResult = await makeNFTResponse.json();
        let tokenID = null;

        if (makeResult.statusCode === 406) {
            return alert(language?.alreadyProcessingNFT);
        } else if (makeResult.statusCode === 400) {
            return alert(language?.alreadyGeneratedNFT);
        }

        tokenID = await upload(board);

        const completeNFTResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/board/${board.id}/complete`,
            {
                method: "put",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ tokenID }),
            }
        );
        if (completeNFTResponse.ok) {
            setMessage(
                <div className={classes.message}>
                    {language?.completeGenerateNft}
                </div>
            );

            setTimeout(() => {
                setMessage(null);
            }, 1000);
        }

        callRedirect("/profile");
    };

    return (
        <div className={classes["content-area"]}>
            <>
                {img ? (
                    <div
                        className={classes["uploaded-image-wrapper"]}
                        onClick={() => imgUploadRef.current.click()}
                    >
                        <img
                            className={classes["uploaded-image"]}
                            src={imgSrc}
                        />
                    </div>
                ) : (
                    <div
                        className={classes.image}
                        onClick={() => imgUploadRef.current.click()}
                    >
                        +
                    </div>
                )}
                <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                        if (!e.target.files.length) {
                            return;
                        }

                        setImg(e.target.files[0]);
                        const reader = new FileReader();
                        reader.readAsDataURL(e.target.files[0]);
                        reader.onload = (e) => {
                            setImgSrc(e.target.result);
                        };
                    }}
                    hidden
                    ref={imgUploadRef}
                />
            </>
            <div className={classes["input-area"]}>
                <Input ref={nameRef} placeholder={language?.nftTitle} />
                <Textarea
                    ref={descRef}
                    placeholder={language?.nftDescription}
                />
            </div>
            <div className={classes["checkbox-wrapper"]}>
                <input
                    type="checkbox"
                    id="nftCheck"
                    onClick={() => setMakeNFT(!makeNFT)}
                />
                <label htmlFor="nftCheck">{language?.nftGenerate}</label>
            </div>
            <button
                className={classes["post-metadata-area"]}
                onClick={makeNFT ? uploadNFT : post}
            >
                {makeNFT ? language?.nftGenerate : language?.postBoard}
            </button>
        </div>
    );
}
