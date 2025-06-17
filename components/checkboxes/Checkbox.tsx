import React, { useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Check, Minus } from 'lucide-react-native';
import { useTheme } from '../../hooks/DesignSystemContext';
import { colors } from '../../design-system/tokens/colors';

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

interface CheckboxProps {
  /** Estado do checkbox (marcado ou não) */
  checked: boolean | 'indeterminate';
  /** Função chamada quando o estado do checkbox muda */
  onCheckedChange: (checked: boolean) => void;
  /** Se o checkbox está desabilitado */
  disabled?: boolean;
  /** ID para testes */
  testID?: string;
  /** Atributo aria-label para acessibilidade */
  'aria-label'?: string;
}

/**
 * Componente Checkbox com suporte a temas claro/escuro automático
 */
export const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onCheckedChange,
  disabled = false,
  testID,
  'aria-label': ariaLabel,
}) => {
  const { currentTheme, getColorByMode } = useTheme();
  const isDark = currentTheme === 'dark';

  const handleToggle = () => {
    if (!disabled) {
      onCheckedChange(!checked);
    }
  };

  // Adicionar estilos de hover para web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        .checkbox-container:hover:not([data-disabled="true"]) {
          background-color: ${isDark ? colors['hover-dark'] : colors['hover-light']};
          transition: background-color 0.2s ease;
        }
        
        .checkbox-container[data-disabled="true"] {
          opacity: 0.5;
          cursor: not-allowed;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [checked, isDark]);

  const isChecked = checked === true;
  const isIndeterminate = checked === 'indeterminate';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handleToggle}
      disabled={disabled}
      testID={testID}
      accessibilityLabel={ariaLabel || 'Checkbox'}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: !!checked, disabled }}
      {...(Platform.OS === 'web' ? {
        className: 'checkbox-container',
        'data-disabled': disabled ? 'true' : 'false',
      } : {})}
    >
      <View
        style={[
          styles.checkbox,
          {
            backgroundColor: (isChecked || isIndeterminate) 
              ? isDark ? colors['primary-dark'] : colors['primary-light']
              : isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
            borderColor: (isChecked || isIndeterminate) 
              ? isDark ? colors['primary-dark'] : colors['primary-light']
              : isDark ? colors['divider-dark'] : colors['divider-light'],
          },
          disabled && styles.disabled,
        ]}
      >
        {isChecked && (
          <Check
            size={14}
            color="#FFFFFF"
            strokeWidth={3}
          />
        )}
        {isIndeterminate && (
          <Minus
            size={14}
            color="#FFFFFF"
            strokeWidth={3}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 2,
    borderRadius: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabled: {
    opacity: 0.5,
  },
}); 