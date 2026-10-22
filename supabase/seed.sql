-- GERADO por src/lib/conteudo/seed.ts a partir de src/content/conteudo-inicial.ts.
-- Não edite à mão: rode `UPDATE_SEED=1 npx vitest run seed`.

insert into public.site_settings (nome, papel, regiao, whatsapp, instagram, instagram_ativo)
values
  ('Mariana Dayrell', 'Taróloga', 'Minas Gerais, Brasil', '', 'maarianadayrell', false)
on conflict (id) do nothing;

insert into public.sections (key, position, content)
select v.key::public.secao, v.position, v.content::jsonb
from (values
  ('abertura', 0, '{"frase":"As cartas falam baixinho. Eu te ajudo a escutar.","apoio":"Tiragens de tarô online com acolhimento e respiração do Kundalini Yoga.","acao":"Quero minha tiragem","fatos":["Tarô e acolhimento","100% online","Minas Gerais"]}'),
  ('quem_sou', 1, '{"titulo":"Quem sou","paragrafos":["Eu sou a Mari, Mariana Dayrell, mineira, e o tarô é o meu jeito de conversar com o que a gente sente, mas ainda não conseguiu dizer.","Leio as cartas com calma e com respeito. Para mim, uma tiragem não é sentença: é um espelho, um convite para olhar com mais carinho para o próprio caminho.","Também estudo e pratico Kundalini Yoga com a minha professora, Prem Ras Kaur. Foi no yoga que eu aprendi que a respiração muda tudo: acalma o corpo, abre espaço e deixa a intuição chegar. Por isso, nas minhas tiragens, as duas coisas andam juntas."],"historia":"","assinatura":"Mariana Dayrell"}'),
  ('citacoes', 2, '{"titulo":"Palavras que me acompanham"}'),
  ('baralho', 3, '{"titulo":"O Lendário Tarot das Bruxas","paragrafos":["São 78 cartas, 22 Arcanos Maiores e 56 Arcanos Menores, cheias de natureza, ervas, luas e mulheres sábias. Gosto desse baralho porque ele fala a língua das bruxas antigas: a do ciclo, da terra e da intuição.","Nele, a Louca caminha com o seu gato preto, a Força abraça um leão, e o Eremita ilumina a montanha com uma lanterna. Cada carta é uma história, e cada história pode ser a sua."],"cartas":[{"numeral":"I","nome":"O Mago"},{"numeral":"II","nome":"A Sacerdotisa"},{"numeral":"III","nome":"A Imperatriz"},{"numeral":"VIII","nome":"A Força"},{"numeral":"IX","nome":"O Eremita"},{"numeral":"XII","nome":"A Enforcada"},{"numeral":"XXII","nome":"A Louca"}]}'),
  ('consulta', 4, '{"titulo":"Uma tiragem que acolhe","paragrafos":["Você me conta o que está pedindo atenção na sua vida. Pode ser uma pergunta, uma dúvida ou só um sentimento que não quer calar.","Eu preparo o espaço, respiro, embaralho e tiro as cartas para você. No começo do áudio, eu te guio numa respiração curta do Kundalini Yoga, para você receber a leitura com o corpo calmo e o coração aberto."],"fatos":[{"valor":"10 a 15 min","explicacao":"de áudio com a leitura, no meu tempo e com cuidado"},{"valor":"A foto","explicacao":"das cartas que saíram, para você guardar e voltar a elas"},{"valor":"Respiração","explicacao":"guiada do Kundalini Yoga no começo do áudio"},{"valor":"100% online","explicacao":"pelo WhatsApp, de onde você estiver"}]}'),
  ('como_funciona', 5, '{"titulo":"Como funciona","passos":[{"titulo":"Você escolhe um horário","texto":"Veja na agenda os horários livres e reserve o seu."},{"titulo":"A gente conversa","texto":"Seu pedido chega para mim no WhatsApp, e a gente combina os detalhes e o pagamento."},{"titulo":"Eu tiro as suas cartas","texto":"No dia marcado, preparo o espaço e faço a sua tiragem com calma."},{"titulo":"Você recebe o áudio","texto":"O áudio e a foto chegam para você ouvir num lugar tranquilo, sem pressa."}]}'),
  ('agendamento', 6, '{"titulo":"Reserve o seu horário","texto":"Seu horário fica guardado por 2 horas enquanto a gente confirma pelo WhatsApp.","campos":{"nome":"Seu nome","whatsapp":"Seu WhatsApp (com DDD)","intencao":"O que você quer olhar nas cartas? (opcional)"},"consentimento":"Autorizo o uso do meu nome e WhatsApp para a Mari entrar em contato sobre esta tiragem, conforme a Política de Privacidade.","botao":"Reservar e falar com a Mari","aviso":"A agenda abre em breve."}'),
  ('depoimentos', 7, '{"titulo":"Quem já tirou as cartas comigo"}'),
  ('faq', 8, '{"titulo":"Perguntas frequentes"}'),
  ('contato_final', 9, '{"titulo":"Vamos conversar?","texto":"Me chama para tirar dúvidas, combinar a sua tiragem ou só dizer oi."}')
) as v (key, position, content)
on conflict (key) do nothing;

-- As listas só entram num banco vazio.
insert into public.quotes (texto, autoria, position)
select v.texto, v.autoria, v.position
from (values
  ('Que a sua autonomia seja sempre um ritual: silencioso, constante e irreversível.', 'Sara Koimbra', 0)
) as v (texto, autoria, position)
where not exists (select 1 from public.quotes);

insert into public.faq_items (pergunta, resposta, position)
select v.pergunta, v.resposta, v.position
from (values
  ('Preciso acreditar em tarô para fazer uma tiragem?', 'Não. Basta estar aberta ou aberto para receber o que as cartas trazem. Muita gente chega curiosa e sai com um olhar novo sobre a própria situação.', 0),
  ('Como funciona a tiragem online?', 'Você reserva um horário e me chama no WhatsApp. No dia combinado, eu faço a sua tiragem e te mando um áudio de 10 a 15 minutos com a leitura e a foto das cartas.', 1),
  ('O que eu recebo?', 'Um áudio de 10 a 15 minutos com a leitura completa e a foto das cartas que saíram para você.', 2),
  ('Como entra a respiração do Kundalini Yoga? Preciso saber yoga?', 'Não precisa saber nada. No começo do áudio, eu te guio numa respiração simples, que qualquer pessoa consegue fazer, para você ouvir a leitura com mais calma.', 3),
  ('Preciso preparar alguma coisa antes?', 'Só pensar no que você quer olhar. Na hora de ouvir o áudio, procure um lugar tranquilo, sem pressa.', 4),
  ('Como agendo e como pago?', 'Pela agenda aqui do site você reserva o horário, e pelo WhatsApp a gente combina o pagamento. O horário fica guardado por 2 horas até a confirmação.', 5),
  ('Posso remarcar ou cancelar?', 'Pode. É só me chamar no WhatsApp que eu ajusto para você.', 6),
  ('O tarô prevê o futuro?', 'O tarô mostra caminhos, tendências e o que está em movimento agora. O futuro não está escrito em pedra: as suas escolhas fazem parte dele.', 7),
  ('O que eu conto fica entre nós?', 'Sim. O que você me conta é usado só para a sua tiragem e não é compartilhado com ninguém.', 8),
  ('A tiragem substitui terapia ou acompanhamento médico?', 'Não. O tarô é uma prática de autoconhecimento e acolhimento. Se você está passando por um momento difícil, procure também um profissional de saúde.', 9)
) as v (pergunta, resposta, position)
where not exists (select 1 from public.faq_items);
