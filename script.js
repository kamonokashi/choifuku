const STORAGE_KEY = "studyReviewApp.v1";

const dayNames = ["日", "月", "火", "水", "木", "金", "土"];
const defaultState = {
  subjects: [
    { id: "english", name: "英語", color: "#6aa9ff" },
    { id: "math", name: "数学", color: "#73c69b" },
    { id: "history", name: "歴史", color: "#f0b56a" }
  ],
  schedule: [
    { dayOfWeek: 0, period: 1, subjectId: "english" },
    { dayOfWeek: 0, period: 2, subjectId: "math" },
    { dayOfWeek: 1, period: 1, subjectId: "english" },
    { dayOfWeek: 1, period: 2, subjectId: "math" },
    { dayOfWeek: 2, period: 1, subjectId: "history" },
    { dayOfWeek: 3, period: 2, subjectId: "english" },
    { dayOfWeek: 4, period: 1, subjectId: "math" },
    { dayOfWeek: 5, period: 3, subjectId: "history" }
  ],
  memos: [],
  streak: {
    count: 0,
    lastCompletedDate: null
  }
};

let state = loadState();
let activeHistorySubject = "all";

const elements = {
  todayLabel: document.querySelector("#todayLabel"),
  streakCount: document.querySelector("#streakCount"),
  completionLabel: document.querySelector("#completionLabel"),
  lessonList: document.querySelector("#lessonList"),
  addStudyButton: document.querySelector("#addStudyButton"),
  studyPicker: document.querySelector("#studyPicker"),
  historyList: document.querySelector("#historyList"),
  subjectFilters: document.querySelector("#subjectFilters"),
  subjectForm: document.querySelector("#subjectForm"),
  subjectNameInput: document.querySelector("#subjectNameInput"),
  subjectColorInput: document.querySelector("#subjectColorInput"),
  subjectList: document.querySelector("#subjectList"),
  scheduleForm: document.querySelector("#scheduleForm"),
  dayInput: document.querySelector("#dayInput"),
  periodInput: document.querySelector("#periodInput"),
  scheduleSubjectInput: document.querySelector("#scheduleSubjectInput"),
  scheduleList: document.querySelector("#scheduleList")
};

function loadState() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return structuredClone(defaultState);

  try {
    return { ...structuredClone(defaultState), ...JSON.parse(raw) };
  } catch {
    return structuredClone(defaultState);
  }
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
  const now = new Date();
  return `${now.getMonth() + 1}月${now.getDate()}日`;
}

function getSubject(subjectId) {
  return state.subjects.find((subject) => subject.id === subjectId);
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

function todayLessons() {
  const today = new Date().getDay();
  return state.schedule
    .filter((item) => item.dayOfWeek === today)
    .map((item) => ({ ...item, type: "lesson" }))
    .sort((a, b) => a.period - b.period);
}

function todayStudies() {
  const today = getToday();
  return state.memos
    .filter((memo) => memo.date === today && memo.type === "study")
    .map((memo) => ({ ...memo, type: "study" }))
    .sort((a, b) => a.period - b.period);
}

function isComplete(item, date) {
  const memo = getMemo(date, item.subjectId, item.period, item.type);
  return Boolean(memo && memo.content.trim().length > 0);
}

function updateStreak() {
  const today = getToday();
  const lessons = todayLessons();
  if (lessons.length === 0) return;
  const complete = lessons.every((lesson) => isComplete(lesson, today));
  if (!complete || state.streak.lastCompletedDate === today) return;

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const y = yesterday.getFullYear();
  const m = String(yesterday.getMonth() + 1).padStart(2, "0");
  const d = String(yesterday.getDate()).padStart(2, "0");
  const yesterdayKey = `${y}-${m}-${d}`;

  state.streak.count = state.streak.lastCompletedDate === yesterdayKey ? state.streak.count + 1 : 1;
  state.streak.lastCompletedDate = today;
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
  const date = getToday();
  const lessons = todayLessons();
  const studies = todayStudies();
  const items = [...lessons, ...studies].sort((a, b) => {
    const doneA = isComplete(a, date) ? 1 : 0;
    const doneB = isComplete(b, date) ? 1 : 0;
    return doneA - doneB || a.period - b.period;
  });
  renderHeaderState();
  elements.lessonList.innerHTML = "";

  if (items.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "今日の授業はありません";
    elements.lessonList.append(empty);
    return;
  }

  items.forEach((item) => elements.lessonList.append(createLessonCard(item, date)));
}

function renderHeaderState() {
  const date = getToday();
  const lessons = todayLessons();
  const completeLessons = lessons.filter((lesson) => isComplete(lesson, date)).length;
  elements.todayLabel.textContent = getTodayLabel();
  elements.streakCount.textContent = `${state.streak.count}日`;
  elements.completionLabel.textContent =
    lessons.length === 0 ? "授業なし" : `${completeLessons} / ${lessons.length}`;
}

function renderHistory() {
  elements.subjectFilters.innerHTML = "";
  const allButton = createFilterButton("all", "すべて");
  elements.subjectFilters.append(allButton);
  state.subjects.forEach((subject) => {
    elements.subjectFilters.append(createFilterButton(subject.id, subject.name));
  });

  const memos = state.memos
    .filter((memo) => memo.content.trim().length > 0)
    .filter((memo) => activeHistorySubject === "all" || memo.subjectId === activeHistorySubject)
    .sort((a, b) => b.date.localeCompare(a.date) || a.period - b.period);

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
    item.innerHTML = `
      <div class="history-date"></div>
      <p class="history-memo"></p>
    `;
    item.querySelector(".history-date").textContent = `${memo.date} ${subject ? subject.name : "未登録科目"}`;
    item.querySelector(".history-memo").textContent = memo.content;
    elements.historyList.append(item);
  });
}

