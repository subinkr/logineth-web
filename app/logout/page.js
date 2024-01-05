"use client";

import { useEffect } from "react";
import deleteCookie from "./deleteCookie";

export default function Logout() {
    useEffect(() => {
        deleteCookie();
    }, []);

    return <>Good bye!</>;
}
