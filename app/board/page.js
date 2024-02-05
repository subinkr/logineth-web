"use client";

import Web3 from "web3";
import { v4 as UUID } from "uuid";
import GSB from "../../contracts/abi/GSB.abi.json";
import Input from "@/components/input/input";
import classes from "./page.module.css";
import { messageState } from "@/components/recoil/message";
import { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import Textarea from "@/components/textarea/textarea";
import { profileState } from "@/components/recoil/profile";
import { languageState } from "@/components/recoil/language";

export default function Board() {
    const loginUser = useRecoilValue(profileState);
    const language = useRecoilValue(languageState);
    const setMessage = useSetRecoilState(messageState);
    const [nftContract, setNftContract] = useState(null);
    const [img, setImg] = useState(null);
    const [imgSrc, setImgSrc] = useState(null);
    const nameRef = useRef();
    const descRef = useRef();
    const imgUploadRef = useRef();

    useEffect(() => {
        const web3 = new Web3(window.ethereum);
        const contract = new web3.eth.Contract(
            GSB.abi,
            process.env.NEXT_PUBLIC_CA
        );
        setNftContract(contract);
    }, []);

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
                    이미지 업로드를 시작했습니다.
                </div>
                <div className={classes.message}>잠시만 기다려주세요.</div>
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
                    이미지 업로드를 완료했습니다.
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
            return alert("NFT의 정보를 모두 입력해주세요.");
        }

        const wallets = await window.ethereum.request({
            method: "eth_requestAccounts",
        });

        if (loginUser.wallet !== wallets[0]) {
            return alert(
                "계정에 등록된 지갑과 현재 선택된 메타마스크 지갑의 주소가 일치하지 않습니다."
            );
        }

        const imageHash = await imageUpload();

        setMessage(
            <div>
                <div className={classes.message}>NFT 생성을 시작했습니다.</div>
                <div className={classes.message}>잠시만 기다려주세요.</div>
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
                        NFT 메타데이터 업로드를 완료했습니다.
                    </div>
                    <div className={classes.message}>
                        거래를 처리하고 잠시만 기다려주세요.
                    </div>
                </div>
            );

            const { IpfsHash } = await response.json();
            await nftContract.methods.minting(IpfsHash).send({
                from: loginUser.wallet,
            });

            setMessage(
                <div className={classes.message}>NFT 생성을 완료했습니다.</div>
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
                    <div onClick={() => imgUploadRef.current.click()}>
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
                <Input ref={nameRef} placeholder="NFT 이름을 입력해주세요" />
                <Textarea ref={descRef} placeholder="NFT 설명을 입력해주세요" />
            </div>
            <button className={classes["post-metadata-area"]} onClick={upload}>
                NFT 생성
            </button>
        </div>
    );
}
