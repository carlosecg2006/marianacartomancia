import type { ComponentProps } from "react";
import styles from "./Botao.module.scss";

type Variante = "principal" | "texto";

type LinkProps = ComponentProps<"a"> & { variante?: Variante; href: string };
type ButtonProps = ComponentProps<"button"> & { variante?: Variante; href?: undefined };

const classes = (variante: Variante, className?: string) =>
  [styles.botao, styles[variante], className].filter(Boolean).join(" ");

// Um formato de botão no site inteiro: cantos retos, um preenchimento.
export function Botao(props: LinkProps | ButtonProps) {
  const { variante = "principal", className, ...rest } = props;
  if (rest.href !== undefined) {
    return <a {...(rest as ComponentProps<"a">)} className={classes(variante, className)} />;
  }
  return (
    <button type="button" {...(rest as ComponentProps<"button">)} className={classes(variante, className)} />
  );
}
