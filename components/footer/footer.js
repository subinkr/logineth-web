"use client";

import { useRecoilValue } from "recoil";
import classes from "./footer.module.css";
import { languageState } from "../recoil/language";

export default function Footer() {
    const language = useRecoilValue(languageState);

    return (
        <footer>
            <div className={classes.footer}>
                <div className={classes.info}>
                    <div className={classes.title}>{language?.companyInfo}</div>
                    <div>Logineth</div>
                    <div>{language?.companyAddress}</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.title}>{language?.workersInfo}</div>
                    <div>{language?.workers}</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.title}>{language?.reportInfo}</div>
                    <div>help@subin.kr</div>
                </div>
            </div>
        </footer>
    );
}
