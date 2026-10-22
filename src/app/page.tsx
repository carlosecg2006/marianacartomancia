import { CamadaDeMovimento } from "@/animations/CamadaDeMovimento";
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
import { FioTurquesa } from "@/components/ui/FioTurquesa";
import { carregarConteudo } from "@/lib/conteudo/carregar";
import type { ChaveSecao } from "@/lib/conteudo/secoes";

// One-page: do sol (carta XIX) à lua (carta XVIII). O conteúdo vem do banco (editável no painel).
export default async function Home() {
  const { conteudo: c, ocultas } = await carregarConteudo();
  const visivel = (chave: ChaveSecao) => !ocultas.includes(chave);

  return (
    <>
      <a className="pular-para-conteudo" href="#conteudo">
        Pular para o conteúdo
      </a>
      <Abertura marca={c.marca} abertura={c.abertura} />
      <main id="conteudo" tabIndex={-1}>
        {visivel("quemSou") && <QuemSou marca={c.marca} quemSou={c.quemSou} />}
        {visivel("citacoes") && <Citacoes citacoes={c.citacoes} />}
        {visivel("baralho") && <Baralho baralho={c.baralho} />}
        {visivel("consulta") && <Consulta consulta={c.consulta} />}
        {visivel("comoFunciona") && <ComoFunciona comoFunciona={c.comoFunciona} />}
        {visivel("agendamento") && <Agendamento agendamento={c.agendamento} />}
        {visivel("depoimentos") && <Depoimentos depoimentos={c.depoimentos} />}
        {visivel("faq") && <Perguntas faq={c.faq} />}
      </main>
      <Rodape marca={c.marca} contato={c.contato} contatoFinal={c.contatoFinal} />
      <FioTurquesa />
      <CamadaDeMovimento />
    </>
  );
}
