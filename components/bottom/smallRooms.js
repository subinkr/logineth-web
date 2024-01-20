import Link from "next/link";
import classes from "./smallRooms.module.css";

export default function SmallRooms() {
    return (
        <Link href={"/rooms"}>
            <button className={classes.rooms}>💬</button>
        </Link>
    );
}
