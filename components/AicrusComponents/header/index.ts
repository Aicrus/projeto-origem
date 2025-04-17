/**
 * Exportação do componente Header
 * 
 * O Header é um componente de cabeçalho responsivo que se adapta a diferentes tamanhos de tela.
 * 
 * PRINCIPAIS RECURSOS:
 * - Menu de navegação para dispositivos móveis
 * - Ícones de ações rápidas
 * - Menu de perfil do usuário
 * - Suporte a tema claro/escuro automático
 * - Totalmente responsivo e multiplataforma (iOS, Android, Web)
 * 
 * PERSONALIZAÇÃO:
 * O componente pode ser personalizado através das props:
 * 
 * - ProfileMenuComponent: Componente personalizado para o menu de perfil
 * - SidebarComponent: Componente personalizado para a barra lateral
 * 
 * Exemplos de uso:
 * ```tsx
 * // Header básico
 * <Header />
 * 
 * // Header com componentes personalizados
 * <Header
 *   ProfileMenuComponent={CustomProfileMenu}
 *   SidebarComponent={CustomSidebar}
 * />
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo Header.tsx
 */

export { Header } from './Header';
export type { HeaderProps } from './Header'; 