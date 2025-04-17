/**
 * AicrusComponents
 * 
 * Este pacote contém componentes reutilizáveis da UI Aicrus,
 * projetados para funcionar com o TailwindCSS e com suporte
 * a temas claros e escuros.
 */

// Exportações de componentes
export * from './select';
export * from './input';
export * from './accordion';
export * from './button';
export * from './toast';
export * from './theme-selector';
export * from './hoverable-view';
export * from './notifications-menu';
export * from './profile-menu';

// Exportações de constantes
export * from './constants/theme';

// Exportando o componente GradientView
export { GradientView, GRADIENTS } from './gradient';
export type { GradientViewProps, GradientType } from './gradient'; 