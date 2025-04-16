import React, { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
  Platform,
  ViewStyle,
  TextStyle,
  TouchableOpacityProps,
} from 'react-native';
import { useTheme } from '../../../hooks/ThemeContext';
import { useResponsive } from '../../../hooks/useResponsive';

/**
 * @component Button
 * @description Componente de botão moderno e minimalista que suporta:
 * - Variantes: primary, destructive, outline, ghost, link
 * - Estado de carregamento com indicador visual
 * - Ícones: à esquerda, à direita ou botão de ícone
 * - Tema claro/escuro automático
 * - Responsividade
 * - Acessibilidade
 * 
 * Exemplos de uso:
 * 
 * ```tsx
 * // Botão primário
 * <Button variant="primary" onPress={() => console.log('Pressed')}>
 *   Botão Primário
 * </Button>
 * 
 * // Botão destrutivo
 * <Button variant="destructive" onPress={() => console.log('Pressed')}>
 *   Botão Destrutivo
 * </Button>
 * 
 * // Botão outline
 * <Button variant="outline" onPress={() => console.log('Pressed')}>
 *   Botão Outline
 * </Button>
 * 
 * // Botão ghost
 * <Button variant="ghost" onPress={() => console.log('Pressed')}>
 *   Botão Ghost
 * </Button>
 * 
 * // Botão link
 * <Button variant="link" onPress={() => console.log('Pressed')}>
 *   Botão Link
 * </Button>
 * 
 * // Botão com ícone à esquerda
 * <Button
 *   variant="primary"
 *   onPress={() => console.log('Pressed')}
 *   leftIcon={<Icon name="star" size={16} color="#FFFFFF" />}
 * >
 *   Com Ícone
 * </Button>
 * 
 * // Botão com ícone à direita
 * <Button
 *   variant="primary"
 *   onPress={() => console.log('Pressed')}
 *   rightIcon={<Icon name="chevron-right" size={16} color="#FFFFFF" />}
 * >
 *   Com Ícone
 * </Button>
 * 
 * // Botão de ícone
 * <Button variant="primary" onPress={() => console.log('Pressed')} isIconOnly>
 *   <Icon name="plus" size={16} color="#FFFFFF" />
 * </Button>
 * ```
 */

export type ButtonVariant = 'primary' | 'destructive' | 'outline' | 'ghost' | 'link';
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg';

