import { Link, usePathname, useRouter } from 'expo-router';
import { StyleSheet, View, Platform, ViewStyle, TouchableWithoutFeedback, Modal, Pressable, TouchableOpacity, Dimensions, Text } from 'react-native';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ClipboardList, 
  Settings,
  LogOut,
  ChevronRight,
  Building,
  LucideIcon,
  Menu,
  X,
  BarChart2
} from 'lucide-react-native';
import { useResponsive } from '../../hooks/useResponsive';
import { useState, useEffect, useRef, useCallback } from 'react';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { useTheme } from '../../hooks/DesignSystemContext';
import { HoverableView } from '../effects/HoverableView';
import { GradientView } from '../effects/GradientView';
import { useAuth } from '../../contexts/auth';
import { colors } from '../../design-system/tokens/colors';

// Constante para z-index
const Z_INDEX = {
  SIDEBAR: 3500,
  BACKDROP: 2000
};

type AppRoute = {
  path: string;
  label: string;
  icon: LucideIcon;
};

const navItems: AppRoute[] = [
  { path: '/(tabs)', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/projetos', label: 'Projetos', icon: ClipboardList },
  { path: '/clientes', label: 'Clientes', icon: Users },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart2 },
  { path: '/recursos', label: 'Recursos', icon: Building },
  { path: '/configuracoes', label: 'Configurações', icon: Settings },
];

export interface SidebarProps {
  /**
   * Determina se a sidebar está aberta (apenas para mobile)
   */
  isOpen?: boolean;
  /**
   * Callback quando a sidebar é fechada
   */
  onClose?: () => void;
  /**
   * Determina se deve considerar a altura do header
   */
  withHeader?: boolean;
}

