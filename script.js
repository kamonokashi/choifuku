const STORAGE_KEY = "studyReviewApp.v1";
const ONBOARDING_STORAGE_KEY = "choifuku.onboardingCompleted";
const OPERATION_TUTORIAL_STORAGE_KEY = "choifuku.operationTutorialCompleted";
const REVIEW_NOTIFICATION_DAILY_ID_START = 220000;
const REVIEW_NOTIFICATION_LESSON_ID_START = 221000;
const REVIEW_NOTIFICATION_LOOKAHEAD_DAYS = 60;
const REVIEW_NOTIFICATION_CHANNEL_ID = "choifuku-review-reminders";
const DEFAULT_UNSET_COLOR = "#ff0000";
const DEFAULT_ACCENT_COLOR = "#1163ff";

function getChoifukuAppIconSvg() {
  return `
    <svg class="choifuku-app-icon" width="112" height="117" viewBox="0 0 112 117" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="choifukuIconPaper" x1="4" y1="6" x2="109" y2="111" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#ffffff" />
          <stop offset="100%" stop-color="#f6faff" />
        </linearGradient>
        <linearGradient id="choifukuIconBorder" x1="4" y1="6" x2="109" y2="111" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#9bc0ff" />
          <stop offset="100%" stop-color="#3f82ff" />
        </linearGradient>
        <linearGradient id="choifukuIconRibbon" x1="82" y1="2" x2="104" y2="27" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#76a7ff" />
          <stop offset="100%" stop-color="#4b83ff" />
        </linearGradient>
        <linearGradient id="choifukuIconLine" x1="22" y1="35" x2="70" y2="65" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#90b8ff" />
          <stop offset="100%" stop-color="#6f9fff" />
        </linearGradient>
        <linearGradient id="choifukuIconPen" x1="73" y1="34" x2="91" y2="106" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stop-color="#2f79ff" />
          <stop offset="100%" stop-color="#4ca7ff" />
        </linearGradient>
      </defs>

      <rect x="4" y="6" width="105" height="105" rx="18" ry="18" fill="url(#choifukuIconPaper)" stroke="url(#choifukuIconBorder)" stroke-width="2" />

      <path d="
        M82 5
        Q82 2 85 2
        L101 2
        Q104 2 104 5
        L104 24
        Q104 27 101.5 25.5
        L93 20
        L84.5 25.5
        Q82 27 82 24
        Z
      " fill="url(#choifukuIconRibbon)" />

      <line x1="22" y1="35" x2="70" y2="35" stroke="url(#choifukuIconLine)" stroke-width="4" stroke-linecap="round" />
      <line x1="22" y1="50" x2="59" y2="50" stroke="url(#choifukuIconLine)" stroke-width="4" stroke-linecap="round" />
      <line x1="22" y1="65" x2="54" y2="65" stroke="url(#choifukuIconLine)" stroke-width="4" stroke-linecap="round" />

      <g transform="rotate(22 79 79)">
        <rect x="73" y="34" width="18" height="72" rx="5.4" ry="5.4" fill="url(#choifukuIconPen)" />
      </g>
    </svg>
  `;
}

