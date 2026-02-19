# Netflix Clone

Full-stack Netflix-style app with React + Vite frontend and Node.js + Express backend.

## Features

- **Authentication**: JWT-based login/signup with bcrypt password hashing
- **Movie Browsing**: Horizontal rows by genre (Action, Comedy, Drama, etc.)
- **Movie Details**: Modal with OMDb data (poster, rating, plot)
- **Responsive UI**: Dark Netflix theme, Tailwind CSS, glassmorphism

## Tech Stack

- **Frontend**: React 18, Vite, React Router, Tailwind CSS, Axios
- **Backend**: Node.js, Express, mysql2, bcrypt, jsonwebtoken
- **Database**: MySQL (Aiven)

## Setup

### 1. Install dependencies

```bash
npm run setup
```

### 2. Configure environment

Copy `backend/.env.example` to `backend/.env` and fill in:

```env
DATABASE_URL=mysql://avnadmin:YOUR_PASSWORD@mysql-13444d6c-decimoraven.b.aivencloud.com:16941/defaultdb?ssl-mode=REQUIRED
JWT_SECRET=your-32-char-secret
JWT_REFRESH_SECRET=your-32-char-refresh-secret
OMDB_API_KEY=278e1ea3
PORT=3001
CORS_ORIGIN=http://localhost:5173
```

For Aiven MySQL SSL, the project includes `backend/ca.pem`. Ensure your `DATABASE_URL` uses `?ssl-mode=REQUIRED`.

### 3. Run the app

**Option A - Both servers:**

```bash
npm run dev
```

**Option B - Separate terminals:**

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

- Frontend: http://localhost:5173
- Backend API: http://localhost:3001

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login (rate limited: 3/15min) |
| POST | `/api/auth/logout` | No | Logout |
| POST | `/api/auth/refresh` | No | Refresh JWT |
| GET | `/api/movies/genres` | Yes | Movies by genre |
| GET | `/api/movies/:id` | Yes | Movie details by IMDB ID |

## Security

- Password: 8+ chars, uppercase, number, special char
- bcrypt salt rounds: 12
- JWT expiry: 24h; refresh: 7d
- Rate limiting on login
- Helmet security headers
- CORS configured
