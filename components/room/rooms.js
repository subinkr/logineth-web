"use client";

import classes from "./rooms.module.css";
import getRooms from "./getRooms";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { profileState } from "../recoil/profile";
import Button from "../button/button";
import Room from "./room";
import NotiCircle from "../noti/circle";
import Friend from "./friend";

export default function Rooms() {
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [rooms, setRooms] = useState(null);
    const [showRoom, setShowRoom] = useState(null);
    const [showRooms, setShowRooms] = useState(false);
    const [roomIdx, setRoomIdx] = useState(null);

    useEffect(() => {
        const runRooms = async () => {
            const { rooms: newRooms } = await getRooms();
            setRooms(newRooms);
            if (!rooms) {
                const newLoginUser = { ...loginUser };
                newLoginUser.rooms = newRooms;
                setLoginUser(newLoginUser);
            }
        };

        if (loginUser.id && !showRoom) {
            runRooms();
        }
    }, [loginUser, showRoom]);

    const enterRoom = (idx) => {
        setShowRoom(true);
        setRoomIdx(idx);
    };

    return (
        <>
            {loginUser.id ? (
                rooms?.length ? (
                    <div className={classes["room-area"]}>
                        {showRoom ? (
                            <>
                                <Room
                                    setRooms={setRooms}
                                    room={rooms[roomIdx]}
                                    showRoom={showRoom}
                                    setShowRoom={setShowRoom}
                                />
                            </>
                        ) : (
                            <div className={classes.rooms}>
                                {rooms.map((room, idx) => (
                                    <div
                                        key={`room-${idx}`}
                                        hidden={!showRooms}
                                    >
                                        <Friend onClick={() => enterRoom(idx)}>
                                            <div
                                                className={
                                                    classes["friend-info"]
                                                }
                                            >
                                                <img
                                                    className={classes.image}
                                                    src={
                                                        room.users.filter(
                                                            (user) =>
                                                                user.id !==
                                                                loginUser.id
                                                        )[0]?.image
                                                    }
                                                />
                                                <div
                                                    className={
                                                        classes[
                                                            "friend-summary"
                                                        ]
                                                    }
                                                >
                                                    <div
                                                        className={
                                                            classes[
                                                                "friend-text-info"
                                                            ]
                                                        }
                                                    >
                                                        <div>
                                                            {
                                                                room.users.filter(
                                                                    (user) =>
                                                                        user.id !==
                                                                        loginUser.id
                                                                )[0]?.nickname
                                                            }
                                                        </div>
                                                        <div
                                                            className={
                                                                classes[
                                                                    "friend-id"
                                                                ]
                                                            }
                                                        >
                                                            #
                                                            {
                                                                room.users.filter(
                                                                    (user) =>
                                                                        user.id !==
                                                                        loginUser.id
                                                                )[0]?.id
                                                            }
                                                        </div>
                                                    </div>
                                                    <div
                                                        className={
                                                            classes["last-chat"]
                                                        }
                                                    >
                                                        {room.lastChat}
                                                    </div>
                                                </div>
                                            </div>
                                        </Friend>
                                        <NotiCircle
                                            hidden={
                                                room.viewUsers.findIndex(
                                                    (user) =>
                                                        user.id === loginUser.id
                                                ) !== -1
                                            }
                                        />
                                    </div>
                                ))}
                                <Button
                                    className={"primary"}
                                    onClick={() => setShowRooms(!showRooms)}
                                >
                                    Friends
                                </Button>
                            </div>
                        )}
                    </div>
                ) : (
                    <></>
                )
            ) : (
                <></>
            )}
        </>
    );
}
