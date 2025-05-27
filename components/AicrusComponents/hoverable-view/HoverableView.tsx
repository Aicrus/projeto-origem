import React, { useState, useEffect } from 'react';
import { Pressable, View, ViewStyle, PressableProps, Platform, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/DesignSystemContext';
import { colors } from '../../../designer-system/tokens/colors';

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
  disableHoverWhenActive?: boolean;
  animationDuration?: number;
  allowHoverWhenDisabled?: boolean;

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
 * 
 * Características especiais:
 * - Pode ter efeitos visuais de hover mesmo quando desabilitado (allowHoverWhenDisabled)
 * - Suporta múltiplos efeitos de transformação combinados
 * - Adapta-se automaticamente a temas claros e escuros
 * - Pode desativar efeitos de hover em itens ativos (disableHoverWhenActive)
 */
export const HoverableView = React.forwardRef<View, HoverableViewProps>(({
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
  disableHoverWhenActive = false,
  animationDuration = 200,
  allowHoverWhenDisabled = false,
  hoverColor,
  activeColor,
  backgroundColor,
  className = '',
  onHoverStateChange,
  disabled,
  ...props
}, ref) => {
  const [isHovered, setIsHovered] = useState(false);
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Para web, precisamos usar refs e useEffect para manipular diretamente o DOM em casos especiais
  const viewRef = React.useRef<View>(null);
  
  // Cores padrão baseadas no tema
  const defaultColors = {
    background: backgroundColor || 'transparent',
    hover: hoverColor || (isDark ? colors['hover-dark'] : colors['hover-light']),
    active: activeColor || (isDark ? colors['primary-dark'] : colors['primary-light']),
  };

  // Manipulação direta do DOM para elementos desabilitados na web
  useEffect(() => {
    if (Platform.OS === 'web' && viewRef.current && disabled && allowHoverWhenDisabled) {
      // @ts-ignore - Acessando o elemento DOM nativo
      const domNode = viewRef.current._nativeTag || viewRef.current;
      
      if (domNode && domNode.style) {
        // Garantir que o cursor seja default
        domNode.style.cursor = 'default';
        
        // Permitir eventos de hover mas bloquear cliques
        domNode.style.pointerEvents = 'auto';
        
        // Adicionar listener de mouse para elementos desabilitados
        const mouseEnterHandler = () => {
          if (disabled && allowHoverWhenDisabled) {
            setIsHovered(true);
            if (onHoverStateChange) onHoverStateChange(true);
          }
        };
        
        const mouseLeaveHandler = () => {
          if (disabled && allowHoverWhenDisabled) {
            setIsHovered(false);
            if (onHoverStateChange) onHoverStateChange(false);
          }
        };
        
        domNode.addEventListener('mouseenter', mouseEnterHandler);
        domNode.addEventListener('mouseleave', mouseLeaveHandler);
        
        return () => {
          domNode.removeEventListener('mouseenter', mouseEnterHandler);
          domNode.removeEventListener('mouseleave', mouseLeaveHandler);
        };
      }
    }
  }, [disabled, allowHoverWhenDisabled, onHoverStateChange]);

  // Funções para gerenciar o estado de hover
  const handleHoverIn = () => {
    // Não aplicar hover se o componente estiver ativo e disableHoverWhenActive for true
    if ((isActive && disableHoverWhenActive)) {
      return;
    }
    
    // Não precisamos verificar disabled aqui porque já controlamos isso via useEffect para web
    // e a Pressable não dispara eventos para elementos desabilitados nativamente
    if (!disabled || allowHoverWhenDisabled) {
      setIsHovered(true);
      if (onHoverStateChange) onHoverStateChange(true);
    }
  };

  const handleHoverOut = () => {
    if (!disabled || allowHoverWhenDisabled) {
      setIsHovered(false);
      if (onHoverStateChange) onHoverStateChange(false);
    }
  };

  // Estilo base para todos os estados
  const baseStyle: any = {
    backgroundColor: defaultColors.background,
    ...(Platform.OS === 'web' && !disableAnimation ? {
      transition: `all ${animationDuration}ms ease`,
      userSelect: 'none',
    } : {}),
    ...(typeof style === 'object' ? style : {}),
  };

  // Adicionar cursor style específico para web
  if (Platform.OS === 'web') {
    baseStyle.cursor = disabled ? 'default' : 'pointer';
  }

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
    backgroundColor: !disableHoverBackground ? 
      (isActive && activeBackgroundColor ? 'transparent' : defaultColors.hover) : 
      baseStyle.backgroundColor,
    transform: !disableAnimation ? getHoverTransform() : undefined,
  };

  // Adicionar opacidade se especificada
  if (hoverOpacity !== undefined) {
    hoverStyle.opacity = hoverOpacity;
  }

  // Estilo para estado ativo
  const activeStyle: any = {
    backgroundColor: activeBackgroundColor || 'transparent',
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
  
  // Aplicar estilo de hover - importante: se allowHoverWhenDisabled é true, 
  // sempre aplicamos o estilo hover, independente de disabled
  if (isHovered && (!disabled || allowHoverWhenDisabled) && !(disableHoverWhenActive && isActive)) {
    finalStyle = { ...finalStyle, ...hoverStyle };
  }

  // Usamos um wrapper View para elementos desabilitados com hover permitido
  if (disabled && allowHoverWhenDisabled && Platform.OS === 'web') {
    return (
      <View 
        ref={ref || viewRef}
        className={className}
        style={{
          ...finalStyle,
          cursor: 'default',
        }}
      >
        {children}
      </View>
    );
  }

  // Comportamento normal para outros casos
  return (
    <Pressable
      ref={ref || viewRef}
      className={className}
      onHoverIn={handleHoverIn}
      onHoverOut={handleHoverOut}
      style={finalStyle}
      disabled={disabled}
      {...props}
    >
      {children}
    </Pressable>
  );
});

HoverableView.displayName = 'HoverableView';