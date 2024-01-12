export default function getTime(date) {
    const dateArr = new Date(Date.parse(date))
        .toLocaleDateString(undefined, {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
        .split(".");

    return dateArr[dateArr.length - 1]
        .split(":")
        .slice(0, dateArr.length - 2)
        .join(":");
}
