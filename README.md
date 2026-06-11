# 📚 StudySync – Student Task & Study Planner

> A clean, responsive study planner built with pure HTML, CSS, and JavaScript — no frameworks, no build tools, no dependencies beyond a CDN icon font.

![StudySync Preview](https://img.shields.io/badge/status-live-brightgreen?style=flat-square) ![HTML](https://img.shields.io/badge/HTML-5-orange?style=flat-square&logo=html5&logoColor=white) ![CSS](https://img.shields.io/badge/CSS-3-blue?style=flat-square&logo=css3&logoColor=white) ![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow?style=flat-square&logo=javascript&logoColor=black) ![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)

---

## ✨ Features

| Feature | Description |
|---|---|
| ✅ **Task Manager** | Add, complete, and delete tasks with subject labels |
| ⏰ **Exam Countdown** | Track upcoming exams with urgent/soon/ok color coding |
| 📊 **Study Hours Tracker** | Log daily hours with a visual weekly bar chart |
| 📈 **Progress Bars** | Task completion, daily goal, and weekly target bars |
| 🌙 **Dark Mode** | One-click toggle, persisted across sessions |
| 💾 **Local Storage** | All data saved in the browser — no account needed |

---

## 🚀 Getting Started

### Option 1 — Open directly
Just open `index.html` in any modern browser. That's it.

```bash
git clone https://github.com/YOUR_USERNAME/studysync.git
cd studysync
open index.html   # macOS
# or
start index.html  # Windows
```

### Option 2 — Live Server (VS Code)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**

### Option 3 — Python quick server
```bash
cd studysync
python3 -m http.server 8080
# then open http://localhost:8080
```

---

## 📁 Project Structure

```
studysync/
├── index.html          ← Main entry point
├── css/
│   └── style.css       ← All styles (CSS variables, dark mode, layout)
├── js/
│   └── app.js          ← All logic (tasks, exams, hours, render, storage)
└── README.md
```

---

## 🎨 Design Highlights

- **Purple/Teal/Coral palette** — distinct semantic color system
- **CSS custom properties** throughout — easy to theme
- **Dark mode** via a single `body.dark` class, all colors swap via variables
- **Accessible** — focus rings, aria labels, keyboard navigation
- **Responsive** — works on mobile, tablet, and desktop

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Enter` (in task input) | Add task |
| `Ctrl/Cmd + D` | Toggle dark mode |
| `Ctrl/Cmd + Enter` | Focus task input |

---

## 🗂️ Local Storage Keys

| Key | Contents |
|---|---|
| `ss_tasks` | Array of task objects |
| `ss_exams` | Array of exam objects |
| `ss_hours` | Array of 7 daily hour values (Sun–Sat) |
| `ss_dark` | Boolean — dark mode preference |

---

## 🛣️ Roadmap

- [ ] Pomodoro timer integration
- [ ] Export tasks to CSV
- [ ] Subject-based filtering
- [ ] Due date support for tasks
- [ ] Weekly summary email (with backend)
- [ ] PWA support (offline, installable)

---

## 🤝 Contributing

Pull requests are welcome! For major changes please open an issue first.

1. Fork the repository
2. Create your branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a pull request

---

## 📄 License

[MIT](LICENSE) — free to use, modify, and distribute.

---

<p align="center">Made with ❤️ for students everywhere</p>
