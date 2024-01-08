import Button from "@/components/button/button";
import classes from "./userInfo.module.css";
import getCookie from "@/function/server/getCookie";

export default function UserInfo({ profile, loginUser }) {
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
                        <Button>Edit</Button>
                        <Button type="danger">Withdraw</Button>
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
