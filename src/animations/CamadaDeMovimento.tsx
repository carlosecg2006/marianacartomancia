"use client";

import { useEffect } from "react";

// Carrega GSAP, ScrollTrigger e Lenis depois da primeira pintura, para não
// pesar no carregamento. Sem JavaScript, a página já está completa e legível.
export function CamadaDeMovimento() {
  useEffect(() => {
    let desmontado = false;
    let limpar = () => {};

    (async () => {
      const [{ gsap }, { ScrollTrigger }, { default: Lenis }] = await Promise.all([
        import("gsap"),
        import("gsap/ScrollTrigger"),
        import("lenis"),
      ]);
      if (desmontado) return;

      const { montarCenas } = await import("./cenas");
      const desfazerCenas = montarCenas({ gsap, ScrollTrigger });

      // Rolagem suave só com mouse/trackpad e sem preferência por menos movimento.
      const suave = matchMedia("(prefers-reduced-motion: no-preference) and (pointer: fine)").matches;
      let lenis: InstanceType<typeof Lenis> | null = null;
      let tick: ((time: number) => void) | null = null;
      if (suave) {
        lenis = new Lenis({ lerp: 0.12, autoRaf: false });
        lenis.on("scroll", ScrollTrigger.update);
        tick = (time: number) => lenis?.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
      }

      limpar = () => {
        desfazerCenas();
        if (tick) gsap.ticker.remove(tick);
        lenis?.destroy();
      };
    })();

    return () => {
      desmontado = true;
      limpar();
    };
  }, []);

  return null;
}
