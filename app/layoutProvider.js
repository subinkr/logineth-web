"use client";

import Header from "@/components/header/header";
import classes from "./layoutProvider.module.css";
import SmallSetting from "@/components/bottom/smallSetting";
import SmallRooms from "@/components/bottom/smallRooms";
import { usePathname } from "next/navigation";
import Setting from "@/components/header/setting";
import { useEffect, useRef } from "react";
import callRedirect from "@/function/server/callRedirect";

export default function LayoutProvider({ cookie, children }) {
    const pathname = usePathname();
    const layoutRef = useRef();

    const callback = () => {
        if (layoutRef.current?.offsetWidth > 768) {
            if (pathname === "/rooms" || pathname === "/settings") {
                callRedirect("/");
            }
        }
    };

    useEffect(() => {
        window.addEventListener("resize", callback);

        return () => {
            window.removeEventListener("resize", callback);
        };
    }, [pathname]);

    return (
        <div className={classes.layout} ref={layoutRef}>
            {pathname !== "/rooms" ? (
                <div className={classes["not-room"]}>
                    <Header cookie={cookie} />
                    <div className={classes.children}>{children}</div>
                    <div className={classes["bottom-wrapper"]}>
                        <div className={classes.bottom}>
                            <SmallSetting />
                            <SmallRooms cookie={cookie} />
                        </div>
                    </div>
                </div>
            ) : (
                <>{children}</>
            )}
            {pathname !== "/settings" ? (
                <div className={classes.setting}>
                    <Setting />
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
