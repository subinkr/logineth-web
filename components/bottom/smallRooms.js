import Link from "next/link";
import classes from "./smallRooms.module.css";

export default function SmallRooms({ cookie }) {
    return (
        <>
            {cookie && (
                <Link href={"/rooms"}>
                    <button className={classes.rooms}>💬</button>
                </Link>
            )}
        </>
    );
}
