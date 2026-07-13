export function parseLocalDate(date: string) {
  return new Date(`${date}T12:00:00`);
}

export function formatDate(
  date: string,
  options: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    year: "numeric",
  },
) {
  return new Intl.DateTimeFormat("en-US", options).format(parseLocalDate(date));
}

export function formatShortDate(date: string) {
  return formatDate(date, { month: "short", day: "numeric" });
}

export function getTodayInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function pluralize(count: number, singular: string, plural = `${singular}s`) {
  return `${count} ${count === 1 ? singular : plural}`;
}
