import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";

const sql = neon(process.env.DATABASE_URL || process.env.POSTGRES_URL);
await sql.query(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
console.log("Tabela funcionarios_desligados criada/verificada.");
