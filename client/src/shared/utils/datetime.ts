export function normalizeDatetime(d: string) {
    const instance = new Date(d);
    const datetimeLocale = instance.toLocaleString();
    const date = d.split("T")[0];
    const time = d.split("T")[1];

    return { datetimeLocale, date, time };
}

export function formatTimeAgo(dateInput: string | Date): string {
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
    const now = new Date();
    const secondsPast = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (secondsPast < 60) {
        return "just now";
    }
    if (secondsPast < 3600) {
        const mins = Math.floor(secondsPast / 60);
        return `${mins}m ago`;
    }
    if (secondsPast < 86400) {
        const hours = Math.floor(secondsPast / 3600);
        return `${hours}h ago`;
    }
    if (secondsPast < 2592000) {
        const days = Math.floor(secondsPast / 86400);
        return `${days}d ago`;
    }

    return date.toLocaleDateString();
}