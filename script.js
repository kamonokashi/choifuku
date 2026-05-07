const STORAGE_KEY = "studyReviewApp.v1";
const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const weekdayKeys = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const weekdayLabels = ["日", "月", "火", "水", "木", "金", "土"];
const weekdayFullLabels = ["日曜日", "月曜日", "火曜日", "水曜日", "木曜日", "金曜日", "土曜日"];
const holidaysByYear = {
  2026: {
    "2026-01-01": "元日",
    "2026-01-12": "成人の日",
    "2026-02-11": "建国記念の日",
    "2026-02-23": "天皇誕生日",
    "2026-03-20": "春分の日",
    "2026-04-29": "昭和の日",
    "2026-05-03": "憲法記念日",
    "2026-05-04": "みどりの日",
    "2026-05-05": "こどもの日",
    "2026-05-06": "振替休日",
    "2026-07-20": "海の日",
    "2026-08-11": "山の日",
    "2026-09-21": "敬老の日",
    "2026-09-22": "国民の休日",
    "2026-09-23": "秋分の日",
    "2026-10-12": "スポーツの日",
    "2026-11-03": "文化の日",
    "2026-11-23": "勤労感謝の日"
  }
};
const legacyDemoSchedule = [
  { dayOfWeek: 0, period: 1, subjectId: "english" },
  { dayOfWeek: 0, period: 2, subjectId: "math" },
  { dayOfWeek: 1, period: 1, subjectId: "english" },
  { dayOfWeek: 1, period: 2, subjectId: "math" },
  { dayOfWeek: 2, period: 1, subjectId: "history" },
  { dayOfWeek: 3, period: 2, subjectId: "english" },
  { dayOfWeek: 4, period: 1, subjectId: "math" },
  { dayOfWeek: 5, period: 3, subjectId: "history" }
];
const defaultState = {
  subjects: [
    { id: "english", name: "英語", color: "#6aa9ff" },
    { id: "math", name: "数学", color: "#73c69b" },
    { id: "history", name: "歴史", color: "#f0b56a" }
  ],
  schedule: [],
  scheduleTemplates: [],
  scheduleRanges: [],
  dateExceptions: [],
  weekOverrides: [],
  theme: {
    mode: "light",
    accent: "#2f80ed"
  },
  maxPeriods: 6,
  memos: [],
  archivedMemos: [],
  completedDates: [],
  streak: {
    count: 0,
    lastCompletedDate: null
  }
};

let state = loadStoredState(STORAGE_KEY, defaultState, migrateState);
let activeHistorySubject = "all";
let historyMemoMode = "active";
let historySortOrder = "desc";
let historyRange = "all";
let historyCustomStart = "";
let historyCustomEnd = "";
let memoActionStart = "";
let memoActionEnd = "";
let isMemoActionPanelOpen = false;
let isHistoryMenuOpen = false;
let isHistoryFilterOpen = true;
let selectedMemoAction = "archive";
let settingsMode = "menu";
let settingsDraft = null;
let settingsDraftSnapshot = "";
let pendingSettingsAction = null;
let exceptionEditorDate = getToday();
let weekOverrideEditorDate = getToday();
let exceptionSettingsTab = "day";
let exceptionCalendarMonthDate = parseDateKey(getToday());
let weekOverrideCalendarMonthDate = parseDateKey(getToday());
let weekOverrideScope = "once";
let selectedDate = getToday();
let calendarMonthDate = parseDateKey(selectedDate);
let isCalendarOpen = false;
let calendarCloseTimer = null;
let calendarMode = "date";
let lastHeaderDateLabel = "";
let lastStreakLabel = "";
const viewOrder = ["homeView", "historyView", "settingsView"];

let elements = {};
let isAppInitialized = false;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadStoredState(storageKey, fallbackState, migrate) {
  const raw = localStorage.getItem(storageKey);
  if (!raw) return clone(fallbackState);

  try {
    const saved = JSON.parse(raw);
    const migrated = { ...clone(fallbackState), ...saved };
    return typeof migrate === "function" ? migrate(migrated, saved) : migrated;
  } catch {
    return clone(fallbackState);
  }
}

function saveStoredState(storageKey, nextState) {
  localStorage.setItem(storageKey, JSON.stringify(nextState));
}

function migrateState(migrated, saved) {
  if (saved.maxPeriods === undefined && isSameSchedule(saved.schedule, legacyDemoSchedule)) {
    migrated.schedule = [];
  }
  ensureScheduleState(migrated);
  return migrated;
}

function collectElements() {
  elements = {
    dateButton: document.querySelector("#dateButton"),
    todayLabel: document.querySelector("#todayLabel"),
    streakButton: document.querySelector("#streakButton"),
    streakCount: document.querySelector("#streakCount"),
    completionLabel: document.querySelector("#completionLabel"),
    homeTitle: document.querySelector("#homeTitle"),
    dateChevron: document.querySelector("#dateChevron"),
    lessonList: document.querySelector("#lessonList"),
    calendarPanel: document.querySelector("#calendarPanel"),
    addStudyButton: document.querySelector("#addStudyButton"),
    studyPicker: document.querySelector("#studyPicker"),
    historyList: document.querySelector("#historyList"),
    historyControls: document.querySelector("#historyControls"),
    historyMenuButton: document.querySelector("#historyMenuButton"),
    subjectFilters: document.querySelector("#subjectFilters"),
    settingsContent: document.querySelector("#settingsContent")
  };
}

function ensureScheduleState(targetState) {
  targetState.subjects = Array.isArray(targetState.subjects) ? targetState.subjects : [];
  targetState.schedule = Array.isArray(targetState.schedule) ? targetState.schedule : [];
  targetState.scheduleTemplates = Array.isArray(targetState.scheduleTemplates)
    ? targetState.scheduleTemplates
    : [];
  targetState.scheduleRanges = Array.isArray(targetState.scheduleRanges) ? targetState.scheduleRanges : [];
  targetState.dateExceptions = Array.isArray(targetState.dateExceptions) ? targetState.dateExceptions : [];
  targetState.weekOverrides = Array.isArray(targetState.weekOverrides) ? targetState.weekOverrides : [];
  targetState.memos = Array.isArray(targetState.memos) ? targetState.memos : [];
  targetState.archivedMemos = Array.isArray(targetState.archivedMemos) ? targetState.archivedMemos : [];
  targetState.completedDates = Array.isArray(targetState.completedDates) ? targetState.completedDates : [];
  targetState.theme = {
    ...clone(defaultState.theme),
    ...(targetState.theme || {})
  };
  if (!/^#[0-9a-f]{6}$/i.test(targetState.theme.accent)) {
    targetState.theme.accent = defaultState.theme.accent;
  }
  if (!["light", "dark"].includes(targetState.theme.mode)) {
    targetState.theme.mode = defaultState.theme.mode;
  }
  targetState.maxPeriods = clamp(Number(targetState.maxPeriods || 6), 1, 12);

  if (targetState.scheduleTemplates.length === 0 && targetState.schedule.length > 0) {
    const templateId = createId("schedule");
    const year = Number(getToday().slice(0, 4));
    targetState.scheduleTemplates.push({
      id: templateId,
      name: "移行済み時間割",
      archived: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      schedule: scheduleArrayToTemplateSchedule(targetState.schedule)
    });
    targetState.scheduleRanges.push({
      id: createId("range"),
      scheduleId: templateId,
      startDate: `${year}-01-01`,
      endDate: `${year}-12-31`
    });
  }
}

function isSameSchedule(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return false;
  return a.every((item, index) => {
    const other = b[index];
    return (
      item.dayOfWeek === other.dayOfWeek &&
      item.period === other.period &&
      item.subjectId === other.subjectId
    );
  });
}

function saveState() {
  saveStoredState(STORAGE_KEY, state);
}

function applyTheme(theme = state.theme) {
  const mode = theme?.mode === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = mode;
  setThemeVariables(document.documentElement, theme);
}

function setThemeVariables(target, theme) {
  const mode = theme?.mode === "dark" ? "dark" : "light";
  const accent = /^#[0-9a-f]{6}$/i.test(theme?.accent || "") ? theme.accent : defaultState.theme.accent;
  const readableAccent = getReadableAccent(accent, mode);
  const onAccent = getContrastRatio(accent, "#ffffff") >= getContrastRatio(accent, "#111827")
    ? "#ffffff"
    : "#111827";
  target.style.setProperty("--accent", accent);
  target.style.setProperty("--accent-readable", readableAccent);
  target.style.setProperty("--on-accent", onAccent);
}

function getReadableAccent(accent, mode) {
  const background = mode === "dark" ? "#1f2937" : "#ffffff";
  if (getContrastRatio(accent, background) >= 4.5) return accent;
  const target = mode === "dark" ? "#ffffff" : "#000000";

  for (let amount = 0.05; amount <= 1; amount += 0.05) {
    const mixed = mixHex(accent, target, amount);
    if (getContrastRatio(mixed, background) >= 4.5) return mixed;
  }
  return target;
}

function mixHex(fromHex, toHex, amount) {
  const from = hexToRgb(fromHex);
  const to = hexToRgb(toHex);
  return rgbToHex({
    r: Math.round(from.r + (to.r - from.r) * amount),
    g: Math.round(from.g + (to.g - from.g) * amount),
    b: Math.round(from.b + (to.b - from.b) * amount)
  });
}

function getContrastRatio(hexA, hexB) {
  const lumA = getRelativeLuminance(hexToRgb(hexA));
  const lumB = getRelativeLuminance(hexToRgb(hexB));
  const lighter = Math.max(lumA, lumB);
  const darker = Math.min(lumA, lumB);
  return (lighter + 0.05) / (darker + 0.05);
}

