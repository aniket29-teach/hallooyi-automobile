const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });

async function initDb() {
  try {
    // const connection = await mysql.createConnection({
    //   host: process.env.DB_HOST || 'localhost',
    //   user: process.env.DB_USER || 'root',
    //   password: process.env.DB_PASSWORD || ''
    // });
    const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true,
    connectTimeout: 30000
});

    const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
    const statements = schema.split(';').filter(s => s.trim());

    for (const statement of statements) {
      if (statement.trim()) {
await connection.query(statement + ';');      }
    }

    console.log('Database initialized successfully!');
    await connection.end();
  } catch (error) {
  console.error('Database initialization failed:');
  console.error(error);
}
}

initDb();
