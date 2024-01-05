import { cookies } from "next/headers";
export default function Home() {
    console.log(cookies().get("accessToken"));
    return <></>;
}
