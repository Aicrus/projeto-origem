export interface DropdownMenuOption {
  id: string;
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

export interface BaseDropdownMenuProps {
  /** Elemento que vai disparar o menu (botão, ícone, etc.) */
  trigger?: React.ReactNode;
  /** Texto do botão padrão (usado se trigger não for fornecido) */
  buttonText?: string;
  /** Opções do menu */
  options: DropdownMenuOption[];
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
  /** Largura do submenu (especialmente útil para mobile) */
  submenuWidth?: number;
  /** Título do menu (opcional) */
  title?: string;
} 