function getRelativeLuminance(rgb) {
  const channels = [rgb.r, rgb.g, rgb.b].map((channel) => {
    const value = channel / 255;
    return value <= 0.03928 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function hexToRgb(hex) {
  const value = hex.replace("#", "");
  return {
    r: parseInt(value.slice(0, 2), 16),
    g: parseInt(value.slice(2, 4), 16),
    b: parseInt(value.slice(4, 6), 16)
  };
}

function rgbToHex(rgb) {
  return `#${[rgb.r, rgb.g, rgb.b]
    .map((channel) => channel.toString(16).padStart(2, "0"))
    .join("")}`;
}

function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTodayLabel() {
  return formatDisplayDate(selectedDate, { markToday: selectedDate === getToday() });
}

function formatDisplayDate(dateKey, options = {}) {
  const date = parseDateKey(dateKey);
  const dateLabel = `${date.getMonth() + 1}/${date.getDate()} ${dayNames[date.getDay()]}`;
  return options.markToday && dateKey === getToday() ? `Today ${dateLabel}` : dateLabel;
}

function parseDateKey(dateKey) {
  const [year, month, date] = dateKey.split("-").map(Number);
  return new Date(year, month - 1, date);
}

function formatDateKey(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function addDays(dateKey, amount) {
  const date = parseDateKey(dateKey);
  date.setDate(date.getDate() + amount);
  return formatDateKey(date);
}

function getWeekStartDate(dateKey) {
  const date = parseDateKey(dateKey);
  const day = date.getDay();
  date.setDate(date.getDate() - ((day + 6) % 7));
  return formatDateKey(date);
}

function getHolidayName(dateKey) {
  const year = Number(dateKey.slice(0, 4));
  return holidaysByYear[year] ? holidaysByYear[year][dateKey] : null;
}

function getSubject(subjectId, subjects = state.subjects) {
  return subjects.find((subject) => subject.id === subjectId);
}

function getScheduleTemplate(scheduleId, source = state.scheduleTemplates) {
  return source.find((template) => template.id === scheduleId);
}

function getActiveTemplates(source = state.scheduleTemplates) {
  return source.filter((template) => !template.archived);
}

function buildTemplateOptions(source, currentId = "", includeArchivedCurrent = false) {
  const activeTemplates = getActiveTemplates(source);
  const currentTemplate = includeArchivedCurrent
    ? source.find((template) => template.id === currentId && template.archived)
    : null;
  const options = currentTemplate ? [...activeTemplates, currentTemplate] : activeTemplates;
  return options
    .map((template) => {
      const archivedLabel = template.archived ? "（アーカイブ）" : "";
      return `<option value="${template.id}">${template.name || "名称未入力"}${archivedLabel}</option>`;
    })
    .join("");
}

function scheduleArrayToTemplateSchedule(scheduleArray) {
  return scheduleArray.reduce((schedule, item) => {
    const key = weekdayKeys[item.dayOfWeek];
    if (!key) return schedule;
    if (!schedule[key]) schedule[key] = {};
    schedule[key][item.period] = item.subjectId;
    return schedule;
  }, createEmptyTemplateSchedule());
}

function createEmptyTemplateSchedule() {
  return weekdayKeys.reduce((schedule, key) => {
    schedule[key] = {};
    return schedule;
  }, {});
}

function getRangeForDate(dateKey) {
  return state.scheduleRanges.find((range) => range.startDate <= dateKey && range.endDate >= dateKey);
}

function getWeekOverrideForDate(dateKey) {
  const weekStartDate = getWeekStartDate(dateKey);
  const once = state.weekOverrides.find(
    (override) => override.type === "week_override_once" && override.weekStartDate === weekStartDate
  );
  if (once) return once;

  return state.weekOverrides
    .filter(
      (override) =>
        override.type === "week_override_from" && override.fromWeekStartDate <= weekStartDate
    )
    .sort((a, b) => b.fromWeekStartDate.localeCompare(a.fromWeekStartDate))[0];
}

function getBaseScheduleTemplateForDate(dateKey) {
  const weekOverride = getWeekOverrideForDate(dateKey);
  if (weekOverride) return getScheduleTemplate(weekOverride.scheduleId);
  const range = getRangeForDate(dateKey);
  return range ? getScheduleTemplate(range.scheduleId) : null;
}

function getLessonsFromTemplate(template, dateKey, dayOfWeek = parseDateKey(dateKey).getDay()) {
  if (!template) return [];
  const daySchedule = template.schedule?.[weekdayKeys[dayOfWeek]] || {};
  return Object.entries(daySchedule)
    .filter(([, subjectId]) => subjectId)
    .map(([period, subjectId]) => ({
      period: Number(period),
      subjectId,
      type: "lesson",
      scheduleId: template.id
    }))
    .sort((a, b) => a.period - b.period);
}

function getEffectiveDayPlan(dateKey) {
  const exception = state.dateExceptions.find((item) => item.date === dateKey);
  const holidayName = getHolidayName(dateKey);
  const daySubject = dateKey === getToday() ? "本日" : "この日";

  if (exception?.type === "holiday") {
    return {
      lessons: [],
      kind: "user-holiday",
      message: `${daySubject}は休日設定です。`
    };
  }

  if (exception?.type === "weekday_override") {
    const dayOfWeek = weekdayKeys.indexOf(exception.weekday);
    const template = getBaseScheduleTemplateForDate(dateKey);
    const label = weekdayFullLabels[dayOfWeek] || "別曜日";
    return {
      lessons: getLessonsFromTemplate(template, dateKey, dayOfWeek),
      kind: "weekday-override",
      scheduleName: template ? template.name : "",
      message: `${daySubject}は${label}時程です。`
    };
  }

  if (exception?.type === "schedule_override") {
    const template = getScheduleTemplate(exception.scheduleId);
    return {
      lessons: getLessonsFromTemplate(template, dateKey),
      kind: "schedule-override",
      scheduleName: template ? template.name : "",
      message: template
        ? `${daySubject}は「${template.name}」の時間割です。`
        : `${daySubject}は授業が設定されていません。`
    };
  }

  if (holidayName) {
    return {
      lessons: [],
      kind: "holiday",
      holidayName,
      message: `${daySubject}は祝日です。授業なしとして扱われます。`
    };
  }

  const template = getBaseScheduleTemplateForDate(dateKey);
  if (!template) {
    return {
      lessons: [],
      kind: "unset",
      message: `${daySubject}は授業が設定されていません。`
    };
  }

  return {
    lessons: getLessonsFromTemplate(template, dateKey),
    kind: "normal",
    scheduleName: template.name,
    message: template.name ? `現在の時間割：${template.name}` : ""
  };
}

function getMemo(date, subjectId, period, type = "lesson") {
  return state.memos.find(
    (memo) =>
      memo.date === date &&
      memo.subjectId === subjectId &&
      memo.period === period &&
      memo.type === type
  );
}

function getMemoForItem(date, item) {
  const periods = item.periods || [item.period];
  const exact = getMemo(date, item.subjectId, item.period, item.type);
  if (exact && exact.content.trim().length > 0) return exact;
  return (
    periods
      .map((period) => getMemo(date, item.subjectId, period, item.type))
      .find((memo) => memo && memo.content.trim().length > 0) ||
    exact ||
    null
  );
}

function getItemKey(item) {
  return `${item.type}:${item.subjectId}:${item.period}`;
}

function setMemo(date, subjectId, period, content, type = "lesson", shouldRender = true) {
  const existing = getMemo(date, subjectId, period, type);
  if (existing) {
    existing.content = content;
    if (content.trim().length === 0) existing.completed = false;
    existing.updatedAt = new Date().toISOString();
  } else {
    state.memos.push({
      date,
      subjectId,
      period,
      type,
      content,
      completed: false,
      updatedAt: new Date().toISOString()
    });
  }
  updateStreak();
  saveState();
  if (shouldRender) render();
}

function lessonsForDate(dateKey) {
  return groupConsecutiveLessons(getEffectiveDayPlan(dateKey).lessons);
}

function groupConsecutiveLessons(lessons) {
  return lessons.reduce((grouped, lesson) => {
    const previous = grouped[grouped.length - 1];
    const isSameConsecutiveLesson =
      previous &&
      previous.type === "lesson" &&
      previous.subjectId === lesson.subjectId &&
      previous.endPeriod + 1 === lesson.period;

    if (isSameConsecutiveLesson) {
      previous.endPeriod = lesson.period;
      previous.periods.push(lesson.period);
      return grouped;
    }

    grouped.push({
      ...lesson,
      endPeriod: lesson.period,
      periods: [lesson.period]
    });
    return grouped;
  }, []);
}

function todayLessons() {
  return lessonsForDate(getToday());
}

function studiesForDate(dateKey) {
  return state.memos
    .filter((memo) => memo.date === dateKey && memo.type === "study")
    .map((memo) => ({ ...memo, type: "study" }))
    .sort((a, b) => a.period - b.period);
}

function todayStudies() {
  return studiesForDate(getToday());
}

function homeItemsForDate(dateKey) {
  const lessons = lessonsForDate(dateKey);
  const studies = studiesForDate(dateKey);
  return [...lessons, ...studies].sort((a, b) => {
    const doneA = isComplete(a, dateKey) ? 1 : 0;
    const doneB = isComplete(b, dateKey) ? 1 : 0;
    return doneA - doneB || a.period - b.period;
  });
}

function isComplete(item, date) {
  const memo = getMemoForItem(date, item);
  return Boolean(memo && memo.content.trim().length > 0 && memo.completed !== false);
}

function updateStreak() {
  let cursor = getToday();
  let count = 0;
  let foundCompletedDay = false;
  state.streak.lastCompletedDate = null;

  for (let i = 0; i < 365; i += 1) {
    const lessons = lessonsForDate(cursor);
    const isToday = cursor === getToday();

    if (lessons.length > 0) {
      const complete = state.completedDates.includes(cursor) || lessons.every((lesson) => isComplete(lesson, cursor));
      if (complete) {
        count += 1;
        foundCompletedDay = true;
        state.streak.lastCompletedDate = state.streak.lastCompletedDate || cursor;
      } else if (foundCompletedDay || !isToday) {
        break;
      }
    }

    cursor = addDays(cursor, -1);
  }

  state.streak.count = count;
  if (count === 0) state.streak.lastCompletedDate = null;
}

function createLessonCard(item, date) {
  const subject = getSubject(item.subjectId) || {
    name: "未登録科目",
    color: "#aab4bd"
  };
  const memo = getMemoForItem(date, item);
  const complete = isComplete(item, date);
  const card = document.createElement("article");
  card.className = `lesson-card${complete ? " is-complete" : ""}`;
  card.dataset.key = getItemKey(item);
  card.style.setProperty("--subject-color", subject.color);

  const bar = document.createElement("div");
  bar.className = "color-bar";

  const content = document.createElement("div");
  content.className = "lesson-content";

  const meta = document.createElement("div");
  meta.className = "lesson-meta";
  const periodLabel = getPeriodLabel(item);
  meta.innerHTML = `<span class="period">${periodLabel}</span><span class="subject-name"></span>`;
  meta.querySelector(".subject-name").textContent = subject.name;

  const textarea = document.createElement("textarea");
  textarea.className = "memo-input";
  textarea.dataset.key = getItemKey(item);
  textarea.rows = 1;
  textarea.placeholder = "今日覚えたことを1つだけ";
  textarea.value = memo ? memo.content : "";

  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.className = "done-button";
  doneButton.setAttribute("aria-label", "入力完了");
  doneButton.innerHTML = `
    <svg class="done-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6.5 12.4L10.2 16L17.8 8"></path>
    </svg>
  `;
  doneButton.disabled = textarea.value.trim().length === 0;

  textarea.addEventListener("input", () => {
    autoResize(textarea);
    setMemo(date, item.subjectId, item.period, textarea.value, item.type, false);
    doneButton.disabled = textarea.value.trim().length === 0;
    renderHeaderState();
  });
  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      completeMemoInput(textarea, date, item, { focusNext: true });
    }
  });
  textarea.addEventListener("blur", () => {
    if (textarea.dataset.completing === "true") return;
    completeMemoInput(textarea, date, item);
  });
  doneButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    completeMemoInput(textarea, date, item);
  });

  const memoRow = document.createElement("div");
  memoRow.className = "memo-row";
  memoRow.append(textarea, doneButton);

  content.append(meta, memoRow);
  card.append(bar, content);
  requestAnimationFrame(() => autoResize(textarea));
  return card;
}

function getPeriodLabel(item) {
  if (item.type === "study") return "自習";
  return item.endPeriod && item.endPeriod !== item.period
    ? `${item.period}-${item.endPeriod}限`
    : `${item.period}限`;
}

function completeMemoInput(textarea, date, item, options = {}) {
  if (textarea.dataset.completing === "true") return;
  textarea.dataset.completing = "true";
  const card = textarea.closest(".lesson-card");
  const doneButton = card?.querySelector(".done-button");
  if (doneButton && !doneButton.disabled) {
    doneButton.classList.add("is-pressing");
    window.setTimeout(() => doneButton.classList.remove("is-pressing"), 150);
  }
  const content = textarea.value;
  setMemo(date, item.subjectId, item.period, textarea.value, item.type, false);
  const focusKey =
    options.focusNext && content.trim().length > 0 ? getNextIncompleteKey(date, getItemKey(item)) : null;
  const memo = getMemo(date, item.subjectId, item.period, item.type);
  if (memo) memo.completed = content.trim().length > 0;
  updateStreak();
  saveState();
  window.setTimeout(() => {
    render();
    if (focusKey) focusMemoInput(focusKey);
  }, 70);
}

