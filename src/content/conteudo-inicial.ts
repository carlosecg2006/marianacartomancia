import { conteudoSchema, type Conteudo } from "@/lib/validation/conteudo";

// Textos padrão iniciais, transcritos de docs/conteudo-inicial.md.
// RASCUNHO: a Mari revisa e edita tudo pelo painel (F5/F6).
// Trechos que só ela pode dar ficam vazios e não aparecem no site.

const conteudo: Conteudo = {
  marca: { nome: "Mariana Dayrell", papel: "Taróloga", regiao: "Minas Gerais, Brasil" },

  contato: { whatsapp: "", instagram: "maarianadayrell", instagramAtivo: false },

  abertura: {
    frase: "As cartas falam baixinho. Eu te ajudo a escutar.",
    apoio: "Tiragens de tarô online com acolhimento e respiração do Kundalini Yoga.",
    acao: "Quero minha tiragem",
    fatos: ["Tarô e acolhimento", "100% online", "Minas Gerais"],
  },

  quemSou: {
    titulo: "Quem sou",
    paragrafos: [
      "Eu sou a Mari, Mariana Dayrell, mineira, e o tarô é o meu jeito de conversar com o que a gente sente, mas ainda não conseguiu dizer.",
      "Leio as cartas com calma e com respeito. Para mim, uma tiragem não é sentença: é um espelho, um convite para olhar com mais carinho para o próprio caminho.",
      "Também estudo e pratico Kundalini Yoga com a minha professora, Prem Ras Kaur. Foi no yoga que eu aprendi que a respiração muda tudo: acalma o corpo, abre espaço e deixa a intuição chegar. Por isso, nas minhas tiragens, as duas coisas andam juntas.",
    ],
    historia: "",
    assinatura: "Mariana Dayrell",
  },

  citacoes: {
    titulo: "Palavras que me acompanham",
    itens: [
      {
        texto: "Que a sua autonomia seja sempre um ritual: silencioso, constante e irreversível.",
        autoria: "Sara Koimbra",
      },
    ],
  },

  baralho: {
    titulo: "O Lendário Tarot das Bruxas",
    paragrafos: [
      "São 78 cartas, 22 Arcanos Maiores e 56 Arcanos Menores, cheias de natureza, ervas, luas e mulheres sábias. Gosto desse baralho porque ele fala a língua das bruxas antigas: a do ciclo, da terra e da intuição.",
      "Nele, a Louca caminha com o seu gato preto, a Força abraça um leão, e o Eremita ilumina a montanha com uma lanterna. Cada carta é uma história, e cada história pode ser a sua.",
    ],
    cartas: [
      { numeral: "I", nome: "O Mago" },
      { numeral: "II", nome: "A Sacerdotisa" },
      { numeral: "III", nome: "A Imperatriz" },
      { numeral: "VIII", nome: "A Força" },
      { numeral: "IX", nome: "O Eremita" },
      { numeral: "XII", nome: "A Enforcada" },
      { numeral: "XXII", nome: "A Louca" },
    ],
  },

  consulta: {
    titulo: "Uma tiragem que acolhe",
    paragrafos: [
      "Você me conta o que está pedindo atenção na sua vida. Pode ser uma pergunta, uma dúvida ou só um sentimento que não quer calar.",
      "Eu preparo o espaço, respiro, embaralho e tiro as cartas para você. No começo do áudio, eu te guio numa respiração curta do Kundalini Yoga, para você receber a leitura com o corpo calmo e o coração aberto.",
    ],
    fatos: [
      { valor: "10 a 15 min", explicacao: "de áudio com a leitura, no meu tempo e com cuidado" },
      { valor: "A foto", explicacao: "das cartas que saíram, para você guardar e voltar a elas" },
      { valor: "Respiração", explicacao: "guiada do Kundalini Yoga no começo do áudio" },
      { valor: "100% online", explicacao: "pelo WhatsApp, de onde você estiver" },
    ],
  },

  comoFunciona: {
    titulo: "Como funciona",
    passos: [
      { titulo: "Você escolhe um horário", texto: "Veja na agenda os horários livres e reserve o seu." },
      {
        titulo: "A gente conversa",
        texto: "Seu pedido chega para mim no WhatsApp, e a gente combina os detalhes e o pagamento.",
      },
      {
        titulo: "Eu tiro as suas cartas",
        texto: "No dia marcado, preparo o espaço e faço a sua tiragem com calma.",
      },
      {
        titulo: "Você recebe o áudio",
        texto: "O áudio e a foto chegam para você ouvir num lugar tranquilo, sem pressa.",
      },
    ],
  },

  agendamento: {
    titulo: "Reserve o seu horário",
    texto: "Seu horário fica guardado por 2 horas enquanto a gente confirma pelo WhatsApp.",
    campos: {
      nome: "Seu nome",
      whatsapp: "Seu WhatsApp (com DDD)",
      intencao: "O que você quer olhar nas cartas? (opcional)",
    },
    consentimento:
      "Autorizo o uso do meu nome e WhatsApp para a Mari entrar em contato sobre esta tiragem, conforme a Política de Privacidade.",
    botao: "Reservar e falar com a Mari",
    aviso: "A agenda abre em breve.",
  },

  depoimentos: { titulo: "Quem já tirou as cartas comigo", itens: [] },

  faq: {
    titulo: "Perguntas frequentes",
    itens: [
      {
        pergunta: "Preciso acreditar em tarô para fazer uma tiragem?",
        resposta:
          "Não. Basta estar aberta ou aberto para receber o que as cartas trazem. Muita gente chega curiosa e sai com um olhar novo sobre a própria situação.",
      },
      {
        pergunta: "Como funciona a tiragem online?",
        resposta:
          "Você reserva um horário e me chama no WhatsApp. No dia combinado, eu faço a sua tiragem e te mando um áudio de 10 a 15 minutos com a leitura e a foto das cartas.",
      },
      {
        pergunta: "O que eu recebo?",
        resposta:
          "Um áudio de 10 a 15 minutos com a leitura completa e a foto das cartas que saíram para você.",
      },
      {
        pergunta: "Como entra a respiração do Kundalini Yoga? Preciso saber yoga?",
        resposta:
          "Não precisa saber nada. No começo do áudio, eu te guio numa respiração simples, que qualquer pessoa consegue fazer, para você ouvir a leitura com mais calma.",
      },
      {
        pergunta: "Preciso preparar alguma coisa antes?",
        resposta:
          "Só pensar no que você quer olhar. Na hora de ouvir o áudio, procure um lugar tranquilo, sem pressa.",
      },
      {
        pergunta: "Como agendo e como pago?",
        resposta:
          "Pela agenda aqui do site você reserva o horário, e pelo WhatsApp a gente combina o pagamento. O horário fica guardado por 2 horas até a confirmação.",
      },
      {
        pergunta: "Posso remarcar ou cancelar?",
        resposta: "Pode. É só me chamar no WhatsApp que eu ajusto para você.",
      },
      {
        pergunta: "O tarô prevê o futuro?",
        resposta:
          "O tarô mostra caminhos, tendências e o que está em movimento agora. O futuro não está escrito em pedra: as suas escolhas fazem parte dele.",
      },
      {
        pergunta: "O que eu conto fica entre nós?",
        resposta: "Sim. O que você me conta é usado só para a sua tiragem e não é compartilhado com ninguém.",
      },
      {
        pergunta: "A tiragem substitui terapia ou acompanhamento médico?",
        resposta:
          "Não. O tarô é uma prática de autoconhecimento e acolhimento. Se você está passando por um momento difícil, procure também um profissional de saúde.",
      },
    ],
  },

  contatoFinal: {
    titulo: "Vamos conversar?",
    texto: "Me chama para tirar dúvidas, combinar a sua tiragem ou só dizer oi.",
  },
};

export const conteudoInicial: Conteudo = conteudoSchema.parse(conteudo);
