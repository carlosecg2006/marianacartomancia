import { expect, test, type Page } from "@playwright/test";

// Roda sozinho (projeto "desempenho", depois dos outros) para que a disputa
// de CPU com outros testes não distorça a medição.

async function rolarAteOFim(page: Page) {
  const altura = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= altura; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1200);
}

test("mantém o ritmo de quadros ao rolar com a CPU 4× mais lenta", async ({ page }, info) => {
  const cdp = await page.context().newCDPSession(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });

  await page.evaluate(() => {
    const w = window as unknown as { quadros: number[] };
    w.quadros = [];
    let anterior = performance.now();
    const medir = (agora: number) => {
      w.quadros.push(agora - anterior);
      anterior = agora;
      requestAnimationFrame(medir);
    };
    requestAnimationFrame(medir);
  });
  await rolarAteOFim(page);
  const quadros = await page.evaluate(() => (window as unknown as { quadros: number[] }).quadros.slice(5));
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 1 });

  const ordenados = [...quadros].sort((a, b) => a - b);
  const mediana = ordenados[Math.floor((ordenados.length - 1) / 2)];
  // Um quadro "perdido" é o que leva mais de dois ciclos de 60 fps (33,4 ms).
  const perdidos = quadros.filter((q) => q > 34).length / quadros.length;
  const resumo = { quadros: quadros.length, mediana, perdidos };
  info.annotations.push({ type: "quadros", description: JSON.stringify(resumo) });
  // 60 fps = 16,7 ms por quadro.
  expect(mediana).toBeLessThanOrEqual(17.5);
  expect(perdidos).toBeLessThanOrEqual(0.05);
});
