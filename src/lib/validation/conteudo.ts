import { z } from "zod";

// Schema do conteúdo editável do site. Valida os textos padrão iniciais agora
// e o que vier do banco na F4. Texto puro: nenhum campo aceita HTML.

const texto = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .refine((v) => !/[<>]/.test(v), "Texto não pode conter HTML");

const obrigatorio = (max: number) => texto(max).min(1);

const fato = z.object({ valor: obrigatorio(24), explicacao: obrigatorio(90) });

export const conteudoSchema = z.object({
  marca: z.object({ nome: obrigatorio(60), papel: obrigatorio(60), regiao: obrigatorio(60) }),
  contato: z.object({
    // Vazios até a Mari preencher no painel; o site esconde o que estiver vazio.
    whatsapp: z.union([z.literal(""), z.string().regex(/^\d{12,13}$/, "WhatsApp com DDI e DDD, só números")]),
    instagram: z.union([z.literal(""), z.string().regex(/^[a-z0-9._]{1,30}$/)]),
    instagramAtivo: z.boolean(),
  }),
  abertura: z.object({
    frase: obrigatorio(80),
    apoio: obrigatorio(140),
    acao: obrigatorio(32),
    fatos: z.array(obrigatorio(32)).max(3),
  }),
  quemSou: z.object({
    titulo: obrigatorio(40),
    paragrafos: z.array(obrigatorio(600)).min(1).max(6),
    historia: texto(600),
    assinatura: obrigatorio(60),
  }),
  citacoes: z.object({
    titulo: obrigatorio(40),
    itens: z.array(z.object({ texto: obrigatorio(240), autoria: obrigatorio(80) })).max(12),
  }),
  baralho: z.object({
    titulo: obrigatorio(40),
    paragrafos: z.array(obrigatorio(500)).min(1).max(3),
    cartas: z.array(z.object({ numeral: z.string().regex(/^[IVXL]+$/), nome: obrigatorio(32) })).max(12),
  }),
  consulta: z.object({
    titulo: obrigatorio(40),
    paragrafos: z.array(obrigatorio(500)).min(1).max(4),
    fatos: z.array(fato).max(4),
  }),
  comoFunciona: z.object({
    titulo: obrigatorio(40),
    passos: z
      .array(z.object({ titulo: obrigatorio(48), texto: obrigatorio(200) }))
      .min(1)
      .max(8),
  }),
  agendamento: z.object({
    titulo: obrigatorio(40),
    texto: texto(240),
    campos: z.object({ nome: obrigatorio(40), whatsapp: obrigatorio(40), intencao: obrigatorio(80) }),
    consentimento: obrigatorio(300),
    botao: obrigatorio(40),
    aviso: texto(200),
  }),
  depoimentos: z.object({
    titulo: obrigatorio(48),
    itens: z.array(z.object({ texto: obrigatorio(1200), nome: obrigatorio(60) })).max(20),
  }),
  faq: z.object({
    titulo: obrigatorio(40),
    itens: z.array(z.object({ pergunta: obrigatorio(140), resposta: obrigatorio(800) })).max(20),
  }),
  contatoFinal: z.object({ titulo: obrigatorio(40), texto: obrigatorio(240) }),
});

export type Conteudo = z.infer<typeof conteudoSchema>;
