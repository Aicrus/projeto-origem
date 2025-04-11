import { createClient } from '@supabase/supabase-js';

// Usar as credenciais do .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// Criar cliente Supabase (será nulo se as credenciais não estiverem definidas)
let supabase = null;

if (supabaseUrl && supabaseKey) {
  // Para verificação durante a depuração
  console.log('Supabase configurado:', supabaseUrl ? 'URL definida' : 'URL indefinida');
  
  // Criar cliente Supabase apenas se ambas as credenciais estiverem disponíveis
  supabase = createClient(supabaseUrl, supabaseKey);
} else {
  console.log('Supabase não configurado. Defina as variáveis de ambiente EXPO_PUBLIC_SUPABASE_URL e EXPO_PUBLIC_SUPABASE_ANON_KEY');
}

/**
 * Hook para usar o cliente Supabase em componentes
 * 
 * Para configurar:
 * 1. Crie um projeto no Supabase (https://supabase.com)
 * 2. Adicione as credenciais no .env:
 *    EXPO_PUBLIC_SUPABASE_URL=sua_url_do_supabase
 *    EXPO_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_do_supabase
 * 3. Use este hook em seus componentes:
 *    const { supabase } = useSupabase();
 *    if (supabase) {
 *      // Faça chamadas ao Supabase
 *    }
 */
export const useSupabase = () => {
  return { supabase };
}; 