import React, { useState, useEffect, RefObject, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
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
import { HoverableView } from '../hoverable-view/HoverableView';
import { createPortal } from 'react-dom';

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
 * - Efeito de hover nas linhas usando HoverableView
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
  /** Habilitar seleção ao clicar na linha (se false, apenas o checkbox seleciona) */
  enableRowClick?: boolean;
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
  /** Configurações para o efeito de hover nas linhas */
  hoverableRowProps?: {
    /** Escala ao passar o mouse (default: 1) */
    hoverScale?: number;
    /** Deslocamento Y ao passar o mouse (default: 0) */
    hoverTranslateY?: number;
    /** Duração da animação em ms (default: 150) */
    animationDuration?: number;
    /** Opacidade ao passar o mouse (default: undefined) */
    hoverOpacity?: number;
    /** Se deve aplicar fundo ao passar o mouse (default: false) */
    disableHoverBackground?: boolean;
  };
}

export function DataTable<TData>({
  data,
  columns,
  initialColumnFilter,
  enableSorting = true,
  enableFiltering = true,
  enablePagination = true,
  enableRowSelection = true,
  enableRowClick = false,
  searchPlaceholder = "Filtrar emails...",
  style,
  noResultsText = "Sem resultados.",
  selectionText = "de",
  previousButtonText = "Anterior",
  nextButtonText = "Próximo",
  columnsButtonText = "Colunas",
  hoverableRowProps = {
    hoverScale: 1,
    hoverTranslateY: 0,
    animationDuration: 150,
    disableHoverBackground: false,
  },
}: DataTableProps<TData>) {
  // Estados para a tabela
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dropdownRect, setDropdownRect] = useState<{ top: number; left: number; width: number; height: number } | null>(null);
  const [tableWidth, setTableWidth] = useState(0);
  const [dropdownPosition, setDropdownPosition] = useState<{
    top?: number;
    right?: number;
    left?: number;
    width: number;
    openDown: boolean;
  }>({ width: 200, openDown: true });
  
  // Refs
  const dropdownTriggerRef = useRef<View>(null);
  const dropdownRef = useRef<View>(null);
  const containerRef = useRef<View>(null);
  
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
    if (Platform.OS === 'web' as any && containerRef.current) {
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
  
  // Abrir dropdown de colunas - ABORDAGEM SIMILAR AO SELECT
  const handleOpenDropdown = () => {
    if (Platform.OS === 'web' as any && dropdownTriggerRef.current) {
      // @ts-ignore - getBoundingClientRect() é específico da web
      const rect = dropdownTriggerRef.current.getBoundingClientRect();
      
      // Determinar se há espaço suficiente abaixo do botão
      const viewportHeight = window.innerHeight;
      const dropdownHeight = 250; // Altura estimada do dropdown
      const spaceBelow = viewportHeight - rect.bottom;
      
      // Escolher a direção: para baixo se houver espaço, para cima caso contrário
      const openDown = spaceBelow >= dropdownHeight || rect.top < dropdownHeight;
      
      // Definir posição com base na direção escolhida
      if (openDown) {
        setDropdownPosition({
          top: rect.bottom + 5 + window.scrollY, // 5px de espaçamento
          right: window.innerWidth - rect.right - window.scrollX,
          width: 200,
          openDown: true
        });
      } else {
        setDropdownPosition({
          top: rect.top + window.scrollY, // Guardar a posição top para cálculo do bottom
          right: window.innerWidth - rect.right - window.scrollX,
          width: 200,
          openDown: false
        });
      }
    }
    setDropdownOpen(true);
  };
  
  // Fechar o dropdown
  const handleCloseDropdown = () => {
    setDropdownOpen(false);
  };
  
  // Fechar dropdown quando clicar fora - VERSÃO CORRIGIDA
  useEffect(() => {
    if (Platform.OS === 'web' as any && dropdownOpen) {
      // Criar um overlay de tela inteira para capturar qualquer clique fora do dropdown
      const overlay = document.createElement('div');
      overlay.id = 'dropdown-overlay';
      Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        right: '0',
        bottom: '0',
        zIndex: '1999', // Um pouco menos que o dropdown (2000)
      });
      
      // Quando clicar no overlay, fechar o dropdown
      overlay.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        handleCloseDropdown();
      });
      
      document.body.appendChild(overlay);
      
      return () => {
        // Remover o overlay quando o efeito for limpo
        document.body.removeChild(overlay);
      };
    }
  }, [dropdownOpen]);

  // Atualizar posição do dropdown quando a janela for redimensionada
  useEffect(() => {
    if (Platform.OS === 'web' as any && dropdownOpen && dropdownTriggerRef.current) {
      const handleResize = () => {
        // Recalcular posição do dropdown
        // @ts-ignore - getBoundingClientRect() é específico da web
        const rect = dropdownTriggerRef.current.getBoundingClientRect();
        
        // Determinar a direção novamente
        const viewportHeight = window.innerHeight;
        const dropdownHeight = 250;
        const spaceBelow = viewportHeight - rect.bottom;
        
        // Abrir para baixo se houver espaço, ou para cima caso contrário
        const openDown = spaceBelow >= dropdownHeight || rect.top < dropdownHeight;
        
        if (openDown) {
          setDropdownPosition({
            top: rect.bottom + 5 + window.scrollY,
            right: window.innerWidth - rect.right - window.scrollX,
            width: 200,
            openDown: true
          });
        } else {
          setDropdownPosition({
            top: rect.top + window.scrollY, // Guardar a posição top para cálculo do bottom
            right: window.innerWidth - rect.right - window.scrollX,
            width: 200,
            openDown: false
          });
        }
      };
      
      // Adicionar listeners para resize e scroll
      window.addEventListener('resize', handleResize);
      window.addEventListener('scroll', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('scroll', handleResize);
      };
    }
  }, [dropdownOpen]);

  // Adicionar estilos CSS para melhorar a aparência e comportamento do dropdown
  useEffect(() => {
    if (Platform.OS === 'web' as any) {
      const style = document.createElement('style');
      style.textContent = `
        /* Garantir que elementos com position:fixed não sejam cortados */
        *, *::before, *::after {
          transform-style: preserve-3d;
        }
        
        /* Garantir que elementos com position:fixed tenham um z-index alto */
        body > [data-dropdown-content="true"] {
          z-index: 2000 !important;
        }
        
        /* Esconder o scrollbar mas permitir scroll */
        *::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        *::-webkit-scrollbar-track {
          background: transparent;
        }
        
        *::-webkit-scrollbar-thumb {
          background-color: ${isDark ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.15)'};
          border-radius: 3px;
        }

        /* Melhorar aparência dos checkboxes */
        [data-dropdown-content="true"] input[type="checkbox"] {
          margin-right: 8px;
          accent-color: ${isDark ? colors.primary.dark : colors.primary.main};
        }

        /* Adicionar efeitos de hover para o botão do dropdown */
        [data-table-button="true"]:hover {
          border-color: ${isDark ? colors.primary.dark : colors.primary.main};
          transition: border-color 0.2s ease;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark]);
  
  // Limpar qualquer recurso ao desmontar o componente
  useEffect(() => {
    return () => {
      if (Platform.OS === 'web' as any) {
        // Remover qualquer elemento de portal que possa ter ficado
        const dropdownElements = document.querySelectorAll('[data-dropdown-content="true"]');
        dropdownElements.forEach(el => {
          if (el.parentNode) {
            el.parentNode.removeChild(el);
          }
        });
      }
    };
  }, []);

  // Renderizar o dropdown de seleção de colunas com Portal
  const renderColumnsDropdown = () => {
    if (!dropdownOpen) return null;
    
    // Componente interno do dropdown que será renderizado no portal
    const ColumnsDropdownContent = () => {
      // Estado de hover para todas as colunas em um único objeto
      const [hoveredColumns, setHoveredColumns] = useState<Record<string, boolean>>({});
      
      const handleMouseEnter = (columnId: string) => {
        setHoveredColumns(prev => ({ ...prev, [columnId]: true }));
      };
      
      const handleMouseLeave = (columnId: string) => {
        setHoveredColumns(prev => ({ ...prev, [columnId]: false }));
      };
      
      const dropdownStyle = StyleSheet.create({
        overlay: {
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 1999,
          backgroundColor: 'transparent',
        },
        container: {
          position: 'absolute',
          top: dropdownPosition.openDown ? dropdownPosition.top : undefined,
          right: dropdownPosition.right,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          maxHeight: 250,
          backgroundColor: isDark ? colors.gray['800'] : colors.white,
          borderRadius: 6,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: isDark ? colors.gray['700'] : colors.gray['200'],
          padding: 4,
          boxShadow: isDark ? '0 2px 4px rgba(0,0,0,0.25)' : '0 2px 4px rgba(0,0,0,0.1)',
          zIndex: 2000,
          overflowY: 'auto',
        },
        header: {
          fontSize: 12,
          fontWeight: '500',
          color: isDark ? colors.gray['400'] : colors.gray['600'],
          padding: 8,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? colors.gray['700'] : colors.gray['200'],
          marginBottom: 4,
        },
        item: {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          padding: 8,
          borderRadius: 4,
          cursor: 'pointer',
        },
        itemHover: {
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        },
        itemText: {
          fontSize: 14,
          marginLeft: 8,
          textTransform: 'capitalize',
          color: isDark ? colors.gray['100'] : colors.gray['900'],
        }
      });

      // Calculando o estilo adicional para quando o dropdown abre para cima
      const containerStyle = {...dropdownStyle.container as React.CSSProperties};
      if (!dropdownPosition.openDown) {
        containerStyle.top = undefined;
        containerStyle.bottom = `${window.innerHeight - (dropdownPosition.top || 0) + 5}px`;
      }

      return (
        <>
          {/* Overlay transparente para capturar eventos e prevenir scroll */}
          <div 
            style={dropdownStyle.overlay as React.CSSProperties}
            onClick={handleCloseDropdown}
          />
          <div 
            ref={dropdownRef as any}
            style={containerStyle}
            onClick={(e) => e.stopPropagation()}
            data-dropdown-content="true"
          >
            <div style={dropdownStyle.header as React.CSSProperties}>
              Toggle columns
            </div>
            
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const isHovered = hoveredColumns[column.id] || false;
                
                return (
                  <div
                    key={column.id}
                    style={{
                      ...dropdownStyle.item as React.CSSProperties,
                      ...(isHovered ? dropdownStyle.itemHover as React.CSSProperties : {})
                    }}
                    onClick={() => column.toggleVisibility(!column.getIsVisible())}
                    onMouseEnter={() => handleMouseEnter(column.id)}
                    onMouseLeave={() => handleMouseLeave(column.id)}
                  >
                    <input
                      type="checkbox"
                      checked={column.getIsVisible()}
                      onChange={(e) => {
                        e.stopPropagation();
                        column.toggleVisibility(e.target.checked);
                      }}
                      style={{ cursor: 'pointer' }}
                    />
                    <span style={dropdownStyle.itemText as React.CSSProperties}>
                      {column.id}
                    </span>
                  </div>
                );
              })}
          </div>
        </>
      );
    };

    // Usando createPortal para renderizar diretamente no body
    if (Platform.OS === 'web' as any && typeof document !== 'undefined') {
      return createPortal(
        <ColumnsDropdownContent />,
        document.body
      );
    }
    
    // Versão para dispositivos móveis usando Modal
    return (
      <Modal
        visible={dropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseDropdown}
      >
        {/* Implementação mobile aqui */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View 
            style={{ 
              width: '80%', 
              backgroundColor: isDark ? colors.gray['800'] : colors.white,
              borderRadius: 6,
              padding: 16,
            }}
          >
            <Text 
              style={{
                fontSize: 12,
                fontWeight: '500',
                color: isDark ? colors.gray['400'] : colors.gray['600'],
                marginBottom: 8,
              }}
            >
              Toggle columns
            </Text>
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <TouchableOpacity
                  key={column.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    padding: 8,
                    borderRadius: 4,
                  }}
                  onPress={() => column.toggleVisibility(!column.getIsVisible())}
                >
                  <Checkbox
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  />
                  <Text 
                    style={{
                      marginLeft: 8,
                      fontSize: 14,
                      color: isDark ? colors.gray['100'] : colors.gray['900'],
                      textTransform: 'capitalize',
                    }}
                  >
                    {column.id}
                  </Text>
                </TouchableOpacity>
              ))}
            
            <TouchableOpacity
              style={{
                marginTop: 16,
                padding: 8,
                backgroundColor: isDark ? colors.gray['700'] : colors.gray['200'],
                borderRadius: 4,
                alignItems: 'center',
              }}
              onPress={handleCloseDropdown}
            >
              <Text style={{ color: isDark ? colors.gray['100'] : colors.gray['900'] }}>
                Fechar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };
  
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
  
  // Cores do tema seguindo o padrão do Accordion.tsx e theme.ts
  const getThemeColors = () => {
    return {
      // Cores primárias
      primary: {
        main: isDark ? colors.primary.dark : colors.primary.main,
        light: isDark ? colors.primary.main : colors.primary.light,
        dark: isDark ? colors.primary.main + '99' : colors.primary.dark,
        contrastText: '#FFFFFF',
      },
      // Cores de feedback
      error: isDark ? colors.error.dark : colors.error.main,
      warning: isDark ? colors.warning.dark : colors.warning.main,
      success: isDark ? colors.success.dark : colors.success.main,
      info: isDark ? colors.info.dark : colors.info.main,
      // Cores de background
      background: {
        default: isDark ? colors.gray['900'] : colors.white,
        paper: isDark ? colors.gray['800'] : colors.white,
        alt: isDark ? colors.gray['800'] : colors.gray['50'],
        elevated: isDark ? colors.gray['700'] : colors.gray['100'],
      },
      // Cores de texto
      text: {
        primary: isDark ? colors.gray['100'] : colors.gray['900'],
        secondary: isDark ? colors.gray['400'] : colors.gray['600'],
        disabled: isDark ? colors.gray['500'] : colors.gray['400'],
        hint: isDark ? colors.gray['500'] : colors.gray['400'],
      },
      // Cores de borda
      border: {
        light: isDark ? colors.gray['700'] : colors.gray['200'],
        main: isDark ? colors.gray['600'] : colors.gray['300'],
        dark: isDark ? colors.gray['500'] : colors.gray['400'],
      },
      // Estados da interface
      state: {
        hover: isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
        selected: isDark ? 'rgba(137, 44, 220, 0.25)' : 'rgba(137, 44, 220, 0.08)',
        disabled: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        focus: isDark ? `${colors.primary.dark}40` : `${colors.primary.main}40`,
      },
      // Cores de divisor
      divider: isDark ? colors.gray['700'] : colors.gray['200'],
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
      borderColor: themeColors.border.light,
      borderRadius: 6,
      paddingHorizontal: 12,
      paddingVertical: 8,
      gap: 6,
    },
    dropdownContent: {
      position: 'absolute',
      width: 200,
      backgroundColor: themeColors.background.paper,
      borderRadius: 6,
      borderWidth: 1,
      borderColor: themeColors.border.light,
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
      color: themeColors.text.secondary,
      paddingHorizontal: 8,
      paddingVertical: 4,
    },
    dropdownSeparator: {
      height: 1,
      backgroundColor: themeColors.divider,
      marginVertical: 4,
    },
    tableContainer: {
      width: '100%',
      borderWidth: 1,
      borderColor: themeColors.border.light,
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
      backgroundColor: themeColors.background.alt,
      width: '100%',
    },
    tableHeaderRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: themeColors.border.light,
      width: '100%',
    },
    tableHeaderCell: {
      padding: 12,
      justifyContent: 'center',
      alignItems: 'center',
    },
    tableBody: {
      backgroundColor: themeColors.background.default,
      width: '100%',
    },
    tableRow: {
      display: 'flex',
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderColor: themeColors.border.light,
      width: '100%',
    },
    tableRowSelected: {
      backgroundColor: themeColors.state.selected,
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
      color: themeColors.text.secondary,
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
      color: themeColors.text.primary,
    },
    cellText: {
      fontSize: 14,
      color: themeColors.text.primary,
    },
    noResults: {
      padding: 24,
      textAlign: 'center',
      fontSize: 14,
      color: themeColors.text.secondary,
      width: '100%',
    },
  });
  
  const styles = getStyles();
  
  const getHeaderAlignment = (columnId: string) => {
    // Alinhamento padrão para cada tipo de coluna no cabeçalho
    if (columnId === 'select') return styles.tableCellCenter;
    if (columnId === 'status') return styles.tableCellCenter;
    if (columnId === 'actions') return styles.tableCellCenter;
    if (columnId === 'amount' || columnId === 'valor') return styles.tableCellEnd;
    
    // Alinhamento padrão para outras colunas
    return styles.tableCellStart;
  };

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
  
  // Função para renderizar botão de ordenação
  const renderSortButton = (column: any, label: string) => (
    <TouchableOpacity
      style={styles.sortButton}
      onPress={() => column.toggleSorting(column.getIsSorted() === 'asc')}
      disabled={!column.getCanSort()}
    >
      <Text 
        style={[styles.headerText, column.id === 'amount' && styles.tableCellEnd]}
        {...(Platform.OS === 'web' ? { 'data-cell-text': 'true' } : {})}
      >
        {label}
      </Text>
      <ArrowUpDown size={16} color={themeColors.text.secondary} />
    </TouchableOpacity>
  );
  
  // Renderizar Dropdown de Ações para Mobile
  const renderMobileActionsDropdown = (row: any) => {
    // Implemente conforme necessário para o seu caso específico
    return null;
  };
  
  // Função para envolver o conteúdo renderizado com atributos de texto
  const wrapWithTextAttributes = (content: React.ReactNode) => {
    // Caso especial para textos simples
    if (typeof content === 'string' || typeof content === 'number') {
      return (
        <Text 
          style={styles.cellText}
          {...(Platform.OS === 'web' ? { 'data-cell-text': 'true' } : {})}
        >
          {content}
        </Text>
      );
    }
    
    // Retornar o conteúdo original para componentes complexos
    return content;
  };
  
  // Adicionar estilo de cursor baseado no enableRowClick
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* Cursor padrão ou pointer com base na configuração */
        [data-table-row="true"] {
          cursor: ${enableRowClick ? 'pointer' : 'default'} !important;
        }
        
        /* Estilo para hover nos botões da tabela */
        [data-table-button="true"]:hover {
          background-color: ${themeColors.state.hover};
          transition: background-color 0.2s ease;
        }
        
        /* Estilo para o cabeçalho da tabela */
        [data-table-header="true"] {
          color: ${themeColors.text.primary} !important; 
        }
        
        /* Transição suave para todas as linhas da tabela */
        [data-table-row="true"] {
          transition: all 0.2s ease;
        }
        
        /* Estilo para cabeçalho e células */
        [data-cell-text="true"] {
          color: ${themeColors.text.primary} !important;
        }
        
        /* Estilo para células da tabela */
        [data-table-cell="true"] {
          color: ${themeColors.text.primary};
        }
        
        /* Estilo para status na tabela */
        [data-table-cell="true"] span, 
        [data-table-cell="true"] div,
        [data-table-cell="true"] p {
          color: ${themeColors.text.primary};
        }
        
        /* Estilo para linhas selecionadas */
        [data-selected-row="true"] {
          background-color: ${themeColors.state.selected} !important;
          border-color: ${isDark ? 'rgba(137, 44, 220, 0.5)' : 'rgba(137, 44, 220, 0.2)'} !important;
        }
        
        /* Checkbox personalizado para tema escuro */
        input[type="checkbox"] {
          accent-color: ${colors.primary.main};
          cursor: pointer !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark, themeColors, enableRowClick]);
  
  // Adicionamos um efeito de limpeza ao desmontar o componente
  useEffect(() => {
    return () => {
      // Limpar dropdown portal ao desmontar
      if (Platform.OS === 'web' as any) {
        const portalElement = document.getElementById('dropdown-portal');
        if (portalElement) {
          portalElement.innerHTML = '';
        }
      }
    };
  }, []);
  
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
          style={[
            styles.dropdownTrigger,
            Platform.OS === 'web' as any ? { cursor: 'pointer' } : {}
          ]}
          onPress={handleOpenDropdown}
          {...(Platform.OS === 'web' as any ? { 'data-table-button': 'true' } : {})}
        >
          <Text 
            style={styles.headerText}
            {...(Platform.OS === 'web' as any ? { 'data-cell-text': 'true' } : {})}
          >
            {columnsButtonText}
          </Text>
          <ChevronDown size={16} color={themeColors.text.primary} />
        </TouchableOpacity>
        
        {/* Renderizar o dropdown com portal */}
        {renderColumnsDropdown()}
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
                    const alignment = getHeaderAlignment(header.id);
                            
                    return (
                      <View 
                        key={header.id} 
                        style={[
                          styles.tableHeaderCell,
                          columnStyle,
                          alignment
                        ]}
                        {...(Platform.OS === 'web' as any ? { 'data-table-header': 'true' } : {})}
                      >
                        {header.isPlaceholder
                          ? null
                          : wrapWithTextAttributes(
                              flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )
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
                  <HoverableView
                    key={row.id}
                    style={{
                      ...StyleSheet.flatten([
                        styles.tableRow,
                        row.getIsSelected() && styles.tableRowSelected,
                      ]),
                    }}
                    {...(Platform.OS === 'web' as any ? { 
                      'data-table-row': 'true',
                      'data-selected-row': row.getIsSelected() ? 'true' : 'false'
                    } : {})}
                    hoverScale={hoverableRowProps.hoverScale}
                    hoverTranslateY={hoverableRowProps.hoverTranslateY}
                    animationDuration={hoverableRowProps.animationDuration}
                    disableHoverBackground={hoverableRowProps.disableHoverBackground || row.getIsSelected()}
                    hoverColor={themeColors.state.hover}
                    activeColor={themeColors.state.selected}
                    onPress={() => {
                      if (enableRowSelection && enableRowClick) {
                        row.toggleSelected(!row.getIsSelected());
                      }
                    }}
                    disabled={!enableRowClick}
                    allowHoverWhenDisabled={true}
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
                          {...(Platform.OS === 'web' as any ? { 'data-table-cell': 'true' } : {})}
                        >
                          {wrapWithTextAttributes(
                            flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext()
                            )
                          )}
                        </View>
                      );
                    })}
                  </HoverableView>
                ))
              ) : (
                <View style={styles.tableRow}>
                  <Text 
                    style={styles.noResults}
                    {...(Platform.OS === 'web' as any ? { 'data-cell-text': 'true' } : {})}
                  >
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
          <Text 
            style={styles.selectionText}
            {...(Platform.OS === 'web' as any ? { 'data-cell-text': 'true' } : {})}
          >
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
    </View>
  );
} 