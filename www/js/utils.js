export const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const weekdayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
export const weekdayLabels = ["\u65e5", "\u6708", "\u706b", "\u6c34", "\u6728", "\u91d1", "\u571f"];
export const weekdayFullLabels = [
  "\u65e5\u66dc\u65e5",
  "\u6708\u66dc\u65e5",
  "\u706b\u66dc\u65e5",
  "\u6c34\u66dc\u65e5",
  "\u6728\u66dc\u65e5",
  "\u91d1\u66dc\u65e5",
  "\u571f\u66dc\u65e5"
];

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function formatDisplayDate(dateKey, options = {}) {
  const todayKey = options.todayKey || getToday();
  const date = parseDateKey(dateKey);
  const dateLabel = `${date.getMonth() + 1}/${date.getDate()} ${dayNames[date.getDay()]}`;
  return options.markToday && dateKey === todayKey ? `Today ${dateLabel}` : dateLabel;
}

export function parseDateKey(dateKey) {
  const [year, month, date] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, date);
}

export function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function addDays(dateKey, amount) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return formatDateKey(date);
}

export function getWeekStartDate(dateKey) {
  const date = parseDateKey(dateKey);
  const day = date.getDay();
  date.setDate(date.getDate() - ((day + 6) % 7));
  return formatDateKey(date);
}

export function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

export function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
