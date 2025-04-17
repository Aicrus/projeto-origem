import React, { useState } from 'react';
import { Pressable, StyleSheet, Platform, ViewStyle, PressableProps, Text, View, StyleProp } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import { colors } from '../constants/theme';

export interface HoverableViewProps extends PressableProps {
  children: React.ReactNode;
  isActive?: boolean;
  activeBackgroundColor?: string;
  style?: StyleProp<ViewStyle>;
  
  // Efeitos de hover
  hoverScale?: number;
  hoverTranslateX?: number;
  hoverTranslateY?: number;
  hoverRotate?: number;
  hoverElevation?: number;
  
  // Opções de personalização
  disableHoverBackground?: boolean;
  disableAnimation?: boolean;
  animationDuration?: number;

  // Cores
  hoverColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  className?: string;
}

/**
 * HoverableView - Componente para criar elementos interativos com efeitos de hover
 * 
 * Este componente oferece diversos efeitos de hover personalizáveis para melhorar
 * a interatividade e feedback visual em interfaces web e mobile.
 * 
 * @param children - Conteúdo a ser renderizado dentro do componente
 * @param isActive - Se o componente está em estado ativo/selecionado
 * @param activeBackgroundColor - Cor de fundo quando ativo (sobrepõe activeColor)
 * @param style - Estilos adicionais para o componente
 * @param hoverScale - Escala ao passar o mouse por cima (1 = sem escala)
 * @param hoverTranslateX - Deslocamento horizontal ao passar o mouse
 * @param hoverTranslateY - Deslocamento vertical ao passar o mouse
 * @param hoverRotate - Rotação ao passar o mouse (em graus)
 * @param hoverElevation - Elevação/sombra adicional ao passar o mouse
 * @param disableHoverBackground - Desativa a mudança de cor de fundo no hover
 * @param disableAnimation - Desativa todas as animações
 * @param animationDuration - Duração da animação em milissegundos
 * @param hoverColor - Cor personalizada para o estado de hover
 * @param activeColor - Cor personalizada para o estado ativo
 * @param backgroundColor - Cor de fundo padrão
 * @param className - Classes CSS adicionais (para Tailwind)
 * @param props - Outras propriedades do Pressable
 */
export function HoverableView({
  children,
  isActive = false,
  activeBackgroundColor,
  style,
  hoverScale = 1.005,
  hoverTranslateX = 0,
  hoverTranslateY = 0,
  hoverRotate = 0,
  hoverElevation = 0,
  disableHoverBackground = false,
  disableAnimation = false,
  animationDuration = 200,
  hoverColor,
  activeColor,
  backgroundColor,
  className = '',
  ...props
}: HoverableViewProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // Cores padrão baseadas no tema
  const defaultColors = {
    background: backgroundColor || 'transparent',
    hover: hoverColor || (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'),
    active: activeColor || (isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'),
  };

  // Elevação (sombra) baseada no estado
  const getElevation = (): ViewStyle => {
    if (Platform.OS !== 'android' && Platform.OS !== 'ios') return {};

    let elevation = 0;
    if (isActive) elevation = 1;
    if (isHovered) elevation = hoverElevation > 0 ? hoverElevation : (isActive ? 1 : 2);

    return {
      elevation,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: elevation },
      shadowOpacity: 0.1,
      shadowRadius: elevation * 0.5,
    };
  };

  // Estilo para web (transições suaves)
  const webStyles: any = Platform.OS === 'web' 
    ? {
        cursor: props.disabled ? 'default' : 'pointer',
        transition: disableAnimation ? 'none' : `all ${animationDuration}ms ease`,
        userSelect: 'none',
      } 
    : {};

  // Transformações baseadas no estado de hover
  const getTransform = (pressed: boolean) => {
    if (disableAnimation) return [];
    
    const transforms = [];
    
    // Scale (escala)
    if (hoverScale !== 1) {
      transforms.push({ scale: pressed ? 0.98 : (isHovered ? hoverScale : 1) });
    }
    
    // TranslateX (movimento horizontal)
    if (hoverTranslateX !== 0) {
      transforms.push({ translateX: isHovered ? hoverTranslateX : 0 });
    }
    
    // TranslateY (movimento vertical)
    if (hoverTranslateY !== 0) {
      transforms.push({ translateY: isHovered ? hoverTranslateY : 0 });
    }
    
    // Rotate (rotação)
    if (hoverRotate !== 0) {
      transforms.push({ rotate: isHovered ? `${hoverRotate}deg` : '0deg' });
    }
    
    return transforms;
  };

  // Cor de fundo baseada no estado
  const getBackgroundColor = () => {
    if (activeBackgroundColor && isActive) return activeBackgroundColor;
    if (isActive) return defaultColors.active;
    if (isHovered && !disableHoverBackground) return defaultColors.hover;
    return defaultColors.background;
  };

  return (
    <Pressable
      className={className}
      onHoverIn={() => setIsHovered(true)}
      onHoverOut={() => setIsHovered(false)}
      style={({ pressed }) => [
        {
          backgroundColor: getBackgroundColor(),
          transform: getTransform(pressed),
          ...webStyles,
          ...getElevation(),
        } as ViewStyle,
        style,
      ]}
      {...props}
    >
      {children}
    </Pressable>
  );
} 