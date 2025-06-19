import React, { useState, ReactNode } from 'react';
import { View, Text, TouchableOpacity, ViewStyle, TextStyle } from 'react-native';
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

  // Tipografia usando tokens do design system - Body-lg como base
  const triggerFontSize = responsive({
    mobile: 16,      // body-md + 2 (era 14)
    tablet: 15,      // entre body-md e body-lg
    desktop: 16,     // body-lg
    default: 16      // nativo + 2 (era 14)
  });

  const triggerLineHeight = responsive({
    mobile: 22,      // body-md line-height + 2 (era 20)
    tablet: 22,      // intermediário
    desktop: 24,     // body-lg line-height
    default: 22      // nativo + 2 (era 20)
  });

  const triggerFontWeight = responsive({
    mobile: '400',   // body weight padrão
    tablet: '400',   
    desktop: '400',  // body-lg weight
    default: '400'
  });

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
    fontWeight: triggerFontWeight as any, 
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
  const [hasLayoutRun, setHasLayoutRun] = useState(false);
  const { responsive } = useResponsive();

  // Padding responsivo para o conteúdo
  const contentPadding = responsive({
    mobile: 12,
    tablet: 14,
    desktop: 16,
    default: 14
  });

  // Tipografia para conteúdo - Body-md como base
  const contentFontSize = responsive({
    mobile: 14,      // body-sm + 2 (era 12)
    tablet: 13,      // entre body-sm e body-md
    desktop: 14,     // body-md
    default: 14      // nativo + 2 (era 12)
  });

  const contentLineHeight = responsive({
    mobile: 20,      // body-sm line-height + 2 (era 18)
    tablet: 19,      // intermediário
    desktop: 20,     // body-md line-height
    default: 20      // nativo + 2 (era 18)
  });

  React.useEffect(() => {
    // Só anima se já temos a altura do conteúdo ou se está fechando
    if (hasLayoutRun || !isOpen) {
      if (isOpen) {
        // Para abrir: primeiro define a opacidade, depois a altura
        opacityProgress.value = withTiming(1, { 
          duration: ANIMATION_CONFIG.timing.duration / 3,
          easing: ANIMATION_CONFIG.timing.easing 
        });
        heightProgress.value = withSpring(1, ANIMATION_CONFIG.content);
      } else {
        // Para fechar: primeiro a altura, depois a opacidade
        heightProgress.value = withTiming(0, ANIMATION_CONFIG.timing);
        opacityProgress.value = withTiming(0, { 
          duration: ANIMATION_CONFIG.timing.duration / 4,
          easing: ANIMATION_CONFIG.timing.easing 
        });
      }
    }
  }, [isOpen, heightProgress, opacityProgress, contentHeight, hasLayoutRun]);

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

  const handleLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    
    // Só atualiza se a altura for significativamente diferente e maior que 16
    if (height > 16 && Math.abs(contentHeight - height) > 2) {
      setContentHeight(height);
      setHasLayoutRun(true);
    }
  };

  // Para itens que devem estar abertos inicialmente, renderiza primeiro sem animação
  // para capturar a altura correta
  if (isOpen && !hasLayoutRun) {
    return (
      <View style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
        <View 
          onLayout={handleLayout}
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
      <Animated.View style={[animatedContentStyle]}>
        <View style={[{ 
          paddingHorizontal: 4, 
          paddingBottom: contentPadding,
          paddingTop: 4, // Pequeno espaço no topo
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

  const triggerStyle = {
    fontSize: responsive({
      mobile: 16,      // body-md + 2 (era 14)
      tablet: 15,      // entre body-md e body-lg
      desktop: 16,     // body-lg
      default: 16      // nativo + 2 (era 14)
    }),
    lineHeight: responsive({
      mobile: 22,      // body-md line-height + 2 (era 20)
      tablet: 22,      // intermediário
      desktop: 24,     // body-lg line-height
      default: 22      // nativo + 2 (era 20)
    }),
    fontWeight: '400' as const,
    color: isDark ? '#FFFFFF' : '#14181B'
  };

  const contentStyle = {
    fontSize: responsive({
      mobile: 14,      // body-sm + 2 (era 12)
      tablet: 13,      // entre body-sm e body-md
      desktop: 14,     // body-md
      default: 14      // nativo + 2 (era 12)
    }),
    lineHeight: responsive({
      mobile: 20,      // body-sm line-height + 2 (era 18)
      tablet: 19,      // intermediário
      desktop: 20,     // body-md line-height
      default: 20      // nativo + 2 (era 18)
    }),
    fontWeight: '400' as const,
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

