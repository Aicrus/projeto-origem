import React, { useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle, Platform } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSpring,
  interpolate,
  Easing
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/DesignSystemContext';
import { useResponsive } from '../../hooks/useResponsive';
import { getResponsiveValues } from '../../design-system/tokens/typography';

// Interfaces para tipagem
interface AccordionProps {
  type?: "single" | "multiple";
  collapsible?: boolean;
  defaultValue?: string | string[] | null;
  style?: ViewStyle;
  children: ReactNode;
}

interface AccordionItemProps {
  value: string;
  style?: ViewStyle;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
}

interface AccordionTriggerProps {
  style?: ViewStyle;
  children: ReactNode;
  isOpen?: boolean;
  onToggle?: () => void;
  enableHover?: boolean;
}

interface AccordionContentProps {
  style?: ViewStyle;
  children: ReactNode;
  isOpen?: boolean;
}

// Configurações de animação
const ANIMATION_CONFIG = {
  rotation: {
    duration: 300,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  },
  content: {
    duration: 400,
    dampingRatio: 0.8,
    stiffness: 150,
  },
  timing: {
    duration: 350,
    easing: Easing.bezier(0.4, 0, 0.2, 1),
  }
};

// Componente Accordion principal
export const Accordion: React.FC<AccordionProps> = ({ 
  type = "single", 
  collapsible = false, 
  defaultValue = null, 
  style = {}, 
  children 
}) => {
  const [openItems, setOpenItems] = useState<string[]>(() => {
    if (defaultValue) {
      return type === "single" ? [defaultValue as string] : Array.isArray(defaultValue) ? defaultValue : [defaultValue];
    }
    return [];
  });

  const toggleItem = (value: string) => {
    if (type === "single") {
      if (openItems.includes(value)) {
        // Se collapsible=false, não permite fechar o item atual
        setOpenItems(collapsible ? [] : openItems);
      } else {
        setOpenItems([value]);
      }
    } else {
      setOpenItems(prev => 
        prev.includes(value) 
          ? prev.filter(item => item !== value)
          : [...prev, value]
      );
    }
  };

  return (
    <View style={[{ width: '100%' }, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<AccordionItemProps>(child)) {
          return React.cloneElement(child, { 
            isOpen: openItems.includes(child.props.value),
            onToggle: () => toggleItem(child.props.value)
          });
        }
        return child;
      })}
    </View>
  );
};

// Componente AccordionItem
export const AccordionItem: React.FC<AccordionItemProps> = ({ 
  value, 
  style = {}, 
  children, 
  isOpen, 
  onToggle 
}) => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  return (
    <View style={[{ 
      borderBottomWidth: 1, 
      borderBottomColor: isDark ? '#262D34' : '#E0E3E7',
      overflow: 'hidden'
    }, style]}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement<AccordionTriggerProps | AccordionContentProps>(child)) {
          return React.cloneElement(child, { isOpen, onToggle });
        }
        return child;
      })}
    </View>
  );
};