function getNextIncompleteKey(date, currentKey) {
  const items = homeItemsForDate(date);
  const currentIndex = items.findIndex((entry) => getItemKey(entry) === currentKey);
  if (currentIndex === -1) return null;

  const next = items
    .slice(currentIndex + 1)
    .find((entry) => !isComplete(entry, date));
  return next ? getItemKey(next) : null;
}

function focusMemoInput(key) {
  requestAnimationFrame(() => {
    const input = [...elements.lessonList.querySelectorAll(".memo-input")].find(
      (candidate) => candidate.dataset.key === key
    );
    if (!input) return;
    input.focus();
    input.setSelectionRange(input.value.length, input.value.length);
  });
}

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function renderHome() {
  renderHeaderState();
  renderCalendar();
  const previousPositions = captureLessonPositions();
  elements.lessonList.innerHTML = "";
  const plan = getEffectiveDayPlan(selectedDate);
  const hasConfiguredSchedule = state.scheduleTemplates.length > 0 && state.scheduleRanges.length > 0;
  elements.addStudyButton.hidden = !hasConfiguredSchedule && plan.kind === "unset";
  elements.studyPicker.hidden = true;

  const status = document.createElement("p");
  status.className = `day-status is-${plan.kind}`;
  status.textContent = plan.message;
  if (plan.message) elements.lessonList.append(status);

  if (!hasConfiguredSchedule && plan.kind === "unset") {
    const prompt = document.createElement("div");
    prompt.className = "setup-prompt";
    prompt.innerHTML = `
      <p>時間割が未設定です</p>
      <button class="primary-button" type="button">時間割を設定する</button>
    `;
    prompt.querySelector("button").addEventListener("click", () => {
      showView("settingsView");
      openSettingsDetail("ranges");
    });
    elements.lessonList.append(prompt);
    return;
  }

  const date = selectedDate;
  const items = homeItemsForDate(date);

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent =
      plan.kind === "unset"
        ? "この日の授業はありません"
        : selectedDate === getToday()
          ? "今日の授業メモはありません"
          : "この日の授業メモはありません";
    elements.lessonList.append(empty);
    return;
  }

  items.forEach((item) => elements.lessonList.append(createLessonCard(item, date)));
  animateLessonCards(previousPositions);
}

function captureLessonPositions() {
  const positions = new Map();
  elements.lessonList.querySelectorAll(".lesson-card").forEach((card) => {
    positions.set(card.dataset.key, card.getBoundingClientRect().top);
  });
  return positions;
}

function animateLessonCards(previousPositions) {
  if (previousPositions.size === 0) return;
  elements.lessonList.querySelectorAll(".lesson-card").forEach((card) => {
    const previousTop = previousPositions.get(card.dataset.key);
    if (previousTop === undefined) return;
    const currentTop = card.getBoundingClientRect().top;
    const delta = previousTop - currentTop;
    if (Math.abs(delta) < 1) return;

    card.style.transition = "none";
    card.style.transform = `translateY(${delta}px)`;
    requestAnimationFrame(() => {
      card.style.transition =
        "transform 190ms cubic-bezier(0.22, 1, 0.36, 1), background-color 190ms ease-out, box-shadow 190ms ease-out";
      card.style.transform = "";
    });
  });
}

function renderHeaderState() {
  const date = selectedDate;
  const lessons = lessonsForDate(date);
  const completeLessons = lessons.filter((lesson) => isComplete(lesson, date)).length;
  const nextDateLabel = getTodayLabel();
  const nextStreakLabel = `${state.streak.count}日`;
  const dateChanged = lastHeaderDateLabel && lastHeaderDateLabel !== nextDateLabel;
  const streakChanged = lastStreakLabel && lastStreakLabel !== nextStreakLabel;
  elements.todayLabel.textContent = nextDateLabel;
  elements.dateChevron.classList.toggle("is-open", isCalendarOpen && calendarMode === "date");
  elements.streakButton.classList.toggle("is-active", isCalendarOpen && calendarMode === "streak");
  elements.homeTitle.textContent = selectedDate === getToday() ? "今日の授業" : "選択日の授業";
  elements.streakCount.textContent = nextStreakLabel;
  elements.completionLabel.textContent =
    state.scheduleTemplates.length === 0 ? "未設定" : lessons.length === 0 ? "授業なし" : `${completeLessons} / ${lessons.length}`;
  if (dateChanged) restartElementAnimation(elements.dateButton, "is-updating");
  if (streakChanged) restartElementAnimation(elements.streakCount.closest(".streak-pill"), "is-pulsing");
  lastHeaderDateLabel = nextDateLabel;
  lastStreakLabel = nextStreakLabel;
}

function restartElementAnimation(element, className) {
  if (!element) return;
  element.classList.remove(className);
  void element.offsetWidth;
  element.classList.add(className);
  window.setTimeout(() => element.classList.remove(className), 260);
}

function renderCalendar() {
  window.clearTimeout(calendarCloseTimer);
  if (!isCalendarOpen) {
    elements.calendarPanel.classList.remove("is-open");
    calendarCloseTimer = window.setTimeout(() => {
      if (!isCalendarOpen) elements.calendarPanel.hidden = true;
    }, 240);
    return;
  }

  const shouldAnimateOpen = elements.calendarPanel.hidden || !elements.calendarPanel.classList.contains("is-open");
  elements.calendarPanel.hidden = false;
  if (shouldAnimateOpen) elements.calendarPanel.classList.remove("is-open");

  const year = calendarMonthDate.getFullYear();
  const month = calendarMonthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const startOffset = firstDate.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = getToday();
  const streakSummary =
    calendarMode === "streak"
      ? `
        <div class="streak-calendar-summary">
          <div class="streak-summary-card">
            <span class="streak-summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 3.5C9.5 6.2 8.2 8.4 8.2 10.7C8.2 13 9.9 14.7 12 14.7C14.1 14.7 15.8 13 15.8 10.8C15.8 9.2 15.1 7.8 13.8 6.4"></path>
                <path d="M7.1 12.6C5.8 13.9 5 15.3 5 17C5 19.6 7.3 21.5 12 21.5C16.7 21.5 19 19.6 19 17C19 15.2 18.1 13.6 16.7 12.3"></path>
              </svg>
            </span>
            <div>
              <p>継続記録</p>
              <strong>${state.streak.count}日継続中</strong>
            </div>
          </div>
          <div class="streak-summary-card is-best">
            <span class="streak-summary-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
                <path d="M6.5 20H17.5"></path>
                <path d="M8 17.5H16"></path>
                <path d="M7 4.5H17L15.7 13.2C15.5 14.7 14.2 15.8 12.7 15.8H11.3C9.8 15.8 8.5 14.7 8.3 13.2L7 4.5Z"></path>
                <path d="M7.5 7H4.5C4.8 10.2 6.2 12.2 8.1 12.8"></path>
                <path d="M16.5 7H19.5C19.2 10.2 17.8 12.2 15.9 12.8"></path>
              </svg>
            </span>
            <div>
              <p>自己ベスト</p>
              <strong>${getBestStreak()}日</strong>
            </div>
          </div>
        </div>
      `
      : "";

  elements.calendarPanel.innerHTML = `
    ${streakSummary}
    <div class="calendar-header">
      <button class="calendar-arrow" type="button" data-month="-1" aria-label="前の月">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 6L9 12L15 18"></path>
        </svg>
      </button>
      <strong>${year}/${month + 1}</strong>
      <button class="calendar-arrow" type="button" data-month="1" aria-label="次の月">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 6L15 12L9 18"></path>
        </svg>
      </button>
    </div>
    <div class="calendar-grid calendar-weekdays">
      ${dayNames.map((day) => `<span>${day}</span>`).join("")}
    </div>
    <div class="calendar-grid" id="calendarDays"></div>
    <div class="calendar-legend">
      <span><i class="legend-swatch is-complete"></i>完了</span>
      <span><i class="legend-swatch is-incomplete"></i>未入力</span>
      <span><i class="legend-swatch is-no-lesson"></i>授業なし</span>
    </div>
  `;

  elements.calendarPanel.querySelectorAll(".calendar-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      calendarMonthDate = new Date(year, month + Number(button.dataset.month), 1);
      renderCalendar();
    });
  });

  const days = elements.calendarPanel.querySelector("#calendarDays");
  for (let i = 0; i < startOffset; i += 1) {
    days.append(document.createElement("span"));
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = formatDateKey(new Date(year, month, day));
    const button = document.createElement("button");
    button.type = "button";
    button.className = "calendar-day";
    button.textContent = day;
    button.disabled = dateKey > todayKey;
    button.classList.toggle("is-selected", dateKey === selectedDate);
    button.classList.toggle("is-today", dateKey === todayKey);
    const dateStatus = getDateStatus(dateKey);
    button.classList.add(`is-${dateStatus}`);
    button.addEventListener("click", () => {
      selectCalendarDate(dateKey);
    });
    days.append(button);
  }

  if (shouldAnimateOpen) {
    requestAnimationFrame(() => elements.calendarPanel.classList.add("is-open"));
  } else {
    elements.calendarPanel.classList.add("is-open");
  }
}

function getDateStatus(dateKey) {
  if (state.completedDates.includes(dateKey)) return "complete";
  const lessons = lessonsForDate(dateKey);
  const completedStudies = studiesForDate(dateKey).filter((study) => isComplete(study, dateKey));
  if (lessons.length === 0 && completedStudies.length > 0) return "complete";
  if (lessons.length === 0) return "no-lesson";
  return lessons.every((lesson) => isComplete(lesson, dateKey)) ? "complete" : "incomplete";
}

function getBestStreak() {
  const today = getToday();
  const dateSeeds = [
    today,
    ...state.completedDates,
    ...state.memos.map((memo) => memo.date),
    ...state.archivedMemos.map((memo) => memo.date),
    ...state.scheduleRanges.map((range) => range.startDate).filter(Boolean)
  ].sort();
  const startDate = dateSeeds[0] || today;
  let cursor = startDate;
  let current = 0;
  let best = 0;

  while (cursor <= today) {
    const lessons = lessonsForDate(cursor);
    if (lessons.length > 0) {
      if (state.completedDates.includes(cursor) || lessons.every((lesson) => isComplete(lesson, cursor))) {
        current += 1;
        best = Math.max(best, current);
      } else {
        current = 0;
      }
    }
    cursor = addDays(cursor, 1);
  }

  return best;
}

function renderHistory() {
  renderHistoryControls();
  renderSubjectFilters();
  renderHistoryList();
  renderHistoryMenuButton();
}

function renderHistoryMenuButton() {
  elements.historyMenuButton.classList.toggle("is-active", isHistoryMenuOpen);
  elements.historyMenuButton.hidden = false;
}

function syncHistoryMenuState() {
  const popover = elements.historyControls.querySelector(".history-menu-popover");
  if (popover) popover.classList.toggle("is-open", isHistoryMenuOpen);
  renderHistoryMenuButton();
}

