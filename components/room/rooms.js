"use client";

import classes from "./rooms.module.css";
import getRooms from "./getRooms";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { profileState } from "../recoil/profile";
import Button from "../button/button";
import Room from "./room";

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

        if (loginUser.id) {
            runRooms();
        }
    }, [loginUser]);

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
                                        <Button onClick={() => enterRoom(idx)}>
                                            {
                                                room.users.filter(
                                                    (user) =>
                                                        user.id !== loginUser.id
                                                )[0]?.nickname
                                            }
                                        </Button>
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
