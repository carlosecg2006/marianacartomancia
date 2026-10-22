import type { Conteudo } from "@/lib/validation/conteudo";

// Chave no código → valor do enum public.secao no banco.
export const SECOES = {
  abertura: "abertura",
  quemSou: "quem_sou",
  citacoes: "citacoes",
  baralho: "baralho",
  consulta: "consulta",
  comoFunciona: "como_funciona",
  agendamento: "agendamento",
  depoimentos: "depoimentos",
  faq: "faq",
  contatoFinal: "contato_final",
} as const satisfies Partial<Record<keyof Conteudo, string>>;

export type ChaveSecao = keyof typeof SECOES;
export type SecaoDb = (typeof SECOES)[ChaveSecao];

// Seções cujos itens moram em tabelas próprias; no jsonb fica só o título.
export const SECOES_COM_LISTA = ["citacoes", "depoimentos", "faq"] as const satisfies readonly ChaveSecao[];

// A abertura (h1) e o contato final (rodapé) nunca somem (constraint no banco).
export const SECOES_FIXAS = ["abertura", "contatoFinal"] as const satisfies readonly ChaveSecao[];

export const chavesSecao = Object.keys(SECOES) as ChaveSecao[];

// O que a seção guarda no jsonb do banco (sem os itens das listas).
export function conteudoDaSecao(c: Conteudo, chave: ChaveSecao): Record<string, unknown> {
  const secao = c[chave] as Record<string, unknown>;
  if (!(SECOES_COM_LISTA as readonly string[]).includes(chave)) return secao;
  return Object.fromEntries(Object.entries(secao).filter(([k]) => k !== "itens"));
}
