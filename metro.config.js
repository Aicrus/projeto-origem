const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configurações adicionais para resolver problemas com o Supabase e outros módulos
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  // Cria um mock vazio para o metro-runtime
  'metro-runtime': path.resolve(__dirname, 'node_modules/react-native'),
  // Mock para o node-fetch
  '@supabase/node-fetch': path.resolve(__dirname, 'node_modules/react-native'),
};

// Instruir o Metro a ignorar a importação dinâmica de módulos do node no ambiente móvel/web
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Aplicar a configuração do NativeWind
module.exports = withNativeWind(config, {
  input: './global.css',
}); 