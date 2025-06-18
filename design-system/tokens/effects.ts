/**
 * SISTEMA DE EFEITOS
 * ------------------------------
 * Define todos os efeitos visuais do sistema de design.
 * Inclui sombras, opacidade, z-index e transições.
 */

// Sistema de Sombras Inteligente
// SEMPRE usa cores escuras em ambos os temas (claro e escuro)
export const shadows = {
  // Sombras Universais (sempre escuras)
  'input': {
    color: '#000000', // Sempre preto
    light: '0 1px 2px rgba(0, 0, 0, 0.05)', // Tema claro - mais sutil
    dark: '0 1px 2px rgba(0, 0, 0, 0.2)',   // Tema escuro - mais intensa
  },
  'card': {
    color: '#000000',
    light: '0 2px 5px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)',
    dark: '0 2px 5px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.2)',
  },
  'button': {
    color: '#000000',
    light: '0 1px 3px rgba(0, 0, 0, 0.1)',
    dark: '0 1px 3px rgba(0, 0, 0, 0.4)',
  },
  'modal': {
    color: '#000000',
    light: '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
    dark: '0 20px 25px rgba(0, 0, 0, 0.4), 0 10px 10px rgba(0, 0, 0, 0.2)',
  },
  'dropdown': {
    color: '#000000',
    light: '0 2px 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.07)',
    dark: '0 2px 5px rgba(0, 0, 0, 0.3), 0 1px 3px rgba(0, 0, 0, 0.2)',
  },
} as const;

// Sistema de Sombras Legado (para compatibilidade)
export const boxShadow = {
  // 1. Direção da Sombra
  // Indica de onde vem a luz e para onde vai a sombra
  'shadow-down': '0 2px 4px rgba(0, 0, 0, 0.1)',
  'shadow-up': '0 -2px 4px rgba(0, 0, 0, 0.1)',
  'shadow-left': '-2px 0 4px rgba(0, 0, 0, 0.1)',
  'shadow-right': '2px 0 4px rgba(0, 0, 0, 0.1)',
  'shadow-around': '0 0 8px rgba(0, 0, 0, 0.1)',
  'shadow-all': '0 0 8px rgba(0, 0, 0, 0.1)', // Alias para shadow-around
  
  // 2. Intensidade / Elevação
  // Inspirado nos níveis de elevação do Material Design
  'shadow-xs': '0 1px 2px rgba(0, 0, 0, 0.05)',
  'shadow-sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
  'shadow-md': '0 4px 6px rgba(0, 0, 0, 0.1)',
  'shadow-lg': '0 10px 15px rgba(0, 0, 0, 0.1)',
  'shadow-xl': '0 20px 25px rgba(0, 0, 0, 0.1)',
  'shadow-2xl': '0 25px 50px rgba(0, 0, 0, 0.25)',
  
  // 3. Tipos Especiais
  // Casos específicos e efeitos únicos
  'shadow-inner': 'inset 0 2px 4px rgba(0, 0, 0, 0.06)',
  'shadow-float': '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
  'shadow-glow': '0 0 10px rgba(255, 255, 255, 0.08)',
  'shadow-none': 'none',
  
  // 4. Componentes Específicos
  // Sombras otimizadas para casos de uso comuns
  'shadow-card': '0 2px 5px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.04)',
  'shadow-button': '0 1px 3px rgba(0, 0, 0, 0.1)',
  'shadow-dropdown': '0 2px 5px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.07)',
  'shadow-modal': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
  'shadow-popover': '0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1)',
} as const;

// Sistema de Opacidade
export const opacity = {
  '0': '0',
  '5': '0.05',
  '10': '0.1',
  '15': '0.15',
  '20': '0.2',
  '25': '0.25',
  '30': '0.3',
  '40': '0.4',
  '50': '0.5',
  '60': '0.6',
  '70': '0.7',
  '75': '0.75',
  '80': '0.8',
  '85': '0.85',
  '90': '0.9',
  '95': '0.95',
  '100': '1',
} as const;

// Sistema de Z-Index
export const zIndex = {
  '0': 0,
  '10': 10,
  '20': 20,
  '30': 30,
  '40': 40,
  '50': 50,
  '60': 60,
  '70': 70,
  '80': 80,
  '90': 90,
  '100': 100,
  'auto': 'auto',
} as const;

// Sistema de Transições
export const transitionDuration = {
  '75': '75ms',
  '100': '100ms',
  '150': '150ms',
  '200': '200ms',
  '300': '300ms',
  '500': '500ms',
  '700': '700ms',
  '1000': '1000ms',
} as const;

// Tipos para facilitar o uso
export type ShadowType = keyof typeof shadows;
export type BoxShadowType = keyof typeof boxShadow;
export type OpacityType = keyof typeof opacity;
export type ZIndexType = keyof typeof zIndex;
export type TransitionDurationType = keyof typeof transitionDuration;

// Funções utilitárias para sombras inteligentes
export function getShadow(type: ShadowType, theme: 'light' | 'dark' = 'light'): string {
  return shadows[type][theme];
}

export function getShadowColor(type: ShadowType): string {
  return shadows[type].color;
}

// Funções legadas para compatibilidade
export function getBoxShadow(type: BoxShadowType): string {
  return boxShadow[type];
}

export function getOpacity(value: OpacityType): string {
  return opacity[value];
}

export function getZIndex(value: ZIndexType): number | 'auto' {
  return zIndex[value];
}

export function getTransitionDuration(value: TransitionDurationType): string {
  return transitionDuration[value];
}

// Funções de conveniência para diferentes tipos de efeitos
export const effects = {
  // Sistema novo de sombras inteligentes
  shadow: (type: ShadowType, theme: 'light' | 'dark' = 'light') => ({ 
    boxShadow: shadows[type][theme], 
    shadowColor: shadows[type].color 
  }),
  // Sistema legado
  boxShadow: (type: BoxShadowType) => ({ boxShadow: boxShadow[type] }),
  opacity: (value: OpacityType) => ({ opacity: opacity[value] }),
  zIndex: (value: ZIndexType) => ({ zIndex: zIndex[value] }),
  transition: (duration: TransitionDurationType) => ({ 
    transitionDuration: transitionDuration[duration] 
  }),
} as const; 