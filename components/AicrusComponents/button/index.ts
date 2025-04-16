/**
 * Exportação do componente Button
 * 
 * O Button é um componente de botão altamente personalizável que suporta:
 * 
 * PRINCIPAIS RECURSOS:
 * - Variantes: primary, destructive, outline, ghost, link
 * - Estado de carregamento com indicador visual
 * - Ícones: à esquerda, à direita ou botão de ícone
 * - Tema claro/escuro automático
 * - Responsividade
 * - Acessibilidade
 * 
 * PERSONALIZAÇÃO:
 * O componente pode ser totalmente personalizado através das props:
 * 
 * Opções básicas:
 * - children: Texto do botão ou conteúdo React (obrigatório)
 * - variant: Estilo visual do botão ('primary', 'destructive', 'outline', 'ghost', 'link')
 * - size: Tamanho do botão ('xs', 'sm', 'md', 'lg')
 * - disabled: Desabilita o botão
 * - loading: Ativa o estado de carregamento
 * 
 * Personalização:
 * - loadingText: Texto exibido durante o carregamento
 * - leftIcon: Ícone exibido à esquerda do texto
 * - rightIcon: Ícone exibido à direita do texto
 * - isIconOnly: Botão de ícone (sem texto)
 * - fullWidth: Botão com largura total
 * - style: Estilos customizados para o container
 * - textStyle: Estilos customizados para o texto
 * 
 * Exemplos de uso:
 * ```tsx
 * // Botão primário simples
 * <Button 
 *   variant="primary" 
 *   onPress={() => console.log('Clicado')}
 * >
 *   Botão Primário
 * </Button>
 * 
 * // Botão com ícone e carregamento
 * <Button 
 *   variant="destructive"
 *   leftIcon={<Trash size={16} color="white" />}
 *   loading={isSubmitting}
 *   loadingText="Deletando..."
 *   onPress={handleDelete}
 * >
 *   Excluir Item
 * </Button>
 * 
 * // Botão de ícone
 * <Button 
 *   variant="outline"
 *   isIconOnly
 *   onPress={handleAdd}
 * >
 *   <Plus size={16} color={isDark ? "white" : "black"} />
 * </Button>
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo Button.tsx
 */

export * from './Button';
export type { ButtonProps, ButtonSize, ButtonVariant } from './Button'; 