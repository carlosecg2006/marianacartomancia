import { Hera } from "@/components/ornaments/Hera";
import { Lua } from "@/components/ornaments/Lua";
import { Pentagrama } from "@/components/ornaments/Pentagrama";
import { Botao } from "@/components/ui/Botao";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Rodape.module.scss";

type Props = {
  marca: Conteudo["marca"];
  contato: Conteudo["contato"];
  contatoFinal: Conteudo["contatoFinal"];
};

const ESCALOPES = Array.from({ length: 12 }, (_, i) => `A50 40 0 0 1 ${(i + 1) * 100} 40`).join(" ");

// O verso da carta: a noite termina com a carta virada, pergaminho e hera.
export function Rodape({ marca, contato, contatoFinal }: Props) {
  const links = [
    contato.whatsapp && { href: `https://wa.me/${contato.whatsapp}`, rotulo: "WhatsApp" },
    contato.instagram &&
      contato.instagramAtivo && {
        href: `https://www.instagram.com/${contato.instagram}/`,
        rotulo: `Instagram @${contato.instagram}`,
      },
    { href: "#agendamento", rotulo: "Agendar uma tiragem" },
    { href: "#perguntas", rotulo: "Perguntas frequentes" },
    { href: "#inicio", rotulo: "Voltar ao começo" },
  ].filter((l): l is { href: string; rotulo: string } => Boolean(l));

  return (
    <footer id="contato" data-phase="lunar" className={styles.rodape} aria-labelledby="contato-titulo">
      <svg className={styles.escalopes} viewBox="0 0 1200 80" preserveAspectRatio="none" aria-hidden="true">
        <path d={`M0 80 V40 ${ESCALOPES} V80 Z`} fill="var(--verso)" />
      </svg>

      <div data-phase="solar" className={styles.verso}>
        <div className={styles.mensagem}>
          <h2 id="contato-titulo" className={styles.titulo}>
            {contatoFinal.titulo}
          </h2>
          <p>{contatoFinal.texto}</p>
          <Botao href="#agendamento">Reservar meu horário</Botao>
        </div>

        <div className={styles.ornamento} aria-hidden="true">
          <Hera className={styles.hera} />
          <Pentagrama className={styles.pentagrama} />
        </div>

        <div className={styles.enderecos}>
          <div className={styles.selo} aria-hidden="true">
            <Lua className={styles.lua} />
            <span>XVIII</span>
          </div>
          <ul>
            {links.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.rotulo}</a>
              </li>
            ))}
          </ul>
          <p className={styles.regiao}>Atendimento 100% online · {marca.regiao}</p>
        </div>

        <p className={styles.imprenta}>
          {marca.nome} · {marca.papel}. Ilustrações e ornamentos desenhados para este site.
        </p>
      </div>
    </footer>
  );
}
