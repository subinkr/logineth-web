import Button from "@/components/button/button";
import classes from "./userInfo.module.css";
import getCookie from "@/function/server/getCookie";
import deleteCookie from "@/function/server/deleteCookie";

export default function UserInfo({ profile, loginUser }) {
    const edit = () => {};
    const withdraw = async () => {
        if (confirm("탈퇴하시겠습니까? 데이터는 복구할 수 없습니다.")) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_SERVER}/register/withdraw/${profile.id}`,
                {
                    method: "delete",
                    headers: {
                        Authorization: `Bearer ${await getCookie()}`,
                    },
                }
            );
            const result = await response.json();
            alert(result.message);

            await deleteCookie();
        }
    };

    return (
        <div className={classes.box}>
            <div className={classes.user}>
                <div className={classes["image-wrapper"]}>
                    <img className={classes.image} src={profile?.image} />
                </div>
                <div className={classes.info}>
                    <div>{profile?.nickname}</div>
                    <div className={classes.created}>
                        {profile?.createdAt
                            ? new Date(
                                  Date.parse(profile?.createdAt)
                              ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                              })
                            : "User not exist"}
                    </div>
                </div>
            </div>
            {profile?.id ? (
                profile?.id === loginUser?.id ? (
                    <div className={classes.buttons}>
                        <Button onClick={edit}>Edit</Button>
                        <Button type="danger" onClick={withdraw}>
                            Withdraw
                        </Button>
                    </div>
                ) : (
                    <>
                        <Button>Follow</Button>
                    </>
                )
            ) : (
                <></>
            )}
        </div>
    );
}
