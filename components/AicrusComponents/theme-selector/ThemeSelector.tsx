import React, { useCallback, useEffect } from 'react';
import { Pressable, View, Platform, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  useSharedValue,
  useDerivedValue,
} from 'react-native-reanimated';

import { useTheme } from '@/hooks/ThemeContext';
import { colors } from '../constants/theme';

const THEME_ICONS = {
  system: 'desktop-outline',
  light: 'sunny-outline',
  dark: 'moon-outline',
} as const;

// Tamanhos predefinidos para o componente
export const THEME_SELECTOR_SIZES = {
  sm: {
    buttonWidth: 28,
    height: 28,
    iconSize: 14,
  },
  md: {
    buttonWidth: 32,
    height: 32,
    iconSize: 16,
  },
  lg: {
    buttonWidth: 40,
    height: 40,
    iconSize: 20,
  },
  xl: {
    buttonWidth: 48,
    height: 48,
    iconSize: 22,
  },
} as const;

// Estilos visuais predefinidos
export const THEME_SELECTOR_VARIANTS = {
  default: 'default',
  pill: 'pill',
  minimal: 'minimal',
  labeled: 'labeled',
} as const;

// Configurações específicas para cada plataforma com ajustes para evitar overshooting
const SPRING_CONFIG = Platform.select({
  web: {
    damping: 20,
    stiffness: 180,
    overshootClamping: true,
  },
  default: {
    damping: 25,
    stiffness: 250,
    mass: 0.5,
    overshootClamping: true,
  },
});

export type ThemeSelectorSize = keyof typeof THEME_SELECTOR_SIZES;
export type ThemeSelectorVariant = keyof typeof THEME_SELECTOR_VARIANTS;

interface ThemeSelectorProps {
  className?: string;
  size?: ThemeSelectorSize;
  variant?: ThemeSelectorVariant;
  showLabels?: boolean;
  showSystemOption?: boolean;
  customColors?: {
    background?: string;
    sliderBackground?: string;
    activeIconColor?: string;
    inactiveIconColor?: string;
  };
}

const getInitialPosition = (mode: 'system' | 'light' | 'dark', showSystemOption: boolean) => {
  if (!showSystemOption) {
    return mode === 'light' ? 0 : 1;
  }
  return mode === 'light' ? 0 : mode === 'dark' ? 1 : 2;
};

