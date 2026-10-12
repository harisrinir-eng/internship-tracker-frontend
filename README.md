# internship-tracker-frontend

# Frontend — Secure Internship Tracker (React + Vite)

The React app students see in the browser. Runs at **http://localhost:5173** and talks to the backend API at **http://localhost:5000/api**. Needs **Node 20+**. The whole-project guide is `../README.md`.

> The backend must be running (and seeded) for login and data to work.

## Setup (PowerShell, inside the `frontend` folder)

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Then open **http://localhost:5173**. Use `localhost` (not `127.0.0.1`) so the login cookie is sent.

`frontend/.env`:

| Variable | Value |
|---|---|
| `VITE_API_BASE_URL` | `http://localhost:5000/api` |

Everything in a React app is **public** — never put secrets here. Restart `npm run dev` after editing `.env`.

## Commands

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server on port 5173 |
| `npm run build` | Compile for production (also a quick "does everything import correctly?" check) |
| `npm run preview` | Serve the built app locally |

## Folder map (`src/`)

| File | Purpose |
|---|---|
| `main.jsx` | Starts React, adds the Router and `AuthProvider` |
| `App.jsx` | All routes, with `ProtectedRoute` guards |
| `services/api.js` | **Every** call to the backend (`fetch` with `credentials: "include"`) |
| `context/AuthContext.jsx` | Holds the logged-in user; `login`, `logout`; restores the session on refresh via `/auth/me` |
| `components/` | `Navbar`, `ProtectedRoute`, `InternshipCard`, `Message` |
| `pages/Login.jsx`, `Register.jsx` | Login and registration forms |
| `pages/Internships.jsx` | Internship cards with search, location filter, loading / empty / error states |
| `pages/StudentDashboard.jsx` | Profile + permission demo buttons (shows a real 403) |
| `pages/AdminDashboard.jsx` | Users list, create / delete internships (admin only) |
| `pages/AccessDenied.jsx`, `NotFound.jsx` | Permission and missing-page screens |
| `index.css` | Simple, projector-friendly styling |

## Routes

| URL | Who | Notes |
|---|---|---|
| `/login`, `/register` | anyone | Logged-in users are redirected to `/internships` |
| `/internships` | any logged-in user | Admins also see Delete buttons |
| `/student` | students | Others → Access Denied |
| `/admin` | admins | Others → Access Denied |
| `/access-denied` | anyone | Message page |

## Important idea for students

React hides pages and buttons based on the role, but that is **only convenience**. The real protection is on the server: it returns **401** without a valid login and **403** without the right role. Try the **Try admin-only API** button on the student dashboard to see a genuine 403.

## How the token is handled

The browser never sees the JWT in JavaScript: it lives in an **HttpOnly cookie** set by the backend. `api.js` sends `credentials: "include"` so the cookie travels with each request, and adds `X-Requested-With: XMLHttpRequest` (CSRF protection). Logging out calls the backend (which deletes the cookie) and clears the state in `AuthContext`.

## Troubleshooting (frontend)

* *Cannot reach the server* → start the backend; check `VITE_API_BASE_URL`; restart `npm run dev` after editing `.env`.
* *CORS error in the console* → `FRONTEND_ORIGIN` in `backend/.env` must equal the address in your browser.
* *Back at the login page after logging in* → mixing `localhost` and `127.0.0.1`, or `NODE_ENV=production` over plain http.
* *Port 5173 already in use* → the dev server is configured with a fixed port; close the other terminal running it.

More: `../docs/TROUBLESHOOTING.md`.
