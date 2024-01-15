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
                                        <Friend
                                            room={room}
                                            loginUser={loginUser}
                                            onClick={() => enterRoom(idx)}
                                        />
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
                                {showRooms ? (
                                    <div className={classes["button-wrapper"]}>
                                        <Button className={"find-friend"}>
                                            친구찾기
                                        </Button>
                                        <Button
                                            className={"friend-list"}
                                            onClick={() =>
                                                setShowRooms(!showRooms)
                                            }
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
                ) : (
                    <></>
                )
            ) : (
                <></>
            )}
        </>
    );
}
