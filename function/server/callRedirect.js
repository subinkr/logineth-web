"use server";

import { redirect } from "next/navigation";

export default async function callRedirect(path) {
    redirect(path);
}
