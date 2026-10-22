import { IVY_LEAF, pentagramPath, pentagramVertices, polar } from "./geometry";

const STAR = pentagramPath(66);
const KNOTS = pentagramVertices(66);
// Cinco folhas presas no anel, entre as pontas da estrela.
const LEAVES = Array.from({ length: 5 }, (_, i) => {
  const angle = -54 + i * 72;
  const [x, y] = polar(84, angle);
  return { x, y, rotate: angle - 90 };
});

type Props = { className?: string };

// Pentagrama de galhos num anel de galho, com cinco folhas de hera.
export function Pentagrama({ className }: Props) {
  return (
    <svg className={className} viewBox="-104 -104 208 208" aria-hidden="true" focusable="false">
      <g fill="none" stroke="var(--olive)" strokeLinecap="round" strokeLinejoin="round">
        <circle r="84" strokeWidth="6" />
        <path d={STAR} strokeWidth="7" />
      </g>
      <g fill="var(--olive)">
        {KNOTS.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r="6" />
        ))}
        {LEAVES.map(({ x, y, rotate }) => (
          <path key={rotate} d={IVY_LEAF} transform={`translate(${x} ${y}) rotate(${rotate}) scale(0.62)`} />
        ))}
      </g>
    </svg>
  );
}
