import React from 'react';
import { Users, UserPlus, Plus, Github, HelpCircle, Cloud, LogOut, Mail, MessageSquare, MoreHorizontal } from 'lucide-react-native';
import { DropdownMenu } from '../dropdowns/DropdownMenu';
import { DropdownMenuOption, SubmenuOption } from '../dropdowns/types';
import { useTheme } from '../../hooks/DesignSystemContext';
import { colors } from '../../design-system/tokens/colors';

export interface TeamMenuProps {
  /** Elemento que vai disparar o menu (botão, ícone, etc.) - opcional */
  trigger?: React.ReactNode;
  /** Texto do botão padrão (usado se trigger não for fornecido) */
  buttonText?: string;
  /** Função chamada quando uma opção específica do team é selecionada */
  onTeamOptionSelect?: (optionId: 'team' | 'invite' | 'newteam' | 'github' | 'support' | 'api' | 'logout') => void;
  /** Função chamada quando uma opção do submenu invite é selecionada */
  onInviteSubmenuSelect?: (optionId: 'email' | 'message' | 'more') => void;
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

export const TeamMenu = ({
  trigger,
  buttonText = 'My Account',
  onTeamOptionSelect,
  onInviteSubmenuSelect,
  onOptionSelect,
  disabled,
  maxHeight,
  zIndex,
  onOpen,
  onClose,
  submenuWidth,
}: TeamMenuProps) => {
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

  // Opções do submenu "Invite users"
  const inviteSubmenuOptions: SubmenuOption[] = [
    {
      id: 'email',
      label: 'Email',
      icon: <Mail size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Email submenu selecionado');
        onInviteSubmenuSelect?.('email');
        onOptionSelect?.('email');
      }
    },
    {
      id: 'message',
      label: 'Message',
      icon: <MessageSquare size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Message submenu selecionado');
        onInviteSubmenuSelect?.('message');
        onOptionSelect?.('message');
      }
    },
    {
      id: 'more',
      label: 'More...',
      icon: <MoreHorizontal size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('More submenu selecionado');
        onInviteSubmenuSelect?.('more');
        onOptionSelect?.('more');
      }
    }
  ];

  // Opções do menu principal
  const teamMenuOptions: DropdownMenuOption[] = [
    {
      id: 'team',
      label: 'Team',
      icon: <Users size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Team selecionado');
        onTeamOptionSelect?.('team');
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
        onTeamOptionSelect?.('invite');
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
        onTeamOptionSelect?.('newteam');
        onOptionSelect?.('newteam');
      }
    },
    {
      id: 'github',
      label: 'GitHub',
      icon: <Github size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('GitHub selecionado');
        onTeamOptionSelect?.('github');
        onOptionSelect?.('github');
      }
    },
    {
      id: 'support',
      label: 'Support',
      icon: <HelpCircle size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('Support selecionado');
        onTeamOptionSelect?.('support');
        onOptionSelect?.('support');
      }
    },
    {
      id: 'api',
      label: 'API',
      icon: <Cloud size={16} color={themeColors['text-primary']} />,
      action: () => {
        console.log('API selecionado');
        onTeamOptionSelect?.('api');
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
        onTeamOptionSelect?.('logout');
        onOptionSelect?.('logout');
      }
    }
  ];

  return (
    <DropdownMenu
      trigger={trigger}
      buttonText={buttonText}
      options={teamMenuOptions}
      onOptionSelect={onOptionSelect}
      disabled={disabled}
      maxHeight={maxHeight}
      zIndex={zIndex}
      onOpen={onOpen}
      onClose={onClose}
      submenuWidth={submenuWidth}
      title="My Account"
    />
  );
}; 