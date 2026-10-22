import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { contrastRatio } from "@/lib/design/contrast";

const source = readFileSync(fileURLToPath(new URL("./_tokens.scss", import.meta.url)), "utf8");

function phase(name: string): Record<string, string> {
  const block = new RegExp(`\\[data-phase="${name}"\\]\\s*\\{([^}]*)\\}`).exec(source);
  if (!block) throw new Error(`Fase ${name} não encontrada em _tokens.scss`);
  return Object.fromEntries(
    [...block[1].matchAll(/--([\w-]+):\s*(#[0-9a-f]{6})/gi)].map((m) => [m[1], m[2]]),
  );
}

// Pares de texto/fundo usados no site. Ornamentos (--gold, --olive) não entram.
const TEXT_PAIRS: [text: string, ground: string][] = [
  ["ink", "bg"],
  ["ink", "surface"],
  ["muted", "bg"],
  ["muted", "surface"],
  ["accent", "bg"],
  ["accent-ink", "accent"],
  ["field-ink", "field"],
  ["gold-text", "bg"],
  ["gold-text", "surface"],
];

describe.each(["solar", "crepusculo", "lunar"])("fase %s", (name) => {
  const colors = phase(name);

  it.each(TEXT_PAIRS)("%s sobre %s passa no WCAG AA (4.5:1)", (text, ground) => {
    expect(colors[text], `--${text}`).toBeDefined();
    expect(colors[ground], `--${ground}`).toBeDefined();
    expect(contrastRatio(colors[text], colors[ground])).toBeGreaterThanOrEqual(4.5);
  });
});

describe("contrastRatio", () => {
  it("dá 21:1 entre preto e branco", () => {
    expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 5);
  });
});
