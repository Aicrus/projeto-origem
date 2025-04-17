import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Animated, Pressable, Platform, Dimensions, ScrollView, Text } from 'react-native';
import { Clock, DollarSign, Bell, ArrowUpRight } from 'lucide-react-native';
import { HoverableView } from '../hoverable-view/HoverableView';
import { useTheme } from '../../../hooks/ThemeContext';
import { colors } from '../constants/theme';
import { useResponsive } from '../../../hooks/useResponsive';
import { router } from 'expo-router';

/**
 * @component NotificationsMenu
 * @description Componente de menu de notificações que exibe uma lista de notificações
 * ao usuário. Possui uma animação suave de entrada e saída, e exibe notificações
 * com indicadores de leitura, ícones, títulos, descrições e timestamps.
 * 
 * As notificações são sensíveis ao tema atual da aplicação, adaptando suas cores
 * para modo claro ou escuro automaticamente.
 * 
 * Recursos:
 * - Animação de fade e deslizamento
 * - Indicador visual para notificações não lidas
 * - Efeitos hover nas notificações
 * - ScrollView para listar todas as notificações
 * - Compatibilidade com web e mobile
 * - Adaptação automática ao tema (claro/escuro)
 * - Posicionamento dinâmico próximo ao elemento que o invocou
 * - Bloqueio de scroll na página quando aberto (mantendo scroll interno)
 */

export interface NotificationItem {
  id: number | string;
  icon: any; // Componente do ícone
  title: string;
  description: string;
  time: string;
  isUnread: boolean;
}

interface Position {
  x: number;
  y: number;
}

interface NotificationsMenuProps {
  /** Controla a visibilidade do menu */
  isVisible: boolean;
  /** Função chamada quando o usuário fecha o menu */
  onClose: () => void;
  /** Lista de notificações para exibir */
  notifications?: NotificationItem[];
  /** Texto do link no rodapé */
  viewAllText?: string;
  /** Função chamada quando o usuário clica no link de ver todas as notificações */
  onViewAll?: () => void;
  /** Título do menu de notificações */
  title?: string;
  /** Subtítulo do menu de notificações */
  subtitle?: string;
  /** Posição onde o menu deve ser exibido (coordenadas x, y) */
  position?: Position;
  /** Rota para navegar ao clicar em "Ver todas as notificações" */
  viewAllRoute?: string;
  /** Altura máxima da lista de notificações */
  maxHeight?: number;
}

// Notificações de exemplo para demonstração
const DEFAULT_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 1,
    icon: DollarSign,
    title: 'Nova transação recebida',
    description: 'Você recebeu uma transferência de R$ 1.500,00',
    time: '2 min atrás',
    isUnread: true,
  },
  {
    id: 2,
    icon: Bell,
    title: 'Lembrete de meta',
    description: 'Sua meta "Viagem para Europa" está próxima do prazo',
    time: '1 hora atrás',
    isUnread: true,
  },
  {
    id: 3,
    icon: ArrowUpRight,
    title: 'Limite do cartão atualizado',
    description: 'Seu limite foi aumentado para R$ 15.000,00',
    time: '3 horas atrás',
    isUnread: false,
  },
  {
    id: 4,
    icon: Clock,
    title: 'Fatura próxima do vencimento',
    description: 'Sua fatura vence em 3 dias',
    time: '5 horas atrás',
    isUnread: false,
  },
  {
    id: 5,
    icon: Bell,
    title: 'Novo recurso disponível',
    description: 'Agora você pode personalizar suas metas de investimento com mais opções',
    time: '1 dia atrás',
    isUnread: false,
  },
];