function syncHistoryFilterState() {
  const header = elements.historyControls.querySelector(".history-filter-header");
  const body = elements.historyControls.querySelector(".history-filter-body");
  const icon = header?.querySelector("svg");
  if (header) header.setAttribute("aria-expanded", String(isHistoryFilterOpen));
  if (body) body.classList.toggle("is-open", isHistoryFilterOpen);
  if (icon) icon.classList.toggle("is-open", isHistoryFilterOpen);
}

function renderSubjectFilters() {
  elements.subjectFilters.innerHTML = "";
  elements.subjectFilters.append(createFilterButton("all", "すべて"));
  state.subjects.forEach((subject) => {
    elements.subjectFilters.append(createFilterButton(subject.id, subject.name, subject.color));
  });
}

function renderHistoryList() {
  const memos = getVisibleHistoryMemos()
    .filter((memo) => memo.content.trim().length > 0)
    .filter((memo) => memo.completed !== false)
    .filter((memo) => activeHistorySubject === "all" || memo.subjectId === activeHistorySubject)
    .filter((memo) => isMemoInHistoryRange(memo))
    .sort((a, b) => {
      const dateSort =
        historySortOrder === "asc" ? a.date.localeCompare(b.date) : b.date.localeCompare(a.date);
      return dateSort || a.period - b.period;
    });

  elements.historyList.innerHTML = "";
  if (memos.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = historyMemoMode === "archive" ? "アーカイブメモはありません" : "まだ履歴がありません";
    elements.historyList.append(empty);
    return;
  }

  memos.forEach((memo) => {
    const subject = getSubject(memo.subjectId);
    const item = document.createElement("article");
    item.className = "history-item";
    item.style.setProperty("--subject-color", subject ? subject.color : "#aab4bd");
    item.innerHTML = `
      <div class="color-bar"></div>
      <div class="history-content">
        <div class="history-date"></div>
        <p class="history-memo"></p>
      </div>
    `;
    item.querySelector(".history-date").textContent = `${formatDisplayDate(memo.date, {
      markToday: true
    })} ${subject ? subject.name : "未登録科目"}`;
    item.querySelector(".history-memo").textContent = memo.content;
    elements.historyList.append(item);
  });
}

function getVisibleHistoryMemos() {
  return historyMemoMode === "archive" ? state.archivedMemos : state.memos;
}

function renderHistoryControls() {
  const defaults = getMemoActionDefaultRange();
  if (!memoActionStart) memoActionStart = defaults.startDate;
  if (!memoActionEnd) memoActionEnd = defaults.endDate;
  elements.historyControls.innerHTML = `
    <div class="history-mode-tabs${historyMemoMode === "archive" ? " is-archive" : ""}" role="tablist" aria-label="履歴種別">
      <button class="${historyMemoMode === "active" ? "is-active" : ""}" type="button" data-history-mode="active">通常メモ</button>
      <button class="${historyMemoMode === "archive" ? "is-active" : ""}" type="button" data-history-mode="archive">アーカイブ</button>
    </div>
    <div class="history-menu-popover${isHistoryMenuOpen ? " is-open" : ""}">
      <button class="small-button memo-action-menu-button${historyMemoMode === "archive" ? " is-hidden" : ""}" type="button" data-open-memo-action="archive">
        <span>メモをアーカイブ</span>
        <small>アーカイブする期間を選択します</small>
      </button>
      <button class="small-button danger-button memo-action-menu-button" type="button" data-open-memo-action="reset">
        <span>メモを削除</span>
        <small>削除する期間を選択します</small>
      </button>
    </div>
    <div class="memo-action-panel${isMemoActionPanelOpen ? "" : " is-hidden"}">
      <p class="memo-action-title">${selectedMemoAction === "archive" ? "メモをアーカイブ" : "メモを削除"}</p>
      <div class="memo-action-range">
        <label>
          <span>開始日</span>
          <input id="memoActionStartInput" type="date" value="${memoActionStart}">
        </label>
        <label>
          <span>終了日</span>
          <input id="memoActionEndInput" type="date" value="${memoActionEnd}">
        </label>
      </div>
      <div class="memo-action-buttons">
        <button class="small-button${selectedMemoAction === "reset" ? " danger-button" : ""}" type="button" data-memo-action="${selectedMemoAction}">${
          selectedMemoAction === "archive" ? "この期間をアーカイブ" : "この期間を削除"
        }</button>
        <button class="small-button" type="button" data-memo-action-cancel>キャンセル</button>
      </div>
    </div>
    <div class="history-filter-panel">
      <button class="history-filter-header" type="button" aria-expanded="${isHistoryFilterOpen}">
        <span>フィルター</span>
        <svg class="${isHistoryFilterOpen ? "is-open" : ""}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M7 14L12 9L17 14"></path>
        </svg>
      </button>
      <div class="history-filter-body${isHistoryFilterOpen ? " is-open" : ""}">
        <label class="history-filter-row">
          <span>
            <svg class="period-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <rect x="3" y="5" width="18" height="16" rx="3"></rect>
              <path d="M3 9H21"></path>
              <path d="M8 3V7"></path>
              <path d="M16 3V7"></path>
            </svg>
            期間
          </span>
          <select id="historyRangeSelect">
            <option value="all"${historyRange === "all" ? " selected" : ""}>すべて</option>
            <option value="7"${historyRange === "7" ? " selected" : ""}>7日</option>
            <option value="30"${historyRange === "30" ? " selected" : ""}>30日</option>
            <option value="custom"${historyRange === "custom" ? " selected" : ""}>期間指定</option>
          </select>
        </label>
        <div class="custom-range${historyRange === "custom" ? " is-active" : ""}">
          <input id="historyStartInput" type="date" value="${historyCustomStart}">
          <input id="historyEndInput" type="date" value="${historyCustomEnd}">
        </div>
        <label class="history-filter-row">
          <span aria-label="並び順">
            <svg class="period-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M7 4V18"></path>
              <path d="M4 15L7 18L10 15"></path>
              <path d="M17 20V6"></path>
              <path d="M14 9L17 6L20 9"></path>
            </svg>
          </span>
          <select id="historySortSelect">
            <option value="desc"${historySortOrder === "desc" ? " selected" : ""}>新しい順</option>
            <option value="asc"${historySortOrder === "asc" ? " selected" : ""}>古い順</option>
          </select>
        </label>
      </div>
    </div>
  `;

  elements.historyControls.querySelectorAll("[data-history-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      const nextMode = button.dataset.historyMode;
      if (nextMode === historyMemoMode) return;
      const tabs = elements.historyControls.querySelector(".history-mode-tabs");
      tabs.classList.toggle("is-archive", nextMode === "archive");
      tabs.querySelectorAll("[data-history-mode]").forEach((tabButton) => {
        tabButton.classList.toggle("is-active", tabButton.dataset.historyMode === nextMode);
      });
      elements.historyList.classList.add("is-switching");
      historyMemoMode = nextMode;
      if (historyMemoMode === "archive") {
        isMemoActionPanelOpen = false;
        isHistoryMenuOpen = false;
      }
      window.setTimeout(() => {
        renderHistory();
        requestAnimationFrame(() => elements.historyList.classList.remove("is-switching"));
      }, 260);
    });
  });
  elements.historyControls.querySelector(".history-filter-header").addEventListener("click", () => {
    isHistoryFilterOpen = !isHistoryFilterOpen;
    syncHistoryFilterState();
  });
  const rangeSelect = elements.historyControls.querySelector("#historyRangeSelect");
  rangeSelect.addEventListener("change", () => {
    historyRange = rangeSelect.value;
    renderHistory();
  });
  const sortSelect = elements.historyControls.querySelector("#historySortSelect");
  sortSelect.addEventListener("change", () => {
    historySortOrder = sortSelect.value;
    renderHistory();
  });

  const startInput = elements.historyControls.querySelector("#historyStartInput");
  const endInput = elements.historyControls.querySelector("#historyEndInput");
  startInput.addEventListener("change", () => {
    historyCustomStart = startInput.value;
    renderHistory();
  });
  endInput.addEventListener("change", () => {
    historyCustomEnd = endInput.value;
    renderHistory();
  });
  const actionStartInput = elements.historyControls.querySelector("#memoActionStartInput");
  const actionEndInput = elements.historyControls.querySelector("#memoActionEndInput");
  if (actionStartInput && actionEndInput) {
    actionStartInput.addEventListener("change", () => {
      memoActionStart = actionStartInput.value;
    });
    actionEndInput.addEventListener("change", () => {
      memoActionEnd = actionEndInput.value;
    });
  }
  elements.historyControls.querySelectorAll("[data-memo-action]").forEach((button) => {
    button.addEventListener("click", () => handleMemoRangeAction(button.dataset.memoAction));
  });
  elements.historyControls.querySelectorAll("[data-open-memo-action]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedMemoAction = button.dataset.openMemoAction;
      isMemoActionPanelOpen = true;
      isHistoryMenuOpen = false;
      renderHistory();
    });
  });
  const actionCancel = elements.historyControls.querySelector("[data-memo-action-cancel]");
  if (actionCancel) {
    actionCancel.addEventListener("click", () => {
      isMemoActionPanelOpen = false;
      renderHistory();
    });
  }
}

function getMemoActionDefaultRange() {
  const source = historyMemoMode === "archive" ? state.archivedMemos : state.memos;
  const activeDates = source
    .filter((memo) => memo.content.trim().length > 0)
    .map((memo) => memo.date)
    .sort();
  return {
    startDate: activeDates[0] || getToday(),
    endDate: getToday()
  };
}

function handleMemoRangeAction(action) {
  const defaults = getMemoActionDefaultRange();
  const startDate = memoActionStart || defaults.startDate;
  const endDate = memoActionEnd || defaults.endDate;
  if (!startDate || !endDate || startDate > endDate) {
    window.alert("期間を正しく指定してください。");
    return;
  }

  const source = historyMemoMode === "archive" && action === "reset" ? state.archivedMemos : state.memos;
  const targets = source.filter((memo) => memo.date >= startDate && memo.date <= endDate);
  if (targets.length === 0) {
    window.alert("指定した期間に対象のメモがありません。");
    return;
  }
  const message =
    action === "archive"
      ? "指定した期間のメモをアーカイブします。よろしいですか？"
      : "指定した期間のメモを削除します。削除後も完了済みの日の連続記録は保持されます。よろしいですか？";
  if (!window.confirm(message)) return;

  preserveCompletedDatesForRange(startDate, endDate);

  if (action === "archive") {
    const archivedAt = new Date().toISOString();
    state.archivedMemos.push(...targets.map((memo) => ({ ...memo, archivedAt })));
    state.memos = state.memos.filter((memo) => memo.date < startDate || memo.date > endDate);
  } else if (historyMemoMode === "archive") {
    state.archivedMemos = state.archivedMemos.filter((memo) => memo.date < startDate || memo.date > endDate);
  } else {
    state.memos = state.memos.filter((memo) => memo.date < startDate || memo.date > endDate);
  }
  isMemoActionPanelOpen = false;
  updateStreak();
  saveState();
  render();
}

function preserveCompletedDatesForRange(startDate, endDate) {
  const completed = new Set(state.completedDates);
  let cursor = startDate;
  while (cursor <= endDate) {
    if (isDateCompleteForStreak(cursor)) completed.add(cursor);
    cursor = addDays(cursor, 1);
  }
  state.completedDates = [...completed].sort();
}

function isDateCompleteForStreak(dateKey) {
  const lessons = lessonsForDate(dateKey);
  if (lessons.length === 0) {
    return studiesForDate(dateKey).some((study) => isComplete(study, dateKey));
  }
  return lessons.every((lesson) => isComplete(lesson, dateKey));
}

