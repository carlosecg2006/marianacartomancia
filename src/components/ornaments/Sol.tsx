import { polar } from "./geometry";

const RAYS = Array.from({ length: 24 }, (_, i) => {
  const angle = i * 15 - 90;
  const long = i % 2 === 0;
  const [tx, ty] = polar(long ? 96 : 74, angle);
  const spread = long ? 4.5 : 3;
  const [ax, ay] = polar(38, angle - spread);
  const [bx, by] = polar(38, angle + spread);
  return `M${ax} ${ay} L${tx} ${ty} L${bx} ${by}Z`;
});

const DOTS = Array.from({ length: 24 }, (_, i) => polar(45, i * 15 - 82.5));

type Props = { className?: string };

// Sol déco: raios alternados, anel de contas e disco duplo (dourado e vermelho).
export function Sol({ className }: Props) {
  return (
    <svg className={className} viewBox="-100 -100 200 200" aria-hidden="true" focusable="false">
      <g fill="var(--gold)">
        {RAYS.map((d) => (
          <path key={d} d={d} />
        ))}
        {DOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="2.4" />
        ))}
        <circle r="34" />
      </g>
      <circle r="24" fill="var(--field)" />
    </svg>
  );
}
