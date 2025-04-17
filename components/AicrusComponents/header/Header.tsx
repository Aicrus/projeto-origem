import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, Image, Platform, Pressable, Text, Dimensions } from 'react-native';
import { Share2, Bell, Search, MessageSquare, Settings, Menu } from 'lucide-react-native';
import { useTheme } from '../../../hooks/ThemeContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { NotificationsMenu } from '../../AicrusComponents/notifications-menu/NotificationsMenu';
import { ProfileMenu } from '../../AicrusComponents/profile-menu/ProfileMenu';

// Definição de cores temporária até termos acesso ao arquivo de tema
const colors = {
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
}

export function Header({
  ProfileMenuComponent,
  SidebarComponent,
  onToggleDrawer,
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

  // Definir cores conforme o tema do Tailwind
  const bgColor = isDark ? '#1C1E26' : '#FFFFFF'; // bg-primary-dark ou bg-secondary-light do tailwind.config.js
  const borderColor = isDark ? '#262D34' : '#E0E3E7'; // divider-dark ou divider-light do tailwind.config.js

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
    // Só renderiza o backdrop se algum menu interno estiver aberto
    // (não inclui o caso onde apenas a sidebar externa está aberta)
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
                <Menu size={24} color={isDark ? colors.gray[300] : colors.gray[700]} strokeWidth={1.5} />
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
                  <Bell size={16} color={isDark ? colors.gray[300] : colors.gray[700]} strokeWidth={1.5} />
                  <View style={styles.notificationBadge} />
                </Pressable>
                
                <Pressable 
                  ref={avatarButtonRef}
                  style={styles.avatarContainer}
                  onPress={handleProfileClick}
                >
                  <Image
                    source={{ 
                      uri: 'https://media.licdn.com/dms/image/v2/C4E03AQFy5omIcTocVg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1657212319358?e=2147483647&v=beta&t=UsUia-5GvPBUz9AFC6nzzDe_bEuKB4sOxQxi0YzitVg' 
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
        ]}>
          <View style={styles.container}>
            <View style={styles.rightContent}>
              <Pressable 
                style={[styles.iconButton, isDark && styles.iconButtonDark]}
                onPress={() => {}}
              >
                <Search size={18} color={isDark ? colors.gray[300] : colors.gray[500]} strokeWidth={1.5} />
              </Pressable>

              <Pressable 
                ref={bellButtonRef}
                style={[styles.iconButton, isDark && styles.iconButtonDark]}
                onPress={handleNotificationsClick}
              >
                <Bell size={18} color={isDark ? colors.gray[300] : colors.gray[500]} strokeWidth={1.5} />
                <View style={styles.notificationBadge} />
              </Pressable>

              <Pressable 
                ref={avatarButtonRef}
                style={styles.avatarContainer}
                onPress={handleProfileClick}
              >
                <Image
                  source={{ 
                    uri: 'https://media.licdn.com/dms/image/v2/C4E03AQFy5omIcTocVg/profile-displayphoto-shrink_200_200/profile-displayphoto-shrink_200_200/0/1657212319358?e=2147483647&v=beta&t=UsUia-5GvPBUz9AFC6nzzDe_bEuKB4sOxQxi0YzitVg' 
                  }}
                  style={styles.avatar}
                />
              </Pressable>
            </View>
          </View>
        </View>
      </View>

      {/* Segundo o backdrop */}
      {renderBackdrop()}

      {/* Terceiro o perfil */}
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

      {/* Por último o menu de notificações */}
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

const styles = StyleSheet.create({
  wrapper: {
    position: 'relative',
    zIndex: Z_INDEX.HEADER,
  },
  header: {
    height: 64,
    borderBottomWidth: 1,
    zIndex: Z_INDEX.HEADER,
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
    backgroundColor: colors.gray[100],
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    ...(Platform.OS === 'web' && {
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      ':hover': {
        backgroundColor: colors.gray[200],
      },
    }),
  },
  iconButtonDark: {
    backgroundColor: colors.gray[800],
    ...(Platform.OS === 'web' && {
      ':hover': {
        backgroundColor: colors.gray[700],
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
    color: colors.gray[900],
  },
  logoText: {
    fontSize: 16,
    color: colors.gray[600],
  },
  textDark: {
    color: colors.gray[100],
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: colors.danger,
    borderWidth: 1.5,
    borderColor: colors.white,
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    overflow: 'hidden',
    backgroundColor: colors.gray[100],
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
    backgroundColor: colors.white,
    borderRadius: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: Z_INDEX.MENU,
  },
  profileMenuDark: {
    backgroundColor: colors.gray[800],
  },
  sidebar: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 280,
    height: '100%',
    backgroundColor: colors.white,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: Z_INDEX.SIDEBAR,
  },
  sidebarDark: {
    backgroundColor: colors.gray[800],
  },
  closeButton: {
    padding: 12,
    alignItems: 'center',
  },
  closeButtonText: {
    color: colors.primary,
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