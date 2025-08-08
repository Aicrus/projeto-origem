/**
 * SISTEMA DE TIPOGRAFIA RESPONSIVA
 * ------------------------------
 * Define todas as configurações tipográficas do sistema de design.
 * Inclui famílias de fonte, tamanhos responsivos, pesos e alturas de linha.
 * A responsividade é centralizada aqui para evitar duplicação nos componentes.
 */

import { isMobileWidth, isTabletWidth, isDesktopWidth } from './breakpoints';

// Famílias de fonte disponíveis
export const fontFamily = {
  // Família Jakarta Sans
  'jakarta-thin': 'PlusJakartaSans_200ExtraLight',
  'jakarta-light': 'PlusJakartaSans_300Light',
  'jakarta-regular': 'PlusJakartaSans_400Regular',
  'jakarta-medium': 'PlusJakartaSans_500Medium',
  'jakarta-semibold': 'PlusJakartaSans_600SemiBold',
  'jakarta-bold': 'PlusJakartaSans_700Bold',
  'jakarta-extrabold': 'PlusJakartaSans_800ExtraBold',
  // Família Monospace
  'mono-regular': 'SpaceMono-Regular, monospace',
} as const;

// Interface para valores responsivos
interface ResponsiveValue {
  mobile: number;    // Mobile: Web + Nativo (iOS, Android)
  tablet: number;    // Tablet: Web + Nativo (iOS, Android)
  desktop: number;   // Desktop: Web + Nativo (macOS, Windows)
  default: number;   // React Native (valor fallback)
}

// Interface para configuração tipográfica responsiva
interface ResponsiveTypographyConfig {
  size: ResponsiveValue;
  lineHeight: ResponsiveValue;
  fontWeight: string;
  fontFamily?: keyof typeof fontFamily;
}

