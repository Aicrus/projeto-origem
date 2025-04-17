/**
 * Polyfills para React Native/Expo
 * 
 * Este arquivo contém polyfills e patches necessários para resolver
 * problemas de compatibilidade entre bibliotecas que assumem ambiente Node.js
 * quando executadas em ambiente React Native ou Web.
 */

import 'react-native-url-polyfill/auto';
import { Platform } from 'react-native';

/**
 * Evita que bibliotecas como Supabase tentem importar módulos específicos de Node.js
 * em ambientes React Native ou Web.
 */
export function applyPolyfills() {
  // Simula um ambiente React Native para evitar que o Supabase tente importar node-fetch
  if (Platform.OS !== 'web' || typeof window !== 'undefined') {
    // @ts-ignore
    if (!global.navigator) {
      // @ts-ignore
      global.navigator = {};
    }
    
    // @ts-ignore - Isso faz com que várias bibliotecas detectem que estamos no React Native
    global.navigator.product = 'ReactNative';
  }

  // Patch para o módulo asyncRequire que está causando o erro
  if (typeof window !== 'undefined') {
    // @ts-ignore
    window.require = () => {
      return {
        // Mock para qualquer módulo que tente ser carregado via require
        importAsync: async () => ({}),
        importSync: () => ({}),
      };
    };
  }
}

// Aplica os polyfills imediatamente
applyPolyfills(); 