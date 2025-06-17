// Components exports - Nova estrutura organizacional
// Cada categoria tem seus próprios componentes agrupados logicamente

// ===== ACORDEONS =====
export { Accordion } from './accordions/Accordion';
export type { AccordionProps, AccordionGroup } from './accordions/Accordion';

// ===== BUTTONS =====
export { Button } from './buttons/Button';
export type { ButtonProps, ButtonSize, ButtonVariant } from './buttons/Button';

// ===== CHECKBOXES =====
export { Checkbox } from './checkboxes/Checkbox';

// ===== DROPDOWNS =====
export { DropdownMenu } from './dropdowns/DropdownMenu';
export { Select } from './dropdowns/Select';
export type * from './dropdowns/types';

// ===== EFFECTS =====
export { GradientView } from './effects/GradientView';
export { HoverableView } from './effects/HoverableView';

// ===== HEADERS =====
export { Header } from './headers/Header';

// ===== INPUTS =====
export { Input } from './inputs/Input';
export { DateInput } from './inputs/DateInput';
export { TimeInput } from './inputs/TimeInput';

// ===== LAYOUT =====
export { PageContainer } from './layout/PageContainer';

// ===== MENUS =====
export { NotificationsMenu } from './menus/NotificationsMenu';
export { ProfileMenu } from './menus/ProfileMenu';
export { TeamMenu } from './menus/TeamMenu';
export type { NotificationItem } from './menus/NotificationsMenu';

// ===== NAVIGATION =====
export { Sidebar } from './navigation/Sidebar';
export type { SidebarProps } from './navigation/Sidebar';

// ===== SHEETS =====
export { default as Sheet } from './sheets/Sheet';
export type { SheetPosition } from './sheets/Sheet';

// ===== TABLES =====
export { DataTable } from './tables/DataTable';
export type { DataTableProps } from './tables/DataTable';

// ===== THEME =====
export { ThemeSelector } from './theme/ThemeSelector';
export type { ThemeSelectorProps } from './theme/ThemeSelector';

// ===== TOASTS =====
export { Toast } from './toasts/Toast';
export type { ToastProps, ToastPosition, ToastType, ToastPositionLabels } from './toasts/Toast';

// ===== OUTROS COMPONENTES =====
export { HapticTab } from './HapticTab';
export { ProtectedRoute } from './ProtectedRoute';
export { StagewiseToolbar } from './StagewiseToolbar'; 