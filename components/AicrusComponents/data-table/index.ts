/**
 * Exportação do componente DataTable
 * 
 * O DataTable é um componente de tabela de dados altamente personalizável que suporta:
 * 
 * PRINCIPAIS RECURSOS:
 * - Ordenação de colunas
 * - Filtro de dados
 * - Seleção de linhas (checkbox)
 * - Paginação
 * - Controle de visibilidade de colunas
 * - Tema claro/escuro automático
 * - Responsividade
 * - Acessibilidade
 * 
 * PERSONALIZAÇÃO:
 * O componente pode ser totalmente personalizado através das props:
 * 
 * Opções básicas:
 * - data: Dados a serem exibidos na tabela (obrigatório)
 * - columns: Definição das colunas da tabela (obrigatório)
 * 
 * Exemplos de uso:
 * ```tsx
 * // Tabela básica
 * <DataTable 
 *   data={dadosArray} 
 *   columns={colunasArray}
 * />
 * 
 * // Tabela com paginação, ordenação e filtros
 * <DataTable 
 *   data={dadosArray} 
 *   columns={colunasArray}
 *   enableSorting
 *   enableFiltering
 *   enablePagination
 * />
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo DataTable.tsx
 */

export * from './DataTable';
export type { DataTableProps } from './DataTable'; 