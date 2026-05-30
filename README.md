Task Manager — Full-Stack Implementation Plan
A Kanban-style task manager with JWT authentication, built with React + Vite (frontend) and Node.js + Express + SQLite (backend).

Architecture Overview
Mermaid diagram
Tech Stack
Layer	Technology	Rationale
Frontend	React 18 + Vite	Fast dev server, modern tooling
Styling	Vanilla CSS	Full control, premium aesthetics
Backend	Node.js + Express	Lightweight, fast to build
Database	SQLite (via better-sqlite3)	Zero config, portable, no external DB needed
Auth	JWT + bcryptjs	Stateless auth, secure password hashing
Deployment (FE)	Vercel (free tier)	Excellent Vite/React support
Deployment (BE)	Render (free tier)	Free Node.js hosting with auto-deploy
Project Structure

e:\ME\My docs\Task_manager\
├── client/                    # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Auth/
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   └── RegisterForm.jsx
│   │   │   ├── Board/
│   │   │   │   ├── KanbanBoard.jsx
│   │   │   │   ├── TaskColumn.jsx
│   │   │   │   ├── TaskCard.jsx
│   │   │   │   └── TaskModal.jsx
│   │   │   ├── Layout/
│   │   │   │   ├── Header.jsx
│   │   │   │   └── Loader.jsx
│   │   │   └── ErrorBoundary.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── hooks/
│   │   │   └── useTasks.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── index.css
│   │   └── main.jsx
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
├── server/                    # Express backend
│   ├── db/
│   │   ├── init.js            # SQLite schema setup
│   │   └── tasks.db           # Auto-created at runtime
│   ├── middleware/
│   │   └── auth.js            # JWT verification middleware
│   ├── routes/
│   │   ├── auth.js            # POST /register, POST /login
│   │   └── tasks.js           # CRUD /tasks
│   ├── server.js              # Express entry point
│   └── package.json
└── README.md
Proposed Changes
Backend — server/
[NEW] server/package.json
Dependencies: express, cors, better-sqlite3, bcryptjs, jsonwebtoken, dotenv

[NEW] server/server.js
Express app setup with CORS, JSON parsing
Mounts /api/auth and /api/tasks routers
Auto-initializes SQLite database on startup
Listens on PORT env var (default 5000)
[NEW] server/db/init.js
Creates two tables:

users: id INTEGER PRIMARY KEY, name TEXT, email TEXT UNIQUE, password TEXT, created_at DATETIME
tasks: id INTEGER PRIMARY KEY, user_id INTEGER FK, title TEXT, description TEXT, stage TEXT CHECK(stage IN ('todo','in_progress','done')), priority TEXT CHECK(priority IN ('low','medium','high')), created_at DATETIME, updated_at DATETIME
[NEW] server/middleware/auth.js
Extracts JWT from Authorization: Bearer <token> header
Verifies token and attaches req.user = { id, email } to request
Returns 401 for invalid/missing tokens
[NEW] server/routes/auth.js
Endpoint	Method	Description
/api/auth/register	POST	Create user (hash password with bcrypt, return JWT)
/api/auth/login	POST	Verify credentials, return JWT
/api/auth/me	GET	Return current user info (protected)
[NEW] server/routes/tasks.js
All routes are protected (require valid JWT).

Endpoint	Method	Description
/api/tasks	GET	Fetch all tasks for authenticated user
/api/tasks	POST	Create a new task
/api/tasks/:id	PUT	Update task (title, description, stage, priority)
/api/tasks/:id	DELETE	Delete a task
Frontend — client/
[NEW] client/ (Vite scaffold)
Created via npx create-vite@latest ./ --template react

[NEW] client/src/index.css
Global design system:

