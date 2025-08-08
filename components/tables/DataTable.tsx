import React, { useState, useEffect, RefObject, useRef, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Modal,
  ActivityIndicator,
  Animated,
  TextInput as RNTextInput,
  Dimensions,
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
import { Input } from '../inputs/Input';
import { Checkbox } from '../checkboxes/Checkbox';
import { Button } from '../buttons/Button';
import { ArrowUpDown, ChevronDown, MoreHorizontal, AlertCircle } from 'lucide-react-native';
import { useTheme } from '../../hooks/DesignSystemContext';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, ColorType } from '../../design-system/tokens/colors';
import { getResponsiveValues } from '../../design-system/tokens/typography';
import { HoverableView } from '../effects/HoverableView';
import { createPortal } from 'react-dom';
import { SupabaseClient } from '@supabase/supabase-js';

// Declaração para adicionar supabase ao objeto window
declare global {
  interface Window {
    supabase?: SupabaseClient;
  }
}

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
 * - Integração com Supabase (opcional)
 * - Dados de exemplo automáticos quando não há dados fornecidos
 * 
 * Exemplos de uso:
 * 
 * ```tsx
 * // Tabela básica - vai usar dados de exemplo embutidos automaticamente
 * <DataTable 
 *   columns={colunasArray}
 * />
 * 
 * // Tabela com dados personalizados
 * <DataTable 
 *   data={dadosArray} 
 *   columns={colunasArray}
 *   enableSorting
 *   enableFiltering
 *   enablePagination
 * />
 * 
 * // Tabela com integração Supabase (carrega dados automaticamente)
 * <DataTable 
 *   columns={colunasArray}
 *   supabaseConfig={{
 *     client: supabaseClient,
 *     table: 'users',
 *     select: 'id, nome, email, created_at',
 *     orderBy: {column: 'created_at', ascending: false}
 *   }}
 * />
 * 
 * // Tabela com seleção de linha ao clicar
 * <DataTable 
 *   columns={colunasArray}
 *   enableRowSelection
 *   enableRowClick
 * />
 * ```
 */

// Tipo para os dados de exemplo padrões da tabela
interface DefaultPaymentData {
  id: string;
  amount: number;
  status: "pending" | "processing" | "success" | "failed";
  email: string;
}

// Dados de exemplo estáticos para serem usados quando não há dados fornecidos
const defaultExampleData: DefaultPaymentData[] = [
  {
    id: "m5gr84i9",
    amount: 316,
    status: "success",
    email: "ken99@example.com",
  },
  {
    id: "3u1reuv4",
    amount: 242,
    status: "success",
    email: "Abe45@example.com",
  },
  {
    id: "derv1ws0",
    amount: 837,
    status: "processing",
    email: "Monserrat44@example.com",
  },
  {
    id: "5kma53ae",
    amount: 874,
    status: "success",
    email: "Silas22@example.com",
  },
  {
    id: "bhqecj4p",
    amount: 721,
    status: "failed",
    email: "carmella@example.com",
  },
];

// Configuração padrão para o Supabase usando a tabela usersAicrusAcademy
const defaultSupabaseConfig: SupabaseConfig = {
  table: 'usersAicrusAcademy',
  select: 'id, created_at, nome, email, idCustomerAsaas',
  orderBy: { column: 'created_at', ascending: false }
};

