import React, { useEffect, useMemo } from 'react';
import { 
  Animated, 
  Text, 
  View, 
  ViewStyle, 
  StyleSheet, 
  TouchableOpacity, 
  Platform,
  useWindowDimensions,
  Pressable
} from 'react-native';
import { useTheme } from '../../../hooks/ThemeContext';
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from 'lucide-react-native';

/**
 * @component Toast
 * @description Componente de notificação moderno e personalizável que suporta:
 * - Variantes: success, error, warning, info
 * - Posições: top, bottom, top-left, top-right, bottom-left, bottom-right
 * - Animações de entrada e saída
 * - Tema claro/escuro automático
 * - Opção de fechamento manual
 * - Tempo de exibição configurável
 * 
 * Exemplos de uso:
 * 
 * ```tsx
 * // Toast de sucesso no topo
 * <Toast
 *   visible={isVisible}
 *   type="success"
 *   position="top"
 *   message="Operação realizada com sucesso!"
 *   duration={3000}
 *   onHide={() => setIsVisible(false)}
 * />
 * 
 * // Toast de erro na parte inferior
 * <Toast
 *   visible={isVisible}
 *   type="error"
 *   position="bottom"
 *   message="Ocorreu um erro"
 *   description="Tente novamente mais tarde."
 *   duration={5000}
 *   onHide={() => setIsVisible(false)}
 * />
 * 
 * // Toast com botão de fechamento
 * <Toast
 *   visible={isVisible}
 *   type="info"
 *   position="top-right"
 *   message="Nova atualização disponível"
 *   closable={true}
 *   onHide={() => setIsVisible(false)}
 * />
 * ```
 */

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 
  | 'top' 
  | 'bottom' 
  | 'top-left' 
  | 'top-right' 
  | 'bottom-left' 
  | 'bottom-right';

export interface ToastProps {
  /** Se o toast está visível */
  visible: boolean;
  /** Mensagem principal do toast */
  message: string;
  /** Descrição opcional (texto secundário) */
  description?: string;
  /** Tipo de toast que define a cor e ícone */
  type: ToastType;
  /** Posição do toast na tela */
  position?: ToastPosition;
  /** Duração em ms da exibição do toast (0 para não desaparecer) */
  duration?: number;
  /** Função chamada quando o toast é fechado */
  onHide: () => void;
  /** Se o toast pode ser fechado pelo usuário */
  closable?: boolean;
  /** Estilos adicionais para o container do toast */
  style?: ViewStyle;
  /** ID para testes automatizados */
  testID?: string;
}

