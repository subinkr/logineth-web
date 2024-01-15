import classes from "./friend.module.css";

export default function Friend({ room, loginUser, onClick }) {
    return (
        <button className={classes.friend} onClick={onClick}>
            <div className={classes["friend-info"]}>
                <img
                    className={classes.image}
                    src={
                        room.users.filter((user) => user.id !== loginUser.id)[0]
                            ?.image
                    }
                />
                <div className={classes["friend-summary"]}>
                    <div className={classes["friend-text-info"]}>
                        <div>
                            {
                                room.users.filter(
                                    (user) => user.id !== loginUser.id
                                )[0]?.nickname
                            }
                        </div>
                        <div className={classes["friend-id"]}>
                            #
                            {
                                room.users.filter(
                                    (user) => user.id !== loginUser.id
                                )[0]?.id
                            }
                        </div>
                    </div>
                    <div className={classes["last-chat"]}>{room.lastChat}</div>
                </div>
            </div>
        </button>
    );
}
