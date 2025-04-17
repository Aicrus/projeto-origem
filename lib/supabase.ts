// Importar os polyfills primeiro, antes de qualquer coisa
import './polyfills';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

// Patch para resolver o problema de importação do node-fetch no ambiente React Native/Expo
// Isso deve ser executado antes de qualquer inicialização do Supabase
if (Platform.OS !== 'web' || typeof window !== 'undefined') {
  // @ts-ignore - Hack para evitar que o Supabase tente usar node-fetch em ambientes não-Node.js
  global.navigator.product = 'ReactNative';
}

// Verifica se as variáveis de ambiente estão definidas
if (!process.env.EXPO_PUBLIC_SUPABASE_URL || !process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY) {
  console.error(
    'Erro: Variáveis de ambiente do Supabase não encontradas!\n' +
    'Por favor, crie um arquivo .env na raiz do projeto baseado no .env.example\n' +
    'e preencha com suas credenciais do Supabase.'
  );
  throw new Error('Configuração do Supabase ausente');
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

// Verifica se estamos no ambiente do navegador
const isBrowser = typeof window !== 'undefined';

// Função para obter o storage apropriado
const getStorage = () => {
  if (Platform.OS === 'web') {
    if (isBrowser) {
      return localStorage;
    }
    // Retorna um storage vazio para SSR
    return {
      getItem: () => null,
      setItem: () => {},
      removeItem: () => {},
    };
  }
  return AsyncStorage;
};

const storage = getStorage();

// Configuração do cliente Supabase com opções melhoradas
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: {
      getItem: async (key: string) => {
        try {
          return await storage.getItem(key);
        } catch (error) {
          console.error('Erro ao recuperar item do storage:', error);
          return null;
        }
      },
      setItem: async (key: string, value: string) => {
        try {
          await storage.setItem(key, value);
        } catch (error) {
          console.error('Erro ao salvar item do storage:', error);
        }
      },
      removeItem: async (key: string) => {
        try {
          await storage.removeItem(key);
        } catch (error) {
          console.error('Erro ao remover item do storage:', error);
        }
      },
    },
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    flowType: 'implicit',
  },
  global: {
    fetch: (url, options) => {
      // Usar o fetch nativo e evitar usar node-fetch
      return fetch(url, options);
    }
  },
}); 