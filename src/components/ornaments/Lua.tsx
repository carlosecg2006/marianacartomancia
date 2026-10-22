import type { ComponentProps } from "react";

type Props = Omit<ComponentProps<"svg">, "viewBox" | "children"> & { fase?: "crescente" | "cheia" };

// Lua crescente (pontas para a direita) ou cheia, em cor sólida.
export function Lua({ fase = "crescente", ...props }: Props) {
  return (
    <svg {...props} viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      {fase === "cheia" ? (
        <circle cx="100" cy="100" r="80" fill="var(--ink)" />
      ) : (
        <path d="M100 20 A80 80 0 0 0 100 180 A96 96 0 0 1 100 20Z" fill="var(--ink)" />
      )}
    </svg>
  );
}
