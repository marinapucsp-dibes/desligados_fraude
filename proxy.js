// Protege todo o site com usuário e senha (HTTP Basic Auth).
// Defina APP_USUARIO e APP_SENHA nas variáveis de ambiente do Vercel.
export function proxy(req) {
  const usuario = process.env.APP_USUARIO;
  const senha = process.env.APP_SENHA;
  if (!usuario || !senha) {
    return new Response("Defina APP_USUARIO e APP_SENHA no Vercel.", {
      status: 500,
    });
  }

  const [tipo, cred] = (req.headers.get("authorization") || "").split(" ");
  if (tipo === "Basic" && cred) {
    const [u, ...resto] = atob(cred).split(":");
    if (u === usuario && resto.join(":") === senha) return;
  }

  return new Response("Acesso restrito.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Desligados", charset="UTF-8"' },
  });
}

export const config = { matcher: "/((?!_next/static|_next/image|favicon.ico).*)" };
