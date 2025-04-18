import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Input } from '../input';
import { Checkbox } from '../checkbox';
import { Button } from '../button';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react-native';
import { useTheme } from '../../../hooks/ThemeContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { colors } from '../constants/theme';

/**
 * @component DataTable
 * @description Componente de tabela de dados altamente personalizável que suporta:
 * - Ordenação de colunas
 * - Filtro de dados
 * - Seleção de linhas (checkbox)
 * - Paginação
 * - Controle de visibilidade de colunas
 * - Tema claro/escuro automático
 * - Responsividade
 * 
 * Exemplos de uso:
 * 
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
 */

export interface DataTableProps<TData> {
  /** Dados a serem exibidos na tabela */
  data: TData[];
  /** Definição das colunas da tabela */
  columns: ColumnDef<TData, any>[];
  /** Filtro de coluna inicial */
  initialColumnFilter?: {
    id: string;
    value: string;
  };
  /** Habilitar ordenação */
  enableSorting?: boolean;
  /** Habilitar filtragem */
  enableFiltering?: boolean;
  /** Habilitar paginação */
  enablePagination?: boolean;
  /** Habilitar seleção de linhas */
  enableRowSelection?: boolean;
  /** Campo de texto para pesquisa */
  searchPlaceholder?: string;
  /** Estilo personalizado */
  style?: any;
  /** Texto para nenhum resultado */
  noResultsText?: string;
  /** Texto para mensagem de seleção */
  selectionText?: string;
  /** Texto para botão anterior */
  previousButtonText?: string;
  /** Texto para botão próximo */
  nextButtonText?: string;
  /** Texto para botão de colunas */
  columnsButtonText?: string;
}

