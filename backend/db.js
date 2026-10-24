const { Pool } = require("pg");

const poolConfig = process.env.DATABASE_URL
  ? {
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL.includes("localhost")
        ? false
        : { rejectUnauthorized: false },
    }
  : {
      host: process.env.DB_HOST || "localhost",
      port: Number(process.env.DB_PORT || 5432),
      database: process.env.DB_NAME || "gozayaan",
      user: process.env.DB_USER || "postgres",
      password: process.env.DB_PASSWORD || "12345",
    };

const pool = new Pool(poolConfig);

pool.on("error", (error) => {
  console.error("Unexpected database connection error:", error.message);
});

module.exports = pool;