import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../hooks/DesignSystemContext';
import { colors, getColorByMode } from '../../../designer-system/tokens/colors';

export type GradientType = 
  | 'primary' | 'secondary' | 'tertiary' 
  | 'primary-fade' | 'secondary-fade' | 'tertiary-fade'
  | 'sunset' | 'ocean' | 'forest' | 'purple-pink' | 'orange-red'
  | 'blue-green' | 'warm' | 'cool' | 'rainbow'
  | 'vertical-sunset' | 'diagonal-ocean' | 'horizontal-forest'
  | 'radial-warm' | 'vertical-cool' | 'diagonal-rainbow'
  | 'triple-sunset' | 'triple-ocean' | 'triple-forest' | 'triple-rainbow'
  | 'custom';

export interface GradientViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  type?: GradientType;
  colors?: [string, string] | [string, string, string]; // Suporte para 2 ou 3 cores
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

/**
 * Componente de gradiente que se adapta para web e nativo
 * Com suporte a tema claro/escuro
 * 
 * @param {GradientViewProps} props - Propriedades do componente
 * @returns {JSX.Element} Componente GradientView
 */
export const GradientView = React.forwardRef<any, GradientViewProps>(({
  children,
  style,
  type = 'primary',
  colors: customColors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}, ref) => {
  // Obter o tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Definir gradientes com base nas cores do tema
  const GRADIENTS_LIGHT: Record<Exclude<GradientType, 'custom'>, string[]> = {
    primary: [getColorByMode('primary', 'light'), getColorByMode('primary', 'light')], // Uma cor só no modo claro
    secondary: [getColorByMode('secondary', 'light'), getColorByMode('secondary', 'light')], // Uma cor só no modo claro
    tertiary: [getColorByMode('tertiary', 'light'), getColorByMode('tertiary', 'light')], // Uma cor só no modo claro
    'primary-fade': [colors['primary-light'], 'rgba(104, 119, 137, 0.3)'], // Gradiente: primária para primária suave
    'secondary-fade': [colors['secondary-light'], 'rgba(34, 211, 238, 0.3)'], // Gradiente: secundária para secundária suave
    'tertiary-fade': [colors['tertiary-light'], 'rgba(211, 84, 93, 0.3)'], // Gradiente: terciária para terciária suave
    // Gradientes predefinidos decorativos
    sunset: ['#FF6B6B', '#FFE66D'], // Vermelho para amarelo
    ocean: ['#667eea', '#764ba2'], // Azul para roxo
    forest: ['#11998e', '#38ef7d'], // Verde escuro para verde claro
    'purple-pink': ['#667eea', '#f093fb'], // Roxo para rosa
    'orange-red': ['#ff9a9e', '#fecfef'], // Laranja para rosa claro
    'blue-green': ['#a8edea', '#fed6e3'], // Azul claro para verde claro
    warm: ['#ff9a9e', '#fad0c4'], // Tons quentes
    cool: ['#a8edea', '#fed6e3'], // Tons frios
    rainbow: ['#667eea', '#764ba2'], // Arco-íris simplificado
    // Gradientes com direções específicas
    'vertical-sunset': ['#FF6B6B', '#FFE66D'], // Vertical
    'diagonal-ocean': ['#667eea', '#764ba2'], // Diagonal
    'horizontal-forest': ['#11998e', '#38ef7d'], // Horizontal
    'radial-warm': ['#ff9a9e', '#fad0c4'], // Radial
    'vertical-cool': ['#a8edea', '#fed6e3'], // Vertical frio
    'diagonal-rainbow': ['#667eea', '#764ba2'], // Diagonal colorido
    // Gradientes com 3 cores
    'triple-sunset': ['#FF6B6B', '#FFE66D', '#FF8E53'], // 3 cores sunset
    'triple-ocean': ['#667eea', '#764ba2', '#48CAE4'], // 3 cores ocean
    'triple-forest': ['#11998e', '#38ef7d', '#06D6A0'], // 3 cores forest
    'triple-rainbow': ['#667eea', '#764ba2', '#F093FB'], // 3 cores rainbow
  };

  const GRADIENTS_DARK: Record<Exclude<GradientType, 'custom'>, string[]> = {
    primary: [getColorByMode('primary', 'dark'), getColorByMode('primary', 'dark')], // Uma cor só no modo escuro
    secondary: [getColorByMode('secondary', 'dark'), getColorByMode('secondary', 'dark')], // Uma cor só no modo escuro
    tertiary: [getColorByMode('tertiary', 'dark'), getColorByMode('tertiary', 'dark')], // Uma cor só no modo escuro
    'primary-fade': [colors['primary-dark'], 'rgba(96, 108, 56, 0.3)'], // Gradiente: primária para primária suave
    'secondary-fade': [colors['secondary-dark'], 'rgba(44, 62, 80, 0.3)'], // Gradiente: secundária para secundária suave
    'tertiary-fade': [colors['tertiary-dark'], 'rgba(211, 84, 93, 0.3)'], // Gradiente: terciária para terciária suave
    // Gradientes predefinidos decorativos (versões mais escuras para modo dark)
    sunset: ['#E55A4E', '#D4AF37'], // Vermelho escuro para dourado
    ocean: ['#4A5568', '#553C9A'], // Azul escuro para roxo escuro
    forest: ['#0F7B6C', '#2D8659'], // Verde muito escuro
    'purple-pink': ['#553C9A', '#C53030'], // Roxo escuro para vermelho escuro
    'orange-red': ['#DD6B20', '#C53030'], // Laranja escuro para vermelho
    'blue-green': ['#2B6CB0', '#2F855A'], // Azul escuro para verde escuro
    warm: ['#DD6B20', '#C53030'], // Tons quentes escuros
    cool: ['#2B6CB0', '#2F855A'], // Tons frios escuros
    rainbow: ['#553C9A', '#2F855A'], // Arco-íris escuro
    // Gradientes com direções específicas (versões escuras)
    'vertical-sunset': ['#E55A4E', '#D4AF37'], // Vertical escuro
    'diagonal-ocean': ['#4A5568', '#553C9A'], // Diagonal escuro
    'horizontal-forest': ['#0F7B6C', '#2D8659'], // Horizontal escuro
    'radial-warm': ['#DD6B20', '#C53030'], // Radial escuro
    'vertical-cool': ['#2B6CB0', '#2F855A'], // Vertical frio escuro
    'diagonal-rainbow': ['#553C9A', '#2F855A'], // Diagonal colorido escuro
    // Gradientes com 3 cores (versões escuras)
    'triple-sunset': ['#E55A4E', '#D4AF37', '#C53030'], // 3 cores sunset escuro
    'triple-ocean': ['#4A5568', '#553C9A', '#2B6CB0'], // 3 cores ocean escuro
    'triple-forest': ['#0F7B6C', '#2D8659', '#2F855A'], // 3 cores forest escuro
    'triple-rainbow': ['#553C9A', '#2F855A', '#C53030'], // 3 cores rainbow escuro
  };
  
  // Selecionar o conjunto de gradientes com base no tema
  const GRADIENTS = isDark ? GRADIENTS_DARK : GRADIENTS_LIGHT;
  
  // Usar cores personalizadas ou pegar do objeto GRADIENTS
  const gradientColors = customColors || (type !== 'custom' ? GRADIENTS[type] : GRADIENTS.primary);

  // Definir direções automáticas baseadas no tipo
  const getAutoDirection = (): { start: { x: number; y: number }; end: { x: number; y: number } } => {
    switch (type) {
      case 'vertical-sunset':
      case 'vertical-cool':
        return { start: { x: 0, y: 0 }, end: { x: 0, y: 1 } }; // Vertical
      case 'diagonal-ocean':
      case 'diagonal-rainbow':
        return { start: { x: 0, y: 0 }, end: { x: 1, y: 1 } }; // Diagonal
      case 'horizontal-forest':
        return { start: { x: 1, y: 0 }, end: { x: 0, y: 0 } }; // Horizontal inverso
      case 'radial-warm':
        return { start: { x: 0.5, y: 0.5 }, end: { x: 1, y: 1 } }; // Radial
      default:
        return { start, end }; // Usar os valores passados como props
    }
  };

  const autoDirection = getAutoDirection();
  const finalStart = autoDirection.start;
  const finalEnd = autoDirection.end;

  if (Platform.OS === 'web') {
    // Converter start/end para direção CSS
    const getGradientDirection = () => {
      const deltaX = finalEnd.x - finalStart.x;
      const deltaY = finalEnd.y - finalStart.y;
      
      // Calcular o ângulo em graus
      const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
      
      // Converter para ângulo CSS (0° = para cima, 90° = para direita)
      const cssAngle = (90 - angle) % 360;
      
      return `${cssAngle}deg`;
    };

          return (
        <View
          ref={ref}
          style={[
            styles.container,
            {
              backgroundImage: `linear-gradient(${getGradientDirection()}, ${gradientColors.join(', ')})`,
            },
            style,
          ]}
        >
          {children}
        </View>
      );
  }

  return (
    <LinearGradient
      ref={ref}
      colors={gradientColors as [string, string, ...string[]]}
      start={finalStart}
      end={finalEnd}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
});

GradientView.displayName = 'GradientView';

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
}); 