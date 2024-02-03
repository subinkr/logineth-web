"use client";

import classes from "./message.module.css";
import { useRecoilState } from "recoil";
import { messageState } from "../recoil/message";

export default function Message() {
    const [message, setMessage] = useRecoilState(messageState);

    return (
        <>
            {message && (
                <div
                    className={classes["message-area"]}
                    onClick={() => {
                        setMessage(null);
                    }}
                >
                    {message}
                </div>
            )}
        </>
    );
}
