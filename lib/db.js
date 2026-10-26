import { neon } from "@neondatabase/serverless";
import { readFileSync } from "node:fs";
import path from "node:path";

export const TIPOS = ["Justa Causa", "Pediu Demissão", "Demitido pela empresa"];

const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;

export const sql = neon(url);

let pronto;

// Cria a tabela na primeira requisição, caso ainda não exista.
export function garantirTabela() {
  pronto ??= sql.query(
    readFileSync(path.join(process.cwd(), "db/schema.sql"), "utf8")
  );
  return pronto;
}

export function validar(dados) {
  const nome = String(dados.nome ?? "").trim();
  const unidade = String(dados.unidade_atuacao ?? "").trim();
  const data = String(dados.data_desligamento ?? "").trim();
  const tipo = String(dados.tipo_desligamento ?? "").trim();
  const observacao = String(dados.observacao ?? "").trim() || null;

  if (!nome) return { erro: "Nome é obrigatório." };
  if (!unidade) return { erro: "Unidade de atuação é obrigatória." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(data))
    return { erro: "Data do desligamento inválida." };
  if (!TIPOS.includes(tipo))
    return { erro: "Tipo de desligamento inválido." };

  return {
    valores: {
      nome,
      unidade_atuacao: unidade,
      data_desligamento: data,
      tipo_desligamento: tipo,
      observacao,
    },
  };
}
