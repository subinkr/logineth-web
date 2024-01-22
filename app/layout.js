import "./globals.css";
import { cookies } from "next/headers";
import LayoutProvider from "./layoutProvider";

export const metadata = {
    title: "Logineth",
    description: "Login ethereum",
};

export default function RootLayout({ children }) {
    const cookie = cookies().get("accessToken")?.value;
    return <LayoutProvider cookie={cookie}>{children}</LayoutProvider>;
}
