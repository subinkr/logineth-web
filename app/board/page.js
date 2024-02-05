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

export default function Board() {
    const [_, contract] = useWeb3();
    const loginUser = useRecoilValue(profileState);
    const language = useRecoilValue(languageState);
    const setMessage = useSetRecoilState(messageState);
    const [img, setImg] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
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
                    {language?.startImageUpload}
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
                    {language?.completeImageUpload}
                </div>
            );

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

    const upload = async () => {
        if (!nameRef.current?.value || !descRef.current?.value || !imgSrc) {
            return alert(language?.inputNftInfo);
        }

        const wallets = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (loginUser.wallet !== wallets[0]) {
            return alert(language?.notMatchWallet);
        }

        const imageHash = await imageUpload();

        setMessage(
            <div>
                <div className={classes.message}>
                    {language?.startGenerateNft}
                </div>
                <div className={classes.message}>{language?.pleaseWait}</div>
            </div>
        );

        const jsonData = {
            name: nameRef.current.value,
            description: descRef.current.value,
            image: `${process.env.NEXT_PUBLIC_IPFS_PATH}${imageHash}`,
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
            await contract.methods.minting(IpfsHash).send({
                from: loginUser.wallet,
            });

            setMessage(
                <div className={classes.message}>
                    {language?.completeGenerateNft}
                </div>
            );
            nameRef.current.value = "";
            descRef.current.value = "";
            setImg(null);

            setTimeout(() => {
                setMessage(null);
            }, 1000);

            fetch(`https://api.pinata.cloud/pinning/unpin/${IpfsHash}`, {
                method: "delete",
                headers: {
                    pinata_api_key: process.env.NEXT_PUBLIC_PINATA_API_KEY,
                    pinata_secret_api_key:
                        process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY,
                },
            });
        }
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
            <button className={classes["post-metadata-area"]} onClick={upload}>
                {language?.nftGenerate}
            </button>
        </div>
    );
}
