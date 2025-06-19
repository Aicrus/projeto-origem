const { getDefaultConfig } = require('@expo/metro-config');
const { withNativeWind } = require('nativewind/metro');
const path = require('path');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Configurações para resolver problemas com imports dinâmicos no SDK 53
config.resolver.resolverMainFields = ['browser', 'module', 'main'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs'];

// Configurar aliases para resolver problemas com Supabase
config.resolver.alias = {
  ...config.resolver.alias,
  '@supabase/node-fetch': path.resolve(__dirname, 'lib/mocks/node-fetch.js'),
  // Adicionar aliases específicos para resolver problemas com asyncRequire
  'metro-runtime/src/modules/asyncRequire': path.resolve(__dirname, 'lib/mocks/asyncRequire.js'),
  'metro-runtime/src/modules/asyncRequire.js': path.resolve(__dirname, 'lib/mocks/asyncRequire.js'),
};

// Configurar blacklist para evitar imports problemáticos
config.resolver.blacklistRE = /metro-runtime\/src\/modules\/asyncRequire\.js$/;

// Configurar platform-specific overrides
config.resolver.platforms = ['native', 'ios', 'android', 'web'];

// Adicionar configuração de módulos ignorados
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

// Configurações de transformação para melhor compatibilidade
config.transformer = {
  ...config.transformer,
  unstable_allowRequireContext: true,
};

// Aplicar a configuração do NativeWind
module.exports = withNativeWind(config, {
  input: './global.css',
}); 