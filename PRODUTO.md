# PRODUTO.md

O que é o site, para quem é e o que ele precisa transmitir. Regras técnicas em `CLAUDE.md`.
Tudo marcado **A DEFINIR** depende de uma resposta e não deve ser inventado.
Os rascunhos dos textos do site estão em `docs/conteudo-inicial.md`.

---

## Visão geral e propósito

- Site profissional de apresentação do trabalho de cartomancia de **Mariana Dayrell** (Mari), taróloga.
- É um **presente surpresa** de um amigo. Ela ainda não decidiu se vai atuar profissionalmente na área. Por isso o site é simples para quem visita, mas dá a ela **autonomia total** para mudar tudo sozinha pelo painel.
- A consulta une a leitura de tarô ao acolhimento e às práticas de respiração e relaxamento do **Kundalini Yoga**, que ela estuda e pratica com a professora **Prem Ras Kaur** (@yogue.prem).
  - Prem Ras Kaur ensina Kundalini Yoga "pela alma" e pratica há mais de uma década.
  - Ela participa de conteúdos sobre bem-estar e respiração, como o podcast Yoga Break.
- Formato: **uma página só (one-page), em scroll**.

### A ideia central: do sol à lua

- O site **abre claro, solar**, e **escurece com o scroll** até virar **noite lunar**.
- **Tudo muda** na passagem: cores, animações, elementos, ilustrações e conceitos. Não é só trocar o fundo.
- Um fio **azul-turquesa** atravessa a página inteira e liga as duas fases.

| | Fase solar (início) | Fase lunar (fim) |
|---|---|---|
| Cores | sol, dourado, vermelho, claros, bege | noite, escuro, céu estrelado, vermelho |
| Conceitos | natureza, vida, abertura, acolhimento | lua, introspecção, mistério, intuição |
| Elementos | sol, folhagem, flores, luz | lua, estrelas, velas, lanternas |
| Constante | azul-turquesa | azul-turquesa |

### Identidade

- **Nome no site:** Mariana Dayrell.
- **Marca:** o próprio nome dela.
- **Tipografia:** precisa trazer **misticidade, seriedade e acalento**. As fontes são escolhidas na fase de design.
- **Domínio:** será criado depois que o site estiver pronto.

## Público-alvo

- Pessoas que têm **abertura para receber uma tiragem**.
- Atendimento **100% online**. Ela é de **Minas Gerais**, mas atende de qualquer lugar.
- Fuso de referência da agenda: horário de Brasília (`America/Sao_Paulo`).

## Proposta de valor

- Uma tiragem que acolhe: **tarô + respiração e relaxamento do Kundalini Yoga**. A pessoa não recebe só uma resposta, ela sai mais centrada.
- Rascunho do texto em `docs/conteudo-inicial.md`. A Mari revisa e edita no painel.

## A consulta

- **Formato:** a Mari faz a tiragem e envia pelo WhatsApp **um áudio de 10 a 15 minutos** com a leitura, mais **a foto das cartas** tiradas.
- Não há chamada ao vivo: a consulta é **assíncrona**.
- **Onde entra o yoga:** o áudio começa com uma **respiração guiada curta** do Kundalini Yoga, para a pessoa ouvir a leitura num estado mais calmo.
- **Etapas:** a pessoa escolhe um horário → a Mari confirma e combina o pagamento no WhatsApp → no dia, a Mari faz a tiragem e envia o áudio e a foto.

## Páginas e seções do site

O site público é uma página só. A ordem acompanha a passagem do sol para a lua. Todos os textos e imagens podem ser editados no painel.

| # | Seção | Fase | Conteúdo | Status |
|---|---|---|---|---|
| 1 | Abertura (hero) | Solar | Nome, uma frase de impacto e chamada para agendar | Rascunho pronto |
| 2 | Quem sou | Solar | Foto, relação com o tarô e com o Kundalini Yoga | Rascunho pronto, faltam detalhes da história dela |
| 3 | Citações e frases | Solar → crepúsculo | Frases dela e de autores (ver "Citações") | 1 frase recebida |
| 4 | O baralho | Crepúsculo | "O Lendário Tarot das Bruxas": arte inspirada nele e fotos do baralho dela | Ver "Sobre o baralho" |
| 5 | A consulta | Lunar | O que é, como tarô e yoga se unem, o que a pessoa recebe | Rascunho pronto |
| 6 | Como funciona | Lunar | Passo a passo, do horário ao áudio | Rascunho pronto |
| 7 | Agendamento | Lunar | Agenda com os horários livres | Ver "Agendamento inteligente" |
| 8 | Depoimentos | Lunar | Feedbacks que ela adiciona pelo painel. A seção some quando não há nenhum. | — |
| 9 | Perguntas frequentes | Lunar | FAQ (também serve ao GEO) | Rascunho pronto |
| 10 | Contato | Noite plena | WhatsApp e Instagram | Número: depois (campo pronto no painel) |
| 11 | Rodapé | Noite plena | Créditos, política de privacidade, termos e cookies | Rascunhos jurídicos a revisar |

