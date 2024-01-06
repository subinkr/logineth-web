import "./globals.css";
import classes from "./layout.module.css";
import Header from "@/components/header/header";
import UseRecoil from "../function/client/useRecoil";

export const metadata = {
    title: "Logineth",
    description: "Login ethereum",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <UseRecoil>
                    <Header />
                    <div className={classes.children}>{children}</div>
                </UseRecoil>
            </body>
        </html>
    );
}
