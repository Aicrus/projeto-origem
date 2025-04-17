import React from 'react';
import { View, ViewStyle, StyleSheet, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

export type GradientType = 'primary' | 'secondary' | 'tertiary' | 'custom';

export interface GradientViewProps {
  children?: React.ReactNode;
  style?: ViewStyle;
  type?: GradientType;
  colors?: [string, string]; // Tipado corretamente para dois valores
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

// Gradientes definidos no tailwind.config.js
export const GRADIENTS: Record<Exclude<GradientType, 'custom'>, [string, string]> = {
  primary: ['#892CDC', '#BC6FF1'],     // primário (purple)
  secondary: ['#52B69A', '#76C893'],   // secundário (green)
  tertiary: ['#4A6FA5', '#5E7CB9'],    // terciário (blue)
};

/**
 * Componente de gradiente que se adapta para web e nativo
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