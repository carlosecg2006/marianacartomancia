import { Sol } from "@/components/ornaments/Sol";
import { Botao } from "@/components/ui/Botao";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Abertura.module.scss";

type Props = { marca: Conteudo["marca"]; abertura: Conteudo["abertura"] };

const LINKS = [
  { href: "#quem-sou", rotulo: "Quem sou" },
  { href: "#baralho", rotulo: "O baralho" },
  { href: "#consulta", rotulo: "A consulta" },
  { href: "#perguntas", rotulo: "Perguntas" },
];

// Carta XIX, O Sol: a abertura do site. Toda a informação principal mora na carta.
export function Abertura({ marca, abertura }: Props) {
  const [primeiro, ...resto] = marca.nome.split(" ");

  return (
    <header id="inicio" data-phase="solar" className={styles.abertura}>
      <Sol className={styles.sol} />

      <div className={styles.carta}>
        <span className={styles.selo} aria-hidden="true">
          XIX
        </span>

        <h1 className={styles.nome}>
          <span>{primeiro}</span> <span>{resto.join(" ")}</span>
        </h1>

        <div className={styles.corpo}>
          <p className={styles.frase}>{abertura.frase}</p>
          <div className={styles.detalhes}>
            <p className={styles.apoio}>{abertura.apoio}</p>
            <ul className={styles.fatos}>
              {abertura.fatos.map((fato) => (
                <li key={fato}>{fato}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.base}>
          <nav aria-label="Seções do site">
            <ul className={styles.links}>
              {LINKS.map((link) => (
                <li key={link.href}>
                  <a href={link.href}>{link.rotulo}</a>
                </li>
              ))}
            </ul>
          </nav>
          <Botao href="#agendamento">{abertura.acao}</Botao>
        </div>

        <p className={styles.faixa} aria-hidden="true">
          O Sol
        </p>
      </div>
    </header>
  );
}
