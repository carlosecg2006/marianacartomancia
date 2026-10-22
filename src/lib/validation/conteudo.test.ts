import { describe, expect, it } from "vitest";
import { conteudoInicial } from "@/content/conteudo-inicial";
import { conteudoSchema } from "./conteudo";

describe("conteudoSchema", () => {
  it("aceita os textos padrão iniciais", () => {
    expect(conteudoSchema.safeParse(conteudoInicial).success).toBe(true);
  });

  it("recusa HTML em qualquer texto", () => {
    const comHtml = structuredClone(conteudoInicial);
    comHtml.abertura.frase = "<script>alert(1)</script>";
    expect(conteudoSchema.safeParse(comHtml).success).toBe(false);
  });

  it("recusa WhatsApp fora do formato", () => {
    const errado = structuredClone(conteudoInicial);
    errado.contato.whatsapp = "(31) 99999-9999";
    expect(conteudoSchema.safeParse(errado).success).toBe(false);
  });

  it("aceita WhatsApp com DDI e DDD", () => {
    const certo = structuredClone(conteudoInicial);
    certo.contato.whatsapp = "5531999999999";
    expect(conteudoSchema.safeParse(certo).success).toBe(true);
  });

  it("não publica depoimentos inventados", () => {
    expect(conteudoInicial.depoimentos.itens).toEqual([]);
  });
});
