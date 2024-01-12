"use client";

import { useEffect, useRef, useState } from "react";
import getChats from "./getChats";
import { io } from "socket.io-client";
import Input from "../input/input";
import Button from "../button/button";
import { useRecoilValue } from "recoil";
import { profileState } from "../recoil/profile";
import classes from "./room.module.css";
import getCookie from "@/function/server/getCookie";
import Chat from "./chat";

export default function Room({ room }) {
    const loginUser = useRecoilValue(profileState);
    const [message, setMessage] = useState({});
    const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState(null);
    const chatRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        const runChats = async (page = 1) => {
            setMessage(await getChats(room.id, page));
        };

        if (!socket) {
            const runSocket = async () => {
                setSocket(
                    io(`${process.env.NEXT_PUBLIC_WS_SERVER}/room/${room.id}`, {
                        extraHeaders: {
                            Authorization: `Bearer ${await getCookie()}`,
                        },
                    })
                );
            };
            runSocket();
            inputRef.current.focus();
        } else {
            runChats();
            socket.on(`${room.id}`, (data) => {
                setChat(data);
            });
        }
    }, [socket]);

    useEffect(() => {
        if (chat?.content) {
            setMessage({ ...message, chats: [...message.chats, chat] });
        }
    }, [chat]);

    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, [message]);

    const sendMessage = (e) => {
        e.preventDefault();
        socket.emit("send-message", {
            content: inputRef.current.value,
        });
        // setChat({ content: inputRef.current.value, user: loginUser });
        inputRef.current.value = "";
    };

    return (
        <div className={classes.room}>
            <div className={classes.header}>
                {
                    room.users.filter((user) => user.id !== loginUser.id)[0]
                        ?.nickname
                }
            </div>
            <div ref={chatRef} className={classes.chats}>
                {message?.chats?.map((chat, idx) => (
                    <div
                        key={`chat-${idx}`}
                        className={
                            chat.user.id !== loginUser.id
                                ? classes.left
                                : classes.right
                        }
                    >
                        {chat.user.id !== loginUser.id ? (
                            <Chat chat={chat} left />
                        ) : (
                            <Chat chat={chat} />
                        )}
                    </div>
                ))}
            </div>
            <form className={classes.message}>
                <Input ref={inputRef} />
                <Button
                    className={"main"}
                    onClick={sendMessage}
                    type={"submit"}
                >
                    Send message
                </Button>
            </form>
        </div>
    );
}
