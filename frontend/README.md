# SpaceCraft Frontend

React (Vite) frontend for SpaceCraft. Fully tested against the backend - real
login/register, upload, prediction, recommendations, history, and dashboard
charts all confirmed working end-to-end.

## Setup

```bash
cd frontend
npm install
cp .env.example .env
```

Make sure `VITE_API_BASE_URL` in `.env` points to your running backend
(default: `http://localhost:8000`).

## Run

```bash
npm run dev
```

Open http://localhost:5173

The backend must be running separately (see `../backend/README.md`) for
anything beyond the login/register screens to work.

## Pages

| Route | Description |
|---|---|
| `/register` | Create an account |
| `/login` | Log in, stores JWT in localStorage |
| `/upload` | Upload a room photo + preferences, runs prediction + recommendations |
| `/history` | List of all past analyses |
| `/dashboard` | Aggregate stats with Chart.js bar charts |

## Structure

```
src/
├── api/
│   ├── client.js        # axios instance, auto-attaches JWT, handles 401 redirect
│   └── spacecraft.js     # all backend API calls in one place
├── context/
│   └── AuthContext.jsx    # app-wide auth state
├── components/
│   ├── Navbar.jsx
│   ├── ProtectedRoute.jsx
│   ├── ColorSwatches.jsx
│   └── RecommendationList.jsx
├── pages/
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Upload.jsx        # core flow: upload -> predict -> recommend
│   ├── History.jsx
│   └── Dashboard.jsx      # Chart.js bar charts
├── App.jsx                # routing
└── index.css               # all styling, no framework
```

## Build for production

```bash
npm run build
```
Output goes to `dist/` - already verified this builds cleanly with zero errors.