function isMemoInHistoryRange(memo) {
  if (historyRange === "all") return true;
  if (historyRange === "custom") {
    if (historyCustomStart && memo.date < historyCustomStart) return false;
    if (historyCustomEnd && memo.date > historyCustomEnd) return false;
    return true;
  }

  const days = Number(historyRange);
  const startDate = addDays(getToday(), -(days - 1));
  return memo.date >= startDate && memo.date <= getToday();
}

function createFilterButton(id, label, color = null) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `filter-button${activeHistorySubject === id ? " is-active" : ""}`;
  if (color) button.style.setProperty("--subject-color", color);
  button.innerHTML = color ? `<span class="filter-dot"></span><span></span>` : `<span></span>`;
  button.querySelector("span:last-child").textContent = label;
  button.addEventListener("click", () => {
    activeHistorySubject = id;
    renderHistory();
  });
  return button;
}

function openSettingsDetail(mode) {
  settingsMode = mode;
  settingsDraft = {
    subjects: clone(state.subjects),
    scheduleTemplates: clone(state.scheduleTemplates),
    scheduleRanges: clone(state.scheduleRanges),
    dateExceptions: clone(state.dateExceptions),
    weekOverrides: clone(state.weekOverrides),
    theme: clone(state.theme),
    maxPeriods: state.maxPeriods
  };
  settingsDraftSnapshot = serializeSettingsDraft();
  renderSettings();
}

function closeSettingsDetail(force = false) {
  if (!force && !requestSettingsExit(() => closeSettingsDetail(true))) return;
  settingsMode = "menu";
  settingsDraft = null;
  settingsDraftSnapshot = "";
  pendingSettingsAction = null;
  renderSettings();
}

function serializeSettingsDraft() {
  if (!settingsDraft) return "";
  return JSON.stringify(settingsDraft);
}

function hasUnsavedSettingsChanges() {
  return settingsDraft !== null && serializeSettingsDraft() !== settingsDraftSnapshot;
}

function requestSettingsExit(action) {
  if (!hasUnsavedSettingsChanges()) {
    action();
    return true;
  }
  pendingSettingsAction = action;
  renderSettings();
  return false;
}

function discardSettingsAndContinue() {
  const action = pendingSettingsAction;
  pendingSettingsAction = null;
  settingsDraft = null;
  settingsDraftSnapshot = "";
  if (action) action();
}

function saveSettingsAndContinue() {
  const action = pendingSettingsAction;
  pendingSettingsAction = null;
  if (settingsMode === "ranges" && !validateScheduleRanges(settingsDraft.scheduleRanges)) {
    pendingSettingsAction = action;
    renderSettings();
    return;
  }
  applyCurrentSettingsDraft();
  settingsDraft = null;
  settingsDraftSnapshot = "";
  if (action) action();
  render();
}

function cancelPendingSettingsAction() {
  pendingSettingsAction = null;
  renderSettings();
}

function renderSettings() {
  elements.settingsContent.innerHTML = "";
  if (pendingSettingsAction) renderUnsavedSettingsNotice();
  if (settingsMode === "subjects") {
    renderSubjectSettings();
    return;
  }
  if (settingsMode === "schedule") {
    renderScheduleSettings();
    return;
  }
  if (settingsMode === "ranges") {
    renderRangeSettings();
    return;
  }
  if (settingsMode === "exceptions") {
    renderExceptionSettings();
    return;
  }
  if (settingsMode === "archive") {
    renderArchiveSettings();
    return;
  }
  if (settingsMode === "theme") {
    renderThemeSettings();
    return;
  }
  renderSettingsMenu();
}

function renderUnsavedSettingsNotice() {
  const notice = document.createElement("div");
  notice.className = "unsaved-overlay";
  notice.innerHTML = `
    <div class="unsaved-notice">
      <p>保存しなくて大丈夫ですか？</p>
      <div class="unsaved-actions">
        <button class="small-button danger-button" type="button" data-action="discard">保存しないで移動する</button>
        <button class="small-button primary-mini-button" type="button" data-action="save">保存して移動する</button>
        <button class="small-button" type="button" data-action="cancel">キャンセル</button>
      </div>
    </div>
  `;
  notice.querySelector('[data-action="discard"]').addEventListener("click", discardSettingsAndContinue);
  notice.querySelector('[data-action="save"]').addEventListener("click", saveSettingsAndContinue);
  notice.querySelector('[data-action="cancel"]').addEventListener("click", cancelPendingSettingsAction);
  elements.settingsContent.append(notice);
}

function renderSettingsMenu() {
  const menu = document.createElement("div");
  menu.className = "settings-menu";
  const activeTemplateCount = getActiveTemplates(state.scheduleTemplates).length;
  const archivedTemplateCount = state.scheduleTemplates.length - activeTemplateCount;
  menu.innerHTML = `
    ${createSettingsMenuButton("subjects", "科目設定", "科目の追加・編集を行います", `${state.subjects.length}件`, "book")}
    ${createSettingsMenuButton("schedule", "時間割設定", "時間割テンプレートの作成・編集を行います", `${activeTemplateCount}件`, "clock")}
    ${createSettingsMenuButton("ranges", "時間割の期間設定", "時間割を使う期間を設定します", `${state.scheduleRanges.length}件`, "calendar")}
    ${createSettingsMenuButton(
      "exceptions",
      "休日・日ごとの予定の設定",
      "特定日の休日設定や曜日変更を行います",
      `${state.dateExceptions.length + state.weekOverrides.length}件`,
      "holiday"
    )}
    ${createSettingsMenuButton("theme", "画面の色設定", "ダークモードやアクセントカラーを変更できます", getThemeModeLabel(state.theme.mode), "palette")}
    ${createSettingsMenuButton("archive", "アーカイブされた時間割一覧", "過去に使っていた時間割を確認・復元できます", `${archivedTemplateCount}件`, "archive")}
  `;
  menu.querySelectorAll("[data-settings-mode]").forEach((button) => {
    button.addEventListener("click", () => openSettingsDetail(button.dataset.settingsMode));
  });
  elements.settingsContent.append(menu);
}

function createSettingsMenuButton(mode, title, description, count, icon) {
  return `
    <button class="settings-menu-button settings-icon-${icon}" type="button" data-settings-mode="${mode}">
      <span class="settings-menu-icon" aria-hidden="true">${getSettingsMenuIcon(icon)}</span>
      <span class="settings-menu-copy">
        <span class="settings-menu-title">${title}</span>
        <span class="settings-menu-description">${description}</span>
      </span>
      <span class="settings-menu-meta">
        <small>${count}</small>
        <svg class="settings-menu-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 6L15 12L9 18"></path>
        </svg>
      </span>
    </button>
  `;
}

