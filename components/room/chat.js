import getTime from "@/function/client/getTime";
import classes from "./chat.module.css";

export default function Chat({ chat, left }) {
    return left ? (
        <div className={classes.chat}>
            <div className={classes.content}>{chat.content}</div>
            <div className={classes.time}>{getTime(chat.createdAt)}</div>
        </div>
    ) : (
        <div className={classes.chat}>
            <div className={classes.time}>{getTime(chat.createdAt)}</div>
            <div className={classes.content}>{chat.content}</div>
        </div>
    );
}
