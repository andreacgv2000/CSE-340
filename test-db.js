const { Pool } = require("pg")
require("dotenv").config()

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
})

async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()")
    console.log("✅ CONECTADO A LA BASE DE DATOS")
    console.log(result.rows)
    process.exit(0)
  } catch (error) {
    console.error("❌ ERROR DE CONEXIÓN")
    console.error(error.message)
    process.exit(1)
  }
}

testConnection()


