import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Platform, Pressable, Text, Dimensions, ViewStyle } from 'react-native';
import { Share2, Bell, Search, MessageSquare, Settings, Menu } from 'lucide-react-native';
import { useTheme } from '../../../hooks/ThemeContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { NotificationsMenu } from '../../AicrusComponents/notifications-menu/NotificationsMenu';
import { ProfileMenu } from '../../AicrusComponents/profile-menu/ProfileMenu';
import { colors } from '../../../designer-system/tokens/colors';

// Definição de cores temporária até termos acesso ao arquivo de tema
const customColors = {
  white: '#FFFFFF',
  black: '#000000',
  primary: '#3B82F6',
  danger: '#EF4444',
  gray: {
    100: '#F3F4F6',
    200: '#E5E7EB',
    300: '#D1D5DB',
    500: '#6B7280',
    600: '#4B5563',
    700: '#374151',
    800: '#1F2937',
    900: '#111827'
  }
};

// Constantes para z-index
const Z_INDEX = {
  HEADER: 1000,
  BACKDROP: 2000,
  MENU: 3000,
  NOTIFICATION_MENU: 4000,
  SIDEBAR: 3500
};

// Definindo fonts localmente para não depender de um arquivo externo
const fonts = {
  regular: {
    fontWeight: '400' as const
  },
  medium: {
    fontWeight: '500' as const
  },
  bold: {
    fontWeight: '700' as const
  }
};

/**
 * @component Header
 * @description Componente de cabeçalho responsivo que se adapta a diferentes tamanhos de tela.
 * Fornece funcionalidades como:
 * - Menu de navegação para dispositivos móveis
 * - Ícones de ações rápidas
 * - Menu de perfil do usuário
 * - Menu de notificações
 * - Suporte a tema claro/escuro automático
 * 
 * Exemplos de uso:
 * 
 * ```tsx
 * // Header simples
 * <Header />
 * 
 * // Header com handler para controlar sidebar externa
 * <Header onToggleDrawer={handleToggleSidebar} />
 * 
 * // Header com componentes personalizados
 * <Header
 *   ProfileMenuComponent={CustomProfileMenu}
 *   SidebarComponent={CustomSidebar}
 * />
 * ```
 */

export interface HeaderProps {
  /** Componente personalizado para o menu de perfil */
  ProfileMenuComponent?: React.ComponentType<{
    isVisible: boolean;
    onClose: () => void;
    position?: { x: number, y: number };
  }>;
  /** Componente personalizado para a barra lateral */
  SidebarComponent?: React.ComponentType<{
    isDrawerVisible: boolean;
    onClose: () => void;
  }>;
  /** Handler opcional para controlar a abertura/fechamento da sidebar externa */
  onToggleDrawer?: () => void;
  /** Largura da sidebar para ajustar o header em dispositivos não-móveis */
  sidebarWidth?: number;
}

