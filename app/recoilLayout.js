"use client";

import UseRecoil from "@/function/client/useRecoil";
import LayoutProvider from "./layoutProvider";

export default function RecoilLayout({ cookie, children }) {
    return (
        <UseRecoil>
            <LayoutProvider cookie={cookie}>{children}</LayoutProvider>
        </UseRecoil>
    );
}
