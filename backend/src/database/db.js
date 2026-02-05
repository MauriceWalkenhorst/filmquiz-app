const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Railway.app uses ephemeral storage, so we use /tmp for the database
// Render and local development use the project directory
const DB_PATH = process.env.RAILWAY_ENVIRONMENT 
  ? '/tmp/filmquiz.db' 
  : path.join(__dirname, 'filmquiz.db');

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('✅ Connected to SQLite database');
  }
});

// Promisify database methods
const dbAsync = {
  run: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.run(sql, params, function(err) {
        if (err) reject(err);
        else resolve({ id: this.lastID, changes: this.changes });
      });
    });
  },
  
  get: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.get(sql, params, (err, row) => {
        if (err) reject(err);
        else resolve(row);
      });
    });
  },
  
  all: (sql, params = []) => {
    return new Promise((resolve, reject) => {
      db.all(sql, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  }
};

// Initialize tables
async function initTables() {
  // Highscores table
  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS highscores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player_name TEXT NOT NULL,
      score INTEGER NOT NULL,
      correct_answers INTEGER NOT NULL,
      total_questions INTEGER NOT NULL,
      category TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Questions table
  await dbAsync.run(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      type TEXT NOT NULL,
      question TEXT NOT NULL,
      hint TEXT,
      answers TEXT NOT NULL,
      correct_index INTEGER NOT NULL,
      difficulty TEXT DEFAULT 'medium'
    )
  `);

  console.log('✅ Database tables initialized');
}

module.exports = { db, dbAsync, initTables };
