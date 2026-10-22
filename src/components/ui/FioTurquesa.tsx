import { Lua } from "@/components/ornaments/Lua";
import { Sol } from "@/components/ornaments/Sol";
import styles from "./FioTurquesa.module.scss";

// O fio condutor do site: uma linha turquesa na margem que cresce com a
// rolagem e um disco que desce de sol a lua. Só aparece com a camada de
// movimento ativa (desktop, sem prefers-reduced-motion); é decorativo.
export function FioTurquesa() {
  return (
    <div className={styles.fio} data-fio aria-hidden="true">
      <span className={styles.linha} data-alvo="linha" />
      <span className={styles.disco} data-alvo="disco">
        <span className={styles.face} data-alvo="disco-sol">
          <Sol />
        </span>
        <span className={styles.face} data-alvo="disco-lua">
          <Lua fase="cheia" />
        </span>
      </span>
    </div>
  );
}