function createFilterButton(id, label) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = `filter-button${activeHistorySubject === id ? " is-active" : ""}`;
  button.textContent = label;
  button.addEventListener("click", () => {
    activeHistorySubject = id;
    renderHistory();
  });
  return button;
}

function renderSettings() {
  elements.dayInput.innerHTML = dayNames
    .map((name, index) => `<option value="${index}">${name}曜日</option>`)
    .join("");
  elements.scheduleSubjectInput.innerHTML = state.subjects
    .map((subject) => `<option value="${subject.id}">${subject.name}</option>`)
    .join("");

  elements.subjectList.innerHTML = "";
  state.subjects.forEach((subject) => {
    const row = document.createElement("div");
    row.className = "subject-item";
    row.style.setProperty("--subject-color", subject.color);
    row.innerHTML = `
      <span class="inline-name"><span class="swatch"></span><span></span></span>
      <button class="small-button" type="button">削除</button>
    `;
    row.querySelector(".inline-name span:last-child").textContent = subject.name;
    row.querySelector("button").addEventListener("click", () => deleteSubject(subject.id));
    elements.subjectList.append(row);
  });

  elements.scheduleList.innerHTML = "";
  const schedule = [...state.schedule].sort((a, b) => a.dayOfWeek - b.dayOfWeek || a.period - b.period);
  if (schedule.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "時間割が未設定です";
    elements.scheduleList.append(empty);
    return;
  }

  schedule.forEach((item) => {
    const subject = getSubject(item.subjectId);
    const row = document.createElement("div");
    row.className = "schedule-item";
    row.innerHTML = `
      <strong></strong>
      <button class="small-button" type="button">削除</button>
    `;
    row.querySelector("strong").textContent = `${dayNames[item.dayOfWeek]}曜 ${item.period}限 ${
      subject ? subject.name : "未登録科目"
    }`;
    row.querySelector("button").addEventListener("click", () => {
      state.schedule = state.schedule.filter(
        (entry) =>
          !(
            entry.dayOfWeek === item.dayOfWeek &&
            entry.period === item.period &&
            entry.subjectId === item.subjectId
          )
      );
      saveState();
      render();
    });
    elements.scheduleList.append(row);
  });
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

function deleteSubject(subjectId) {
  state.subjects = state.subjects.filter((subject) => subject.id !== subjectId);
  state.schedule = state.schedule.filter((item) => item.subjectId !== subjectId);
  saveState();
  render();
}

function addSubject(event) {
  event.preventDefault();
  const name = elements.subjectNameInput.value.trim();
  if (!name) return;
  state.subjects.push({
    id: `subject-${Date.now()}`,
    name,
    color: elements.subjectColorInput.value
  });
  elements.subjectNameInput.value = "";
  saveState();
  render();
}

function addSchedule(event) {
  event.preventDefault();
  if (state.subjects.length === 0) return;
  state.schedule.push({
    dayOfWeek: Number(elements.dayInput.value),
    period: Number(elements.periodInput.value),
    subjectId: elements.scheduleSubjectInput.value
  });
  saveState();
  render();
}

function addStudy(subjectId) {
  const date = getToday();
  const studyCount = state.memos.filter((memo) => memo.date === date && memo.type === "study").length;
  elements.studyPicker.hidden = true;
  setMemo(date, subjectId, 100 + studyCount + 1, "", "study");
}

function bindNavigation() {
  document.querySelectorAll(".nav-button").forEach((button) => {
    button.addEventListener("click", () => {
      document.querySelectorAll(".nav-button").forEach((item) => item.classList.remove("is-active"));
      document.querySelectorAll(".view").forEach((view) => view.classList.remove("is-active"));
      button.classList.add("is-active");
      document.querySelector(`#${button.dataset.view}`).classList.add("is-active");
      render();
    });
  });
}

function render() {
  renderHome();
  renderHistory();
  renderSettings();
  renderStudyPicker();
}

elements.subjectForm.addEventListener("submit", addSubject);
elements.scheduleForm.addEventListener("submit", addSchedule);
elements.addStudyButton.addEventListener("click", () => {
  elements.studyPicker.hidden = !elements.studyPicker.hidden;
});
bindNavigation();
render();
