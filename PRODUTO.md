# PRODUTO.md

O que é o site, para quem é e o que ele precisa transmitir. Regras técnicas em `CLAUDE.md`.
Tudo marcado **A DEFINIR** depende de uma resposta e não deve ser inventado.

---

## Visão geral e propósito

- Site profissional de apresentação do trabalho de cartomancia de uma taróloga.
- É um presente de um amigo. Ela ainda não decidiu se vai atuar profissionalmente na área, então o site é **simples e de baixo compromisso**: apresenta quem ela é e o que ela oferece, sem estrutura de negócio pesada.
- A consulta junta a leitura de tarô com acolhimento e práticas de respiração e relaxamento do yoga. Ela tem formação em **Yoga Prem**.
- Formato: **uma página só (one-page), em scroll**.
- Ideia central da experiência: o site abre **solar** (dia) e, conforme a pessoa rola, vira **lunar** (noite). Uma linha **azul-turquesa** atravessa a página inteira e liga as duas fases.

- **Nome da taróloga:** A DEFINIR. O repositório se chama `marianacartomancia`, o que sugere "Mariana", mas falta confirmar o nome e a grafia usados publicamente.
- **Nome da marca / do site:** A DEFINIR (ex.: o nome dela, "Mariana Cartomancia", outro).
- **Domínio:** A DEFINIR.

## Público-alvo

- A DEFINIR. Falta saber:
  - Quem ela quer atender: pessoas que já conhecem tarô ou iniciantes curiosos? Faixa etária?
  - Atendimento online, presencial ou os dois? Em qual cidade ou região?
- Suposição a confirmar: pessoas em busca de autoconhecimento e acolhimento, abertas a espiritualidade e práticas holísticas.

## Proposta de valor

- Uma leitura de tarô que vai além da previsão: **acolhimento + tarô + respiração e relaxamento do yoga**. A pessoa sai mais centrada, não só com uma resposta.
- Texto final da proposta de valor: A DEFINIR, de preferência com as palavras dela.

## Páginas e seções do site

Uma página só. A ordem abaixo é uma **proposta** e acompanha a passagem do sol para a lua:

| # | Seção | Fase | Conteúdo | Status |
|---|---|---|---|---|
| 1 | Abertura (hero) | Solar | Nome, uma frase de impacto e chamada para a consulta | Frase: A DEFINIR |
| 2 | Quem ela é | Solar | Foto, história, relação com o tarô e com o Yoga Prem | Texto: A DEFINIR |
| 3 | Citações e frases | Solar → crepúsculo | Frases sobre tarô, intuição e natureza | Frases: A DEFINIR (dela ou de autores, com crédito) |
| 4 | O baralho | Crepúsculo | Apresentação de "O Lendário Tarot das Bruxas", cartas em destaque, frente e verso | Ver nota em "Referências visuais" |
| 5 | A consulta | Lunar | O que é, como tarô e yoga se unem, o que a pessoa leva da sessão | Detalhes: A DEFINIR |
| 6 | Como funciona | Lunar | Passo a passo: contato → agendamento → consulta → depois | Detalhes: A DEFINIR |
| 7 | Feedbacks | Lunar | Espaço para depoimentos futuros. Começa vazio ou escondido. | Forma de adicionar: A DEFINIR |
| 8 | Perguntas frequentes | Lunar | FAQ (também atende ao requisito de GEO) | Perguntas e respostas: A DEFINIR |
| 9 | Contatos | Noite plena | Canais de contato e redes | Canais: A DEFINIR |
| 10 | Rodapé | Noite plena | Créditos, política de privacidade, termos, cookies | Rascunhos jurídicos a revisar |

## Funcionalidades

| Funcionalidade | Público | Exige login | Pago |
|---|---|---|---|
| Ver todo o conteúdo da página | ✅ | — | — |
| Entrar em contato (link / formulário) | ✅ | — | — |
| Ver feedbacks publicados | ✅ | — | — |
| Adicionar e editar feedbacks | — | A DEFINIR | — |
| Agendar consulta pelo site | A DEFINIR | A DEFINIR | A DEFINIR |
| Pagar consulta pelo site | A DEFINIR | A DEFINIR | A DEFINIR |

- **Feedbacks "que ela pode adicionar depois":** A DEFINIR como.
  - Opções: (a) ela manda o texto e alguém publica no código; (b) uma área admin simples com login (Supabase); (c) uma planilha ou CMS externo.
  - A opção (b) é a única que exige login e área admin no site.
- **Contato:** A DEFINIR. Pode ser um link direto (WhatsApp/Instagram) ou um formulário. O formulário exige consentimento LGPD e proteção contra spam.

## Modelo de pagamento

