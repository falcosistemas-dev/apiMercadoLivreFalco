import sql from "mssql";
import dotenv from 'dotenv'

dotenv.config({quiet: true})

const sqlConfig: sql.config = {
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  server: String(process.env.DATABASE_HOST),
  options: {
    encrypt: false,
    trustServerCertificate: true
  },

};

export async function getPool() {
  const pool = await sql.connect(sqlConfig);
  return pool;
}
