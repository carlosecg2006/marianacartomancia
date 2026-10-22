// Formas compartilhadas pelos ornamentos. Desenhadas para o site, inspiradas
// no verso das cartas (hera espelhada e pentagrama de galhos). Nada copiado.

const round = (n: number) => Math.round(n * 100) / 100;

export function polar(radius: number, degrees: number): [number, number] {
  const radians = (degrees * Math.PI) / 180;
  return [round(radius * Math.cos(radians)), round(radius * Math.sin(radians))];
}

// Folha de hera com cinco lobos, presa em (0,0) e apontando para +y.
export const IVY_LEAF =
  "M0 0 C-4 -2 -10 0 -13 5 C-17 4 -20 8 -18 12 C-14 13 -12 17 -12 21 C-7 20 -3 23 0 30 " +
  "C3 23 7 20 12 21 C12 17 14 13 18 12 C20 8 17 4 13 5 C10 0 4 -2 0 0Z";

// Pentagrama com centro em (0,0), desenhado como um traço contínuo.
export function pentagramPath(radius: number): string {
  const points = [0, 2, 4, 1, 3].map((k) => polar(radius, -90 + k * 72));
  return `M${points.map(([x, y]) => `${x} ${y}`).join(" L")}Z`;
}

export function pentagramVertices(radius: number): [number, number][] {
  return [0, 1, 2, 3, 4].map((k) => polar(radius, -90 + k * 72));
}