// Componente AccordionTrigger com tipografia responsiva
export const AccordionTrigger: React.FC<AccordionTriggerProps> = ({ 
  style = {}, 
  children, 
  isOpen = false, 
  onToggle,
  enableHover = false
}) => {
  const rotation = useSharedValue(isOpen ? 180 : 0);
  const [isHovered, setIsHovered] = useState(false);
  const { currentTheme } = useTheme();
  const { responsive } = useResponsive();
  const isDark = currentTheme === 'dark';

  React.useEffect(() => {
    rotation.value = withTiming(
      isOpen ? 180 : 0, 
      ANIMATION_CONFIG.rotation
    );
  }, [isOpen, rotation]);

  const animatedIconStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  // Tipografia usando tokens do design system - Body-lg responsivo
  const triggerTypography = getResponsiveValues('body-lg');
  const triggerFontSize = responsive(triggerTypography.fontSize);
  const triggerLineHeight = responsive(triggerTypography.lineHeight);

  const triggerPadding = responsive({
    mobile: 12,
    tablet: 14,
    desktop: 16,
    default: 14
  });

  const iconSize = responsive({
    mobile: 14,
    tablet: 15,
    desktop: 16,
    default: 15
  });

  const baseTextStyle: TextStyle = {
    fontSize: triggerFontSize, 
    fontWeight: triggerTypography.fontWeight as any,
    fontFamily: triggerTypography.fontFamily,
    flex: 1,
    color: isDark ? '#FFFFFF' : '#14181B',
    lineHeight: triggerLineHeight
  };

  const hoverTextStyle: TextStyle = {
    ...baseTextStyle,
    borderBottomWidth: 1,
    borderBottomColor: isDark ? '#606c38' : '#687789',
    borderStyle: 'dashed',
    paddingBottom: 2
  };

  return (
    <TouchableOpacity
      style={[{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: triggerPadding,
        paddingHorizontal: 4,
        width: '100%',
        backgroundColor: isHovered ? (isDark ? '#FFFFFF08' : '#00000008') : 'transparent'
      }, style]}
      onPress={onToggle}
      activeOpacity={0.7}
      onPressIn={() => enableHover && setIsHovered(true)}
      onPressOut={() => enableHover && setIsHovered(false)}
    >
      <Text style={enableHover && isHovered ? hoverTextStyle : baseTextStyle}>
        {children}
      </Text>
      <Animated.View style={[animatedIconStyle]}>
        <ChevronDown 
          size={iconSize} 
          color={isDark ? '#95A1AC' : '#57636C'} 
          strokeWidth={2} 
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

// Componente AccordionContent com altura proporcional
export const AccordionContent: React.FC<AccordionContentProps> = ({ 
  style = {}, 
  children, 
  isOpen = false 
}) => {
  const heightProgress = useSharedValue(isOpen ? 1 : 0);
  const opacityProgress = useSharedValue(isOpen ? 1 : 0);
  const [contentHeight, setContentHeight] = useState(0);
  const [hasInitialHeight, setHasInitialHeight] = useState(false);
  const { responsive } = useResponsive();

  // Padding responsivo para o conteúdo
  const contentPadding = responsive({
    mobile: 12,
    tablet: 14,
    desktop: 16,
    default: 14
  });

  // Tipografia para conteúdo usando tokens do design system - Body-md
  const contentTypography = getResponsiveValues('body-md');
  const contentFontSize = responsive(contentTypography.fontSize);
  const contentLineHeight = responsive(contentTypography.lineHeight);

  React.useEffect(() => {
    // No nativo, só anima depois de ter a altura inicial
    // Na web, anima imediatamente
    const shouldAnimate = Platform.OS === 'web' || hasInitialHeight;
    
    if (shouldAnimate) {
      if (isOpen) {
        heightProgress.value = withSpring(1, ANIMATION_CONFIG.content);
        opacityProgress.value = withTiming(1, { 
          duration: ANIMATION_CONFIG.timing.duration / 2,
          easing: ANIMATION_CONFIG.timing.easing 
        });
      } else {
        heightProgress.value = withTiming(0, ANIMATION_CONFIG.timing);
        opacityProgress.value = withTiming(0, { 
          duration: ANIMATION_CONFIG.timing.duration / 3,
          easing: ANIMATION_CONFIG.timing.easing 
        });
        
        // No nativo, reset o estado quando fecha para medir novamente na próxima abertura
        if (Platform.OS !== 'web') {
          setTimeout(() => {
            setHasInitialHeight(false);
          }, ANIMATION_CONFIG.timing.duration);
        }
      }
    }
  }, [isOpen, heightProgress, opacityProgress, hasInitialHeight]);

  const animatedStyle = useAnimatedStyle(() => {
    // Usar altura mínima de 100px se contentHeight não estiver disponível
    const targetHeight = contentHeight > 16 ? contentHeight : 100;
    
    const height = interpolate(
      heightProgress.value,
      [0, 1],
      [0, targetHeight]
    );

    return {
      height: height,
      opacity: opacityProgress.value,
    };
  });

  const animatedContentStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: interpolate(
            heightProgress.value,
            [0, 1],
            [-8, 0] // Animação mais suave
          ),
        },
      ],
    };
  });



  // No nativo, se está aberto mas ainda não tem altura, renderiza invisível primeiro
  if (Platform.OS !== 'web' && isOpen && !hasInitialHeight) {
    return (
      <View style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        <View 
          onLayout={(event) => {
            const { height } = event.nativeEvent.layout;
            if (height > 0) {
              setContentHeight(height);
              setHasInitialHeight(true);
            }
          }}
          style={[{ 
            paddingHorizontal: 4, 
            paddingBottom: contentPadding,
            paddingTop: 4,
          }, style]}
        >
          {children}
        </View>
      </View>
    );
  }

  return (
    <Animated.View style={[{ overflow: 'hidden' }, animatedStyle]}>
      <Animated.View 
        style={[
          animatedContentStyle,
          // No nativo, força posição absoluta durante a animação para evitar re-layout
          Platform.OS !== 'web' && isOpen && contentHeight > 0 ? {
            position: 'absolute',
            width: '100%',
            height: contentHeight
          } : {}
        ]}
        onLayout={(event) => {
          const { height } = event.nativeEvent.layout;
          // Na web, sempre atualiza a altura para ser proporcional ao conteúdo
          if (Platform.OS === 'web' && height > 0) {
            setContentHeight(height);
          }
        }}
      >
        <View style={[{ 
          paddingHorizontal: 4, 
          paddingBottom: contentPadding,
          paddingTop: 4 // Pequeno espaço no topo
        }, style]}>
          {children}
        </View>
      </Animated.View>
    </Animated.View>
  );
};

