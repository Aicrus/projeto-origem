import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Text, View, Modal, Pressable, ScrollView } from 'react-native';
import { ChevronUp, ChevronDown, Users, UserPlus, Plus, Github, HelpCircle, Cloud, LogOut, ChevronRight, Mail, MessageSquare, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '../../../hooks/DesignSystemContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { createPortal } from 'react-dom';
import { colors } from '../../../designer-system/tokens/colors';

/**
 * @component DropdownMenu
 * @description Componente de menu dropdown igual à imagem mostrada com:
 * - My Account (título)
 * - Team, Invite users (com submenu), New Team, GitHub, Support, API
 * - Log out (separado)
 * - Submenu para "Invite users" com Email, Message, More...
 * 
 * O componente é responsivo e funciona em todas as plataformas (iOS, Android, Web)
 * com posicionamento inteligente e tema claro/escuro automático.
 */

export interface DropdownMenuOption {
  id: 'team' | 'invite' | 'newteam' | 'github' | 'support' | 'api' | 'logout';
  label: string;
  icon: React.ReactNode;
  action: () => void;
  hasArrow?: boolean;
  shortcut?: string;
  isSeparated?: boolean;
  hasSubmenu?: boolean;
  submenuOptions?: SubmenuOption[];
}

export interface SubmenuOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
}

export interface DropdownMenuProps {
  /** Texto do botão que abre o menu */
  buttonText?: string;
  /** Função chamada quando uma opção é selecionada */
  onOptionSelect?: (optionId: string) => void;
  /** Se o menu está desabilitado */
  disabled?: boolean;
  /** Altura máxima do dropdown */
  maxHeight?: number;
  /** Posição Z do dropdown */
  zIndex?: number;
  /** Callback quando o menu abre */
  onOpen?: () => void;
  /** Callback quando o menu fecha */
  onClose?: () => void;
}

// Função para obter as cores do theme
const getThemeColors = (isDark: boolean) => {
  return {
    'primary': isDark ? colors['primary-dark'] : colors['primary-light'],
    'primary-hover': isDark ? colors['primary-dark-hover'] : colors['primary-light-hover'],
    'bg-secondary': isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
    'divider': isDark ? colors['divider-dark'] : colors['divider-light'],
    'text-primary': isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
    'text-secondary': isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
    'hover': isDark ? colors['hover-dark'] : colors['hover-light'],
  };
};

