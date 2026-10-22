# PRODUTO.md

O que é o site, para quem é e o que ele precisa transmitir. Regras técnicas em `CLAUDE.md`.
Tudo marcado **A DEFINIR** depende de uma resposta e não deve ser inventado.

---

## Visão geral e propósito

- Site profissional de apresentação do trabalho de cartomancia de **Mariana Dayrell**, taróloga.
- É um presente de um amigo. Ela ainda não decidiu se vai atuar profissionalmente na área. Por isso o site é simples para quem visita, mas dá a ela **autonomia total** para mudar tudo sozinha pelo painel.
- A consulta une a leitura de tarô ao acolhimento e às práticas de **Kundalini Yoga** (respiração e relaxamento), que ela estuda e pratica com a professora **Prem Ras Kaur** (linha Yoga Prem).
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

- Uma consulta de tarô que acolhe: **tarô + respiração e relaxamento do Kundalini Yoga**. A pessoa não recebe só uma resposta, ela sai mais centrada.
- Texto final: A DEFINIR, de preferência com as palavras dela. Pode ser editado no painel.

## Páginas e seções do site

O site público é uma página só. A ordem acompanha a passagem do sol para a lua. Todos os textos e imagens podem ser editados no painel.

| # | Seção | Fase | Conteúdo | Status |
|---|---|---|---|---|
| 1 | Abertura (hero) | Solar | Nome, uma frase de impacto e chamada para agendar | Frase: A DEFINIR |
| 2 | Quem sou | Solar | Foto, história, relação com o tarô e com o Kundalini Yoga | Foto: autorizada. Texto: A DEFINIR |
| 3 | Citações e frases | Solar → crepúsculo | Frases dela e de autores (ver "Citações") | Lista: A DEFINIR |
| 4 | O baralho | Crepúsculo | "O Lendário Tarot das Bruxas": cartas em destaque, frente e verso | Ver "Sobre o baralho" |
| 5 | A consulta | Lunar | O que é e como tarô e yoga se unem | Detalhes em aberto (ela ainda não definiu) |
| 6 | Como funciona | Lunar | Escolher o horário → confirmar pelo WhatsApp → pagar → consulta online | Etapas finais: A DEFINIR |
| 7 | Agendamento | Lunar | Agenda com os horários livres (ver "Agendamento inteligente") | Proposta abaixo |
| 8 | Depoimentos | Lunar | Feedbacks que ela adiciona pelo painel. A seção some quando não há nenhum. | — |
| 9 | Perguntas frequentes | Lunar | FAQ (também serve ao GEO) | Proposta abaixo |
| 10 | Contato | Noite plena | WhatsApp e Instagram | Número: A DEFINIR |
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
| Painel completo | Mariana (administradora) | Sim, com papel `admin` verificado no servidor | — |

### Painel da administradora

Ela precisa ter total liberdade para alterar e personalizar o site. Proposta do que o painel edita:
- **Conteúdo de todas as seções:** textos, títulos, frases, foto e imagens das cartas.
- **Citações:** adicionar, editar, reordenar e remover, sempre com o autor.
- **Depoimentos:** adicionar, editar, esconder e remover.
- **FAQ:** perguntas e respostas.
- **Agenda:**
  - dias e horários disponíveis;
  - duração da consulta;
  - bloqueio de datas;
  - pedidos recebidos (pendente → confirmado → realizado / cancelado).
- **Consulta:** descrição, duração e valor exibido (ou "valor sob consulta").
- **Contatos:** número do WhatsApp, @ do Instagram e mensagem pré-preenchida.
- **SEO:** título, descrição e imagem de compartilhamento.
- **Personalização visual:** A DEFINIR até onde vai (ver perguntas). Proposta: escolher entre variações prontas de cor e de fonte, já testadas em contraste, para ela não quebrar a acessibilidade sem querer.

### Agendamento inteligente (proposta)

1. Mariana define a disponibilidade no painel.
2. A visitante vê só os horários livres, no fuso dela, e escolhe um.
3. Ela informa nome, WhatsApp e, se quiser, a intenção da consulta. Marca o consentimento LGPD com a finalidade descrita.
4. O horário fica **reservado como "pendente"**, para que ninguém mais o pegue.
5. O WhatsApp abre com uma mensagem pronta ("Olá, Mariana! Reservei [data/hora]...").
6. Mariana combina o pagamento no WhatsApp e **confirma no painel**. Se não confirmar, o horário volta a ficar livre depois de **A DEFINIR** horas.
7. Lembretes e sincronização com Google Agenda: A DEFINIR.

- A visitante não precisa criar conta.
- A plataforma da consulta (WhatsApp vídeo, Google Meet etc.): A DEFINIR.

## Modelo de pagamento

- A consulta é **cobrada**, por um valor justo.
- O pagamento é feito **pelo WhatsApp, direto com ela** (Pix ou como ela combinar). **Não há checkout no site** e o Stripe não será usado por enquanto.
- **Estimativa de valor** (para ela decidir): **R$ 80 a R$ 150** por sessão online de 45 a 60 minutos com tiragem e prática de respiração.
  - A referência é frágil: anúncios brasileiros vão de cerca de R$ 13 (poucas perguntas) a R$ 170 (sessões terapêuticas mais longas).
  - Quem está começando costuma ficar na parte de baixo da faixa.