// === HELPERS DE TIPOGRAFIA ===

/**
 * Hook para obter estilos de tipografia do accordion
 * 
 * @example
 * const { triggerStyle, contentStyle } = useAccordionTypography();
 * 
 * // Para trigger (títulos):
 * <Text style={triggerStyle}>Título</Text>
 * 
 * // Para content (descrições):  
 * <Text style={contentStyle}>Descrição</Text>
 */
export const useAccordionTypography = () => {
  const { responsive } = useResponsive();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // Usa body-lg para trigger (títulos)
  const triggerTypography = getResponsiveValues('body-lg');
  const triggerStyle = {
    fontSize: responsive(triggerTypography.fontSize),
    lineHeight: responsive(triggerTypography.lineHeight),
    fontWeight: triggerTypography.fontWeight,
    fontFamily: triggerTypography.fontFamily,
    color: isDark ? '#FFFFFF' : '#14181B'
  };

  // Usa body-md para content (descrições)
  const contentTypography = getResponsiveValues('body-md');
  const contentStyle = {
    fontSize: responsive(contentTypography.fontSize),
    lineHeight: responsive(contentTypography.lineHeight),
    fontWeight: contentTypography.fontWeight,
    fontFamily: contentTypography.fontFamily,
    color: isDark ? '#95A1AC' : '#57636C'
  };

  return { triggerStyle, contentStyle };
};

// === PRÉ-CONFIGURAÇÕES ELEGANTES ===

// FAQ - Apenas uma resposta visível por vez
export const FAQAccordion: React.FC<{ children: ReactNode; style?: ViewStyle }> = ({ 
  children, 
  style 
}) => (
  <Accordion type="single" collapsible={true} style={style}>
    {children}
  </Accordion>
);

// Settings - Múltiplas seções abertas
export const SettingsAccordion: React.FC<{ 
  children: ReactNode; 
  style?: ViewStyle;
  defaultOpen?: string[];
}> = ({ 
  children, 
  style,
  defaultOpen
}) => (
  <Accordion type="multiple" defaultValue={defaultOpen} style={style}>
    {children}
  </Accordion>
);

// Info - Sempre mantém uma seção aberta
export const InfoAccordion: React.FC<{ 
  children: ReactNode; 
  style?: ViewStyle;
  defaultOpen?: string;
}> = ({ 
  children, 
  style,
  defaultOpen = "tech" // Usar o valor correto que está sendo usado na tela dev
}) => (
  <Accordion type="single" collapsible={false} defaultValue={defaultOpen} style={style}>
    {children}
  </Accordion>
);

