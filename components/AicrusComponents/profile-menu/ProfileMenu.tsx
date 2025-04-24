import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, View, Animated, TouchableOpacity, Pressable, Platform, Dimensions, ViewStyle, Text } from 'react-native';
import { LogOut, Settings, Sun, Moon, Monitor } from 'lucide-react-native';
import { HoverableView } from '../hoverable-view/HoverableView';
import { useTheme } from '../../../hooks/ThemeContext';
import { colors } from '../constants/theme';
import { LucideIcon } from 'lucide-react-native';
import { useAuth } from '../../../contexts/auth';
import { router } from 'expo-router';
import { useResponsive } from '../../../hooks/useResponsive';

/**
 * @component ProfileMenu
 * @description Componente de menu de perfil que exibe informações do usuário
 * e opções como configuração do tema e logout.
 * 
 * Recursos:
 * - Animação de fade e deslizamento
 * - Seleção de tema (claro, escuro, sistema)
 * - Efeitos hover nos itens do menu
 * - Compatibilidade com web e mobile
 * - Adaptação automática ao tema (claro/escuro)
 * - Posicionamento dinâmico próximo ao elemento que o invocou
 */

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  color?: string;
}

export interface ProfileMenuProps {
  /** Controla a visibilidade do menu */
  isVisible: boolean;
  /** Função chamada quando o usuário fecha o menu */
  onClose: () => void;
  /** Função chamada para navegação entre rotas */
  onNavigate?: (route: string) => void;
  /** Posição onde o menu deve ser exibido (coordenadas x, y) */
  position?: { x: number, y: number };
}