// Colunas padrão para os dados de exemplo
const createDefaultColumns = (isDark: boolean): ColumnDef<DefaultPaymentData>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ? 
          true : 
          (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Selecionar todos"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Selecionar linha"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <View>
        <Text style={{ color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'] }} className="capitalize">
          {row.getValue("status")}
        </Text>
      </View>
    ),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => (
      <View>
        <Text style={{ color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'] }} className="lowercase">
          {row.getValue("email")}
        </Text>
      </View>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <Text style={{ textAlign: 'right', width: '100%', color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'] }}>Valor</Text>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);

      return (
        <Text style={{ textAlign: 'right', width: '100%', color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'] }}>
          {formatted}
        </Text>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: () => (
      <View style={{ alignItems: 'center', justifyContent: 'center' }}>
        <TouchableOpacity style={{ padding: 4 }}>
          <MoreHorizontal size={16} color={isDark ? colors['text-primary-dark'] : colors['text-primary-light']} />
        </TouchableOpacity>
      </View>
    ),
  },
];

export interface SupabaseConfig {
  /** 
   * Cliente Supabase inicializado 
   * Exemplo: import { supabase } from '@/lib/supabase'
   */
  client?: SupabaseClient;
  
  /** 
   * Nome da tabela no Supabase 
   * Exemplo: 'users', 'products', etc.
   * Padrão: 'usersAicrusAcademy'
   */
  table?: string;
  
  /** 
   * Colunas a serem selecionadas
   * Formato SQL: '*' para todas as colunas ou 'id, nome, email' para colunas específicas 
   * Se não informado, será usado 'id, created_at, nome, email, idCustomerAsaas'
   */
  select?: string;
  
  /** 
   * Ordenação dos resultados 
   * Exemplo: { column: 'created_at', ascending: false } ordena por data de criação decrescente
   * Padrão: { column: 'created_at', ascending: false }
   */
  orderBy?: {
    column: string;
    ascending?: boolean;
  };
  
  /** 
   * Número máximo de registros a serem retornados 
   * Se não informado, retorna todos os registros
   */
  limit?: number;
  
  /** 
   * Filtros a serem aplicados (seguindo a sintaxe do Supabase)
   * Exemplo: [{ column: 'status', operator: 'eq', value: 'active' }]
   */
  filters?: Array<{
    column: string;
    operator: 'eq' | 'neq' | 'gt' | 'lt' | 'gte' | 'lte' | 'like' | 'ilike';
    value: any;
  }>;
}

export interface DataTableProps<TData> {
  /** Dados a serem exibidos na tabela */
  data?: TData[];
  /** Definição das colunas da tabela */
  columns: ColumnDef<TData, any>[];
  /** Configuração para integração com Supabase */
  supabaseConfig?: SupabaseConfig;
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
  /** Callback chamado após dados do Supabase serem carregados */
  onDataLoaded?: (data: TData[]) => void;
  /** Callback chamado quando ocorre um erro ao carregar dados do Supabase */
  onError?: (error: any) => void;
}

export function DataTable<TData>({
  data = [],
  columns,
  supabaseConfig,
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
  onDataLoaded,
  onError,
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
    bottom?: number;
    width: number;
    openDown: boolean;
  }>({ width: 200, openDown: true });
  
  // Estados para Supabase
  const [tableData, setTableData] = useState<TData[]>(data);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedColumns, setGeneratedColumns] = useState<ColumnDef<TData, any>[]>([]);
  
  // Refs
  const dropdownTriggerRef = useRef<View>(null);
  const dropdownRef = useRef<View>(null);
  const containerRef = useRef<View>(null);
  
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Responsividade
  const { isMobile, responsive } = useResponsive();
  
  // Tipografias responsivas
  const headerTypography = getResponsiveValues('body-md');
  const cellTypography = getResponsiveValues('body-md'); 
  const labelTypography = getResponsiveValues('body-sm');
  const titleTypography = getResponsiveValues('title-sm');
  
  // Estado para determinar se estamos usando dados padrão
  const [usingDefaultData, setUsingDefaultData] = useState(false);
  
  // Estado para controlar se deve fazer nova tentativa de busca
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  
  // Função para buscar dados do Supabase (usando useCallback para estabilizar a referência)
  const fetchSupabaseData = useCallback(async () => {
    if (!supabaseConfig) return false;
    
    const client = supabaseConfig.client || window.supabase;
    const table = supabaseConfig.table || 'usersAicrusAcademy';
    
    if (!client || !table) return false;
    
    try {
      setIsLoading(true);
      setError(null);
      
      let query = client
        .from(table)
        .select(supabaseConfig.select || '*');
      
      // Aplicar ordenação se configurada
      if (supabaseConfig.orderBy) {
        query = query.order(supabaseConfig.orderBy.column, { 
          ascending: supabaseConfig.orderBy.ascending !== undefined ? supabaseConfig.orderBy.ascending : false 
        });
      } else {
        query = query.order('id');
      }
      
      // Aplicar filtros se configurados
      if (supabaseConfig.filters && supabaseConfig.filters.length > 0) {
        supabaseConfig.filters.forEach(filter => {
          query = query.filter(filter.column, filter.operator, filter.value);
        });
      }
      
      // Aplicar limite se configurado
      if (supabaseConfig.limit) {
        query = query.limit(supabaseConfig.limit);
      }
      
      const { data: fetchedData, error: fetchError } = await query;
      
      setIsLoading(false);
      
      if (fetchError) {
        console.error('Erro ao buscar dados:', fetchError);
        setError(fetchError.message);
        if (onError) onError(fetchError);
        return false;
      } else if (fetchedData) {
        setTableData(fetchedData as unknown as TData[]);
        setUsingDefaultData(false);
        
        if (onDataLoaded) onDataLoaded(fetchedData as unknown as TData[]);
        return true;
      }
    } catch (err) {
      setIsLoading(false);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao buscar dados';
      console.error('Erro ao buscar dados do Supabase:', err);
      setError(errorMessage);
      if (onError) onError(err);
      return false;
    }
    
    return false;
  }, [supabaseConfig, onDataLoaded, onError]);

  // Efeito para gerenciar dados iniciais - CORRIGIDO para evitar loop infinito
  useEffect(() => {
    // Se temos dados fornecidos explicitamente, usar esses dados
    if (data && data.length > 0) {
      setTableData(data);
      setUsingDefaultData(false);
      setHasAttemptedFetch(true); // Marcar como processado
      return;
    }
    
    // Se temos configuração de Supabase, tentar buscar dados
    if (supabaseConfig && !hasAttemptedFetch) {
      setHasAttemptedFetch(true);
      fetchSupabaseData();
      return;
    }
    
    // Se não tem dados nem Supabase, usar dados de exemplo
    if (!supabaseConfig && !hasAttemptedFetch) {
      setTableData(defaultExampleData as unknown as TData[]);
      setUsingDefaultData(true);
      setHasAttemptedFetch(true);
    }
  }, [data, supabaseConfig, hasAttemptedFetch, fetchSupabaseData]);
  
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

  // Auto-gerar colunas baseado nos dados do Supabase se não fornecermos explicitamente
  const generateColumnsFromData = (): ColumnDef<TData, any>[] => {
    if (!tableData || tableData.length === 0) return [];
    
    // Vamos pegar as chaves do primeiro item para criar colunas
    const firstItem = tableData[0];
    if (!firstItem) return [];
    
    const keys = Object.keys(firstItem);
    
    // Geramos as colunas começando com a coluna de seleção
    const generatedColumns: ColumnDef<TData, any>[] = [
      {
        id: "select",
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ? 
              true : 
              (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
            }
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Selecionar todos"
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Selecionar linha"
          />
        ),
        enableSorting: false,
        enableHiding: false,
      }
    ];
    
    // Para cada chave do objeto, criar uma coluna apropriada
    keys.forEach(key => {
      // Ignorar a coluna de seleção que já adicionamos
      if (key === 'select') return;
      
      // Determinar o tipo de dado da coluna para formatação adequada
      const value = (firstItem as any)[key];
      const valueType = typeof value;
      
      // Configurar a coluna com base no tipo de dado
      const column: ColumnDef<TData, any> = {
        accessorKey: key,
        header: () => {
          // Formatar o nome do cabeçalho para ser mais amigável
          const headerText = key
            .replace(/_/g, ' ')  // substituir underscore por espaço
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
            
          return (
            <Text style={{ 
              color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
              textAlign: ['amount', 'valor', 'price', 'preco', 'total'].includes(key.toLowerCase()) ? 'right' : 'left',
              width: '100%'
            }}>
              {headerText}
            </Text>
          );
        },
        cell: ({ row }) => {
          const rawValue = row.getValue(key);
          
          // Formatação baseada no tipo de valor
          if (key.toLowerCase().includes('date') || key.toLowerCase().includes('data') || key === 'created_at') {
            // Formatar datas
            let formattedDate = '';
            try {
              const rawDate = rawValue as string | number | Date;
              const date = new Date(rawDate);
              formattedDate = new Intl.DateTimeFormat('pt-BR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(date);
            } catch (error) {
              formattedDate = String(rawValue);
            }
            
            return (
              <Text style={{ 
                color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                textAlign: 'left',
                width: '100%'
              }}>
                {formattedDate}
              </Text>
            );
          } 
          else if (['amount', 'valor', 'price', 'preco', 'total'].includes(key.toLowerCase())) {
            // Formatar valores monetários
            let formattedValue = '';
            try {
              const numericValue = parseFloat(String(rawValue));
              formattedValue = new Intl.NumberFormat('pt-BR', {
                style: 'currency',
                currency: 'BRL'
              }).format(numericValue);
            } catch (error) {
              formattedValue = String(rawValue);
            }
            
            return (
              <Text style={{ 
                color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                textAlign: 'right',
                width: '100%'
              }}>
                {formattedValue}
              </Text>
            );
          }
          else if (key === 'status') {
            // Status com capitalização
            return (
              <Text style={{ 
                color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                textTransform: 'capitalize'
              }}>
                {String(rawValue)}
              </Text>
            );
          }
          else if (key === 'email') {
            // Email em lowercase
            return (
              <Text style={{ 
                color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                textTransform: 'lowercase'
              }}>
                {String(rawValue)}
              </Text>
            );
          }
          else {
            // Formato padrão para outros tipos
            return (
              <Text style={{ color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'] }}>
                {String(rawValue)}
              </Text>
            );
          }
        }
      };
      
      generatedColumns.push(column);
    });
    
    // Adicionar coluna de ações no final
    generatedColumns.push({
      id: "actions",
      enableHiding: false,
      cell: () => (
        <View style={{ alignItems: 'center', justifyContent: 'center' }}>
          <TouchableOpacity style={{ padding: 4 }}>
            <MoreHorizontal size={16} color={isDark ? colors['text-primary-dark'] : colors['text-primary-light']} />
          </TouchableOpacity>
        </View>
      ),
    });
    
    return generatedColumns;
  };
  
  // Determinar quais colunas usar: fornecidas ou padrão para dados de exemplo
  const effectiveColumns = useMemo(() => {
    // Se colunas foram explicitamente fornecidas, usá-las
    if (columns && columns.length > 0) {
      return columns;
    }
    
    // Caso contrário, usar colunas padrão apenas para dados de exemplo
    return createDefaultColumns(isDark) as unknown as ColumnDef<TData, any>[];
  }, [columns, isDark]);
  
  // Instância da tabela
  const table = useReactTable({
    data: tableData,
    columns: effectiveColumns,
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
          bottom: window.innerHeight - rect.top + 5 + window.scrollY,
          right: window.innerWidth - rect.right - window.scrollX,
          width: 200,
          openDown: false
        });
      }

      console.log('Web dropdown position:', { 
        openDown, 
        rect, 
        viewportHeight, 
        spaceBelow 
      });
    } else if (Platform.OS !== 'web' && dropdownTriggerRef.current) {
      // Para dispositivos móveis, calcular a posição similar à abordagem do Select
      dropdownTriggerRef.current.measure((x, y, width, height, pageX, pageY) => {
        // Calcular espaço disponível
        const { height: windowHeight, width: windowWidth } = require('react-native').Dimensions.get('window');
        const dropdownHeight = 250;
        const spaceBelow = windowHeight - (pageY + height);
        
        // Determinar se abre para baixo ou para cima
        const openDown = spaceBelow >= dropdownHeight || pageY < dropdownHeight;
        
        // Calculando uma largura mínima maior para o dropdown no mobile
        // que seja suficiente para textos mais longos
        const dropdownWidth = Math.max(width || 160, 200);
        
        // Garantir que o dropdown não ultrapasse a tela
        const maxAllowedWidth = windowWidth - 20; // 10px de cada lado
        const finalWidth = Math.min(dropdownWidth, maxAllowedWidth);
        
        // Ajustar posição horizontal para evitar que o dropdown saia da tela
        let leftPosition = pageX;
        if (leftPosition + finalWidth > windowWidth - 10) {
          leftPosition = windowWidth - finalWidth - 10;
        }
        
        console.log('Mobile dropdown measure:', { 
          x, y, width, height, pageX, pageY, 
          windowHeight, 
          spaceBelow, 
          openDown,
          dropdownWidth,
          finalWidth,
          leftPosition
        });
        
        if (openDown) {
          setDropdownPosition({
            top: pageY + height + 5,
            left: leftPosition,
            width: finalWidth,
            openDown: true
          });
        } else {
          setDropdownPosition({
            bottom: windowHeight - pageY + 5,
            left: leftPosition,
            width: finalWidth,
            openDown: false
          });
        }
      });
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
            bottom: window.innerHeight - rect.top + 5 + window.scrollY,
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
          background-color: ${isDark ? colors['hover-dark'] : colors['hover-light']};
          border-radius: 3px;
        }

        /* Melhorar aparência dos checkboxes */
        [data-dropdown-content="true"] input[type="checkbox"] {
          margin-right: 8px;
          accent-color: ${isDark ? colors['primary-dark'] : colors['primary-light']};
        }

        /* Adicionar efeitos de hover para o botão do dropdown */
        [data-table-button="true"]:hover {
          border-color: ${isDark ? `${colors['primary-dark']}50` : `${colors['primary-light']}30`} !important;
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
    
    console.log('Rendering dropdown with position:', dropdownPosition);
    
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
          backgroundColor: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
          borderRadius: 6,
          borderWidth: 1,
          borderStyle: 'solid',
          borderColor: isDark ? colors['divider-dark'] : colors['divider-light'],
          padding: 4,
          boxShadow: isDark ? `0 2px 4px ${colors['active-dark']}` : `0 2px 4px ${colors['active-light']}`,
          zIndex: 2000,
          overflowY: 'auto',
        },
        header: {
          fontSize: responsive(labelTypography.fontSize),
          fontFamily: labelTypography.fontFamily,
          lineHeight: responsive(labelTypography.lineHeight),
          fontWeight: '500',
          color: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
          padding: 8,
          borderBottomWidth: 1,
          borderBottomColor: isDark ? colors['divider-dark'] : colors['divider-light'],
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
          backgroundColor: isDark ? colors['hover-dark'] : colors['hover-light'],
        },
        itemText: {
          fontSize: responsive(cellTypography.fontSize),
          fontFamily: cellTypography.fontFamily,
          lineHeight: responsive(cellTypography.lineHeight),
          marginLeft: 8,
          textTransform: 'capitalize',
          color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
        }
      });

      // Calculando o estilo adicional para quando o dropdown abre para cima
      const containerStyle = {...dropdownStyle.container as React.CSSProperties};
      if (!dropdownPosition.openDown) {
        containerStyle.top = undefined;
        containerStyle.bottom = `${dropdownPosition.bottom}px`;
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
              Alternar colunas
            </div>
            
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                const isHovered = hoveredColumns[column.id] || false;
                
                // Extrair nome de exibição do cabeçalho para mostrar no dropdown
                let displayName = column.id;
                
                // Método para extrair texto do cabeçalho
                const headerDef = column.columnDef.header;
                
                // Se for uma string direta, usar essa string
                if (typeof headerDef === 'string') {
                  displayName = headerDef;
                }
                // Se for um nó React renderizado, tentar extrair seu texto
                else if (typeof headerDef === 'function') {
                  // Não podemos acessar o texto diretamente, então verificamos se temos uma meta informação
                  if (column.columnDef.meta && 
                      typeof column.columnDef.meta === 'object' && 
                      column.columnDef.meta !== null) {
                    
                    // Verificar se há um 'headerText' definido na meta
                    const meta = column.columnDef.meta as any;
                    if (meta.headerText) {
                      displayName = meta.headerText;
                    }
                  }
                }
                
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
                    <Checkbox
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => {
                        column.toggleVisibility(!!value);
                      }}
                      aria-label={`Mostrar coluna ${displayName}`}
                    />
                    <span style={dropdownStyle.itemText as React.CSSProperties}>
                      {displayName}
                    </span>
                  </div>
                );
              })}
          </div>
        </>
      );
    };

    // Usando createPortal para renderizar diretamente no body (versão web)
    if (Platform.OS === 'web' as any && typeof document !== 'undefined') {
      return createPortal(
        <ColumnsDropdownContent />,
        document.body
      );
    }
    
    // Versão para dispositivos móveis usando Modal com posicionamento similar ao web
    return (
      <Modal
        visible={dropdownOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseDropdown}
        statusBarTranslucent={true}
      >
        <TouchableOpacity 
          style={{
            flex: 1,
            backgroundColor: 'transparent',
          }}
          activeOpacity={1}
          onPress={handleCloseDropdown}
        >
          <View 
            style={{
              position: 'absolute',
              top: dropdownPosition.openDown ? dropdownPosition.top : undefined,
              left: dropdownPosition.left,
              bottom: !dropdownPosition.openDown ? dropdownPosition.bottom : undefined,
              width: dropdownPosition.width || 230, // Ajustado para uma largura menos exagerada
              maxHeight: 250,
              backgroundColor: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
              borderRadius: 6,
              borderWidth: 1,
              borderColor: isDark ? colors['divider-dark'] : colors['divider-light'],
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: isDark ? 0.25 : 0.1,
              shadowRadius: 3,
              elevation: 5,
            }}
          >
            <Text 
              style={{
                fontSize: responsive(labelTypography.fontSize),
                fontFamily: labelTypography.fontFamily,
                lineHeight: responsive(labelTypography.lineHeight),
                fontWeight: '500',
                color: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
                padding: 8,
                borderBottomWidth: 1,
                borderBottomColor: isDark ? colors['divider-dark'] : colors['divider-light'],
              }}
            >
              Alternar colunas
            </Text>
            
            <ScrollView style={{ maxHeight: 200 }}>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => {
                  let displayName = column.id;
                  
                  // Extrair nome de exibição do cabeçalho
                  const headerDef = column.columnDef.header;
                  
                  if (typeof headerDef === 'string') {
                    displayName = headerDef;
                  } else if (typeof headerDef === 'function') {
                    if (column.columnDef.meta && 
                        typeof column.columnDef.meta === 'object' && 
                        column.columnDef.meta !== null) {
                      
                      const meta = column.columnDef.meta as any;
                      if (meta.headerText) {
                        displayName = meta.headerText;
                      }
                    }
                  }
                  
                  return (
                    <TouchableOpacity
                      key={column.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        padding: 8,
                        marginVertical: 0.5,
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
                          fontSize: responsive(cellTypography.fontSize),
                          fontFamily: cellTypography.fontFamily,
                          lineHeight: responsive(cellTypography.lineHeight),
                          color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                          textTransform: 'capitalize',
                          flex: 1,
                          flexShrink: 1,
                        }}
                        numberOfLines={1}
                        ellipsizeMode="tail"
                      >
                        {displayName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>
          </View>
        </TouchableOpacity>
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
        main: isDark ? colors['primary-dark'] : colors['primary-light'],
        light: isDark ? colors['primary-dark-hover'] : colors['primary-light-hover'],
        dark: isDark ? colors['primary-dark-active'] : colors['primary-light-active'],
        contrastText: '#FFFFFF',
      },
      // Cores de feedback - adicionei valores diretos já que nomes específicos não existem no theme.ts
      error: isDark ? colors['error-icon-dark'] : colors['error-icon-light'],
      warning: isDark ? colors['warning-icon-dark'] : colors['warning-icon-light'],
      success: isDark ? colors['success-icon-dark'] : colors['success-icon-light'],
      info: isDark ? colors['info-icon-dark'] : colors['info-icon-light'],
      // Cores de background
      background: {
        default: isDark ? colors['bg-primary-dark'] : colors['bg-primary-light'],
        paper: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
        alt: isDark ? colors['bg-tertiary-dark'] : colors['bg-tertiary-light'],
        elevated: isDark ? colors['alternate-dark'] : colors['alternate-light'],
      },
      // Cores de texto
      text: {
        primary: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
        secondary: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
        disabled: isDark ? colors['text-tertiary-dark'] : colors['text-tertiary-light'],
        hint: isDark ? colors['text-tertiary-dark'] : colors['text-tertiary-light'],
      },
      // Cores de borda
      border: {
        light: isDark ? colors['divider-dark'] : colors['divider-light'],
        main: isDark ? colors['divider-dark'] : colors['divider-light'],
        dark: isDark ? colors['divider-dark'] : colors['divider-light'],
      },
      // Estados da interface
      state: {
        hover: isDark ? colors['hover-dark'] : colors['hover-light'],
        selected: isDark ? `${colors['primary-dark']}15` : `${colors['primary-light']}15`,
        disabled: isDark ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.12)',
        focus: isDark ? `${colors['primary-dark']}30` : `${colors['primary-light']}30`,
      },
      // Cores de divisor
      divider: isDark ? colors['divider-dark'] : colors['divider-light'],
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
      fontSize: responsive(labelTypography.fontSize),
      fontFamily: labelTypography.fontFamily,
      lineHeight: responsive(labelTypography.lineHeight),
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
      fontSize: responsive(cellTypography.fontSize),
      fontFamily: cellTypography.fontFamily,
      lineHeight: responsive(cellTypography.lineHeight),
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
      fontSize: responsive(headerTypography.fontSize),
      fontFamily: headerTypography.fontFamily,
      lineHeight: responsive(headerTypography.lineHeight),
      fontWeight: '500',
      color: themeColors.text.primary,
    },
    cellText: {
      fontSize: responsive(cellTypography.fontSize),
      fontFamily: cellTypography.fontFamily,
      lineHeight: responsive(cellTypography.lineHeight),
      color: themeColors.text.primary,
    },
    noResults: {
      padding: 24,
      textAlign: 'center',
      fontSize: responsive(cellTypography.fontSize),
      fontFamily: cellTypography.fontFamily,
      lineHeight: responsive(cellTypography.lineHeight),
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
          accent-color: ${isDark ? colors['primary-dark'] : colors['primary-light']};
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
  
  // Modificando o botão "Tentar novamente" para reiniciar o processo de busca
  const handleRetryFetch = () => {
    setError(null);
    setHasAttemptedFetch(false);
    fetchSupabaseData();
  };
  
  // Renderizar estado de erro para Supabase
  const renderErrorState = () => {
    if (!error) return null;
    
    // Determinar o tipo de erro para exibir mensagem apropriada
    let errorMessage = error;
    let errorTitle = "Erro ao carregar dados";
    
    if (error.includes("relation") && (error.includes("does not exist") || error.includes("não existe"))) {
      errorTitle = "Tabela não encontrada";
      errorMessage = `A tabela '${supabaseConfig?.table || 'usersAicrusAcademy'}' não foi encontrada no seu projeto Supabase. Verifique se ela existe ou se o nome está correto.`;
    } else if (error.includes("authentication") || error.includes("auth")) {
      errorTitle = "Erro de autenticação";
      errorMessage = "Não foi possível autenticar com o Supabase. Verifique se as credenciais estão corretas.";
    } else if (error.includes("network") || error.includes("connection")) {
      errorTitle = "Erro de conexão";
      errorMessage = "Não foi possível conectar ao servidor Supabase. Verifique sua conexão com a internet.";
    } else if (error.includes("permission") || error.includes("permissão")) {
      errorTitle = "Erro de permissão";
      errorMessage = "Você não tem permissão para acessar esta tabela. Verifique suas permissões no Supabase.";
    } else if (error.includes("timeout") || error.includes("timed out")) {
      errorTitle = "Tempo esgotado";
      errorMessage = "A conexão com o Supabase atingiu o tempo limite. Tente novamente mais tarde.";
    }
    
    return (
      <View style={{
        padding: 24, 
        alignItems: 'center', 
        backgroundColor: isDark ? colors['bg-tertiary-dark'] : colors['bg-tertiary-light'], 
        borderRadius: 8
      }}>
        <View style={{
          width: 64, 
          height: 64, 
          borderRadius: 32, 
          backgroundColor: isDark ? colors['error-bg-dark'] : colors['error-bg-light'], 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginBottom: 12,
        }}>
          <AlertCircle size={24} color={isDark ? colors['error-icon-dark'] : colors['error-icon-light']} />
        </View>
        <Text style={{
          fontSize: responsive(titleTypography.fontSize), 
          fontFamily: titleTypography.fontFamily,
          lineHeight: responsive(titleTypography.lineHeight),
          fontWeight: '700', 
          textAlign: 'center', 
          marginBottom: 8, 
          color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
        }}>
          {errorTitle}
        </Text>
        <Text style={{
          textAlign: 'center', 
          color: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
          marginBottom: 16,
        }}>
          {errorMessage}
        </Text>
        <Button
          variant="primary"
          onPress={handleRetryFetch}
          size="md"
        >
          Tentar novamente
        </Button>
      </View>
    );
  };
  
  // Renderizar estado de carregamento para Supabase
  const renderLoadingState = () => {
    if (!isLoading) return null;
    
    return (
      <View style={{
        padding: 24, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: isDark ? colors['bg-tertiary-dark'] : colors['bg-tertiary-light'], 
        borderRadius: 8,
      }}>
        <View style={{
          width: 32, 
          height: 32, 
          borderWidth: 2, 
          borderColor: isDark ? colors['primary-dark'] : colors['primary-light'], 
          borderTopColor: 'transparent', 
          borderRadius: 16,
          marginBottom: 8,
          transform: [{ rotate: '45deg' }],
        }} />
        <Text style={{
          textAlign: 'center',
          fontSize: responsive(cellTypography.fontSize),
          fontFamily: cellTypography.fontFamily,
          lineHeight: responsive(cellTypography.lineHeight),
          color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
        }}>
          Carregando dados do Supabase...
        </Text>
      </View>
    );
  };
  
  // Renderizar estado de dados vazios
  const renderEmptyState = () => {
    return (
      <View style={{
        padding: 24, 
        alignItems: 'center', 
        backgroundColor: isDark ? colors['bg-tertiary-dark'] : colors['bg-tertiary-light'], 
        borderRadius: 8
      }}>
        <Text style={{
          fontSize: responsive(titleTypography.fontSize), 
          fontFamily: titleTypography.fontFamily,
          lineHeight: responsive(titleTypography.lineHeight),
          fontWeight: '600', 
          textAlign: 'center', 
          marginBottom: 8, 
          color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
        }}>
          Nenhum dado encontrado
        </Text>
        <Text style={{
          textAlign: 'center', 
          color: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
        }}>
          A tabela '{supabaseConfig?.table || "usersAicrusAcademy"}' existe, mas não possui registros.
        </Text>
      </View>
    );
  };
  
  // Renderizar tabela principal
  const renderTableContent = () => {
    // Se estivermos usando Supabase e estiver carregando, mostrar estado de carregamento
    if (supabaseConfig && isLoading) {
      return renderLoadingState();
    }
    
    // Se estivermos usando Supabase e houver um erro, mostrar estado de erro
    if (supabaseConfig && error) {
      return renderErrorState();
    }

    // Se estivermos usando Supabase e não houver dados, mostrar estado vazio
    if (supabaseConfig && tableData.length === 0 && !usingDefaultData) {
      return renderEmptyState();
    }

    // Renderizar tabela normal
    return (
      <>
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
      </>
    );
  };
  
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
      
      {/* Tabela ou estados de carregamento/erro */}
      {renderTableContent()}
    </View>
  );
} 