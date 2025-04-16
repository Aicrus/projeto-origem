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
  toggle: 'toggle',
  single: 'single', // Novo estilo: botão único para alternar temas
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
    textColor?: string;
    activeTextColor?: string;
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
    
  // No caso do toggle, só usar 'light' e 'dark'
  const toggleModes = ['light', 'dark'] as const;
  
  // Calcular largura do container
  const containerWidth = variant === 'toggle'
    ? buttonWidth * 2
    : variant === 'single'
      ? buttonWidth
      : buttonWidth * availableModes.length + padding * 2;
  
  // Calcular raio de borda com base na variante
  const getBorderRadius = () => {
    switch (variant) {
      case 'pill':
        return height / 2;
      case 'minimal':
        return 4;
      case 'toggle':
        return height / 2;
      case 'single':
        return height / 2; // Single é redondo como o pill
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
    toggle: isDark ? colors.gray[700] : colors.gray[300],
    single: isDark ? colors.gray[700] : colors.gray[300],
  };
  
  const sliderColors = {
    default: isDark ? colors.primary.dark : colors.primary.main,
    pill: isDark ? colors.primary.dark : colors.primary.main,
    minimal: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
    labeled: isDark ? colors.primary.dark : colors.primary.main,
    toggle: isDark ? colors.primary.dark : colors.primary.main,
    single: isDark ? colors.primary.dark : colors.primary.main,
  };
  
  const activeTextColors = {
    default: '#FFFFFF',
    pill: '#FFFFFF',
    minimal: isDark ? colors.primary.dark : colors.primary.main,
    labeled: '#FFFFFF',
    toggle: '#FFFFFF',
    single: '#FFFFFF',
  };
  
  const textColors = {
    default: isDark ? colors.gray[400] : colors.gray[600],
    pill: isDark ? colors.gray[400] : colors.gray[600],
    minimal: isDark ? colors.gray[400] : colors.gray[600],
    labeled: isDark ? colors.gray[400] : colors.gray[600],
    toggle: isDark ? '#FFFFFF' : colors.gray[800],
    single: isDark ? '#FFFFFF' : colors.gray[800],
  };
  
  const backgroundColor = customColors.background || backgroundColors[variant];
  const sliderBackgroundColor = customColors.sliderBackground || sliderColors[variant];
  const activeTextColor = customColors.activeTextColor || activeTextColors[variant];
  const textColor = customColors.textColor || textColors[variant];
  
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

  // Função específica para o estilo "single" que alterna entre claro e escuro
  const handleSinglePress = useCallback(() => {
    const newMode = themeMode === 'light' ? 'dark' : 'light';
    setThemeMode(newMode);
  }, [themeMode, setThemeMode]);

  const animatedSliderStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: clampedTranslateX.value }],
    };
  });

  // Função para determinar a cor do ícone
  const getIconColor = (mode: 'system' | 'light' | 'dark') => {
    // Se for o modo selecionado
    if (mode === themeMode) {
      // Cor personalizada ou cor ativa para o ícone
      if (customColors.activeIconColor) {
        return customColors.activeIconColor;
      }
      
      // Para a variante minimal, usar cor primária
      if (variant === 'minimal') {
        return isDark ? colors.primary.dark : colors.primary.main;
      }
      
      // Para outros estilos, usar branco
      return activeTextColor;
    } 
    // Para os ícones não selecionados
    else {
      if (customColors.inactiveIconColor) {
        return customColors.inactiveIconColor;
      }
      return textColor;
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
            borderRadius: variant === 'pill' || variant === 'toggle' ? height / 2 : 4,
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

  // Estilo single - botão único para alternar entre claro/escuro
  if (variant === 'single') {
    return (
      <View className={`${className}`}>
        <Pressable
          style={{
            width: buttonWidth,
            height: height,
            borderRadius: height / 2,
            backgroundColor: isDark ? colors.primary.dark : colors.primary.main,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
            elevation: 2,
          }}
          onPress={handleSinglePress}
        >
          <Ionicons
            name={themeMode === 'light' ? THEME_ICONS.light : THEME_ICONS.dark}
            size={iconSize}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    );
  }

  // Renderiza o estilo toggle (apenas dois estados)
  if (variant === 'toggle') {
    return (
      <View className={`${className}`}>
        <View 
          style={{
            width: buttonWidth * 2,
            height: height,
            backgroundColor,
            borderRadius: height / 2,
            padding: 2,
            position: 'relative',
          }}
        >
          <Animated.View 
            style={[
              {
                position: 'absolute',
                width: buttonWidth - 4,
                height: height - 4,
                borderRadius: height / 2,
                backgroundColor: isDark ? colors.primary.dark : colors.primary.main,
                top: 2,
                left: 2,
                zIndex: 0,
              },
              {
                transform: [{ translateX: themeMode === 'dark' ? buttonWidth : 0 }],
              }
            ]} 
          />
          <View className="flex-row h-full">
            <Pressable
              style={{ 
                width: buttonWidth, 
                height: height - 4,
                justifyContent: 'center', 
                alignItems: 'center', 
                zIndex: 1,
              }}
              onPress={() => setThemeMode('light')}
            >
              <Ionicons
                name={THEME_ICONS.light}
                size={iconSize}
                color={themeMode === 'light' ? '#FFFFFF' : isDark ? '#FFFFFF' : colors.gray[600]}
              />
            </Pressable>
            <Pressable
              style={{ 
                width: buttonWidth, 
                height: height - 4,
                justifyContent: 'center', 
                alignItems: 'center', 
                zIndex: 1,
              }}
              onPress={() => setThemeMode('dark')}
            >
              <Ionicons
                name={THEME_ICONS.dark}
                size={iconSize}
                color={themeMode === 'dark' ? '#FFFFFF' : isDark ? '#FFFFFF' : colors.gray[600]}
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  }

  // Renderização para outros estilos (default, pill, minimal, labeled)
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
      
      {/* Removido o bloco de rótulos abaixo do componente para a variante labeled */}
    </View>
  );
} 