// Componente para renderizar o submenu
const SubmenuComponent = ({ 
  visible, 
  options, 
  onSelect, 
  onClose, 
  isDark, 
  position 
}: {
  visible: boolean;
  options: SubmenuOption[];
  onSelect: (option: SubmenuOption) => void;
  onClose: () => void;
  isDark: boolean;
  position: { x: number; y: number };
}) => {
  const submenuRef = useRef<any>(null);
  const themeColors = getThemeColors(isDark);

  // Detectar clique fora para fechar
  useEffect(() => {
    if (Platform.OS === 'web' && visible) {
      const handleClickOutside = (event: MouseEvent) => {
        if (submenuRef.current && !submenuRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const submenuStyle = StyleSheet.create({
    container: {
      position: 'absolute',
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderColor: isDark ? '#262D34' : '#E0E3E7',
      borderWidth: 1,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.08,
      shadowRadius: 6,
      overflow: 'hidden',
      minWidth: 140,
      zIndex: 2147483648,
    },
    item: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 10,
    },
    itemHovered: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
    },
    itemText: {
      fontSize: 14,
      color: themeColors['text-primary'],
      fontWeight: '400',
      marginLeft: 8,
    }
  });

  const handleItemSelect = (option: SubmenuOption) => {
    option.action();
    onSelect(option);
    onClose();
  };

  // Componente de item do submenu com hover
  const SubmenuItem = ({ option, index }: { option: SubmenuOption; index: number }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
      <View key={option.id}>
        <TouchableOpacity
          style={[
            submenuStyle.item,
            isHovered && Platform.OS === 'web' && submenuStyle.itemHovered
          ]}
          onPress={() => handleItemSelect(option)}
          // @ts-ignore - Eventos de hover exclusivos para web
          onMouseEnter={() => Platform.OS === 'web' && setIsHovered(true)}
          onMouseLeave={() => Platform.OS === 'web' && setIsHovered(false)}
        >
          {option.icon}
          <Text style={submenuStyle.itemText}>
            {option.label}
          </Text>
        </TouchableOpacity>
        {/* Divisória apenas antes do "More..." */}
        {option.id === 'message' && (
          <View style={{
            height: 1,
            backgroundColor: isDark ? '#262D34' : '#E0E3E7',
            marginHorizontal: 10
          }} />
        )}
      </View>
    );
  };

  const SubmenuContent = () => (
    <View
      ref={submenuRef}
      style={[
        submenuStyle.container,
        Platform.OS === 'web' ? {
          position: 'fixed',
          top: position.y,
          left: position.x,
        } : {
          top: position.y,
          left: position.x,
        }
      ]}
      // @ts-ignore - Eventos de mouse para manter submenu aberto
      onMouseEnter={() => {
        // Manter submenu aberto quando mouse está sobre ele
      }}
      onMouseLeave={() => {
        // Fechar submenu quando mouse sai
        setTimeout(() => {
          onClose();
        }, 100);
      }}
    >
      {options.map((option, index) => (
        <SubmenuItem key={option.id} option={option} index={index} />
      ))}
    </View>
  );

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return createPortal(<SubmenuContent />, document.body);
  }
  
  return <SubmenuContent />;
};

// Componente para renderizar um item do menu
const MenuOptionItem = ({ 
  option, 
  onSelect, 
  isDark, 
  onSubmenuToggle,
  submenuVisible,
  submenuPosition 
}: {
  option: DropdownMenuOption;
  onSelect: (option: DropdownMenuOption) => void;
  isDark: boolean;
  onSubmenuToggle?: (option: DropdownMenuOption, position: { x: number; y: number }) => void;
  submenuVisible?: boolean;
  submenuPosition?: { x: number; y: number };
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const itemRef = useRef<any>(null);
  const themeColors = getThemeColors(isDark);
  
  const handleHoverIn = () => {
    if (Platform.OS === 'web') {
      setIsHovered(true);
      
      // Se tem submenu, mostrar no hover
      if (option.hasSubmenu && onSubmenuToggle && itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        onSubmenuToggle(option, {
          x: rect.right + 2, // Reduzido de 8 para 2px para ficar mais próximo
          y: rect.top - 4    // Ajuste vertical para melhor alinhamento
        });
      } else if (onSubmenuToggle) {
        // Se não tem submenu, fechar qualquer submenu aberto
        onSubmenuToggle(option, { x: 0, y: 0 });
      }
    }
  };
  
  const handleHoverOut = () => {
    if (Platform.OS === 'web') {
      setIsHovered(false);
      // Se não tem submenu, não faz nada especial
      // O submenu será fechado pelo onMouseLeave do container principal
    }
  };

  const handlePress = () => {
    if (option.hasSubmenu && Platform.OS !== 'web') {
      // No mobile, toggle submenu no clique
      if (onSubmenuToggle && itemRef.current) {
        itemRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
          onSubmenuToggle(option, {
            x: pageX + width + 2, // Reduzido de 8 para 2px para ficar mais próximo
            y: pageY - 4          // Ajuste vertical para melhor alinhamento
          });
        });
      }
    } else if (!option.hasSubmenu && Platform.OS !== 'web') {
      // No mobile: Se não tem submenu, fechar qualquer submenu aberto E executar a ação
      if (onSubmenuToggle) {
        onSubmenuToggle(option, { x: 0, y: 0 }); // Isso vai fechar submenu E executar ação
      } else {
        // Fallback: se não tem onSubmenuToggle, executa diretamente
        onSelect(option);
      }
    } else if (!option.hasSubmenu) {
      // Web: executa ação normal
      onSelect(option);
    }
  };
  
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
      backgroundColor: (isHovered || submenuVisible) && Platform.OS === 'web' 
        ? (isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)') 
        : 'transparent'
    },
    itemText: {
      fontSize: 14,
      color: themeColors['text-primary'],
      fontWeight: '400',
      flex: 1,
      marginLeft: 12, // Espaçamento direto do ícone
    },
    shortcutText: {
      fontSize: 12,
      color: themeColors['text-secondary'],
      marginRight: 8,
    }
  });
  
  return (
    <TouchableOpacity
      ref={itemRef}
      style={styles.itemContainer}
      onPress={handlePress}
      // @ts-ignore - Eventos de hover exclusivos para web
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      {option.icon}
      <Text style={styles.itemText}>
        {option.label}
      </Text>
      {option.shortcut && Platform.OS === 'web' && (
        <Text style={styles.shortcutText}>
          {option.shortcut}
        </Text>
      )}
      {option.hasArrow && (
        <ChevronRight size={14} color={themeColors['text-secondary']} />
      )}
    </TouchableOpacity>
  );
};

