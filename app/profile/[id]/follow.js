"use client";

import { useEffect, useState } from "react";
import getFollowingUsers from "@/function/server/getFollowingUsers";
import { useRecoilState, useRecoilValue } from "recoil";
import { profileState } from "@/components/recoil/profile";
import getCookie from "@/function/server/getCookie";
import Button from "@/components/button/button";
import { languageState } from "@/components/recoil/language";

export default function Follow({ targetUser }) {
    const [loginUser, setLoginUser] = useRecoilState(profileState);
    const [followingUsers, setFollowingUsers] = useState([]);
    const [isFollowing, setIsFollowing] = useState(false);
    const language = useRecoilValue(languageState);

    useEffect(() => {
        const runFollowingUsers = async () => {
            const { followingUsers: newFollowingUsers } =
                await getFollowingUsers();
            setFollowingUsers(newFollowingUsers);

            const newLoginUser = { ...loginUser };
            newLoginUser.followingUsers = newFollowingUsers;
            setLoginUser(newLoginUser);

            const followingIdx = newFollowingUsers.findIndex(
                (user) => user.id === targetUser.id
            );
            if (followingIdx !== -1) {
                setIsFollowing(true);
            }
        };
        runFollowingUsers();
    }, []);

    const following = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/following/${targetUser.id}`,
            {
                method: "post",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                },
            }
        );
        const result = await response.json();
        setIsFollowing(true);

        const followingIdx = followingUsers.findIndex(
            (user) => user.id === targetUser.id
        );
        if (followingIdx === -1) {
            const newLoginUser = { ...loginUser };
            const newFollowingUsers = [...followingUsers, targetUser];
            newLoginUser.followingUsers = newFollowingUsers;
            setLoginUser(newLoginUser);
            setFollowingUsers(newFollowingUsers);
        }

        alert(result.message && language.followingMessage);
    };

    const unFollowing = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_SERVER}/unfollowing/${targetUser.id}`,
            {
                method: "delete",
                headers: {
                    Authorization: `Bearer ${await getCookie()}`,
                },
            }
        );
        const result = await response.json();
        setIsFollowing(false);

        const followingIdx = followingUsers.findIndex(
            (user) => user.id === targetUser.id
        );
        if (followingIdx !== -1) {
            const newFollowingUsers = [...followingUsers];
            newFollowingUsers.splice(followingIdx, 1);

            const newLoginUser = { ...loginUser };
            newLoginUser.followingUsers = newFollowingUsers;
            setLoginUser(newLoginUser);
            setFollowingUsers(newFollowingUsers);
        }

        alert(result.message && language.unFollowingMessage);
    };

    return (
        <>
            {isFollowing ? (
                <>
                    <Button className="danger" onClick={unFollowing}>
                        {language?.unFollow}
                    </Button>
                </>
            ) : (
                <>
                    <Button className="default" onClick={following}>
                        {language?.follow}
                    </Button>
                </>
            )}
        </>
    );
}
