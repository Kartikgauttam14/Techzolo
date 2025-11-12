import { config } from 'dotenv';
import { Pool } from 'pg';

config({ path: '.env.local' });

// Check if we should use PostgreSQL or SQLite
const usePostgres = process.env.DATABASE_URL && process.env.DATABASE_URL.includes('postgresql');

let db: any;

if (usePostgres) {
  // Use PostgreSQL
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  
  db = {
    query: (text: string, params?: any[]) => pool.query(text, params),
  };
} else {
  // Use SQLite as fallback
  const initializeSqlite = async () => {
    const Database = (await import('better-sqlite3')).default;
    const sqlite = new Database('./techzolo.db');
    
    // Create users table if it doesn't exist
    sqlite.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        full_name TEXT NOT NULL,
        company TEXT,
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT 1
      )
    `);
    
    // Create a PostgreSQL-compatible query interface for SQLite
    return {
      query: async (text: string, params?: any[]) => {
        try {
          // Convert PostgreSQL-style parameters ($1, $2, etc.) to SQLite-style (?)
          let sqliteText = text;
          const sqliteParams: any[] = [];
          
          if (params) {
            params.forEach((param, index) => {
              sqliteText = sqliteText.replace(new RegExp(`\\$${index + 1}`, 'g'), '?');
              sqliteParams.push(param);
            });
          }
          
          // Handle different query types
          if (text.toLowerCase().startsWith('select')) {
            const stmt = sqlite.prepare(sqliteText);
            const rows = stmt.all(...sqliteParams);
            return { rows, rowCount: rows.length };
          } else if (text.toLowerCase().startsWith('insert')) {
            const stmt = sqlite.prepare(sqliteText);
            const result = stmt.run(...sqliteParams);
            
            // For INSERT with RETURNING, get the inserted row
            if (text.toLowerCase().includes('returning')) {
              const lastId = result.lastInsertRowid;
              const selectStmt = sqlite.prepare('SELECT * FROM users WHERE id = ?');
              const row = selectStmt.get(lastId);
              return { rows: [row], rowCount: 1 };
            }
            
            return { rows: [], rowCount: result.changes };
          } else {
            // UPDATE, DELETE, etc.
            const stmt = sqlite.prepare(sqliteText);
            const result = stmt.run(...sqliteParams);
            return { rows: [], rowCount: result.changes };
          }
        } catch (error) {
          console.error('SQLite query error:', error);
          throw error;
        }
      }
    };
  };

  // We need a way to handle the async initialization
  // For now, let's create a proxy that will initialize the db on first query
  let sqliteDb: any;
  db = {
    query: async (text: string, params?: any[]) => {
      if (!sqliteDb) {
        sqliteDb = await initializeSqlite();
      }
      return sqliteDb.query(text, params);
    }
  };
}

export default db;