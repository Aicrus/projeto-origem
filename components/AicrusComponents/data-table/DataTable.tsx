import React, { useState, useEffect, RefObject } from 'react';
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
  Table,
  Column,
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
  const [tableWidth, setTableWidth] = useState(0);
  
  // Refs
  const dropdownTriggerRef = React.useRef<View>(null);
  const dropdownRef = React.useRef<View>(null);
  const containerRef = React.useRef<View>(null);
  
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

  // Medir a largura do container para ajustar a tabela
  useEffect(() => {
    if (Platform.OS === 'web' && containerRef.current) {
      // TypeScript não conhece o ResizeObserver no ambiente React Native
      const ResizeObserver = (window as any).ResizeObserver;
      if (!ResizeObserver) return;
      
      const resizeObserver = new ResizeObserver((entries: any[]) => {
        for (let entry of entries) {
          if (entry.target === containerRef.current) {
            setTableWidth(entry.contentRect.width);
          }
        }
      });

      // @ts-ignore - getBoundingClientRect() é específico da web
      const width = containerRef.current.getBoundingClientRect().width;
      setTableWidth(width);
      
      resizeObserver.observe(containerRef.current);
      return () => {
        if (containerRef.current) {
          resizeObserver.unobserve(containerRef.current);
        }
      };
    }
  }, []);
  
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
        // Verificação de tipos para o ambiente web
        if (Platform.OS === 'web') {
          const target = event.target as HTMLElement;
          const dropdownNode = dropdownRef.current as unknown as HTMLElement;
          const triggerNode = dropdownTriggerRef.current as unknown as HTMLElement;
          
          if (
            dropdownNode && 
            triggerNode && 
            !dropdownNode.contains(target) &&
            !triggerNode.contains(target)
          ) {
            setDropdownOpen(false);
          }
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [dropdownOpen]);
  
  // Calcular larguras das colunas baseado no espaço disponível
  const calculateColumnWidths = () => {
    if (tableWidth === 0) return {};
    
    const visibleColumns = table.getVisibleFlatColumns();
    const totalColumns = visibleColumns.length;
    
    // Definir larguras específicas para colunas especiais
    const specialColumnWidths: Record<string, number> = {
      select: 50,
      actions: 70,
      amount: 120,
    };
    
    // Calcular quantas colunas especiais existem
    const specialColumns = visibleColumns.filter((col: Column<TData, unknown>) => 
      Object.keys(specialColumnWidths).includes(col.id)
    );
    
    // Calcular o espaço ocupado pelas colunas especiais
    const specialColumnsWidth = specialColumns.reduce(
      (total: number, col: Column<TData, unknown>) => total + (specialColumnWidths[col.id] || 0), 
      0
    );
    
    // Calcular o espaço restante para as colunas normais
    const regularColumns = totalColumns - specialColumns.length;
    const availableWidth = tableWidth - specialColumnsWidth;
    const regularColumnWidth = Math.max(
      regularColumns > 0 ? Math.floor(availableWidth / regularColumns) : 200,
      150 // Largura mínima
    );
    
    // Criar objeto com todas as larguras
    const result: Record<string, number> = {};
    visibleColumns.forEach((column: Column<TData, unknown>) => {
      if (Object.keys(specialColumnWidths).includes(column.id)) {
        result[column.id] = specialColumnWidths[column.id];
      } else {
        result[column.id] = regularColumnWidth;
      }
    });
    
    return result;
  };
  
  const columnWidths = calculateColumnWidths();
  
  // Cores do tema
  const getThemeColors = () => {
    return {
      primary: isDark ? colors.primary.dark : colors.primary.main,
      primaryLight: isDark ? colors.primary.main : colors.primary.light,
      border: isDark ? colors.gray['700'] : colors.gray['200'],
      background: isDark ? colors.gray['900'] : colors.white,
      backgroundAlt: isDark ? colors.gray['800'] : colors.gray['50'],
      text: isDark ? colors.gray['100'] : colors.gray['900'],
      textMuted: isDark ? colors.gray['400'] : colors.gray['500'],
      selectedRow: isDark ? 'rgba(137, 44, 220, 0.15)' : 'rgba(137, 44, 220, 0.05)',
      hoverState: isDark ? 'rgba(55, 65, 81, 0.5)' : 'rgba(243, 244, 246, 0.5)',
    };
  };
  
  const themeColors = getThemeColors();
  
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
      borderColor: themeColors.border,
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
      backgroundColor: themeColors.background,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: themeColors.border,
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
      color: themeColors.textMuted,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    dropdownSeparator: {
      height: 1,
      backgroundColor: themeColors.border,
      marginVertical: 4,
    },
    tableContainer: {
      width: '100%',
      borderWidth: 1,
      borderColor: themeColors.border,
      borderRadius: 8,
      overflow: 'hidden',
    },
    scrollContainer: {
      minWidth: '100%',
    },
    fullWidthTable: {
      width: '100%',
      minWidth: tableWidth > 0 ? tableWidth : '100%',
    },
    tableHeader: {
      backgroundColor: themeColors.backgroundAlt,
      width: '100%',
    },
    tableHeaderRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: themeColors.border,
      width: '100%',
    },
    tableHeaderCell: {
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tableBody: {
      backgroundColor: themeColors.background,
      width: '100%',
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: themeColors.border,
      width: '100%',
    },
    tableRowSelected: {
      backgroundColor: themeColors.selectedRow,
    },
    tableCell: {
      padding: 12,
      justifyContent: 'center',
    },
    // Colunas com tamanhos específicos
    columnFixed: {
      flexShrink: 0,
    },
    columnSelect: {
      width: 50,
      flexShrink: 0,
      flexGrow: 0,
    },
    columnActions: {
      width: 70,
      flexShrink: 0,
      flexGrow: 0,
    },
    columnMoney: {
      width: 120,
      flexShrink: 0,
      flexGrow: 0,
    },
    columnEmail: {
      minWidth: 220,
      flex: 2,
    },
    columnStatus: {
      minWidth: 120,
      flex: 1,
    },
    columnFlex: {
      flex: 1,
      minWidth: isMobile ? 150 : 180,
    },
    // Alinhamentos
    tableCellStart: {
      alignItems: 'flex-start',
    },
    tableCellCenter: {
      alignItems: 'center',
    },
    tableCellEnd: {
      alignItems: 'flex-end',
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
      color: themeColors.textMuted,
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
      color: themeColors.text,
    },
    cellText: {
      fontSize: 14,
      color: themeColors.text,
    },
    noResults: {
      padding: 24,
      textAlign: 'center',
      fontSize: 14,
      color: themeColors.textMuted,
      width: '100%',
    },
  });
  
  const styles = getStyles();
  
  // Função para determinar o alinhamento de uma coluna
  const getColumnAlignment = (columnId: string) => {
    // Alinhamento padrão para cada tipo de coluna
    if (columnId === 'select') return styles.tableCellCenter;
    if (columnId === 'status') return styles.tableCellCenter;
    if (columnId === 'actions') return styles.tableCellCenter;
    if (columnId === 'amount' || columnId === 'valor') return styles.tableCellEnd;
    
    // Alinhamento padrão para outras colunas
    return styles.tableCellStart;
  };
  
  // Função para determinar qual estilo de coluna usar
  const getColumnStyle = (columnId: string) => {
    if (columnId === 'select') return styles.columnSelect;
    if (columnId === 'actions') return styles.columnActions;
    if (columnId === 'amount' || columnId === 'valor') return styles.columnMoney;
    if (columnId === 'email') return styles.columnEmail;
    if (columnId === 'status') return styles.columnStatus;
    
    return styles.columnFlex;
  };
  
  // Função para verificar se o scroll é necessário
  const isScrollNeeded = (): boolean => {
    // Se estamos em um dispositivo móvel, sempre permitir scroll horizontal
    if (isMobile) return true;
    
    // Calcular a largura total necessária para todas as colunas
    const totalRequiredWidth = table.getVisibleFlatColumns().reduce((total, column) => {
      if (column.id === 'select') return total + 50;
      if (column.id === 'actions') return total + 70;
      if (column.id === 'amount' || column.id === 'valor') return total + 120;
      if (column.id === 'email') return total + 220;
      if (column.id === 'status') return total + 120;
      
      // Colunas regulares
      return total + 180;
    }, 0);
    
    // Se a largura necessária for maior que a largura disponível, scroll é necessário
    return totalRequiredWidth > tableWidth;
  };
  
  // Renderizar botão de ordenação
  const renderSortButton = (column: any, label: string) => (
    <TouchableOpacity
      style={styles.sortButton}
      onPress={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      disabled={!column.getCanSort()}
    >
      <Text style={styles.headerText}>{label}</Text>
      <ArrowUpDown size={16} color={themeColors.textMuted} />
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
          background-color: ${themeColors.hoverState};
          transition: background-color 0.2s ease;
        }
        
        /* Estilo para hover nos botões da tabela */
        [data-table-button="true"]:hover {
          background-color: ${themeColors.hoverState};
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
    <View style={[styles.container, style]} ref={containerRef}>
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
          <ChevronDown size={16} color={themeColors.text} />
        </TouchableOpacity>
        
        {Platform.OS !== 'web' && renderColumnsDropdown()}
      </View>
      
      {/* Tabela */}
      <View style={styles.tableContainer}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={true}
          scrollEnabled={isScrollNeeded()}
          contentContainerStyle={styles.scrollContainer}
        >
          <View style={styles.fullWidthTable}>
            {/* Cabeçalho da tabela */}
            <View style={styles.tableHeader}>
              {table.getHeaderGroups().map((headerGroup) => (
                <View key={headerGroup.id} style={styles.tableHeaderRow}>
                  {headerGroup.headers.map((header) => {
                    const columnStyle = getColumnStyle(header.id);
                    const alignment = getColumnAlignment(header.id);
                            
                    return (
                      <View 
                        key={header.id} 
                        style={[
                          styles.tableHeaderCell,
                          columnStyle,
                          alignment
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
                      const columnStyle = getColumnStyle(cell.column.id);
                      const alignment = getColumnAlignment(cell.column.id);
                              
                      return (
                        <View 
                          key={cell.id} 
                          style={[
                            styles.tableCell,
                            columnStyle,
                            alignment
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
                  <Text style={styles.noResults}>
                    {noResultsText}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>
      
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