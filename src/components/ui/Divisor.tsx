import { IVY_LEAF } from "@/components/ornaments/geometry";
import { Pentagrama } from "@/components/ornaments/Pentagrama";
import styles from "./Divisor.module.scss";

const LEAVES: [x: number, y: number, rotate: number][] = [
  [30, 34, -100],
  [70, 46, -70],
  [110, 30, -110],
  [150, 46, -70],
  [190, 32, -105],
];

function Ramo() {
  return (
    <svg className={styles.ramo} viewBox="0 0 240 80" aria-hidden="true" focusable="false">
      <path
        d="M0 40 C40 20 80 60 120 40 S200 22 240 40"
        fill="none"
        stroke="var(--olive)"
        strokeWidth="4"
        strokeLinecap="round"
      />
      {LEAVES.map(([x, y, r]) => (
        <path key={x} d={IVY_LEAF} fill="var(--olive)" transform={`translate(${x} ${y}) rotate(${r})`} />
      ))}
    </svg>
  );
}

// Faixa ornamental entre seções: ramo, pentagrama, ramo espelhado.
export function Divisor() {
  return (
    <div className={styles.divisor} aria-hidden="true">
      <Ramo />
      <Pentagrama className={styles.centro} />
      <span className={styles.espelho}>
        <Ramo />
      </span>
    </div>
  );
}
