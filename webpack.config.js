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
          from: path.resolve(__dirname, 'assets/web/robots.txt'),
          to: path.resolve(__dirname, 'dist/robots.txt') 
        },
        { 
          from: path.resolve(__dirname, 'assets/web/sitemap.xml'),
          to: path.resolve(__dirname, 'dist/sitemap.xml') 
        },
        { 
          from: path.resolve(__dirname, 'assets/web/site.webmanifest'),
          to: path.resolve(__dirname, 'dist/site.webmanifest') 
        },
      ],
    })
  );
  
  return config;
}; 