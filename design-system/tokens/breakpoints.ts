/**
 * SISTEMA DE BREAKPOINTS
 * ------------------------------
 * Define todos os breakpoints responsivos do sistema de design.
 * Controla o comportamento em diferentes tamanhos de tela.
 */

// Breakpoints de tamanho de tela
export const breakpoints = {
  // Celulares pequenos (até iPhone SE)
  SMALL_MOBILE: 320, 
  
  // Breakpoint principal para mobile
  MOBILE: 740,
  
  // Tablets
  TABLET: 1200,
  
  // Desktops
  DESKTOP: 1200,
  
  // Telas grandes
  LARGE_DESKTOP: 1600,
} as const;

/**
 * Verifica se a largura atual corresponde a um tamanho de celular
 * @param width - Largura da tela
 * @returns true se estiver na faixa de celular
 */
export const isMobileWidth = (width: number): boolean => {
  // Mobile: < 740px
  return width < breakpoints.MOBILE;
};

/**
 * Verifica se a largura atual corresponde a um tamanho de tablet pequeno
 * @param width - Largura da tela
 * @returns true se estiver na faixa de tablet pequeno
 */
export const isSmallTabletWidth = (width: number): boolean => {
  // Função mantida para compatibilidade, mas não usamos mais este breakpoint
  return width >= breakpoints.MOBILE && width < breakpoints.TABLET;
};

/**
 * Verifica se a largura atual corresponde a um tamanho de tablet
 * @param width - Largura da tela
 * @returns true se estiver na faixa de tablet
 */
export const isTabletWidth = (width: number): boolean => {
  // Tablet: >= 740px e < 1200px
  return width >= breakpoints.MOBILE && width < breakpoints.DESKTOP;
};

/**
 * Verifica se a largura atual corresponde a um tamanho de desktop
 * @param width - Largura da tela
 * @returns true se estiver na faixa de desktop
 */
export const isDesktopWidth = (width: number): boolean => {
  // Desktop: >= 1200px
  return width >= breakpoints.DESKTOP;
};

/**
 * Retorna o breakpoint atual baseado na largura
 * @param width - Largura da tela
 * @returns string indicando o breakpoint atual
 */
export const getCurrentBreakpoint = (width: number): string => {
  if (width <= breakpoints.SMALL_MOBILE) return 'SMALL_MOBILE';
  if (width < breakpoints.MOBILE) return 'MOBILE';
  if (width < breakpoints.TABLET) return 'TABLET';
  if (width < breakpoints.LARGE_DESKTOP) return 'DESKTOP';
  return 'LARGE_DESKTOP';
};

// Espaçamentos responsivos que mudam com o tamanho da tela
export const responsiveSpacing = {
  getPagePadding: (width: number): number => {
    if (width <= breakpoints.MOBILE) return 16;
    if (width <= breakpoints.TABLET) return 24;
    if (width <= breakpoints.DESKTOP) return 32;
    return 48;
  },
  getGap: (width: number): number => {
    if (width <= breakpoints.MOBILE) return 8;
    if (width <= breakpoints.TABLET) return 12;
    if (width <= breakpoints.DESKTOP) return 16;
    return 24;
  }
} as const;

// Tipos para facilitar o uso
export type BreakpointType = keyof typeof breakpoints;

// Função utilitária para obter breakpoint
export function getBreakpoint(name: BreakpointType): number {
  return breakpoints[name];
} 