// Componente para Web - renderiza com posicionamento absoluto
const WebDropdownMenu = ({ 
  visible, 
  options, 
  onSelect, 
  onClose, 
  isDark,
  position,
  maxHeight,
}: {
  visible: boolean;
  options: DropdownMenuOption[];
  onSelect: (option: DropdownMenuOption) => void;
  onClose: () => void;
  isDark: boolean;
  position: any;
  maxHeight: number;
}) => {
  const optionsRef = useRef<any>(null);
  const themeColors = getThemeColors(isDark);
  
  // Estados para controlar submenu
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const [submenuOptions, setSubmenuOptions] = useState<SubmenuOption[]>([]);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  const [activeSubmenuOption, setActiveSubmenuOption] = useState<string | null>(null);
  
  // Detectar clique fora para fechar
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleClickOutside = (event: MouseEvent) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [onClose]);
  
  if (!visible) return null;
  
  const handleItemSelect = (option: DropdownMenuOption) => {
    if (!option.hasSubmenu) {
      option.action();
      onSelect(option);
      onClose();
    }
  };

  const handleSubmenuToggle = (option: DropdownMenuOption, pos: { x: number; y: number }) => {
    if (option.submenuOptions) {
      setSubmenuOptions(option.submenuOptions);
      setSubmenuPosition(pos);
      setSubmenuVisible(true);
      setActiveSubmenuOption(option.id);
    } else {
      // Se a opção não tem submenu, fechar qualquer submenu aberto
      setSubmenuVisible(false);
      setActiveSubmenuOption(null);
    }
  };

  const handleSubmenuClose = () => {
    setSubmenuVisible(false);
    setActiveSubmenuOption(null);
  };

  const handleSubmenuSelect = (submenuOption: SubmenuOption) => {
    console.log('Submenu option selected:', submenuOption.id);
    onClose(); // Fechar menu principal também
  };
  
  const getPositionStyle = () => {
    if (!position) {
      return {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        width: 240,
        maxHeight: maxHeight || 400,
        zIndex: 2147483647,
      };
    }
    
    if (position.openDown !== false) {
      return {
        position: 'fixed' as 'fixed',
        top: position.top || 0,
        left: position.left || 0,
        width: position.width || 240,
        maxHeight: maxHeight || 400,
        zIndex: 2147483647,
      };
    } else {
      return {
        position: 'fixed' as 'fixed',
        bottom: window.innerHeight - position.top,
        left: position.left || 0,
        width: position.width || 240,
        maxHeight: maxHeight || 400,
        zIndex: 2147483647,
      };
    }
  };
  
  const positionStyle = getPositionStyle();
  
  const dropdownStyle = StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderColor: isDark ? '#262D34' : '#E0E3E7',
      borderWidth: 1,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      overflow: 'hidden',
    },
    header: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: themeColors['divider'],
      backgroundColor: isDark ? '#1A1F23' : '#F8F9FA',
    },
    headerText: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors['text-primary'],
    },
    separator: {
      height: 1,
      backgroundColor: themeColors['divider'],
      marginVertical: 4,
    }
  });
  
  // Separar opções normais do logout
  const normalOptions = options.filter(opt => !opt.isSeparated);
  const separatedOptions = options.filter(opt => opt.isSeparated);
  
  const DropdownContent = () => (
    <>
      <Pressable 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2147483646,
          backgroundColor: 'transparent',
        }}
        onPress={onClose}
      />
      <View
        ref={optionsRef}
        style={[positionStyle, dropdownStyle.container]}
        // @ts-ignore - Eventos de mouse para controlar submenu
        onMouseLeave={() => {
          // Delay para permitir mover para o submenu
          setTimeout(() => {
            handleSubmenuClose();
          }, 150);
        }}
      >
        {/* Header */}
        <View style={dropdownStyle.header}>
          <Text style={dropdownStyle.headerText}>My Account</Text>
        </View>
        
        {/* Opções normais */}
        {normalOptions.map((option, index) => (
          <View key={option.id}>
            <MenuOptionItem
              option={option}
              onSelect={handleItemSelect}
              isDark={isDark}
              onSubmenuToggle={handleSubmenuToggle}
              submenuVisible={activeSubmenuOption === option.id}
              submenuPosition={submenuPosition}
            />

            {/* Divisória após New Team */}
            {option.id === 'newteam' && (
              <View style={{
                height: 1,
                backgroundColor: themeColors['divider'],
                marginVertical: 4,
              }} />
            )}
          </View>
        ))}
        
        {/* Separador se houver opções separadas */}
        {separatedOptions.length > 0 && (
          <View style={dropdownStyle.separator} />
        )}
        
        {/* Opções separadas (logout) */}
        {separatedOptions.map((option, index) => (
          <MenuOptionItem
            key={option.id}
            option={option}
            onSelect={handleItemSelect}
            isDark={isDark}
          />
        ))}
      </View>
      
      {/* Submenu */}
      <SubmenuComponent
        visible={submenuVisible}
        options={submenuOptions}
        onSelect={handleSubmenuSelect}
        onClose={handleSubmenuClose}
        isDark={isDark}
        position={submenuPosition}
      />
    </>
  );

  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return createPortal(<DropdownContent />, document.body);
  }
  
  return <DropdownContent />;
};

