import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// A página de estilos só existe com STYLEGUIDE=1 no build (o CI liga).
test.describe("sistema de design", () => {
  test("mostra as três fases com cartas e ornamentos", async ({ page }) => {
    await page.goto("/estilo");
    await expect(page.getByRole("heading", { level: 1 })).toHaveText("Sistema de design");
    for (const fase of ["solar", "crepúsculo", "lunar"]) {
      await expect(page.getByRole("heading", { level: 2, name: `Fase ${fase}` })).toBeVisible();
    }
    await expect(page.locator("article")).toHaveCount(3);
  });

  test("não indexa nos buscadores", async ({ page }) => {
    await page.goto("/estilo");
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("não tem violações de acessibilidade em nenhuma fase", async ({ page }) => {
    await page.goto("/estilo");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test("o foco do teclado fica visível", async ({ page }) => {
    await page.goto("/estilo");
    await page.keyboard.press("Tab");
    const outline = await page.evaluate(
      () => getComputedStyle(document.activeElement as Element).outlineStyle,
    );
    expect(outline).toBe("solid");
  });
});
