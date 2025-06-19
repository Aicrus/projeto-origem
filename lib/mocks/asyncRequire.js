/**
 * Mock para metro-runtime/src/modules/asyncRequire.js
 * 
 * Este arquivo resolve problemas com imports dinâmicos do Supabase
 * que causam erros no Metro Runtime do Expo SDK 53
 */

// Mock function that does nothing but prevents the error
export default function asyncRequire() {
  return Promise.resolve({});
}

// Named export for compatibility
export { asyncRequire };

// Mock other possible exports
export const importModule = async () => ({});
export const requireAsync = async () => ({}); 