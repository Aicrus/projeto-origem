/**
 * SISTEMA DE BORDAS
 * ------------------------------
 * Define todas as configurações de borda do sistema de design.
 * Inclui raios de borda e outras propriedades relacionadas.
 */

export const borderRadius = {
  'none': '0',
  'xs': '2px',
  'sm': '4px',
  'md': '8px',
  'lg': '12px',
  'xl': '16px',
  '2xl': '20px',
  '3xl': '24px',
  '4xl': '28px',
  '5xl': '32px',
  'full': '9999px',
} as const;

// Tipos para facilitar o uso
export type BorderRadiusType = keyof typeof borderRadius;

// Funções utilitárias
export function getBorderRadius(size: BorderRadiusType): string {
  return borderRadius[size];
}

// Funções de conveniência para diferentes tipos de borda
export const border = {
  radius: (size: BorderRadiusType) => ({ borderRadius: borderRadius[size] }),
  topRadius: (size: BorderRadiusType) => ({
    borderTopLeftRadius: borderRadius[size],
    borderTopRightRadius: borderRadius[size],
  }),
  bottomRadius: (size: BorderRadiusType) => ({
    borderBottomLeftRadius: borderRadius[size],
    borderBottomRightRadius: borderRadius[size],
  }),
  leftRadius: (size: BorderRadiusType) => ({
    borderTopLeftRadius: borderRadius[size],
    borderBottomLeftRadius: borderRadius[size],
  }),
  rightRadius: (size: BorderRadiusType) => ({
    borderTopRightRadius: borderRadius[size],
    borderBottomRightRadius: borderRadius[size],
  }),
} as const; 