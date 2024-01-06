import Button from "@/components/button/button";
import classes from "./userInfo.module.css";

export default function UserInfo({ thisProfile, loginUser }) {
    return (
        <div className={classes.box}>
            <div className={classes.user}>
                <div className={classes["image-wrapper"]}>
                    <img className={classes.image} src={thisProfile?.image} />
                </div>
                <div className={classes.info}>
                    <div>{thisProfile?.nickname}</div>
                    <div className={classes.created}>
                        {thisProfile?.createdAt
                            ? new Date(
                                  Date.parse(thisProfile?.createdAt)
                              ).toLocaleDateString(undefined, {
                                  year: "numeric",
                                  month: "2-digit",
                                  day: "2-digit",
                              })
                            : "User not exist"}
                    </div>
                </div>
            </div>
            {thisProfile?.id ? (
                thisProfile?.id === loginUser?.id ? (
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