// Configurações de tamanho de fonte e altura de linha RESPONSIVAS
export const responsiveFontSize = {
  // Display - Textos de grande destaque
  'display-xl': {
    size: { mobile: 42, tablet: 48, desktop: 56, default: 45 },
    lineHeight: { mobile: 48, tablet: 56, desktop: 64, default: 52 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  'display-lg': {
    size: { mobile: 36, tablet: 42, desktop: 48, default: 38 },
    lineHeight: { mobile: 42, tablet: 48, desktop: 56, default: 44 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  'display-md': {
    size: { mobile: 30, tablet: 36, desktop: 40, default: 32 },
    lineHeight: { mobile: 36, tablet: 42, desktop: 48, default: 38 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  'display-sm': {
    size: { mobile: 26, tablet: 30, desktop: 36, default: 28 },
    lineHeight: { mobile: 32, tablet: 36, desktop: 44, default: 34 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  
  // Headline - Títulos principais
  'headline-xl': {
    size: { mobile: 28, tablet: 32, desktop: 36, default: 30 },
    lineHeight: { mobile: 34, tablet: 38, desktop: 44, default: 36 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  'headline-lg': {
    size: { mobile: 24, tablet: 28, desktop: 32, default: 26 },
    lineHeight: { mobile: 30, tablet: 34, desktop: 40, default: 32 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  'headline-md': {
    size: { mobile: 22, tablet: 24, desktop: 28, default: 24 },
    lineHeight: { mobile: 28, tablet: 30, desktop: 36, default: 30 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  'headline-sm': {
    size: { mobile: 20, tablet: 22, desktop: 24, default: 22 },
    lineHeight: { mobile: 26, tablet: 28, desktop: 32, default: 28 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  
  // Title - Títulos de seções
  'title-lg': {
    size: { mobile: 18, tablet: 20, desktop: 22, default: 20 },
    lineHeight: { mobile: 24, tablet: 26, desktop: 28, default: 26 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  'title-md': {
    size: { mobile: 16, tablet: 18, desktop: 20, default: 18 },
    lineHeight: { mobile: 22, tablet: 24, desktop: 26, default: 24 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  'title-sm': {
    size: { mobile: 14, tablet: 16, desktop: 18, default: 16 },
    lineHeight: { mobile: 20, tablet: 22, desktop: 24, default: 22 },
    fontWeight: '700',
    fontFamily: 'jakarta-bold' as const
  },
  
  // Subtitle - Subtítulos
  'subtitle-lg': {
    size: { mobile: 16, tablet: 17, desktop: 18, default: 17 },
    lineHeight: { mobile: 22, tablet: 23, desktop: 24, default: 23 },
    fontWeight: '600',
    fontFamily: 'jakarta-semibold' as const
  },
  'subtitle-md': {
    size: { mobile: 14, tablet: 15, desktop: 16, default: 15 },
    lineHeight: { mobile: 20, tablet: 21, desktop: 22, default: 21 },
    fontWeight: '600',
    fontFamily: 'jakarta-semibold' as const
  },
  'subtitle-sm': {
    size: { mobile: 12, tablet: 13, desktop: 14, default: 13 },
    lineHeight: { mobile: 18, tablet: 19, desktop: 20, default: 19 },
    fontWeight: '600',
    fontFamily: 'jakarta-semibold' as const
  },
  
  // Label - Rótulos
  'label-lg': {
    size: { mobile: 14, tablet: 15, desktop: 16, default: 15 },
    lineHeight: { mobile: 20, tablet: 22, desktop: 24, default: 22 },
    fontWeight: '600',
    fontFamily: 'jakarta-semibold' as const
  },
  'label-md': {
    size: { mobile: 12, tablet: 13, desktop: 14, default: 13 },
    lineHeight: { mobile: 18, tablet: 19, desktop: 20, default: 19 },
    fontWeight: '600',
    fontFamily: 'jakarta-semibold' as const
  },
  'label-sm': {
    size: { mobile: 11, tablet: 12, desktop: 13, default: 12 },
    lineHeight: { mobile: 16, tablet: 17, desktop: 17, default: 17 },
    fontWeight: '600',
    fontFamily: 'jakarta-semibold' as const
  },
  
  // Body - Texto de corpo
  'body-lg': {
    size: { mobile: 15, tablet: 15, desktop: 16, default: 16 },
    lineHeight: { mobile: 22, tablet: 23, desktop: 24, default: 24 },
    fontWeight: '400',
    fontFamily: 'jakarta-regular' as const
  },
  'body-md': {
    size: { mobile: 13, tablet: 13, desktop: 14, default: 14 },
    lineHeight: { mobile: 19, tablet: 19, desktop: 20, default: 20 },
    fontWeight: '400',
    fontFamily: 'jakarta-regular' as const
  },
  'body-sm': {
    size: { mobile: 11, tablet: 12, desktop: 12, default: 12 },
    lineHeight: { mobile: 16, tablet: 17, desktop: 18, default: 18 },
    fontWeight: '400',
    fontFamily: 'jakarta-regular' as const
  },
  'body-xs': {
    size: { mobile: 9, tablet: 10, desktop: 10, default: 10 },
    lineHeight: { mobile: 13, tablet: 14, desktop: 14, default: 14 },
    fontWeight: '400',
    fontFamily: 'jakarta-regular' as const
  },
  
  // Mono - Texto monoespaçado
  'mono-lg': {
    size: { mobile: 15, tablet: 15, desktop: 16, default: 16 },
    lineHeight: { mobile: 22, tablet: 23, desktop: 24, default: 24 },
    fontWeight: '400',
    fontFamily: 'mono-regular' as const
  },
  'mono-md': {
    size: { mobile: 13, tablet: 13, desktop: 14, default: 14 },
    lineHeight: { mobile: 19, tablet: 19, desktop: 20, default: 20 },
    fontWeight: '400',
    fontFamily: 'mono-regular' as const
  },
  'mono-sm': {
    size: { mobile: 11, tablet: 12, desktop: 12, default: 12 },
    lineHeight: { mobile: 16, tablet: 17, desktop: 18, default: 18 },
    fontWeight: '400',
    fontFamily: 'mono-regular' as const
  },
} as const;

// Mantém o sistema antigo para compatibilidade (valores fixos desktop)
export const fontSize = {
  // Display - Textos de grande destaque
  'display-xl': { size: '56px', lineHeight: '64px', fontWeight: '700' },
  'display-lg': { size: '48px', lineHeight: '56px', fontWeight: '700' },
  'display-md': { size: '40px', lineHeight: '48px', fontWeight: '700' },
  'display-sm': { size: '36px', lineHeight: '44px', fontWeight: '700' },
  
  // Headline - Títulos principais
  'headline-xl': { size: '36px', lineHeight: '44px', fontWeight: '700' },
  'headline-lg': { size: '32px', lineHeight: '40px', fontWeight: '700' },
  'headline-md': { size: '28px', lineHeight: '36px', fontWeight: '700' },
  'headline-sm': { size: '24px', lineHeight: '32px', fontWeight: '700' },
  
  // Title - Títulos de seções
  'title-lg': { size: '22px', lineHeight: '28px', fontWeight: '700' },
  'title-md': { size: '20px', lineHeight: '26px', fontWeight: '700' },
  'title-sm': { size: '18px', lineHeight: '24px', fontWeight: '700' },
  
  // Subtitle - Subtítulos
  'subtitle-lg': { size: '18px', lineHeight: '24px', fontWeight: '600' },
  'subtitle-md': { size: '16px', lineHeight: '22px', fontWeight: '600' },
  'subtitle-sm': { size: '14px', lineHeight: '20px', fontWeight: '600' },
  
  // Label - Rótulos
  'label-lg': { size: '16px', lineHeight: '24px', fontWeight: '600' },
  'label-md': { size: '14px', lineHeight: '20px', fontWeight: '600' },
  'label-sm': { size: '13px', lineHeight: '17px', fontWeight: '600' },
  
  // Body - Texto de corpo
  'body-lg': { size: '16px', lineHeight: '24px', fontWeight: '400' },
  'body-md': { size: '14px', lineHeight: '20px', fontWeight: '400' },
  'body-sm': { size: '12px', lineHeight: '18px', fontWeight: '400' },
  'body-xs': { size: '10px', lineHeight: '14px', fontWeight: '400' },
  
  // Mono - Texto monoespaçado
  'mono-lg': { size: '16px', lineHeight: '24px', fontWeight: '400', fontFamily: 'monospace' },
  'mono-md': { size: '14px', lineHeight: '20px', fontWeight: '400', fontFamily: 'monospace' },
  'mono-sm': { size: '12px', lineHeight: '18px', fontWeight: '400', fontFamily: 'monospace' },
} as const;

// Tipos para facilitar o uso
export type FontFamilyType = keyof typeof fontFamily;
export type FontSizeType = keyof typeof fontSize;
export type ResponsiveFontSizeType = keyof typeof responsiveFontSize;

// ================================
// FUNÇÕES UTILITÁRIAS RESPONSIVAS
// ================================

/**
 * Obtém o estilo tipográfico responsivo baseado na largura da tela
 * @param size - Tamanho tipográfico (ex: 'body-md', 'title-lg')
 * @param width - Largura atual da tela (obtida do useResponsive)
 * @returns Objeto com fontSize, lineHeight, fontWeight e fontFamily
 */
export function getResponsiveTypography(
  size: ResponsiveFontSizeType, 
  width: number
) {
  const config = responsiveFontSize[size];
  
  // Determina o breakpoint atual
  let fontSize: number;
  let lineHeight: number;
  
  if (isMobileWidth(width)) {
    fontSize = config.size.mobile;
    lineHeight = config.lineHeight.mobile;
  } else if (isTabletWidth(width)) {
    fontSize = config.size.tablet;
    lineHeight = config.lineHeight.tablet;
  } else if (isDesktopWidth(width)) {
    fontSize = config.size.desktop;
    lineHeight = config.lineHeight.desktop;
  } else {
    // Fallback para React Native
    fontSize = config.size.default;
    lineHeight = config.lineHeight.default;
  }
  
  return {
    fontSize,
    lineHeight,
    fontWeight: config.fontWeight,
    fontFamily: config.fontFamily ? fontFamily[config.fontFamily] : fontFamily['jakarta-regular'],
  };
}

/**
 * Hook-like function que retorna uma função responsiva para ser usada com useResponsive
 * @param size - Tamanho tipográfico
 * @returns Função que aceita um objeto responsive e retorna o estilo atual
 */
export function createResponsiveTypography(size: ResponsiveFontSizeType) {
  return function(responsiveFunction: (options: {
    mobile?: any;
    tablet?: any; 
    desktop?: any;
    default: any;
  }) => any) {
    const config = responsiveFontSize[size];
    
    const fontSize = responsiveFunction({
      mobile: config.size.mobile,
      tablet: config.size.tablet,
      desktop: config.size.desktop,
      default: config.size.default,
    });
    
    const lineHeight = responsiveFunction({
      mobile: config.lineHeight.mobile,
      tablet: config.lineHeight.tablet,
      desktop: config.lineHeight.desktop,
      default: config.lineHeight.default,
    });
    
    return {
      fontSize,
      lineHeight,
      fontWeight: config.fontWeight,
      fontFamily: config.fontFamily ? fontFamily[config.fontFamily] : fontFamily['jakarta-regular'],
    };
  };
}

/**
 * Versão simplificada que retorna diretamente os valores responsivos
 * para usar com a função responsive() do useResponsive
 * @param size - Tamanho tipográfico
 * @returns Objeto com valores responsivos para fontSize e lineHeight
 */
export function getResponsiveValues(size: ResponsiveFontSizeType) {
  const config = responsiveFontSize[size];
  
  return {
    fontSize: {
      mobile: config.size.mobile,
      tablet: config.size.tablet,
      desktop: config.size.desktop,
      default: config.size.default,
    },
    lineHeight: {
      mobile: config.lineHeight.mobile,
      tablet: config.lineHeight.tablet,
      desktop: config.lineHeight.desktop,
      default: config.lineHeight.default,
    },
    fontWeight: config.fontWeight,
    fontFamily: config.fontFamily ? fontFamily[config.fontFamily] : fontFamily['jakarta-regular'],
  };
}

// Funções utilitárias legacy (mantidas para compatibilidade)
export function getFontStyle(size: FontSizeType) {
  return fontSize[size];
} 