// Componente para Mobile - usa Modal
const MobileDropdownMenu = ({ 
  visible, 
  options, 
  onSelect, 
  onClose, 
  isDark,
  maxHeight,
  position,
}: {
  visible: boolean;
  options: DropdownMenuOption[];
  onSelect: (option: DropdownMenuOption) => void;
  onClose: () => void;
  isDark: boolean;
  maxHeight: number;
  position: any;
}) => {
  const themeColors = getThemeColors(isDark);
  
  // Estados para controlar submenu
  const [submenuVisible, setSubmenuVisible] = useState(false);
  const [submenuOptions, setSubmenuOptions] = useState<SubmenuOption[]>([]);
  const [submenuPosition, setSubmenuPosition] = useState({ x: 0, y: 0 });
  
  const handleItemSelect = (option: DropdownMenuOption) => {
    if (!option.hasSubmenu) {
      option.action();
      onSelect(option);
      onClose();
    }
  };

  const handleSubmenuToggle = (option: DropdownMenuOption, pos: { x: number; y: number }) => {
    if (option.submenuOptions) {
      setSubmenuOptions(option.submenuOptions);
      setSubmenuPosition(pos);
      setSubmenuVisible(true);
    } else {
      // Se a opção não tem submenu, fechar qualquer submenu aberto E executar a ação
      setSubmenuVisible(false);
      // Executar a ação da opção clicada
      option.action();
      onSelect(option);
      onClose(); // Fechar o menu principal também
    }
  };

  const handleSubmenuClose = () => {
    setSubmenuVisible(false);
  };

  const handleSubmenuSelect = (submenuOption: SubmenuOption) => {
    console.log('Submenu option selected:', submenuOption.id);
    onClose(); // Fechar menu principal também
  };
  
  const handlePressOutside = () => {
    setTimeout(() => {
      onClose();
    }, 50);
  };
  
  const dropdownStyle = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    container: {
      position: 'absolute',
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderColor: isDark ? '#262D34' : '#E0E3E7',
      maxHeight: maxHeight || 400,
      width: position?.width || '90%',
      marginHorizontal: 16,
      left: position?.left - 16 || 0,
      ...(position?.openDown 
        ? { top: position?.top || 100 } 
        : { bottom: position?.bottom || 100 }),
      borderWidth: 1,
      borderRadius: 8,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.1,
      shadowRadius: 8,
      elevation: 8,
      overflow: 'hidden',
    },
    header: {
      paddingVertical: 12,
      paddingHorizontal: 16,
      borderBottomWidth: 1,
      borderBottomColor: themeColors['divider'],
      backgroundColor: isDark ? '#1A1F23' : '#F8F9FA',
    },
    headerText: {
      fontSize: 16,
      fontWeight: '600',
      color: themeColors['text-primary'],
    },
    separator: {
      height: 1,
      backgroundColor: themeColors['divider'],
      marginVertical: 4,
    }
  });
  
  // Separar opções normais do logout
  const normalOptions = options.filter(opt => !opt.isSeparated);
  const separatedOptions = options.filter(opt => opt.isSeparated);
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable 
        style={dropdownStyle.overlay}
        onPress={handlePressOutside}
      >
        <View style={dropdownStyle.container}>
          {/* Header */}
          <View style={dropdownStyle.header}>
            <Text style={dropdownStyle.headerText}>My Account</Text>
          </View>
          
          <ScrollView nestedScrollEnabled={true}>
            {/* Opções normais */}
            {normalOptions.map((option, index) => (
              <View key={option.id}>
                <MenuOptionItem
                  option={option}
                  onSelect={handleItemSelect}
                  isDark={isDark}
                  onSubmenuToggle={handleSubmenuToggle}
                />

                {/* Divisória após New Team */}
                {option.id === 'newteam' && (
                  <View style={{
                    height: 1,
                    backgroundColor: themeColors['divider'],
                    marginVertical: 4,
                  }} />
                )}
              </View>
            ))}
            
            {/* Separador se houver opções separadas */}
            {separatedOptions.length > 0 && (
              <View style={dropdownStyle.separator} />
            )}
            
            {/* Opções separadas (logout) */}
            {separatedOptions.map((option, index) => (
              <MenuOptionItem
                key={option.id}
                option={option}
                onSelect={handleItemSelect}
                isDark={isDark}
                onSubmenuToggle={handleSubmenuToggle}
              />
            ))}
          </ScrollView>
        </View>
      </Pressable>
      
      {/* Submenu para mobile */}
      {submenuVisible && (
        <Modal
          visible={submenuVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={handleSubmenuClose}
        >
          <Pressable 
            style={dropdownStyle.overlay}
            onPress={handleSubmenuClose}
          >
            <SubmenuComponent
              visible={submenuVisible}
              options={submenuOptions}
              onSelect={handleSubmenuSelect}
              onClose={handleSubmenuClose}
              isDark={isDark}
              position={submenuPosition}
            />
          </Pressable>
        </Modal>
      )}
    </Modal>
  );
};

