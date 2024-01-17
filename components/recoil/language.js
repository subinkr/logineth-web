import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { english } from "./language/english";

const { persistAtom } = recoilPersist();

export const languageState = atom({
    key: "languageState",
    default: { ...english },
    effects_UNSTABLE: [persistAtom],
});
