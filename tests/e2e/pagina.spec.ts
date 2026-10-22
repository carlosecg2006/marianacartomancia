import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const SECOES = [
  ["quem-sou", "Quem sou"],
  ["citacoes", "Palavras que me acompanham"],
  ["baralho", "O Lendário Tarot das Bruxas"],
  ["consulta", "Uma tiragem que acolhe"],
  ["como-funciona", "Como funciona"],
  ["agendamento", "Reserve o seu horário"],
  ["perguntas", "Perguntas frequentes"],
  ["contato", "Vamos conversar?"],
] as const;

test.describe("página inicial", () => {
  test("tem um único h1 com o nome dela", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("h1")).toHaveCount(1);
    await expect(page.locator("h1")).toHaveText("Mariana Dayrell");
  });

  test("cada seção tem o seu título", async ({ page }) => {
    await page.goto("/");
    for (const [id, titulo] of SECOES) {
      await expect(page.locator(`#${id}`).getByRole("heading", { level: 2 })).toHaveText(titulo);
    }
  });

  test("as fases vão do sol à lua na ordem da página", async ({ page }) => {
    await page.goto("/");
    const fases = await page
      .locator("body > [data-phase], main > [data-phase]")
      .evaluateAll((els) => els.map((el) => el.getAttribute("data-phase")));
    expect(fases[0]).toBe("solar");
    expect(fases.at(-1)).toBe("lunar");
    const ordem = { solar: 0, crepusculo: 1, lunar: 2 } as const;
    const numeros = fases.map((f) => ordem[f as keyof typeof ordem]);
    expect(numeros).toEqual([...numeros].sort((a, b) => a - b));
  });

  test("não inventa depoimentos nem mostra links sem destino", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("#depoimentos")).toHaveCount(0);
    await expect(page.locator('a[href*="wa.me"]')).toHaveCount(0);
    await expect(page.locator('a[href*="instagram.com"]')).toHaveCount(0);
  });

  test("os links de âncora levam a seções que existem", async ({ page }) => {
    await page.goto("/");
    const alvos = await page
      .locator('a[href^="#"]')
      .evaluateAll((links) => [...new Set(links.map((a) => a.getAttribute("href")!.slice(1)))]);
    for (const id of alvos) {
      await expect(page.locator(`[id="${id}"]`), `#${id}`).toHaveCount(1);
    }
  });

  test("a página não rola para o lado", async ({ page }) => {
    await page.goto("/");
    const sobra = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(sobra).toBeLessThanOrEqual(0);
  });

  test("o primeiro Tab mostra o atalho para o conteúdo e ele funciona", async ({ page }) => {
    await page.goto("/");
    await page.keyboard.press("Tab");
    const atalho = page.getByRole("link", { name: "Pular para o conteúdo" });
    await expect(atalho).toBeFocused();
    await expect(atalho).toBeInViewport();
    await page.keyboard.press("Enter");
    await expect(page.locator("#conteudo")).toBeFocused();
  });

  test("a foto da Mari é servida em formato moderno e com texto alternativo", async ({ page }) => {
    await page.goto("/");
    const foto = page.getByRole("img", { name: /Mariana Dayrell/ });
    await expect(foto).toBeVisible();
    const src = await foto.evaluate((img: HTMLImageElement) => img.currentSrc);
    const resposta = await page.request.get(src, { headers: { accept: "image/avif,image/webp,*/*" } });
    expect(resposta.headers()["content-type"]).toMatch(/image\/(avif|webp)/);
    expect((await resposta.body()).byteLength).toBeLessThan(300 * 1024);
  });

  test("o formulário de agendamento ainda não envia (abre na F7)", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("button", { name: "Reservar e falar com a Mari" })).toBeDisabled();
    await expect(page.getByText("A agenda abre em breve.")).toBeVisible();
  });

  test("não tem violações de acessibilidade na página inteira", async ({ page }) => {
    await page.goto("/");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });
});

test.describe("gravuras", () => {
  test("toda imagem tem texto alternativo e é servida leve", async ({ page }) => {
    await page.goto("/");
    const imagens = page.locator("main img, footer img, header img");
    expect(await imagens.count()).toBeGreaterThanOrEqual(6);
    for (const img of await imagens.all()) {
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveAttribute("alt", /\S{3,}/);
      await expect
        .poll(() => img.evaluate((el: HTMLImageElement) => el.complete && el.naturalWidth > 0))
        .toBe(true);
      const src = await img.evaluate((el: HTMLImageElement) => el.currentSrc);
      const resposta = await page.request.get(src, { headers: { accept: "image/avif,image/webp,*/*" } });
      expect(resposta.headers()["content-type"], src).toMatch(/image\/(avif|webp)/);
      expect((await resposta.body()).byteLength, src).toBeLessThan(300 * 1024);
    }
  });

  test("o rodapé credita as gravuras do Met", async ({ page }) => {
    await page.goto("/");
    await expect(page.locator("footer")).toContainText("The Metropolitan Museum of Art");
  });
});
