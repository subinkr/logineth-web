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
import getFollowingUsers from "@/function/server/getFollowingUsers";
import getTime from "@/function/client/getTime";
import getDateAndDay from "@/function/client/getDateAndDay";
import { languageState } from "../recoil/language";
import TargetUser from "./targetUser";

export default function Room({ room, showRoom, setShowRoom }) {
    const loginUser = useRecoilValue(profileState);
    const language = useRecoilValue(languageState);
    const [message, setMessage] = useState({});
    const [socket, setSocket] = useState(null);
    const [chat, setChat] = useState(null);
    const [targetUser, setTargetUser] = useState(
        room.users.filter((user) => user.id !== loginUser.id)[0]
    );
    const [followState, setFollowState] = useState(false);
    const [height, setHeight] = useState(0);
    const [roomHeight, setRoomHeight] = useState(null);
    const chatRef = useRef(null);
    const inputRef = useRef(null);
    const roomRef = useRef(null);

    let chatDate = "";
    let chatTime = "";

    const focusoutCallback = () => {
        inputRef.current.removeEventListener("focusout", focusoutCallback);
        inputRef.current.removeEventListener("focus", focusCallback);
        inputRef.current.addEventListener("focus", focusCallback);
        setRoomHeight(window.VisualViewport.height);
    };

    const focusCallback = () => {
        inputRef.current.removeEventListener("focus", focusCallback);
        inputRef.current.removeEventListener("focusout", focusoutCallback);
        inputRef.current.addEventListener("focus", focusCallback);
        inputRef.current.addEventListener("focusout", focusoutCallback);
        setRoomHeight(window.VisualViewport.height);
    };

    useEffect(() => {}, [roomHeight]);

    useEffect(() => {
        if (!socket) {
            const runSocket = async () => {
                setSocket(
                    io(`${process.env.NEXT_PUBLIC_WS_SERVER}/room/${room.id}`, {
                        extraHeaders: {
                            Authorization: `Bearer ${await getCookie()}`,
                        },
                    })
                );

                const { followingUsers } = await getFollowingUsers();
                const isFollowingUser = followingUsers.findIndex(
                    (user) => user.id === targetUser.id
                );
                if (isFollowingUser !== -1) {
                    setFollowState(true);
                }
            };
            runSocket();
        } else {
            const runChats = async (page = 1) => {
                setMessage(await getChats(room.id, page));
            };

            runChats();
            socket.on(`${room.id}`, (data) => {
                setChat(data);
            });

            inputRef.current.addEventListener("focus", focusCallback);
        }

        return () => {
            inputRef.current?.removeEventListener("focus", focusCallback);
        };
    }, [socket]);

    useEffect(() => {
        if (chat?.content) {
            setMessage({ ...message, chats: [...message.chats, chat] });
            setHeight(0);
        }
    }, [chat]);

    useEffect(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight - height;

        if (message.nextPage && !chat) {
            chatRef.current.addEventListener("scroll", callback);
        }
    }, [message]);

    useEffect(() => {
        if (!showRoom) {
            socket.disconnect();
        }
    }, [showRoom]);

    const callback = async () => {
        if (chatRef.current.scrollTop === 0) {
            chatRef.current.removeEventListener("scroll", callback);
            const result = await getChats(room.id, message.nextPage);

            message.chats.unshift(...result.chats);
            setMessage({ ...result, chats: message.chats });
            setChat(null);
            setHeight(chatRef.current.scrollHeight);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        await socket?.emit("send-message", {
            content: inputRef.current.value,
        });
        // setChat({
        //     content: inputRef.current.value,
        //     user: loginUser,
        //     createdAt: new Date(),
        // });
        inputRef.current.value = "";
    };

    const closeRoom = async () => {
        await socket?.emit("close-room", {});
        setShowRoom(false);
    };

    return (
        <>
            <div
                ref={roomRef}
                className={classes.room}
                style={roomHeight && { height: roomHeight }}
            >
                <TargetUser
                    className="header"
                    targetUser={targetUser}
                    followState={followState}
                />
                <div ref={chatRef} className={classes.chats}>
                    {message?.chats?.map((chat, idx) => (
                        <div key={`chat-${idx}`}>
                            <div>
                                {!chatDate ||
                                chatDate !==
                                    getDateAndDay(
                                        language?.locale,
                                        chat.createdAt
                                    ) ? (
                                    <>
                                        <div className={classes.date}>
                                            {
                                                (chatDate = getDateAndDay(
                                                    language?.locale,

                                                    chat.createdAt
                                                ))
                                            }
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                                {!chatTime ||
                                chatTime !==
                                    getTime(
                                        language?.locale,
                                        chat.createdAt
                                    ) ? (
                                    <>
                                        <div className={classes.time}>
                                            {
                                                (chatTime = getTime(
                                                    language?.locale,
                                                    chat.createdAt
                                                ))
                                            }
                                        </div>
                                    </>
                                ) : (
                                    <></>
                                )}
                            </div>

                            <div
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
                        </div>
                    ))}
                </div>
                <form className={classes.message}>
                    <Input ref={inputRef} />
                    <Button
                        className={"send-message"}
                        onClick={sendMessage}
                        type={"submit"}
                    >
                        {language?.sendMessage}
                    </Button>
                </form>
            </div>
            <div className={classes["button-wrapper"]}>
                <Button className={"react-button"} onClick={closeRoom}>
                    {language?.close}
                </Button>
            </div>
        </>
    );
}
