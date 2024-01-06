import classes from "./userInfo.module.css";

export default function UserInfo({ thisProfile, loginUser }) {
    return (
        <div className={classes.box}>
            <img className={classes.image} src={thisProfile?.image} />
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
    );
}
