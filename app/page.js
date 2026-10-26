"use client";

import { useEffect, useState } from "react";

const TIPOS = ["Justa Causa", "Pediu Demissão", "Demitido pela empresa"];

const VAZIO = {
  nome: "",
  unidade_atuacao: "",
  data_desligamento: "",
  tipo_desligamento: TIPOS[0],
  observacao: "",
};

function formatarData(iso) {
  const [a, m, d] = iso.split("-");
  return `${d}/${m}/${a}`;
}

async function enviar(url, method, corpo) {
  const res = await fetch(url, {
    method,
    headers: { "Content-Type": "application/json" },
    body: corpo && JSON.stringify(corpo),
  });
  if (!res.ok) {
    const { erro } = await res.json().catch(() => ({}));
    throw new Error(erro || "Erro ao salvar.");
  }
}

export default function Pagina() {
  const [lista, setLista] = useState([]);
  const [novo, setNovo] = useState(VAZIO);
  const [aberto, setAberto] = useState(null);
  const [erro, setErro] = useState("");
  const [busca, setBusca] = useState("");

  async function carregar() {
    const res = await fetch("/api/funcionarios");
    if (res.ok) setLista(await res.json());
    else setErro("Não foi possível carregar os dados.");
  }

  useEffect(() => {
    carregar();
  }, []);

  async function adicionar(e) {
    e.preventDefault();
    try {
      await enviar("/api/funcionarios", "POST", novo);
      setNovo(VAZIO);
      setErro("");
      carregar();
    } catch (err) {
      setErro(err.message);
    }
  }

  async function salvarAberto(e) {
    e.preventDefault();
    try {
      await enviar(`/api/funcionarios/${aberto.id}`, "PUT", aberto);
      setAberto(null);
      carregar();
    } catch (err) {
      alert(err.message);
    }
  }

  async function excluir(f) {
    if (!confirm(`Excluir o registro de ${f.nome}?`)) return;
    await enviar(`/api/funcionarios/${f.id}`, "DELETE");
    setAberto(null);
    carregar();
  }

  const termo = busca.trim().toLowerCase();
  const filtrada = termo
    ? lista.filter((f) =>
        [f.nome, f.unidade_atuacao, f.tipo_desligamento].some((v) =>
          v.toLowerCase().includes(termo)
        )
      )
    : lista;

  return (
    <main>
      <h1>Funcionários Desligados por Suspeita e/ou Fraude</h1>

      <form className="novo" onSubmit={adicionar}>
        <input
          placeholder="Nome"
          value={novo.nome}
          onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
          required
        />
        <input
          placeholder="Unidade de atuação"
          value={novo.unidade_atuacao}
          onChange={(e) => setNovo({ ...novo, unidade_atuacao: e.target.value })}
          required
        />
        <input
          type="date"
          value={novo.data_desligamento}
          onChange={(e) =>
            setNovo({ ...novo, data_desligamento: e.target.value })
          }
          required
        />
        <select
          value={novo.tipo_desligamento}
          onChange={(e) =>
            setNovo({ ...novo, tipo_desligamento: e.target.value })
          }
        >
          {TIPOS.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
        <textarea
          placeholder="Observação (opcional)"
          value={novo.observacao}
          onChange={(e) => setNovo({ ...novo, observacao: e.target.value })}
        />
        <button type="submit">Adicionar</button>
      </form>

      {erro && <p className="erro">{erro}</p>}

      <input
        className="busca"
        placeholder="Buscar por nome, unidade ou tipo…"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <div className="tabela">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Unidade de atuação</th>
              <th>Data do desligamento</th>
              <th>Tipo de desligamento</th>
            </tr>
          </thead>
          <tbody>
            {filtrada.map((f) => (
              <tr key={f.id}>
                <td>
                  <button
                    className="link"
                    title="Abrir observação"
                    onClick={() =>
                      setAberto({ ...f, observacao: f.observacao ?? "" })
                    }
                  >
                    {f.nome}
                    {f.observacao && <span className="marca">●</span>}
                  </button>
                </td>
                <td>{f.unidade_atuacao}</td>
                <td>{formatarData(f.data_desligamento)}</td>
                <td>{f.tipo_desligamento}</td>
              </tr>
            ))}
            {!filtrada.length && (
              <tr>
                <td colSpan={4} className="vazio">
                  Nenhum registro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {aberto && (
        <div className="fundo" onClick={() => setAberto(null)}>
          <form
            className="caixa"
            onClick={(e) => e.stopPropagation()}
            onSubmit={salvarAberto}
          >
            <h2>{aberto.nome}</h2>
            <label>
              Nome
              <input
                value={aberto.nome}
                onChange={(e) => setAberto({ ...aberto, nome: e.target.value })}
                required
              />
            </label>
            <label>
              Unidade de atuação
              <input
                value={aberto.unidade_atuacao}
                onChange={(e) =>
                  setAberto({ ...aberto, unidade_atuacao: e.target.value })
                }
                required
              />
            </label>
            <label>
              Data do desligamento
              <input
                type="date"
                value={aberto.data_desligamento}
                onChange={(e) =>
                  setAberto({ ...aberto, data_desligamento: e.target.value })
                }
                required
              />
            </label>
            <label>
              Tipo de desligamento
              <select
                value={aberto.tipo_desligamento}
                onChange={(e) =>
                  setAberto({ ...aberto, tipo_desligamento: e.target.value })
                }
              >
                {TIPOS.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label>
              Observação
              <textarea
                rows={8}
                autoFocus
                value={aberto.observacao}
                onChange={(e) =>
                  setAberto({ ...aberto, observacao: e.target.value })
                }
              />
            </label>
            <div className="acoes">
              <button
                type="button"
                className="perigo"
                onClick={() => excluir(aberto)}
              >
                Excluir
              </button>
              <span />
              <button type="button" onClick={() => setAberto(null)}>
                Cancelar
              </button>
              <button type="submit">Salvar</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