export function ProfileMenu({ 
  isVisible, 
  onClose, 
  onNavigate,
  position
}: ProfileMenuProps) {
  const { currentTheme, themeMode, setThemeMode } = useTheme();
  const { session, signOut } = useAuth();
  const { isMobile } = useResponsive();
  const isDark = currentTheme === 'dark';
  
  // Valores de animação
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const translateYAnim = useRef(new Animated.Value(10)).current;

  // Cores para o tema atual
  const themeColors = {
    primary: isDark ? colors.primary.dark : colors.primary.main,
    secondaryBackground: isDark ? '#14181B' : '#FFFFFF',
    divider: isDark ? '#262D34' : '#E0E3E7',
    textPrimary: isDark ? '#FFFFFF' : '#14181B',
    textSecondary: isDark ? '#95A1AC' : '#57636C',
    textTertiary: isDark ? '#6B7280' : '#8B97A2',
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

  const handleLogout = async () => {
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  if (!isVisible) return null;

  const MenuItem = ({ icon: Icon, label, onClick, color = themeColors.textPrimary }: MenuItemProps) => (
    <HoverableView
      style={styles.menuItem}
      onPress={onClick}
      hoverScale={1.01}
    >
      <Icon size={18} color={color} strokeWidth={1.5} />
      <Text style={[styles.menuItemText, { color: themeColors.textPrimary }]}>{label}</Text>
    </HoverableView>
  );

  const getThemeOptionStyle = (isSelected: boolean): ViewStyle => ({
    ...styles.themeOption,
    ...(isSelected ? { backgroundColor: themeColors.primary + '15' } : {})
  });

  // Determinar a posição com base nas coordenadas fornecidas
  const getPositionStyle = () => {
    if (position && Platform.OS === 'web') {
      // Se temos uma posição definida pelo usuário e estamos na web
      // Manter o comportamento atual para web
      const windowWidth = Dimensions.get('window').width;
      const menuWidth = isMobile ? Math.min(220, windowWidth * 0.85) : 220;
      
      // Calcular posição horizontal mantendo o menu dentro da tela
      const leftPosition = Math.max(16, Math.min(position.x - (menuWidth / 2), windowWidth - menuWidth - 16));
      
      // Altura definida para a viewport
      const windowHeight = window.innerHeight;
      
      // Define valores para posicionamento
      const spacingDown = 1;
      
      // Calcula se o menu cabe abaixo da posição
      const menuHeight = 320; // Altura aproximada do menu
      const spaceBelow = windowHeight - position.y;
      const fitsBelow = spaceBelow >= (menuHeight + spacingDown);
      
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
        
        // Posição Y acima do elemento
        const topPosition = Math.max(16, position.y - menuHeight - spacingUp);
        
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
        right: 16, // SPACING.lg equivalente
        width: 200, // Largura específica conforme mencionado
        top: -10, // Posicionando muito mais próximo do header
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
      
      {/* Menu de perfil */}
      <View style={Platform.OS !== 'web' ? {
        // Sombra suave
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 4,
        backgroundColor: 'transparent',
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
              width: isMobile ? (Platform.OS === 'web' ? '85%' : 200) : 220,
              maxWidth: Platform.OS === 'web' ? 220 : undefined,
              // Sombra para web
              ...(Platform.OS === 'web' 
                ? { boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)' } 
                : {}
              ),
            },
          ]}
          data-profile-menu="true"
        >
          {/* Cabeçalho do Perfil */}
          <View style={styles.profileHeader}>
            <Text style={[styles.name, { color: themeColors.textPrimary }]}>
              {session?.user?.user_metadata?.display_name || session?.user?.user_metadata?.name || 'Usuário'}
            </Text>
            <Text style={[styles.email, { color: themeColors.textSecondary }]}>
              {session?.user?.email || 'email@exemplo.com'}
            </Text>
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.divider }]} />

          {/* Opções de Tema */}
          <View style={styles.themeSection}>
            <Text style={[styles.sectionTitle, { color: themeColors.textPrimary }]}>Tema</Text>
            <View style={styles.themeOptions}>
              <HoverableView
                style={getThemeOptionStyle(themeMode === 'light')}
                onPress={() => setThemeMode('light')}
              >
                <Sun size={16} color={themeMode === 'light' ? (isDark ? '#4A6' : colors.primary.main) : themeColors.textPrimary} />
                <Text style={[
                  styles.themeText,
                  { color: themeMode === 'light' ? (isDark ? '#4A6' : colors.primary.main) : themeColors.textPrimary }
                ]}>Claro</Text>
              </HoverableView>

              <HoverableView
                style={getThemeOptionStyle(themeMode === 'dark')}
                onPress={() => setThemeMode('dark')}
              >
                <Moon size={16} color={themeMode === 'dark' ? (isDark ? '#4A6' : colors.primary.main) : themeColors.textPrimary} />
                <Text style={[
                  styles.themeText,
                  { color: themeMode === 'dark' ? (isDark ? '#4A6' : colors.primary.main) : themeColors.textPrimary }
                ]}>Escuro</Text>
              </HoverableView>

              <HoverableView
                style={getThemeOptionStyle(themeMode === 'system')}
                onPress={() => setThemeMode('system')}
              >
                <Monitor size={16} color={themeMode === 'system' ? (isDark ? '#4A6' : colors.primary.main) : themeColors.textPrimary} />
                <Text style={[
                  styles.themeText,
                  { color: themeMode === 'system' ? (isDark ? '#4A6' : colors.primary.main) : themeColors.textPrimary }
                ]}>Sistema</Text>
              </HoverableView>
            </View>
          </View>

          <View style={[styles.divider, { backgroundColor: themeColors.divider }]} />

          {/* Menu Items */}
          <MenuItem
            icon={Settings}
            label="Configurações"
            onClick={() => {
              if (onNavigate) {
                onNavigate('/config');
                onClose();
              } else {
                router.push('/config' as any);
                onClose();
              }
            }}
          />
          <MenuItem
            icon={LogOut}
            label="Sair"
            onClick={handleLogout}
            color={themeColors.primary}
          />
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 45,
      },
      default: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: 45,
      }
    }) as any
  },
  container: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: Platform.OS === 'web' ? 'visible' : 'hidden',
  },
  profileHeader: {
    padding: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 2,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  email: {
    fontSize: 12,
    opacity: 0.7,
    fontFamily: 'PlusJakartaSans_400Regular',
  },
  divider: {
    height: 1,
    width: '100%',
  },
  themeSection: {
    padding: 12,
  },
  sectionTitle: {
    fontSize: 12,
    marginBottom: 8,
    fontFamily: 'PlusJakartaSans_600SemiBold',
  },
  themeOptions: {
    flexDirection: 'row',
    gap: 4,
  },
  themeOption: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    padding: 4,
    paddingTop: 8,
    borderRadius: 8,
    gap: 4,
    ...Platform.select({
      web: {
        cursor: 'pointer',
        transition: 'all 0.2s ease',
      },
    }),
  },
  themeText: {
    fontSize: 10,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    gap: 8,
  },
  menuItemText: {
    fontSize: 13,
    fontFamily: 'PlusJakartaSans_500Medium',
  },
}); 