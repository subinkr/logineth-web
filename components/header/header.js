import Link from "next/link";
import classes from "./header.module.css";
import AfterLogin from "./afterLogin";
import BeforeLogin from "./beforeLogin";
import Language from "./language";

const Header = ({ cookie }) => {
    return (
        <div>
            <header className={classes.header}>
                <Link href={"/"}>LOGINETH</Link>
                <div className={classes.category}>
                    <Language />
                    {cookie ? <AfterLogin /> : <BeforeLogin />}
                </div>
            </header>
        </div>
    );
};

export default Header;
