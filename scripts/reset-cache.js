/**
 * Script para limpar o cache do Metro Bundler
 * 
 * Este script executa a limpeza do cache do Metro Bundler para garantir
 * que as alterações nas configurações do supabase e polyfills sejam aplicadas.
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🧹 Limpando cache do Metro Bundler...');

// Remove a pasta .expo na raiz do projeto
try {
  if (fs.existsSync('.expo')) {
    execSync('rm -rf .expo');
    console.log('✅ Pasta .expo removida com sucesso');
  } else {
    console.log('ℹ️ Pasta .expo não encontrada');
  }
} catch (error) {
  console.error('⚠️ Erro ao remover a pasta .expo:', error.message);
}

// Remove o cache temporário do metro
try {
  if (fs.existsSync('node_modules/.cache')) {
    execSync('rm -rf node_modules/.cache');
    console.log('✅ Cache do Metro removido com sucesso');
  } else {
    console.log('ℹ️ Pasta node_modules/.cache não encontrada');
  }
} catch (error) {
  console.error('⚠️ Erro ao remover o cache do metro:', error.message);
}

// Limpa cache do npm
try {
  execSync('npm cache clean --force', { stdio: 'inherit' });
  console.log('✅ Cache do npm limpo com sucesso');
} catch (error) {
  console.error('⚠️ Erro ao limpar o cache do npm:', error.message);
}

// Reinstala as dependências do node-fetch
try {
  console.log('📦 Reinstalando o pacote @supabase/node-fetch...');
  execSync('npm uninstall @supabase/node-fetch && npm install @supabase/node-fetch --save', { stdio: 'inherit' });
  console.log('✅ Pacote @supabase/node-fetch reinstalado com sucesso');
} catch (error) {
  console.error('⚠️ Erro ao reinstalar o pacote @supabase/node-fetch:', error.message);
}

console.log('✨ Limpeza de cache concluída!');
console.log('⚡ Você pode iniciar o projeto novamente com: npm start'); 