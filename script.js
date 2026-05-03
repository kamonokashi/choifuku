const STORAGE_KEY = "studyReviewApp.v1";

const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
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
  maxPeriods: 6,
  memos: [],
  streak: {
    count: 0,
    lastCompletedDate: null
  }
};

let state = loadState();
let activeHistorySubject = "all";
let historySortOrder = "desc";
let historyRange = "all";
let historyCustomStart = "";
let historyCustomEnd = "";
let settingsMode = "menu";
let settingsDraft = null;
let settingsDraftSnapshot = "";
let pendingSettingsAction = null;
let selectedDate = getToday();
let calendarMonthDate = parseDateKey(selectedDate);
let isCalendarOpen = false;

const elements = {
  dateButton: document.querySelector("#dateButton"),
  todayLabel: document.querySelector("#todayLabel"),
  streakCount: document.querySelector("#streakCount"),
  completionLabel: document.querySelector("#completionLabel"),
  homeTitle: document.querySelector("#homeTitle"),
  lessonList: document.querySelector("#lessonList"),
  calendarPanel: document.querySelector("#calendarPanel"),
  addStudyButton: document.querySelector("#addStudyButton"),
  studyPicker: document.querySelector("#studyPicker"),
  historyList: document.querySelector("#historyList"),
  historyControls: document.querySelector("#historyControls"),
  historySortControl: document.querySelector("#historySortControl"),
  subjectFilters: document.querySelector("#subjectFilters"),
  settingsContent: document.querySelector("#settingsContent")
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return clone(defaultState);

  try {
    const saved = JSON.parse(raw);
    const migrated = { ...clone(defaultState), ...saved };
    if (saved.maxPeriods === undefined && isSameSchedule(saved.schedule, legacyDemoSchedule)) {
      migrated.schedule = [];
    }
    return migrated;
  } catch {
    return clone(defaultState);
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
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getTodayLabel() {
  return formatDisplayDate(selectedDate, { markToday: true });
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

function getSubject(subjectId, subjects = state.subjects) {
  return subjects.find((subject) => subject.id === subjectId);
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

function setMemo(date, subjectId, period, content, type = "lesson", shouldRender = true) {
  const existing = getMemo(date, subjectId, period, type);
  if (existing) {
    existing.content = content;
    existing.updatedAt = new Date().toISOString();
  } else {
    state.memos.push({
      date,
      subjectId,
      period,
      type,
      content,
      updatedAt: new Date().toISOString()
    });
  }
  updateStreak();
  saveState();
  if (shouldRender) render();
}

function lessonsForDate(dateKey) {
  const dayOfWeek = parseDateKey(dateKey).getDay();
  return state.schedule
    .filter((item) => item.dayOfWeek === dayOfWeek)
    .map((item) => ({ ...item, type: "lesson" }))
    .sort((a, b) => a.period - b.period);
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

function isComplete(item, date) {
  const memo = getMemo(date, item.subjectId, item.period, item.type);
  return Boolean(memo && memo.content.trim().length > 0);
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
      const complete = lessons.every((lesson) => isComplete(lesson, cursor));
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
  const memo = getMemo(date, item.subjectId, item.period, item.type);
  const complete = Boolean(memo && memo.content.trim().length > 0);
  const card = document.createElement("article");
  card.className = `lesson-card${complete ? " is-complete" : ""}`;
  card.style.setProperty("--subject-color", subject.color);

  const bar = document.createElement("div");
  bar.className = "color-bar";

  const content = document.createElement("div");
  content.className = "lesson-content";

  const meta = document.createElement("div");
  meta.className = "lesson-meta";
  const periodLabel = item.type === "study" ? "自習" : `${item.period}限`;
  meta.innerHTML = `<span class="period">${periodLabel}</span><span class="subject-name"></span>`;
  meta.querySelector(".subject-name").textContent = subject.name;

  const textarea = document.createElement("textarea");
  textarea.className = "memo-input";
  textarea.rows = 1;
  textarea.placeholder = "今日覚えたことを1つだけ";
  textarea.value = memo ? memo.content : "";

  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.className = "done-button";
  doneButton.setAttribute("aria-label", "入力完了");
  doneButton.textContent = "✓";
  doneButton.disabled = textarea.value.trim().length === 0;

  textarea.addEventListener("input", () => {
    autoResize(textarea);
    setMemo(date, item.subjectId, item.period, textarea.value, item.type, false);
    card.classList.toggle("is-complete", textarea.value.trim().length > 0);
    doneButton.disabled = textarea.value.trim().length === 0;
    renderHeaderState();
  });
  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      completeMemoInput(textarea, date, item);
    }
  });
  doneButton.addEventListener("click", () => {
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

function completeMemoInput(textarea, date, item) {
  setMemo(date, item.subjectId, item.period, textarea.value, item.type, false);
  textarea.blur();
  render();
}

function autoResize(textarea) {
  textarea.style.height = "auto";
  textarea.style.height = `${textarea.scrollHeight}px`;
}

function renderHome() {
  renderHeaderState();
  renderCalendar();
  elements.lessonList.innerHTML = "";
  elements.addStudyButton.hidden = state.schedule.length === 0;
  elements.studyPicker.hidden = true;

  if (state.schedule.length === 0) {
    const prompt = document.createElement("div");
    prompt.className = "setup-prompt";
    prompt.innerHTML = `
      <p>時間割が未設定です</p>
      <button class="primary-button" type="button">時間割を設定する</button>
    `;
    prompt.querySelector("button").addEventListener("click", () => {
      showView("settingsView");
      openSettingsDetail("schedule");
    });
    elements.lessonList.append(prompt);
    return;
  }

  const date = selectedDate;
  const lessons = lessonsForDate(date);
  const studies = studiesForDate(date);
  const items = [...lessons, ...studies].sort((a, b) => {
    const doneA = isComplete(a, date) ? 1 : 0;
    const doneB = isComplete(b, date) ? 1 : 0;
    return doneA - doneB || a.period - b.period;
  });

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "この日の授業はありません";
    elements.lessonList.append(empty);
    return;
  }

  items.forEach((item) => elements.lessonList.append(createLessonCard(item, date)));
}

function renderHeaderState() {
  const date = selectedDate;
  const lessons = lessonsForDate(date);
  const completeLessons = lessons.filter((lesson) => isComplete(lesson, date)).length;
  elements.todayLabel.textContent = getTodayLabel();
  elements.homeTitle.textContent = selectedDate === getToday() ? "今日の授業" : "選択日の授業";
  elements.streakCount.textContent = `${state.streak.count}日`;
  elements.completionLabel.textContent =
    state.schedule.length === 0 ? "未設定" : lessons.length === 0 ? "授業なし" : `${completeLessons} / ${lessons.length}`;
}

function renderCalendar() {
  elements.calendarPanel.hidden = !isCalendarOpen;
  if (!isCalendarOpen) return;

  const year = calendarMonthDate.getFullYear();
  const month = calendarMonthDate.getMonth();
  const firstDate = new Date(year, month, 1);
  const startOffset = firstDate.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayKey = getToday();

  elements.calendarPanel.innerHTML = `
    <div class="calendar-header">
      <button class="calendar-arrow" type="button" data-month="-1">‹</button>
      <strong>${year}/${month + 1}</strong>
      <button class="calendar-arrow" type="button" data-month="1">›</button>
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
      selectedDate = dateKey;
      isCalendarOpen = false;
      render();
    });
    days.append(button);
  }
}

function getDateStatus(dateKey) {
  const lessons = lessonsForDate(dateKey);
  const completedStudies = studiesForDate(dateKey).filter((study) => isComplete(study, dateKey));
  if (lessons.length === 0 && completedStudies.length > 0) return "complete";
  if (lessons.length === 0) return "no-lesson";
  return lessons.every((lesson) => isComplete(lesson, dateKey)) ? "complete" : "incomplete";
}

function renderHistory() {
  renderHistoryControls();
  elements.subjectFilters.innerHTML = "";
  elements.subjectFilters.append(createFilterButton("all", "すべて"));
  state.subjects.forEach((subject) => {
    elements.subjectFilters.append(createFilterButton(subject.id, subject.name, subject.color));
  });

  const memos = state.memos
    .filter((memo) => memo.content.trim().length > 0)
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
    empty.textContent = "まだ履歴がありません";
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

function renderHistoryControls() {
  elements.historySortControl.innerHTML = `
    <button class="${historySortOrder === "desc" ? "is-active" : ""}" type="button" data-sort="desc">新しい順</button>
    <button class="${historySortOrder === "asc" ? "is-active" : ""}" type="button" data-sort="asc">古い順</button>
  `;
  elements.historyControls.innerHTML = `
    <div class="history-period-bar" aria-label="期間">
      <span class="period-control-label"><span class="period-icon" aria-hidden="true"></span>期間:</span>
      <button class="period-option${historyRange === "all" ? " is-active" : ""}" type="button" data-range="all">すべて</button>
      <button class="period-option${historyRange === "7" ? " is-active" : ""}" type="button" data-range="7">7日</button>
      <button class="period-option${historyRange === "30" ? " is-active" : ""}" type="button" data-range="30">30日</button>
      <button class="period-option${historyRange === "custom" ? " is-active" : ""}" type="button" data-range="custom">期間指定</button>
    </div>
    <div class="custom-range${historyRange === "custom" ? " is-active" : ""}">
      <input id="historyStartInput" type="date" value="${historyCustomStart}">
      <input id="historyEndInput" type="date" value="${historyCustomEnd}">
    </div>
  `;

  elements.historySortControl.querySelectorAll("[data-sort]").forEach((button) => {
    button.addEventListener("click", () => {
      historySortOrder = button.dataset.sort;
      renderHistory();
    });
  });
  elements.historyControls.querySelectorAll("[data-range]").forEach((button) => {
    button.addEventListener("click", () => {
      historyRange = button.dataset.range;
      renderHistory();
    });
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
    schedule: clone(state.schedule),
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
  menu.innerHTML = `
    <button class="settings-menu-button" type="button">
      <span>科目登録・編集</span>
      <small>${state.subjects.length}件</small>
    </button>
    <button class="settings-menu-button" type="button">
      <span>時間割の登録・編集</span>
      <small>${state.maxPeriods}限 / ${state.schedule.length}コマ</small>
    </button>
  `;
  const [subjectButton, scheduleButton] = menu.querySelectorAll("button");
  subjectButton.addEventListener("click", () => openSettingsDetail("subjects"));
  scheduleButton.addEventListener("click", () => openSettingsDetail("schedule"));
  elements.settingsContent.append(menu);
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
      id: `subject-${Date.now()}`,
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
      settingsDraft.schedule = settingsDraft.schedule.filter((item) => item.subjectId !== removedId);
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
      <h3>時間割の登録・編集</h3>
      <label class="period-count-label">
        <span>何限まで表示するか</span>
        <input id="maxPeriodsInput" type="number" min="1" max="12">
      </label>
      <div id="scheduleTableWrap" class="schedule-table-wrap"></div>
    </div>
  `;
  elements.settingsContent.append(wrapper);
  wrapper.querySelector("#addScheduleSubjectButton").addEventListener("click", () => addSubjectFromSchedule(wrapper));
  const maxPeriodsInput = wrapper.querySelector("#maxPeriodsInput");
  maxPeriodsInput.value = settingsDraft.maxPeriods;
  maxPeriodsInput.addEventListener("change", () => {
    settingsDraft.maxPeriods = clamp(Number(maxPeriodsInput.value), 1, 12);
    settingsDraft.schedule = settingsDraft.schedule.filter((item) => item.period <= settingsDraft.maxPeriods);
    renderSettings();
  });
  wrapper.querySelector(".back-button").addEventListener("click", () => closeSettingsDetail());
  wrapper.querySelector("#saveScheduleSettingsButton").addEventListener("click", saveScheduleSettings);
  renderScheduleTable(wrapper.querySelector("#scheduleTableWrap"));
}

function addSubjectFromSchedule(wrapper) {
  const nameInput = wrapper.querySelector("#scheduleSubjectNameInput");
  const colorInput = wrapper.querySelector("#scheduleSubjectColorInput");
  const name = nameInput.value.trim();
  if (!name) return;

  settingsDraft.subjects.push({
    id: `subject-${Date.now()}`,
    name,
    color: colorInput.value
  });
  renderSettings();
}

function renderScheduleTable(container) {
  const table = document.createElement("table");
  table.className = "schedule-table";
  const thead = document.createElement("thead");
  thead.innerHTML = `<tr><th>時限</th>${dayNames.map((day) => `<th>${day}</th>`).join("")}</tr>`;
  const tbody = document.createElement("tbody");

  for (let period = 1; period <= settingsDraft.maxPeriods; period += 1) {
    const row = document.createElement("tr");
    row.innerHTML = `<th>${period}限</th>`;
    dayNames.forEach((_, dayOfWeek) => {
      const cell = document.createElement("td");
      const select = document.createElement("select");
      select.className = "schedule-cell-select";
      select.innerHTML = `<option value="">-</option>${settingsDraft.subjects
        .map((subject) => `<option value="${subject.id}">${subject.name || "名称未入力"}</option>`)
        .join("")}`;
      select.value = getScheduleSubjectId(dayOfWeek, period);
      select.addEventListener("change", () => setScheduleCell(dayOfWeek, period, select.value));
      cell.append(select);
      row.append(cell);
    });
    tbody.append(row);
  }

  table.append(thead, tbody);
  container.innerHTML = "";
  container.append(table);
}

function getScheduleSubjectId(dayOfWeek, period) {
  const item = settingsDraft.schedule.find(
    (entry) => entry.dayOfWeek === dayOfWeek && entry.period === period
  );
  return item ? item.subjectId : "";
}

function setScheduleCell(dayOfWeek, period, subjectId) {
  settingsDraft.schedule = settingsDraft.schedule.filter(
    (entry) => !(entry.dayOfWeek === dayOfWeek && entry.period === period)
  );
  if (subjectId) {
    settingsDraft.schedule.push({ dayOfWeek, period, subjectId });
  }
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

function applyCurrentSettingsDraft() {
  if (!settingsDraft) return;
  if (settingsMode === "subjects") {
    applySubjectSettingsDraft();
    return;
  }
  if (settingsMode === "schedule") {
    applyScheduleSettingsDraft();
  }
}

function applySubjectSettingsDraft() {
  const validSubjects = settingsDraft.subjects
    .map((subject) => ({ ...subject, name: subject.name.trim() }))
    .filter((subject) => subject.name.length > 0);
  const validIds = new Set(validSubjects.map((subject) => subject.id));
  state.subjects = validSubjects;
  state.schedule = state.schedule.filter((item) => validIds.has(item.subjectId));
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
  state.schedule = settingsDraft.schedule
    .filter((item) => validSubjectIds.has(item.subjectId) && item.period <= state.maxPeriods)
    .sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.period - b.period);
  updateStreak();
  saveState();
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.min(Math.max(value, min), max);
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
  document.querySelectorAll(".nav-button").forEach((item) => {
    item.classList.toggle("is-active", item.dataset.view === viewId);
  });
  document.querySelectorAll(".view").forEach((view) => {
    view.classList.toggle("is-active", view.id === viewId);
  });
  render();
}

function bindNavigation() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      if (button.dataset.view !== "settingsView") {
        requestSettingsExit(() => {
          settingsMode = "menu";
          settingsDraft = null;
          settingsDraftSnapshot = "";
          pendingSettingsAction = null;
          showView(button.dataset.view);
        });
        return;
      }
      showView(button.dataset.view);
    });
  });
}

elements.addStudyButton.addEventListener("click", () => {
  elements.studyPicker.hidden = !elements.studyPicker.hidden;
});
elements.dateButton.addEventListener("click", () => {
  calendarMonthDate = parseDateKey(selectedDate);
  isCalendarOpen = !isCalendarOpen;
  renderCalendar();
});
window.addEventListener("beforeunload", (event) => {
  if (!hasUnsavedSettingsChanges()) return;
  event.preventDefault();
  event.returnValue = "";
});
updateStreak();
bindNavigation();
render();
