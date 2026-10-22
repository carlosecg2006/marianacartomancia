import Image from "next/image";
import foto from "@/assets/mariana-dayrell.jpg";
import { Hera } from "@/components/ornaments/Hera";
import { Botao } from "@/components/ui/Botao";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./QuemSou.module.scss";

type Props = { marca: Conteudo["marca"]; quemSou: Conteudo["quemSou"] };

// Uma carta escrita à mão: folha de pergaminho entre dois ramos de hera.
export function QuemSou({ marca, quemSou }: Props) {
  const paragrafos = quemSou.historia ? [...quemSou.paragrafos, quemSou.historia] : quemSou.paragrafos;

  return (
    <section id="quem-sou" data-phase="solar" className={styles.secao} aria-labelledby="quem-sou-titulo">
      <Hera className={`${styles.hera} ${styles.esquerda}`} />
      <Hera className={`${styles.hera} ${styles.direita}`} />

      <div className={styles.folha}>
        <div className={styles.cabecalho}>
          <Image
            src={foto}
            alt="Mariana Dayrell sorrindo, com cabelo longo ondulado e uma tatuagem de mandala no colo"
            className={styles.retrato}
            sizes="136px"
          />
          <h2 id="quem-sou-titulo" className={styles.titulo}>
            {quemSou.titulo}
          </h2>
        </div>

        <div className={styles.texto}>
          {paragrafos.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>

        <p className={styles.assinatura}>{quemSou.assinatura}</p>
        <p className={styles.papel}>
          {marca.papel} · {marca.regiao}
        </p>
      </div>

      <svg className={styles.recorte} viewBox="0 0 640 20" preserveAspectRatio="none" aria-hidden="true">
        <path
          d={`M0 0 H640 V4 ${Array.from({ length: 16 }, (_, i) => `A20 16 0 0 1 ${640 - (i + 1) * 40} 4`).join(" ")} Z`}
          fill="var(--bg)"
        />
      </svg>

      <div className={styles.destaque}>
        <Botao href="#agendamento">Quero tirar as cartas com você</Botao>
      </div>
    </section>
  );
}
