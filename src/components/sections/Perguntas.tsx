import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Perguntas.module.scss";

type Props = { faq: Conteudo["faq"] };

// Blueprint "Answers as reading text": tudo respondido num relance, sem sanfona.
export function Perguntas({ faq }: Props) {
  if (faq.itens.length === 0) return null;

  return (
    <section id="perguntas" data-phase="lunar" className={styles.secao} aria-labelledby="perguntas-titulo">
      <div className="grade">
        <h2 id="perguntas-titulo" className={styles.titulo} data-revelar>
          {faq.titulo}
        </h2>
        <div className={styles.texto} data-revelar-grupo>
          {faq.itens.map((item) => (
            <p key={item.pergunta}>
              <strong>{item.pergunta}</strong> {item.resposta}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
