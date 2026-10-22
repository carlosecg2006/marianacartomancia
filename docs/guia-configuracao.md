# Guia de configuração (passo a passo para leigos)

Dois ajustes que só você pode fazer, porque são nas suas contas.

---

## Parte 1 — Liberar os acervos de gravuras

### Por que isso é preciso

As gravuras antigas do site (mapas do céu, a lua desenhada no século XVII, ervas e flores, um mapa antigo de Minas) vêm de museus e acervos abertos na internet. O "computador na nuvem" onde eu trabalho tem uma lista de sites que ele pode acessar, e esses acervos não estão nela. Você precisa adicionar os endereços.

Não custa nada e não dá acesso a nenhuma conta sua. É só uma lista de sites permitidos.

### Passo a passo

1. **Abra esta conversa** no app do Claude (celular ou computador) ou em claude.ai/code.
2. **No topo da tela**, na barra com o nome da sessão, procure o **nome do ambiente** (o "computador na nuvem" desta conversa). Toque ou clique nele para abrir o menu.
3. Escolha **Edit** (Editar).
4. Procure a parte **Network access** (Acesso à rede).
5. O nível de acesso provavelmente está em **Limited** (Limitado). **Deixe em Limited.** Logo abaixo aparece um campo chamado **Allowed domains** (Domínios permitidos).
   - Se o seu app mostrar **Custom** (Personalizado) no lugar de Limited, use essa opção. Ela tem o mesmo campo e uma caixinha para "incluir a lista padrão de gerenciadores de pacotes": **deixe essa caixinha marcada**.
6. **Confira** que a opção **Allow package managers** (Permitir gerenciadores de pacotes) **continua marcada**. Ela é o que me deixa instalar as ferramentas do site. Não desmarque.
7. No campo **Allowed domains**, adicione estes endereços, **um por linha**, exatamente como estão:

   ```
   commons.wikimedia.org
   upload.wikimedia.org
   api.openverse.org
   api.artic.edu
   www.artic.edu
   collectionapi.metmuseum.org
   images.metmuseum.org
   ```

   O que é cada um: Wikimedia Commons (o maior acervo livre do mundo), Openverse (um buscador de imagens livres), Art Institute of Chicago e The Metropolitan Museum of Art (o Met), os dois museus com acervo aberto.

8. **Salve** (Save).
9. **Me avise aqui na conversa** ("liberei os domínios").
   - Talvez a mudança só valha para conversas novas. Se for o caso, eu te aviso e você abre uma conversa nova neste mesmo repositório. Tudo o que fizemos está salvo no GitHub, e eu continuo de onde parei.

Documentação oficial, se quiser conferir: https://code.claude.com/docs/en/cloud-environments#network-access

### O que eu faço depois

1. Busco as gravuras.
2. Escolho as que combinam com cada seção.
3. Converto para um formato leve.
4. Registro o crédito de cada uma em `docs/creditos-imagens.md` e no rodapé do site.

Só uso imagens de **domínio público** ou com licença que permite uso comercial.

---

## Parte 2 — Preview na Vercel (ver o site no celular)

### O que é

A Vercel é o serviço onde o site vai ficar hospedado. Ligando o repositório a ela, **cada vez que eu salvo uma etapa no GitHub, a Vercel monta uma versão de teste do site** com um link próprio, para você abrir no celular. Esse link de teste não é o site oficial e não aparece no Google.

### Passo a passo

1. **Abra** https://vercel.com no navegador.
2. Clique em **Sign Up** (Criar conta).
3. Escolha o plano **Hobby** (gratuito, para projetos pessoais) e preencha o seu nome.
4. Escolha **Continue with GitHub** (Continuar com GitHub) e entre com a mesma conta do GitHub onde está o repositório `marianacartomancia` (usuário `carlosecg2006`).
5. O GitHub vai pedir permissão para a Vercel. Aceite (**Authorize Vercel**).
6. Na Vercel, clique em **Add New… → Project** (Adicionar novo → Projeto).
7. Na lista "Import Git Repository", procure **marianacartomancia** e clique em **Import**.
   - Se ele não aparecer, clique em **Adjust GitHub App Permissions** (Ajustar permissões), escolha o repositório `marianacartomancia` e salve. Depois volte ao passo 7.