export function Header({
  ProfileMenuComponent,
  SidebarComponent,
  onToggleDrawer,
  sidebarWidth = 0,
}: HeaderProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const { isMobile } = useResponsive();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isNotificationsMenuOpen, setIsNotificationsMenuOpen] = useState(false);
  const bellButtonRef = useRef<View>(null);
  const [bellPosition, setBellPosition] = useState({ x: 0, y: 0 });
  const avatarButtonRef = useRef<View>(null);
  const [avatarPosition, setAvatarPosition] = useState({ x: 0, y: 0 });

  // Definir cores conforme o tema
  const bgColor = isDark ? colors['bg-primary-dark'] : colors['bg-secondary-light'];
  const borderColor = isDark ? colors['divider-dark'] : colors['divider-light'];

  // Fechar menus quando a tela for redimensionada
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleResize = () => {
        if (isNotificationsMenuOpen) setIsNotificationsMenuOpen(false);
        if (isProfileMenuOpen) setIsProfileMenuOpen(false);
      };

      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, [isNotificationsMenuOpen, isProfileMenuOpen]);

  // Impedir scroll quando os menus estão abertos
  useEffect(() => {
    if (Platform.OS === 'web' && (isNotificationsMenuOpen || isProfileMenuOpen || isDrawerOpen)) {
      // Adicionar classe para impedir scroll
      document.body.style.overflow = 'hidden';
      
      return () => {
        // Restaurar scroll ao desmontar
        document.body.style.overflow = '';
      };
    }
  }, [isNotificationsMenuOpen, isProfileMenuOpen, isDrawerOpen]);

  const handleProfileClick = () => {
    // Fecha menu de notificações se estiver aberto
    if (isNotificationsMenuOpen) setIsNotificationsMenuOpen(false);
    
    // Captura a posição do botão de perfil apenas na web
    // Em ambiente nativo, os menus usam posicionamento fixo
    if (avatarButtonRef.current && Platform.OS === 'web') {
      // @ts-ignore - API DOM específica para web
      const rect = avatarButtonRef.current.getBoundingClientRect?.();
      if (rect) {
        // Posiciona o menu abaixo do botão com posição Y específica
        setAvatarPosition({
          x: rect.right,
          y: rect.bottom + 10 // Adiciona espaço para alinhar com o menu de notificações
        });
      }
    }
    
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const toggleDrawer = () => {
    // Se existir um handler externo para controlar uma sidebar externa
    if (onToggleDrawer) {
      onToggleDrawer();
      return;
    }

    // Caso contrário, usa o comportamento padrão do drawer interno
    setIsDrawerOpen(!isDrawerOpen);
  };

  const handleNotificationsClick = () => {
    // Fecha o menu de perfil se estiver aberto
    if (isProfileMenuOpen) setIsProfileMenuOpen(false);
    
    // Captura a posição do botão de notificações apenas na web
    // Em ambiente nativo, os menus usam posicionamento fixo
    if (bellButtonRef.current && Platform.OS === 'web') {
      // @ts-ignore - API DOM específica para web
      const rect = bellButtonRef.current.getBoundingClientRect?.();
      if (rect) {
        // Posiciona o menu abaixo do botão com posição Y específica
        setBellPosition({
          x: rect.right,
          y: rect.bottom + 10 // Adiciona espaço para alinhar com o menu de perfil
        });
      }
    }

    setIsNotificationsMenuOpen(!isNotificationsMenuOpen);
  };

  // Renderiza o backdrop global
  const renderBackdrop = () => {
    if ((isNotificationsMenuOpen || isProfileMenuOpen || (isDrawerOpen && !onToggleDrawer))) {
      // Estilos específicos para cada plataforma
      const backdropStyle = Platform.OS === 'web' 
        ? {
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            height: '100vh',
            zIndex: Z_INDEX.BACKDROP,
          }
        : {
            position: 'absolute',
            top: 0,
            left: 0,
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
            zIndex: Z_INDEX.BACKDROP,
          };
        
      return (
        <Pressable
          style={[
            styles.backdrop,
            {
              backgroundColor: 'transparent',
              ...backdropStyle
            }
          ]}
          onPress={() => {
            setIsProfileMenuOpen(false);
            setIsNotificationsMenuOpen(false);
            setIsDrawerOpen(false);
          }}
        />
      );
    }
    
    return null;
  };

  // Componente de barra lateral padrão
  const DefaultSidebar = ({ isDrawerVisible, onClose }: { isDrawerVisible: boolean; onClose: () => void }) => {
    if (!isDrawerVisible) return null;
    
    return (
      <View style={[
        styles.sidebar,
        isDark && styles.sidebarDark
      ]}>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Fechar</Text>
        </Pressable>
        {/* Conteúdo da barra lateral */}
      </View>
    );
  };

  // Componentes a serem utilizados
  const Sidebar = SidebarComponent || DefaultSidebar;

  // Para mobile, renderiza um header simplificado com botão de menu
  if (isMobile) {
    return (
      <>
        {/* Header primeiro */}
        <View style={styles.wrapper}>
          <View style={[
            styles.header,
            {
              backgroundColor: bgColor,
              borderBottomColor: borderColor,
            },
            Platform.OS !== 'web' && styles.headerMobileNative
          ]}>
            <View style={[
              styles.containerMobile,
              Platform.OS !== 'web' && styles.containerMobileNative
            ]}>
              <Pressable 
                style={styles.menuButton}
                onPress={toggleDrawer}
              >
                <Menu size={24} color={isDark ? customColors.gray[300] : customColors.gray[700]} strokeWidth={1.5} />
              </Pressable>
              
              <View style={styles.logoMobile}>
                <View style={styles.logoTextContainer}>
                  <Text style={[
                    styles.logoTextBold,
                    isDark && styles.textDark
                  ]}>Projeto</Text>
                  <Text style={[
                    styles.logoText,
                    isDark && styles.textDark
                  ]}>Origem</Text>
                </View>
              </View>
              
              <View style={styles.mobileRightContent}>
                <Pressable 
                  ref={bellButtonRef}
                  style={[styles.iconButton, isDark && styles.iconButtonDark, styles.iconButtonMobile]}
                  onPress={handleNotificationsClick}
                >
                  <Bell size={16} color={isDark ? customColors.gray[300] : customColors.gray[700]} strokeWidth={1.5} />
                  <View style={styles.notificationBadge} />
                </Pressable>
                
                <Pressable 
                  ref={avatarButtonRef}
                  style={styles.avatarContainer}
                  onPress={handleProfileClick}
                >
                  <Image
                    source={{ 
                      uri: 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_640.png' 
                    }}
                    style={styles.avatar}
                  />
                </Pressable>
              </View>
            </View>
          </View>
        </View>

        {/* Backdrop global - deve vir depois do header */}
        {renderBackdrop()}

        {/* Sidebar */}
        <Sidebar 
          isDrawerVisible={isDrawerOpen} 
          onClose={() => setIsDrawerOpen(false)} 
        />

        {/* Menu de perfil */}
        {isProfileMenuOpen && (
          <View 
            style={Platform.OS === 'web' ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: Z_INDEX.NOTIFICATION_MENU,
              pointerEvents: 'none'
            } : null}
          >
            <View style={{ pointerEvents: 'auto' }}>
              {ProfileMenuComponent ? (
                <ProfileMenuComponent
                  isVisible={isProfileMenuOpen}
                  onClose={() => setIsProfileMenuOpen(false)}
                  position={avatarPosition}
                />
              ) : (
                <ProfileMenu
                  isVisible={isProfileMenuOpen}
                  onClose={() => setIsProfileMenuOpen(false)}
                  position={avatarPosition}
                />
              )}
            </View>
          </View>
        )}

        {/* Menu de notificações por último para ficar acima de tudo */}
        {isNotificationsMenuOpen && (
          <View 
            style={Platform.OS === 'web' ? {
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: Z_INDEX.NOTIFICATION_MENU,
              pointerEvents: 'none'
            } : null}
          >
            <View style={{ pointerEvents: 'auto' }}>
              <NotificationsMenu
                isVisible={true}
                onClose={() => setIsNotificationsMenuOpen(false)}
                position={bellPosition}
              />
            </View>
          </View>
        )}
      </>
    );
  }

  // Para tablet e desktop, header com posicionamento fixo simplificado
  return (
    <>
      {/* Header com posicionamento fixo */}
      <View style={[
        styles.wrapper,
        !isMobile && { // Aplicar estilos fixos apenas em não-mobile
          position: 'fixed',
          top: 0,
          right: 0,
          left: sidebarWidth,
          height: 64,
          zIndex: Z_INDEX.HEADER,
        }
      ]}>
        <View style={[
          styles.header,
          {
            backgroundColor: bgColor,
            borderBottomColor: borderColor,
            width: '100%', // Garantir que ocupe toda a largura disponível
          }
        ]}>
          <View style={styles.container}>
            <View style={styles.rightContent}>
              <Pressable 
                style={[styles.iconButton, isDark && styles.iconButtonDark]}
                onPress={() => {}}
              >
                <Search size={18} color={isDark ? customColors.gray[300] : customColors.gray[500]} strokeWidth={1.5} />
              </Pressable>

              <Pressable 
                ref={bellButtonRef}
                style={[styles.iconButton, isDark && styles.iconButtonDark]}
                onPress={handleNotificationsClick}
              >
                <Bell size={18} color={isDark ? customColors.gray[300] : customColors.gray[500]} strokeWidth={1.5} />
                <View style={styles.notificationBadge} />
              </Pressable>

              <Pressable 
                ref={avatarButtonRef}
                style={styles.avatarContainer}
                onPress={handleProfileClick}
              >
                <Image
                  source={{ 
                    uri: 'https://cdn.pixabay.com/photo/2018/11/13/22/01/avatar-3814081_640.png' 
                  }}
                  style={styles.avatar}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Backdrop global */}
      {renderBackdrop()}

      {/* Menus posicionados separadamente */}
      {isProfileMenuOpen && (
        <View
          style={Platform.OS === 'web' ? {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: Z_INDEX.MENU, pointerEvents: 'none'
          } : undefined}
        >
          <View style={{ pointerEvents: 'auto' }}>
            {/* Renderização do ProfileMenu */}
            {ProfileMenuComponent ? (
              <ProfileMenuComponent
                isVisible={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
                position={avatarPosition}
              />
            ) : (
              <ProfileMenu
                isVisible={isProfileMenuOpen}
                onClose={() => setIsProfileMenuOpen(false)}
                position={avatarPosition}
              />
            )}
          </View>
        </View>
      )}

      {isNotificationsMenuOpen && (
        <View
          style={Platform.OS === 'web' ? {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            zIndex: Z_INDEX.NOTIFICATION_MENU, pointerEvents: 'none'
          } : undefined}
        >
          <View style={{ pointerEvents: 'auto' }}>
            {/* Renderização do NotificationsMenu */}
            <NotificationsMenu
              isVisible={true} // Assume sempre visível quando aberto
              onClose={() => setIsNotificationsMenuOpen(false)}
              position={bellPosition}
            />
          </View>
        </View>
      )}

      {/* Sidebar para mobile (já tratado no if isMobile) */}
      {/* A sidebar de desktop é renderizada na tela pai (home.tsx) */}
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: Z_INDEX.HEADER,
  },
  header: {
    height: 64,
    borderBottomWidth: 1,
    ...(Platform.OS === 'web' && {
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
    }),
  },
  headerMobileNative: {
    height: 65,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
    paddingHorizontal: 18,
  },
  containerMobile: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '100%',
    paddingHorizontal: 16,
  },
  containerMobileNative: {
    paddingTop: 0,
  },
  rightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  mobileRightContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: customColors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        backgroundColor: customColors.gray[200],
      },
    }),
  },
  iconButtonDark: {
    backgroundColor: customColors.gray[800],
    ...(Platform.OS === 'web' && {
      ':hover': {
        backgroundColor: customColors.gray[700],
      },
    }),
  },
  iconButtonMobile: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoMobile: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoTextContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  logoTextBold: {
    fontWeight: 'bold',
    fontSize: 16,
    color: customColors.gray[900],
  },
  logoText: {
    fontSize: 16,
    color: customColors.gray[600],
  },
  textDark: {
    color: customColors.gray[100],
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: customColors.danger,
    borderWidth: 1.5,
    borderColor: customColors.white,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: customColors.gray[100],
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
    }),
  },
  avatar: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  profileMenu: {
    position: 'absolute',
    top: 56,
    right: 0,
    width: 240,
    backgroundColor: customColors.white,
    borderRadius: 8,
    shadowColor: customColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: Z_INDEX.MENU,
  },
  profileMenuDark: {
    backgroundColor: customColors.gray[800],
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: customColors.white,
    shadowColor: customColors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: Z_INDEX.SIDEBAR,
  },
  sidebarDark: {
    backgroundColor: customColors.gray[800],
  },
  closeButton: {
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: customColors.primary,
    fontWeight: '500',
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
}); 