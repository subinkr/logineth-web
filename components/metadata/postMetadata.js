"use client";

import classes from "./postMetadata.module.css";
import Button from "../button/button";
import { useRecoilValue } from "recoil";
import { languageState } from "../recoil/language";

export default function PostMetadata() {
    const language = useRecoilValue(languageState);
    return (
        <div className={classes["post-metadata-area"]}>
            <Button className="post-metadata">{language?.postMetadata}</Button>
        </div>
    );
}
