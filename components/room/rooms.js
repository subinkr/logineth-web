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
import { io } from "socket.io-client";
import getCookie from "@/function/server/getCookie";

export default function Rooms() {
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [rooms, setRooms] = useState(null);
    const [showRoom, setShowRoom] = useState(null);
    const [showRooms, setShowRooms] = useState(false);
    const [roomIdx, setRoomIdx] = useState(null);
    const [findFriends, setFindFriends] = useState(null);
    const [socket, setSocket] = useState([]);
    const [chat, setChat] = useState(null);

    useEffect(() => {
        if (rooms && socket.length < rooms.length) {
            const runSocket = async () => {
                for (let i = 0; i < rooms.length; i++) {
                    const newSocket = io(
                        `${process.env.NEXT_PUBLIC_API_SERVER}/room/${rooms[i].id}`,
                        {
                            extraHeaders: {
                                Authorization: `Bearer ${await getCookie()}`,
                            },
                        }
                    );
                    newSocket.on(`profile/${loginUser.id}`, () => {
                        setChat(true);
                    });
                    setSocket(socket.push(newSocket));
                }
            };
            runSocket();
        }
    }, [rooms]);

    useEffect(() => {
        const runRooms = async () => {
            const { rooms: newRooms } = await getRooms();
            setRooms(newRooms.reverse());
            setChat(false);
        };

        if ((loginUser.id && !showRoom) || chat) {
            runRooms();
        }
    }, [loginUser, showRoom, showRooms, chat]);

    const enterRoom = (idx) => {
        setShowRoom(true);
        setRoomIdx(idx);
    };

    return (
        <>
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
                            <>{/* <FindFriends /> */}</>
                        )}
                    </>
                ) : (
                    <div className={classes.rooms}>
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
                        {showRooms ? (
                            <div className={classes["button-wrapper"]}>
                                <Button className={"find-friend"}>
                                    친구찾기
                                </Button>
                                <Button
                                    className={"friend-list"}
                                    onClick={() => setShowRooms(!showRooms)}
                                >
                                    친구목록
                                </Button>
                            </div>
                        ) : (
                            <Button
                                className={"primary"}
                                onClick={() => setShowRooms(!showRooms)}
                            >
                                친구목록
                            </Button>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