export function Sidebar({ isOpen = false, onClose, withHeader = true }: SidebarProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const pathname = usePathname();
  const router = useRouter();
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const { signOut } = useAuth();
  
  // Para facilitar o acesso às cores mais usadas
  const colorWhite = colors['text-primary-dark']; // Branco está definido como text-primary-dark
  const colorGray = {
    '200': isDark ? colors['divider-dark'] : colors['divider-light'],
    '300': isDark ? colors['text-tertiary-dark'] : colors['text-tertiary-light'],
    '600': isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
    '900': isDark ? colors['text-primary-dark'] : colors['text-primary-light']
  };
  
  // Animation values
  const drawerProgress = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  
  // Update animation value when drawer visibility changes
  useEffect(() => {
    if (isOpen) {
      drawerProgress.value = withTiming(1, { duration: 120 });
      backdropOpacity.value = withTiming(1, { duration: 150 });
    } else {
      drawerProgress.value = withTiming(0, { duration: 100 });
      backdropOpacity.value = withTiming(0, { duration: 80 });
    }
  }, [isOpen]);

  const handleNavigation = useCallback((path: string) => {
    // Para caminhos absolutos, precisamos usar push ou navegação simples
    const pathToNavigate = path as any;
    
    if (isMobile) {
      // Primeiro fechar o drawer
      if (onClose) {
        onClose();
      }
      
      // Navegar após um pequeno delay para garantir que o drawer fechou
      setTimeout(() => {
        router.push(pathToNavigate);
      }, 300);
    } else {
      // Em desktop, apenas navega diretamente
      router.push(pathToNavigate);
    }
  }, [isMobile, onClose, router]);
  
  // Função para determinar se um item de menu está ativo com base no pathname atual
  const isMenuItemActive = (itemPath: string) => {
    if (!pathname) return false;
    
    // Debug do pathname e window.location
    const windowPath = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.pathname : '';
    const windowHref = Platform.OS === 'web' && typeof window !== 'undefined' ? window.location.href : '';
    
    // Para o item Dashboard, verificar se estamos em home ou em PerfilGestor
    if (itemPath === '/(tabs)') {
      // Verificar se estamos em qualquer página que tenha "Perfil" no caminho
      const hasPerfilInPath = 
        pathname.includes('Perfil') || 
        pathname.includes('perfil') || 
        windowPath.includes('Perfil') || 
        windowPath.includes('perfil') ||
        windowHref.includes('Perfil') ||
        windowHref.includes('perfil');
      
      // Verificar se estamos na página inicial
      const isHomePage = 
        pathname === '/' || 
        pathname === '' || 
        pathname === '/(tabs)' || 
        pathname === '/(tabs)/index' ||
        pathname === '/home' ||
        windowPath === '/' || 
        windowPath === '/home' ||
        windowHref.endsWith('/') ||
        windowHref.endsWith('/home');
      
      // Debug para averiguar qual condição está sendo atendida
      console.log('Dashboard ativo?', {
        itemPath,
        pathname,
        windowPath,
        isHomePage,
        hasPerfilInPath,
        forceActive: true
      });
      
      // O Dashboard está ativo se estivermos na página inicial OU em uma página com "Perfil"
      // OU forçamos a ativação para rotas específicas como /home
      return isHomePage || hasPerfilInPath || pathname === '/home' || windowPath === '/home';
    }
    
    // Para outros itens de menu
    return pathname.includes(itemPath.replace('/(tabs)', ''));
  };
  
  const getConditionalStyle = (baseStyle: ViewStyle, compactStyle?: ViewStyle): ViewStyle => {
    if (!isTablet || !compactStyle) return baseStyle;
    return StyleSheet.flatten([baseStyle, compactStyle]);
  };
  
  // Animated styles
  const drawerAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      drawerProgress.value,
      [0, 1],
      [-300, 0],
      Extrapolate.CLAMP
    );
    
    return {
      transform: [{ translateX }]
    };
  });
  
  const backdropAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: backdropOpacity.value,
      backgroundColor: `rgba(0, 0, 0, ${backdropOpacity.value * 0.5})`,
    };
  });

  // Na versão desktop para o botão de atualizar plano
  const [isUpdateButtonHovered, setIsUpdateButtonHovered] = useState(false);
  // Para a versão mobile do botão
  const [isMobileUpdateButtonHovered, setIsMobileUpdateButtonHovered] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      if (isMobile && onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  // Se for mobile, renderiza como um drawer modal
  if (isMobile) {
    return (
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="none"
        onRequestClose={onClose}
      >
        <View style={styles.modalContainer}>
          {/* Backdrop com animação */}
          <TouchableWithoutFeedback onPress={onClose}>
            <Animated.View style={[styles.backdrop, backdropAnimatedStyle]} />
          </TouchableWithoutFeedback>
          
          {/* Sidebar com animação */}
          <Animated.View 
            style={[
              styles.drawer, 
              drawerAnimatedStyle,
              isDark && styles.sidebarDark,
              withHeader && styles.withHeaderMobile
            ]}
          >
            {/* Logo */}
            <View style={styles.logoContainer}>
              <View style={[
                getConditionalStyle(styles.logoBox, styles.logoBoxCompact),
                { backgroundColor: isDark ? colors['primary-dark'] : colors['primary-light'] }
              ]}>
                <Building size={20} color={isDark ? colors['icon-dark'] : colors['icon-light']} strokeWidth={1.5} />
              </View>
              <View>
                <Text style={[styles.logoText, isDark && styles.logoTextDark]}>Projeto</Text>
                <Text style={[styles.subLogoText, isDark && styles.subLogoTextDark]}>Origem</Text>
              </View>
            </View>
            
            <View style={styles.navContainer}>
              {navItems.map((item) => {
                const isActive = isMenuItemActive(item.path);
                const isDashboardActive = item.path === '/(tabs)' && isActive;
                
                // Para o item Dashboard ativo, vamos usar um wrapper diferente
                if (isDashboardActive) {
                  return (
                    <TouchableOpacity
                      key={item.path}
                      activeOpacity={0.7}
                      onPress={() => handleNavigation(item.path)}
                      style={styles.navItemContainer}
                    >
                      <GradientView
                        type="primary-fade"
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          padding: 10,
                          borderRadius: 10,
                          gap: 10,
                          height: 40,
                          width: '100%',
                          paddingLeft: 8,
                          paddingRight: 8,
                          justifyContent: 'space-between'
                        }}
                      >
                        <item.icon 
                          size={22}
                          color={colorWhite}
                          strokeWidth={1.5}
                        />
                        <Text style={[
                          styles.navText,
                          styles.activeNavText,
                          isDark && styles.navTextDark,
                          isDashboardActive && {
                            fontWeight: '600',
                            color: 'white',
                            fontSize: 15
                          }
                        ]}>
                          {item.label}
                        </Text>
                        <ChevronRight 
                          size={20} 
                          color={colorWhite}
                          strokeWidth={1.5}
                        />
                      </GradientView>
                    </TouchableOpacity>
                  );
                }
                
                // Para outros itens, mantém o comportamento original
                return (
                  <TouchableOpacity
                    key={item.path}
                    activeOpacity={0.7}
                    onPress={() => handleNavigation(item.path)}
                    style={styles.navItemContainer}
                  >
                    <View style={StyleSheet.flatten([
                      styles.navItem,
                      isActive && styles.activeNavItem,
                    ]) as ViewStyle}>
                      <item.icon 
                        size={20}
                        color={isActive ? colorWhite : isDark ? colorGray['300'] : colorGray['600']}
                        strokeWidth={1.5}
                      />
                      <Text style={[
                        styles.navText,
                        isDark && styles.navTextDark,
                        isActive && styles.activeNavText,
                        isDashboardActive && {
                          fontWeight: '600',
                          color: 'white',
                          fontSize: 15
                        }
                      ]}>
                        {item.label}
                      </Text>
                      {isActive && (
                        <ChevronRight 
                          size={16} 
                          color={colorWhite}
                          strokeWidth={1.5}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
            
            <View style={styles.footerMobile}>
              {/* Botão de Sair */}
              <Pressable 
                style={styles.logoutButton}
                onPress={handleLogout}
              >
                <View style={styles.logoutContent}>
                  <LogOut 
                    size={20} 
                    color={isDark ? colorGray['300'] : colorGray['600']}
                    strokeWidth={1.5}
                  />
                  <Text style={[styles.logoutText, isDark && styles.logoutTextDark]}>Sair</Text>
                </View>
              </Pressable>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  // Para tablet e desktop, renderiza uma sidebar fixa
  return (
    <View style={[
      getConditionalStyle(styles.sidebar, styles.sidebarCompact),
      isDark && styles.sidebarDark,
      withHeader && styles.withHeaderDesktop,
    ]}>
      {/* Logo */}
      <View style={getConditionalStyle(styles.logoContainer, styles.logoContainerCompact)}>
        <View style={[
          getConditionalStyle(styles.logoBox, styles.logoBoxCompact),
          { backgroundColor: isDark ? colors['primary-dark'] : colors['primary-light'] }
        ]}>
          <Building size={20} color={isDark ? colors['icon-dark'] : colors['icon-light']} strokeWidth={1.5} />
        </View>
        {!isTablet && (
          <View>
            <Text style={[styles.logoText, isDark && styles.logoTextDark]}>Projeto</Text>
            <Text style={[styles.subLogoText, isDark && styles.subLogoTextDark]}>Origem</Text>
          </View>
        )}
      </View>

      {/* Links de Navegação */}
      <View style={styles.nav}>
        {navItems.map((item) => {
          const isActive = isMenuItemActive(item.path);
          const isDashboardActive = item.path === '/(tabs)' && isActive;
          
          // Para o Dashboard ativo, usar GradientView
          if (isDashboardActive) {
            return (
              <Link key={item.path} href={item.path as any} asChild>
                <GradientView
                  type="primary-fade"
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 10,
                    borderRadius: 10,
                    gap: 10,
                    height: 40,
                    width: '100%',
                    paddingLeft: 8,
                    paddingRight: 8,
                    justifyContent: 'space-between',
                    ...(isTablet ? {
                      justifyContent: 'center',
                      padding: 8,
                    } : {})
                  }}
                >
                  <item.icon 
                    size={22}
                    color={colorWhite}
                    strokeWidth={1.5}
                  />
                  {!isTablet && (
                    <Text style={[
                      styles.navText,
                      styles.activeNavText,
                      isDark && styles.navTextDark,
                      isDashboardActive && {
                        fontWeight: '600',
                        color: 'white',
                        fontSize: 15
                      }
                    ]}>
                      {item.label}
                    </Text>
                  )}
                  {!isTablet && (
                    <ChevronRight 
                      size={20} 
                      color={colorWhite}
                      strokeWidth={1.5}
                    />
                  )}
                </GradientView>
              </Link>
            );
          }
          
          // Para outros itens, comportamento original
          return (
            <Link key={item.path} href={item.path as any} asChild>
              <HoverableView
                isActive={isActive}
                style={StyleSheet.flatten([
                  getConditionalStyle(styles.navItem, styles.navItemCompact),
                  isActive && styles.activeNavItem,
                ]) as ViewStyle}
                hoverColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}
                activeColor={isDark ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)'}
                hoverScale={1.02}
              >
                <item.icon 
                  size={20}
                  color={isActive ? colorWhite : isDark ? colorGray['300'] : colorGray['600']}
                  strokeWidth={1.5}
                />
                {!isTablet && (
                  <Text style={[
                    styles.navText,
                    isDark && styles.navTextDark,
                    isActive && styles.activeNavText,
                    isDashboardActive && {
                      fontWeight: '600',
                      color: 'white',
                      fontSize: 15
                    }
                  ]}>
                    {item.label}
                  </Text>
                )}
                {!isTablet && isActive && (
                  <ChevronRight 
                    size={16} 
                    color={colorWhite}
                    strokeWidth={1.5}
                  />
                )}
              </HoverableView>
            </Link>
          );
        })}
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        {/* Botão de Sair */}
        <HoverableView 
          style={getConditionalStyle(styles.logoutButton, styles.logoutButtonCompact)}
          hoverColor={isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)'}
          onPress={handleLogout}
        >
          <View style={getConditionalStyle(styles.logoutContent, styles.logoutContentCompact)}>
            <LogOut 
              size={20} 
              color={isDark ? colorGray['300'] : colorGray['600']}
              strokeWidth={1.5}
            />
            {!isTablet && <Text style={[styles.logoutText, isDark && styles.logoutTextDark]}>Sair</Text>}
          </View>
        </HoverableView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 250,
    backgroundColor: colors['bg-secondary-light'],
    height: '100%',
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRightWidth: 1,
    borderRightColor: colors['divider-light'],
    ...(Platform.OS === 'web' && {
      position: 'fixed',
      top: 0,
      left: 0,
      zIndex: Z_INDEX.SIDEBAR,
    }),
  },
  sidebarDark: {
    backgroundColor: colors['bg-primary-dark'],
    borderRightColor: colors['divider-dark'],
  },
  sidebarCompact: {
    width: 65,
    paddingHorizontal: 10,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 30,
  },
  logoContainerCompact: {
    justifyContent: 'center',
    marginBottom: 32,
  },
  logoBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoBoxCompact: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  logoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors['text-primary-light'],
  },
  logoTextDark: {
    color: colors['text-primary-dark'],
  },
  subLogoText: {
    fontSize: 14,
    color: colors['text-secondary-light'],
  },
  subLogoTextDark: {
    color: colors['text-secondary-dark'],
  },
  nav: {
    gap: 4,
  },
  navContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    gap: 10,
    height: 40,
    width: '100%',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  navItemContainer: {
    marginBottom: 4,
  },
  navItemCompact: {
    justifyContent: 'center',
    padding: 8,
  },
  activeNavItem: {
    ...(Platform.OS === 'web' ? {
      backgroundImage: `linear-gradient(135deg, ${colors['primary-light']} 0%, ${colors['primary-light-hover']} 50%, ${colors['primary-light-active']} 100%)`,
      boxShadow: '0 2px 6px rgba(38, 68, 80, 0.2)',
      cursor: 'pointer',
    } : {
      backgroundColor: colors['primary-light'],
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 3,
      elevation: 4,
    }),
    borderLeftWidth: Platform.OS === 'web' ? 3 : 0,
    borderLeftColor: colors['secondary-light'],
    borderRadius: 10,
    transform: [{ scale: 1.02 }]
  },
  dashboardActiveItem: {
    ...(Platform.OS === 'web' ? {
      backgroundImage: 'linear-gradient(145deg, #f5f5f5 0%, #e0e0e0 100%)',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    } : {
      backgroundColor: '#eeeeee',
    }),
    borderRadius: 10,
    borderLeftWidth: 0,
    paddingLeft: 8,
    paddingRight: 8,
    justifyContent: 'space-between',
    transform: [{ scale: 1 }]
  },
  navText: {
    fontSize: 15,
    flex: 1,
    color: colors['text-secondary-light'],
  },
  navTextDark: {
    color: colors['text-secondary-dark'],
  },
  activeNavText: {
    color: colors['text-primary-dark'],
    fontWeight: '800',
  },
  footer: {
    marginTop: 'auto',
    gap: 16,
  },
  footerMobile: {
    marginTop: 'auto',
    gap: 10,
    paddingBottom: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    height: 40,
  },
  logoutButtonCompact: {
    justifyContent: 'center',
  },
  logoutContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  logoutContentCompact: {
    gap: 0,
  },
  logoutText: {
    fontSize: 14,
    color: colors['text-secondary-light'],
  },
  logoutTextDark: {
    color: colors['text-secondary-dark'],
  },
  modalContainer: {
    flex: 1,
    flexDirection: 'row',
  },
  backdrop: {
    ...Platform.select({
      web: {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: Z_INDEX.BACKDROP,
      },
      default: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        zIndex: Z_INDEX.BACKDROP,
      }
    }) as any,
  },
  drawer: {
    width: 280,
    height: '100%',
    backgroundColor: colors['bg-secondary-light'],
    paddingTop: Platform.OS === 'ios' ? 65 : 40,
    paddingBottom: 24,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
    zIndex: Z_INDEX.SIDEBAR,
  },
  withHeaderMobile: {
    paddingTop: Platform.OS === 'ios' ? 65 : 40,
  },
  withHeaderDesktop: {
    paddingTop: 24,
  },
  pressedItem: {
    opacity: 0.7,
  },
});
