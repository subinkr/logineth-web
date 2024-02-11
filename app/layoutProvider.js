"use client";

import Header from "@/components/header/header";
import classes from "./layoutProvider.module.css";
import SmallSetting from "@/components/bottom/smallSetting";
import SmallRooms from "@/components/bottom/smallRooms";
import { usePathname } from "next/navigation";
import Setting from "@/components/header/setting";
import { useEffect, useRef, useState } from "react";
import callRedirect from "@/function/server/callRedirect";
import Footer from "@/components/footer/footer";
import Message from "@/components/message/message";
import { useRecoilState } from "recoil";
import { scrollState } from "@/components/recoil/scroll";

export default function LayoutProvider({ cookie, children }) {
    const pathname = usePathname();
    const [scroll, setScroll] = useRecoilState(scrollState);
    const layoutRef = useRef();
    const childrenRef = useRef();
    const [height, setHeight] = useState(null);
    const [windowHeight, setWindowHeight] = useState(null);

    const callback = () => {
        if (layoutRef.current?.offsetWidth > 768) {
            if (pathname === "/rooms" || pathname === "/settings") {
                callRedirect("/");
            }
        }
    };

    const viewPortCallback = () => {
        setHeight(window.visualViewport.height);
    };

    const scrollCallback = () => {
        setScroll(childrenRef.current.scrollTop);
    };

    useEffect(() => {
        if (childrenRef.current) {
            childrenRef.current.addEventListener("scroll", scrollCallback);
        }
    }, [childrenRef]);

    useEffect(() => {
        if (windowHeight < height) {
            setWindowHeight(height);
        } else if (windowHeight > height) {
            setWindowHeight(height);
        }
    }, [height]);

    useEffect(() => {
        window.addEventListener("resize", callback);
        window.visualViewport.addEventListener("resize", viewPortCallback);

        return () => {
            window.removeEventListener("resize", callback);
            window.visualViewport.removeEventListener(
                "resize",
                viewPortCallback
            );
        };
    }, [pathname]);

    return (
        <html
            lang="en"
            className={classes.layout}
            ref={layoutRef}
            style={{
                height: height,
                overflow: "hidden",
                touchAction: "none",
            }}
        >
            <body>
                <Message />
                {pathname !== "/rooms" ? (
                    <div className={classes["not-room"]}>
                        <Header cookie={cookie} />
                        <div className={classes.children} ref={childrenRef}>
                            {children}
                            <Footer />
                        </div>
                        <div className={classes["bottom-wrapper"]}>
                            <div className={classes.bottom}>
                                <SmallSetting />
                                <SmallRooms cookie={cookie} />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div ref={childrenRef}>{children}</div>
                )}
                {pathname !== "/settings" ? (
                    <div className={classes.setting}>
                        <Setting />
                    </div>
                ) : (
                    <></>
                )}
            </body>
        </html>
    );
}
