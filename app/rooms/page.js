"use client";

import Friend from "@/components/room/friend";
import classes from "./page.module.css";
import { useEffect, useState } from "react";
import NotiCircle from "@/components/noti/circle";
import Button from "@/components/button/button";
import { useRecoilValue } from "recoil";
import { languageState } from "@/components/recoil/language";
import FindFriends from "@/components/room/findFriends";
import { profileState } from "@/components/recoil/profile";
import getRooms from "@/components/room/getRooms";
import { io } from "socket.io-client";
import getCookie from "@/function/server/getCookie";
import Room from "@/components/room/room";

export default function Rooms() {
    const language = useRecoilValue(languageState);
    const loginUser = useRecoilValue(profileState);
    const [showRoom, setShowRoom] = useState(null);
    const [rooms, setRooms] = useState([]);
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
        if (showRoom) {
            for (let i = 0; i < sockets.length; i++) {
                sockets[i].disconnect();
            }
            setSockets([]);
        }
    }, [showRoom]);

    useEffect(() => {
        const runRooms = async () => {
            const { rooms: newRooms } = await getRooms();
            setRooms(newRooms?.reverse());
        };

        if (loginUser?.id && !showRoom) {
            runRooms();
        }
    }, [loginUser, showRoom]);

    const enterRoom = (idx) => {
        setShowRoom(true);
        setRoomIdx(idx);
    };

    return (
        <div className={classes["rooms-area"]}>
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
                <>
                    <div className={classes.rooms}>
                        {rooms?.map((room, idx) => (
                            <div
                                key={`room-${idx}`}
                                className={classes["room-content"]}
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
                    <div className={classes["button-wrapper"]}>
                        <Button
                            className={"react-button"}
                            onClick={() => setFindFriends(!findFriends)}
                        >
                            {language?.findFriends}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
