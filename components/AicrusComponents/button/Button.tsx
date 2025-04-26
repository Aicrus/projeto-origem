import React, { ReactNode, useEffect } from 'react';
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
import { colors, ColorType } from '../../../constants/theme';

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
  /** Classe CSS para estilizar no web */
  className?: string;
  /** Cor de fundo quando hover (para web) */
  hoverColor?: string;
  /** Atributo aria-label para acessibilidade */
  'aria-label'?: string;
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
  className = '',
  hoverColor,
  'aria-label': ariaLabel,
  ...rest
}: ButtonProps) => {
  // Obtém o tema atual e verifica se está no modo escuro
  const { currentTheme, getColorByMode } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Responsividade
  const { isMobile } = useResponsive();
  
  // Determina se o botão tem texto ou apenas ícone
  const hasText = !isIconOnly && React.isValidElement(children);
  
  // Cores para os diferentes temas e variantes baseadas no nosso sistema de tema
  const colorScheme = {
    primary: {
      background: getColorByMode('primary'),
      backgroundHover: getColorByMode('primary-hover'),
      backgroundPressed: getColorByMode('primary-active'),
      text: '#FFFFFF',
      border: 'transparent',
      disabled: `${getColorByMode('primary')}80`, // 80 = 50% de opacidade
      disabledText: '#FFFFFF',
      textHover: undefined,
      textPressed: undefined,
      disabledBorder: undefined,
    },
    destructive: {
      background: getColorByMode('tertiary'),
      backgroundHover: getColorByMode('tertiary-hover'),
      backgroundPressed: getColorByMode('tertiary-active'),
      text: '#FFFFFF',
      border: 'transparent',
      disabled: `${getColorByMode('tertiary')}80`,
      disabledText: '#FFFFFF',
      textHover: undefined,
      textPressed: undefined,
      disabledBorder: undefined,
    },
    outline: {
      background: 'transparent',
      backgroundHover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
      backgroundPressed: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
      text: getColorByMode('text-primary'),
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
      text: getColorByMode('text-primary'),
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
      text: getColorByMode('primary'),
      textHover: getColorByMode('primary-hover'),
      textPressed: getColorByMode('primary-active'),
      border: 'transparent',
      disabled: 'transparent',
      disabledText: `${getColorByMode('primary')}80`,
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
  useEffect(() => {
    if (Platform.OS === 'web') {
      const styleElement = document.createElement('style');
      const buttonClass = `button-${variant}-${size}-${disabled ? 'disabled' : 'enabled'}`;
      
      styleElement.textContent = `
        .${buttonClass}:hover:not(:disabled) {
          background-color: ${hoverColor || colorScheme[variant].backgroundHover};
          transition: background-color 0.2s ease;
        }
        
        .${buttonClass}:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .${buttonClass}:active:not(:disabled) {
          transform: scale(0.98);
        }
      `;
      
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [variant, size, disabled, hoverColor]);
  
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
  
  const buttonClass = `button-${variant}-${size}-${disabled ? 'disabled' : 'enabled'} ${className}`;
  
  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getButtonStyles(), style]}
      testID={testID || `button-${variant}-${Math.random().toString(36).substr(2, 9)}`}
      accessibilityLabel={accessibilityLabel || (typeof children === 'string' ? children : undefined)}
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || loading, busy: loading }}
      {...(Platform.OS === 'web' ? { className: buttonClass } : {})}
      {...rest}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}; 