export function NotificationsMenu({ 
  isVisible, 
  onClose,
  notifications = DEFAULT_NOTIFICATIONS,
  viewAllText = "Ver todas as notificações",
  onViewAll,
  title = "Notificações",
  subtitle = "Últimas atualizações",
  position,
  viewAllRoute = '/dev',
  maxHeight = 320
}: NotificationsMenuProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const { isMobile } = useResponsive();
  
  // Valores de animação
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;
  
  // Ref para a lista de notificações
  const scrollViewRef = useRef<ScrollView>(null);

  // Cores para o tema atual
  const themeColors = {
    primary: isDark ? colors.primary.dark : colors.primary.main,
    secondaryBackground: isDark ? '#14181B' : '#FFFFFF',
    divider: isDark ? '#262D34' : '#E0E3E7',
    textPrimary: isDark ? '#FFFFFF' : '#14181B',
    textSecondary: isDark ? '#95A1AC' : '#57636C',
    textTertiary: isDark ? '#6B7280' : '#8B97A2',
  };

  // Função para lidar com o clique em "Ver todas as notificações"
  const handleViewAll = () => {
    if (onViewAll) {
      onViewAll();
    } else if (viewAllRoute) {
      // Navegação para a rota especificada
      router.push(viewAllRoute as any);
    }
    onClose();
  };

  // Executa animação quando a visibilidade muda
  useEffect(() => {
    if (isVisible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(translateYAnim, {
          toValue: 10,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [isVisible]);
  
  // Adicionar estilos CSS para web
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const styleId = `notifications-menu-styles-${Math.random().toString(36).substr(2, 9)}`;
      const style = document.createElement('style');
      style.id = styleId;
      
      style.textContent = `
        /* Garantir que elementos com position:fixed não sejam cortados */
        *, *::before, *::after {
          transform-style: preserve-3d;
        }
        
        /* Garantir que o menu tenha o maior z-index possível */
        [data-notifications-menu="true"] {
          z-index: 2147483647 !important;
          isolation: isolate;
        }

        /* Customização do scrollbar dentro do menu */
        [data-notifications-content="true"]::-webkit-scrollbar {
          width: 4px;
          height: 4px;
        }
        
        [data-notifications-content="true"]::-webkit-scrollbar-track {
          background: transparent;
        }
        
        [data-notifications-content="true"]::-webkit-scrollbar-thumb {
          background-color: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
          border-radius: 3px;
        }
      `;
      
      document.head.appendChild(style);
      
      return () => {
        const styleElement = document.getElementById(styleId);
        if (styleElement) {
          document.head.removeChild(styleElement);
        }
      };
    }
  }, [isDark]);

  // Determinar a posição com base nas coordenadas fornecidas
  const getPositionStyle = () => {
    if (position && Platform.OS === 'web') {
      // Se temos uma posição definida pelo usuário e estamos na web
      // Manter o comportamento atual para web
      const windowWidth = Dimensions.get('window').width;
      const menuWidth = isMobile ? Math.min(320, windowWidth * 0.9) : 320;
      
      // Calcular posição horizontal mantendo o menu dentro da tela
      let leftPosition;
      
      // Verificar em qual lado da tela o botão está
      const isRightSide = position.x > windowWidth / 2;
      
      if (isRightSide) {
        // Botão à direita: alinhar à direita do botão
        // Garantir que o menu não saia pela direita
        const rightEdgePosition = Math.min(position.x, windowWidth - 16);
        leftPosition = Math.max(16, rightEdgePosition - menuWidth);
      } else {
        // Botão à esquerda: alinhar à esquerda do botão
        // Garantir que o menu não saia pela esquerda
        leftPosition = Math.max(16, Math.min(position.x, windowWidth - menuWidth - 16));
      }
      
      // Altura definida para a viewport
      const windowHeight = window.innerHeight;
      
      // Define valores para posicionamento
      const spacingDown = 1;
      
      // Calcula se o menu cabe abaixo da posição
      const menuHeight = Math.min(maxHeight + 100, windowHeight * 0.8); // Altura do menu com cabeçalho e rodapé
      const spaceBelow = windowHeight - position.y;
      const fitsBelow = spaceBelow >= menuHeight;
      
      if (fitsBelow) {
        // O menu cabe abaixo do botão
        return {
          position: 'fixed' as 'fixed',
          top: position.y + spacingDown,
          left: leftPosition,
          zIndex: 2147483647,
        };
      } else {
        // O menu não cabe abaixo, então vamos posicioná-lo acima
        const spacingUp = 1;
        
        // Posição Y considerando o espaço para o menu acima
        const topPosition = Math.max(spacingUp, position.y - menuHeight - spacingUp);
        
        return {
          position: 'fixed' as 'fixed',
          top: topPosition,
          left: leftPosition,
          zIndex: 2147483647,
        };
      }
    }
    
    // Posicionamento para ambiente nativo (posições fixas conforme especificação)
    // Ou posição padrão para web sem position
    return Platform.select({
      web: {
        position: 'fixed' as 'fixed',
        top: 60,
        right: 20,
        zIndex: 2147483647,
      },
      default: {
        position: 'absolute' as 'absolute',
        right: 16 + 50, // SPACING.lg + 50 equivalente (mais à direita que o menu de perfil)
        top: -21, // Ajuste inicial muito mais elevado para subir o menu
        width: 320, // Largura específica para notificações
        zIndex: 2147483647,
      }
    });
  };

  // Estilos responsivos para posicionamento no mobile vs web
  const responsiveStyles = {
    overlay: {
      ...Platform.select({
        web: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2147483646,
          backgroundColor: 'transparent'
        },
        default: {
          position: 'absolute',
          top: 0,
          left: 0,
          width: Dimensions.get('window').width,
          height: Dimensions.get('window').height,
          zIndex: 2147483646,
          backgroundColor: 'transparent'
        }
      }) as any
    },
    container: getPositionStyle() as any
  };

  // Não renderiza nada se não estiver visível
  if (!isVisible) return null;

  return (
    <View style={{ 
      position: Platform.OS === 'web' ? 'fixed' : 'absolute', 
      top: 0, 
      left: 0, 
      right: 0, 
      bottom: 0, 
      zIndex: 9999 
    }}>
      {/* Overlay para fechar o menu ao clicar fora */}
      <Pressable
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'transparent',
        }}
        onPress={onClose}
      />
      
      {/* Menu de notificações */}
      <View style={Platform.OS !== 'web' ? {
        // Sombra suave baseada no estilo 'md' do tailwind.config.js 
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        backgroundColor: 'transparent',
        ...(Platform.OS === 'ios' || Platform.OS === 'android' ? { top: 10 } : {}), // Ajuste específico para ambiente nativo na mesma altura do perfil
      } : {}}>
        <Animated.View
          style={[
            styles.container,
            responsiveStyles.container,
            {
              backgroundColor: themeColors.secondaryBackground,
              borderColor: themeColors.divider,
              opacity: fadeAnim,
              transform: [{ translateY: translateYAnim }],
              width: isMobile ? (Platform.OS === 'web' ? '90%' : 320) : 320,
              maxWidth: 320,
              // Sombra para web baseada no estilo 'md' do tailwind.config.js
              ...(Platform.OS === 'web' 
                ? { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' } 
                : {}
              ),
            },
          ]}
          // @ts-ignore - Para compatibilidade web
          data-notifications-menu="true"
        >
          {/* Cabeçalho */}
          <View style={styles.header}>
            <Text style={[styles.title, { color: themeColors.textPrimary }]}>{title}</Text>
            <Text style={[styles.subtitle, { color: themeColors.textSecondary }]}>{subtitle}</Text>
          </View>

          {/* Divisor */}
          <View style={[styles.divider, { backgroundColor: themeColors.divider }]} />

          {/* Lista de notificações */}
          <ScrollView 
            ref={scrollViewRef}
            style={[styles.notificationsList, { maxHeight }]}
            showsVerticalScrollIndicator={false}
            // @ts-ignore - Para compatibilidade web
            data-notifications-content="true"
            nestedScrollEnabled={true}
          >
            {notifications.map((notification) => {
              // Definir o estilo de background diretamente
              const itemStyle = {
                ...styles.notificationItem,
                backgroundColor: notification.isUnread ? themeColors.primary + '08' : 'transparent',
              };
              
              return (
                <HoverableView
                  key={notification.id}
                  style={itemStyle}
                  hoverScale={1.01}
                >
                  <View style={[
                    styles.iconContainer,
                    { backgroundColor: themeColors.primary + '15' }
                  ]}>
                    <notification.icon
                      size={16}
                      color={themeColors.primary}
                      strokeWidth={2}
                    />
                  </View>
                  <View style={styles.notificationContent}>
                    <View style={styles.notificationHeader}>
                      <Text style={[
                        styles.notificationTitle, 
                        { color: themeColors.textPrimary }
                      ]}>
                        {notification.title}
                      </Text>
                      <Text style={[
                        styles.notificationTime, 
                        { color: themeColors.textTertiary }
                      ]}>
                        {notification.time}
                      </Text>
                    </View>
                    <Text style={[
                      styles.notificationDescription, 
                      { color: themeColors.textSecondary }
                    ]}>
                      {notification.description}
                    </Text>
                  </View>
                  {notification.isUnread && (
                    <View style={[
                      styles.unreadDot,
                      { backgroundColor: themeColors.primary }
                    ]} />
                  )}
                </HoverableView>
              );
            })}
          </ScrollView>

          {/* Divisor */}
          <View style={[styles.divider, { backgroundColor: themeColors.divider }]} />

          {/* Rodapé */}
          <HoverableView 
            style={styles.footer} 
            hoverScale={1.01}
            onPress={handleViewAll}
          >
            <Text style={[
              styles.viewAll, 
              { color: themeColors.primary }
            ]}>
              {viewAllText}
            </Text>
          </HoverableView>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: Platform.OS === 'web' ? 'visible' : 'hidden',
    ...Platform.select({
      web: {
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      },
      default: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
      },
    }),
  },
  header: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  subtitle: {
    fontSize: 12,
    opacity: 0.7,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  notificationsList: {
    ...Platform.select({
      web: {
        overflowY: 'auto',
        overflowX: 'hidden',
      },
      default: {
        paddingHorizontal: 1,
      }
    }),
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    position: 'relative',
    width: '100%',
    gap: 12,
    ...Platform.select({
      web: {
        cursor: 'pointer',
      },
      default: {
        backgroundColor: 'transparent', 
      },
    }),
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
    minWidth: 0,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 2,
  },
  notificationTitle: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
    marginRight: 12,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  notificationTime: {
    fontSize: 11,
    opacity: 0.5,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  notificationDescription: {
    fontSize: 12,
    opacity: 0.8,
    lineHeight: 16,
    fontFamily: 'PlusJakartaSans_400Regular',
    ...Platform.select({
      web: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        width: '100%',
      },
      default: {
        maxWidth: '100%',
      }
    }) as any,
  },
  unreadDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
    top: 12,
    right: 12,
  },
  footer: {
    padding: 12,
    alignItems: 'center',
  },
  viewAll: {
    fontSize: 13,
    textAlign: 'center',
    padding: 8,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
}); 