const onboardingSlides = [
  {
    title: "choifukuへようこそ",
    contentHTML: `
      <p>授業で学んだことは、<br>時間が経つほど<br>思い出しにくくなります。</p>
      <p>でも、その日のうちに<br>少しだけ振り返るだけで、<br>記憶に残りやすくなります。</p>
    `,
    graphicHTML: `
      <div class="onboarding-icon-shell">
        ${getChoifukuAppIconSvg()}
      </div>
    `
  },
  {
    title: "こちらは、忘却曲線です",
    contentHTML: `
      <p>人は、1日たつと<br>74%も忘れてしまいます。</p>
    `,
    afterGraphicHTML: `
      <p>その日のうちに、少し思い出すだけでも<br>記憶の定着は大きく変わってきます。</p>
    `,
    graphicHTML: `
      <div class="onboarding-graph-shell">
        <svg class="onboarding-graph-svg" viewBox="0 0 332 292" aria-labelledby="forgettingCurveTitle" role="img">
          <title id="forgettingCurveTitle">復習した場合と復習していない場合の忘却曲線</title>
          <text x="10" y="20" fill="#111827" font-size="11" font-weight="700">記憶の残存率（%）</text>
          <g stroke="#e5eaf3" stroke-width="1">
            <line x1="46" y1="52" x2="46" y2="248" />
            <line x1="46" y1="248" x2="310" y2="248" />
            <line x1="46" y1="102" x2="310" y2="102" />
            <line x1="46" y1="151" x2="310" y2="151" />
            <line x1="46" y1="200" x2="310" y2="200" />
          </g>
          <g fill="#111827" font-size="13" font-weight="700" font-family="sans-serif">
            <text x="14" y="57">100</text>
            <text x="24" y="106">75</text>
            <text x="24" y="155">50</text>
            <text x="24" y="204">25</text>
            <text x="34" y="253">0</text>
            <text x="30" y="274">0日目</text>
            <text x="99" y="274">1日後</text>
            <text x="183" y="274">7日後</text>
            <text x="277" y="274">30日後</text>
          </g>
          <g fill="none" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="46,53 113,200 196,232 302,243" stroke="#8f8f8f" stroke-width="2" />
            <polyline points="113,53 196,128 302,181" stroke="#1163ff" stroke-width="2" />
            <line x1="113" y1="186" x2="113" y2="72" stroke="#1163ff" stroke-width="4" />
          </g>
          <path d="M113 63l-9 15h18z" fill="#1163ff" />
          <g>
            <circle cx="46" cy="53" r="5.5" fill="#8f8f8f" />
            <circle cx="113" cy="200" r="5.5" fill="#8f8f8f" />
            <circle cx="196" cy="232" r="5.5" fill="#8f8f8f" />
            <circle cx="302" cy="243" r="5.5" fill="#8f8f8f" />
            <circle cx="113" cy="53" r="5.5" fill="#1163ff" />
            <circle cx="196" cy="128" r="5.5" fill="#1163ff" />
            <circle cx="302" cy="181" r="5.5" fill="#1163ff" />
          </g>
        </svg>
      </div>
    `
  },
  {
    title: "一言メモでも大丈夫。",
    contentHTML: `
      <p>「何をやったか」を<br>思い出そうとすることが、<br>記憶定着の大きな一歩になります。</p>
      <p>むしろ、このくらい小さなことのほうが、<br>継続しやすいのです。</p>
    `,
    graphicHTML: `
      <div class="onboarding-note-hero">
        <svg viewBox="0 0 260 190" aria-hidden="true" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="noteHeroBg" x1="35" y1="22" x2="214" y2="164" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#eff6ff" />
              <stop offset="100%" stop-color="#eaf2ff" />
            </linearGradient>
            <linearGradient id="noteHeroPen" x1="176" y1="74" x2="134" y2="151" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#dbe9ff" />
              <stop offset="48%" stop-color="#8fc0ff" />
              <stop offset="100%" stop-color="#1163ff" />
            </linearGradient>
            <linearGradient id="noteHeroPaper" x1="86" y1="50" x2="157" y2="145" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stop-color="#ffffff" />
              <stop offset="100%" stop-color="#f8fbff" />
            </linearGradient>
          </defs>
          <ellipse cx="130" cy="108" rx="94" ry="64" fill="url(#noteHeroBg)" />
          <g fill="#9fbeff">
            <path d="M54 28l5 10 10 5-10 5-5 10-5-10-10-5 10-5z" opacity="0.82" />
            <path d="M216 42l5 10 10 5-10 5-5 10-5-10-10-5 10-5z" opacity="0.72" />
            <path d="M38 88l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" opacity="0.72" />
            <path d="M205 108l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" fill="#ffffff" opacity="0.9" />
            <circle cx="58" cy="141" r="3" opacity="0.45" />
          </g>
          <rect x="83" y="52" width="86" height="100" rx="6" fill="url(#noteHeroPaper)" stroke="#1163ff" stroke-width="2" />
          <g>
            <circle cx="101" cy="76" r="5" fill="#1163ff" />
            <circle cx="101" cy="98" r="5" fill="#1163ff" />
            <circle cx="101" cy="120" r="5" fill="#1163ff" />
            <path d="M116 76h39" stroke="#c8d8f5" stroke-width="3" stroke-linecap="round" />
            <path d="M116 98h36" stroke="#c8d8f5" stroke-width="3" stroke-linecap="round" />
            <path d="M116 120h42" stroke="#c8d8f5" stroke-width="3" stroke-linecap="round" />
          </g>
          <g transform="rotate(28 164 116)">
            <rect x="152" y="70" width="15" height="82" rx="7.5" fill="url(#noteHeroPen)" stroke="#1163ff" stroke-width="1.4" />
            <path d="M152 149h15l-7.5 17z" fill="#ffffff" stroke="#1163ff" stroke-width="1.4" stroke-linejoin="round" />
          </g>
        </svg>
      </div>
    `
  }
];
let onboardingPage = 1;
let operationTutorialStep = 0;
let operationTutorialOverlay = null;
let operationTutorialTarget = null;
let operationTutorialTargetHandler = null;
let operationTutorialTargetListenerElement = null;
let operationTutorialTargetEventName = "click";
let operationTutorialCompletionTimer = null;
let isOperationTutorialFreeEditMode = false;
let isOperationTutorialTemplateHomeActive = false;
let isOperationTutorialTemplateMemoComplete = false;
let operationTutorialTemplateMemos = [];
const operationTutorialSteps = [
  {
    id: "setup-schedule",
    selector: ".setup-prompt .primary-button",
    body: "時間割がまだ設定されていません。\nまずは時間割を作ってみましょう。",
    assist: "「時間割を設定する」をタップ",
    requiresTargetAction: true
  },
  {
    id: "add-template",
    selector: "#addTemplateButton",
    body: "まずは、時間割テンプレートを追加しましょう。",
    assist: "「＋ 時間割テンプレートを追加」をタップ",
    requiresTargetAction: true
  },
  {
    id: "edit-schedule",
    selector: ".settings-detail",
    body: "この画面で時間割を登録します。\n上部の「科目を追加」から、科目を登録することができます。",
    assist: "画面をクリック",
    requiresTargetAction: false
  },
  {
    id: "save-schedule",
    selector: ".settings-detail",
    body: "設定できたら、保存するを押してください。",
    assist: "画面をタップ",
    requiresTargetAction: false,
    allowsFreeEdit: true
  },
  {
    id: "exceptions",
    selector: '[data-settings-mode="exceptions"]',
    body: "こちらは、設定一覧画面です。\nこちらのボタンから、学校行事による授業変更などを設定できます。",
    assist: "画面をクリック",
    requiresTargetAction: false
  },
  {
    id: "back-home",
    selector: '.nav-button[data-view="homeView"]',
    body: "ホーム画面に戻りましょう。",
    assist: "「ホーム」をタップ",
    requiresTargetAction: true
  },
  {
    id: "lesson-memo",
    selector: ".tutorial-template-home .memo-input:not([data-complete='true'])",
    fallbackSelector: ".tutorial-template-home",
    body: "メモを書いたらEnterを押してみましょう。\n入力済みのメモは下へ移動し、次の未入力メモへ進めます。",
    assist: "上のメモに一言入力してEnter",
    completedBody: "次のメモへ移動できました。\nこのように、Enterで続けてメモを書けます。",
    completedAssist: "タップしてチュートリアルを完了",
    requiresTargetAction: true,
    actionEvent: "operationTutorialTemplateMemoComplete",
    usesTemplateHome: true
  }
];
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
    accent: DEFAULT_ACCENT_COLOR
  },
  notification: {
    enabled: false,
    message: "復習の時間です！",
    frequency: "lesson-days",
    time: "21:00"
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
let historyFavoritesOnly = false;
let historyCustomStart = "";
let historyCustomEnd = "";
let memoActionStart = "";
let memoActionEnd = "";
let isMemoActionPanelOpen = false;
let isHistoryMenuOpen = false;
let isHistoryFilterOpen = false;
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
let pendingMemoFocusKey = null;
let viewHistoryStack = [];
const viewOrder = ["homeView", "historyView", "settingsView"];

let elements = {};
let isAppInitialized = false;

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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

function hasSeenOnboarding() {
  return localStorage.getItem(ONBOARDING_STORAGE_KEY) === "1";
}

function markOnboardingCompleted() {
  localStorage.setItem(ONBOARDING_STORAGE_KEY, "1");
}

function hasCompletedOperationTutorial() {
  return localStorage.getItem(OPERATION_TUTORIAL_STORAGE_KEY) === "1";
}

function markOperationTutorialCompleted() {
  localStorage.setItem(OPERATION_TUTORIAL_STORAGE_KEY, "1");
}

function cleanupOnboardingOverlay() {
  document.body.style.overflow = "";
  if (elements.onboardingOverlay) {
    elements.onboardingOverlay.remove();
  }
  elements.onboardingOverlay = null;
  elements.onboardingGraphic = null;
  elements.onboardingTitle = null;
  elements.onboardingText = null;
  elements.onboardingAfterText = null;
  elements.onboardingPageLabel = null;
  elements.onboardingPrevButton = null;
  elements.onboardingNextButton = null;
  elements.onboardingStartButton = null;
}

function getOnboardingButtonTextColor(accentColor) {
  const accent = accentColor.trim() || "#2f80ed";
  const whiteContrast = getContrastRatio(accent, "#ffffff");
  const blackContrast = getContrastRatio(accent, "#000000");
  return whiteContrast >= blackContrast ? "#ffffff" : "#000000";
}

function applyOnboardingButtonColor() {
  const root = document.documentElement;
  const accent = getComputedStyle(root).getPropertyValue("--accent").trim() || "#2f80ed";
  const textColor = getOnboardingButtonTextColor(accent);
  root.style.setProperty("--onboarding-button-text", textColor);
}

function createOnboardingOverlay() {
  if (hasSeenOnboarding()) return;
  applyOnboardingButtonColor();
  const overlay = document.createElement("div");
  overlay.className = "onboarding-overlay";
  overlay.innerHTML = `
    <div class="onboarding-backdrop"></div>
    <div class="onboarding-card" role="dialog" aria-modal="true" aria-labelledby="onboardingTitle">
      <div class="onboarding-scroll">
        <div id="onboardingGraphic" class="onboarding-graphic"></div>
        <h2 id="onboardingTitle"></h2>
        <div id="onboardingText" class="onboarding-text"></div>
        <div id="onboardingAfterText" class="onboarding-text onboarding-after-text"></div>
      </div>
      <div class="onboarding-start-row">
        <button id="onboardingStartButton" class="onboarding-start-button" type="button">
          <span>チュートリアルを始める</span>
          <svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14" /><path d="M13 6l6 6-6 6" /></svg>
        </button>
      </div>
      <div class="onboarding-footer">
        <button id="onboardingPrevButton" class="onboarding-nav-button onboarding-prev-button" type="button" aria-label="前へ">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6" /></svg>
        </button>
        <span id="onboardingPageLabel" class="onboarding-page-label"></span>
        <button id="onboardingNextButton" class="onboarding-nav-button onboarding-next-button" type="button" aria-label="次へ">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6" /></svg>
        </button>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  elements.onboardingOverlay = overlay;
  elements.onboardingGraphic = overlay.querySelector("#onboardingGraphic");
  elements.onboardingTitle = overlay.querySelector("#onboardingTitle");
  elements.onboardingText = overlay.querySelector("#onboardingText");
  elements.onboardingAfterText = overlay.querySelector("#onboardingAfterText");
  elements.onboardingPageLabel = overlay.querySelector("#onboardingPageLabel");
  elements.onboardingPrevButton = overlay.querySelector("#onboardingPrevButton");
  elements.onboardingNextButton = overlay.querySelector("#onboardingNextButton");
  elements.onboardingStartButton = overlay.querySelector("#onboardingStartButton");
  elements.onboardingPrevButton.addEventListener("click", () => {
    if (onboardingPage > 1) {
      onboardingPage -= 1;
      renderOnboarding();
    }
  });
  elements.onboardingNextButton.addEventListener("click", () => {
    if (onboardingPage < onboardingSlides.length) {
      onboardingPage += 1;
      renderOnboarding();
    }
  });
  elements.onboardingStartButton.addEventListener("click", () => {
    markOnboardingCompleted();
    cleanupOnboardingOverlay();
    render();
    startOperationTutorial();
  });
  onboardingPage = 1;
  renderOnboarding();
}

function renderOnboarding() {
  if (!elements.onboardingOverlay) return;
  const visible = !hasSeenOnboarding();
  elements.onboardingOverlay.classList.toggle("is-visible", visible);
  document.body.style.overflow = visible ? "hidden" : "";
  if (!visible) {
    cleanupOnboardingOverlay();
    return;
  }
  const slide = onboardingSlides[onboardingPage - 1];
  elements.onboardingOverlay.dataset.page = String(onboardingPage);
  elements.onboardingTitle.textContent = slide.title;
  elements.onboardingGraphic.innerHTML = slide.graphicHTML;
  elements.onboardingText.innerHTML = slide.contentHTML;
  elements.onboardingAfterText.innerHTML = slide.afterGraphicHTML || "";
  elements.onboardingAfterText.hidden = !slide.afterGraphicHTML;
  elements.onboardingPageLabel.textContent = `${onboardingPage} / ${onboardingSlides.length}`;
  elements.onboardingPrevButton.style.visibility = onboardingPage === 1 ? "hidden" : "visible";
  const isLast = onboardingPage === onboardingSlides.length;
  elements.onboardingNextButton.style.visibility = isLast ? "hidden" : "visible";
  elements.onboardingStartButton.hidden = !isLast;
  elements.onboardingStartButton.style.display = isLast ? "inline-flex" : "none";
}

function shouldOfferOperationTutorial() {
  const hasConfiguredSchedule = state.scheduleTemplates.length > 0 && state.scheduleRanges.length > 0;
  return hasSeenOnboarding() && !hasCompletedOperationTutorial() && !hasConfiguredSchedule;
}

function startOperationTutorial() {
  if (!shouldOfferOperationTutorial()) return;
  operationTutorialStep = 0;
  showView("homeView");
  window.setTimeout(renderOperationTutorial, 40);
}

function cleanupOperationTutorialTarget() {
  if (operationTutorialTargetListenerElement && operationTutorialTargetHandler) {
    operationTutorialTargetListenerElement.removeEventListener(operationTutorialTargetEventName, operationTutorialTargetHandler);
  }
  if (operationTutorialTarget) {
    operationTutorialTarget.classList.remove("operation-tutorial-target");
  }
  operationTutorialTarget = null;
  operationTutorialTargetHandler = null;
  operationTutorialTargetListenerElement = null;
  operationTutorialTargetEventName = "click";
}

function cleanupOperationTutorialOverlay() {
  cleanupOperationTutorialTarget();
  deactivateOperationTutorialTemplateHome();
  window.clearTimeout(operationTutorialCompletionTimer);
  operationTutorialCompletionTimer = null;
  if (operationTutorialOverlay) operationTutorialOverlay.remove();
  operationTutorialOverlay = null;
  isOperationTutorialFreeEditMode = false;
  document.body.classList.remove("is-operation-tutorial-active");
  document.body.classList.remove("is-operation-tutorial-free-edit");
}

function finishOperationTutorial() {
  markOperationTutorialCompleted();
  showOperationTutorialCompletion();
}

function showOperationTutorialCompletion() {
  cleanupOperationTutorialTarget();
  deactivateOperationTutorialTemplateHome();
  const overlay = ensureOperationTutorialOverlay();
  document.body.classList.add("is-operation-tutorial-active");
  overlay.className = "operation-tutorial-overlay is-visible is-complete";
  overlay.innerHTML = `
    <div class="operation-tutorial-backdrop"></div>
    <div class="operation-tutorial-card" role="status" aria-live="polite">
      <strong>これで、チュートリアルは終わりです。</strong>
      <p>必要なときに、少しずつ使ってみてください。</p>
    </div>
  `;
  overlay.onclick = cleanupOperationTutorialOverlay;
}

function advanceOperationTutorial() {
  if (!operationTutorialOverlay) return;
  if (operationTutorialStep >= operationTutorialSteps.length - 1) {
    finishOperationTutorial();
    return;
  }
  operationTutorialStep += 1;
  window.setTimeout(renderOperationTutorial, 40);
}

function enterOperationTutorialFreeEditMode() {
  cleanupOperationTutorialTarget();
  if (operationTutorialOverlay) operationTutorialOverlay.remove();
  operationTutorialOverlay = null;
  isOperationTutorialFreeEditMode = true;
  document.body.classList.remove("is-operation-tutorial-active");
  document.body.classList.add("is-operation-tutorial-free-edit");
}

function resumeOperationTutorialAfterFreeEdit() {
  if (!isOperationTutorialFreeEditMode) return;
  if (getActiveViewId() !== "settingsView" || settingsMode !== "menu" || pendingSettingsAction) return;
  isOperationTutorialFreeEditMode = false;
  document.body.classList.remove("is-operation-tutorial-free-edit");
  operationTutorialStep = 4;
  window.setTimeout(renderOperationTutorial, 40);
}

function ensureOperationTutorialOverlay() {
  if (operationTutorialOverlay) return operationTutorialOverlay;
  operationTutorialOverlay = document.createElement("div");
  operationTutorialOverlay.className = "operation-tutorial-overlay";
  document.body.appendChild(operationTutorialOverlay);
  return operationTutorialOverlay;
}

function getOperationTutorialTarget(step) {
  const target = step.selector ? document.querySelector(step.selector) : null;
  if (isOperationTutorialElementVisible(target)) return target;
  const fallback = step.fallbackSelector ? document.querySelector(step.fallbackSelector) : null;
  if (isOperationTutorialElementVisible(fallback)) return fallback;
  return null;
}

function isOperationTutorialElementVisible(element) {
  if (!element || element.hidden) return false;
  const rect = element.getBoundingClientRect();
  return rect.width > 0 && rect.height > 0;
}

function getOperationTutorialHighlightRect(target) {
  if (!target) return null;
  const rect = target.getBoundingClientRect();
  const borderWidth = 4;
  const computedStyle = getComputedStyle(target);
  const radius = parseFloat(computedStyle.borderTopLeftRadius) || 0;
  return {
    top: Math.max(4, rect.top - borderWidth),
    left: Math.max(4, rect.left - borderWidth),
    width: Math.min(window.innerWidth - 8, rect.width + borderWidth * 2),
    height: Math.min(window.innerHeight - 8, rect.height + borderWidth * 2),
    radius: radius + borderWidth
  };
}

function positionOperationTutorialCard(card, rect) {
  const gap = 18;
  const cardRect = card.getBoundingClientRect();
  let top = Math.round(window.innerHeight * 0.58);
  if (rect) {
    const below = rect.top + rect.height + gap;
    const above = rect.top - cardRect.height - gap;
    if (below + cardRect.height <= window.innerHeight - 84) {
      top = below;
    } else if (above >= 24) {
      top = above;
    }
  }
  top = Math.max(24, Math.min(top, window.innerHeight - cardRect.height - 24));
  card.style.top = `${top}px`;
}

function attachOperationTutorialTarget(step, target) {
  cleanupOperationTutorialTarget();
  if (!step.requiresTargetAction || !target) return;
  operationTutorialTarget = target;
  operationTutorialTarget.classList.add("operation-tutorial-target");
  operationTutorialTargetHandler = () => {
    window.setTimeout(advanceOperationTutorial, 60);
  };
  operationTutorialTargetEventName = step.actionEvent || "click";
  operationTutorialTargetListenerElement = step.actionEvent ? document : operationTutorialTarget;
  operationTutorialTargetListenerElement.addEventListener(operationTutorialTargetEventName, operationTutorialTargetHandler, { once: true });
}

function createOperationTutorialTemplateMemos() {
  return [
    {
      id: "tutorial-math",
      period: "1限",
      subject: "数学",
      color: "#1163ff",
      placeholder: "例：比例のグラフ",
      content: "",
      complete: false
    },
    {
      id: "tutorial-english",
      period: "2限",
      subject: "英語",
      color: "#16a34a",
      placeholder: "今日覚えたことを1つだけ",
      content: "",
      complete: false
    }
  ];
}

function activateOperationTutorialTemplateHome() {
  if (isOperationTutorialTemplateHomeActive) return;
  isOperationTutorialTemplateHomeActive = true;
  isOperationTutorialTemplateMemoComplete = false;
  operationTutorialTemplateMemos = createOperationTutorialTemplateMemos();
  showView("homeView", { recordHistory: false });
}

function deactivateOperationTutorialTemplateHome() {
  if (!isOperationTutorialTemplateHomeActive) return;
  isOperationTutorialTemplateHomeActive = false;
  isOperationTutorialTemplateMemoComplete = false;
  operationTutorialTemplateMemos = [];
  elements.lessonList.classList.remove("tutorial-template-home");
  if (getActiveViewId() === "homeView") renderHome();
}

function renderOperationTutorialTemplateHome(previousPositions = new Map()) {
  elements.addStudyButton.hidden = true;
  elements.studyPicker.hidden = true;
  elements.lessonList.classList.add("tutorial-template-home");
  elements.lessonList.innerHTML = "";

  const sortedMemos = [...operationTutorialTemplateMemos].sort((a, b) => Number(a.complete) - Number(b.complete));
  sortedMemos.forEach((memo) => elements.lessonList.append(createOperationTutorialTemplateCard(memo)));
  elements.homeTitle.textContent = "今日の授業";
  elements.completionLabel.textContent = `${operationTutorialTemplateMemos.filter((memo) => memo.complete).length} / ${operationTutorialTemplateMemos.length}`;
  animateLessonCards(previousPositions);
}

function createOperationTutorialTemplateCard(memo) {
  const card = document.createElement("article");
  card.className = `lesson-card${memo.complete ? " is-complete" : ""}`;
  card.dataset.key = memo.id;
  card.style.setProperty("--subject-color", memo.color);

  const bar = document.createElement("div");
  bar.className = "color-bar";

  const content = document.createElement("div");
  content.className = "lesson-content";

  const meta = document.createElement("div");
  meta.className = "lesson-meta";
  meta.innerHTML = `<span class="period"></span><span class="subject-name"></span>`;
  meta.querySelector(".period").textContent = memo.period;
  meta.querySelector(".subject-name").textContent = memo.subject;

  const textarea = document.createElement("textarea");
  textarea.className = "memo-input";
  textarea.dataset.key = memo.id;
  textarea.dataset.complete = String(memo.complete);
  textarea.rows = 1;
  textarea.placeholder = memo.placeholder;
  textarea.value = memo.content;

  const doneButton = document.createElement("button");
  doneButton.type = "button";
  doneButton.className = "done-button";
  doneButton.setAttribute("aria-label", "入力完了");
  doneButton.disabled = memo.content.trim().length === 0;
  doneButton.innerHTML = `
    <svg class="done-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <path d="M6.5 12.4L10.2 16L17.8 8"></path>
    </svg>
  `;

  textarea.addEventListener("input", () => {
    memo.content = textarea.value;
    doneButton.disabled = memo.content.trim().length === 0;
    autoResize(textarea);
  });
  textarea.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      completeOperationTutorialTemplateMemo(memo.id);
    }
  });
  doneButton.addEventListener("pointerdown", (event) => {
    event.preventDefault();
    completeOperationTutorialTemplateMemo(memo.id);
  });

  const memoRow = document.createElement("div");
  memoRow.className = "memo-row";
  memoRow.append(textarea, doneButton);
  content.append(meta, memoRow);
  card.append(bar, content);
  requestAnimationFrame(() => autoResize(textarea));
  return card;
}

function completeOperationTutorialTemplateMemo(memoId) {
  const memo = operationTutorialTemplateMemos.find((item) => item.id === memoId);
  if (!memo || memo.content.trim().length === 0) return;
  memo.complete = true;
  const nextMemo = operationTutorialTemplateMemos.find((item) => !item.complete);
  const previousPositions = captureLessonPositions();
  renderOperationTutorialTemplateHome(previousPositions);
  if (nextMemo) focusMemoInput(nextMemo.id);
  isOperationTutorialTemplateMemoComplete = true;
  renderOperationTutorial();
}

function renderOperationTutorial() {
  if (hasCompletedOperationTutorial()) {
    cleanupOperationTutorialOverlay();
    return;
  }
  if (!operationTutorialOverlay && !shouldOfferOperationTutorial() && operationTutorialStep === 0) return;

  const step = operationTutorialSteps[operationTutorialStep];
  if (!step) {
    finishOperationTutorial();
    return;
  }

  if (step.usesTemplateHome) {
    activateOperationTutorialTemplateHome();
  } else {
    deactivateOperationTutorialTemplateHome();
  }

  const target = getOperationTutorialTarget(step);
  const rect = getOperationTutorialHighlightRect(target);
  const overlay = ensureOperationTutorialOverlay();
  document.body.classList.add("is-operation-tutorial-active");
  overlay.className = `operation-tutorial-overlay is-visible is-step-${operationTutorialStep + 1} ${
    step.requiresTargetAction ? "is-action-step" : "is-passive-step"
  } ${step.usesTemplateHome ? "is-template-home" : ""}`;
  overlay.innerHTML = `
    <div class="operation-tutorial-backdrop"></div>
    ${rect ? `<div class="operation-tutorial-highlight" aria-hidden="true"></div>` : ""}
    <div class="operation-tutorial-card" role="dialog" aria-live="polite" aria-label="操作チュートリアル">
      <span class="operation-tutorial-count">${operationTutorialStep + 1} / ${operationTutorialSteps.length}</span>
      <p class="operation-tutorial-body">${escapeHtml(isOperationTutorialTemplateMemoComplete && step.completedBody ? step.completedBody : step.body).replace(/\n/g, "<br>")}</p>
      <p class="operation-tutorial-assist">${escapeHtml(isOperationTutorialTemplateMemoComplete && step.completedAssist ? step.completedAssist : step.assist)}</p>
    </div>
  `;

  const highlight = overlay.querySelector(".operation-tutorial-highlight");
  if (highlight && rect) {
    highlight.style.top = `${rect.top}px`;
    highlight.style.left = `${rect.left}px`;
    highlight.style.width = `${rect.width}px`;
    highlight.style.height = `${rect.height}px`;
    highlight.style.borderRadius = `${rect.radius}px`;
  }

  const card = overlay.querySelector(".operation-tutorial-card");
  positionOperationTutorialCard(card, rect);
  attachOperationTutorialTarget(step, target);

  overlay.onclick = (event) => {
    if (event.target.closest(".operation-tutorial-card")) {
      if (step.usesTemplateHome && isOperationTutorialTemplateMemoComplete) {
        document.dispatchEvent(new CustomEvent("operationTutorialTemplateMemoComplete"));
        return;
      }
      if (step.allowsFreeEdit) {
        enterOperationTutorialFreeEditMode();
        return;
      }
      if (!step.requiresTargetAction) advanceOperationTutorial();
      return;
    }
    if (step.allowsFreeEdit) {
      enterOperationTutorialFreeEditMode();
      return;
    }
    if (step.requiresTargetAction) {
      if (target && rect) {
        const isInsideTarget =
          event.clientX >= rect.left &&
          event.clientX <= rect.left + rect.width &&
          event.clientY >= rect.top &&
          event.clientY <= rect.top + rect.height;
        if (isInsideTarget) target.click();
      }
      return;
    }
    if (!step.requiresTargetAction) advanceOperationTutorial();
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
  targetState.notification = {
    ...clone(defaultState.notification),
    ...(targetState.notification || {})
  };
  targetState.notification.enabled = targetState.notification.enabled === true;
  targetState.notification.message = String(targetState.notification.message || defaultState.notification.message);
  targetState.notification.frequency = ["lesson-days", "daily"].includes(targetState.notification.frequency)
    ? targetState.notification.frequency
    : defaultState.notification.frequency;
  targetState.notification.time = /^([01]\d|2[0-3]):[0-5]\d$/.test(targetState.notification.time || "")
    ? targetState.notification.time
    : defaultState.notification.time;
  targetState.maxPeriods = clamp(Number(targetState.maxPeriods || 6), 1, 12);

  if (targetState.scheduleTemplates.length === 0 && targetState.schedule.length > 0) {
    const templateId = createId("schedule");
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
      startDate: getDefaultSchoolYearStartDate(),
      endDate: getDefaultMarchEndDate()
    });
  }

  if (targetState.scheduleRanges.length === 0) {
    const activeTemplate = getActiveTemplates(targetState.scheduleTemplates)[0];
    if (activeTemplate) {
      targetState.scheduleRanges.push({
        id: createId("range"),
        scheduleId: activeTemplate.id,
        startDate: getDefaultSchoolYearStartDate(),
        endDate: getDefaultMarchEndDate()
      });
    }
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

function logReviewNotificationDebug(label, detail = "") {
  const formattedDetail =
    detail && typeof detail === "object"
      ? JSON.stringify(detail, (key, value) => (value instanceof Date ? value.toISOString() : value))
      : detail;
  console.log(`[choifuku notifications] ${label}`, formattedDetail);
}

function getLocalNotificationsPlugin() {
  const capacitor = window.Capacitor;
  if (!capacitor) {
    logReviewNotificationDebug("Capacitor is not available. Notification scheduling is skipped.");
    return null;
  }
  const isNative =
    typeof capacitor.isNativePlatform === "function"
      ? capacitor.isNativePlatform()
      : typeof capacitor.getPlatform === "function" && capacitor.getPlatform() !== "web";
  const platform = typeof capacitor.getPlatform === "function" ? capacitor.getPlatform() : "unknown";
  const plugin =
    capacitor.Plugins?.LocalNotifications ||
    (typeof capacitor.registerPlugin === "function" ? capacitor.registerPlugin("LocalNotifications") : null);
  if (!plugin || !isNative) {
    logReviewNotificationDebug("plugin unavailable", { platform, isNative, hasPlugin: Boolean(plugin) });
  }
  if (!isNative) return null;
  return plugin;
}

async function requestReviewNotificationPermission(plugin) {
  if (!plugin) {
    logReviewNotificationDebug("permission check skipped because plugin is not available");
    return true;
  }
  try {
    const current = await plugin.checkPermissions();
    if (current.display === "granted") return true;
    const requested = await plugin.requestPermissions();
    return requested.display === "granted";
  } catch (error) {
    console.warn("通知権限の確認に失敗しました", error);
    return false;
  }
}

async function ensureReviewNotificationChannel(plugin) {
  if (!plugin?.createChannel) return;
  try {
    const channel = {
      id: REVIEW_NOTIFICATION_CHANNEL_ID,
      name: "復習リマインダー",
      description: "設定した時間に復習をお知らせします。",
      importance: 4,
      visibility: 1,
      lights: true,
      vibration: true
    };
    await plugin.createChannel(channel);
  } catch (error) {
    console.warn("通知チャンネルの作成に失敗しました", error);
  }
}

async function cancelReviewNotifications(plugin = getLocalNotificationsPlugin()) {
  if (!plugin) return;
  try {
    const pending = await plugin.getPending();
    const notifications = pending.notifications
      .filter((notification) => {
        const id = Number(notification.id);
        return (
          (id >= REVIEW_NOTIFICATION_DAILY_ID_START &&
            id < REVIEW_NOTIFICATION_DAILY_ID_START + REVIEW_NOTIFICATION_LOOKAHEAD_DAYS) ||
          (id >= REVIEW_NOTIFICATION_LESSON_ID_START &&
            id < REVIEW_NOTIFICATION_LESSON_ID_START + REVIEW_NOTIFICATION_LOOKAHEAD_DAYS)
        );
      })
      .map((notification) => ({ id: notification.id }));
    if (notifications.length > 0) {
      await plugin.cancel({ notifications });
      logReviewNotificationDebug("cancelled review notifications", { count: notifications.length });
    }
  } catch (error) {
    console.warn("通知予約のキャンセルに失敗しました", error);
    const notifications = [];
    for (let index = 0; index < REVIEW_NOTIFICATION_LOOKAHEAD_DAYS; index += 1) {
      notifications.push({ id: REVIEW_NOTIFICATION_DAILY_ID_START + index });
      notifications.push({ id: REVIEW_NOTIFICATION_LESSON_ID_START + index });
    }
    try {
      await plugin.cancel({ notifications });
    } catch (cancelError) {
      console.warn("固定IDによる通知予約のキャンセルに失敗しました", cancelError);
    }
  }
}

function getNotificationTimeParts(time) {
  const validTime = /^([01]\d|2[0-3]):([0-5]\d)$/.exec(time || "");
  if (!validTime) return { hour: 21, minute: 0, isValid: false, rawValue: time || "" };
  return {
    hour: Number(validTime[1]),
    minute: Number(validTime[2]),
    isValid: true,
    rawValue: time
  };
}

function formatNotificationTime(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function buildNotificationMinuteOptions(selectedMinute) {
  const minutes = new Set();
  for (let minute = 0; minute < 60; minute += 5) {
    minutes.add(minute);
  }
  minutes.add(selectedMinute);
  return [...minutes].sort((a, b) => a - b);
}

function buildNotificationTimeSelectOptions(time) {
  const { hour, minute } = getNotificationTimeParts(time);
  const hourOptions = Array.from({ length: 24 }, (_, value) => {
    const label = String(value).padStart(2, "0");
    return `<option value="${label}"${value === hour ? " selected" : ""}>${label}</option>`;
  }).join("");
  const minuteOptions = buildNotificationMinuteOptions(minute)
    .map((value) => {
      const label = String(value).padStart(2, "0");
      return `<option value="${label}"${value === minute ? " selected" : ""}>${label}</option>`;
    })
    .join("");
  return { hourOptions, minuteOptions };
}

function createNotificationDate(dateKey, time) {
  const { hour, minute } = getNotificationTimeParts(time);
  const date = parseDateKey(dateKey);
  date.setHours(hour, minute, 0, 0);
  return date;
}

function createDailyReviewNotifications(notification) {
  const notifications = [];
  const now = new Date();
  let dateKey = getToday();

  while (notifications.length < REVIEW_NOTIFICATION_LOOKAHEAD_DAYS) {
    const deliveryDate = createNotificationDate(dateKey, notification.time);
    if (deliveryDate > now) {
      notifications.push({
        id: REVIEW_NOTIFICATION_DAILY_ID_START + notifications.length,
        title: "Choifuku",
        body: notification.message,
        schedule: {
          at: deliveryDate,
          allowWhileIdle: true
        },
        channelId: REVIEW_NOTIFICATION_CHANNEL_ID,
        autoCancel: true,
        extra: {
          source: "choifuku-review",
          frequency: "daily",
          date: dateKey
        }
      });
    }
    dateKey = addDays(dateKey, 1);
  }

  logReviewNotificationDebug("daily notification summary", {
    count: notifications.length,
    configuredTime: notification.time,
    deviceNow: now.toString(),
    firstFire: notifications[0]?.schedule?.at?.toString() || null,
    lastFire: notifications[notifications.length - 1]?.schedule?.at?.toString() || null
  });
  return notifications;
}

function createLessonDayReviewNotifications(notification) {
  const notifications = [];
  const now = new Date();
  let dateKey = getToday();
  for (let index = 0; index < REVIEW_NOTIFICATION_LOOKAHEAD_DAYS; index += 1) {
    const deliveryDate = createNotificationDate(dateKey, notification.time);
    const lessons = getEffectiveDayPlan(dateKey).lessons;
    if (lessons.length > 0 && deliveryDate > now) {
      notifications.push({
        id: REVIEW_NOTIFICATION_LESSON_ID_START + index,
        title: "Choifuku",
        body: notification.message,
        schedule: {
          at: deliveryDate,
          allowWhileIdle: true
        },
        channelId: REVIEW_NOTIFICATION_CHANNEL_ID,
        autoCancel: true,
        extra: {
          source: "choifuku-review",
          frequency: "lesson-days",
          date: dateKey
        }
      });
    }
    dateKey = addDays(dateKey, 1);
  }
  logReviewNotificationDebug("lesson-day notification count", {
    count: notifications.length,
    configuredTime: notification.time,
    deviceNow: now.toString(),
    firstFire: notifications[0]?.schedule?.at?.toString() || null,
    lastFire: notifications[notifications.length - 1]?.schedule?.at?.toString() || null
  });
  return notifications;
}

async function syncReviewNotifications() {
  const plugin = getLocalNotificationsPlugin();
  if (!plugin) return true;
  await cancelReviewNotifications(plugin);
  if (!state.notification.enabled) {
    logReviewNotificationDebug("notification setting is OFF. Scheduling skipped.");
    return true;
  }

  const hasPermission = await requestReviewNotificationPermission(plugin);
  logReviewNotificationDebug("permission state before schedule", { granted: hasPermission });
  if (!hasPermission) {
    state.notification.enabled = false;
    saveState();
    window.alert("通知の権限が許可されていないため、通知を有効にできませんでした。Androidの設定から通知を許可してください。");
    return false;
  }

  await ensureReviewNotificationChannel(plugin);
  const notification = {
    ...state.notification,
    message: String(state.notification.message || defaultState.notification.message).trim() || defaultState.notification.message
  };
  const notifications =
    notification.frequency === "daily"
      ? createDailyReviewNotifications(notification)
      : createLessonDayReviewNotifications(notification);

  logReviewNotificationDebug("notifications to schedule", {
    count: notifications.length,
    frequency: notification.frequency,
    first: notifications[0]
      ? {
          id: notifications[0].id,
          at: notifications[0].schedule.at.toString(),
          date: notifications[0].extra.date
        }
      : null,
    last: notifications[notifications.length - 1]
      ? {
          id: notifications[notifications.length - 1].id,
          at: notifications[notifications.length - 1].schedule.at.toString(),
          date: notifications[notifications.length - 1].extra.date
        }
      : null
  });

  if (notifications.length === 0) {
    logReviewNotificationDebug("no notifications were created");
    return true;
  }

  try {
    const result = await plugin.schedule({ notifications });
    logReviewNotificationDebug("schedule() result", { count: result.notifications?.length || 0 });
    const pending = await plugin.getPending();
    const reviewPending = pending.notifications.filter((notification) => {
      const id = Number(notification.id);
      return (
        (id >= REVIEW_NOTIFICATION_DAILY_ID_START &&
          id < REVIEW_NOTIFICATION_DAILY_ID_START + REVIEW_NOTIFICATION_LOOKAHEAD_DAYS) ||
        (id >= REVIEW_NOTIFICATION_LESSON_ID_START &&
          id < REVIEW_NOTIFICATION_LESSON_ID_START + REVIEW_NOTIFICATION_LOOKAHEAD_DAYS)
      );
    });
    logReviewNotificationDebug("pending after schedule", {
      count: reviewPending.length,
      first: reviewPending[0] || null,
      last: reviewPending[reviewPending.length - 1] || null
    });
    return true;
  } catch (error) {
    console.warn("通知予約に失敗しました", error);
    window.alert("通知の予約に失敗しました。もう一度保存するか、Androidの通知設定を確認してください。");
    return false;
  }
}

function rescheduleReviewNotificationsIfEnabled() {
  if (!state.notification.enabled) return;
  void syncReviewNotifications();
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
  const onAccent = getReadableTextColor(accent);
  target.style.setProperty("--accent", accent);
  target.style.setProperty("--accent-readable", readableAccent);
  target.style.setProperty("--on-accent", onAccent);
}

function getReadableTextColor(background) {
  const preferredDark = "#111827";
  const whiteContrast = getContrastRatio(background, "#ffffff");
  const darkContrast = getContrastRatio(background, preferredDark);
  if (whiteContrast >= 4.5 || darkContrast >= 4.5) {
    return whiteContrast >= darkContrast ? "#ffffff" : preferredDark;
  }
  return "#000000";
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

function hexToHsv(hex) {
  const { r, g, b } = hexToRgb(hex);
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const delta = max - min;
  let hue = 0;

  if (delta !== 0) {
    if (max === red) hue = 60 * (((green - blue) / delta) % 6);
    if (max === green) hue = 60 * ((blue - red) / delta + 2);
    if (max === blue) hue = 60 * ((red - green) / delta + 4);
  }
  if (hue < 0) hue += 360;

  return {
    h: Math.round(hue),
    s: max === 0 ? 0 : Math.round((delta / max) * 100),
    v: Math.round(max * 100)
  };
}

function hsvToHex(hsv) {
  const hue = Number(hsv.h) === 360 ? 0 : Number(hsv.h);
  const saturation = Number(hsv.s) / 100;
  const value = Number(hsv.v) / 100;
  const chroma = value * saturation;
  const x = chroma * (1 - Math.abs(((hue / 60) % 2) - 1));
  const match = value - chroma;
  let red = 0;
  let green = 0;
  let blue = 0;

  if (hue < 60) [red, green, blue] = [chroma, x, 0];
  else if (hue < 120) [red, green, blue] = [x, chroma, 0];
  else if (hue < 180) [red, green, blue] = [0, chroma, x];
  else if (hue < 240) [red, green, blue] = [0, x, chroma];
  else if (hue < 300) [red, green, blue] = [x, 0, chroma];
  else [red, green, blue] = [chroma, 0, x];

  return rgbToHex({
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255)
  });
}

function getColorSliderState(hex) {
  if (!/^#[0-9a-f]{6}$/i.test(hex || "")) return { h: 360, s: 100, v: 100 };
  const hsv = hexToHsv(hex);
  if (hex.toLowerCase() === DEFAULT_UNSET_COLOR) hsv.h = 360;
  return hsv;
}

function renderColorSliderEditor(container, initialColor, onChange) {
  const state = getColorSliderState(initialColor);
  let selectedColor = /^#[0-9a-f]{6}$/i.test(initialColor || "") ? initialColor : DEFAULT_UNSET_COLOR;
  container.className = "color-slider-editor";
  container.innerHTML = `
    <button class="color-picker-trigger" type="button" aria-label="色を設定">
      <span class="color-slider-preview" aria-hidden="true"></span>
    </button>
    <div class="color-slider-panel" hidden>
      <div class="color-slider-row">
        <label>色相</label>
        <input class="color-slider is-hue" type="range" min="0" max="360" value="${state.h}">
      </div>
      <div class="color-slider-row">
        <label>彩度</label>
        <input class="color-slider is-saturation" type="range" min="0" max="100" value="${state.s}">
      </div>
      <div class="color-slider-row">
        <label>値</label>
        <input class="color-slider is-value" type="range" min="0" max="100" value="${state.v}">
      </div>
      <div class="color-slider-actions">
        <button class="color-slider-cancel" type="button">キャンセル</button>
        <button class="color-slider-apply" type="button">設定</button>
      </div>
    </div>
  `;

  const trigger = container.querySelector(".color-picker-trigger");
  const panel = container.querySelector(".color-slider-panel");
  const hueInput = container.querySelector(".is-hue");
  const saturationInput = container.querySelector(".is-saturation");
  const valueInput = container.querySelector(".is-value");
  const preview = container.querySelector(".color-slider-preview");
  const cancelButton = container.querySelector(".color-slider-cancel");
  const applyButton = container.querySelector(".color-slider-apply");

  const closePanel = () => {
    container.classList.remove("is-open");
    container.classList.remove("is-panel-below");
    panel.style.left = "";
    panel.style.top = "";
    panel.hidden = true;
  };

  const placePanel = () => {
    panel.hidden = false;
    container.classList.remove("is-panel-below");
    panel.style.left = "8px";
    panel.style.top = "8px";

    const triggerRect = trigger.getBoundingClientRect();
    const panelRect = panel.getBoundingClientRect();
    const fixedRootRect = (panel.offsetParent || document.documentElement).getBoundingClientRect();
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const margin = 16;
    const gap = 6;
    const maxLeft = Math.max(margin, viewportWidth - panelRect.width - margin);
    let left = (viewportWidth - panelRect.width) / 2;
    left = Math.min(Math.max(left, margin), maxLeft);

    let top = triggerRect.bottom + gap;
    if (top + panelRect.height > viewportHeight - margin) {
      top = triggerRect.top - panelRect.height - gap;
      container.classList.add("is-panel-below");
    }
    if (top < margin) {
      top = Math.max(margin, viewportHeight - panelRect.height - margin);
    }

    panel.style.left = `${left - fixedRootRect.left}px`;
    panel.style.top = `${top - fixedRootRect.top}px`;
  };

  trigger.addEventListener("click", (event) => {
    event.stopPropagation();
    document.querySelectorAll(".color-slider-editor.is-open").forEach((editor) => {
      if (editor === container) return;
      editor.classList.remove("is-open");
      editor.querySelector(".color-slider-panel").hidden = true;
    });
    const nextOpen = !container.classList.contains("is-open");
    container.classList.toggle("is-open", nextOpen);
    if (nextOpen) {
      placePanel();
    } else {
      panel.hidden = true;
      container.classList.remove("is-panel-below");
      panel.style.left = "";
      panel.style.top = "";
    }
  });

  const update = () => {
    state.h = Number(hueInput.value);
    state.s = Number(saturationInput.value);
    state.v = Number(valueInput.value);
    const color = hsvToHex(state);
    const hueColor = hsvToHex({ h: state.h, s: 100, v: 100 });
    const saturationStart = hsvToHex({ h: state.h, s: 0, v: state.v });
    const valueEnd = hsvToHex({ h: state.h, s: state.s, v: 100 });
    saturationInput.style.background = `linear-gradient(to right, ${saturationStart}, ${hueColor})`;
    valueInput.style.background = `linear-gradient(to right, #000000, ${valueEnd})`;
    preview.style.background = color;
    container.dataset.color = color;
    return color;
  };

  [hueInput, saturationInput, valueInput].forEach((input) => {
    input.addEventListener("input", update);
  });
  cancelButton.addEventListener("click", closePanel);
  applyButton.addEventListener("click", () => {
    selectedColor = update();
    preview.style.background = selectedColor;
    container.dataset.color = selectedColor;
    onChange(selectedColor);
    closePanel();
  });
  preview.style.background = selectedColor;
  container.dataset.color = selectedColor;
  update();
}

function getToday() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function getDefaultMarchEndDate(dateKey = getToday()) {
  const date = parseDateKey(dateKey);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const endYear = month <= 3 ? year : year + 1;
  return `${endYear}-03-31`;
}

function getDefaultSchoolYearStartDate(dateKey = getToday()) {
  const date = parseDateKey(dateKey);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const startYear = month <= 3 ? year - 1 : year;
  return `${startYear}-04-01`;
}

function ensureDefaultScheduleRange() {
  if (!settingsDraft) return;
  if (settingsDraft.scheduleRanges.length > 0) return;
  const activeTemplate = getActiveTemplates(settingsDraft.scheduleTemplates)[0];
  if (!activeTemplate) return;
  settingsDraft.scheduleRanges.push({
    id: createId("range"),
    scheduleId: activeTemplate.id,
    startDate: getDefaultSchoolYearStartDate(),
    endDate: getDefaultMarchEndDate()
  });
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
    const complete = isDateCompleteForStreak(cursor);
    const isToday = cursor === getToday();

    if (complete) {
      count += 1;
      foundCompletedDay = true;
      state.streak.lastCompletedDate = state.streak.lastCompletedDate || cursor;
    } else if (lessons.length > 0 && (foundCompletedDay || !isToday)) {
      break;
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
  const currentKey = getItemKey(item);
  const card = textarea.closest(".lesson-card");
  const doneButton = card?.querySelector(".done-button");
  if (doneButton && !doneButton.disabled) {
    doneButton.classList.add("is-pressing");
    window.setTimeout(() => doneButton.classList.remove("is-pressing"), 150);
  }
  const content = textarea.value;
  setMemo(date, item.subjectId, item.period, textarea.value, item.type, false);
  const clickedFocusKey = pendingMemoFocusKey && pendingMemoFocusKey !== currentKey ? pendingMemoFocusKey : null;
  const focusKey =
    options.focusNext && content.trim().length > 0 ? getNextIncompleteKey(date, currentKey) : clickedFocusKey;
  const memo = getMemo(date, item.subjectId, item.period, item.type);
  if (memo) memo.completed = content.trim().length > 0;
  updateStreak();
  saveState();
  if (clickedFocusKey && !options.focusNext) {
    textarea.dataset.completing = "false";
    renderHeaderState();
    focusMemoInput(clickedFocusKey);
    window.setTimeout(() => {
      if (!document.activeElement?.classList.contains("memo-input")) render();
    }, 450);
    return;
  }
  window.setTimeout(() => {
    render();
    if (focusKey) focusMemoInput(focusKey);
    if (!focusKey || pendingMemoFocusKey === focusKey) pendingMemoFocusKey = null;
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
  const focusInput = () => {
    const input = [...elements.lessonList.querySelectorAll(".memo-input")].find(
      (candidate) => candidate.dataset.key === key
    );
    if (!input) return false;
    input.focus({ preventScroll: true });
    input.setSelectionRange(input.value.length, input.value.length);
    return document.activeElement === input;
  };

  requestAnimationFrame(() => {
    if (focusInput()) return;
    window.setTimeout(focusInput, 80);
    window.setTimeout(focusInput, 180);
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
  if (isOperationTutorialTemplateHomeActive) {
    renderOperationTutorialTemplateHome(previousPositions);
    return;
  }
  elements.lessonList.classList.remove("tutorial-template-home");
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
      openSettingsDetail("schedule");
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
    if (dateStatus === "complete") {
      button.insertAdjacentHTML(
        "beforeend",
        `<span class="calendar-check-icon" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6.5 12.4L10.2 16L17.8 8"></path>
          </svg>
        </span>`
      );
    }
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
  const lessons = lessonsForDate(dateKey);
  if (isDateCompleteForStreak(dateKey)) return "complete";
  if (lessons.length === 0) return "no-lesson";
  return "incomplete";
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
    if (isDateCompleteForStreak(cursor)) {
      current += 1;
      best = Math.max(best, current);
    } else if (lessons.length > 0) {
      current = 0;
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
    .filter((memo) => !historyFavoritesOnly || memo.favorite === true)
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
        <div class="history-card-head">
          <div class="history-date"></div>
          <button class="favorite-button${memo.favorite ? " is-active" : ""}" type="button" aria-label="お気に入り">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3.8L14.7 9.2L20.7 10.1L16.4 14.3L17.4 20.2L12 17.4L6.6 20.2L7.6 14.3L3.3 10.1L9.3 9.2L12 3.8Z"></path>
            </svg>
          </button>
        </div>
        <p class="history-memo"></p>
      </div>
    `;
    item.querySelector(".history-date").textContent = `${formatDisplayDate(memo.date, {
      markToday: true
    })} ${subject ? subject.name : "未登録科目"}`;
    item.querySelector(".history-memo").textContent = memo.content;
    item.querySelector(".favorite-button").addEventListener("click", () => {
      toggleMemoFavorite(memo);
    });
    elements.historyList.append(item);
  });
}

function getVisibleHistoryMemos() {
  return historyMemoMode === "archive" ? state.archivedMemos : state.memos;
}

function getMemoIdentity(memo) {
  return memo.id || `${memo.date}-${memo.subjectId}-${memo.period}-${memo.type || "lesson"}`;
}

function toggleMemoFavorite(targetMemo) {
  const targetId = getMemoIdentity(targetMemo);
  const source = getVisibleHistoryMemos();
  const memo = source.find((candidate) => getMemoIdentity(candidate) === targetId);
  if (!memo) return;
  memo.favorite = memo.favorite !== true;
  saveState();
  renderHistoryList();
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
        <div class="history-filter-row favorite-filter-row">
          <span>
            <svg class="period-icon favorite-filter-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
              <path d="M12 3.8L14.7 9.2L20.7 10.1L16.4 14.3L17.4 20.2L12 17.4L6.6 20.2L7.6 14.3L3.3 10.1L9.3 9.2L12 3.8Z"></path>
            </svg>
            お気に入り
          </span>
          <button class="favorite-filter-toggle${historyFavoritesOnly ? " is-active" : ""}" type="button" aria-pressed="${historyFavoritesOnly}" id="historyFavoriteToggle">
            ${historyFavoritesOnly ? "表示中" : "すべて表示"}
          </button>
        </div>
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
  elements.historyControls.querySelector("#historyFavoriteToggle").addEventListener("click", () => {
    historyFavoritesOnly = !historyFavoritesOnly;
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
    return hasCompletedStudyMemoForDate(dateKey);
  }
  return state.completedDates.includes(dateKey) || lessons.every((lesson) => isComplete(lesson, dateKey));
}

function hasCompletedStudyMemoForDate(dateKey) {
  return [...state.memos, ...state.archivedMemos].some(
    (memo) =>
      memo.date === dateKey &&
      memo.type === "study" &&
      (memo.content || "").trim().length > 0 &&
      memo.completed !== false
  );
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
  closeCalendar();
  settingsMode = mode;
  settingsDraft = {
    subjects: clone(state.subjects),
    scheduleTemplates: clone(state.scheduleTemplates),
    scheduleRanges: clone(state.scheduleRanges),
    dateExceptions: clone(state.dateExceptions),
    weekOverrides: clone(state.weekOverrides),
    theme: clone(state.theme),
    notification: clone(state.notification),
    maxPeriods: state.maxPeriods
  };
  settingsDraftSnapshot = serializeSettingsDraft();
  renderSettings();
}

function closeSettingsDetail(force = false) {
  if (!force && !requestSettingsExit(() => closeSettingsDetail(true))) return;
  closeCalendar();
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
  if (settingsMode === "notification") {
    renderNotificationSettings();
    return;
  }
  if (settingsMode === "theme") {
    renderThemeSettings();
    return;
  }
  renderSettingsMenu();
  resumeOperationTutorialAfterFreeEdit();
}

function renderUnsavedSettingsNotice() {
  const notice = document.createElement("div");
  notice.className = "unsaved-overlay";
  notice.innerHTML = `
    <div class="unsaved-notice">
      <p>変更を保存しますか？</p>
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
    ${createSettingsMenuButton("notification", "通知設定", "復習の時間をお知らせする通知を設定します", getNotificationMenuLabel(), "bell")}
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
    bell: `
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
        <path d="M12 3.2C9.3 3.2 7.2 5.3 7.2 8V10.8C7.2 12.1 6.8 13.3 6 14.3L5.2 15.4C4.6 16.2 5.1 17.4 6.1 17.4H17.9C18.9 17.4 19.4 16.2 18.8 15.4L18 14.3C17.2 13.3 16.8 12.1 16.8 10.8V8C16.8 5.3 14.7 3.2 12 3.2Z"></path>
        <path d="M9.8 18.6C10.1 19.8 10.9 20.5 12 20.5C13.1 20.5 13.9 19.8 14.2 18.6H9.8Z"></path>
        <path d="M11.1 2.2C11.1 1.7 11.5 1.3 12 1.3C12.5 1.3 12.9 1.7 12.9 2.2V3.6H11.1V2.2Z"></path>
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

function getNotificationMenuLabel() {
  if (!state.notification?.enabled) return "オフ";
  return state.notification.frequency === "daily" ? "毎日" : "授業日";
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
      color: DEFAULT_UNSET_COLOR
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
      <button class="small-button" type="button">削除</button>
      <div class="subject-color-editor"></div>
    `;
    const nameInput = row.querySelector(".subject-name-editor");
    const colorInput = row.querySelector(".subject-color-editor");
    if (!/^#[0-9a-f]{6}$/i.test(subject.color || "")) settingsDraft.subjects[index].color = DEFAULT_UNSET_COLOR;
    nameInput.value = subject.name;
    renderColorSliderEditor(colorInput, settingsDraft.subjects[index].color, (color) => {
      settingsDraft.subjects[index].color = color;
    });
    nameInput.addEventListener("input", () => {
      settingsDraft.subjects[index].name = nameInput.value;
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
        <button id="addScheduleSubjectButton" class="small-button" type="button">追加</button>
        <div id="scheduleSubjectColorInput"></div>
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
  renderColorSliderEditor(wrapper.querySelector("#scheduleSubjectColorInput"), DEFAULT_UNSET_COLOR, () => {});
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
    color: colorInput.dataset.color || DEFAULT_UNSET_COLOR
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

function renderNotificationSettings() {
  const notification = settingsDraft.notification;
  const enabledClass = notification.enabled ? " is-enabled" : "";
  const frequencyLabel = notification.frequency === "daily" ? "毎日" : "授業のある日のみ";
  const message = escapeHtml(notification.message);
  const time = escapeHtml(notification.time);
  const { hourOptions, minuteOptions } = buildNotificationTimeSelectOptions(notification.time);
  const wrapper = document.createElement("div");
  wrapper.className = "settings-detail notification-settings-detail";
  wrapper.innerHTML = `
    <div class="settings-action-bar">
      <button class="back-button" type="button">← 設定に戻る</button>
      <button id="saveNotificationSettingsButton" class="primary-button" type="button">保存する</button>
    </div>
    <div class="notification-hero">
      <div class="notification-hero-copy">
        <span class="notification-hero-icon" aria-hidden="true">${getSettingsMenuIcon("bell")}</span>
        <div>
          <h3>復習の時間をお知らせします</h3>
          <p>設定した時間に「<span data-notification-message-preview>${message}</span>」という通知をお送りします。</p>
        </div>
      </div>
      <label class="notification-enable-row">
        <span>通知を有効にする</span>
        <input id="notificationEnabledInput" class="switch-input" type="checkbox" ${notification.enabled ? "checked" : ""}>
        <span class="switch-track" aria-hidden="true"></span>
      </label>
    </div>
    <div class="notification-detail-body${enabledClass}">
      <section class="notification-section">
        <h3>通知内容</h3>
        <div class="notification-list-card">
          <label class="notification-row">
            <span class="notification-row-label">メッセージ</span>
            <input id="notificationMessageInput" type="text" value="${message}" maxlength="40">
          </label>
        </div>
      </section>
      <section class="notification-section">
        <h3>通知するタイミング</h3>
        <div class="notification-list-card">
          <div class="notification-row">
            <span class="notification-row-label">頻度</span>
            <div class="notification-segment" role="group" aria-label="通知頻度">
              <button class="${notification.frequency === "lesson-days" ? "is-selected" : ""}" type="button" data-notification-frequency="lesson-days">授業日</button>
              <button class="${notification.frequency === "daily" ? "is-selected" : ""}" type="button" data-notification-frequency="daily">毎日</button>
            </div>
          </div>
          <label class="notification-row">
            <span class="notification-row-label">時間帯</span>
            <span class="notification-time-selects">
              <span class="notification-time-select-wrap">
                <select id="notificationHourSelect" class="notification-time-select" aria-label="通知する時">
                  ${hourOptions}
                </select>
                <span>時</span>
              </span>
              <span class="notification-time-select-wrap">
                <select id="notificationMinuteSelect" class="notification-time-select" aria-label="通知する分">
                  ${minuteOptions}
                </select>
                <span>分</span>
              </span>
            </span>
          </label>
        </div>
      </section>
      <section class="notification-section">
        <h3>通知のプレビュー</h3>
        <div class="notification-preview-card">
          <span class="notification-preview-icon notification-preview-app-icon" aria-hidden="true">${getChoifukuAppIconSvg()}</span>
          <div>
            <div class="notification-preview-head">
              <strong>Choifuku</strong>
              <span data-notification-time-preview>${time}</span>
            </div>
            <p data-notification-message-preview>${message}</p>
            <small>${frequencyLabel}、同じ時間に通知します。</small>
          </div>
        </div>
        <p class="notification-preview-note">※ プレビューはイメージです</p>
      </section>
    </div>
  `;
  elements.settingsContent.append(wrapper);
  wrapper.querySelector(".back-button").addEventListener("click", () => closeSettingsDetail());
  wrapper.querySelector("#saveNotificationSettingsButton").addEventListener("click", saveNotificationSettings);
  wrapper.querySelector("#notificationEnabledInput").addEventListener("change", async (event) => {
    const enabled = event.target.checked;
    if (enabled) {
      const plugin = getLocalNotificationsPlugin();
      const hasPermission = await requestReviewNotificationPermission(plugin);
      if (!hasPermission) {
        notification.enabled = false;
        window.alert("通知の権限が許可されていないため、通知を有効にできませんでした。Androidの設定から通知を許可してください。");
        renderSettings();
        return;
      }
    }
    notification.enabled = enabled;
    renderSettings();
  });
  wrapper.querySelector("#notificationMessageInput").addEventListener("input", (event) => {
    notification.message = event.target.value;
    wrapper.querySelectorAll("[data-notification-message-preview]").forEach((element) => {
      element.textContent = notification.message || defaultState.notification.message;
    });
  });
  const hourSelect = wrapper.querySelector("#notificationHourSelect");
  const minuteSelect = wrapper.querySelector("#notificationMinuteSelect");
  const updateNotificationTime = () => {
    const nextTime = formatNotificationTime(Number(hourSelect.value), Number(minuteSelect.value));
    notification.time = nextTime;
    wrapper.querySelector("[data-notification-time-preview]").textContent = notification.time || defaultState.notification.time;
  };
  hourSelect.addEventListener("change", updateNotificationTime);
  minuteSelect.addEventListener("change", updateNotificationTime);
  wrapper.querySelectorAll("[data-notification-frequency]").forEach((button) => {
    button.addEventListener("click", () => {
      notification.frequency = button.dataset.notificationFrequency;
      renderSettings();
    });
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
      <div id="themeAccentInput" class="theme-color-label"></div>
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
  renderColorSliderEditor(wrapper.querySelector("#themeAccentInput"), settingsDraft.theme.accent, (color) => {
    settingsDraft.theme.accent = color;
    setThemeVariables(wrapper, settingsDraft.theme);
  });
}

function saveSubjectSettings() {
  applyCurrentSettingsDraft();
  closeSettingsDetail(true);
  render();
}

function saveScheduleSettings() {
  if (settingsMode === "schedule") ensureDefaultScheduleRange();
  applyCurrentSettingsDraft();
  rescheduleReviewNotificationsIfEnabled();
  closeSettingsDetail(true);
  render();
}

function saveRangeSettings() {
  if (!validateScheduleRanges(settingsDraft.scheduleRanges)) return;
  applyCurrentSettingsDraft();
  rescheduleReviewNotificationsIfEnabled();
  closeSettingsDetail(true);
  render();
}

function saveExceptionSettings() {
  applyCurrentSettingsDraft();
  rescheduleReviewNotificationsIfEnabled();
  closeSettingsDetail(true);
  render();
}

function saveArchiveSettings() {
  applyCurrentSettingsDraft();
  rescheduleReviewNotificationsIfEnabled();
  closeSettingsDetail(true);
  render();
}

async function saveNotificationSettings() {
  applyCurrentSettingsDraft();
  await syncReviewNotifications();
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
  if (settingsMode === "notification") {
    applyNotificationSettingsDraft();
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
  state.scheduleRanges = (settingsDraft.scheduleRanges || [])
    .filter((range) => range.scheduleId && range.startDate && range.endDate && range.startDate <= range.endDate)
    .filter((range) => state.scheduleTemplates.some((template) => template.id === range.scheduleId))
    .sort((a, b) => a.startDate.localeCompare(b.startDate));
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

function applyNotificationSettingsDraft() {
  const draft = settingsDraft.notification || {};
  state.notification = {
    enabled: draft.enabled === true,
    message: String(draft.message || defaultState.notification.message).trim() || defaultState.notification.message,
    frequency: ["lesson-days", "daily"].includes(draft.frequency) ? draft.frequency : defaultState.notification.frequency,
    time: /^([01]\d|2[0-3]):[0-5]\d$/.test(draft.time || "") ? draft.time : defaultState.notification.time
  };
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
  renderOnboarding();
  if (operationTutorialOverlay) {
    window.setTimeout(renderOperationTutorial, 0);
  }
}

function showView(viewId, options = {}) {
  if (!viewOrder.includes(viewId)) return;
  const previousViewId = getActiveViewId();
  if (previousViewId !== viewId) {
    closeCalendar(false);
    if (options.recordHistory !== false) viewHistoryStack.push(previousViewId);
  }
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

function closeCalendar(shouldRender = true) {
  if (!isCalendarOpen) return;
  console.info("[choifuku] closeCalendar");
  isCalendarOpen = false;
  if (!shouldRender) return;
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
      closeCalendar();
      if (button.dataset.view !== "settingsView") {
        requestSettingsExit(() => {
          resetSettingsDetail();
          showView(button.dataset.view);
        });
        return;
      }
      if (getActiveViewId() === "settingsView" && settingsMode !== "menu") {
        closeSettingsDetail();
        return;
      }
      showView(button.dataset.view);
    });
  });
}

function rememberPendingMemoFocus(event) {
  const memoInput = event.target.closest(".memo-input");
  pendingMemoFocusKey = memoInput ? memoInput.dataset.key : null;
}

function bindGlobalEvents() {
  document.addEventListener("pointerdown", rememberPendingMemoFocus, true);
  document.addEventListener("touchstart", rememberPendingMemoFocus, true);
  document.addEventListener("click", rememberPendingMemoFocus, true);
  document.addEventListener("focusin", rememberPendingMemoFocus, true);
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
  window.addEventListener("resize", () => {
    if (operationTutorialOverlay) renderOperationTutorial();
  });
}

function bindAndroidBackButton() {
  const App =
    window.Capacitor?.Plugins?.App ||
    window.Capacitor?.App ||
    (typeof window.Capacitor?.registerPlugin === "function" ? window.Capacitor.registerPlugin("App") : null);
  if (!App || typeof App.addListener !== "function") {
    console.info("[choifuku] Capacitor App plugin is unavailable");
    return;
  }
  App.addListener("backButton", () => {
    console.info("[choifuku] Android backButton");
    handleBackNavigation();
  });
  console.info("[choifuku] Android backButton listener registered");
}

function handleBackNavigation() {
  if (getActiveViewId() === "settingsView" && settingsMode !== "menu") {
    closeSettingsDetail();
    return;
  }

  while (viewHistoryStack.length > 0 && viewHistoryStack[viewHistoryStack.length - 1] === getActiveViewId()) {
    viewHistoryStack.pop();
  }

  if (viewHistoryStack.length === 0) return;

  const previousViewId = viewHistoryStack[viewHistoryStack.length - 1];
  const moveBack = () => {
    viewHistoryStack.pop();
    resetSettingsDetail();
    showView(previousViewId, { recordHistory: false });
  };

  if (getActiveViewId() === "settingsView") {
    requestSettingsExit(moveBack);
    return;
  }

  moveBack();
}

function initApp() {
  if (isAppInitialized) return;
  isAppInitialized = true;
  collectElements();
  createOnboardingOverlay();
  applyTheme();
  updateStreak();
  bindNavigation();
  bindGlobalEvents();
  bindAndroidBackButton();
  render();
  rescheduleReviewNotificationsIfEnabled();
  if (!elements.onboardingOverlay) startOperationTutorial();
}

window.choifukuInitApp = initApp;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initApp);
} else {
  initApp();
}
