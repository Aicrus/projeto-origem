/**
 * Centralização de imports de fontes
 * ----------------------------------
 *
 * Este arquivo concentra os imports das famílias de fontes utilizadas no app.
 * Assim, trocar de fonte exige apenas:
 * - Instalar o pacote da nova fonte (@expo-google-fonts/xxx ou fonte local)
 * - Adicionar os imports aqui
 * - Atualizar `FONT_CONFIG.primary` em `design-system/tokens/typography.ts`
 */

// POPPINS (família principal padrão)
import {
  Poppins_100Thin,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from '@expo-google-fonts/poppins';

// SPACE MONO (secundária - monospace)
import { SpaceMono_400Regular } from '@expo-google-fonts/space-mono';

/**
 * Mapa de famílias de fonte disponíveis para carregamento.
 * As chaves devem corresponder aos nomes usados em FONT_CONFIG em typography.ts
 */
export const FONT_IMPORTS = {
  poppins: {
    Poppins_100Thin,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  },
  spaceMono: {
    SpaceMono_400Regular,
  },
  // Para adicionar outra família (ex.: inter):
  // 1) npm i @expo-google-fonts/inter
  // 2) importe aqui os pesos desejados
  // 3) adicione um bloco como abaixo e troque FONT_CONFIG.primary em typography.ts
  // inter: {
  //   Inter_400Regular,
  //   Inter_500Medium,
  //   Inter_600SemiBold,
  //   Inter_700Bold,
  // },
} as const;


