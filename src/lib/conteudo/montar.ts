import { z } from "zod";
import { conteudoSchema, type Conteudo } from "@/lib/validation/conteudo";
import { chavesSecao, SECOES, SECOES_FIXAS, type ChaveSecao } from "./secoes";

export type ConteudoDoSite = { conteudo: Conteudo; ocultas: ChaveSecao[] };

// Linhas como chegam do banco (não confiáveis até passar pelo Zod).
export type LinhasDoBanco = {
  settings: unknown;
  sections: unknown[];
  quotes: unknown[];
  testimonials: unknown[];
  faq: unknown[];
};

const linhaSettings = z.object({
  nome: z.string(),
  papel: z.string(),
  regiao: z.string(),
  whatsapp: z.string(),
  instagram: z.string(),
  instagram_ativo: z.boolean(),
});

const linhaSecao = z.object({ key: z.string(), content: z.record(z.string(), z.unknown()) });

const itens = {
  citacoes: z.object({ texto: z.string(), autoria: z.string() }),
  depoimentos: z.object({ texto: z.string(), nome: z.string() }),
  faq: z.object({ pergunta: z.string(), resposta: z.string() }),
};

function lista<T>(schema: z.ZodType<T>, linhas: unknown[]): T[] {
  return linhas.flatMap((l) => {
    const r = schema.safeParse(l);
    return r.success ? [r.data] : [];
  });
}

// Junta as linhas do banco no formato que as seções usam. Cada pedaço é validado
// sozinho: um campo estragado volta ao texto padrão só naquela seção, e a página nunca quebra.
export function montarConteudo(
  linhas: LinhasDoBanco,
  padrao: Conteudo,
): ConteudoDoSite & { problemas: string[] } {
  const problemas: string[] = [];
  const conteudo: Conteudo = { ...padrao };
  const ocultas: ChaveSecao[] = [];

  const settings = linhaSettings.safeParse(linhas.settings);
  const marca = conteudoSchema.shape.marca.safeParse(settings.data);
  const contato = conteudoSchema.shape.contato.safeParse(
    settings.data && {
      whatsapp: settings.data.whatsapp,
      instagram: settings.data.instagram,
      instagramAtivo: settings.data.instagram_ativo,
    },
  );
  if (marca.success) conteudo.marca = marca.data;
  else problemas.push("marca");
  if (contato.success) conteudo.contato = contato.data;
  else problemas.push("contato");

  const porChave = new Map(lista(linhaSecao, linhas.sections).map((s) => [s.key, s.content] as const));
  const listas: Record<string, unknown[]> = {
    citacoes: lista(itens.citacoes, linhas.quotes),
    depoimentos: lista(itens.depoimentos, linhas.testimonials),
    faq: lista(itens.faq, linhas.faq),
  };

  for (const chave of chavesSecao) {
    const bruto = porChave.get(SECOES[chave]);
    if (!bruto) {
      // Sem linha visível = a Mari desligou a seção. As fixas continuam com o padrão.
      if ((SECOES_FIXAS as readonly string[]).includes(chave)) problemas.push(chave);
      else ocultas.push(chave);
      continue;
    }

    const valor = chave in listas ? { ...bruto, itens: listas[chave] } : bruto;
    const r = conteudoSchema.shape[chave].safeParse(valor);
    if (r.success) (conteudo as Record<ChaveSecao, unknown>)[chave] = r.data;
    else problemas.push(chave);
  }

  return { conteudo, ocultas, problemas };
}
