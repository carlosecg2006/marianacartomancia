import { readFileSync, writeFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { conteudoInicial } from "@/content/conteudo-inicial";
import { gerarSeedSql } from "./seed";

const ARQUIVO = "supabase/seed.sql";

describe("seed.sql", () => {
  it("está em dia com os textos padrão iniciais", () => {
    const esperado = gerarSeedSql(conteudoInicial);
    if (process.env.UPDATE_SEED === "1") writeFileSync(ARQUIVO, esperado);
    expect(readFileSync(ARQUIVO, "utf8")).toBe(esperado);
  });

  it("escapa aspas simples", () => {
    const c = structuredClone(conteudoInicial);
    c.marca.nome = "D'Ávila";
    expect(gerarSeedSql(c)).toContain("'D''Ávila'");
  });
});
