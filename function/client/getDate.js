export default function getDate(date) {
    return new Date(Date.parse(date)).toLocaleDateString(undefined, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
}
