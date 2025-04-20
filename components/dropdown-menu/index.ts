/**
 * Exportação do componente DropdownMenu
 * 
 * O DropdownMenu é um componente de menu dropdown que pode ser aberto a partir de qualquer elemento:
 * 
 * PRINCIPAIS RECURSOS:
 * - Tema claro/escuro automático
 * - Responsividade em todas as plataformas (iOS, Android, Web)
 * - Posicionamento inteligente (abre para cima ou para baixo conforme espaço disponível)
 * - Suporte a ícones nas opções
 * 
 * PERSONALIZAÇÃO:
 * O componente pode ser totalmente personalizado através das props:
 * 
 * Opções básicas:
 * - options: Array de opções para exibir (obrigatório)
 * - isOpen: Controla a visibilidade do menu (obrigatório)
 * - onClose: Função chamada quando o menu é fechado (obrigatório)
 * - triggerRef: Referência para o elemento que abre o menu (obrigatório)
 * 
 * Comportamento:
 * - searchable: Habilita campo de pesquisa para filtrar opções (padrão: false)
 * - autoFocus: Controla se o campo de pesquisa deve receber foco automaticamente quando aberto
 * 
 * Aparência:
 * - maxHeight: Altura máxima do menu em pixels
 * - position: Controle manual da posição do menu (opcional)
 * 
 * Exemplos de uso:
 * ```tsx
 * // Menu simples
 * const triggerRef = useRef(null);
 * const [isMenuOpen, setIsMenuOpen] = useState(false);
 * 
 * <TouchableOpacity 
 *   ref={triggerRef}
 *   onPress={() => setIsMenuOpen(true)}
 * >
 *   <Text>Abrir Menu</Text>
 * </TouchableOpacity>
 * 
 * <DropdownMenu
 *   options={[
 *     { label: 'Opção 1', value: 'op1', onPress: () => console.log('Opção 1') },
 *     { label: 'Opção 2', value: 'op2', onPress: () => console.log('Opção 2') }
 *   ]}
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 *   triggerRef={triggerRef}
 * />
 * 
 * // Menu com ícones e pesquisa
 * <DropdownMenu
 *   options={[
 *     { 
 *       label: 'Editar', 
 *       value: 'edit', 
 *       icon: <Edit size={16} />,
 *       onPress: () => handleEditar()
 *     },
 *     { 
 *       label: 'Excluir', 
 *       value: 'delete', 
 *       icon: <Trash size={16} />,
 *       onPress: () => handleExcluir()
 *     }
 *   ]}
 *   isOpen={isMenuOpen}
 *   onClose={() => setIsMenuOpen(false)}
 *   triggerRef={triggerRef}
 *   searchable={true}
 * />
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo DropdownMenu.tsx
 */

export * from './DropdownMenu';
export type { DropdownOption } from './DropdownMenu'; 