8. Na tela de configuração:
   - **Framework Preset:** deve aparecer **Next.js** sozinho. Se não aparecer, escolha Next.js.
   - **Root Directory:** deixe como está (`./`).
   - **Build and Output Settings:** não mexa.
   - **Environment Variables:** não precisa de nenhuma por enquanto.
9. Clique em **Deploy**.
   - A primeira montagem pode **falhar ou mostrar uma página em branco**. Isso é normal: o site de verdade ainda está na branch de trabalho (`claude/adoring-maxwell-mqenhp`), e não na principal (`main`). Não se preocupe.
10. Para ver a versão de trabalho:
    1. No painel do projeto na Vercel, abra a aba **Deployments** (Implantações).
    2. Procure a linha marcada como **Preview**, com o nome da branch `claude/adoring-maxwell-mqenhp`.
    3. Clique nela e depois em **Visit** (Visitar). Esse é o link para abrir no celular.
    - Se essa linha ainda não existir, me avise: no próximo envio que eu fizer ao GitHub, a Vercel monta sozinha.
11. **Me mande aqui o link** do preview (algo como `https://marianacartomancia-xxxx.vercel.app`).
    - Ele pode pedir que você entre na Vercel para ver. É a proteção padrão dos links de teste, e é bom que fique assim enquanto o site é surpresa.

### Importante

- **Não** precisa colocar nenhum cartão: o plano Hobby é gratuito.
- **Não** precisa de domínio agora. Ele entra no fim, quando o site estiver pronto.
- Se aparecer alguma tela diferente das descritas aqui, tire um print e me mande que eu te guio.

---

## Parte 3 — Conta no Supabase (banco de dados)

### O que é

O Supabase guarda tudo o que a Mari vai poder editar no painel: textos, citações, perguntas, depoimentos e a agenda. Também cuida do login dela. O plano gratuito é suficiente.

### Passo a passo

1. **Abra** https://supabase.com e clique em **Start your project** (Começar o seu projeto).
2. Escolha **Continue with GitHub** e entre com a mesma conta do GitHub (`carlosecg2006`). Aceite a permissão (**Authorize**).
3. Se ele pedir para criar uma **organização**, use o seu nome, escolha o tipo **Personal** e o plano **Free** (gratuito).
4. Clique em **New project** (Novo projeto) e preencha:
   - **Name:** `mariana-dayrell`
   - **Database Password:** clique em **Generate a password** e **guarde essa senha num lugar seguro**, como um gerenciador de senhas. Não precisa me mandar.
   - **Region:** **South America (São Paulo)**. É a mais perto de Minas, e o site fica mais rápido.
5. Clique em **Create new project** e espere uns 2 minutos até ele terminar de preparar.
6. No menu da esquerda, abra **Project Settings** (ícone de engrenagem) → **API** (ou **Data API**). Ali aparecem:
   - **Project URL**, algo como `https://abcdxyz.supabase.co`: **pode me mandar**;
   - **anon / public key**, uma chave longa marcada como *public*: **pode me mandar**. Ela é pública por natureza, e o banco fica protegido pelas regras que eu escrevo;
   - **service_role key**, marcada como *secret*: **NÃO mande na conversa e não mostre a ninguém**. Ela é a chave mestra do banco. Mais adiante vou te pedir para colar essa chave direto na Vercel, num campo secreto.
7. **Me mande aqui** a Project URL e a anon key.

### Para eu criar as tabelas daqui (opcional, recomendado)

Para eu aplicar a estrutura do banco sem você precisar instalar nada:

1. Abra https://supabase.com/dashboard/account/tokens.
2. Clique em **Generate new token**, dê o nome `claude-marianacartomancia` e escolha uma validade curta, se aparecer a opção (por exemplo, 30 dias).
3. Copie o token e **me avise que gerou**. Eu te explico na hora a forma segura de passar o token: como uma variável do ambiente, sem colar no meio da conversa.
4. Quando terminarmos, você pode **revogar o token** na mesma página (botão **Revoke**). Assim ele para de funcionar.

Se preferir não gerar o token, tudo bem: eu te passo um comando para rodar no seu computador, com instruções.
