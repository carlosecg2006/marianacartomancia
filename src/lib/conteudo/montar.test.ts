import { describe, expect, it } from "vitest";
import { conteudoInicial } from "@/content/conteudo-inicial";
import { montarConteudo, type LinhasDoBanco } from "./montar";
import { chavesSecao, conteudoDaSecao, SECOES } from "./secoes";

// Linhas iguais às que o seed grava.
function linhasDoSeed(): LinhasDoBanco {
  const c = conteudoInicial;
  return {
    settings: {
      nome: c.marca.nome,
      papel: c.marca.papel,
      regiao: c.marca.regiao,
      whatsapp: c.contato.whatsapp,
      instagram: c.contato.instagram,
      instagram_ativo: c.contato.instagramAtivo,
    },
    sections: chavesSecao.map((chave) => ({ key: SECOES[chave], content: conteudoDaSecao(c, chave) })),
    quotes: c.citacoes.itens,
    testimonials: c.depoimentos.itens,
    faq: c.faq.itens,
  };
}

describe("montarConteudo", () => {
  it("o banco recém-semeado reproduz o conteúdo padrão", () => {
    const r = montarConteudo(linhasDoSeed(), conteudoInicial);
    expect(r.problemas).toEqual([]);
    expect(r.ocultas).toEqual([]);
    expect(r.conteudo).toEqual(conteudoInicial);
  });

  it("usa o que veio do banco", () => {
    const l = linhasDoSeed();
    l.faq = [{ pergunta: "Nova pergunta?", resposta: "Nova resposta." }];
    (l.settings as Record<string, unknown>).whatsapp = "5531999990000";
    const r = montarConteudo(l, conteudoInicial);
    expect(r.conteudo.faq.itens).toEqual([{ pergunta: "Nova pergunta?", resposta: "Nova resposta." }]);
    expect(r.conteudo.contato.whatsapp).toBe("5531999990000");
  });

  it("seção sem linha (desligada no painel) fica oculta", () => {
    const l = linhasDoSeed();
    l.sections = l.sections.filter((s) => (s as { key: string }).key !== "baralho");
    expect(montarConteudo(l, conteudoInicial).ocultas).toEqual(["baralho"]);
  });

  it("abertura e contato final nunca somem", () => {
    const l = linhasDoSeed();
    l.sections = l.sections.filter(
      (s) => !["abertura", "contato_final"].includes((s as { key: string }).key),
    );
    const r = montarConteudo(l, conteudoInicial);
    expect(r.ocultas).toEqual([]);
    expect(r.problemas).toEqual(["abertura", "contatoFinal"]);
    expect(r.conteudo.abertura).toEqual(conteudoInicial.abertura);
  });

  it("dado inválido (HTML) volta ao padrão só naquela seção", () => {
    const l = linhasDoSeed();
    const consulta = l.sections.find((s) => (s as { key: string }).key === "consulta") as {
      content: Record<string, unknown>;
    };
    consulta.content = { ...consulta.content, titulo: "<script>alert(1)</script>" };
    l.faq = [{ pergunta: "Outra?", resposta: "Sim." }];
    const r = montarConteudo(l, conteudoInicial);
    expect(r.problemas).toEqual(["consulta"]);
    expect(r.conteudo.consulta).toEqual(conteudoInicial.consulta);
    expect(r.conteudo.faq.itens).toHaveLength(1);
  });

  it("configurações ausentes caem no padrão", () => {
    const l = linhasDoSeed();
    l.settings = null;
    const r = montarConteudo(l, conteudoInicial);
    expect(r.problemas).toEqual(["marca", "contato"]);
    expect(r.conteudo.marca).toEqual(conteudoInicial.marca);
  });

  it("descarta itens de lista malformados", () => {
    const l = linhasDoSeed();
    l.quotes = [{ texto: 42 }, { texto: "Frase", autoria: "Mari" }];
    expect(montarConteudo(l, conteudoInicial).conteudo.citacoes.itens).toEqual([
      { texto: "Frase", autoria: "Mari" },
    ]);
  });
});
