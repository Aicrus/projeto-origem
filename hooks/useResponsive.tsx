import { useEffect, useState, useCallback, useRef } from 'react';
import { Dimensions, Platform, ScaledSize } from 'react-native';
import { 
  BREAKPOINTS, 
  isMobileWidth, 
  isTabletWidth, 
  isDesktopWidth,
  getCurrentBreakpoint
} from '../constants/responsive';

/**
 * Hook que fornece informações sobre o tamanho da tela e breakpoints
 * para ajudar na implementação de layouts responsivos
 */
export function useResponsive() {
  const [dimensions, setDimensions] = useState<ScaledSize>(Dimensions.get('window'));
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>(
    getCurrentBreakpoint(Dimensions.get('window').width)
  );
  
  // Referência para evitar renderizações desnecessárias
  const dimensionsRef = useRef(dimensions);
  
  // Largura e altura da tela atual
  const { width, height } = dimensions;
  
  // Flags para os diferentes breakpoints - usando os limites exatos definidos
  const isMobile = isMobileWidth(width);
  const isTablet = isTabletWidth(width);
  const isDesktop = isDesktopWidth(width);
  
  // Orientação do dispositivo
  const isPortrait = height > width;
  const isLandscape = width > height;
  
  // Função para atualizar dimensões com debounce
  const updateDimensions = useCallback(() => {
    const newDimensions = Dimensions.get('window');
    
    // Verifica se as dimensões realmente mudaram
    if (
      dimensionsRef.current.width !== newDimensions.width || 
      dimensionsRef.current.height !== newDimensions.height
    ) {
      const newBreakpoint = getCurrentBreakpoint(newDimensions.width);
      setDimensions(newDimensions);
      dimensionsRef.current = newDimensions;
      
      if (newBreakpoint !== currentBreakpoint) {
        setCurrentBreakpoint(newBreakpoint);
        console.log(`[Responsive] Breakpoint mudou para: ${newBreakpoint}, largura: ${newDimensions.width}px`);
      }
    }
  }, [currentBreakpoint]);
  
  useEffect(() => {
    // Configura os listeners de mudança de dimensões
    if (Platform.OS === 'web') {
      let debounceTimer: NodeJS.Timeout | null = null;
      
      const handleResize = () => {
        if (debounceTimer) {
          clearTimeout(debounceTimer);
        }
        
        debounceTimer = setTimeout(() => {
          updateDimensions();
        }, 150);
      };
      
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('orientationchange', handleResize);
          if (debounceTimer) clearTimeout(debounceTimer);
        };
      }
    } else {
      // Em dispositivos móveis, usamos a API de dimensões
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
        setDimensions(window);
        dimensionsRef.current = window;
        setCurrentBreakpoint(getCurrentBreakpoint(window.width));
      });
      
      return () => {
        subscription.remove();
      };
    }
  }, [updateDimensions]);
  
  /**
   * Função que retorna um valor de acordo com o breakpoint atual
   * @param options Objeto com valores para cada breakpoint
   * @returns O valor correspondente ao breakpoint atual
   */
  function responsive<T>(options: {
    mobile?: T;
    tablet?: T;
    desktop?: T;
    default: T;
  }): T {
    if (isMobile && options.mobile !== undefined) {
      return options.mobile;
    }
    if (isTablet && options.tablet !== undefined) {
      return options.tablet;
    }
    if (isDesktop && options.desktop !== undefined) {
      return options.desktop;
    }
    return options.default;
  }
  
  return {
    width,
    height,
    isMobile,
    isTablet,
    isDesktop,
    isPortrait,
    isLandscape,
    breakpoints: BREAKPOINTS,
    responsive,
    currentBreakpoint,
  };
} 