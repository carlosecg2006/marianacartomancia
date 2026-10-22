import { Estrela } from "@/components/ornaments/Estrela";
import { Lua } from "@/components/ornaments/Lua";
import type { Conteudo } from "@/lib/validation/conteudo";
import styles from "./Agendamento.module.scss";

type Props = { agendamento: Conteudo["agendamento"] };

// Posições fixas: as estrelas são as mesmas a cada visita (nada de Math.random no servidor).
const ESTRELAS = [
  [8, 14, 1.2],
  [22, 62, 0.8],
  [34, 28, 1.6],
  [12, 82, 1],
  [46, 74, 0.7],
  [54, 18, 1.1],
  [28, 44, 0.6],
  [6, 48, 0.9],
];

// Blueprint "Visit card on a photograph": céu noturno e um único cartão de reserva.
// O envio entra na F7; até lá o botão fica desativado com o aviso.
export function Agendamento({ agendamento }: Props) {
  return (
    <section
      id="agendamento"
      data-phase="lunar"
      className={styles.secao}
      aria-labelledby="agendamento-titulo"
    >
      <div className={styles.ceu} aria-hidden="true">
        <Lua fase="cheia" className={styles.lua} />
        {ESTRELAS.map(([x, y, s]) => (
          <span
            key={`${x}-${y}`}
            className={styles.estrela}
            style={{ left: `${x}%`, top: `${y}%`, scale: s }}
          >
            <Estrela />
          </span>
        ))}
      </div>

      <div className={styles.cartao}>
        <h2 id="agendamento-titulo" className={styles.titulo}>
          {agendamento.titulo}
        </h2>
        {agendamento.texto && <p className={styles.texto}>{agendamento.texto}</p>}

        <form className={styles.form} aria-describedby="agendamento-aviso">
          <div>
            <label className="form-label" htmlFor="ag-nome">
              {agendamento.campos.nome}
            </label>
            <input className="form-control" id="ag-nome" name="nome" autoComplete="name" required />
          </div>
          <div>
            <label className="form-label" htmlFor="ag-whatsapp">
              {agendamento.campos.whatsapp}
            </label>
            <input
              className="form-control"
              id="ag-whatsapp"
              name="whatsapp"
              type="tel"
              inputMode="tel"
              autoComplete="tel"
              required
            />
          </div>
          <div>
            <label className="form-label" htmlFor="ag-intencao">
              {agendamento.campos.intencao}
            </label>
            <textarea className="form-control" id="ag-intencao" name="intencao" rows={3} />
          </div>
          <div className={styles.consentimento}>
            <input
              className="form-check-input"
              type="checkbox"
              id="ag-consentimento"
              name="consentimento"
              required
            />
            <label className="form-check-label" htmlFor="ag-consentimento">
              {agendamento.consentimento}
            </label>
          </div>

          <button type="submit" className={styles.botao} disabled>
            {agendamento.botao}
          </button>
          {agendamento.aviso && (
            <p id="agendamento-aviso" className={styles.aviso} role="status">
              {agendamento.aviso}
            </p>
          )}
        </form>
      </div>
    </section>
  );
}
