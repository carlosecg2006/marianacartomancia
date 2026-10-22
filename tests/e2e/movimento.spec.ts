import { expect, test, type Page } from "@playwright/test";

const REVELADOS = "[data-revelar], [data-revelar-grupo] > *";

async function opacidades(page: Page) {
  return page.locator(REVELADOS).evaluateAll((els) =>
    els.map((el) => ({
      alvo: (el.textContent ?? el.tagName).trim().slice(0, 40),
      opacidade: Number(getComputedStyle(el).opacity),
    })),
  );
}

async function rolarAteOFim(page: Page) {
  const altura = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y <= altura; y += 400) {
    await page.mouse.wheel(0, 400);
    await page.waitForTimeout(60);
  }
  await page.waitForTimeout(1200); // as entradas duram 0,8 s
}

test.describe("camada de movimento", () => {
  test("sem JavaScript a página inteira aparece", async ({ browser }) => {
    const contexto = await browser.newContext({ javaScriptEnabled: false });
    const page = await contexto.newPage();
    await page.goto("/");
    for (const titulo of await page.getByRole("heading", { level: 2 }).all()) {
      await expect(titulo).toBeVisible();
    }
    const escondidos = (await opacidades(page)).filter((o) => o.opacidade < 1);
    expect(escondidos).toEqual([]);
    await contexto.close();
  });

  test("depois de rolar até o fim, nada fica escondido", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop-1440", "rolagem completa só no desktop");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await rolarAteOFim(page);
    const escondidos = (await opacidades(page)).filter((o) => o.opacidade < 0.99);
    expect(escondidos).toEqual([]);
  });

  test("no meio do pôr do sol a carta continua opaca (contraste AA)", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop-1440", "cena do desktop");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    for (let s = 0; s < 450; s += 150) {
      await page.mouse.wheel(0, 150);
      await page.waitForTimeout(60);
    }
    await page.waitForTimeout(800);
    const carta = page.locator('[data-alvo="carta"]');
    expect(await carta.evaluate((el) => Number(getComputedStyle(el).opacity))).toBe(1);
    expect(await carta.evaluate((el) => getComputedStyle(el).transform)).not.toBe("none");
  });

  test("o fio turquesa aparece no desktop e chega à lua no fim da página", async ({ page }, info) => {
    test.skip(info.project.name !== "desktop-1440", "o fio só existe no desktop");
    await page.goto("/");
    const fio = page.locator("[data-fio]");
    await expect(fio).toBeVisible();
    await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
    await expect
      .poll(() =>
        page.locator('[data-alvo="disco-lua"]').evaluate((el) => Number(getComputedStyle(el).opacity)),
      )
      .toBeGreaterThan(0.95);
  });

  test("com movimento reduzido: tudo visível de cara, sem fio e sem rolagem suave", async ({
    page,
  }, info) => {
    test.skip(info.project.name !== "movimento-reduzido", "projeto com prefers-reduced-motion");
    await page.goto("/");
    await page.waitForLoadState("networkidle");
    await page.waitForTimeout(500); // dá tempo da camada de movimento carregar (e não fazer nada)
    const escondidos = (await opacidades(page)).filter((o) => o.opacidade < 1);
    expect(escondidos).toEqual([]);
    await expect(page.locator("[data-fio]")).toBeHidden();
    await expect(page.locator("html")).not.toHaveClass(/lenis/);
    const transformado = await page
      .locator('[data-alvo="sol"]')
      .evaluate((el) => getComputedStyle(el).transform);
    await page.evaluate(() => window.scrollTo(0, 800));
    await page.waitForTimeout(200);
    expect(await page.locator('[data-alvo="sol"]').evaluate((el) => getComputedStyle(el).transform)).toBe(
      transformado,
    );
  });
});
