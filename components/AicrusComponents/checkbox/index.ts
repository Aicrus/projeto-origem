/**
 * Exportação do componente Checkbox
 * 
 * O Checkbox é um componente de seleção minimalista que suporta:
 * 
 * PRINCIPAIS RECURSOS:
 * - Estados: checked, indeterminate, disabled
 * - Tema claro/escuro automático
 * - Acessibilidade
 * 
 * Exemplos de uso:
 * ```tsx
 * // Checkbox simples
 * <Checkbox 
 *   checked={isChecked} 
 *   onCheckedChange={setIsChecked} 
 * />
 * 
 * // Checkbox com estado indeterminado
 * <Checkbox 
 *   checked="indeterminate"
 *   onCheckedChange={handleChange} 
 * />
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo Checkbox.tsx
 */

export * from './Checkbox';
export type { CheckboxProps } from './Checkbox'; 