export default function getTime(date) {
    return new Date(Date.parse(date)).toLocaleDateString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}
