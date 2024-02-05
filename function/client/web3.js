"use client";

import Web3 from "web3";
import GSB from "../../contracts/artifacts/NFT.json";
import { useEffect, useState } from "react";

export default function useWeb3() {
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);

    useEffect(() => {
        const newWeb3 = new Web3(window.ethereum);
        const newContract = new newWeb3.eth.Contract(
            GSB.abi,
            process.env.NEXT_PUBLIC_CA
        );

        setWeb3(newWeb3);
        setContract(newContract);
    }, []);

    return [web3, contract];
}
