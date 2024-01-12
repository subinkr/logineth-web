import getCookie from "@/function/server/getCookie";

export default async function getRooms() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_SERVER}/rooms`,
        {
            method: "get",
            headers: {
                Authorization: `Bearer ${await getCookie()}`,
            },
        }
    );
    return await response.json();
}