Fora do scroll público ficam:
- `/login`: entrada dela no painel.
- `/admin`: o painel completo.
- `/privacidade` e `/termos`: textos jurídicos.

## Funcionalidades

| Funcionalidade | Quem usa | Exige login | Pago |
|---|---|---|---|
| Ver a página inteira | Visitante | — | — |
| Ver horários livres e pedir agendamento | Visitante | Não | Não (o pagamento é combinado no WhatsApp) |
| Falar pelo WhatsApp ou Instagram (link direto) | Visitante | — | — |
| Painel completo | Mari (administradora) | Sim, com papel `admin` verificado no servidor | — |

### Painel da administradora

Ela tem total liberdade para alterar e personalizar o site. O painel edita:
- **Conteúdo de todas as seções:** textos, títulos, frases, foto e imagens.
- **Citações:** adicionar, editar, reordenar e remover, sempre com o autor.
- **Depoimentos:** adicionar, editar, esconder e remover.
- **FAQ:** perguntas e respostas.
- **Agenda:**
  - dias e horários disponíveis;
  - duração de cada horário;
  - bloqueio de datas;
  - pedidos recebidos (pendente → confirmado → realizado / cancelado);
  - **remarcar e cancelar** pedidos (é ela quem faz as alterações).
- **Consulta:** descrição e valor exibido (ou "valor sob consulta").
- **Contatos:** número do WhatsApp, @ do Instagram (`@maarianadayrell`, hoje desativado) e mensagem pré-preenchida. Os campos já ficam prontos. Enquanto estiverem vazios, os botões não aparecem.
- **SEO:** título, descrição e imagem de compartilhamento.
- **Personalização visual:** ela escolhe entre **variações prontas de cor e de fonte**, já testadas em contraste AA. Não há seletor de cor livre.
- **Google Agenda:** liga e desliga a sincronização (ver abaixo).

### Agendamento inteligente

1. A Mari define a disponibilidade no painel.
2. A visitante vê só os horários livres, no fuso dela, e escolhe um.
3. Ela informa nome, WhatsApp e, se quiser, a intenção da tiragem. Marca o consentimento LGPD com a finalidade descrita.
4. O horário fica **reservado como "pendente"**, para que ninguém mais o pegue.
5. O WhatsApp abre com uma mensagem pronta ("Olá, Mari! Reservei [data/hora]...").
6. A Mari combina o pagamento no WhatsApp e **confirma no painel**. Se não confirmar em **2 horas**, o horário volta a ficar livre.
7. **Lembretes e avisos:**
   - **Pelo painel, sem API paga de WhatsApp.**
   - **A Mari** recebe um e-mail a cada novo pedido e, no dia, um e-mail para confirmar as consultas com cada cliente.
   - No painel, a tela **"Hoje"** lista as consultas do dia. Cada uma tem botões que abrem o WhatsApp da cliente com a mensagem pronta:
     - lembrete;
     - confirmação;
     - remarcação;
     - cancelamento.
   - A Mari só aperta enviar. O painel marca o que já foi enviado.
   - O texto das mensagens prontas é editável no painel.
   - O formulário não pede e-mail da cliente.
8. **Google Agenda:** sincronização opcional. A Mari liga no painel se quiser. Ligada, as consultas confirmadas entram na agenda dela e os horários ocupados lá ficam bloqueados no site.
9. **Remarcação e cancelamento:** a cliente pede pelo WhatsApp e a Mari altera no painel.

- A visitante não precisa criar conta.

## Modelo de pagamento

- A consulta é **cobrada**, por um valor justo.
- O pagamento é feito **pelo WhatsApp, direto com ela** (Pix ou como ela combinar). **Não há checkout no site** e o Stripe não será usado por enquanto.
- **Estimativa de valor** (para ela decidir): **R$ 40 a R$ 80** por tiragem com áudio de 10 a 15 minutos e foto das cartas.
  - Base: anúncios brasileiros de tiragens curtas por mensagem ficam por volta de R$ 13 a R$ 50.
  - O acolhimento e a respiração guiada justificam ficar acima disso.
  - Sessões terapêuticas longas e ao vivo chegam a R$ 170.
