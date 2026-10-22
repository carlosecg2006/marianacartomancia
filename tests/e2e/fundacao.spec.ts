import { expect, test } from "@playwright/test";

test("a página abre em português", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
});

test("envia os headers de segurança e esconde a tecnologia", async ({ request }) => {
  const response = await request.get("/");
  const headers = response.headers();

  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["strict-transport-security"]).toMatch(/max-age=\d+/);
  expect(headers["x-frame-options"]).toBe("DENY");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
  expect(headers["x-powered-by"]).toBeUndefined();
});

test("não publica source maps do navegador", async ({ page, request }) => {
  const scripts: string[] = [];
  page.on("response", (r) => {
    if (r.url().endsWith(".js")) scripts.push(r.url());
  });
  await page.goto("/");
  expect(scripts.length).toBeGreaterThan(0);

  for (const url of scripts) {
    const map = await request.get(`${url}.map`);
    expect(map.status(), `${url}.map`).toBe(404);
  }
});
