import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { expect, it } from "vitest";

// supabase/instalar.sql = todas as migrations + seed num arquivo só, numa transação,
// para colar no SQL Editor do Supabase (guia, parte 4). Atualize com UPDATE_SEED=1.
const ARQUIVO = "supabase/instalar.sql";

function montar(): string {
  const migrations = readdirSync("supabase/migrations")
    .filter((f) => f.endsWith(".sql"))
    .sort();
  const partes = [...migrations.map((f) => `supabase/migrations/${f}`), "supabase/seed.sql"].map(
    (f) => `-- ===== ${f} =====\n\n${readFileSync(f, "utf8").trim()}\n`,
  );
  return [
    "-- GERADO a partir de supabase/migrations/*.sql e supabase/seed.sql. Não edite à mão.",
    "-- Cole tudo no SQL Editor do Supabase e clique em Run. Rode UMA vez num projeto novo.",
    "",
    "begin;",
    "",
    partes.join("\n"),
    "commit;",
    "",
  ].join("\n");
}

it("instalar.sql está em dia com as migrations e o seed", () => {
  const esperado = montar();
  if (process.env.UPDATE_SEED === "1") writeFileSync(ARQUIVO, esperado);
  expect(readFileSync(ARQUIVO, "utf8")).toBe(esperado);
});
