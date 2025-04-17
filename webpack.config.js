const createExpoWebpackConfigAsync = require('@expo/webpack-config');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = async function (env, argv) {
  const config = await createExpoWebpackConfigAsync(env, argv);
  
  // Adiciona o plugin para copiar arquivos para a pasta de build
  if (!config.plugins) {
    config.plugins = [];
  }
  
  // Adiciona plugin para copiar arquivos estáticos para o build
  config.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        { 
          from: path.resolve(__dirname, 'assets/seo-web/robots.txt'),
          to: path.resolve(__dirname, 'dist/robots.txt') 
        },
        { 
          from: path.resolve(__dirname, 'assets/seo-web/sitemap.xml'),
          to: path.resolve(__dirname, 'dist/sitemap.xml') 
        },
        { 
          from: path.resolve(__dirname, 'assets/seo-web/site.webmanifest'),
          to: path.resolve(__dirname, 'dist/site.webmanifest') 
        },
      ],
    })
  );
  
  // Resolver problemas de compatibilidade do Supabase
  config.resolve.alias = {
    ...config.resolve.alias,
    // Substituir o node-fetch e metro-runtime por mocks
    '@supabase/node-fetch': path.resolve(__dirname, 'lib/mocks/node-fetch.js'),
    'metro-runtime': path.resolve(__dirname, 'node_modules/react-native'),
  };

  // Forçar o uso do fetch nativo do navegador
  config.resolve.fallback = {
    ...config.resolve.fallback,
    'node-fetch': false,
    'fetch': false,
    'fs': false,
    'crypto': require.resolve('crypto-browserify'),
    'stream': require.resolve('stream-browserify'),
    'path': require.resolve('path-browserify'),
    'os': require.resolve('os-browserify/browser'),
  };

  return config;
}; 