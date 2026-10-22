import styles from "./Citacao.module.scss";

type Props = { texto: string; autoria: string; fonte?: string };

export function Citacao({ texto, autoria, fonte }: Props) {
  return (
    <figure className={styles.citacao}>
      <blockquote cite={fonte}>
        <p>{texto}</p>
      </blockquote>
      <figcaption>{autoria}</figcaption>
    </figure>
  );
}
