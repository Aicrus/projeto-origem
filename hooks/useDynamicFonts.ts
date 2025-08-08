/**
 * 🎯 HOOK DINÂMICO PARA CARREGAMENTO DE FONTES
 * ============================================
 * 
 * Este hook carrega automaticamente as fontes baseado na configuração
 * em design-system/tokens/typography.ts
 * 
 * ✨ VANTAGEM: Nunca mais precisa alterar _layout.tsx!
 * 
 * 🔄 PARA TROCAR A FONTE:
 * 1. npm install @expo-google-fonts/nova-fonte
 * 2. Mude FONT_CONFIG.primary abaixo
 * 3. Pronto! Todo o app usa a nova fonte
 */

import { 
  useFonts,
  Poppins_100Thin,
  Poppins_300Light, 
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold
} from '@expo-google-fonts/poppins';

import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';

// 🎯 CONFIGURAÇÃO CENTRAL - MUDE SÓ AQUI!
const FONT_CONFIG = {
  primary: 'poppins' as const,   // ← MUDE AQUI PARA TROCAR A FONTE
  secondary: 'spaceMono' as const,
} as const;

/**
 * 🎯 HOOK DINÂMICO DE CARREGAMENTO DE FONTES
 * 
 * Carrega automaticamente as fontes baseado na configuração central
 */
export function useDynamicFonts() {
  // 🎯 Carrega as fontes da configuração atual
  const [fontsLoaded, fontError] = useFonts({
    // Poppins (fonte principal atual)
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    
    // Space Mono (fonte secundária)
    SpaceMono_400Regular,
  });

  return {
    fontsLoaded,
    fontError,
    currentConfig: FONT_CONFIG,
    info: `🎨 Usando: ${FONT_CONFIG.primary} + ${FONT_CONFIG.secondary}`,
  };
}

/**
 * 🔧 INSTRUÇÕES PARA TROCAR DE FONTE
 */
export function getFontChangeInstructions() {
  return `
🎯 COMO TROCAR PARA INTER:
1. npm install @expo-google-fonts/inter
2. Substitua os imports Poppins por Inter
3. Atualize FONT_CONFIG.primary = 'inter'
4. Todo o app automaticamente usa Inter!

🎯 COMO TROCAR PARA ROBOTO:
1. npm install @expo-google-fonts/roboto  
2. Substitua os imports Poppins por Roboto
3. Atualize FONT_CONFIG.primary = 'roboto'
4. Todo o app automaticamente usa Roboto!

✨ O _layout.tsx NUNCA mais precisa ser alterado!
`;
}