export const DropdownMenu = ({
  buttonText = 'Open',
  onOptionSelect,
  disabled = false,
  maxHeight = 400,
  zIndex = 9999,
  onOpen,
  onClose,
}: DropdownMenuProps) => {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<any>(null);
  
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const themeColors = getThemeColors(isDark);
  
  const [position, setPosition] = useState<{
    top?: number;
    left: number;
    width: number;
    bottom?: number;
    openDown?: boolean;
  }>({ top: 0, left: 0, width: 0 });
  
  // Opções do submenu para "Invite users"
  const inviteSubmenuOptions: SubmenuOption[] = [
    {
      id: 'email',
      label: 'Email',
      icon: <Mail size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Email submenu selecionado');
        onOptionSelect?.('email');
      }
    },
    {
      id: 'message',
      label: 'Message',
      icon: <MessageSquare size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Message submenu selecionado');
        onOptionSelect?.('message');
      }
    },
    {
      id: 'more',
      label: 'More...',
      icon: <MoreHorizontal size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('More submenu selecionado');
        onOptionSelect?.('more');
      }
    }
  ];
  
  // Opções do menu igual à imagem
  const menuOptions: DropdownMenuOption[] = [
    {
      id: 'team',
      label: 'Team',
      icon: <Users size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Team selecionado');
        onOptionSelect?.('team');
      }
    },
    {
      id: 'invite',
      label: 'Invite users',
      icon: <UserPlus size={16} color={themeColors['text-primary']} />,
      hasArrow: true,
      hasSubmenu: true,
      submenuOptions: inviteSubmenuOptions,
      action: () => {
        console.log('Invite users selecionado');
        onOptionSelect?.('invite');
      }
    },
    {
      id: 'newteam',
      label: 'New Team',
      icon: <Plus size={16} color={themeColors['text-primary']} />,
      shortcut: '⌘+T',
      action: () => {
        console.log('New Team selecionado');
        onOptionSelect?.('newteam');
      }
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: <Github size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('GitHub selecionado');
        onOptionSelect?.('github');
      }
    },
    {
      id: 'support',
      label: 'Support',
      icon: <HelpCircle size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Support selecionado');
        onOptionSelect?.('support');
      }
    },
    {
      id: 'api',
      label: 'API',
      icon: <Cloud size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('API selecionado');
        onOptionSelect?.('api');
      }
    },
    {
      id: 'logout',
      label: 'Log out',
      icon: <LogOut size={16} color={themeColors['text-primary']} />,
      shortcut: '⇧⌘Q',
      isSeparated: true,
      action: () => {
        console.log('Log out selecionado');
        onOptionSelect?.('logout');
      }
    }
  ];
  
  // Calcular posição quando abrir
  useEffect(() => {
    if (Platform.OS === 'web' && isOpen && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      const openDown = rect.bottom + maxHeight <= viewportHeight || rect.top < maxHeight;
      const spacing = 4;
      
      requestAnimationFrame(() => {
        if (openDown) {
          setPosition({
            top: rect.bottom + spacing + window.scrollY,
            left: rect.left + window.scrollX,
            width: 240, // Largura fixa como na imagem
            openDown: true
          });
        } else {
          setPosition({
            top: rect.top - spacing + window.scrollY,
            left: rect.left + window.scrollX,
            width: 240, // Largura fixa como na imagem
            openDown: false
          });
        }
      });
    }
  }, [isOpen, maxHeight]);
  
  // Bloquear scroll da página quando dropdown está aberto (web)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const originalStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        height: document.body.style.height,
        paddingRight: document.body.style.paddingRight
      };
      
      const scrollY = window.scrollY;
      
      if (isOpen) {
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        
        return () => {
          document.body.style.overflow = originalStyle.overflow;
          document.body.style.position = originalStyle.position;
          document.body.style.top = originalStyle.top;
          document.body.style.width = originalStyle.width;
          document.body.style.height = originalStyle.height;
          document.body.style.paddingRight = originalStyle.paddingRight;
          
          window.scrollTo(0, scrollY);
        };
      }
    }
  }, [isOpen]);
  
  // Chamar callbacks externos
  useEffect(() => {
    if (isOpen) {
      onOpen?.();
    } else {
      onClose?.();
    }
  }, [isOpen, onOpen, onClose]);
  
  const handleToggleDropdown = () => {
    if (!disabled) {
      if (!isOpen) {
        if (Platform.OS !== 'web' && selectRef.current) {
          selectRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            const { height: windowHeight } = require('react-native').Dimensions.get('window');
            const spaceBelow = windowHeight - (pageY + height);
            const openDown = spaceBelow >= maxHeight || pageY < maxHeight;
            const spacing = 4;
            
            if (openDown) {
              setPosition({
                top: pageY + height + spacing,
                left: pageX,
                width: 240, // Largura fixa como na imagem
                bottom: undefined,
                openDown: true
              });
            } else {
              setPosition({
                top: undefined,
                bottom: windowHeight - pageY + spacing,
                left: pageX,
                width: 240, // Largura fixa como na imagem
                openDown: false
              });
            }
          });
        }
      }
      setIsOpen(!isOpen);
    }
  };
  
  const handleOptionSelect = (option: DropdownMenuOption) => {
    onOptionSelect?.(option.id);
  };
  
  const handleClose = () => {
    setIsOpen(false);
  };
  
  const buttonStyle = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 16,
      borderWidth: 1,
      borderColor: isDark ? '#262D34' : '#E0E3E7',
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderRadius: 6,
      minHeight: 40,
      width: 100, // Botão mais compacto como na imagem
    },
    text: {
      fontSize: 14,
      color: isDark ? '#FFFFFF' : '#14181B',
      fontWeight: '400',
    },
  });
  
  return (
    <View style={{ position: 'relative' }}>
      <TouchableOpacity
        ref={selectRef}
        onPress={handleToggleDropdown}
        style={[
          buttonStyle.container,
          disabled ? { opacity: 0.5 } : {}
        ]}
        disabled={disabled}
      >
        <Text style={buttonStyle.text}>
          {buttonText}
        </Text>
        
        {isOpen ? (
          <ChevronUp size={14} color={isDark ? '#95A1AC' : '#57636C'} />
        ) : (
          <ChevronDown size={14} color={isDark ? '#95A1AC' : '#57636C'} />
        )}
      </TouchableOpacity>
      
      {/* Dropdown no mobile */}
      {Platform.OS !== 'web' && (
        <MobileDropdownMenu
          visible={isOpen}
          options={menuOptions}
          onSelect={handleOptionSelect}
          onClose={handleClose}
          isDark={isDark}
          maxHeight={maxHeight}
          position={position}
        />
      )}
      
      {/* Dropdown na web */}
      {Platform.OS === 'web' && (
        <WebDropdownMenu
          visible={isOpen}
          options={menuOptions}
          onSelect={handleOptionSelect}
          onClose={handleClose}
          isDark={isDark}
          position={position}
          maxHeight={maxHeight}
        />
      )}
    </View>
  );
};