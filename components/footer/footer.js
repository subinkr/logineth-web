"use client";

import classes from "./footer.module.css";

export default function Footer() {
    return (
        <footer>
            <div className={classes.footer}>
                <div className={classes.info}>
                    <div className={classes.title}>회사정보</div>
                    <div>Logineth</div>
                    <div>
                        서울특별시 강동구 올림픽로 651 예경빌딩 4,5,6층 (지하철
                        5,8호선 2번출구 50m이내 스타벅스 건물)
                    </div>
                </div>
                <div className={classes.info}>
                    <div className={classes.title}>직원정보</div>
                    <div>강수빈 단 1명</div>
                </div>
                <div className={classes.info}>
                    <div className={classes.title}>버그신고</div>
                    <div>help@subin.kr</div>
                </div>
            </div>
        </footer>
    );
}