export function DataTable<TData>({
  data,
  columns,
  initialColumnFilter,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowSelection = true,
  searchPlaceholder = "Filtrar emails...",
  style,
  noResultsText = "Sem resultados.",
  selectionText = "de",
  previousButtonText = "Anterior",
  nextButtonText = "Próximo",
  columnsButtonText = "Colunas",
}: DataTableProps<TData>) {
  // Estados para a tabela
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  
  // Refs
  const dropdownTriggerRef = React.useRef<any>(null);
  const dropdownRef = React.useRef<View>(null);
  
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Responsividade
  const { isMobile } = useResponsive();
  
  // Configurar filtro inicial se fornecido
  useEffect(() => {
    if (initialColumnFilter) {
      setColumnFilters([initialColumnFilter]);
    }
  }, [initialColumnFilter]);
  
  // Instância da tabela
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    enableSorting,
    enableRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: enablePagination ? getPaginationRowModel() : undefined,
    getSortedRowModel: enableSorting ? getSortedRowModel() : undefined,
    getFilteredRowModel: enableFiltering ? getFilteredRowModel() : undefined,
  });
  
  // Abrir dropdown de colunas
  const handleOpenDropdown = () => {
    if (Platform.OS === 'web' && dropdownTriggerRef.current) {
      // @ts-ignore - getBoundingClientRect() é específico da web
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.right - 200 + window.scrollX,
      });
    }
    setDropdownOpen(true);
  };
  
  // Fechar dropdown quando clicar fora
  useEffect(() => {
    if (Platform.OS === 'web' && dropdownOpen) {
      const handleClickOutside = (event: MouseEvent) => {
        if (
          dropdownRef.current && 
          dropdownTriggerRef.current && 
          // @ts-ignore - contains é específico da web
          !dropdownRef.current.contains(event.target) &&
          // @ts-ignore - contains é específico da web
          !dropdownTriggerRef.current.contains(event.target)
        ) {
          setDropdownOpen(false);
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropdownOpen]);
  
  // Estilos da tabela
  const getStyles = () => StyleSheet.create({
    container: {
      width: '100%',
    },
    filterContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: isMobile ? 8 : 0,
    },
    inputWrapper: {
      flex: 1,
      maxWidth: 320,
    },
    dropdownTrigger: {
      marginLeft: 'auto',
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#D1D5DB',
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
    },
    dropdownContent: {
      position: 'absolute',
      top: dropdownPosition.top,
      left: dropdownPosition.left,
      width: 200,
      backgroundColor: isDark ? '#1F2937' : '#FFFFFF',
      borderRadius: 6,
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      padding: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.25 : 0.1,
      shadowRadius: 3,
      elevation: 4,
      zIndex: 2000,
    },
    dropdownItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 8,
      borderRadius: 4,
    },
    dropdownLabel: {
      fontSize: 12,
      fontWeight: '500',
      color: isDark ? '#9CA3AF' : '#6B7280',
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    dropdownSeparator: {
      height: 1,
      backgroundColor: isDark ? '#374151' : '#E5E7EB',
      marginVertical: 4,
    },
    table: {
      width: '100%',
      borderWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
      borderRadius: 8,
      overflow: 'hidden',
    },
    tableHeader: {
      backgroundColor: isDark ? '#1F2937' : '#F9FAFB',
    },
    tableHeaderRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
    },
    tableHeaderCell: {
      padding: 12,
      justifyContent: 'center',
      alignItems: isMobile ? 'flex-start' : 'center',
    },
    tableBody: {
      backgroundColor: isDark ? '#111827' : '#FFFFFF',
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: isDark ? '#374151' : '#E5E7EB',
    },
    tableRowSelected: {
      backgroundColor: isDark ? 'rgba(137, 44, 220, 0.1)' : 'rgba(137, 44, 220, 0.05)',
    },
    tableCell: {
      padding: 12,
      justifyContent: 'center',
    },
    buttonGroup: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 16,
      paddingHorizontal: isMobile ? 8 : 0,
    },
    selectionText: {
      flex: 1,
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
    paginationGroup: {
      flexDirection: 'row',
      gap: 8,
    },
    sortButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
      backgroundColor: 'transparent',
      paddingVertical: 2,
      paddingHorizontal: 4,
    },
    headerText: {
      fontSize: 14,
      fontWeight: '500',
      color: isDark ? '#E5E7EB' : '#374151',
    },
    cellText: {
      fontSize: 14,
      color: isDark ? '#E5E7EB' : '#1F2937',
    },
    noResults: {
      padding: 24,
      textAlign: 'center',
      fontSize: 14,
      color: isDark ? '#9CA3AF' : '#6B7280',
    },
  });
  
  const styles = getStyles();
  
  // Renderizar botão de ordenação
  const renderSortButton = (column: any, label: string) => (
    <TouchableOpacity
      style={styles.sortButton}
      onPress={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      disabled={!column.getCanSort()}
    >
      <Text style={styles.headerText}>{label}</Text>
      <ArrowUpDown size={16} color={isDark ? '#9CA3AF' : '#6B7280'} />
    </TouchableOpacity>
  );
  
  // Renderizar Dropdown de Ações para Mobile
  const renderMobileActionsDropdown = (row: any) => {
    // Implemente conforme necessário para o seu caso específico
    return null;
  };
  
  // Renderizar o dropdown de seleção de colunas
  const renderColumnsDropdown = () => {
    if (!dropdownOpen) return null;
    
    return (
      <View 
        ref={dropdownRef}
        style={[
          styles.dropdownContent, 
          Platform.OS !== 'web' && { 
            position: 'relative', 
            top: 0, 
            left: 0, 
            alignSelf: 'flex-end',
            marginTop: 8 
          }
        ]}
      >
        <Text style={styles.dropdownLabel}>Toggle columns</Text>
        {table
          .getAllColumns()
          .filter((column) => column.getCanHide())
          .map((column) => (
            <TouchableOpacity
              key={column.id}
              style={styles.dropdownItem}
              onPress={() => column.toggleVisibility(!column.getIsVisible())}
            >
              <Checkbox
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              />
              <Text 
                style={[
                  styles.cellText, 
                  { marginLeft: 8, textTransform: 'capitalize' }
                ]}
              >
                {column.id}
              </Text>
            </TouchableOpacity>
          ))}
      </View>
    );
  };
  
  // Adicionar estilos de hover para web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* Estilo para hover nas linhas da tabela */
        [data-table-row="true"]:hover {
          background-color: ${isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)'};
          transition: background-color 0.2s ease;
        }
        
        /* Estilo para hover nos botões da tabela */
        [data-table-button="true"]:hover {
          background-color: ${isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)'};
          transition: background-color 0.2s ease;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark]);
  
  return (
    <View style={[styles.container, style]}>
      {/* Filtros e controles */}
      <View style={styles.filterContainer}>
        {enableFiltering && (
          <View style={styles.inputWrapper}>
            <Input
              value={(table.getColumn('email')?.getFilterValue() as string) ?? ''}
              onChangeText={(value) =>
                table.getColumn('email')?.setFilterValue(value)
              }
              placeholder={searchPlaceholder}
              type="search"
              onClear={() => table.getColumn('email')?.setFilterValue('')}
            />
          </View>
        )}
        
        <TouchableOpacity
          ref={dropdownTriggerRef}
          style={styles.dropdownTrigger}
          onPress={handleOpenDropdown}
          {...(Platform.OS === 'web' ? { 'data-table-button': 'true' } : {})}
        >
          <Text style={styles.headerText}>{columnsButtonText}</Text>
          <ChevronDown size={16} color={isDark ? '#E5E7EB' : '#374151'} />
        </TouchableOpacity>
        
        {Platform.OS !== 'web' && renderColumnsDropdown()}
      </View>
      
      {/* Tabela */}
      <ScrollView horizontal style={styles.table}>
        <View>
          {/* Cabeçalho da tabela */}
          <View style={styles.tableHeader}>
            {table.getHeaderGroups().map((headerGroup) => (
              <View key={headerGroup.id} style={styles.tableHeaderRow}>
                {headerGroup.headers.map((header) => {
                  const width = header.id === 'select' 
                    ? 50 
                    : header.id === 'actions' 
                      ? 70 
                      : header.id === 'amount' 
                        ? 120 
                        : isMobile 
                          ? 150 
                          : 200;
                          
                  return (
                    <View 
                      key={header.id} 
                      style={[
                        styles.tableHeaderCell,
                        { width },
                        header.id === 'amount' && { alignItems: 'flex-end' }
                      ]}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </View>
                  );
                })}
              </View>
            ))}
          </View>
          
          {/* Corpo da tabela */}
          <View style={styles.tableBody}>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <View
                  key={row.id}
                  style={[
                    styles.tableRow,
                    row.getIsSelected() && styles.tableRowSelected,
                  ]}
                  {...(Platform.OS === 'web' ? { 'data-table-row': 'true' } : {})}
                >
                  {row.getVisibleCells().map((cell) => {
                    const width = cell.column.id === 'select' 
                      ? 50 
                      : cell.column.id === 'actions' 
                        ? 70 
                        : cell.column.id === 'amount' 
                          ? 120 
                          : isMobile 
                            ? 150 
                            : 200;
                            
                    return (
                      <View 
                        key={cell.id} 
                        style={[
                          styles.tableCell,
                          { width },
                          cell.column.id === 'amount' && { alignItems: 'flex-end' }
                        ]}
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </View>
                    );
                  })}
                </View>
              ))
            ) : (
              <View style={styles.tableRow}>
                <Text
                  style={[
                    styles.noResults,
                    { width: table.getAllColumns().reduce(
                      (acc, column) => acc + (column.getSize() || 200),
                      0
                    )}
                  ]}
                >
                  {noResultsText}
                </Text>
              </View>
            )}
          </View>
        </View>
      </ScrollView>
      
      {/* Paginação e seleção */}
      {enablePagination && (
        <View style={styles.buttonGroup}>
          <Text style={styles.selectionText}>
            {table.getFilteredSelectedRowModel().rows.length} {selectionText}{' '}
            {table.getFilteredRowModel().rows.length} linha(s) selecionada(s).
          </Text>
          
          <View style={styles.paginationGroup}>
            <Button
              variant="outline"
              size="sm"
              onPress={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              {previousButtonText}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onPress={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              {nextButtonText}
            </Button>
          </View>
        </View>
      )}
      
      {/* Dropdown para web */}
      {Platform.OS === 'web' && renderColumnsDropdown()}
    </View>
  );
} 