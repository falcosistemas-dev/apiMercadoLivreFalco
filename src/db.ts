import sql from "mssql";
import { globais } from "./globais";

const sqlConfig: sql.config = {
  user: globais.DATABASE_USER,
  password: globais.DATABASE_PASSWORD,
  database: globais.DATABASE_NAME,
  server: globais.DATABASE_SERVER,
  options: {
    encrypt: false,
    trustServerCertificate: true
  },

};

export async function getPool() {
  const pool = await sql.connect(sqlConfig);
  return pool;
}
