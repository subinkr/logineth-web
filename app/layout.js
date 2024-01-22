import "./globals.css";
import UseRecoil from "../function/client/useRecoil";
import { cookies } from "next/headers";
import LayoutProvider from "./layoutProvider";

export const metadata = {
    title: "Logineth",
    description: "Login ethereum",
};

export default function RootLayout({ children }) {
    const cookie = cookies().get("accessToken")?.value;
    return (
        <html lang="en">
            <body>
                <UseRecoil>
                    <LayoutProvider cookie={cookie}>{children}</LayoutProvider>
                </UseRecoil>
            </body>
        </html>
    );
}
