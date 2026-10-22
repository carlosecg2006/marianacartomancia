import { Abertura } from "@/components/sections/Abertura";
import { Agendamento } from "@/components/sections/Agendamento";
import { Baralho } from "@/components/sections/Baralho";
import { Citacoes } from "@/components/sections/Citacoes";
import { ComoFunciona } from "@/components/sections/ComoFunciona";
import { Consulta } from "@/components/sections/Consulta";
import { Depoimentos } from "@/components/sections/Depoimentos";
import { Perguntas } from "@/components/sections/Perguntas";
import { QuemSou } from "@/components/sections/QuemSou";
import { Rodape } from "@/components/sections/Rodape";
import { conteudoInicial } from "@/content/conteudo-inicial";

// One-page: do sol (carta XIX) à lua (carta XVIII). Na F4 o conteúdo passa a vir do banco.
export default function Home() {
  const c = conteudoInicial;

  return (
    <>
      <a className="pular-para-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Abertura marca={c.marca} abertura={c.abertura} />
      <main id="conteudo" tabIndex={-1}>
        <QuemSou marca={c.marca} quemSou={c.quemSou} />
        <Citacoes citacoes={c.citacoes} />
        <Baralho baralho={c.baralho} />
        <Consulta consulta={c.consulta} />
        <ComoFunciona comoFunciona={c.comoFunciona} />
        <Agendamento agendamento={c.agendamento} />
        <Depoimentos depoimentos={c.depoimentos} />
        <Perguntas faq={c.faq} />
      </main>
      <Rodape marca={c.marca} contato={c.contato} contatoFinal={c.contatoFinal} />
    </>
  );
}
