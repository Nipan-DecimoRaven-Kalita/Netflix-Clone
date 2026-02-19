# Netflix OMDB Clone

Production-ready Netflix-style web app with OMDB API integration and market-standard JWT authentication.

## Tech Stack

- **Frontend:** React 18 (Vite) + Tailwind CSS + React Router + Framer Motion
- **Backend:** Node.js + Express.js + MongoDB Atlas
- **Auth:** JWT + bcrypt, rate limiting, input validation
- **API:** OMDB (movies)

## Quick Start (Copy-Paste Ready)

1. **Clone the repo**
   ```bash
   git clone <your-repo-url>
   cd netflix-omdb-clone
   ```

2. **MongoDB Atlas**
   - Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
   - Create a free M0 cluster
   - Database Access → Add user (username + password)
   - Network Access → Add IP → **Allow access from anywhere** (`0.0.0.0/0`)
   - Connect → Drivers → copy connection string

3. **Environment**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env`: paste your `MONGO_URI`, keep `OMDB_API_KEY=278e1ea3`, set `JWT_SECRET` (e.g. run `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).

4. **Install & run**
   ```bash
   npm run install:all
   npm run dev
   ```
   - Frontend: **http://localhost:3000**
   - Backend: **http://localhost:5000**

## Features

- **Auth:** Register (real-time validation, password strength), Login (remember me, rate limit after 3 failed attempts)
- **Dashboard:** Netflix-style UI, hero banner, scrollable rows (Trending, Top Rated, Action, Latest 2025)
- **Movies:** OMDB integration, search, movie modal with full details
- **UX:** Skeletons, toasts, responsive, PWA-ready

## Project Structure

```
netflix-omdb-clone/
├── frontend/          # Vite + React
├── backend/           # Express + MongoDB
├── .env.example
├── package.json       # npm run dev
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /api/auth/register | Register user |
| POST   | /api/auth/login    | Login, returns JWT |
| GET    | /api/movies/trending?page=1 | Trending movies |
| GET    | /api/movies/search?q=... | Search movies |
| GET    | /api/movies/:id    | Single movie by IMDB ID |

Protected routes require header: `Authorization: Bearer <token>`.
