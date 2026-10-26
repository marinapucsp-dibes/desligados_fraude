-- Funcionários Desligados por Suspeita e/ou Fraude
CREATE TABLE IF NOT EXISTS funcionarios_desligados (
  id                  SERIAL PRIMARY KEY,
  nome                TEXT NOT NULL,
  unidade_atuacao     TEXT,
  data_desligamento   DATE NOT NULL,
  tipo_desligamento   TEXT NOT NULL CHECK (tipo_desligamento IN (
                        'Justa Causa',
                        'Pediu Demissão',
                        'Demitido pela empresa'
                      )),
  observacao          TEXT,
  criado_em           TIMESTAMPTZ NOT NULL DEFAULT now(),
  atualizado_em       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Unidade de atuação passou a ser opcional (tabelas já existentes)
ALTER TABLE funcionarios_desligados ALTER COLUMN unidade_atuacao DROP NOT NULL;
