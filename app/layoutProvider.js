"use client";

import Header from "@/components/header/header";
import classes from "./layoutProvider.module.css";
import SmallSetting from "@/components/bottom/smallSetting";
import SmallRooms from "@/components/bottom/smallRooms";
import { usePathname } from "next/navigation";
import Setting from "@/components/header/setting";
import { useEffect, useRef, useState } from "react";
import callRedirect from "@/function/server/callRedirect";
import UseRecoil from "@/function/client/useRecoil";

export default function LayoutProvider({ cookie, children }) {
    const pathname = usePathname();
    const layoutRef = useRef();
    const [height, setHeight] = useState(0);
    const [windowHeight, setWindowHeight] = useState(0);

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
            style={
                windowHeight < height
                    ? {
                          height: height,
                          overflow: "hidden",
                          touchAction: "none",
                      }
                    : {}
            }
        >
            <body
                style={
                    windowHeight < height
                        ? {
                              height: height,
                              overflow: "hidden",
                              touchAction: "none",
                          }
                        : {}
                }
            >
                <UseRecoil>
                    {pathname !== "/rooms" ? (
                        <div className={classes["not-room"]}>
                            <Header cookie={cookie} />
                            <div
                                className={classes.children}
                                style={
                                    windowHeight < height
                                        ? {
                                              touchAction: "none",
                                          }
                                        : {}
                                }
                            >
                                {children}
                            </div>
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
                </UseRecoil>
            </body>
        </html>
    );
}
