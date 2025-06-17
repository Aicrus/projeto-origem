import { useEffect, useState, useCallback, useRef } from 'react';
import { Dimensions, Platform, ScaledSize, useWindowDimensions } from 'react-native';
import { 
  breakpoints as BREAKPOINTS, 
  isMobileWidth, 
  isTabletWidth, 
  isDesktopWidth,
  getCurrentBreakpoint
} from '../design-system';

/**
 * Obtém breakpoint inicial baseado no user agent ou dimensões da janela
 * Evita flash de conteúdo durante o carregamento
 */
const getInitialBreakpoint = (): {
  dimensions: ScaledSize; 
  breakpoint: string;
} => {
  // Em ambientes nativos, usa as dimensões normalmente
  if (Platform.OS !== 'web') {
    const dims = Dimensions.get('window');
    return {
      dimensions: dims,
      breakpoint: getCurrentBreakpoint(dims.width)
    };
  }
  
  // No SSR, fornece valores padrão para desktop
  // para evitar layout shift durante a hidratação
  if (typeof window === 'undefined') {
    return {
      dimensions: { width: BREAKPOINTS.DESKTOP, height: 900, scale: 1, fontScale: 1 },
      breakpoint: 'DESKTOP'
    };
  }
  
  // No navegador, obtém dimensões da janela
  const width = window.innerWidth;
  const height = window.innerHeight;
  const dims = { width, height, scale: 1, fontScale: 1 };
  
  return {
    dimensions: dims,
    breakpoint: getCurrentBreakpoint(width)
  };
};

/**
 * Hook que fornece informações sobre o tamanho da tela e breakpoints
 * para ajudar na implementação de layouts responsivos
 */
export function useResponsive() {
  // Obtém as dimensões iniciais e calcula breakpoints usando a otimização para web
  const initialState = getInitialBreakpoint();
  
  // Para dispositivos nativos, useWindowDimensions é mais eficiente
  const windowDimensions = useWindowDimensions();
  
  // Define estados com valores pré-calculados para evitar atrasos iniciais
  const [dimensions, setDimensions] = useState<ScaledSize>(initialState.dimensions);
  const [currentBreakpoint, setCurrentBreakpoint] = useState<string>(initialState.breakpoint);
  
  // Armazena o último breakpoint detectado para comparação rápida
  const lastBreakpointRef = useRef(initialState.breakpoint);
  const dimensionsRef = useRef(initialState.dimensions);
  
  // Cria flags de breakpoint diretamente a partir das dimensões atuais
  // em vez de depender do estado, para maior responsividade
  const { width, height } = Platform.OS === 'web' ? dimensions : windowDimensions;
  const isMobile = isMobileWidth(width);
  const isTablet = isTabletWidth(width);
  const isDesktop = isDesktopWidth(width);
  
  // Orientação do dispositivo
  const isPortrait = height > width;
  const isLandscape = width > height;
  
  // Função otimizada para atualizar dimensões sem debounce para maior rapidez
  const updateDimensions = useCallback(() => {
    const newDimensions = Platform.OS === 'web' 
      ? { width: window.innerWidth, height: window.innerHeight, scale: 1, fontScale: 1 }
      : Dimensions.get('window');
    
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
      // Em dispositivos nativos, useWindowDimensions já cuidará das atualizações
      // mas ainda atualizamos o breakpoint quando necessário
      if (width !== dimensionsRef.current.width || height !== dimensionsRef.current.height) {
        dimensionsRef.current = { width, height, scale: 1, fontScale: 1 };
        
        const newBreakpoint = getCurrentBreakpoint(width);
        if (lastBreakpointRef.current !== newBreakpoint) {
          lastBreakpointRef.current = newBreakpoint;
          setCurrentBreakpoint(newBreakpoint);
          console.log(`[Responsive] Breakpoint mudou para: ${newBreakpoint}, largura: ${width}px`);
        }
      }
    }
  }, [updateDimensions, width, height]);
  
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
    const currentWidth = Platform.OS === 'web' ? dimensionsRef.current.width : width;
    
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