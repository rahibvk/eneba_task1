const path = require("path");
const Database = require("better-sqlite3");

const DB_PATH = process.env.DB_PATH || path.join(__dirname, "..", "data", "eneba.db");

// Ensure the data directory exists
const fs = require("fs");
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);

// Enable WAL mode for better concurrent read performance
db.pragma("journal_mode = WAL");

// ---------- Custom trigram similarity function ----------

function getTrigrams(str) {
  const s = `  ${str.toLowerCase()} `;
  const arr = [];
  for (let i = 0; i < s.length - 2; i++) {
    arr.push(s.slice(i, i + 3));
  }
  return arr;
}

function similarity(a, b) {
  if (!a || !b) return 0;

  const lowerA = a.toLowerCase();
  const lowerB = b.toLowerCase();

  // Tier-based ranking: Prefix > Substring > Fuzzy
  let scoreBoost = 0;
  if (lowerA.startsWith(lowerB)) {
    scoreBoost = 2.0;
  } else if (lowerA.includes(lowerB)) {
    scoreBoost = 1.0;
  }

  const ta = getTrigrams(a);
  const tb = getTrigrams(b);
  if (ta.length === 0 || tb.length === 0) return scoreBoost;

  let intersection = 0;
  const tbMap = {};
  for (const t of tb) {
    tbMap[t] = (tbMap[t] || 0) + 1;
  }
  for (const t of ta) {
    if (tbMap[t] > 0) {
      intersection++;
      tbMap[t]--;
    }
  }

  // Base score is overlap scaled by length differences
  const overlap = intersection / Math.min(ta.length, tb.length);
  const lengthPenalty = Math.abs(ta.length - tb.length) / Math.max(ta.length, tb.length);

  return overlap - (lengthPenalty * 0.15) + scoreBoost;
}

// Register as SQLite function so we can use it in SQL
db.function("similarity", (a, b) => similarity(a, b));

// ---------- Auto-create offers table ----------

db.exec(`
  CREATE TABLE IF NOT EXISTS offers (
    id              INTEGER PRIMARY KEY AUTOINCREMENT,
    game_name       TEXT NOT NULL,
    title           TEXT NOT NULL,
    platform        TEXT,
    region          TEXT,
    currency        TEXT DEFAULT 'EUR',
    price_current   REAL,
    price_original  REAL,
    discount_percent INTEGER DEFAULT 0,
    has_cashback    INTEGER DEFAULT 0,
    cashback_amount REAL DEFAULT 0,
    likes_count     INTEGER DEFAULT 0,
    image_url       TEXT
  );
`);

module.exports = db;
