import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { useTheme } from '../../../hooks/ThemeContext';

/**
 * @component Checkbox
 * @description Componente de checkbox minimalista que suporta:
 * - Estados: checked, indeterminate, disabled
 * - Tema claro/escuro automático
 * - Acessibilidade
 * 
 * Exemplos de uso:
 * 
 * ```tsx
 * // Checkbox simples
 * <Checkbox 
 *   checked={isChecked} 
 *   onCheckedChange={setIsChecked} 
 * />
 * 
 * // Checkbox com estado indeterminado
 * <Checkbox 
 *   checked="indeterminate"
 *   onCheckedChange={handleChange} 
 * />
 * 
 * // Checkbox desabilitado
 * <Checkbox 
 *   checked={isChecked} 
 *   onCheckedChange={setIsChecked}
 *   disabled
 * />
 * ```
 */

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
      'primary-dark': '#4A6',
      'text-secondary-light': '#57636C',
      'text-secondary-dark': '#95A1AC',
    };
  }
};

export interface CheckboxProps {
  /** 
   * Estado atual do checkbox: 
   * - true: marcado
   * - false: desmarcado
   * - "indeterminate": estado intermediário 
   */
  checked: boolean | "indeterminate";
  /** Função chamada quando o estado muda */
  onCheckedChange: (checked: boolean) => void;
  /** Se o checkbox está desabilitado */
  disabled?: boolean;
  /** ID para testes automatizados */
  testID?: string;
  /** Label de acessibilidade */
  accessibilityLabel?: string;
  /** Estilo customizado */
  style?: any;
  /** Tamanho do checkbox */
  size?: 'sm' | 'md' | 'lg';
}

export const Checkbox = ({
  checked,
  onCheckedChange,
  disabled = false,
  testID,
  accessibilityLabel = 'Checkbox',
  style,
  size = 'md',
}: CheckboxProps) => {
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Obter cores do tailwind.config.js
  const twColors = getTailwindConfig();
  
  // Determinar tamanho do checkbox
  const getSize = () => {
    switch (size) {
      case 'sm':
        return 16;
      case 'lg':
        return 24;
      default:
        return 20;
    }
  };
  
  // Estilo do checkbox
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkbox: {
      width: getSize(),
      height: getSize(),
      borderWidth: 1.5,
      borderRadius: 4,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: (checked === true || checked === "indeterminate")
        ? (isDark ? twColors['primary-dark'] : twColors['primary-light'])
        : 'transparent',
      borderColor: (checked === true || checked === "indeterminate")
        ? (isDark ? twColors['primary-dark'] : twColors['primary-light']) 
        : (isDark ? twColors['text-secondary-dark'] : twColors['text-secondary-light']),
      opacity: disabled ? 0.5 : 1,
    },
  });
  
  // Adicionar estilos de hover para web
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* Estilo de hover para checkbox */
        [data-checkbox-container="true"]:hover:not([data-disabled="true"]) [data-checkbox="true"] {
          border-color: ${isDark ? twColors['primary-dark'] : twColors['primary-light']};
          transition: all 0.2s ease;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark]);
  
  // Renderizar o conteúdo do checkbox
  const renderCheckboxContent = () => {
    if (checked === "indeterminate") {
      return (
        <Minus
          size={getSize() * 0.7}
          color="#FFFFFF"
        />
      );
    }
    
    if (checked === true) {
      return (
        <Check 
          size={getSize() * 0.7} 
          color="#FFFFFF"
        />
      );
    }
    
    return null;
  };
  
  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={() => !disabled && onCheckedChange(!checked as boolean)}
      disabled={disabled}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: checked === true, disabled }}
      accessibilityLabel={accessibilityLabel}
      testID={testID}
      {...(Platform.OS === 'web' ? {
        'data-checkbox-container': 'true',
        'data-disabled': disabled ? 'true' : 'false'
      } : {})}
    >
      <View 
        style={styles.checkbox}
        {...(Platform.OS === 'web' ? { 'data-checkbox': 'true' } : {})}
      >
        {renderCheckboxContent()}
      </View>
    </TouchableOpacity>
  );
}; 