export function Toast({
  visible,
  message,
  description,
  type = 'info',
  position = 'top',
  duration = 3000,
  onHide,
  closable = false,
  style,
  testID,
}: ToastProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const opacity = React.useRef(new Animated.Value(0)).current;
  const offset = React.useRef(new Animated.Value(position.includes('top') ? -20 : 20)).current;
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  
  // Configurações visuais baseadas no tipo
  const toastConfig = useMemo(() => ({
    success: {
      backgroundColor: isDark ? 'bg-success-bg-dark' : 'bg-success-bg-light',
      textColor: isDark ? 'text-success-text-dark' : 'text-success-text-light',
      borderColor: isDark ? 'border-success-border-dark' : 'border-success-border-light',
      icon: () => <CheckCircle size={20} color={isDark ? '#10B981' : '#059669'} />,
    },
    error: {
      backgroundColor: isDark ? 'bg-error-bg-dark' : 'bg-error-bg-light',
      textColor: isDark ? 'text-error-text-dark' : 'text-error-text-light',
      borderColor: isDark ? 'border-error-border-dark' : 'border-error-border-light',
      icon: () => <AlertCircle size={20} color={isDark ? '#F87171' : '#DC2626'} />,
    },
    warning: {
      backgroundColor: isDark ? 'bg-warning-bg-dark' : 'bg-warning-bg-light',
      textColor: isDark ? 'text-warning-text-dark' : 'text-warning-text-light',
      borderColor: isDark ? 'border-warning-border-dark' : 'border-warning-border-light',
      icon: () => <AlertTriangle size={20} color={isDark ? '#FBBF24' : '#D97706'} />,
    },
    info: {
      backgroundColor: isDark ? 'bg-info-bg-dark' : 'bg-info-bg-light',
      textColor: isDark ? 'text-info-text-dark' : 'text-info-text-light',
      borderColor: isDark ? 'border-info-border-dark' : 'border-info-border-light',
      icon: () => <Info size={20} color={isDark ? '#38BDF8' : '#0284C7'} />,
    },
  }), [isDark]);

  // Calcula posição baseada na prop position
  const getPositionStyle = (): ViewStyle => {
    const basePositionStyle: ViewStyle = {
      position: 'absolute',
      zIndex: 9999,
      width: isMobile ? 'auto' : 400,
    };

    // Posições horizontais
    if (position.includes('left')) {
      basePositionStyle.left = isMobile ? 16 : 24;
      basePositionStyle.right = 'auto';
    } else if (position.includes('right')) {
      basePositionStyle.right = isMobile ? 16 : 24;
      basePositionStyle.left = 'auto';
    } else {
      // Centralizado
      basePositionStyle.left = isMobile ? 16 : 'auto';
      basePositionStyle.right = isMobile ? 16 : 'auto';
      basePositionStyle.marginHorizontal = isMobile ? 0 : 'auto';
    }

    // Posições verticais
    if (position.includes('top')) {
      basePositionStyle.top = isMobile ? 50 : 24;
      basePositionStyle.bottom = 'auto';
    } else {
      basePositionStyle.bottom = isMobile ? 50 : 24;
      basePositionStyle.top = 'auto';
    }

    return basePositionStyle;
  };

  // Animações de entrada e saída
  useEffect(() => {
    if (visible) {
      // Reset initial position for animation
      offset.setValue(position.includes('top') ? -20 : 20);
      
      // Animate in
      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(offset, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        })
      ]).start();

      // Auto-hide after duration (if duration > 0)
      if (duration > 0) {
        const timer = setTimeout(() => {
          hideToast();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, duration]);

  // Função para esconder o toast com animação
  const hideToast = () => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(offset, {
        toValue: position.includes('top') ? -20 : 20,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      onHide();
    });
  };

  const handleClose = () => {
    hideToast();
  };

  if (!visible) return null;

  const transformStyle = {
    transform: [{ translateY: offset }],
  };

  return (
    <Animated.View
      testID={testID || `toast-${type}`}
      style={[
        getPositionStyle(),
        transformStyle,
        { opacity },
        style,
      ]}
    >
      <View 
        className={`${toastConfig[type].backgroundColor} border border-${toastConfig[type].borderColor} rounded-lg shadow-md overflow-hidden`}
        style={styles.container}
      >
        <View style={styles.contentContainer}>
          <View style={styles.iconContainer}>
            {toastConfig[type].icon()}
          </View>
          
          <View style={styles.textContainer}>
            <Text 
              className={`${toastConfig[type].textColor} font-jakarta-semibold`}
              style={styles.message}
              numberOfLines={2}
            >
              {message}
            </Text>
            
            {description ? (
              <Text 
                className={`${toastConfig[type].textColor} opacity-90 font-jakarta-regular`}
                style={styles.description}
                numberOfLines={3}
              >
                {description}
              </Text>
            ) : null}
          </View>
          
          {closable && (
            <Pressable 
              onPress={handleClose} 
              style={styles.closeButton}
              hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
              accessibilityLabel="Fechar notificação"
            >
              <X 
                size={16} 
                color={isDark ? 
                  (type === 'info' ? '#38BDF8' : 
                   type === 'success' ? '#10B981' : 
                   type === 'warning' ? '#FBBF24' : 
                   '#F87171') : 
                  (type === 'info' ? '#0284C7' : 
                   type === 'success' ? '#059669' : 
                   type === 'warning' ? '#D97706' : 
                   '#DC2626')
                } 
              />
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 450,
    minHeight: 48,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  iconContainer: {
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
  },
  description: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 2,
  },
  closeButton: {
    padding: 2,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
}); 