- A DEFINIR. O `CLAUDE.md` prevê Stripe, mas a ideia descrita é um site simples de apresentação.
- Falta saber:
  - A consulta é cobrada? Qual o valor?
  - O pagamento acontece no site (Stripe) ou fora dele (Pix/combinado pelo WhatsApp)?
- Enquanto não houver decisão, o site **não** terá checkout nem login de cliente.

## Tom de voz

- Direção: **alma, mistério, misticidade, magia, potência, vibe bruxesca e natureza**, sempre acolhedor.
- Proposta a confirmar:
  - Tratamento: "você". Frases curtas, sensoriais, ligadas à natureza (sol, lua, ervas, raízes, fogo, água).
  - Mistério sem medo: nada de ameaça, fatalismo ou promessa de prever o futuro com certeza.
  - Acolhimento antes da técnica: o foco é a pessoa, não a carta.
- Pendências:
  - Primeira pessoa ("eu te recebo...") ou terceira ("Mariana te recebe...")? A DEFINIR.
  - Vocabulário bruxesco explícito ("bruxa", "feitiço") ou mais sutil? A DEFINIR.

## Referências visuais

### Imagens (em `docs/referencias/`)

| Arquivo | O que mostra |
|---|---|
| `caixa-e-cartas-ambiente.jpg` | Caixa do baralho, cartas A Força (8), A Enforcada (12) e A Louca (22) sobre uma mesa com velas, cristais, bola de cristal, caldeirão e lavanda |
| `carta-frente-verso.jpg` | O Eremita (9) de frente e o verso das cartas. Cartas de 11 × 7 cm, 78 cartas, plastificadas |
| `cartas-arcanos-maiores-0-7.jpg` | O Mago, A Sacerdotisa, A Imperatriz, O Imperador, O Hierofante, Os Enamorados, O Carro e o verso |
| `foto-tarologa.jpg` | Foto da taróloga: cabelo longo ondulado, tatuagem de mandala no colo, blazer escuro |

### A estética das cartas (base visual do site)

- **Estilo de ilustração:** livro de contos de fadas, pintura detalhada e quente, quase aquarela. Folk, pagão, natural.
- **Elementos recorrentes:** halos dourados, luas crescentes, lanternas, cajados, chapéus de bruxa, gato preto, leão, ervas e flores (lavanda, dedaleira), árvores retorcidas, pentagrama, vinhas de hera.
- **Verso das cartas:** fundo creme/pergaminho com vinhas de hera verde-oliva em simetria espelhada e um pentagrama de galhos ao centro. É ornamental e simétrico, o que conversa com a influência art déco.
- **Moldura das cartas:** número num selo redondo no canto superior esquerdo e o nome numa faixa de pergaminho na base. Tipografia serifada clássica em caixa alta.
- **Arcanos no feminino:** A Louca, A Enforcada, A Força com uma mulher e um leão. O baralho tem protagonismo feminino.
- **Paleta observada:** verde-oliva e musgo, bege e pergaminho, dourado e âmbar, marrom de madeira, lavanda e violeta, azul de crepúsculo, pontos de vermelho (vestido da Imperatriz).

### Paleta do site (pedido)

- **Fase solar:** sol, dourado, vermelho, cores claras, bege, natureza.
- **Fase lunar:** noite, lua, céu estrelado, introspecção, escuro, vermelho.
- **Fio condutor:** azul-turquesa atravessando o site inteiro.

### Sobre o baralho

- Nome: "O Lendário Tarot das Bruxas", 78 cartas plastificadas, manual físico e digital (segundo o anúncio).
- A pesquisa não encontrou editora nem ilustrador oficial. Só apareceram anúncios em marketplaces (Mercado Livre, Shopee).
- Não confundir com o "Tarô das Bruxas" de Ellen Dugan e Mark Evans (Editora Isis), que é outro baralho, com outra arte.
- **Direitos das imagens:** as ilustrações têm dono (ilustrador ou editora) que ainda não sabemos quem é. As fotos do anúncio não devem ir para o site. Alternativas, A DEFINIR:
  - fotos próprias do baralho dela, em uso (o mais seguro: mostrar o objeto, não reproduzir a arte inteira em alta resolução);
  - ilustrações originais inspiradas no estilo, sem copiar as cartas.

### Links

- A DEFINIR: Instagram ou perfis dela, sites de referência de que vocês gostem.

## O que o site NÃO deve ser

- Com cara de Bootstrap ou template genérico.
- Site de "vidente" sensacionalista: néon roxo, bolas de cristal piscando, promessas de "amarração" ou de prever o futuro com certeza.
- Pesado, com loja, login e cadastro obrigatório sem necessidade. Ela não tem pretensão comercial grande.
- Escuro do começo ao fim: a abertura é **solar**, e a noite chega com o scroll.
- Assustador ou sombrio no sentido de terror: o mistério é acolhedor.
- Um lugar que use as ilustrações do baralho sem autorização.
