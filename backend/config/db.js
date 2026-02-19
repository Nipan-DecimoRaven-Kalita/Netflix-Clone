import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

let pool;

export async function getDbConnection() {
  if (pool) return pool;

  const caPath = path.join(__dirname, '../ca.pem');
  const sslConfig = fs.existsSync(caPath)
    ? { ca: fs.readFileSync(caPath), rejectUnauthorized: true }
    : undefined;

  // Strip ssl-mode from URL to avoid mysql2 warning (we pass ssl explicitly)
  const rawUrl = process.env.DATABASE_URL || '';
  const dbUrl = rawUrl.replace(/[?&]ssl-mode=[^&]*/g, '').replace(/\?&/, '?').replace(/\?$/, '');
  const needsSSL = rawUrl.includes('ssl-mode=REQUIRED');

  pool = mysql.createPool({
    uri: dbUrl || rawUrl,
    ssl: sslConfig || (needsSSL ? { rejectUnauthorized: true } : undefined),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  return pool;
}

export async function initDb(conn) {
  const p = conn || await getDbConnection();
  await p.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) UNIQUE NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      name VARCHAR(100) NOT NULL,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}
