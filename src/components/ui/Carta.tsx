import type { ReactNode } from "react";
import styles from "./Carta.module.scss";

type Props = {
  numeral?: string; // algarismo romano do selo, como nas cartas (XIX, XVIII...)
  nome?: string; // texto da faixa na base
  formato?: "carta" | "livre"; // carta = proporção 7:11 do baralho
  as?: "article" | "div" | "section";
  className?: string;
  children: ReactNode;
};

// A carta: moldura dourada com cantos chanfrados, janela, selo e faixa.
// Separação por preenchimento e tom, nunca por linha fina.
export function Carta({ numeral, nome, formato = "livre", as: Tag = "article", className, children }: Props) {
  return (
    <Tag
      className={[styles.carta, formato === "carta" && styles.proporcao, className].filter(Boolean).join(" ")}
    >
      <div className={styles.janela}>
        {numeral && (
          <span className={styles.selo} aria-hidden="true">
            {numeral}
          </span>
        )}
        <div className={styles.conteudo}>{children}</div>
        {nome && <p className={styles.faixa}>{nome}</p>}
      </div>
    </Tag>
  );
}
