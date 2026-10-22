import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Estrela } from "@/components/ornaments/Estrela";
import { Hera } from "@/components/ornaments/Hera";
import { Lua } from "@/components/ornaments/Lua";
import { Pentagrama } from "@/components/ornaments/Pentagrama";
import { Sol } from "@/components/ornaments/Sol";
import { Botao } from "@/components/ui/Botao";
import { Carta } from "@/components/ui/Carta";
import { Citacao } from "@/components/ui/Citacao";
import { Divisor } from "@/components/ui/Divisor";
import styles from "./estilo.module.scss";

export const metadata: Metadata = {
  title: "Sistema de design",
  robots: { index: false, follow: false },
};

// Página de estilos: só em desenvolvimento ou com STYLEGUIDE=1 no build (CI).
const visivel = process.env.NODE_ENV !== "production" || process.env.STYLEGUIDE === "1";

const FASES = [
  { id: "solar", nome: "Solar", numeral: "XIX", carta: "O Sol" },
  { id: "crepusculo", nome: "Crepúsculo", numeral: "XVII", carta: "A Estrela" },
  { id: "lunar", nome: "Lunar", numeral: "XVIII", carta: "A Lua" },
] as const;

const CORES = ["bg", "surface", "ink", "muted", "accent", "field", "gold", "olive"] as const;

export default function Estilo() {
  if (!visivel) notFound();

  return (
    <main>
      <header data-phase="solar" className={styles.topo}>
        <h1 className={styles.titulo}>Sistema de design</h1>
        <p className={styles.lead}>
          Cores, tipografia, ornamentos e componentes do site da Mariana Dayrell, nas três fases do sol à lua.
        </p>
      </header>

      {FASES.map((fase) => (
        <section
          key={fase.id}
          data-phase={fase.id}
          className={styles.fase}
          aria-labelledby={`fase-${fase.id}`}
        >
          <h2 id={`fase-${fase.id}`} className={styles.titulo}>
            Fase {fase.nome.toLowerCase()}
          </h2>

          <div className={styles.grade}>
            <div className={styles.coluna}>
              <h3 className={styles.subtitulo}>Cores</h3>
              <ul className={styles.cores}>
                {CORES.map((cor) => (
                  <li key={cor}>
                    <span className={styles.amostra} style={{ background: `var(--${cor})` }} />
                    <span>--{cor}</span>
                  </li>
                ))}
              </ul>

              <h3 className={styles.subtitulo}>Tipografia</h3>
              <p className={styles.display}>Mariana</p>
              <p className={styles.head}>As cartas falam baixinho</p>
              <p className={styles.lead}>Tiragens de tarô online com acolhimento e respiração.</p>
              <p>
                Você me conta o que está pedindo atenção na sua vida. Eu preparo o espaço, respiro, embaralho
                e tiro as cartas para você. <a href="#fase-solar">Um link no texto</a>.
              </p>
              <p className={styles.small}>Texto pequeno, para notas e créditos.</p>

              <h3 className={styles.subtitulo}>Ações</h3>
              <div className={styles.acoes}>
                <Botao href="#fase-solar">Quero minha tiragem</Botao>
                <Botao href="#fase-solar" variante="texto">
                  Como funciona
                </Botao>
              </div>

              <h3 className={styles.subtitulo}>Formulário</h3>
              <label className="form-label" htmlFor={`nome-${fase.id}`}>
                Seu nome
              </label>
              <input className="form-control" id={`nome-${fase.id}`} name="nome" autoComplete="name" />
            </div>

            <div className={styles.coluna}>
              <Carta numeral={fase.numeral} nome={fase.carta} formato="carta" className={styles.carta}>
                <div className={styles.ornamento}>
                  {fase.id === "solar" && <Sol />}
                  {fase.id === "crepusculo" && <Estrela className={styles.estrelaGrande} />}
                  {fase.id === "lunar" && <Lua />}
                </div>
              </Carta>
            </div>
          </div>

          <Divisor />

          <div className={styles.grade}>
            <Citacao
              texto="Que a sua autonomia seja sempre um ritual: silencioso, constante e irreversível."
              autoria="Sara Koimbra"
            />
            <div className={styles.ornamentos}>
              <Hera className={styles.hera} />
              <Pentagrama className={styles.pentagrama} />
              <span className={styles.estrelas}>
                <Estrela />
                <Estrela />
                <Estrela />
              </span>
            </div>
          </div>
        </section>
      ))}
    </main>
  );
}
