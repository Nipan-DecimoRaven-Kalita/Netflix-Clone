import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { getDbConnection, initDb } from './config/db.js';
import authRoutes from './routes/auth.js';
import movieRoutes from './routes/movies.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim()),
    credentials: true,
  })
);
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/movies', movieRoutes);

app.get('/api/health', (req, res) => res.json({ ok: true }));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

// Initialize database connection (cached for serverless)
let dbInitialized = false;
async function initializeDb() {
  if (dbInitialized) return;
  try {
    const pool = await getDbConnection();
    await initDb(pool);
    dbInitialized = true;
    console.log('Database connected and tables ready');
  } catch (err) {
    console.error('Database init failed:', err);
    // Don't throw in serverless - allow graceful degradation
    if (!process.env.VERCEL) throw err;
  }
}

// Export for Vercel serverless (must be at top level)
export default app;

// For local development
if (!process.env.VERCEL) {
  async function start() {
    await initializeDb();
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  }
  start();
} else {
  // Initialize DB on cold start for Vercel (non-blocking)
  initializeDb().catch(console.error);
}
