import { Link, usePathname, useRouter } from 'expo-router';
import { StyleSheet, View, Platform, ViewStyle, TouchableWithoutFeedback, Modal, Pressable, TouchableOpacity, Dimensions, Text } from 'react-native';
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  ClipboardList, 
  Settings,
  Crown,
  LogOut,
  ChevronRight,
  Building,
  LucideIcon,
  Menu,
  X,
  BarChart2
} from 'lucide-react-native';
import { useResponsive } from '../../../hooks/useResponsive';
import { useState, useEffect, useRef, useCallback } from 'react';
import Animated, { 
  useAnimatedStyle, 
  withTiming, 
  useSharedValue,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { colors } from '../../../components/AicrusComponents/constants/theme';
import { useTheme } from '../../../hooks/ThemeContext';

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
  { path: '/(tabs)/vistorias', label: 'Vistorias', icon: ClipboardList },
  { path: '/(tabs)/imoveis', label: 'Imóveis', icon: Building },
  { path: '/(tabs)/imobiliarias', label: 'Imobiliárias', icon: Building2 },
  { path: '/(tabs)/vistoriadores', label: 'Vistoriadores', icon: Users },
  { path: '/(tabs)/configuracoes', label: 'Configurações', icon: Settings },
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
  
  // Animation values
  const drawerProgress = useSharedValue(0);
  const backdropOpacity = useSharedValue(0);
  
  // Update animation value when drawer visibility changes
  useEffect(() => {
    if (isOpen) {
      drawerProgress.value = withTiming(1, { duration: 300 });
      backdropOpacity.value = withTiming(1, { duration: 250 });
    } else {
      drawerProgress.value = withTiming(0, { duration: 250 });
      backdropOpacity.value = withTiming(0, { duration: 200 });
    }
  }, [isOpen]);

  // Função para determinar se um item de menu está ativo com base no pathname atual
  const isMenuItemActive = (itemPath: string) => {
    if (!pathname) return false;
    
    // Dashboard é ativo apenas quando estamos na home
    if (itemPath === '/(tabs)') {
      return pathname === '/' || pathname === '/(tabs)' || pathname === '/(tabs)/index';
    }
    
    // Para as outras rotas, verificamos se o pathname contém o nome da página
    return pathname.includes(itemPath.replace('/(tabs)', ''));
  };
  
  // Animated styles
  const drawerAnimatedStyle = useAnimatedStyle(() => {
    const translateX = interpolate(
      drawerProgress.value,
      [0, 1],
      [-260, 0],
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

  // Componente de item de navegação
  const NavItem = ({ path, label, icon: Icon }: AppRoute) => {
    const isActive = isMenuItemActive(path);
    
    const handleNavigation = () => {
      if (isMobile && onClose) {
        onClose();
        
        // Pequeno delay para navegação após animação de fechamento
        setTimeout(() => {
          router.push(path as any);
        }, 300);
      } else {
        router.push(path as any);
      }
    };
    
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={handleNavigation}
        style={styles.navItemContainer}
      >
        <View style={[
          styles.navItem,
          isActive && styles.activeNavItem,
          isDark && styles.navItemDark,
          isActive && isDark && styles.activeNavItemDark
        ]}>
          <Icon 
            size={20} 
            color={isActive 
              ? isDark ? colors.white : colors.white 
              : isDark ? colors.gray[300] : colors.gray[600]
            }
            strokeWidth={1.5}
          />
          <Text style={[
            styles.navText,
            isActive && styles.activeNavText,
            { color: isActive 
              ? colors.white 
              : isDark ? colors.gray[300] : colors.gray[600] 
            }
          ]}>
            {label}
          </Text>
          {isActive && (
            <ChevronRight 
              size={16} 
              color={colors.white}
              strokeWidth={1.5}
            />
          )}
        </View>
      </TouchableOpacity>
    );
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
          <Animated.View 
            style={[styles.backdrop, backdropAnimatedStyle]} 
            onTouchEnd={onClose}
          />
          
          {/* Sidebar com animação */}
          <Animated.View 
            style={[
              styles.sidebar, 
              drawerAnimatedStyle,
              isDark && styles.sidebarDark,
              withHeader && styles.withHeaderMobile
            ]}
          >
            <View style={styles.sidebarHeader}>
              <View style={styles.logoContainer}>
                <Text style={[
                  styles.logoTextBold,
                  { color: isDark ? colors.white : colors.gray[900] }
                ]}>Projeto</Text>
                <Text style={[
                  styles.logoText,
                  { color: isDark ? colors.gray[300] : colors.gray[600] }
                ]}>Origem</Text>
              </View>
              
              <Pressable onPress={onClose} style={styles.closeButton}>
                <X size={24} color={isDark ? colors.gray[300] : colors.gray[600]} />
              </Pressable>
            </View>
            
            <View style={styles.navContainer}>
              {navItems.map((item, index) => (
                <NavItem 
                  key={index}
                  path={item.path}
                  label={item.label}
                  icon={item.icon}
                />
              ))}
            </View>
            
            <View style={styles.sidebarFooter}>
              <TouchableOpacity style={styles.footerButton}>
                <LogOut size={18} color={isDark ? colors.gray[300] : colors.gray[600]} />
                <Text style={[
                  styles.footerButtonText,
                  { color: isDark ? colors.gray[300] : colors.gray[600] }
                ]}>Sair</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </Modal>
    );
  }

  // Para tablet e desktop, renderiza uma sidebar fixa
  return (
    <View 
      style={[
        styles.sidebarFixed, 
        isDark && styles.sidebarDark,
        withHeader && styles.withHeaderDesktop
      ]}
    >
      <View style={styles.sidebarHeader}>
        <View style={styles.logoContainer}>
          <Text style={[
            styles.logoTextBold,
            { color: isDark ? colors.white : colors.gray[900] }
          ]}>Projeto</Text>
          <Text style={[
            styles.logoText,
            { color: isDark ? colors.gray[300] : colors.gray[600] }
          ]}>Origem</Text>
        </View>
      </View>
      
      <View style={styles.navContainer}>
        {navItems.map((item, index) => (
          <NavItem 
            key={index}
            path={item.path}
            label={item.label}
            icon={item.icon}
          />
        ))}
      </View>
      
      <View style={styles.sidebarFooter}>
        <TouchableOpacity style={styles.footerButton}>
          <LogOut size={18} color={isDark ? colors.gray[300] : colors.gray[600]} />
          <Text style={[
            styles.footerButtonText,
            { color: isDark ? colors.gray[300] : colors.gray[600] }
          ]}>Sair</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  sidebar: {
    position: 'absolute',
    width: 260,
    height: '100%',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: Z_INDEX.SIDEBAR,
    flexDirection: 'column',
  },
  sidebarDark: {
    backgroundColor: colors.gray[800],
  },
  sidebarFixed: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.white,
    borderRightWidth: 1,
    borderRightColor: colors.gray[200],
    flexDirection: 'column',
  },
  withHeaderMobile: {
    paddingTop: 0,
  },
  withHeaderDesktop: {
    paddingTop: 0,
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
  sidebarHeader: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  logoTextBold: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  logoText: {
    fontSize: 16,
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navContainer: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 8,
  },
  navItemContainer: {
    marginBottom: 4,
  },
  navItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  navItemDark: {
    backgroundColor: 'transparent',
  },
  activeNavItem: {
    backgroundColor: colors.primary.main,
  },
  activeNavItemDark: {
    backgroundColor: colors.primary.main,
  },
  navText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
  activeNavText: {
    color: colors.white,
  },
  sidebarFooter: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.gray[200],
  },
  footerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 8,
  },
  footerButtonText: {
    marginLeft: 12,
    fontSize: 14,
    fontWeight: '500',
  },
});
