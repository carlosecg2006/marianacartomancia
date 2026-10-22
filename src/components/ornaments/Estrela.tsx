type Props = { className?: string };

// Estrela de quatro pontas: o brilho Y2K, em cor sólida (sem gradiente).
export function Estrela({ className }: Props) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true" focusable="false">
      <path
        d="M50 0 C54 38 62 46 100 50 C62 54 54 62 50 100 C46 62 38 54 0 50 C38 46 46 38 50 0Z"
        fill="currentColor"
      />
    </svg>
  );
}
