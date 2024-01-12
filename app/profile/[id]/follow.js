"use client";

import { useEffect, useState } from "react";
import getFollowingUsers from "./getFollowingUsers";
import { useRecoilState } from "recoil";
import { profileState } from "@/components/recoil/profile";
import getCookie from "@/function/server/getCookie";
import Button from "@/components/button/button";

export default function Follow({ targetUserID }) {
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [isFollowing, setIsFollowing] = useState(false);

    useEffect(() => {
        const runFollowingUsers = async () => {
            const { followingUsers } = await getFollowingUsers();
            const newLoginUser = { ...loginUser };
            newLoginUser.followingUsers = followingUsers;
            setLoginUser(newLoginUser);

            const followingIdx = followingUsers.findIndex(
                (user) => user.id === targetUserID
            );
            if (followingIdx !== -1) {
                setIsFollowing(true);
            }
        };
        runFollowingUsers();
    }, []);

    const following = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/following/${targetUserID}`,
            {
                method: "post",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                },
            }
        );
        const result = await response.json();
        setIsFollowing(true);
        alert(result.message);
    };

    const unFollowing = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/unfollowing/${targetUserID}`,
            {
                method: "delete",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                },
            }
        );
        const result = await response.json();
        setIsFollowing(false);
        alert(result.message);
    };

    return (
        <>
            {isFollowing ? (
                <>
                    <Button type="danger" onClick={unFollowing}>
                        UnFollow
                    </Button>
                </>
            ) : (
                <>
                    <Button onClick={following}>Follow</Button>
                </>
            )}
        </>
    );
}
