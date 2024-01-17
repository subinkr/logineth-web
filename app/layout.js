import "./globals.css";
import classes from "./layout.module.css";
import Header from "@/components/header/header";
import UseRecoil from "../function/client/useRecoil";
import { cookies } from "next/headers";

export const metadata = {
    title: "Logineth",
    description: "Login ethereum",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <UseRecoil>
                    <Header cookie={cookies().get("accessToken")?.value} />
                    <div className={classes.children}>{children}</div>
                </UseRecoil>
            </body>
        </html>
    );
}
