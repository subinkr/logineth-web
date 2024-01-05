import "./globals.css";
import classes from "./layout.module.css";
import Header from "@/components/header";

export const metadata = {
    title: "Logineth",
    description: "Login ethereum",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
            <body>
                <Header />
                <div className={classes.children}>{children}</div>
            </body>
        </html>
    );
}