- No site, o valor pode aparecer fixo ou como "sob consulta". Ela escolhe no painel.

## Tom de voz

- **Primeira pessoa:** "eu te recebo", "a gente olha junto para as cartas".
- Direção: alma, mistério, misticidade, magia, potência, vibe bruxesca e natureza. Sempre acolhedor.
- **Vocabulário:** palavras bruxescas explícitas ("bruxa", "feitiço", "magia") misturadas com termos sutis (intuição, ciclos, natureza, energia), **bem dosadas**.
- Mistério sem medo: nada de ameaça, fatalismo ou promessa de prever o futuro com certeza.
- Acolhimento antes da técnica: o foco é a pessoa, não a carta.

## Citações

Citações de terceiros sempre com o nome do autor e, quando houver, a fonte.

- **Frases da Mariana:** A DEFINIR (lista dela).
- **Sara Koimbra** (taróloga, astróloga e ocultista): quais frases? A DEFINIR, com a fonte.
- **Einstein, "tudo é energia":**
  - A frase conhecida ("Tudo é energia, e isso é tudo o que existe...") **não é dele**. Pesquisadores rastrearam o texto até o canalizador Darryl Anka ("Bashar").
  - Atribuí-la a Einstein seria um erro que visitantes podem apontar.
  - Opções:
    - (a) usar uma ideia que ele realmente disse: que massa e energia são manifestações diferentes da mesma coisa;
    - (b) usar a frase sem atribuir a Einstein.
  - Decisão: A DEFINIR.

## Perguntas frequentes (proposta)

Perguntas escolhidas por mim. As respostas precisam vir dela. Tudo editável no painel.

1. Preciso acreditar em tarô para fazer uma consulta?
2. Como funciona a consulta online?
3. Onde acontece a consulta (vídeo, chamada, áudio)?
4. Quanto tempo dura?
5. Como entra a prática de respiração e relaxamento? Preciso saber yoga?
6. Preciso preparar alguma coisa antes (lugar calmo, perguntas)?
7. Como agendo e como pago?
8. Posso remarcar ou cancelar?
9. O tarô prevê o futuro?
10. O que eu conto na consulta fica entre nós?
11. A consulta substitui terapia ou acompanhamento médico?
    - Resposta obrigatória: **não**. É uma prática de autoconhecimento e acolhimento.

## Referências visuais

### Imagens (em `docs/referencias/`)

| Arquivo | O que mostra |
|---|---|
| `caixa-e-cartas-ambiente.jpg` | Caixa do baralho e as cartas A Força (8), A Enforcada (12) e A Louca (22) sobre uma mesa com velas, cristais, bola de cristal, caldeirão e lavanda |
| `carta-frente-verso.jpg` | O Eremita (9) de frente e o verso das cartas. Cartas de 11 × 7 cm, 78 cartas, plastificadas |
| `cartas-arcanos-maiores-0-7.jpg` | O Mago, A Sacerdotisa, A Imperatriz, O Imperador, O Hierofante, Os Enamorados, O Carro e o verso |
| `foto-tarologa.jpg` | Mariana: cabelo longo ondulado, tatuagem de mandala no colo, blazer escuro. **Uso autorizado por ela.** |

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
- Onde o Y2K aparece: A DEFINIR na fase de design. Proposta: mais presente na fase lunar (estrelas, brilho da lua) e quase ausente na solar.

### Sobre o baralho

- **Nome:** "O Lendário Tarot das Bruxas", 78 cartas plastificadas, manual físico e digital.
- **Autoria informada:** Ellen Dugan, com ilustrações de Mark Evans.
- **⚠ Divergência a confirmar antes de publicar os créditos:**
  - O "Witches Tarot" de Dugan e Evans (Llewellyn, 2012; no Brasil, "Tarô das Bruxas", Editora Isis) tem **arte digital feita a partir de fotos posadas**.
  - As cartas das imagens de referência têm **ilustração pintada, estilo conto de fadas**, e arcanos no feminino ("A Louca" com número 22, "A Enforcada"). É um estilo diferente.
  - A caixa da foto não mostra o nome de autores.
  - Pode ser uma edição diferente ou outro baralho. Vale a Mariana conferir a caixa e o manual.
  - Até lá, a linha de créditos fica **A DEFINIR**.
- **Uso das imagens no site** (vocês escolheram os dois):
  - fotos próprias do baralho dela, em uso, mostrando o objeto (o mais seguro);
  - ilustrações originais inspiradas no estilo, sem copiar as cartas.
- As fotos do anúncio de marketplace **não** vão para o site.

## O que o site NÃO deve ser

- Com cara de Bootstrap ou template genérico.
- Site de "vidente" sensacionalista: néon roxo, bolas de cristal piscando, promessas de "amarração" ou de prever o futuro com certeza.
- Y2K escancarado: o Y2K é tempero, não prato principal.
- Escuro do começo ao fim: a abertura é **solar**, e a noite chega com o scroll.
- Assustador ou de terror: o mistério é acolhedor.
- Uma loja: não há checkout no site, e a visitante não precisa criar conta.
- Um lugar que use ilustrações sem autorização ou citações com autoria errada.
