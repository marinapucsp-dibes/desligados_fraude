import { readFileSync } from "node:fs";
import { executarSchema } from "../lib/db.js";

await executarSchema(readFileSync(new URL("../db/schema.sql", import.meta.url), "utf8"));
console.log("Tabela funcionarios_desligados criada/verificada.");
