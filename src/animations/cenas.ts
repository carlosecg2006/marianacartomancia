import type { gsap as GSAP } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";

// Todas as cenas da página. Regras (CLAUDE.md e taste-skill):
// - só transform e opacity;
// - nada fica escondido sem JavaScript: os estados iniciais são criados aqui, nunca no CSS;
// - com prefers-reduced-motion, nenhuma cena roda e a página fica no estado final;
// - cada entrada dispara uma vez; cenas presas à rolagem são lineares (scrub).

type Contexto = { gsap: typeof GSAP; ScrollTrigger: typeof ScrollTriggerType };

// Só opacity (nunca autoAlpha/visibility): o conteúdo continua na árvore de
// acessibilidade enquanto espera a entrada, e leitores de tela o encontram.
const SUBIDA = { y: 24, opacity: 0, duration: 0.8, ease: "expo.out" } as const;
const GATILHO = "top 88%";

export function montarCenas({ gsap, ScrollTrigger }: Contexto) {
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add(
    {
      movimento: "(prefers-reduced-motion: no-preference)",
      largo: "(min-width: 1024px)",
    },
    (ctx) => {
      const { movimento, largo } = ctx.conditions as { movimento: boolean; largo: boolean };
      if (!movimento) return;

      porDoSol(gsap);
      entradas(gsap);
      heraCresce(gsap);
      estrelasAcendem(gsap);
      luaSobe(gsap);
      if (largo) {
        cartasDadas(gsap);
        fioTurquesa(gsap);
      }
    },
  );

  return () => mm.revert();
}

// Movimento assinatura: ao sair da carta XIX, o sol gira e afunda e a carta recua.
function porDoSol(gsap: typeof GSAP) {
  const cena = document.querySelector<HTMLElement>('[data-cena="por-do-sol"]');
  const sol = cena?.querySelector<SVGElement>('[data-alvo="sol"]');
  const carta = cena?.querySelector<HTMLElement>('[data-alvo="carta"]');
  if (!cena || !sol || !carta) return;

  // O CSS centraliza o sol com translate(-50%, -50%); o GSAP assume esse papel.
  gsap.set(sol, { x: 0, y: 0, xPercent: -50, yPercent: -50 });

  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { trigger: cena, start: "top top", end: "bottom top", scrub: true },
  });
  tl.to(sol, { rotation: 32, yPercent: -18 }, 0).to(carta, { scale: 0.92, y: 60 }, 0); // sem transparência: o texto nunca fica sobre o sol;
}

// Entradas de cada seção, em ordem de leitura: título, texto, detalhes.
function entradas(gsap: typeof GSAP) {
  // A hera tem entrada própria (heraCresce): dois from() no mesmo elemento
  // gravariam a opacidade 0 do primeiro como estado final do segundo.
  gsap.utils.toArray<HTMLElement>('[data-revelar]:not([data-revelar="hera"])').forEach((el) => {
    gsap.from(el, { ...SUBIDA, scrollTrigger: { trigger: el, start: GATILHO, once: true } });
  });

  gsap.utils.toArray<HTMLElement>("[data-revelar-grupo]").forEach((grupo) => {
    gsap.from(grupo.children, {
      ...SUBIDA,
      stagger: 0.08,
      scrollTrigger: { trigger: grupo, start: GATILHO, once: true },
    });
  });
}

// Os ramos de hera crescem a partir da base.
function heraCresce(gsap: typeof GSAP) {
  gsap.utils.toArray<SVGElement>('[data-revelar="hera"]').forEach((hera) => {
    gsap.from(hera, {
      scaleY: 0.86,
      opacity: 0,
      transformOrigin: "50% 100%",
      duration: 1.2,
      ease: "expo.out",
      scrollTrigger: { trigger: hera, start: GATILHO, once: true },
    });
  });
}

// O brilho Y2K: as estrelas acendem uma vez quando a noite chega. Sem loop.
function estrelasAcendem(gsap: typeof GSAP) {
  gsap.utils.toArray<HTMLElement>("[data-estrelas]").forEach((grupo) => {
    gsap.from(grupo.children, {
      scale: 0,
      opacity: 0,
      rotation: -45,
      duration: 0.9,
      ease: "expo.out",
      stagger: 0.09,
      scrollTrigger: { trigger: grupo, start: "top 90%", once: true },
    });
  });
}

// A lua cheia sobe devagar atrás do cartão de reserva (paralaxe menor que 8%).
function luaSobe(gsap: typeof GSAP) {
  const lua = document.querySelector<SVGElement>('[data-alvo="lua"]');
  if (!lua) return;
  gsap.fromTo(
    lua,
    { yPercent: 8 },
    {
      yPercent: -8,
      ease: "none",
      scrollTrigger: { trigger: lua.closest("section"), start: "top bottom", end: "bottom top", scrub: true },
    },
  );
}

// Cena do baralho: as cartas sobem da borda da seção, uma a uma, presas à rolagem.
function cartasDadas(gsap: typeof GSAP) {
  const fileira = document.querySelector<HTMLElement>('[data-cena="cartas"]');
  if (!fileira) return;
  const cartas = Array.from(fileira.querySelectorAll<HTMLElement>(":scope > li > *"));
  gsap.from(cartas, {
    yPercent: 75,
    ease: "none",
    stagger: 0.12,
    scrollTrigger: { trigger: fileira, start: "top bottom", end: "bottom 85%", scrub: true },
  });
}

// O fio turquesa cresce com a página; o disco começa sol e termina lua.
function fioTurquesa(gsap: typeof GSAP) {
  const fio = document.querySelector<HTMLElement>("[data-fio]");
  if (!fio) return;
  const linha = fio.querySelector<HTMLElement>('[data-alvo="linha"]');
  const disco = fio.querySelector<HTMLElement>('[data-alvo="disco"]');
  const sol = fio.querySelector<HTMLElement>('[data-alvo="disco-sol"]');
  const lua = fio.querySelector<HTMLElement>('[data-alvo="disco-lua"]');
  if (!linha || !disco || !sol || !lua) return;

  gsap.set(fio, { autoAlpha: 1 });
  const tl = gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: { start: 0, end: "max", scrub: true },
  });
  tl.fromTo(linha, { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0)
    .fromTo(disco, { y: 0 }, { y: () => fio.clientHeight - disco.clientHeight, duration: 1 }, 0)
    .to(sol, { autoAlpha: 0, rotation: 90, duration: 0.2 }, 0.4)
    .fromTo(lua, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.2 }, 0.45);
}