CSS custom properties for colors, spacing, typography
Dark-mode-first color palette with vibrant accents
Google Font: Inter for clean, modern typography
Glassmorphism card styles, smooth gradients
Responsive breakpoints
[NEW] client/src/services/api.js
Axios-based API client with base URL from env
Request interceptor to attach JWT from localStorage
Response interceptor for 401 → auto-logout
[NEW] client/src/context/AuthContext.jsx
React context for auth state (user, token, loading)
login(), register(), logout() actions
Persists token in localStorage, auto-loads user on mount
[NEW] client/src/components/Auth/LoginForm.jsx & RegisterForm.jsx
Beautiful form cards with glassmorphism effect
Input validation with inline error messages
Loading states on submit buttons
Toggle between Login ↔ Register
[NEW] client/src/components/Board/KanbanBoard.jsx
Three-column layout: Todo | In Progress | Done
Drag-and-drop support for moving tasks between columns (HTML5 Drag & Drop API — no external library)
Responsive: stacks columns vertically on mobile
"Add Task" floating action button
[NEW] client/src/components/Board/TaskColumn.jsx
Column header with task count badge
Color-coded column indicators (amber for Todo, blue for In Progress, green for Done)
Drop zone highlighting on drag-over
[NEW] client/src/components/Board/TaskCard.jsx
Glassmorphic card with priority indicator strip
Shows title, truncated description, priority badge
Edit & Delete action buttons (hover reveal)
Drag handle with smooth drag animation
[NEW] client/src/components/Board/TaskModal.jsx
Modal overlay for creating/editing tasks
Fields: title, description (textarea), stage (dropdown), priority (dropdown)
Smooth enter/exit animations
Close on backdrop click or Escape key
[NEW] client/src/components/Layout/Header.jsx
App title/logo, user greeting, logout button
Subtle bottom border gradient
[NEW] client/src/components/Layout/Loader.jsx
Full-screen spinner for initial load
Inline skeleton loaders for task columns
[NEW] client/src/components/ErrorBoundary.jsx
React error boundary with friendly error UI
Toast-style error notifications for API errors
[NEW] client/src/hooks/useTasks.js
Custom hook encapsulating:

tasks, loading, error state
fetchTasks(), createTask(), updateTask(), deleteTask(), moveTask()
[NEW] client/src/App.jsx
Conditional rendering: Auth forms (logged out) vs Kanban board (logged in)
Wrapped in AuthProvider
Error boundary at top level
UI Design
Color Palette (Dark Mode)
Token	Value	Usage
--bg-primary	#0f0f1a	Main background
--bg-card	rgba(255,255,255,0.05)	Glassmorphic cards
--accent-todo	#f59e0b	Todo column accent
--accent-progress	#3b82f6	In Progress accent
--accent-done	#10b981	Done column accent
--text-primary	#f1f5f9	Headings
--text-secondary	#94a3b8	Body text
--gradient-primary	linear-gradient(135deg, #6366f1, #8b5cf6)	Buttons, highlights
Key Animations
Card hover: Subtle lift + glow effect
Drag: Card shrinks slightly, semi-transparent
Column drop: Brief pulse animation
Modal: Fade in + slide up
Page transitions: Smooth opacity fade
Deployment Plan
Frontend → Vercel
Connect GitHub repo (or manual deploy via vercel CLI)
Set build command: cd client && npm run build
Set output directory: client/dist
Add env var: VITE_API_URL=https://<render-app>.onrender.com/api
Backend → Render
Create new Web Service from repo
Set root directory: server/
Set build command: npm install
Set start command: node server.js
Add env vars: JWT_SECRET, CORS_ORIGIN
IMPORTANT

Render's free tier spins down after inactivity. First request may take ~30s. We'll add a loading indicator to handle this gracefully.

Verification Plan
Automated Tests
Start backend: cd server && node server.js
Start frontend: cd client && npm run dev
Test auth flow: Register → Login → Token persistence on refresh
Test task CRUD: Create, edit stage/priority, delete
Test drag-and-drop stage transitions
Test responsive layout at mobile breakpoints
Test error states: invalid credentials, network errors
Verify production build: cd client && npm run build && npm run preview
Manual Verification
Visual inspection of UI aesthetics (glassmorphism, animations, responsiveness)
Test deployment on Vercel + Render after local verification
