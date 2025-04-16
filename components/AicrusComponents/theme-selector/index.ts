/**
 * Exportação do componente ThemeSelector
 * 
 * O ThemeSelector é um componente elegante para alternar entre temas claro, escuro e sistema:
 * 
 * PRINCIPAIS RECURSOS:
 * - Suporte nativo a temas claro, escuro e opção de sistema
 * - Múltiplas variantes visuais: default, pill, minimal, labeled, toggle e single
 * - Totalmente responsivo e multiplataforma (iOS, Android, Web)
 * - Animações suaves com configurações otimizadas para cada plataforma
 * 
 * PERSONALIZAÇÃO:
 * O componente pode ser totalmente personalizado através das props:
 * 
 * Opções básicas:
 * - variant: Estilo visual (default, pill, minimal, labeled, toggle, single)
 * - size: Tamanho do seletor (sm, md, lg, xl)
 * - showSystemOption: Exibe a opção de seguir o tema do sistema (padrão: true)
 * - showLabels: Exibe texto junto aos ícones (para variant="labeled")
 * 
 * Aparência:
 * - className: Classes CSS personalizadas (via tailwind ou styled-components)
 * - transparentSingle: Fundo transparente para variant="single"
 * - customColors: Objeto para personalizar cores (background, sliderBackground, etc)
 * 
 * Exemplos de uso:
 * ```tsx
 * // Seletor padrão com 3 opções (claro, escuro, sistema)
 * <ThemeSelector 
 *   variant="default"
 *   size="md"
 * />
 * 
 * // Seletor de tema único (alterna entre claro/escuro)
 * <ThemeSelector 
 *   variant="single"
 *   transparentSingle={true}
 *   size="lg"
 * />
 * 
 * // Seletor tipo toggle com apenas claro/escuro
 * <ThemeSelector 
 *   variant="toggle"
 *   showSystemOption={false}
 *   size="md"
 * />
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo ThemeSelector.tsx
 */

export * from './ThemeSelector'; 