import "server-only";
import { createClient } from "@supabase/supabase-js";

// Cliente com a chave publicável: enxerga só o que o RLS libera para o visitante.
// Fica no servidor (sem NEXT_PUBLIC_): o navegador nunca fala direto com o Supabase.
export function clientePublico() {
  const url = process.env.SUPABASE_URL;
  const chave = process.env.SUPABASE_PUBLISHABLE_KEY;
  if (!url || !chave) return null;

  return createClient(url, chave, {
    auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
  });
}
