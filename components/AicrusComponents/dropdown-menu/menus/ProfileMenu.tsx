import React from 'react';
import { User, Settings, Shield, CreditCard, HelpCircle, LogOut, Edit, Camera, MoreHorizontal } from 'lucide-react-native';
import { DropdownMenu } from '../DropdownMenu';
import { DropdownMenuOption, SubmenuOption } from '../types';
import { useTheme } from '../../../../hooks/DesignSystemContext';
import { colors } from '../../../../design-system/tokens/colors';

export interface ProfileMenuProps {
  /** Elemento que vai disparar o menu (botão, ícone, etc.) - opcional */
  trigger?: React.ReactNode;
  /** Texto do botão padrão (usado se trigger não for fornecido) */
  buttonText?: string;
  /** Função chamada quando uma opção específica do perfil é selecionada */
  onProfileOptionSelect?: (optionId: 'profile' | 'edit' | 'settings' | 'security' | 'billing' | 'help' | 'logout') => void;
  /** Função chamada quando uma opção do submenu de edição é selecionada */
  onEditSubmenuSelect?: (optionId: 'edit_info' | 'change_photo' | 'more') => void;
  /** Função chamada quando qualquer opção é selecionada */
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
  /** Largura do submenu (especialmente útil para mobile) */
  submenuWidth?: number;
}

export const ProfileMenu = ({
  trigger,
  buttonText = 'Profile',
  onProfileOptionSelect,
  onEditSubmenuSelect,
  onOptionSelect,
  disabled,
  maxHeight,
  zIndex,
  onOpen,
  onClose,
  submenuWidth,
}: ProfileMenuProps) => {
  const { isDark } = useTheme();

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

  const themeColors = getThemeColors(isDark);

  // Opções do submenu "Edit Profile"
  const editSubmenuOptions: SubmenuOption[] = [
    {
      id: 'edit_info',
      label: 'Edit Info',
      icon: <Edit size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Edit Info submenu selecionado');
        onEditSubmenuSelect?.('edit_info');
        onOptionSelect?.('edit_info');
      }
    },
    {
      id: 'change_photo',
      label: 'Change Photo',
      icon: <Camera size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Change Photo submenu selecionado');
        onEditSubmenuSelect?.('change_photo');
        onOptionSelect?.('change_photo');
      }
    },
    {
      id: 'more',
      label: 'More...',
      icon: <MoreHorizontal size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('More submenu selecionado');
        onEditSubmenuSelect?.('more');
        onOptionSelect?.('more');
      }
    }
  ];

  // Opções do menu principal
  const profileMenuOptions: DropdownMenuOption[] = [
    {
      id: 'profile',
      label: 'View Profile',
      icon: <User size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('View Profile selecionado');
        onProfileOptionSelect?.('profile');
        onOptionSelect?.('profile');
      }
    },
    {
      id: 'edit',
      label: 'Edit Profile',
      icon: <Edit size={16} color={themeColors['text-primary']} />,
      hasArrow: true,
      hasSubmenu: true,
      submenuOptions: editSubmenuOptions,
      action: () => {
        console.log('Edit Profile selecionado');
        onProfileOptionSelect?.('edit');
        onOptionSelect?.('edit');
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={16} color={themeColors['text-primary']} />,
      shortcut: '⌘+,',
      action: () => {
        console.log('Settings selecionado');
        onProfileOptionSelect?.('settings');
        onOptionSelect?.('settings');
      }
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Shield size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Security selecionado');
        onProfileOptionSelect?.('security');
        onOptionSelect?.('security');
      }
    },
    {
      id: 'billing',
      label: 'Billing',
      icon: <CreditCard size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Billing selecionado');
        onProfileOptionSelect?.('billing');
        onOptionSelect?.('billing');
      }
    },
    {
      id: 'help',
      label: 'Help',
      icon: <HelpCircle size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Help selecionado');
        onProfileOptionSelect?.('help');
        onOptionSelect?.('help');
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
        onProfileOptionSelect?.('logout');
        onOptionSelect?.('logout');
      }
    }
  ];

  return (
    <DropdownMenu
      trigger={trigger}
      buttonText={buttonText}
      options={profileMenuOptions}
      onOptionSelect={onOptionSelect}
      disabled={disabled}
      maxHeight={maxHeight}
      zIndex={zIndex}
      onOpen={onOpen}
      onClose={onClose}
      submenuWidth={submenuWidth}
      title="Profile"
    />
  );
}; 