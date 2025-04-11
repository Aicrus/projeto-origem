/**
 * Exportação do componente Select
 * 
 * O Select é um componente de dropdown altamente personalizável para seleção única ou múltipla:
 * 
 * PRINCIPAIS RECURSOS:
 * - Suporte a tema claro/escuro automático
 * - Seleção única ou múltipla de opções
 * - Pesquisa integrada para filtrar opções
 * - Totalmente responsivo e multiplataforma (iOS, Android, Web)
 * - Posicionamento inteligente (abre para cima ou para baixo conforme espaço disponível)
 * 
 * PERSONALIZAÇÃO:
 * O componente pode ser totalmente personalizado através das props:
 * 
 * Opções básicas:
 * - options: Array de opções para exibir (obrigatório)
 * - value: Valor selecionado (string para seleção única, string[] para múltipla) (obrigatório)
 * - setValue: Função para atualizar o valor selecionado (obrigatório)
 * - placeholder: Texto exibido quando nenhum item está selecionado
 * - label: Texto do rótulo acima do select (pode ser omitido)
 * - disabled: Desabilita o select
 * - loading: Indica estado de carregamento
 * 
 * Comportamento:
 * - multiple: Habilita seleção múltipla quando true (padrão: false)
 * - searchable: Habilita campo de pesquisa para filtrar opções (padrão: false)
 * - onOpen: Função chamada quando o dropdown é aberto
 * - onClose: Função chamada quando o dropdown é fechado
 * 
 * Limitações:
 * - min: Número mínimo de itens a serem selecionados (apenas para multiple=true)
 * - max: Número máximo de itens a serem selecionados (apenas para multiple=true)
 * 
 * Aparência:
 * - maxHeight: Altura máxima do dropdown em pixels
 * - zIndex: Controle de sobreposição frontal
 * - zIndexInverse: Controle de sobreposição traseira
 * 
 * Exemplos de uso:
 * ```tsx
 * // Select de opção única
 * <Select 
 *   options={[
 *     { label: 'Opção 1', value: 'op1' },
 *     { label: 'Opção 2', value: 'op2' }
 *   ]}
 *   value={valorSelecionado}
 *   setValue={setValorSelecionado}
 *   placeholder="Selecione uma opção"
 *   label="Categoria" 
 * />
 * 
 * // Select de múltipla escolha com pesquisa
 * <Select 
 *   options={opcoesDisponiveis}
 *   value={itensSelecionados}
 *   setValue={setItensSelecionados}
 *   placeholder="Selecione várias opções"
 *   label="Categorias"
 *   multiple={true}
 *   searchable={true}
 *   max={5} // Máximo de 5 itens selecionáveis
 * />
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo Select.tsx
 */

export * from './Select';
export type { DropdownOption } from './Select'; 