export interface ButtonProps extends TouchableOpacityProps {
  /** Texto do botão ou children como ReactNode */
  children: ReactNode;
  /** Variante visual do botão */
  variant?: ButtonVariant;
  /** Tamanho do botão */
  size?: ButtonSize;
  /** Se o botão está em estado de carregamento */
  loading?: boolean;
  /** Mensagem exibida durante o carregamento */
  loadingText?: string;
  /** Cor do spinner de carregamento (se não especificado, usa a cor apropriada para a variante) */
  spinnerColor?: string;
  /** Se o botão está desabilitado */
  disabled?: boolean;
  /** Ícone exibido à esquerda do texto */
  leftIcon?: ReactNode;
  /** Ícone exibido à direita do texto */
  rightIcon?: ReactNode;
  /** Se o botão contém apenas um ícone (sem texto) */
  isIconOnly?: boolean;
  /** Função chamada quando o botão é pressionado */
  onPress: () => void;
  /** Estilos adicionais para o container do botão */
  style?: ViewStyle;
  /** Estilos adicionais para o texto do botão */
  textStyle?: TextStyle;
  /** ID para testes automatizados */
  testID?: string;
  /** Valor para acessibilidade */
  accessibilityLabel?: string;
  /** Largura total disponível */
  fullWidth?: boolean;
  /** Raio da borda do botão */
  borderRadius?: number;
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  loadingText,
  spinnerColor,
  disabled = false,
  leftIcon,
  rightIcon,
  isIconOnly = false,
  onPress,
  style,
  textStyle,
  testID,
  accessibilityLabel,
  fullWidth = false,
  borderRadius,
  ...rest
}: ButtonProps) => {
  // Obtém o tema atual e verifica se está no modo escuro
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Responsividade
  const { isMobile } = useResponsive();
  
  // Determina se o botão tem texto ou apenas ícone
  const hasText = !isIconOnly && React.isValidElement(children);
  
  // Cores para os diferentes temas e variantes baseadas no tailwind.config.js
  const colorScheme = {
    primary: {
      background: isDark ? '#4A6' : '#892CDC',
      backgroundHover: isDark ? '#5B8' : '#9D3CED',
      backgroundPressed: isDark ? '#394' : '#7D1CC9',
      text: '#FFFFFF',
      border: 'transparent',
      disabled: isDark ? 'rgba(68, 170, 102, 0.5)' : 'rgba(137, 44, 220, 0.5)',
      disabledText: '#FFFFFF',
      textHover: undefined,
      textPressed: undefined,
      disabledBorder: undefined,
    },
    destructive: {
      background: isDark ? '#E4656E' : '#D3545D',
      backgroundHover: isDark ? '#F5767F' : '#E3656E',
      backgroundPressed: isDark ? '#D3545D' : '#C1414A',
      text: '#FFFFFF',
      border: 'transparent',
      disabled: isDark ? 'rgba(211, 84, 93, 0.5)' : 'rgba(211, 84, 93, 0.5)',
      disabledText: '#FFFFFF',
      textHover: undefined,
      textPressed: undefined,
      disabledBorder: undefined,
    },
    outline: {
      background: 'transparent',
      backgroundHover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      backgroundPressed: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      text: isDark ? '#FFFFFF' : '#14181B',
      border: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)',
      disabled: 'transparent',
      disabledText: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      disabledBorder: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      textHover: undefined,
      textPressed: undefined,
    },
    ghost: {
      background: 'transparent',
      backgroundHover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      backgroundPressed: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      text: isDark ? '#FFFFFF' : '#14181B',
      border: 'transparent',
      disabled: 'transparent',
      disabledText: isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)',
      textHover: undefined,
      textPressed: undefined,
      disabledBorder: undefined,
    },
    link: {
      background: 'transparent',
      backgroundHover: 'transparent',
      backgroundPressed: 'transparent',
      text: isDark ? '#4A6' : '#892CDC',
      textHover: isDark ? '#5B8' : '#9D3CED',
      textPressed: isDark ? '#394' : '#7D1CC9',
      border: 'transparent',
      disabled: 'transparent',
      disabledText: isDark ? 'rgba(68, 170, 102, 0.5)' : 'rgba(137, 44, 220, 0.5)',
      disabledBorder: undefined,
    },
  };
  
  // Dimensões para os diferentes tamanhos
  const sizes = {
    xs: {
      height: isIconOnly ? 24 : 28,
      paddingHorizontal: isIconOnly ? 0 : 12,
      fontSize: 12,
      fontWeight: '400',
      iconSize: 12,
      borderRadius: borderRadius !== undefined ? borderRadius : 6,
      iconButtonDimension: 24,
      spacing: 10,
    },
    sm: {
      height: isIconOnly ? 32 : 36,
      paddingHorizontal: isIconOnly ? 0 : 14,
      fontSize: 13,
      fontWeight: '400',
      iconSize: 14,
      borderRadius: borderRadius !== undefined ? borderRadius : 8,
      iconButtonDimension: 32,
      spacing: 12,
    },
    md: {
      height: isIconOnly ? 40 : 42,
      paddingHorizontal: isIconOnly ? 0 : 16,
      fontSize: 14,
      fontWeight: '400',
      iconSize: 16,
      borderRadius: borderRadius !== undefined ? borderRadius : 8,
      iconButtonDimension: 40,
      spacing: 14,
    },
    lg: {
      height: isIconOnly ? 48 : 48,
      paddingHorizontal: isIconOnly ? 0 : 20,
      fontSize: 15,
      fontWeight: '400',
      iconSize: 18,
      borderRadius: borderRadius !== undefined ? borderRadius : 10,
      iconButtonDimension: 48,
      spacing: 14,
    },
  };
  
  // Obtém configurações para o tamanho selecionado
  const sizeConfig = sizes[size];
  
  // Determina a cor do spinner baseada na variante
  const getSpinnerColor = () => {
    if (spinnerColor) return spinnerColor;
    
    if (variant === 'primary' || variant === 'destructive') {
      return '#FFFFFF'; // Branco para variantes com fundo colorido
    } else if (variant === 'link') {
      return colorScheme.link.text; // Cor do texto do link
    } else {
      return isDark ? '#FFFFFF' : '#14181B'; // Texto padrão
    }
  };

  // Gera os estilos do botão
  const getButtonStyles = (): ViewStyle => {
    const variantColors = colorScheme[variant];
    
    // Estilos base
    const baseStyle: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      height: isIconOnly ? sizeConfig.iconButtonDimension : sizeConfig.height,
      paddingHorizontal: isIconOnly ? 0 : sizeConfig.paddingHorizontal,
      borderRadius: sizeConfig.borderRadius,
      width: isIconOnly ? sizeConfig.iconButtonDimension : fullWidth ? '100%' : 'auto',
      backgroundColor: disabled ? (variant === 'primary' || variant === 'destructive' ? variantColors.disabled : variantColors.background) : variantColors.background,
      borderWidth: variant === 'outline' ? 1 : 0,
      borderColor: disabled && variant === 'outline' ? variantColors.disabledBorder : variantColors.border,
      opacity: variant !== 'primary' && variant !== 'destructive' && disabled ? 0.6 : 1,
    };
    
    // Ajustes para botão de ícone
    if (isIconOnly) {
      return {
        ...baseStyle,
        width: sizeConfig.iconButtonDimension,
        aspectRatio: 1,
        paddingHorizontal: 0,
      };
    }
    
    return baseStyle;
  };
  
  // Gera os estilos do texto do botão
  const getTextStyles = (): TextStyle => {
    const variantColors = colorScheme[variant];
    
    return {
      fontSize: sizeConfig.fontSize,
      color: variant === 'link' ? variantColors.text : 
             disabled ? variantColors.disabledText : variantColors.text,
      fontWeight: sizeConfig.fontWeight as '400' | '500' | '600' | '700',
      fontFamily: 'PlusJakartaSans_400Regular',
      marginLeft: leftIcon && hasText ? sizeConfig.spacing : 0,
      marginRight: rightIcon && hasText ? sizeConfig.spacing : 0,
      textDecorationLine: variant === 'link' ? 'underline' : 'none',
    };
  };
  
  // Aplica estilos específicos para Web
  React.useEffect(() => {
    if (Platform.OS === 'web') {
      // Gera um ID único para evitar conflitos com outros botões
      const styleId = `button-styles-${Math.random().toString(36).substr(2, 9)}`;
      
      // Obtém as cores para o tema atual
      const variantColors = colorScheme[variant];
      
      // Cria um elemento style e adiciona ao head
      const styleEl = document.createElement('style');
      styleEl.id = styleId;
      
      styleEl.innerHTML = `
        .button-${variant}-hover:not(:disabled):hover {
          background-color: ${variantColors.backgroundHover} !important;
          transition: background-color 0.3s ease !important;
        }
        
        .button-${variant}-active:not(:disabled):active {
          background-color: ${variantColors.backgroundPressed} !important;
        }
        
        .button-link-hover:not(:disabled):hover {
          color: ${variantColors.textHover || '#9D3CED'} !important;
          transition: color 0.3s ease !important;
        }
        
        .button-disabled {
          cursor: not-allowed !important;
          opacity: ${variant === 'primary' || variant === 'destructive' ? '0.6' : '0.5'} !important;
        }
      `;
      
      document.head.appendChild(styleEl);
      
      // Adiciona a classe ao botão
      const buttonElement = document.querySelector(`[data-testid="${testID}"]`);
      if (buttonElement) {
        buttonElement.classList.add(`button-${variant}-hover`);
        buttonElement.classList.add(`button-${variant}-active`);
      }
      
      return () => {
        // Limpa o estilo quando o componente é desmontado
        const styleElement = document.getElementById(styleId);
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, [variant, isDark]);
  
  // Renderiza o spinner de carregamento
  const renderSpinner = () => (
    <ActivityIndicator 
      size={size === 'lg' || size === 'md' ? 'small' : 'small'} 
      color={getSpinnerColor()}
      style={{ marginRight: loadingText ? 0 : 0 }}
    />
  );
  
  // Renderiza o conteúdo do botão
  const renderContent = () => {
    if (loading) {
      return (
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {renderSpinner()}
          {loadingText && (
            <Text 
              style={[
                {
                  fontFamily: 'PlusJakartaSans_400Regular',
                  color: colorScheme[variant].text,
                  fontSize: sizeConfig.fontSize,
                  fontWeight: sizeConfig.fontWeight as '400' | '500' | '600' | '700',
                  marginLeft: 6,
                },
                textStyle
              ]}
              data-button-text={variant}
            >
              {loadingText}
            </Text>
          )}
        </View>
      );
    }
    
    return (
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {leftIcon ? (
          <>
            {leftIcon}
            <View style={{ width: 6 }} />
          </>
        ) : null}
        {children ? (
          <Text
            data-button-text={variant}
            style={[
              {
                fontFamily: 'PlusJakartaSans_400Regular',
                color: colorScheme[variant].text,
                fontSize: sizeConfig.fontSize,
                fontWeight: sizeConfig.fontWeight as '400' | '500' | '600' | '700',
                marginLeft: leftIcon ? 0 : 0,
                marginRight: rightIcon ? 0 : 0,
              },
              textStyle,
            ]}
          >
            {children}
          </Text>
        ) : null}
        {rightIcon ? (
          <>
            <View style={{ width: 6 }} />
            {rightIcon}
          </>
        ) : null}
      </View>
    );
  };
  
  return (
    <TouchableOpacity
      activeOpacity={variant === 'link' ? 0.7 : 0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
      testID={testID || `button-${variant}-${Math.random().toString(36).substr(2, 9)}`}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...(Platform.OS === 'web' ? {
        className: `button-${variant}-hover button-${variant}-active ${(disabled || loading) ? 'button-disabled' : ''}`,
      } : {})}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}; 