/**
 * StudySync – app.js
 * Handles tasks, exam countdown, study hours, progress, and dark mode.
 * All data is persisted to localStorage.
 */

"use strict";
A
/* ─────────────────────────────────────────────
   Constants
───────────────────────────────────────────── */
const DAYS        = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const DAILY_GOAL  = 8;   // hours
const WEEKLY_GOAL = 40;  // hours

/* ─────────────────────────────────────────────
   State (loaded from localStorage)
───────────────────────────────────────────── */
let tasks = load("ss_tasks", []);
let exams = load("ss_exams", []);
let hours = load("ss_hours", [0, 0, 0, 0, 0, 0, 0]);
let dark  = load("ss_dark",  false);

/* ─────────────────────────────────────────────
   Persistence helpers
───────────────────────────────────────────── */
function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw !== null ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function save() {
  try {
    localStorage.setItem("ss_tasks", JSON.stringify(tasks));
    localStorage.setItem("ss_exams", JSON.stringify(exams));
    localStorage.setItem("ss_hours", JSON.stringify(hours));
    localStorage.setItem("ss_dark",  JSON.stringify(dark));
  } catch (e) {
    console.warn("StudySync: unable to save to localStorage.", e);
  }
}

/* ─────────────────────────────────────────────
   Dark mode
───────────────────────────────────────────── */
function applyDark() {
  document.body.classList.toggle("dark", dark);
  const icon = document.getElementById("darkIcon");
  if (icon) icon.className = dark ? "ti ti-sun" : "ti ti-moon";
}

function toggleDark() {
  dark = !dark;
  applyDark();
  save();
}

/* ─────────────────────────────────────────────
   Date helpers
───────────────────────────────────────────── */
function setDateChip() {
  const el = document.getElementById("dateChip");
  if (!el) return;
  const d = new Date();
  el.textContent = d.toLocaleDateString("en-US", {
    weekday: "short",
    month:   "short",
    day:     "numeric",
  });

  // Set min date on exam date input
  const examDateInput = document.getElementById("examDate");
  if (examDateInput) {
    examDateInput.min = d.toISOString().split("T")[0];
  }
}

function daysUntil(dateStr) {
  const now = new Date(); now.setHours(0, 0, 0, 0);
  const d   = new Date(dateStr + "T00:00:00");
  return Math.round((d - now) / (1000 * 60 * 60 * 24));
}

/* ─────────────────────────────────────────────
   HTML escaping
───────────────────────────────────────────── */
function esc(str) {
  return str
    .replace(/&/g,  "&amp;")
    .replace(/</g,  "&lt;")
    .replace(/>/g,  "&gt;")
    .replace(/"/g,  "&quot;")
    .replace(/'/g,  "&#39;");
}

/* ─────────────────────────────────────────────
   Toast notification
───────────────────────────────────────────── */
let _toastTimer = null;

function toast(msg) {
  const el = document.getElementById("toast");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => el.classList.add("hidden"), 2200);
}

/* ─────────────────────────────────────────────
   Tasks
───────────────────────────────────────────── */
function addTask() {
  const input   = document.getElementById("taskInput");
  const subject = document.getElementById("subjectSelect");
  const name    = input.value.trim();
  if (!name) return;

  tasks.push({
    id:      Date.now(),
    name,
    subject: subject.value,
    done:    false,
    created: new Date().toISOString(),
  });

  input.value = "";
  save();
  render();
  toast("Task added!");
}

function toggleTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) task.done = !task.done;
  save();
  render();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  save();
  render();
  toast("Task removed.");
}

/* ─────────────────────────────────────────────
   Exams
───────────────────────────────────────────── */
function addExam() {
  const name = document.getElementById("examName").value.trim();
  const date = document.getElementById("examDate").value;

  if (!name || !date) {
    toast("Please fill in both fields.");
    return;
  }

  exams.push({ id: Date.now(), name, date });
  exams.sort((a, b) => new Date(a.date) - new Date(b.date));

  document.getElementById("examName").value = "";
  document.getElementById("examDate").value = "";
  save();
  render();
  toast("Exam added!");
}

function deleteExam(id) {
  exams = exams.filter(e => e.id !== id);
  save();
  render();
  toast("Exam removed.");
}

/* ─────────────────────────────────────────────
   Study Hours
───────────────────────────────────────────── */
function logHours() {
  const slider  = document.getElementById("hoursSlider");
  const display = document.getElementById("hoursDisplay");
  const val     = parseFloat(slider.value);

  if (!val) {
    toast("Move the slider to set hours first.");
    return;
  }

  const dow = new Date().getDay();
  hours[dow] = Math.min(12, +(hours[dow] + val).toFixed(1));

  slider.value     = 0;
  display.textContent = "0.0h";
  save();
  render();
  toast(`${val}h logged for today!`);
}

/* ─────────────────────────────────────────────
   Main render
───────────────────────────────────────────── */
function render() {
  renderStats();
  renderProgress();
  renderTasks();
  renderExams();
  renderHoursChart();
}

function renderStats() {
  const total       = tasks.length;
  const done        = tasks.filter(t => t.done).length;
  const weekTotal   = hours.reduce((a, b) => a + b, 0);

  document.getElementById("statDone").textContent  = done;
  document.getElementById("statTotal").textContent = `of ${total} task${total !== 1 ? "s" : ""}`;
  document.getElementById("statHours").textContent = weekTotal.toFixed(1);

  // Next upcoming exam
  const upcoming = exams.find(e => daysUntil(e.date) >= 0);
  if (upcoming) {
    const d = daysUntil(upcoming.date);
    document.getElementById("statExam").textContent    = d === 0 ? "Today!" : `${d}d`;
    document.getElementById("statExamName").textContent = upcoming.name;
  } else {
    document.getElementById("statExam").textContent    = "—";
    document.getElementById("statExamName").textContent = "no exams added";
  }
}