function getSettingsMenuIcon(icon) {
  const icons = {
    book: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <path d="M4.5 5.5C6.8 4.4 9.3 4.6 12 6.2V20C9.3 18.4 6.8 18.2 4.5 19.3V5.5Z"></path>
        <path d="M19.5 5.5C17.2 4.4 14.7 4.6 12 6.2V20C14.7 18.4 17.2 18.2 19.5 19.3V5.5Z"></path>
      </svg>
    `,
    clock: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="8.5"></circle>
        <path d="M12 7.5V12L15 14"></path>
      </svg>
    `,
    calendar: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="5.5" width="16" height="15" rx="3"></rect>
        <path d="M4 10H20"></path>
        <path d="M8 3.5V7"></path>
        <path d="M16 3.5V7"></path>
      </svg>
    `,
    holiday: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="5.5" width="16" height="15" rx="3"></rect>
        <path d="M4 10H20"></path>
        <path d="M8 3.5V7"></path>
        <path d="M16 3.5V7"></path>
        <path d="M12 13.2L13 15.1L15.1 15.4L13.6 16.9L13.9 19L12 18L10.1 19L10.4 16.9L8.9 15.4L11 15.1L12 13.2Z"></path>
      </svg>
    `,
    palette: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 4C7.6 4 4 7.2 4 11.5C4 15.7 7.4 19 11.5 19H13.2C14.2 19 14.8 17.9 14.3 17.1C13.9 16.4 14.4 15.5 15.2 15.5H16.5C18.4 15.5 20 13.9 20 12C20 7.6 16.4 4 12 4Z"></path>
        <circle cx="8.4" cy="11" r="0.7"></circle>
        <circle cx="10.6" cy="8.4" r="0.7"></circle>
        <circle cx="13.8" cy="8.6" r="0.7"></circle>
        <circle cx="16" cy="11.2" r="0.7"></circle>
      </svg>
    `,
    archive: `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round">
        <rect x="4" y="4.5" width="16" height="4" rx="1.5"></rect>
        <path d="M6 8.5V19.5H18V8.5"></path>
        <path d="M9.5 13H14.5"></path>
      </svg>
    `
  };
  return icons[icon] || icons.book;
}

function getThemeModeLabel(mode) {
  return mode === "dark" ? "ダーク" : "ライト";
}

function renderSubjectSettings() {
  const wrapper = document.createElement("div");
  wrapper.className = "settings-detail";
  wrapper.innerHTML = `
    <div class="settings-action-bar">
      <button class="back-button" type="button">← 設定に戻る</button>
      <button id="saveSubjectSettingsButton" class="primary-button" type="button">保存する</button>
    </div>
    <div class="settings-block">
      <h3>科目登録・編集</h3>
      <div id="subjectEditorList" class="editor-list"></div>
      <button id="addSubjectRowButton" class="wide-button" type="button">＋ 科目を追加</button>
    </div>
  `;
  elements.settingsContent.append(wrapper);
  wrapper.querySelector(".back-button").addEventListener("click", () => closeSettingsDetail());
  wrapper.querySelector("#addSubjectRowButton").addEventListener("click", () => {
    settingsDraft.subjects.push({
      id: createId("subject"),
      name: "",
      color: "#6aa9ff"
    });
    renderSettings();
  });
  wrapper.querySelector("#saveSubjectSettingsButton").addEventListener("click", saveSubjectSettings);
  renderSubjectEditorRows(wrapper.querySelector("#subjectEditorList"));
}

function renderSubjectEditorRows(container) {
  container.innerHTML = "";
  if (settingsDraft.subjects.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "科目がありません";
    container.append(empty);
    return;
  }

  settingsDraft.subjects.forEach((subject, index) => {
    const row = document.createElement("div");
    row.className = "subject-editor-row";
    row.innerHTML = `
      <input class="subject-name-editor" type="text" placeholder="科目名">
      <input class="subject-color-editor" type="color">
      <button class="small-button" type="button">削除</button>
    `;
    const nameInput = row.querySelector(".subject-name-editor");
    const colorInput = row.querySelector(".subject-color-editor");
    nameInput.value = subject.name;
    colorInput.value = subject.color;
    nameInput.addEventListener("input", () => {
      settingsDraft.subjects[index].name = nameInput.value;
    });
    colorInput.addEventListener("input", () => {
      settingsDraft.subjects[index].color = colorInput.value;
    });
    row.querySelector("button").addEventListener("click", () => {
      const removedId = settingsDraft.subjects[index].id;
      settingsDraft.subjects.splice(index, 1);
      settingsDraft.scheduleTemplates.forEach((template) => {
        weekdayKeys.forEach((dayKey) => {
          Object.keys(template.schedule?.[dayKey] || {}).forEach((period) => {
            if (template.schedule[dayKey][period] === removedId) delete template.schedule[dayKey][period];
          });
        });
      });
      renderSettings();
    });
    container.append(row);
  });
}

function renderScheduleSettings() {
  const wrapper = document.createElement("div");
  wrapper.className = "settings-detail";
  wrapper.innerHTML = `
    <div class="settings-action-bar">
      <button class="back-button" type="button">← 設定に戻る</button>
      <button id="saveScheduleSettingsButton" class="primary-button" type="button">保存する</button>
    </div>
    <div class="settings-block">
      <h3>科目を追加</h3>
      <div class="inline-subject-form">
        <input id="scheduleSubjectNameInput" type="text" placeholder="例：物理">
        <input id="scheduleSubjectColorInput" type="color" value="#6aa9ff">
        <button id="addScheduleSubjectButton" class="small-button" type="button">追加</button>
      </div>
    </div>
    <div class="settings-block">
      <h3>時間割テンプレート</h3>
      <label class="period-count-label">
        <span>何限まで表示するか</span>
        <input id="maxPeriodsInput" type="number" min="1" max="12">
      </label>
      <div id="templateEditorList" class="template-editor-list"></div>
      <button id="addTemplateButton" class="wide-button" type="button">＋ 時間割テンプレートを追加</button>
    </div>
  `;
  elements.settingsContent.append(wrapper);
  wrapper.querySelector("#addScheduleSubjectButton").addEventListener("click", () => addSubjectFromSchedule(wrapper));
  const maxPeriodsInput = wrapper.querySelector("#maxPeriodsInput");
  maxPeriodsInput.value = settingsDraft.maxPeriods;
  maxPeriodsInput.addEventListener("change", () => {
    settingsDraft.maxPeriods = clamp(Number(maxPeriodsInput.value), 1, 12);
    renderSettings();
  });
  wrapper.querySelector("#addTemplateButton").addEventListener("click", () => {
    settingsDraft.scheduleTemplates.push(createScheduleTemplate("新しい時間割"));
    renderSettings();
  });
  wrapper.querySelector(".back-button").addEventListener("click", () => closeSettingsDetail());
  wrapper.querySelector("#saveScheduleSettingsButton").addEventListener("click", saveScheduleSettings);
  renderTemplateEditors(wrapper.querySelector("#templateEditorList"));
}

function addSubjectFromSchedule(wrapper) {
  const nameInput = wrapper.querySelector("#scheduleSubjectNameInput");
  const colorInput = wrapper.querySelector("#scheduleSubjectColorInput");
  const name = nameInput.value.trim();
  if (!name) return;

  settingsDraft.subjects.push({
    id: createId("subject"),
    name,
    color: colorInput.value
  });
  renderSettings();
}

function createScheduleTemplate(name) {
  const now = new Date().toISOString();
  return {
    id: createId("schedule"),
    name,
    archived: false,
    createdAt: now,
    updatedAt: now,
    schedule: createEmptyTemplateSchedule()
  };
}

function renderTemplateEditors(container) {
  container.innerHTML = "";
  const templates = settingsDraft.scheduleTemplates.filter((template) => !template.archived);
  if (templates.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "時間割テンプレートがありません";
    container.append(empty);
    return;
  }

  templates.forEach((template) => {
    const card = document.createElement("div");
    card.className = "template-card";
    card.innerHTML = `
      <div class="template-card-head">
        <input class="template-name-input" type="text" placeholder="時間割名">
        <button class="small-button" type="button">アーカイブ</button>
      </div>
      <div class="schedule-table-wrap"></div>
    `;
    const nameInput = card.querySelector(".template-name-input");
    nameInput.value = template.name;
    nameInput.addEventListener("input", () => {
      template.name = nameInput.value;
      template.updatedAt = new Date().toISOString();
    });
    card.querySelector(".small-button").addEventListener("click", () => {
      template.archived = true;
      template.updatedAt = new Date().toISOString();
      renderSettings();
    });
    renderTemplateScheduleTable(card.querySelector(".schedule-table-wrap"), template);
    container.append(card);
  });
}

function renderTemplateScheduleTable(container, template) {
  const table = document.createElement("table");
  table.className = "schedule-table";
  const thead = document.createElement("thead");
  thead.innerHTML = `<tr><th>時限</th>${weekdayLabels.map((day) => `<th>${day}</th>`).join("")}</tr>`;
  const tbody = document.createElement("tbody");

  for (let period = 1; period <= settingsDraft.maxPeriods; period += 1) {
    const row = document.createElement("tr");
    row.innerHTML = `<th>${period}限</th>`;
    weekdayKeys.forEach((dayKey) => {
      const cell = document.createElement("td");
      const select = document.createElement("select");
      select.className = "schedule-cell-select";
      select.innerHTML = `<option value="">-</option>${settingsDraft.subjects
        .map((subject) => `<option value="${subject.id}">${subject.name || "名称未入力"}</option>`)
        .join("")}`;
      select.value = template.schedule?.[dayKey]?.[period] || "";
      select.addEventListener("change", () => {
        if (!template.schedule[dayKey]) template.schedule[dayKey] = {};
        if (select.value) {
          template.schedule[dayKey][period] = select.value;
        } else {
          delete template.schedule[dayKey][period];
        }
        template.updatedAt = new Date().toISOString();
      });
      cell.append(select);
      row.append(cell);
    });
    tbody.append(row);
  }

  table.append(thead, tbody);
  container.innerHTML = "";
  container.append(table);
}

function renderRangeSettings() {
  const wrapper = document.createElement("div");
  wrapper.className = "settings-detail";
  wrapper.innerHTML = `
    <div class="settings-action-bar">
      <button class="back-button" type="button">← 設定に戻る</button>
      <button id="saveRangeSettingsButton" class="primary-button" type="button">保存する</button>
    </div>
    <div class="settings-block">
      <h3>時間割の期間設定</h3>
      <div id="rangeEditorList" class="editor-list"></div>
      <button id="addRangeButton" class="wide-button" type="button">＋ 期間を追加</button>
    </div>
  `;
  elements.settingsContent.append(wrapper);
  wrapper.querySelector(".back-button").addEventListener("click", () => closeSettingsDetail());
  wrapper.querySelector("#saveRangeSettingsButton").addEventListener("click", saveRangeSettings);
  wrapper.querySelector("#addRangeButton").addEventListener("click", () => {
    const activeTemplate = getActiveTemplates(settingsDraft.scheduleTemplates)[0];
    settingsDraft.scheduleRanges.push({
      id: createId("range"),
      scheduleId: activeTemplate ? activeTemplate.id : "",
      startDate: getToday(),
      endDate: getToday()
    });
    renderSettings();
  });
  renderRangeEditorRows(wrapper.querySelector("#rangeEditorList"));
}

function renderRangeEditorRows(container) {
  container.innerHTML = "";
  if (settingsDraft.scheduleRanges.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "期間設定がありません";
    container.append(empty);
    return;
  }

  [...settingsDraft.scheduleRanges]
    .sort((a, b) => a.startDate.localeCompare(b.startDate))
    .forEach((range) => {
      const row = document.createElement("div");
      row.className = "range-editor-row";
      row.innerHTML = `
        <select class="range-template-select"></select>
        <input class="range-start-input" type="date">
        <input class="range-end-input" type="date">
        <button class="small-button" type="button">削除</button>
      `;
      const select = row.querySelector(".range-template-select");
      select.innerHTML = `<option value="">時間割を選択</option>${buildTemplateOptions(
        settingsDraft.scheduleTemplates,
        range.scheduleId,
        true
      )}`;
      select.value = range.scheduleId;
      select.addEventListener("change", () => {
        range.scheduleId = select.value;
      });
      const startInput = row.querySelector(".range-start-input");
      const endInput = row.querySelector(".range-end-input");
      startInput.value = range.startDate;
      endInput.value = range.endDate;
      startInput.addEventListener("change", () => {
        range.startDate = startInput.value;
      });
      endInput.addEventListener("change", () => {
        range.endDate = endInput.value;
      });
      row.querySelector("button").addEventListener("click", () => {
        settingsDraft.scheduleRanges = settingsDraft.scheduleRanges.filter((item) => item.id !== range.id);
        renderSettings();
      });
      container.append(row);
    });
}

function renderExceptionSettings() {
  const wrapper = document.createElement("div");
  wrapper.className = "settings-detail";
  wrapper.innerHTML = `
    <div class="settings-action-bar">
      <button class="back-button" type="button">← 設定に戻る</button>
      <button id="saveExceptionSettingsButton" class="primary-button" type="button">保存する</button>
    </div>
    <div class="settings-block">
      <div class="settings-tab-row" role="tablist" aria-label="予定設定の種類">
        <button class="settings-tab${exceptionSettingsTab === "day" ? " is-active" : ""}" type="button" data-exception-tab="day">日ごと</button>
        <button class="settings-tab${exceptionSettingsTab === "week" ? " is-active" : ""}" type="button" data-exception-tab="week">週ごと</button>
      </div>
      <div id="exceptionTabPanel"></div>
    </div>
  `;
  elements.settingsContent.append(wrapper);
  wrapper.querySelector(".back-button").addEventListener("click", () => closeSettingsDetail());
  wrapper.querySelector("#saveExceptionSettingsButton").addEventListener("click", saveExceptionSettings);
  wrapper.querySelectorAll("[data-exception-tab]").forEach((button) => {
    button.addEventListener("click", () => {
      exceptionSettingsTab = button.dataset.exceptionTab;
      renderSettings();
    });
  });
  const panel = wrapper.querySelector("#exceptionTabPanel");
  if (exceptionSettingsTab === "week") {
    renderWeekExceptionPanel(panel);
    return;
  }
  renderDayExceptionPanel(panel);
}

function formatExceptionHeading(dateKey) {
  const date = parseDateKey(dateKey);
  return `${date.getMonth() + 1}月${date.getDate()}日（${weekdayLabels[date.getDay()]}）`;
}

function renderDayExceptionPanel(container) {
  const selectedException = settingsDraft.dateExceptions.find((item) => item.date === exceptionEditorDate);
  const originalDayOfWeek = parseDateKey(exceptionEditorDate).getDay();
  container.innerHTML = `
    <div class="exception-calendar-shell">
      <div id="dayExceptionCalendar"></div>
    </div>
    <div class="exception-editor-panel">
      <h3>${formatExceptionHeading(exceptionEditorDate)}の設定</h3>
      <div class="exception-type-grid">
        <button class="small-button${!selectedException ? " is-selected" : ""}" type="button" data-type="normal">通常</button>
        <button class="small-button${selectedException?.type === "holiday" ? " is-selected" : ""}" type="button" data-type="holiday">休日</button>
        <button class="small-button${selectedException?.type === "weekday_override" ? " is-selected" : ""}" type="button" data-type="weekday_override">曜日変更</button>
        <button class="small-button${selectedException?.type === "schedule_override" ? " is-selected" : ""}" type="button" data-type="schedule_override">別時間割</button>
      </div>
      <div id="exceptionDetail"></div>
    </div>
  `;
  renderSettingsCalendar(container.querySelector("#dayExceptionCalendar"), {
    monthDate: exceptionCalendarMonthDate,
    selectedDate: exceptionEditorDate,
    statusForDate: getDateExceptionStatus,
    onMonthChange: (nextMonth) => {
      exceptionCalendarMonthDate = nextMonth;
      renderSettings();
    },
    onSelect: (dateKey) => {
      exceptionEditorDate = dateKey;
      exceptionCalendarMonthDate = parseDateKey(dateKey);
      renderSettings();
    }
  });
  container.querySelectorAll("[data-type]").forEach((button) => {
    button.addEventListener("click", () => setDateExceptionType(button.dataset.type));
  });
  renderExceptionDetail(container.querySelector("#exceptionDetail"), selectedException, originalDayOfWeek);
}

function getDateExceptionStatus(dateKey) {
  const exception = settingsDraft.dateExceptions.find((item) => item.date === dateKey);
  if (exception) return exception.type;
  return getHolidayName(dateKey) ? "default_holiday" : "";
}

function setDateExceptionType(type) {
  settingsDraft.dateExceptions = settingsDraft.dateExceptions.filter((item) => item.date !== exceptionEditorDate);
  if (type === "holiday") {
    settingsDraft.dateExceptions.push({ date: exceptionEditorDate, type: "holiday" });
  }
  if (type === "weekday_override") {
    const original = parseDateKey(exceptionEditorDate).getDay();
    const weekday = weekdayKeys.find((_, index) => index !== original) || "monday";
    settingsDraft.dateExceptions.push({ date: exceptionEditorDate, type: "weekday_override", weekday });
  }
  if (type === "schedule_override") {
    const activeTemplate = getActiveTemplates(settingsDraft.scheduleTemplates)[0];
    settingsDraft.dateExceptions.push({
      date: exceptionEditorDate,
      type: "schedule_override",
      scheduleId: activeTemplate ? activeTemplate.id : ""
    });
  }
  renderSettings();
}

function renderExceptionDetail(container, selectedException, originalDayOfWeek) {
  container.innerHTML = "";
  if (!selectedException) {
    container.innerHTML = `<p class="empty-state">この日は通常どおり扱います。</p>`;
    return;
  }
  if (selectedException.type === "holiday") {
    container.innerHTML = `<p class="empty-state">この日は休日として扱います。</p>`;
    return;
  }
  if (selectedException.type === "weekday_override") {
    const detail = document.createElement("div");
    detail.className = "weekday-override-panel";
    detail.innerHTML = `<p>この日は［${weekdayFullLabels[weekdayKeys.indexOf(selectedException.weekday)]}］として扱う</p>`;
    const row = document.createElement("div");
    row.className = "weekday-choice-row";
    weekdayLabels.forEach((label, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `small-button${selectedException.weekday === weekdayKeys[index] ? " is-selected" : ""}`;
      button.textContent = label;
      button.disabled = index === originalDayOfWeek;
      button.addEventListener("click", () => {
        selectedException.weekday = weekdayKeys[index];
        renderSettings();
      });
      row.append(button);
    });
    detail.append(row);
    container.append(detail);
    return;
  }

  const select = document.createElement("select");
  select.className = "wide-select";
  select.innerHTML = `<option value="">時間割を選択</option>${buildTemplateOptions(
    settingsDraft.scheduleTemplates,
    selectedException.scheduleId,
    true
  )}`;
  select.value = selectedException.scheduleId;
  select.addEventListener("change", () => {
    selectedException.scheduleId = select.value;
  });
  container.append(select);
}

function renderWeekExceptionPanel(container) {
  const weekStartDate = getWeekStartDate(weekOverrideEditorDate);
  const selectedOverride = settingsDraft.weekOverrides.find(
    (override) => (override.weekStartDate || override.fromWeekStartDate) === weekStartDate
  );
  const selectedScheduleId = selectedOverride?.scheduleId || "";
  weekOverrideScope = selectedOverride?.type === "week_override_from" ? "from" : weekOverrideScope;
  container.innerHTML = `
    <div class="exception-calendar-shell">
      <div id="weekExceptionCalendar"></div>
    </div>
    <div class="exception-editor-panel">
      <h3>${formatWeekHeading(weekStartDate)}の設定</h3>
      <select id="weekOverrideScheduleSelect"></select>
      <div class="exception-type-grid">
        <button class="small-button${weekOverrideScope === "once" ? " is-selected" : ""}" type="button" data-scope="once">今週だけ</button>
        <button class="small-button${weekOverrideScope === "from" ? " is-selected" : ""}" type="button" data-scope="from">今週以降</button>
      </div>
      <button id="addWeekOverrideButton" class="wide-button" type="button">週の変更を保存</button>
      <button id="removeWeekOverrideButton" class="wide-button subtle-button" type="button">この週の変更を解除</button>
    </div>
  `;
  renderSettingsCalendar(container.querySelector("#weekExceptionCalendar"), {
    monthDate: weekOverrideCalendarMonthDate,
    selectedDate: weekOverrideEditorDate,
    statusForDate: getWeekOverrideStatusForDate,
    isSelectedDate: (dateKey) => getWeekStartDate(dateKey) === weekStartDate,
    onMonthChange: (nextMonth) => {
      weekOverrideCalendarMonthDate = nextMonth;
      renderSettings();
    },
    onSelect: (dateKey) => {
      weekOverrideEditorDate = dateKey;
      weekOverrideCalendarMonthDate = parseDateKey(dateKey);
      const override = settingsDraft.weekOverrides.find(
        (item) => (item.weekStartDate || item.fromWeekStartDate) === getWeekStartDate(dateKey)
      );
      if (override) weekOverrideScope = override.type === "week_override_from" ? "from" : "once";
      renderSettings();
    }
  });
  const select = container.querySelector("#weekOverrideScheduleSelect");
  select.innerHTML = `<option value="">時間割を選択</option>${buildTemplateOptions(settingsDraft.scheduleTemplates)}`;
  select.value = selectedScheduleId;
  container.querySelectorAll("[data-scope]").forEach((button) => {
    button.addEventListener("click", () => {
      weekOverrideScope = button.dataset.scope;
      container.querySelectorAll("[data-scope]").forEach((candidate) => {
        candidate.classList.toggle("is-selected", candidate === button);
      });
    });
  });
  container.querySelector("#addWeekOverrideButton").addEventListener("click", () => {
    if (!select.value) return;
    settingsDraft.weekOverrides = settingsDraft.weekOverrides.filter((override) => {
      return (override.weekStartDate || override.fromWeekStartDate) !== weekStartDate;
    });
    settingsDraft.weekOverrides.push(
      weekOverrideScope === "once"
        ? { type: "week_override_once", weekStartDate, scheduleId: select.value }
        : { type: "week_override_from", fromWeekStartDate: weekStartDate, scheduleId: select.value }
    );
    renderSettings();
  });
  const removeButton = container.querySelector("#removeWeekOverrideButton");
  removeButton.hidden = !selectedOverride;
  removeButton.addEventListener("click", () => {
    settingsDraft.weekOverrides = settingsDraft.weekOverrides.filter((override) => {
      return (override.weekStartDate || override.fromWeekStartDate) !== weekStartDate;
    });
    renderSettings();
  });
}

function getWeekOverrideStatusForDate(dateKey) {
  const weekStartDate = getWeekStartDate(dateKey);
  const override = settingsDraft.weekOverrides.find(
    (item) => (item.weekStartDate || item.fromWeekStartDate) === weekStartDate
  );
  return override ? override.type : "";
}

function formatWeekHeading(weekStartDate) {
  const endDate = addDays(weekStartDate, 6);
  return `${formatExceptionHeading(weekStartDate)}〜${formatExceptionHeading(endDate)}`;
}

function renderSettingsCalendar(container, options) {
  const year = options.monthDate.getFullYear();
  const month = options.monthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const startOffset = firstDate.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  container.className = "settings-calendar";
  container.innerHTML = `
    <div class="calendar-header">
      <button class="calendar-arrow" type="button" data-month="-1" aria-label="前の月">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M15 6L9 12L15 18"></path>
        </svg>
      </button>
      <strong>${year}/${month + 1}</strong>
      <button class="calendar-arrow" type="button" data-month="1" aria-label="次の月">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M9 6L15 12L9 18"></path>
        </svg>
      </button>
    </div>
    <div class="calendar-grid calendar-weekdays">
      ${dayNames.map((day) => `<span>${day}</span>`).join("")}
    </div>
    <div class="calendar-grid" id="settingsCalendarDays"></div>
  `;
  container.querySelectorAll(".calendar-arrow").forEach((button) => {
    button.addEventListener("click", () => {
      options.onMonthChange(new Date(year, month + Number(button.dataset.month), 1));
    });
  });
  const days = container.querySelector("#settingsCalendarDays");
  for (let i = 0; i < startOffset; i += 1) {
    days.append(document.createElement("span"));
  }
  for (let day = 1; day <= daysInMonth; day += 1) {
    const dateKey = formatDateKey(new Date(year, month, day));
    const button = document.createElement("button");
    button.type = "button";
    button.className = "settings-calendar-day";
    button.textContent = day;
    const status = options.statusForDate(dateKey);
    if (status) button.classList.add(`is-${status}`);
    const selected = options.isSelectedDate ? options.isSelectedDate(dateKey) : dateKey === options.selectedDate;
    button.classList.toggle("is-selected", selected);
    button.addEventListener("click", () => options.onSelect(dateKey));
    days.append(button);
  }
}

function describeException(exception) {
  if (exception.type === "holiday") return "休日";
  if (exception.type === "weekday_override") {
    return `${weekdayFullLabels[weekdayKeys.indexOf(exception.weekday)]}時程`;
  }
  const template = getScheduleTemplate(exception.scheduleId, settingsDraft.scheduleTemplates);
  return template ? template.name : "別時間割";
}

function renderArchiveSettings() {
  const wrapper = document.createElement("div");
  wrapper.className = "settings-detail";
  wrapper.innerHTML = `
    <div class="settings-action-bar">
      <button class="back-button" type="button">← 設定に戻る</button>
      <button id="saveArchiveSettingsButton" class="primary-button" type="button">保存する</button>
    </div>
    <div class="settings-block">
      <h3>アーカイブされた時間割一覧</h3>
      <div id="archiveTemplateList" class="editor-list"></div>
    </div>
  `;
  elements.settingsContent.append(wrapper);
  wrapper.querySelector(".back-button").addEventListener("click", () => closeSettingsDetail());
  wrapper.querySelector("#saveArchiveSettingsButton").addEventListener("click", saveArchiveSettings);
  const list = wrapper.querySelector("#archiveTemplateList");
  const archived = settingsDraft.scheduleTemplates.filter((template) => template.archived);
  if (archived.length === 0) {
    list.innerHTML = `<p class="empty-state">アーカイブされた時間割はありません</p>`;
    return;
  }
  archived.forEach((template) => {
    const row = document.createElement("div");
    row.className = "simple-list-row";
    row.innerHTML = `<span>${template.name || "名称未入力"}</span><button class="small-button" type="button">復元</button>`;
    row.querySelector("button").addEventListener("click", () => {
      template.archived = false;
      template.updatedAt = new Date().toISOString();
      renderSettings();
    });
    list.append(row);
  });
}

function renderThemeSettings() {
  const wrapper = document.createElement("div");
  wrapper.className = "settings-detail";
  wrapper.innerHTML = `
    <div class="settings-action-bar">
      <button class="back-button" type="button">← 設定に戻る</button>
      <button id="saveThemeSettingsButton" class="primary-button" type="button">保存する</button>
    </div>
    <div class="settings-block">
      <h3>画面の色設定</h3>
      <div class="theme-mode-grid" role="group" aria-label="画面モード">
        <button class="theme-choice${settingsDraft.theme.mode === "light" ? " is-selected" : ""}" type="button" data-theme-mode="light">
          <span class="theme-choice-sample is-light"></span>
          <span>ライト</span>
        </button>
        <button class="theme-choice${settingsDraft.theme.mode === "dark" ? " is-selected" : ""}" type="button" data-theme-mode="dark">
          <span class="theme-choice-sample is-dark"></span>
          <span>ダーク</span>
        </button>
      </div>
      <label class="theme-color-label">
        <span>アクセントカラー</span>
        <input id="themeAccentInput" type="color" value="${settingsDraft.theme.accent}">
      </label>
      <div class="accent-preset-row" aria-label="おすすめカラー">
        ${["#2f80ed", "#35b978", "#f59e0b", "#e24d76", "#7c3aed", "#14b8a6"]
          .map(
            (color) =>
              `<button class="accent-preset${settingsDraft.theme.accent.toLowerCase() === color ? " is-selected" : ""}" style="--preset-color: ${color}" type="button" data-color="${color}" aria-label="${color}"></button>`
          )
          .join("")}
      </div>
      <div class="theme-preview">
        <span class="theme-preview-pill">Today 5/3 Sun</span>
        <span class="theme-preview-button">保存する</span>
      </div>
    </div>
  `;
  elements.settingsContent.append(wrapper);
  setThemeVariables(wrapper, settingsDraft.theme);
  wrapper.querySelector(".back-button").addEventListener("click", () => closeSettingsDetail());
  wrapper.querySelector("#saveThemeSettingsButton").addEventListener("click", saveThemeSettings);
  wrapper.querySelectorAll("[data-theme-mode]").forEach((button) => {
    button.addEventListener("click", () => {
      settingsDraft.theme.mode = button.dataset.themeMode;
      renderSettings();
    });
  });
  const accentInput = wrapper.querySelector("#themeAccentInput");
  accentInput.addEventListener("input", () => {
    settingsDraft.theme.accent = accentInput.value;
    setThemeVariables(wrapper, settingsDraft.theme);
  });
  wrapper.querySelectorAll("[data-color]").forEach((button) => {
    button.addEventListener("click", () => {
      settingsDraft.theme.accent = button.dataset.color;
      renderSettings();
    });
  });
}

function saveSubjectSettings() {
  applyCurrentSettingsDraft();
  closeSettingsDetail(true);
  render();
}

function saveScheduleSettings() {
  applyCurrentSettingsDraft();
  closeSettingsDetail(true);
  render();
}

function saveRangeSettings() {
  if (!validateScheduleRanges(settingsDraft.scheduleRanges)) return;
  applyCurrentSettingsDraft();
  closeSettingsDetail(true);
  render();
}

function saveExceptionSettings() {
  applyCurrentSettingsDraft();
  closeSettingsDetail(true);
  render();
}

function saveArchiveSettings() {
  applyCurrentSettingsDraft();
  closeSettingsDetail(true);
  render();
}

function saveThemeSettings() {
  applyCurrentSettingsDraft();
  closeSettingsDetail(true);
  render();
}

function applyCurrentSettingsDraft() {
  if (!settingsDraft) return;
  if (settingsMode === "subjects") {
    applySubjectSettingsDraft();
    return;
  }
  if (settingsMode === "schedule") {
    applyScheduleSettingsDraft();
    return;
  }
  if (settingsMode === "ranges") {
    applyRangeSettingsDraft();
    return;
  }
  if (settingsMode === "exceptions") {
    applyExceptionSettingsDraft();
    return;
  }
  if (settingsMode === "archive") {
    applyArchiveSettingsDraft();
    return;
  }
  if (settingsMode === "theme") {
    applyThemeSettingsDraft();
  }
}

function applySubjectSettingsDraft() {
  const validSubjects = settingsDraft.subjects
    .map((subject) => ({ ...subject, name: subject.name.trim() }))
    .filter((subject) => subject.name.length > 0);
  const validIds = new Set(validSubjects.map((subject) => subject.id));
  state.subjects = validSubjects;
  state.scheduleTemplates.forEach((template) => {
    weekdayKeys.forEach((dayKey) => {
      Object.keys(template.schedule?.[dayKey] || {}).forEach((period) => {
        if (!validIds.has(template.schedule[dayKey][period])) delete template.schedule[dayKey][period];
      });
    });
  });
  updateStreak();
  saveState();
}

function applyScheduleSettingsDraft() {
  const validSubjects = settingsDraft.subjects
    .map((subject) => ({ ...subject, name: subject.name.trim() }))
    .filter((subject) => subject.name.length > 0);
  const validSubjectIds = new Set(validSubjects.map((subject) => subject.id));
  state.subjects = validSubjects;
  state.maxPeriods = clamp(settingsDraft.maxPeriods, 1, 12);
  state.scheduleTemplates = settingsDraft.scheduleTemplates.map((template) => ({
    ...template,
    name: template.name.trim() || "名称未入力",
    schedule: sanitizeTemplateSchedule(template.schedule, validSubjectIds, state.maxPeriods),
    updatedAt: template.updatedAt || new Date().toISOString()
  }));
  state.scheduleRanges = state.scheduleRanges.filter((range) =>
    state.scheduleTemplates.some((template) => template.id === range.scheduleId)
  );
  state.dateExceptions = state.dateExceptions.filter(
    (exception) =>
      exception.type !== "schedule_override" ||
      state.scheduleTemplates.some((template) => template.id === exception.scheduleId)
  );
  state.weekOverrides = state.weekOverrides.filter((override) =>
    state.scheduleTemplates.some((template) => template.id === override.scheduleId)
  );
  updateStreak();
  saveState();
}

function applyRangeSettingsDraft() {
  state.scheduleRanges = settingsDraft.scheduleRanges
    .filter((range) => range.scheduleId && range.startDate && range.endDate && range.startDate <= range.endDate)
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
  updateStreak();
  saveState();
}

function applyExceptionSettingsDraft() {
  state.dateExceptions = settingsDraft.dateExceptions
    .filter((exception) => exception.date && exception.type)
    .sort((a, b) => a.date.localeCompare(b.date));
  state.weekOverrides = settingsDraft.weekOverrides;
  updateStreak();
  saveState();
}

function applyArchiveSettingsDraft() {
  state.scheduleTemplates = settingsDraft.scheduleTemplates;
  updateStreak();
  saveState();
}

function applyThemeSettingsDraft() {
  state.theme = {
    mode: settingsDraft.theme.mode === "dark" ? "dark" : "light",
    accent: /^#[0-9a-f]{6}$/i.test(settingsDraft.theme.accent)
      ? settingsDraft.theme.accent
      : defaultState.theme.accent
  };
  applyTheme();
  saveState();
}

function sanitizeTemplateSchedule(schedule, validSubjectIds, maxPeriods) {
  const next = createEmptyTemplateSchedule();
  weekdayKeys.forEach((dayKey) => {
    Object.entries(schedule?.[dayKey] || {}).forEach(([period, subjectId]) => {
      const periodNumber = Number(period);
      if (validSubjectIds.has(subjectId) && periodNumber <= maxPeriods) {
        next[dayKey][periodNumber] = subjectId;
      }
    });
  });
  return next;
}

function validateScheduleRanges(ranges) {
  const validRanges = ranges.filter(
    (range) => range.scheduleId && range.startDate && range.endDate && range.startDate <= range.endDate
  );
  for (let i = 0; i < validRanges.length; i += 1) {
    for (let j = i + 1; j < validRanges.length; j += 1) {
      const a = validRanges[i];
      const b = validRanges[j];
      if (a.startDate <= b.endDate && a.endDate >= b.startDate) {
        window.alert("この期間は、すでに別の時間割が設定されています。期間が重複しないように変更してください。");
        return false;
      }
    }
  }
  return true;
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
}

function createId(prefix) {
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function renderStudyPicker() {
  elements.studyPicker.innerHTML = "";
  if (state.subjects.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "先に科目を登録してください";
    elements.studyPicker.append(empty);
    return;
  }

  state.subjects.forEach((subject) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "study-subject-button";
    button.textContent = subject.name;
    button.addEventListener("click", () => addStudy(subject.id));
    elements.studyPicker.append(button);
  });
}

function addStudy(subjectId) {
  const date = selectedDate;
  const studyCount = state.memos.filter((memo) => memo.date === date && memo.type === "study").length;
  elements.studyPicker.hidden = true;
  setMemo(date, subjectId, 100 + studyCount + 1, "", "study");
}

function render() {
  renderHome();
  renderHistory();
  renderSettings();
  renderStudyPicker();
}

function showView(viewId) {
  const previousViewId = getActiveViewId();
  const previousIndex = viewOrder.indexOf(previousViewId);
  const nextIndex = viewOrder.indexOf(viewId);
  const enterClass =
    previousIndex !== -1 && nextIndex !== -1 && nextIndex < previousIndex
      ? "view-enter-from-left"
      : "view-enter-from-right";
  document.querySelectorAll(".nav-button").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === viewId);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.remove("view-enter-from-right", "view-enter-from-left");
    view.classList.toggle("is-active", view.id === viewId);
  });
  const activeView = document.querySelector(`#${viewId}`);
  if (activeView && previousViewId !== viewId) {
    activeView.classList.add(enterClass);
    requestAnimationFrame(() => {
      activeView.classList.remove(enterClass);
    });
  }
  render();
}

function getActiveViewId() {
  return document.querySelector(".view.is-active")?.id || "homeView";
}

function resetSettingsDetail() {
  settingsMode = "menu";
  settingsDraft = null;
  settingsDraftSnapshot = "";
  pendingSettingsAction = null;
}

function openHeaderCalendar(mode = "date") {
  calendarMonthDate = parseDateKey(selectedDate);
  isCalendarOpen = calendarMode === mode ? !isCalendarOpen : true;
  calendarMode = mode;
  renderHeaderState();
  renderCalendar();
}

function selectCalendarDate(dateKey) {
  const moveHome = () => {
    selectedDate = dateKey;
    isCalendarOpen = false;
    resetSettingsDetail();
    showView("homeView");
  };

  if (getActiveViewId() === "settingsView") {
    requestSettingsExit(moveHome);
    return;
  }
  moveHome();
}

function bindNavigation() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.view !== "settingsView") {
        requestSettingsExit(() => {
          resetSettingsDetail();
          showView(button.dataset.view);
        });
        return;
      }
      showView(button.dataset.view);
    });
  });
}

