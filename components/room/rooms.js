"use client";

import classes from "./rooms.module.css";
import getRooms from "./getRooms";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { profileState } from "../recoil/profile";
import Button from "../button/button";
import Room from "./room";
import NotiCircle from "../noti/circle";
import Friend from "./friend";
import { io } from "socket.io-client";
import getCookie from "@/function/server/getCookie";
import { languageState } from "../recoil/language";
import FindFriends from "./findFriends";

export default function Rooms() {
    const language = useRecoilValue(languageState);
    const loginUser = useRecoilValue(profileState);
    const [rooms, setRooms] = useState([]);
    const [showRoom, setShowRoom] = useState(null);
    const [showRooms, setShowRooms] = useState(false);
    const [roomIdx, setRoomIdx] = useState(null);
    const [findFriends, setFindFriends] = useState(null);
    const [sockets, setSockets] = useState([]);

    useEffect(() => {
        const runSocket = async () => {
            for (let i = 0; i < sockets.length; i++) {
                sockets[i].disconnect();
            }

            const newSockets = [];
            for (let i = 0; i < rooms.length; i++) {
                const newSocket = io(
                    `${process.env.NEXT_PUBLIC_API_SERVER}/room/${rooms[i].id}`,
                    {
                        extraHeaders: {
                            Authorization: `Bearer ${await getCookie()}`,
                        },
                    }
                );
                newSocket.on(`profile/${loginUser.id}`, (data) => {
                    const newRooms = [
                        ...rooms.filter((room) => room.id !== data.id),
                        data,
                    ];
                    setRooms(newRooms);
                });
                newSockets.push(newSocket);
            }
            setSockets(newSockets);
        };

        if (rooms && sockets.length < rooms.length) {
            runSocket();
        }
    }, [rooms]);

    useEffect(() => {
        if (!showRooms || showRoom) {
            for (let i = 0; i < sockets.length; i++) {
                sockets[i].disconnect();
            }
            setSockets([]);
        }
    }, [showRooms, showRoom]);

    useEffect(() => {
        const runRooms = async () => {
            const { rooms: newRooms } = await getRooms();
            setRooms(newRooms?.reverse());
        };

        if (loginUser?.id && showRooms && !showRoom) {
            runRooms();
        }
    }, [loginUser, showRoom, showRooms]);

    const enterRoom = (idx) => {
        setShowRoom(true);
        setRoomIdx(idx);
    };
    return (
        <div className={classes["room-area"]}>
            {showRoom || findFriends ? (
                <>
                    {showRoom ? (
                        <Room
                            room={rooms[roomIdx]}
                            showRoom={showRoom}
                            setShowRoom={setShowRoom}
                        />
                    ) : (
                        <FindFriends setFindFriends={setFindFriends} />
                    )}
                </>
            ) : (
                <div className={classes.rooms}>
                    <div className={classes["rooms-wrapper"]}>
                        {rooms?.map((room, idx) => (
                            <div
                                key={`room-${idx}`}
                                className={classes["room-content"]}
                                hidden={!showRooms}
                            >
                                <Friend
                                    room={room}
                                    loginUser={loginUser}
                                    onClick={() => enterRoom(idx)}
                                />
                                <NotiCircle
                                    hidden={
                                        room.viewUsers.findIndex(
                                            (user) => user.id === loginUser.id
                                        ) !== -1
                                    }
                                />
                            </div>
                        ))}
                    </div>
                    <div
                        className={classes["button-wrapper"]}
                        style={showRooms ? { width: 300 } : {}}
                    >
                        {showRooms ? (
                            <Button
                                className={"find-friend"}
                                hidden={!showRooms}
                                onClick={() => setFindFriends(!findFriends)}
                            >
                                {language?.findFriends}
                            </Button>
                        ) : (
                            <></>
                        )}
                        <Button
                            className={
                                showRooms
                                    ? "friend-list"
                                    : "invisible-friend-list"
                            }
                            onClick={() => setShowRooms(!showRooms)}
                        >
                            {language?.friends}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