function renderProgress() {
  const total     = tasks.length;
  const done      = tasks.filter(t => t.done).length;
  const weekTotal = hours.reduce((a, b) => a + b, 0);
  const todayHrs  = hours[new Date().getDay()];

  const taskPct = total ? Math.round(done / total * 100) : 0;
  const hrPct   = Math.min(100, Math.round(todayHrs / DAILY_GOAL * 100));
  const wkPct   = Math.min(100, Math.round(weekTotal / WEEKLY_GOAL * 100));

  document.getElementById("progressPct").textContent          = `${taskPct}%`;
  document.getElementById("progressTasks").style.width        = `${taskPct}%`;
  document.getElementById("progressTaskLabel").textContent    = `${done} / ${total}`;

  document.getElementById("progressHours").style.width        = `${hrPct}%`;
  document.getElementById("progressHrLabel").textContent      = `${todayHrs.toFixed(1)} / ${DAILY_GOAL}h`;

  document.getElementById("progressWeek").style.width         = `${wkPct}%`;
  document.getElementById("progressWeekLabel").textContent    = `${weekTotal.toFixed(1)} / ${WEEKLY_GOAL}h`;
}

function renderTasks() {
  const listEl  = document.getElementById("taskList");
  const emptyEl = document.getElementById("tasksEmpty");
  const countEl = document.getElementById("taskCount");
  const total   = tasks.length;

  countEl.textContent = `${total} task${total !== 1 ? "s" : ""}`;

  if (!total) {
    emptyEl.style.display = "block";
    listEl.innerHTML = "";
    return;
  }

  emptyEl.style.display = "none";
  listEl.innerHTML = tasks.map(t => `
    <div class="task-item${t.done ? " done" : ""}">
      <div
        class="task-cb${t.done ? " checked" : ""}"
        onclick="toggleTask(${t.id})"
        role="checkbox"
        aria-checked="${t.done}"
        tabindex="0"
        onkeydown="if(event.key===' ') toggleTask(${t.id})"
      >
        ${t.done ? '<i class="ti ti-check"></i>' : ""}
      </div>
      <span class="task-name">${esc(t.name)}</span>
      <span class="task-badge badge-${t.subject}">${t.subject}</span>
      <button class="btn-del" onclick="deleteTask(${t.id})" aria-label="Delete task">
        <i class="ti ti-trash"></i>
      </button>
    </div>
  `).join("");
}

function renderExams() {
  const listEl  = document.getElementById("examList");
  const emptyEl = document.getElementById("examsEmpty");
  const upcoming = exams.filter(e => daysUntil(e.date) >= 0);

  if (!upcoming.length) {
    emptyEl.style.display = "block";
    listEl.innerHTML = "";
    return;
  }

  emptyEl.style.display = "none";
  listEl.innerHTML = upcoming.map(e => {
    const d   = daysUntil(e.date);
    const cls = d <= 3 ? "ed-urgent" : d <= 7 ? "ed-soon" : "ed-ok";
    const fmt = new Date(e.date + "T00:00:00").toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });
    return `
      <div class="exam-item">
        <div class="exam-days ${cls}">
          <span class="days-number">${d === 0 ? "!" : d}</span>
          <span class="days-label">${d === 0 ? "today" : "days"}</span>
        </div>
        <div class="exam-info">
          <div class="exam-name">${esc(e.name)}</div>
          <div class="exam-date-text">${fmt}</div>
        </div>
        <button class="btn-del" onclick="deleteExam(${e.id})" aria-label="Remove exam">
          <i class="ti ti-x"></i>
        </button>
      </div>
    `;
  }).join("");
}

function renderHoursChart() {
  const grid   = document.getElementById("hoursGrid");
  const maxH   = Math.max(...hours, 1);
  const todayDow = new Date().getDay();

  const BAR_COLORS = [
    "#a29bfe","#6c5ce7","#a29bfe","#6c5ce7",
    "#a29bfe","#6c5ce7","#a29bfe",
  ];

  grid.innerHTML = DAYS.map((day, i) => {
    const h      = hours[i];
    const pxH    = Math.max(4, Math.round(h / maxH * 80));
    const color  = i === todayDow ? "var(--teal)" : BAR_COLORS[i];
    const opacity = i === todayDow ? 1 : 0.7;

    return `
      <div class="day-col">
        <div class="day-name">${day}</div>
        <div class="hour-bar-wrap">
          <div class="hour-bar"
               style="height: ${pxH}px; background: ${color}; opacity: ${opacity};"
               title="${day}: ${h.toFixed(1)}h">
          </div>
        </div>
        <div class="hour-val">${h > 0 ? h.toFixed(1) : ""}</div>
      </div>
    `;
  }).join("");
}

/* ─────────────────────────────────────────────
   Keyboard shortcuts
───────────────────────────────────────────── */
document.addEventListener("keydown", (e) => {
  // Ctrl/Cmd + D → toggle dark mode
  if ((e.ctrlKey || e.metaKey) && e.key === "d") {
    e.preventDefault();
    toggleDark();
  }
  // Ctrl/Cmd + Enter → add task (when task input is NOT focused)
  if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
    const active = document.activeElement;
    if (!active || active.id !== "taskInput") {
      document.getElementById("taskInput")?.focus();
    }
  }
});

/* ─────────────────────────────────────────────
   Init
───────────────────────────────────────────── */
applyDark();
setDateChip();
render();