function bindGlobalEvents() {
  elements.addStudyButton.addEventListener("click", () => {
    elements.studyPicker.hidden = !elements.studyPicker.hidden;
  });
  elements.historyMenuButton.addEventListener("click", (event) => {
    event.stopPropagation();
    isHistoryMenuOpen = !isHistoryMenuOpen;
    syncHistoryMenuState();
  });
  document.addEventListener("click", (event) => {
    if (!isHistoryMenuOpen) return;
    const clickedMenu = event.target.closest(".history-menu-popover");
    const clickedButton = event.target.closest("#historyMenuButton");
    if (clickedMenu || clickedButton) return;
    isHistoryMenuOpen = false;
    syncHistoryMenuState();
  });
  elements.dateButton.addEventListener("click", () => {
    openHeaderCalendar("date");
  });
  elements.streakButton.addEventListener("click", () => {
    openHeaderCalendar("streak");
  });
  window.addEventListener("beforeunload", (event) => {
    if (!hasUnsavedSettingsChanges()) return;
    event.preventDefault();
    event.returnValue = "";
  });
}

function initApp() {
  if (isAppInitialized) return;
  isAppInitialized = true;
  collectElements();
  applyTheme();
  updateStreak();
  bindNavigation();
  bindGlobalEvents();
  render();
}

window.choifukuInitApp = initApp;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
