import React from 'react';
import { Bell, Mail, MessageSquare, Settings, Archive, Trash2, MoreHorizontal } from 'lucide-react-native';
import { DropdownMenu } from '../DropdownMenu';
import { DropdownMenuOption, SubmenuOption } from '../types';
import { useTheme } from '../../../../hooks/DesignSystemContext';
import { colors } from '../../../../design-system/tokens/colors';

export interface NotificationsMenuProps {
  /** Elemento que vai disparar o menu (botão, ícone, etc.) - opcional */
  trigger?: React.ReactNode;
  /** Texto do botão padrão (usado se trigger não for fornecido) */
  buttonText?: string;
  /** Função chamada quando uma opção específica de notificação é selecionada */
  onNotificationOptionSelect?: (optionId: 'all' | 'unread' | 'mentions' | 'settings' | 'archive' | 'clear') => void;
  /** Função chamada quando uma opção do submenu de ações é selecionada */
  onActionSubmenuSelect?: (optionId: 'mark_read' | 'delete' | 'more') => void;
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

export const NotificationsMenu = ({
  trigger,
  buttonText = 'Notifications',
  onNotificationOptionSelect,
  onActionSubmenuSelect,
  onOptionSelect,
  disabled,
  maxHeight,
  zIndex,
  onOpen,
  onClose,
  submenuWidth,
}: NotificationsMenuProps) => {
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

  // Opções do submenu "Actions"
  const actionsSubmenuOptions: SubmenuOption[] = [
    {
      id: 'mark_read',
      label: 'Mark as Read',
      icon: <Mail size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Mark as Read submenu selecionado');
        onActionSubmenuSelect?.('mark_read');
        onOptionSelect?.('mark_read');
      }
    },
    {
      id: 'delete',
      label: 'Delete',
      icon: <Trash2 size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Delete submenu selecionado');
        onActionSubmenuSelect?.('delete');
        onOptionSelect?.('delete');
      }
    },
    {
      id: 'more',
      label: 'More...',
      icon: <MoreHorizontal size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('More submenu selecionado');
        onActionSubmenuSelect?.('more');
        onOptionSelect?.('more');
      }
    }
  ];

  // Opções do menu principal
  const notificationsMenuOptions: DropdownMenuOption[] = [
    {
      id: 'all',
      label: 'All Notifications',
      icon: <Bell size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('All Notifications selecionado');
        onNotificationOptionSelect?.('all');
        onOptionSelect?.('all');
      }
    },
    {
      id: 'unread',
      label: 'Unread Only',
      icon: <Mail size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Unread Only selecionado');
        onNotificationOptionSelect?.('unread');
        onOptionSelect?.('unread');
      }
    },
    {
      id: 'mentions',
      label: 'Mentions',
      icon: <MessageSquare size={16} color={themeColors['text-primary']} />,
      hasArrow: true,
      hasSubmenu: true,
      submenuOptions: actionsSubmenuOptions,
      action: () => {
        console.log('Mentions selecionado');
        onNotificationOptionSelect?.('mentions');
        onOptionSelect?.('mentions');
      }
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={16} color={themeColors['text-primary']} />,
      shortcut: '⌘+,',
      action: () => {
        console.log('Settings selecionado');
        onNotificationOptionSelect?.('settings');
        onOptionSelect?.('settings');
      }
    },
    {
      id: 'archive',
      label: 'Archive',
      icon: <Archive size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Archive selecionado');
        onNotificationOptionSelect?.('archive');
        onOptionSelect?.('archive');
      }
    },
    {
      id: 'clear',
      label: 'Clear All',
      icon: <Trash2 size={16} color={themeColors['text-primary']} />,
      shortcut: '⇧⌘D',
      isSeparated: true,
      action: () => {
        console.log('Clear All selecionado');
        onNotificationOptionSelect?.('clear');
        onOptionSelect?.('clear');
      }
    }
  ];

  return (
    <DropdownMenu
      trigger={trigger}
      buttonText={buttonText}
      options={notificationsMenuOptions}
      onOptionSelect={onOptionSelect}
      disabled={disabled}
      maxHeight={maxHeight}
      zIndex={zIndex}
      onOpen={onOpen}
      onClose={onClose}
      submenuWidth={submenuWidth}
      title="Notifications"
    />
  );
}; 