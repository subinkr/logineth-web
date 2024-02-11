import "./globals.css";
import { cookies } from "next/headers";
import RecoilLayout from "./recoilLayout";

export const metadata = {
    title: "Logineth",
    description: "Login ethereum",
};

export default function RootLayout({ children }) {
    const cookie = cookies().get("accessToken")?.value;
    return <RecoilLayout cookie={cookie}>{children}</RecoilLayout>;
}
