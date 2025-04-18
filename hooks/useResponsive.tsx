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
  // Obtém as dimensões iniciais e calcula breakpoints imediatamente
  const initialDimensions = Dimensions.get('window');
  const initialBreakpoint = getCurrentBreakpoint(initialDimensions.width);
  
  // Define estados com valores pré-calculados para evitar atrasos iniciais
  const [dimensions, setDimensions] = useState<ScaledSize>(initialDimensions);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>(initialBreakpoint);
  
  // Armazena o último breakpoint detectado para comparação rápida
  const lastBreakpointRef = useRef(initialBreakpoint);
  const dimensionsRef = useRef(initialDimensions);
  
  // Cria flags de breakpoint diretamente a partir das dimensões atuais
  // em vez de depender do estado, para maior responsividade
  const { width, height } = dimensions;
  const isMobile = isMobileWidth(width);
  const isTablet = isTabletWidth(width);
  const isDesktop = isDesktopWidth(width);
  
  // Orientação do dispositivo
  const isPortrait = height > width;
  const isLandscape = width > height;
  
  // Função otimizada para atualizar dimensões sem debounce para maior rapidez
  const updateDimensions = useCallback(() => {
    const newDimensions = Dimensions.get('window');
    const newWidth = newDimensions.width;
    const newHeight = newDimensions.height;
    
    // Verifica se as dimensões realmente mudaram
    if (dimensionsRef.current.width !== newWidth || dimensionsRef.current.height !== newHeight) {
      // Executa atualizações de dimensão de forma síncrona
      dimensionsRef.current = newDimensions;
      setDimensions(newDimensions);
      
      // Calcula o novo breakpoint imediatamente
      const newBreakpoint = getCurrentBreakpoint(newWidth);
      
      // Só atualiza o estado se o breakpoint realmente mudou
      if (lastBreakpointRef.current !== newBreakpoint) {
        lastBreakpointRef.current = newBreakpoint;
        setCurrentBreakpoint(newBreakpoint);
        console.log(`[Responsive] Breakpoint mudou para: ${newBreakpoint}, largura: ${newWidth}px`);
      }
    }
  }, []);
  
  useEffect(() => {
    // Configura os listeners de mudança de dimensões
    if (Platform.OS === 'web') {
      // Executa imediatamente para garantir o estado correto
      updateDimensions();
      
      // Adiciona verificação redundante para garantir que o breakpoint foi aplicado
      requestAnimationFrame(() => {
        updateDimensions();
      });
      
      const handleResize = () => {
        // Executa a atualização imediatamente, sem debounce
        updateDimensions();
        
        // Verifica novamente após o processo de renderização para garantir consistência
        requestAnimationFrame(() => {
          updateDimensions();
        });
      };
      
      if (typeof window !== 'undefined') {
        window.addEventListener('resize', handleResize);
        window.addEventListener('orientationchange', handleResize);
        
        return () => {
          window.removeEventListener('resize', handleResize);
          window.removeEventListener('orientationchange', handleResize);
        };
      }
    } else {
      // Em dispositivos móveis, usamos a API de dimensões
      updateDimensions();
      
      const subscription = Dimensions.addEventListener('change', ({ window }) => {
        // Atualiza os refs e estados imediatamente
        dimensionsRef.current = window;
        setDimensions(window);
        
        const newBreakpoint = getCurrentBreakpoint(window.width);
        if (lastBreakpointRef.current !== newBreakpoint) {
          lastBreakpointRef.current = newBreakpoint;
          setCurrentBreakpoint(newBreakpoint);
        }
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
    // Usar verificações diretas com base na largura atual
    // em vez de confiar nos estados para maior responsividade
    const currentWidth = dimensionsRef.current.width;
    
    if (isMobileWidth(currentWidth) && options.mobile !== undefined) {
      return options.mobile;
    }
    if (isTabletWidth(currentWidth) && options.tablet !== undefined) {
      return options.tablet;
    }
    if (isDesktopWidth(currentWidth) && options.desktop !== undefined) {
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