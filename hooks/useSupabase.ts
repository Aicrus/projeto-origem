import { createClient } from '@supabase/supabase-js';

// Usar as credenciais do .env
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://azehnvauhzzvoflkxskp.supabase.co';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF6ZWhudmF1aHp6dm9mbGt4c2twIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDA3MTYxNjIsImV4cCI6MjA1NjI5MjE2Mn0.aYpY-sXfSI5DJ3r-WZ4bsWtuMQ1MahFfxtzSiNwiFmw';

// Para verificação durante a depuração
console.log('Supabase URL:', supabaseUrl);
console.log('Supabase Key:', supabaseKey ? 'Definida' : 'Indefinida');

// Criar cliente Supabase
const supabase = createClient(supabaseUrl, supabaseKey);

export const useSupabase = () => {
  return { supabase };
}; 