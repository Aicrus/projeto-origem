import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../hooks/ThemeContext';

/**
 * Componente Head - Responsável pelas configurações de SEO e meta tags
 * 
 * Este arquivo contém as configurações para otimização de SEO, Open Graph e compartilhamento
 * em redes sociais. Para personalizar sua aplicação, atualize as tags meta aqui.
 * 
 * As configurações importantes incluem:
 * - Título e descrição do site
 * - Imagens para compartilhamento (Open Graph)
 * - Ícones e favicons
 * - Metatags para melhorar o SEO
 */
export default function Head() {
  // Tenta usar o Theme, mas com fallback para caso não esteja disponível
  let themeColor = '#4A6FA5'; // Valor padrão (primary-color)
  let isDark = false;
  
  try {
    const theme = useTheme();
    isDark = theme?.currentTheme === 'dark';
    // Use a cor primária do tema como theme-color
    themeColor = isDark ? '#4A6FA5' : '#4A6FA5'; // primary-dark ou primary-light do tailwind.config.js
  } catch (error) {
    console.warn('Theme context não disponível no Head:', error);
    // Continua com os valores padrão
  }

  return (
    <Helmet>
      {/* Metadados básicos */}
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <title>Projeto Base - Aplicativo Multiplataforma</title>
      <meta name="description" content="Projeto base para desenvolvimento de aplicativos React Native/Expo multiplataforma para iOS, Android e Web." />
      
      {/* Favicon e ícones */}
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="manifest" href="/site.webmanifest" />
      
      {/* Preconnect para domínios externos - reduz tempo de carregamento */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Preload de recursos críticos */}
      <link rel="preload" as="font" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" crossOrigin="anonymous" />
      
      {/* Otimizações para SEO e desempenho */}
      <meta name="theme-color" content={themeColor} />
      <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
      
      {/* Otimizações de cache */}
      <meta httpEquiv="Cache-Control" content="public, max-age=31536000, immutable" />
      
      {/* Open Graph - para compartilhamento em redes sociais */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content="https://seu-app.vercel.app" />
      <meta property="og:title" content="Projeto Base - Aplicativo Multiplataforma" />
      <meta property="og:description" content="Projeto base para desenvolvimento de aplicativos React Native/Expo multiplataforma para iOS, Android e Web." />
      <meta property="og:image" content="https://seu-app.vercel.app/og-image.png" />
      
      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content="Projeto Base - Aplicativo Multiplataforma" />
      <meta name="twitter:description" content="Projeto base para desenvolvimento de aplicativos React Native/Expo multiplataforma para iOS, Android e Web." />
      <meta name="twitter:image" content="https://seu-app.vercel.app/og-image.png" />
      
      {/* Idioma */}
      <meta property="og:locale" content="pt_BR" />
      <meta httpEquiv="Content-Language" content="pt-br" />
      <html lang="pt-BR" />
    </Helmet>
  );
} 