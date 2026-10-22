import { describe, expect, it } from "vitest";
import { buildContentSecurityPolicy, buildSecurityHeaders } from "./headers";

const byKey = (isDev: boolean) =>
  Object.fromEntries(buildSecurityHeaders({ isDev }).map((h) => [h.key, h.value]));

describe("buildContentSecurityPolicy", () => {
  it("bloqueia frames, objetos e origens externas em produção", () => {
    const csp = buildContentSecurityPolicy({ isDev: false });
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-ancestors 'none'");
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("upgrade-insecure-requests");
    expect(csp).not.toContain("unsafe-eval");
  });

  it("só libera unsafe-eval em desenvolvimento", () => {
    const csp = buildContentSecurityPolicy({ isDev: true });
    expect(csp).toContain("'unsafe-eval'");
    expect(csp).not.toContain("upgrade-insecure-requests");
  });
});

describe("buildSecurityHeaders", () => {
  it("envia HSTS só em produção", () => {
    expect(byKey(false)["Strict-Transport-Security"]).toMatch(/max-age=\d+/);
    expect(byKey(true)["Strict-Transport-Security"]).toBeUndefined();
  });

  it("inclui os headers obrigatórios do checklist", () => {
    const headers = byKey(false);
    expect(headers["X-Frame-Options"]).toBe("DENY");
    expect(headers["X-Content-Type-Options"]).toBe("nosniff");
    expect(headers["Referrer-Policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["Permissions-Policy"]).toContain("camera=()");
  });
});
