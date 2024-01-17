export default function getTime(locale, date) {
    const dateArr = new Date(Date.parse(date)).toLocaleDateString(locale, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    let result;

    switch (locale) {
        case "ko-KR":
            result = dateArr.split(". ");
            return result[result.length - 1].split(":").slice(0, 2).join(":");
        case "en-US":
            result = dateArr.split(", ");
            return result[result.length - 1]
                .split(" ")
                .reverse()
                .join(" ")
                .split(":")
                .slice(0, 2)
                .join(":");
    }

    return result;
}
