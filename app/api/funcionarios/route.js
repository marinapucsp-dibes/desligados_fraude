import { sql, garantirTabela, validar } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  await garantirTabela();
  const linhas = await sql`
    SELECT id, nome, unidade_atuacao,
           to_char(data_desligamento, 'YYYY-MM-DD') AS data_desligamento,
           tipo_desligamento, observacao
    FROM funcionarios_desligados
    ORDER BY data_desligamento DESC, nome`;
  return Response.json(linhas);
}

export async function POST(req) {
  await garantirTabela();
  const { erro, valores: v } = validar(await req.json());
  if (erro) return Response.json({ erro }, { status: 400 });

  const [linha] = await sql`
    INSERT INTO funcionarios_desligados
      (nome, unidade_atuacao, data_desligamento, tipo_desligamento, observacao)
    VALUES (${v.nome}, ${v.unidade_atuacao}, ${v.data_desligamento},
            ${v.tipo_desligamento}, ${v.observacao})
    RETURNING id`;
  return Response.json(linha, { status: 201 });
}
