import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../../hooks/ThemeContext';

// Função para obter as cores do tailwind.config.js
const getTailwindConfig = () => {
  try {
    // Importando dinamicamente o tailwind.config.js
    const tailwindConfig = require('../../../tailwind.config.js');
    return tailwindConfig.theme.extend.colors;
  } catch (error) {
    // Fallback para valores padrão caso não consiga importar
    console.error('Erro ao carregar tailwind.config.js:', error);
    return {
      'primary-light': '#892CDC',
      'primary-dark': '#C13636',
      'secondary-light': '#22D',
      'secondary-dark': '#2C3E',
      'tertiary-light': '#D3545D',
      'tertiary-dark': '#D3545D',
      'gradient-primary-start': '#4A6FA5',
      'gradient-primary-end': '#22D3EE',
      'gradient-secondary-start': '#4A6FA5',
      'gradient-secondary-end': '#D3545D',
      'gradient-tertiary-start': '#22D3EE',
      'gradient-tertiary-end': '#D3545D',
    };
  }
};

export type GradientType = 'primary' | 'secondary' | 'tertiary' | 'custom';

export interface GradientViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  type?: GradientType;
  colors?: [string, string]; // Tipado corretamente para dois valores
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
export const GradientView: React.FC<GradientViewProps> = ({
  children,
  style,
  type = 'primary',
  colors: customColors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 0 },
}) => {
  // Obter o tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Obter as cores do tailwind.config.js
  const twColors = getTailwindConfig();
  
  // Definir gradientes com base nas cores do tailwind
  const GRADIENTS_LIGHT: Record<Exclude<GradientType, 'custom'>, [string, string]> = {
    primary: [twColors['primary-light'], twColors['gradient-primary-end']],
    secondary: [twColors['secondary-light'], twColors['gradient-secondary-end']],
    tertiary: [twColors['tertiary-light'], twColors['gradient-tertiary-end']],
  };

  const GRADIENTS_DARK: Record<Exclude<GradientType, 'custom'>, [string, string]> = {
    primary: [twColors['primary-dark'], twColors['gradient-primary-end']],
    secondary: [twColors['secondary-dark'], twColors['gradient-secondary-end']],
    tertiary: [twColors['tertiary-dark'], twColors['gradient-tertiary-end']],
  };
  
  // Selecionar o conjunto de gradientes com base no tema
  const GRADIENTS = isDark ? GRADIENTS_DARK : GRADIENTS_LIGHT;
  
  // Usar cores personalizadas ou pegar do objeto GRADIENTS
  const gradientColors = customColors || (type !== 'custom' ? GRADIENTS[type] : GRADIENTS.primary);

  if (Platform.OS === 'web') {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundImage: `linear-gradient(to right, ${gradientColors[0]}, ${gradientColors[1]})`,
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
      colors={gradientColors}
      start={start}
      end={end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
  },
}); 