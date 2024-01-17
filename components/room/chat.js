import classes from "./chat.module.css";

export default function Chat({ chat, left }) {
    return (
        <>
            <div>
                {left ? (
                    <div className={classes.chat}>
                        <div className={classes.content}>{chat.content}</div>
                    </div>
                ) : (
                    <div className={classes.chat}>
                        <div className={classes.content}>{chat.content}</div>
                    </div>
                )}
            </div>
        </>
    );
}
