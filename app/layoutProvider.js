"use client";

import Header from "@/components/header/header";
import classes from "./layoutProvider.module.css";
import SmallSetting from "@/components/bottom/smallSetting";
import SmallRooms from "@/components/bottom/smallRooms";
import { usePathname } from "next/navigation";

export default function LayoutProvider({ cookie, children }) {
    const pathname = usePathname();
    return (
        <>
            {pathname !== "/rooms" ? (
                <>
                    <Header cookie={cookie} />
                    <div className={classes.children}>{children}</div>
                    <div className={classes["bottom-wrapper"]}>
                        <div className={classes.bottom}>
                            <SmallSetting />
                            <SmallRooms cookie={cookie} />
                        </div>
                    </div>
                </>
            ) : (
                <>{children}</>
            )}
        </>
    );
}
