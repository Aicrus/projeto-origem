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

/**
 * Nomes de posição formatados para exibição ao usuário
 */
export const ToastPositionLabels: Record<ToastPosition, string> = {
  'top': 'Top',
  'bottom': 'Bottom',
  'top-left': 'Top Left',
  'top-right': 'Top Right',
  'bottom-left': 'Bottom Left',
  'bottom-right': 'Bottom Right'
};

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
  /** Se o toast mostra uma barra de progresso */
  showProgressBar?: boolean;
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
  position = 'bottom-right',
  duration = 3000,
  onHide,
  closable = false,
  showProgressBar = false,
  style,
  testID,
}: ToastProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const opacity = React.useRef(new Animated.Value(0)).current;
  const offset = React.useRef(new Animated.Value(position.includes('top') ? -20 : 20)).current;
  const progressAnim = React.useRef(new Animated.Value(1)).current;
  const { width: windowWidth } = useWindowDimensions();
  const isMobile = windowWidth < 768;
  
  // Configurações visuais baseadas no tipo
  const toastConfig = useMemo(() => ({
    success: {
      backgroundColor: isDark ? 'bg-success-bg-dark' : 'bg-success-bg-light',
      textColor: isDark ? 'text-success-text-dark' : 'text-success-text-light',
      borderColor: 'border-gray-200 dark:border-gray-700',
      icon: () => <CheckCircle size={20} color={isDark ? '#10B981' : '#059669'} />,
    },
    error: {
      backgroundColor: isDark ? 'bg-error-bg-dark' : 'bg-error-bg-light',
      textColor: isDark ? 'text-error-text-dark' : 'text-error-text-light',
      borderColor: 'border-gray-200 dark:border-gray-700',
      icon: () => <AlertCircle size={20} color={isDark ? '#F87171' : '#DC2626'} />,
    },
    warning: {
      backgroundColor: isDark ? 'bg-warning-bg-dark' : 'bg-warning-bg-light',
      textColor: isDark ? 'text-warning-text-dark' : 'text-warning-text-light',
      borderColor: 'border-gray-200 dark:border-gray-700',
      icon: () => <AlertTriangle size={20} color={isDark ? '#FBBF24' : '#D97706'} />,
    },
    info: {
      backgroundColor: isDark ? 'bg-info-bg-dark' : 'bg-info-bg-light',
      textColor: isDark ? 'text-info-text-dark' : 'text-info-text-light',
      borderColor: 'border-gray-200 dark:border-gray-700',
      icon: () => <Info size={20} color={isDark ? '#38BDF8' : '#0284C7'} />,
    },
  }), [isDark]);

  // Calcula posição baseada na prop position
  const getPositionStyle = (): ViewStyle => {
    // Em plataformas web, usamos posição fixa para evitar problemas com scroll
    const positionType = Platform.OS === 'web' ? 'fixed' : 'absolute';
    
    const basePositionStyle: ViewStyle = {
      position: positionType as any,
      zIndex: 9999,
      width: isMobile ? '90%' : 400,
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
      basePositionStyle.left = isMobile ? '5%' : '50%';
      basePositionStyle.right = 'auto';
      basePositionStyle.marginLeft = isMobile ? 0 : -200; // metade da largura para centralizar
    }

    // Posições verticais
    if (position.includes('top')) {
      basePositionStyle.top = isMobile ? 80 : 24;
      basePositionStyle.bottom = 'auto';
    } else {
      basePositionStyle.bottom = isMobile ? 80 : 24;
      basePositionStyle.top = 'auto';
    }

    return basePositionStyle;
  };

  // Animações de entrada e saída
  useEffect(() => {
    if (visible) {
      // Reset initial position for animation
      offset.setValue(position.includes('top') ? -20 : 20);
      progressAnim.setValue(1); // Reset progress animation
      
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
        // Animar a barra de progresso
        if (showProgressBar) {
          Animated.timing(progressAnim, {
            toValue: 0,
            duration: duration,
            useNativeDriver: false, // Não pode usar useNativeDriver para width
          }).start();
        }

        const timer = setTimeout(() => {
          hideToast();
        }, duration);

        return () => clearTimeout(timer);
      }
    }
  }, [visible, duration, showProgressBar]);

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

  // Função para renderizar a barra de progresso
  const renderProgressBar = () => {
    if (!showProgressBar || duration <= 0) return null;

    const progressBarColor = {
      success: isDark ? '#10B981' : '#059669',
      error: isDark ? '#F87171' : '#DC2626',
      warning: isDark ? '#FBBF24' : '#D97706',
      info: isDark ? '#38BDF8' : '#0284C7',
    };
    
    return (
      <View style={styles.progressContainer}>
        <Animated.View 
          style={[
            styles.progressBar, 
            { 
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
              backgroundColor: progressBarColor[type]
            }
          ]} 
        />
      </View>
    );
  };

  if (!visible) return null;

  const transformStyle = {
    transform: [{ translateY: offset }],
  };

  // No web, renderizamos em um portal para garantir que o Toast esteja fora de qualquer
  // container com scrolling ou com position: relative
  if (Platform.OS === 'web' && visible) {
    // Utilizamos React Portal em ambientes web para posicionar o Toast corretamente
    // Esta parte só é executada se react-dom estiver disponível (web)
    try {
      const ReactDOM = require('react-dom');
      const portalContainer = document.getElementById('toast-portal-container');
      
      if (!portalContainer) {
        const newPortalContainer = document.createElement('div');
        newPortalContainer.id = 'toast-portal-container';
        newPortalContainer.style.position = 'fixed';
        newPortalContainer.style.zIndex = '9999';
        newPortalContainer.style.pointerEvents = 'none';
        newPortalContainer.style.top = '0';
        newPortalContainer.style.left = '0';
        newPortalContainer.style.right = '0';
        newPortalContainer.style.bottom = '0';
        document.body.appendChild(newPortalContainer);
      }

      const toastContent = (
        <Animated.View
          testID={testID || `toast-${type}`}
          style={[
            getPositionStyle(),
            transformStyle,
            { opacity, pointerEvents: 'auto' as any },
            style,
          ]}
        >
          <View 
            className={`${toastConfig[type].backgroundColor} border ${toastConfig[type].borderColor} rounded-lg overflow-hidden`}
            style={[styles.container, {
              shadowColor: isDark ? '#000000' : '#000000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: isDark ? 0.2 : 0.1,
              shadowRadius: 10,
              elevation: 5,
              borderWidth: isDark ? 0.5 : 0.7,
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
              backgroundColor: isDark ? 
                (type === 'success' ? '#064E3B' : 
                 type === 'error' ? '#450A0A' : 
                 type === 'warning' ? '#451A03' : 
                 '#082F49') : 
                (type === 'success' ? '#ECFDF5' : 
                 type === 'error' ? '#FEF2F2' : 
                 type === 'warning' ? '#FFFBEB' : 
                 '#EFF6FF'),
            }]}
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
            {renderProgressBar()}
          </View>
        </Animated.View>
      );

      const portalTarget = document.getElementById('toast-portal-container');
      if (portalTarget) {
        return ReactDOM.createPortal(toastContent, portalTarget);
      }
    } catch (e) {
      // Fallback para quando react-dom não estiver disponível
      console.log('React DOM not available, using standard rendering');
    }
  }

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
        className={`${toastConfig[type].backgroundColor} border ${toastConfig[type].borderColor} rounded-lg overflow-hidden`}
        style={[styles.container, {
          shadowColor: isDark ? '#000000' : '#000000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.2 : 0.1,
          shadowRadius: 10,
          elevation: 5,
          borderWidth: isDark ? 0.5 : 0.7,
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.08)',
          backgroundColor: isDark ? 
            (type === 'success' ? '#064E3B' : 
             type === 'error' ? '#450A0A' : 
             type === 'warning' ? '#451A03' : 
             '#082F49') : 
            (type === 'success' ? '#ECFDF5' : 
             type === 'error' ? '#FEF2F2' : 
             type === 'warning' ? '#FFFBEB' : 
             '#EFF6FF'),
        }]}
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
        {renderProgressBar()}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    maxWidth: 450,
    minHeight: 48,
    backdropFilter: Platform.OS === 'web' ? 'blur(8px)' : undefined,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconContainer: {
    marginRight: 14,
  },
  textContainer: {
    flex: 1,
  },
  message: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
  },
  description: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
    opacity: 0.85,
  },
  closeButton: {
    padding: 4,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContainer: {
    width: '100%',
    height: 3,
    backgroundColor: 'rgba(0,0,0,0.06)',
  },
  progressBar: {
    height: '100%',
  },
}); 