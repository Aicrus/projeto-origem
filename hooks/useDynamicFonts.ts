/**
 * 🎯 HOOK DINÂMICO PARA CARREGAMENTO DE FONTES
 * ============================================
 * 
 * Este hook carrega automaticamente as fontes baseado na configuração
 * central em `design-system/tokens/typography.ts`, sem duplicar config.
 * 
 * ✨ VANTAGEM: Nunca mais precisa alterar _layout.tsx!
 * 
 * 🔄 PARA TROCAR A FONTE:
 * 1. npm install @expo-google-fonts/nova-fonte
 * 2. Mude FONT_CONFIG.primary abaixo
 * 3. Pronto! Todo o app usa a nova fonte
 */

import { useFonts } from 'expo-font';
import { FONT_IMPORTS } from '@/design-system/fonts';
import { getCurrentConfig } from '@/design-system/tokens/typography';

// Configuração única é definida em `design-system/tokens/typography.ts`

/**
 * 🎯 HOOK DINÂMICO DE CARREGAMENTO DE FONTES
 * 
 * Carrega automaticamente as fontes baseado na configuração central
 */
export function useDynamicFonts() {
  const { primary, secondary } = getCurrentConfig();

  // Escolhe dinamicamente os imports de fontes baseados na configuração atual
  const primaryFonts = FONT_IMPORTS[primary];
  const secondaryFonts = FONT_IMPORTS[secondary];
  const fontMap = { ...primaryFonts, ...secondaryFonts } as Record<string, any>;

  const [fontsLoaded, fontError] = useFonts(fontMap);

  return { fontsLoaded, fontError, currentConfig: { primary, secondary } };
}

/**
 * 🔧 INSTRUÇÕES PARA TROCAR DE FONTE
 */
export function getFontChangeInstructions() {
  return `
🎯 COMO TROCAR A FONTE PRINCIPAL:
1. Instale o pacote da fonte (ex.: npm i @expo-google-fonts/inter)
2. Adicione os imports em design-system/fonts.ts
3. Altere FONT_CONFIG.primary em design-system/tokens/typography.ts
4. Pronto! Todo o app usa a nova fonte, sem mexer no _layout.tsx
`;
}
