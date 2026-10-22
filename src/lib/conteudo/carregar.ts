import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { conteudoInicial } from "@/content/conteudo-inicial";
import { clientePublico } from "@/lib/supabase/publico";
import { montarConteudo, type ConteudoDoSite } from "./montar";

export const TAG_CONTEUDO = "conteudo";

const PADRAO: ConteudoDoSite = { conteudo: conteudoInicial, ocultas: [] };

// Conteúdo do site público, em cache até o painel salvar algo (updateTag(TAG_CONTEUDO)).
// Se o banco falhar, a página sai com os textos padrão e o erro vai só para o log.
export async function carregarConteudo(): Promise<ConteudoDoSite> {
  "use cache";
  cacheTag(TAG_CONTEUDO);

  const supabase = clientePublico();
  if (!supabase) {
    console.warn("[conteudo] SUPABASE_URL/SUPABASE_PUBLISHABLE_KEY ausentes: usando os textos padrão.");
    cacheLife("minutes");
    return PADRAO;
  }

  try {
    const [settings, sections, quotes, testimonials, faq] = await Promise.all([
      supabase
        .from("site_settings")
        .select("nome, papel, regiao, whatsapp, instagram, instagram_ativo")
        .maybeSingle(),
      supabase.from("sections").select("key, content").order("position"),
      supabase.from("quotes").select("texto, autoria").order("position").order("id").limit(12),
      supabase.from("testimonials").select("texto, nome").order("position").order("id").limit(20),
      supabase.from("faq_items").select("pergunta, resposta").order("position").order("id").limit(20),
    ]);

    const erro = [settings, sections, quotes, testimonials, faq].find((r) => r.error)?.error;
    if (erro) throw erro;
    // Banco sem seções = seed não aplicado. Melhor o texto padrão que uma página vazia.
    if (!sections.data?.length) throw new Error("tabela sections vazia");

    const { problemas, ...resultado } = montarConteudo(
      {
        settings: settings.data,
        sections: sections.data,
        quotes: quotes.data ?? [],
        testimonials: testimonials.data ?? [],
        faq: faq.data ?? [],
      },
      conteudoInicial,
    );
    if (problemas.length)
      console.error("[conteudo] dados inválidos no banco, usando o padrão em:", problemas);

    cacheLife("hours");
    return resultado;
  } catch (e) {
    console.error("[conteudo] falha ao ler o banco:", e);
    cacheLife("minutes");
    return PADRAO;
  }
}
