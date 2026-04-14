const { Pool } = require('pg');
require('dotenv').config();
const bcrypt = require('bcryptjs');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

const initDb = async () => {
  try {
    // Create tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        role VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL
      );
    `);
    await pool.query(`
      CREATE TABLE IF NOT EXISTS leaves (
        id SERIAL PRIMARY KEY,
        teacher_id INTEGER REFERENCES users(id),
        teacher_name VARCHAR(100),
        admin_id INTEGER REFERENCES users(id),
        leave_type VARCHAR(50),
        start_date DATE,
        end_date DATE,
        total_days INTEGER,
        reason TEXT,
        status VARCHAR(20) DEFAULT 'Pending',
        approved_by INTEGER REFERENCES users(id),
        comment TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
      
    // Attempt to add created_at column if it doesn't exist to existing table
    await pool.query(`
      DO $$
      BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_name='leaves' AND column_name='created_at') THEN
              ALTER TABLE leaves ADD COLUMN created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;
          END IF;
      END $$;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        message TEXT,
        status VARCHAR(20) DEFAULT 'unread',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Seed default users if none exist
    const { rows } = await pool.query('SELECT COUNT(*) FROM users');
    if (parseInt(rows[0].count) === 0) {
      const adminPass = await bcrypt.hash('admin123', 10);
      const teacherPass = await bcrypt.hash('teacher123', 10);

      await pool.query(`
        INSERT INTO users (name, role, password) VALUES 
        ('Admin John', 'admin', $1),
        ('Teacher Sarah', 'teacher', $2)
      `, [adminPass, teacherPass]);

      console.log('Database seeded with default Admin (ID: 1) and Teacher (ID: 2).');
    }

    console.log('Database initialized successfully.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
};

module.exports = {
  query: (text, params) => pool.query(text, params),
  initDb
};