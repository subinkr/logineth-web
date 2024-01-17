export default function getDateAndDay(locale, date) {
    return new Date(Date.parse(date)).toLocaleDateString(locale, {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        weekday: "short",
    });
}
