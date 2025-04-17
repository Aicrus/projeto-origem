import React, { useState } from 'react';
import { Pressable, ViewStyle, PressableProps, Platform } from 'react-native';
import { useTheme } from '@/hooks/ThemeContext';
import { colors } from '../constants/theme';

export interface HoverableViewProps extends PressableProps {
  children: React.ReactNode;
  isActive?: boolean;
  activeBackgroundColor?: string;
  style?: ViewStyle;
  
  // Efeitos de hover
  hoverScale?: number;
  hoverTranslateX?: number;
  hoverTranslateY?: number;
  hoverRotate?: number;
  hoverElevation?: number;
  hoverOpacity?: number;
  
  // Opções de personalização
  disableHoverBackground?: boolean;
  disableAnimation?: boolean;
  animationDuration?: number;

  // Cores
  hoverColor?: string;
  activeColor?: string;
  backgroundColor?: string;
  className?: string;
  
  // Callbacks externos de hover
  onHoverStateChange?: (isHovered: boolean) => void;
}

/**
 * HoverableView - Componente para criar elementos interativos com efeitos de hover
 * 
 * Este componente oferece diversos efeitos de hover personalizáveis para melhorar
 * a interatividade e feedback visual em interfaces web e mobile.
 * 
 * É possível combinar múltiplos efeitos (ex: escala + movimento + opacidade) 
 * para criar interações ricas e personalizadas.
 */
export function HoverableView({
  children,
  isActive = false,
  activeBackgroundColor,
  style,
  hoverScale = 1,
  hoverTranslateX = 0,
  hoverTranslateY = 0,
  hoverRotate = 0,
  hoverElevation = 0,
  hoverOpacity,
  disableHoverBackground = false,
  disableAnimation = false,
  animationDuration = 200,
  hoverColor,
  activeColor,
  backgroundColor,
  className = '',
  onHoverStateChange,
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

  // Funções para gerenciar o estado de hover
  const handleHoverIn = () => {
    setIsHovered(true);
    if (onHoverStateChange) onHoverStateChange(true);
  };

  const handleHoverOut = () => {
    setIsHovered(false);
    if (onHoverStateChange) onHoverStateChange(false);
  };

  // Estilo base para todos os estados
  const baseStyle: any = {
    backgroundColor: defaultColors.background,
    ...(Platform.OS === 'web' && !disableAnimation ? {
      cursor: props.disabled ? 'default' : 'pointer',
      transition: `all ${animationDuration}ms ease`,
      userSelect: 'none',
    } : {}),
    ...(typeof style === 'object' ? style : {}),
  };

  // Estilo para hover (transformações)
  const getHoverTransform = () => {
    if (Platform.OS === 'web') {
      const transforms = [];
      if (hoverScale !== 1) transforms.push(`scale(${hoverScale})`);
      if (hoverTranslateX !== 0) transforms.push(`translateX(${hoverTranslateX}px)`);
      if (hoverTranslateY !== 0) transforms.push(`translateY(${hoverTranslateY}px)`);
      if (hoverRotate !== 0) transforms.push(`rotate(${hoverRotate}deg)`);
      return transforms.length > 0 ? transforms.join(' ') : undefined;
    } else {
      const transforms = [];
      if (hoverScale !== 1) transforms.push({ scale: hoverScale });
      if (hoverTranslateX !== 0) transforms.push({ translateX: hoverTranslateX });
      if (hoverTranslateY !== 0) transforms.push({ translateY: hoverTranslateY });
      if (hoverRotate !== 0) transforms.push({ rotate: `${hoverRotate}deg` });
      return transforms.length > 0 ? transforms : undefined;
    }
  };

  // Estilo para hover
  const hoverStyle: any = {
    backgroundColor: !disableHoverBackground ? defaultColors.hover : baseStyle.backgroundColor,
    transform: !disableAnimation ? getHoverTransform() : undefined,
  };

  // Adicionar opacidade se especificada
  if (hoverOpacity !== undefined) {
    hoverStyle.opacity = hoverOpacity;
  }

  // Estilo para estado ativo
  const activeStyle: any = {
    backgroundColor: activeBackgroundColor || defaultColors.active,
  };

  // Adicionar elevação/sombra para mobile
  if ((Platform.OS === 'android' || Platform.OS === 'ios') && hoverElevation > 0) {
    const elevation = isHovered ? hoverElevation : 0;
    if (isHovered) {
      hoverStyle.elevation = elevation;
      hoverStyle.shadowColor = '#000';
      hoverStyle.shadowOffset = { width: 0, height: elevation };
      hoverStyle.shadowOpacity = 0.1;
      hoverStyle.shadowRadius = elevation * 0.5;
    }
  }

  // Estilo final combinado
  let finalStyle: any = { ...baseStyle };
  
  if (isActive) {
    finalStyle = { ...finalStyle, ...activeStyle };
  }
  
  if (isHovered && !isActive) {
    finalStyle = { ...finalStyle, ...hoverStyle };
  }

  return (
    <Pressable
      className={className}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={finalStyle}
      {...props}
    >
      {children}
    </Pressable>
  );
} 