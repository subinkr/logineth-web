"use client";

import { RecoilRoot } from "recoil";

export default function UseRecoil({ children }) {
    return <RecoilRoot>{children}</RecoilRoot>;
}
