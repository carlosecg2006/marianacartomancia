import type { Conteudo } from "@/lib/validation/conteudo";
import { chavesSecao, conteudoDaSecao, SECOES } from "./secoes";

// Gera supabase/seed.sql a partir dos textos padrão iniciais (um lugar só para o texto).
// "on conflict do nothing": rodar de novo nunca apaga o que a Mari editou.

const lit = (v: string | boolean | number) =>
  typeof v === "string" ? `'${v.replaceAll("'", "''")}'` : String(v);

const linhas = (valores: (string | boolean | number)[][]) =>
  valores.map((v) => `  (${v.map(lit).join(", ")})`).join(",\n");

function lista(tabela: string, colunas: string[], valores: string[][]): string {
  if (valores.length === 0) return "";
  const cols = [...colunas, "position"].join(", ");
  return `insert into public.${tabela} (${cols})
select ${[...colunas, "position"].map((c) => `v.${c}`).join(", ")}
from (values
${linhas(valores.map((v, i) => [...v, i]))}
) as v (${cols})
where not exists (select 1 from public.${tabela});
`;
}

export function gerarSeedSql(c: Conteudo): string {
  const secoes = chavesSecao.map((chave, i) => [SECOES[chave], i, JSON.stringify(conteudoDaSecao(c, chave))]);

  return `-- GERADO por src/lib/conteudo/seed.ts a partir de src/content/conteudo-inicial.ts.
-- Não edite à mão: rode \`UPDATE_SEED=1 npx vitest run seed\`.

insert into public.site_settings (nome, papel, regiao, whatsapp, instagram, instagram_ativo)
values
${linhas([[c.marca.nome, c.marca.papel, c.marca.regiao, c.contato.whatsapp, c.contato.instagram, c.contato.instagramAtivo]])}
on conflict (id) do nothing;

insert into public.sections (key, position, content)
select v.key::public.secao, v.position, v.content::jsonb
from (values
${linhas(secoes)}
) as v (key, position, content)
on conflict (key) do nothing;

-- As listas só entram num banco vazio.
${lista(
  "quotes",
  ["texto", "autoria"],
  c.citacoes.itens.map((q) => [q.texto, q.autoria]),
)}
${lista(
  "faq_items",
  ["pergunta", "resposta"],
  c.faq.itens.map((f) => [f.pergunta, f.resposta]),
)}`;
}