- No site, o valor pode aparecer fixo ou como "sob consulta". Ela escolhe no painel.

## Tom de voz

- **Primeira pessoa:** "eu te recebo", "a gente olha junto para as cartas".
- Direção: alma, mistério, misticidade, magia, potência, vibe bruxesca e natureza. Sempre acolhedor.
- **Vocabulário:** palavras bruxescas explícitas ("bruxa", "feitiço", "magia") misturadas com termos sutis (intuição, ciclos, natureza, energia), **bem dosadas**.
- Mistério sem medo: nada de ameaça, fatalismo ou promessa de prever o futuro com certeza.
- Acolhimento antes da técnica: o foco é a pessoa, não a carta.

## Citações

Citações de terceiros sempre com o nome do autor e, quando houver, a fonte. Só entram citações com autoria verificada ou informada por vocês.

| Frase | Autoria | Status |
|---|---|---|
| "Que a sua autonomia seja sempre um ritual: silencioso, constante e irreversível." | Sara Koimbra | Entra no site com o crédito, sem link de fonte (decisão tomada) |
| Frases da Mari | Mari | Ela escreve depois, pelo painel |
| Frases da Prem Ras Kaur | Prem Ras Kaur | **Não achei nenhuma citação direta verificável** (ver abaixo) |

- **Prem Ras Kaur:**
  - A pesquisa encontrou o Instagram, o canal no YouTube e um episódio do podcast Yoga Break, mas nenhum texto com falas dela entre aspas.
  - A frase da bio dela ("Te ensino Yoga de verdade, pela Alma") é uma autodescrição, não uma citação para o site.
  - Para ter frases dela, alguém precisa tirá-las dos vídeos ou posts dela, com o link de origem. A Mari pode adicioná-las depois pelo painel.
- **Einstein:** fora do site (decisão tomada).

## Perguntas frequentes

Respostas em rascunho em `docs/conteudo-inicial.md`. Tudo é editável no painel.

1. Preciso acreditar em tarô para fazer uma tiragem?
2. Como funciona a tiragem online?
3. O que eu recebo?
4. Como entra a respiração do Kundalini Yoga? Preciso saber yoga?
5. Preciso preparar alguma coisa antes?
6. Como agendo e como pago?
7. Posso remarcar ou cancelar?
8. O tarô prevê o futuro?
9. O que eu conto fica entre nós?
10. A tiragem substitui terapia ou acompanhamento médico? (Resposta obrigatória: **não**.)

## Referências visuais

### Imagens (em `docs/referencias/`)

| Arquivo | O que mostra |
|---|---|
| `caixa-e-cartas-ambiente.jpg` | Caixa do baralho e as cartas A Força (8), A Enforcada (12) e A Louca (22) sobre uma mesa com velas, cristais, bola de cristal, caldeirão e lavanda |
| `carta-frente-verso.jpg` | O Eremita (9) de frente e o verso das cartas. Cartas de 11 × 7 cm, 78 cartas, plastificadas |
| `cartas-arcanos-maiores-0-7.jpg` | O Mago, A Sacerdotisa, A Imperatriz, O Imperador, O Hierofante, Os Enamorados, O Carro e o verso |
| `foto-tarologa.jpg` | Mari: cabelo longo ondulado, tatuagem de mandala no colo, blazer escuro. **Uso autorizado por ela.** |

- Outras fotos dela: ainda não há.
- Instagram dela (@maarianadayrell): desativado no momento.

### A estética das cartas (base visual do site)

- **Estilo de ilustração:** livro de contos de fadas, pintura detalhada e quente, quase aquarela. Folk, pagão, natural.
- **Elementos recorrentes:** halos dourados, luas crescentes, lanternas, cajados, chapéus de bruxa, gato preto, leão, ervas e flores (lavanda, dedaleira), árvores retorcidas, pentagrama, vinhas de hera.
- **Verso das cartas:** fundo creme/pergaminho com vinhas de hera verde-oliva em simetria espelhada e um pentagrama de galhos ao centro. É ornamental e simétrico, o que conversa com o art déco.
- **Moldura das cartas:** número num selo redondo no canto superior esquerdo e nome numa faixa de pergaminho na base. Tipografia serifada clássica em caixa alta.
- **Arcanos no feminino:** A Louca, A Enforcada, A Força com uma mulher e um leão.
- **Paleta observada:** verde-oliva e musgo, bege e pergaminho, dourado e âmbar, marrom de madeira, lavanda e violeta, azul de crepúsculo, pontos de vermelho.

