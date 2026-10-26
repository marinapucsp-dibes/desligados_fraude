# Funcionários Desligados por Suspeita e/ou Fraude

Cadastro simples hospedado no **Vercel** com banco **Postgres (Neon)**.

**Colunas:** Nome · Unidade de atuação · Data do desligamento · Tipo de desligamento
(Justa Causa / Pediu Demissão / Demitido pela empresa).

Clicar no **Nome** abre uma caixa com a **Observação** (e os demais campos para editar ou excluir).
Nomes com observação preenchida aparecem com um ponto ●.

## Como publicar no Vercel

1. Em <https://vercel.com/new>, importe este repositório do GitHub e clique em **Deploy**.
2. No projeto criado, abra **Storage → Create Database → Neon (Postgres)** e conecte ao projeto.
   O Vercel cria a variável `DATABASE_URL` automaticamente.
3. Em **Deployments**, clique em **Redeploy** para aplicar a conexão com o banco.

A tabela `funcionarios_desligados` é criada automaticamente no primeiro acesso
(estrutura em [`db/schema.sql`](db/schema.sql)). Se preferir, cole esse SQL no editor
de consultas do Neon.

## Rodar localmente

```bash
npm install
npx vercel link && npx vercel env pull .env.local   # ou copie .env.example para .env.local
npm run db:init   # opcional: cria a tabela
npm run dev
```

## Atenção (LGPD)

Os registros contêm dados pessoais e acusações sensíveis. O site não tem senha:
qualquer pessoa com o link pode ver e editar. Compartilhe o link só com quem precisa e registre fatos objetivos na
observação.