export function ThemeSelector({ 
  className = '',
  size = 'md',
  variant = 'default',
  showLabels = false,
  showSystemOption = true,
  customColors = {}
}: ThemeSelectorProps) {
  const { themeMode, setThemeMode, currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Obter dimensões com base no tamanho selecionado
  const { buttonWidth, height, iconSize } = THEME_SELECTOR_SIZES[size];
  const padding = Math.max(2, Math.floor(buttonWidth * 0.05)); // Padding proporcional
  
  // Definir modos disponíveis com base em showSystemOption
  const availableModes = showSystemOption 
    ? ['light', 'dark', 'system'] as const
    : ['light', 'dark'] as const;
    
  const containerWidth = buttonWidth * availableModes.length + padding * 2;
  
  // Calcular raio de borda com base na variante
  const getBorderRadius = () => {
    switch (variant) {
      case 'pill':
        return height / 2;
      case 'minimal':
        return 4;
      default:
        return 6; // default e labeled
    }
  };
  
  const borderRadius = getBorderRadius();
  
  // Configurar cores com base no tema atual e customizações
  const backgroundColors = {
    default: isDark ? colors.gray[800] : colors.gray[200],
    pill: isDark ? colors.gray[800] : colors.gray[200],
    minimal: 'transparent',
    labeled: isDark ? colors.gray[800] : colors.gray[200],
  };
  
  const sliderColors = {
    default: isDark ? colors.primary.dark : colors.primary.main,
    pill: isDark ? colors.primary.dark : colors.primary.main,
    minimal: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    labeled: isDark ? colors.primary.dark : colors.primary.main,
  };
  
  const backgroundColor = customColors.background || backgroundColors[variant];
  const sliderBackgroundColor = customColors.sliderBackground || sliderColors[variant];
  
  // Configurar posição inicial e animação
  const targetPosition = useSharedValue(getInitialPosition(themeMode, showSystemOption));
  
  // Atualiza a posição alvo quando o themeMode muda
  useEffect(() => {
    targetPosition.value = getInitialPosition(themeMode, showSystemOption);
  }, [themeMode, showSystemOption]);
  
  // Valor derivado para garantir que a animação fique dentro dos limites
  const clampedTranslateX = useDerivedValue(() => {
    const targetX = targetPosition.value * buttonWidth;
    // Anima para a posição alvo com spring
    return withSpring(targetX, SPRING_CONFIG);
  });

  const handlePress = useCallback((mode: 'system' | 'light' | 'dark') => {
    if (mode === themeMode) return; // Evita animações desnecessárias
    setThemeMode(mode);
  }, [setThemeMode, themeMode]);

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: clampedTranslateX.value }],
    };
  });

  // Função para determinar a cor do ícone
  const getIconColor = (mode: 'system' | 'light' | 'dark') => {
    // Se for o modo selecionado
    if (mode === themeMode) {
      // Cor personalizada ou branco para variantes com fundo colorido
      if (customColors.activeIconColor) {
        return customColors.activeIconColor;
      }
      
      // Para a variante minimal, usar cor primária
      if (variant === 'minimal') {
        return isDark ? colors.primary.dark : colors.primary.main;
      }
      
      // Para outros estilos, usar branco
      return '#FFFFFF';
    } 
    // Para os ícones não selecionados
    else {
      if (customColors.inactiveIconColor) {
        return customColors.inactiveIconColor;
      }
      return isDark ? colors.gray[400] : colors.gray[600];
    }
  };
  
  // Obter etiqueta baseada no modo
  const getLabel = (mode: 'system' | 'light' | 'dark') => {
    switch(mode) {
      case 'light': return 'Claro';
      case 'dark': return 'Escuro';
      case 'system': return 'Sistema';
    }
  };
  
  const renderSlider = () => {
    // Não renderizar o slider para a variante minimal
    if (variant === 'minimal') {
      return null;
    }
    
    return (
      <Animated.View 
        className="absolute rounded-md"
        style={[
          {
            position: 'absolute',
            width: buttonWidth - Math.max(1, Math.floor(buttonWidth * 0.03)),
            height: height - Math.max(4, Math.floor(height * 0.12)),
            borderRadius: variant === 'pill' ? height / 2 : 4,
            zIndex: 0,
            left: padding + Math.floor(buttonWidth * 0.01),
            top: Math.max(2, Math.floor(height * 0.06)),
            backgroundColor: sliderBackgroundColor,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 1,
            elevation: 1,
          },
          animatedSliderStyle,
        ]} 
      />
    );
  };

  return (
    <View className={`${className}`}>
      <View 
        className={`flex-row rounded-md relative items-center ${variant === 'labeled' ? 'mb-1' : ''}`}
        style={[
          { 
            flexDirection: 'row',
            borderRadius,
            padding,
            position: 'relative',
            width: containerWidth,
            height,
            backgroundColor,
            ...(variant === 'minimal' && {
              borderWidth: 0,
              borderColor: 'transparent',
            }),
          },
        ]}>
        {renderSlider()}
        
        {availableModes.map((mode, index) => (
          <Pressable
            key={mode}
            className={`items-center justify-center z-10 ${
              variant === 'pill' 
                ? index === 0 
                  ? 'rounded-l-full' 
                  : index === availableModes.length - 1 
                    ? 'rounded-r-full' 
                    : '' 
                : index === 0 
                  ? 'rounded-l-md' 
                  : index === availableModes.length - 1 
                    ? 'rounded-r-md' 
                    : ''
            }`}
            style={{
              width: buttonWidth,
              height: height - 2, // Pequeno ajuste para alinhar com o container
              alignItems: 'center',
              justifyContent: 'center',
              paddingBottom: Math.floor(buttonWidth * 0.02),
            }}
            onPress={() => handlePress(mode)}>
            <Ionicons
              name={THEME_ICONS[mode]}
              size={iconSize}
              color={getIconColor(mode)}
            />
            
            {variant === 'labeled' && showLabels && (
              <Text
                className="text-center mt-0.5"
                style={{
                  fontSize: Math.max(8, Math.floor(buttonWidth * 0.3)),
                  lineHeight: Math.max(10, Math.floor(buttonWidth * 0.36)),
                  color: getIconColor(mode),
                  opacity: mode === themeMode ? 1 : 0.8,
                }}
              >
                {getLabel(mode)}
              </Text>
            )}
          </Pressable>
        ))}
      </View>
      
      {variant === 'labeled' && showLabels && (
        <View className="flex-row justify-between" style={{ width: containerWidth }}>
          {availableModes.map((mode) => (
            <Text
              key={`label-${mode}`}
              className="text-center"
              style={{
                width: buttonWidth,
                fontSize: Math.max(9, Math.floor(buttonWidth * 0.32)),
                color: isDark ? colors.gray[400] : colors.gray[600],
                fontWeight: mode === themeMode ? '600' : '400',
              }}
            >
              {getLabel(mode)}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
} 