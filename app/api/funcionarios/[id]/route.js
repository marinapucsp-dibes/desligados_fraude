import { sql, garantirTabela, validar } from "@/lib/db";

export async function PUT(req, { params }) {
  await garantirTabela();
  const { id } = await params;
  const { erro, valores: v } = validar(await req.json());
  if (erro) return Response.json({ erro }, { status: 400 });

  const linhas = await sql`
    UPDATE funcionarios_desligados SET
      nome = ${v.nome},
      unidade_atuacao = ${v.unidade_atuacao},
      data_desligamento = ${v.data_desligamento},
      tipo_desligamento = ${v.tipo_desligamento},
      observacao = ${v.observacao},
      atualizado_em = now()
    WHERE id = ${Number(id)}
    RETURNING id`;
  if (!linhas.length)
    return Response.json({ erro: "Registro não encontrado." }, { status: 404 });
  return Response.json(linhas[0]);
}

export async function DELETE(_req, { params }) {
  await garantirTabela();
  const { id } = await params;
  await sql`DELETE FROM funcionarios_desligados WHERE id = ${Number(id)}`;
  return new Response(null, { status: 204 });
}
