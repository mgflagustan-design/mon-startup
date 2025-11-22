const fs = require('fs');
const path = require('path');
const initSqlJs = require('sql.js');

const DATA_DIR = path.join(__dirname, '..', '..', 'storage');
const DB_FILE = path.join(DATA_DIR, 'orders.sqlite');

let SQL;
let database;

const locateFile = (file) =>
  path.join(__dirname, '..', '..', 'node_modules', 'sql.js', 'dist', file);

async function initDatabase() {
  if (database) {
    return database;
  }

  SQL =
    SQL ||
    (await initSqlJs({
      locateFile,
    }));

  if (fs.existsSync(DB_FILE)) {
    const fileBuffer = fs.readFileSync(DB_FILE);
    database = new SQL.Database(fileBuffer);
  } else {
    database = new SQL.Database();
    createSchema();
    persist();
  }

  return database;
}

function createSchema() {
  database.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id TEXT PRIMARY KEY,
      customer_name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      address TEXT NOT NULL,
      total INTEGER NOT NULL,
      currency TEXT NOT NULL DEFAULT 'PHP',
      status TEXT NOT NULL,
      payment_method TEXT,
      payment_channel TEXT,
      payment_link_id TEXT,
      payment_url TEXT,
      items TEXT NOT NULL,
      metadata TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );
  `);

  database.run(`
    CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
  `);
}

function persist() {
  if (!database) return;
  const data = database.export();
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, Buffer.from(data));
}

function run(query, params = []) {
  const stmt = database.prepare(query);
  stmt.bind(params);
  stmt.step();
  stmt.free();
  persist();
}

function get(query, params = []) {
  const stmt = database.prepare(query);
  stmt.bind(params);
  if (!stmt.step()) {
    stmt.free();
    return undefined;
  }
  const row = stmt.getAsObject();
  stmt.free();
  return row;
}

function all(query, params = []) {
  const stmt = database.prepare(query);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
}

module.exports = {
  initDatabase,
  run,
  get,
  all,
  persist,
};

