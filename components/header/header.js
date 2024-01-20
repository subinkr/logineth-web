import Link from "next/link";
import classes from "./header.module.css";
import AfterLogin from "./afterLogin";
import BeforeLogin from "./beforeLogin";
import Setting from "./setting";

const Header = ({ cookie }) => {
    return (
        <div>
            <header className={classes.header}>
                <Link href={"/"}>LOGINETH</Link>
                <div className={classes.category}>
                    <Setting />
                    {cookie ? <AfterLogin /> : <BeforeLogin />}
                </div>
                <button className={classes["small-category"]}>🍔</button>
            </header>
        </div>
    );
};

export default Header;
