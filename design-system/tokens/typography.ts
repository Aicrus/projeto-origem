/**
 * SISTEMA DE TIPOGRAFIA
 * ------------------------------
 * Define todas as configurações tipográficas do sistema de design.
 * Inclui famílias de fonte, tamanhos, pesos e alturas de linha.
 */

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

// Configurações de tamanho de fonte e altura de linha
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
  'label-sm': { size: '12px', lineHeight: '16px', fontWeight: '600' },
  
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

// Funções utilitárias
export function getFontStyle(size: FontSizeType) {
  return fontSize[size];
} 