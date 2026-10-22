import { IVY_LEAF } from "./geometry";

// Um ramo sobe em laços; o outro é o espelho dele e os dois desenham
// corações no centro, como no verso das cartas.
const STEM =
  "M118 400 C40 384 8 316 56 274 C86 248 116 252 118 226 C120 196 30 190 20 140 C12 96 58 66 98 82 C116 90 120 66 116 40 C113 20 100 8 86 0";

const LEAVES: [x: number, y: number, rotate: number][] = [
  [84, 392, 100],
  [38, 352, 60],
  [24, 300, 20],
  [70, 262, -60],
  [104, 238, -100],
  [72, 204, 80],
  [34, 178, 60],
  [16, 132, 10],
  [36, 92, -30],
  [80, 76, -80],
  [112, 52, -110],
];

type Props = { className?: string };

export function Hera({ className }: Props) {
  const ramo = (
    <>
      <path d={STEM} fill="none" stroke="var(--olive)" strokeWidth="5" strokeLinecap="round" />
      {LEAVES.map(([x, y, r]) => (
        <path
          key={`${x}-${y}`}
          d={IVY_LEAF}
          fill="var(--olive)"
          transform={`translate(${x} ${y}) rotate(${r})`}
        />
      ))}
    </>
  );

  return (
    <svg className={className} viewBox="0 0 240 400" aria-hidden="true" focusable="false">
      <g>{ramo}</g>
      <g transform="translate(240 0) scale(-1 1)">{ramo}</g>
    </svg>
  );
}
