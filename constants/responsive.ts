/**
 * Breakpoints da Aplicação
 * Estes valores são usados para controlar o comportamento responsivo em diferentes tamanhos de tela
 */

// Breakpoints de tamanho de tela
export const BREAKPOINTS = {
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
};

/**
 * Verifica se a largura atual corresponde a um tamanho de celular
 * @param width - Largura da tela
 * @returns true se estiver na faixa de celular
 */
export const isMobileWidth = (width: number): boolean => {
  // Mobile: < 740px
  return width < BREAKPOINTS.MOBILE;
};

/**
 * Verifica se a largura atual corresponde a um tamanho de tablet pequeno
 * @param width - Largura da tela
 * @returns true se estiver na faixa de tablet pequeno
 */
export const isSmallTabletWidth = (width: number): boolean => {
  // Função mantida para compatibilidade, mas não usamos mais este breakpoint
  return width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.TABLET;
};

/**
 * Verifica se a largura atual corresponde a um tamanho de tablet
 * @param width - Largura da tela
 * @returns true se estiver na faixa de tablet
 */
export const isTabletWidth = (width: number): boolean => {
  // Tablet: >= 740px e < 1200px
  return width >= BREAKPOINTS.MOBILE && width < BREAKPOINTS.DESKTOP;
};

/**
 * Verifica se a largura atual corresponde a um tamanho de desktop
 * @param width - Largura da tela
 * @returns true se estiver na faixa de desktop
 */
export const isDesktopWidth = (width: number): boolean => {
  // Desktop: >= 1200px
  return width >= BREAKPOINTS.DESKTOP;
};

/**
 * Retorna o breakpoint atual baseado na largura
 * @param width - Largura da tela
 * @returns string indicando o breakpoint atual
 */
export const getCurrentBreakpoint = (width: number): string => {
  if (width <= BREAKPOINTS.SMALL_MOBILE) return 'SMALL_MOBILE';
  if (width < BREAKPOINTS.MOBILE) return 'MOBILE';
  if (width < BREAKPOINTS.TABLET) return 'TABLET';
  if (width < BREAKPOINTS.LARGE_DESKTOP) return 'DESKTOP';
  return 'LARGE_DESKTOP';
};

// Espaçamentos responsivos que mudam com o tamanho da tela
export const RESPONSIVE_SPACING = {
  getPagePadding: (width: number): number => {
    if (width <= BREAKPOINTS.MOBILE) return 16;
    if (width <= BREAKPOINTS.TABLET) return 24;
    if (width <= BREAKPOINTS.DESKTOP) return 32;
    return 48;
  },
  getGap: (width: number): number => {
    if (width <= BREAKPOINTS.MOBILE) return 8;
    if (width <= BREAKPOINTS.TABLET) return 12;
    if (width <= BREAKPOINTS.DESKTOP) return 16;
    return 24;
  }
}; 