### Ancestral + Y2K sutil

- A base é **ancestral/milenar**: a estética das cartas, ornamento, natureza, simetria art déco.
- Por cima vem um **toque sutil de Y2K anos 2000**: brilhos e reflexos (estrelas cintilantes, gradientes iridescentes discretos, pequenos efeitos cromados ou holográficos) usados como detalhe, nunca como estética dominante.
- Proposta: o Y2K fica mais presente na fase lunar (estrelas, brilho da lua) e quase ausente na solar.

### Sobre o baralho

- **Nome:** "O Lendário Tarot das Bruxas".
- **Ficha:**
  - 78 cartas: 22 Arcanos Maiores e 56 Arcanos Menores;
  - plastificadas, 11 × 7 cm;
  - livreto com o significado de cada carta;
  - em algumas edições, QR Code para conteúdo de apoio.
- **Autoria: não identificada.**
  - Os anúncios do "Lendário" (Mercado Livre, Shopee, Amazon, Studio Orion, Aydala, Cultura Zen, Donna7) não citam autora, ilustrador nem editora.
  - Na Amazon, a ficha diz marca "Genérico" e fabricante "artesanal".
  - Alguns anúncios usam o texto de outro produto ("Baralho 78 Cartas das Bruxas AYA MYSTIC").
- **Não é o de Ellen Dugan e Mark Evans.**
  - As informações sobre Dugan e Evans que você encontrou são do **"Tarô das Bruxas"** (*Witches Tarot*, Llewellyn 2012; no Brasil pela Editora Isis e pela Folhas de Luz). É outro produto, vendido com livro.
  - A arte de Mark Evans é **digital, feita a partir de fotos posadas**. As cartas da Mari são **pintadas, em estilo conto de fadas**, com arcanos no feminino ("A Louca" numerada 22, "A Enforcada").
  - Por isso, **o site não credita Dugan nem Evans**. O baralho aparece só pelo nome, sem autoria.
- **Uso das imagens no site:**
  - Como não se sabe quem tem os direitos das ilustrações, o site **não reproduz a arte das cartas**: nem as fotos dos anúncios, nem digitalizações.
  - O baralho aparece de duas formas:
    1. **arte original** criada para o site, inspirada no estilo (ver abaixo);
    2. **fotos do baralho físico da Mari**, em uso, mostrando o objeto. Como o site é surpresa, elas entram depois, pelo painel.

### Como a arte do site será feita

Nada copiado das cartas. Tudo com origem e licença registradas em `docs/creditos-imagens.md`.

1. **Ornamentos vetoriais próprios (SVG):**
   - molduras art déco, vinhas de hera em simetria espelhada e selos numerados no estilo das cartas;
   - sol, lua crescente, estrelas, pentagrama de galhos.
   - São a "assinatura" visual do site e animam bem com o scroll.
2. **Gravuras antigas de domínio público:**
   - ilustrações botânicas, mapas celestes e gravuras de alquimia e astronomia;
   - fontes: Wikimedia Commons, Biodiversity Heritage Library, The Met Open Access, entre outras;
   - viram colagens surrealistas, tingidas na paleta solar ou lunar. Isso dá o lado **ancestral/milenar** com material real.
3. **Camada Y2K sutil (CSS/WebGL leve):** cintilação de estrelas, reflexo iridescente na lua e brilho cromado discreto nos ornamentos dourados. Desligada com `prefers-reduced-motion`.
4. **Fotos da Mari:** a foto autorizada agora; outras fotos e as fotos do baralho depois, pelo painel.

## O que o site NÃO deve ser

- Com cara de Bootstrap ou template genérico.
- Site de "vidente" sensacionalista: néon roxo, bolas de cristal piscando, promessas de "amarração" ou de prever o futuro com certeza.
- Y2K escancarado: o Y2K é tempero, não prato principal.
- Escuro do começo ao fim: a abertura é **solar**, e a noite chega com o scroll.
- Assustador ou de terror: o mistério é acolhedor.
- Uma loja: não há checkout no site, e a visitante não precisa criar conta.
- Um lugar que reproduza ilustrações sem autorização ou use citações com autoria errada.
