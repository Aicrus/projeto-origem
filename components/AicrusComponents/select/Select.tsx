import React, { useEffect, useRef, useState, useMemo } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Text, View, Modal, Pressable, ScrollView, TextInput } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ChevronUp, ChevronDown, Check, Search, X } from 'lucide-react-native';
import { useTheme } from '../../../hooks/DesignSystemContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { createPortal } from 'react-dom';
import { supabase } from '../../../lib/supabase';
import { colors } from '../../../designer-system/tokens/colors';
import { spacing } from '../../../designer-system/tokens/spacing';
import { borderRadius, getBorderRadius } from '../../../designer-system/tokens/borders';
import { fontSize, fontFamily } from '../../../designer-system/tokens/typography';

/**
 * @component Select
 * @description Componente de seleção dropdown altamente personalizável que suporta:
 * - Seleção única ou múltipla de itens
 * - Tema claro/escuro automático
 * - Responsividade em todas as plataformas (iOS, Android, Web)
 * - Posicionamento inteligente (abre para cima ou para baixo conforme espaço disponível)
 * - Estados: desabilitado, carregando, erro
 * 
 * Cada aspecto visual e comportamental pode ser personalizado através das props:
 * - Label acima do select (opcional)
 * - Placeholder quando nenhum item está selecionado
 * - Limitação de itens mínimos/máximos na seleção múltipla
 * - Altura máxima da lista dropdown
 * - Comportamento ao abrir/fechar
 * 
 * O componente utiliza Portal/Modal para garantir que as opções sejam renderizadas
 * acima de outros elementos na tela, independente da estrutura de componentes.
 */

export interface DropdownOption {
  value: string;
  label: string;
}

interface BaseDropdownProps {
  options?: DropdownOption[];
  placeholder?: string;
  zIndex?: number;
  zIndexInverse?: number;
  maxHeight?: number;
  label?: string;
  disabled?: boolean;
  loading?: boolean;
  searchable?: boolean;
  min?: number;
  max?: number;
  onOpen?: () => void;
  onClose?: () => void;
  /** Controla se o campo de pesquisa deve receber foco automaticamente quando aberto */
  autoFocus?: boolean;
  /** Indica se o select está dentro de uma tabela Supabase */
  superBaseTable?: boolean;
  /** Nome da tabela no Supabase para buscar os dados */
  supabaseTable?: string;
  /** Nome da coluna que será usada como valor no Supabase */
  supabaseColumn?: string;
  /** Nome da coluna para ordenação no Supabase */
  supabaseOrderBy?: string;
  /** Define se a ordenação é ascendente */
  supabaseAscending?: boolean;
}

interface SingleSelectProps extends BaseDropdownProps {
  value: string;
  setValue: (value: string) => void;
  multiple?: false;
}

interface MultiSelectProps extends BaseDropdownProps {
  value: string[];
  setValue: (value: string[]) => void;
  multiple: true;
}

type SelectProps = SingleSelectProps | MultiSelectProps;

// Função para obter as cores do theme.ts em vez de tailwind.config.js
const getThemeColors = (isDark: boolean) => {
  return {
    'primary': isDark ? colors['primary-dark'] : colors['primary-light'],
    'primary-hover': isDark ? colors['primary-dark-hover'] : colors['primary-light-hover'],
    'primary-active': isDark ? colors['primary-dark-active'] : colors['primary-light-active'],
    'bg-secondary': isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
    'divider': isDark ? colors['divider-dark'] : colors['divider-light'],
    'text-primary': isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
    'text-secondary': isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
    'text-tertiary': isDark ? colors['text-tertiary-dark'] : colors['text-tertiary-light'],
    'hover': isDark ? colors['hover-dark'] : colors['hover-light'],
    'active': isDark ? colors['active-dark'] : colors['active-light'],
    'primary-main': isDark ? colors['primary-dark'] : colors['primary-light'],
  };
};

// Componente para renderizar um item da lista de opções
const OptionItem = ({ item, selected, onSelect, isDark }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  const themeColors = getThemeColors(isDark);
  
  const handleHoverIn = () => {
    if (Platform.OS === 'web') {
      setIsHovered(true);
    }
  };
  
  const handleHoverOut = () => {
    if (Platform.OS === 'web') {
      setIsHovered(false);
    }
  };
  
  // Estilos compartilhados para web e nativo
  const styles = StyleSheet.create({
    itemContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderBottomWidth: 1,
      borderBottomColor: themeColors['divider'],
      backgroundColor: selected 
        ? (isDark ? `${themeColors['primary']}08` : `${themeColors['primary']}05`)
        : (isHovered && !selected && Platform.OS === 'web' 
            ? (isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)') 
            : 'transparent')
    },
    itemText: {
      fontSize: 14,
      color: selected 
        ? themeColors['primary']
        : themeColors['text-primary'],
      fontWeight: selected ? '500' : 'normal'
    }
  });
  
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => onSelect(item)}
      // @ts-ignore - Eventos de hover exclusivos para web
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      <Text style={styles.itemText}>
        {item.label}
      </Text>
      {selected && (
        <Check size={16} color={themeColors['primary']} strokeWidth={2} />
      )}
    </TouchableOpacity>
  );
};

// Para Web: Renderiza uma lista de opções com posicionamento absoluto
const WebDropdownOptions = ({ 
  visible, 
  options, 
  value, 
  onSelect, 
  onClose, 
  multiple, 
  isDark,
  position,
  maxHeight,
  searchable,
  autoFocus = false,
  superBaseTable,
}: any) => {
  // Ref para a lista de opções
  const optionsRef = useRef<any>(null);
  
  // Ref para armazenar a posição de scroll
  const scrollPositionRef = useRef(0);
  
  // Estado para controlar a pesquisa
  const [searchValue, setSearchValue] = useState('');
  
  // Obter cores do theme.ts
  const themeColors = getThemeColors(isDark);
  
  // Função para normalizar texto (remover acentos)
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '');
  };
  
  // Filtrar opções baseado na pesquisa - versão melhorada
  const filteredOptions = searchable && searchValue
    ? options.filter((option: DropdownOption) => {
        const normalizedLabel = normalizeText(option.label);
        const normalizedSearch = normalizeText(searchValue);
        return normalizedLabel.includes(normalizedSearch);
      })
    : options;
  
  // Reset da pesquisa quando fechar
  useEffect(() => {
    if (!visible) {
      setSearchValue('');
    }
  }, [visible]);
  
  // Adicionar estilos para remover outline de foco no campo de busca
  useEffect(() => {
    if (Platform.OS === 'web' && searchable && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        input[data-search-input="true"] {
          outline: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        input[data-search-input="true"]:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        input[data-search-input="true"]:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        
        input[data-search-input="true"]::-webkit-search-decoration,
        input[data-search-input="true"]::-webkit-search-cancel-button,
        input[data-search-input="true"]::-webkit-search-results-button,
        input[data-search-input="true"]::-webkit-search-results-decoration {
          -webkit-appearance: none !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [searchable]);
  
  // Salvar posição de scroll quando o componente estiver montado
  useEffect(() => {
    if (visible && optionsRef.current) {
      // Recuperar scroll position anterior quando o dropdown abre
      if (scrollPositionRef.current > 0) {
        setTimeout(() => {
          if (optionsRef.current) {
            optionsRef.current.scrollTop = scrollPositionRef.current;
          }
        }, 0);
      }
      
      // Salvar scroll position continuamente
      const saveScrollPosition = () => {
        if (optionsRef.current) {
          scrollPositionRef.current = optionsRef.current.scrollTop;
        }
      };
      
      // Adicionar event listener para salvar a posição do scroll
      if (optionsRef.current) {
        optionsRef.current.addEventListener('scroll', saveScrollPosition);
      }
      
      return () => {
        if (optionsRef.current) {
          optionsRef.current.removeEventListener('scroll', saveScrollPosition);
        }
      };
    }
  }, [visible, filteredOptions]);
  
  // Detectar clique fora para fechar
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleClickOutside = (event: MouseEvent) => {
        if (optionsRef.current && !optionsRef.current.contains(event.target as Node)) {
          onClose();
        }
      };
      
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [onClose]);
  
  // Se não estiver visível, não renderiza
  if (!visible) return null;
  
  // Lidar com seleção de item
  const handleItemSelect = (item: DropdownOption) => {
    // Guardar posição de scroll atual
    if (optionsRef.current) {
      scrollPositionRef.current = optionsRef.current.scrollTop;
    }
    
    if (multiple) {
      // Lógica para seleção múltipla
      const isSelected = (value as string[]).includes(item.value);
      let newValue;
      
      if (isSelected) {
        newValue = (value as string[]).filter(v => v !== item.value);
      } else {
        newValue = [...(value as string[]), item.value];
      }
      
      onSelect(newValue);
      
      // Restaurar posição de scroll após atualização do estado
      setTimeout(() => {
        if (optionsRef.current) {
          optionsRef.current.scrollTop = scrollPositionRef.current;
        }
      }, 0);
    } else {
      // Lógica para seleção única
      onSelect(item.value);
      onClose(); // Fechar automaticamente após seleção única
    }
  };
  
  // Permitir scroll dentro do dropdown
  const handleOptionsWheel = (e: React.WheelEvent) => {
    // Permitir o scroll dentro das opções
    e.stopPropagation();
  };
  
  // Função para determinar o estilo de posição
  const getPositionStyle = () => {
    // Se não temos posição, retornar estilo padrão
    if (!position) {
      return {
        position: 'fixed' as 'fixed',
        top: 0,
        left: 0,
        width: 200,
        maxHeight: maxHeight || 300,
        zIndex: 2147483647,
        overflowY: 'auto' as 'auto',
      };
    }
    
    // Por padrão, abre para baixo (openDown = true ou undefined)
    // Ou se estiver em uma tabela Supabase
    if (position.openDown !== false || superBaseTable) {
      return {
        position: 'fixed' as 'fixed',
        top: position.top || 0,
        left: position.left || 0,
        width: position.width || 200,
        maxHeight: maxHeight || 300,
        zIndex: 2147483647,
        overflowY: 'auto' as 'auto',
      };
    } 
    // Abre para cima quando openDown é explicitamente false e não é tabela
    else {
      return {
        position: 'fixed' as 'fixed',
        bottom: window.innerHeight - position.top,
        left: position.left || 0,
        width: position.width || 200,
        maxHeight: maxHeight || 300,
        zIndex: 2147483647,
        overflowY: 'auto' as 'auto',
      };
    }
  };
  
  // Posicionamento web
  const positionStyle = getPositionStyle();
  
  console.log("Renderizando WebDropdownOptions com posição:", position, "estilo:", positionStyle);
  
  // Lidar com alteração na pesquisa
  const handleSearchChange = (text: string) => {
    setSearchValue(text);
    
    // Reset da posição de scroll ao pesquisar
    if (optionsRef.current) {
      optionsRef.current.scrollTop = 0;
    }
  };
  
  // Limpar campo de pesquisa
  const handleClearSearch = () => {
    setSearchValue('');
    
    // Focus no input de pesquisa após limpar
    const searchInput = document.querySelector('[data-search-input="true"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.focus();
    }
  };
  
  // Estilos do dropdown
  const dropdownStyle = StyleSheet.create({
    container: {
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderColor: isDark ? '#262D34' : '#E0E3E7',
      borderWidth: 1,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.08,
      shadowRadius: 6,
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#262D34' : '#E0E3E7',
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    searchInput: Platform.select({
      web: {
        flex: 1,
        color: isDark ? '#FFFFFF' : '#14181B',
        fontSize: 14,
        paddingVertical: 4,
        height: 30,
        marginLeft: 4,
        backgroundColor: 'transparent',
      },
      default: {
        flex: 1,
        color: isDark ? '#FFFFFF' : '#14181B',
        fontSize: 14,
        paddingVertical: 4,
        height: 30,
        marginLeft: 4,
      }
    }),
    searchIcon: {
      marginRight: 4,
    },
    clearButton: {
      padding: 4,
    }
  });
  
  // Componente interno que será renderizado no portal
  const DropdownContent = () => (
    <>
      {/* Overlay transparente para capturar eventos e prevenir scroll */}
      <Pressable 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 2147483646,
          backgroundColor: 'transparent',
        }}
        onPress={onClose}
      />
      <View
        ref={optionsRef}
        style={[
          positionStyle,
          dropdownStyle.container
        ]}
        // @ts-ignore - Permitir eventos de wheel para scroll
        onWheel={handleOptionsWheel}
        // @ts-ignore - Adicionar classe e atributo para detectar se o scroll está dentro do dropdown
        className="dropdown-options"
        data-dropdown-content="true"
      >
        {/* Campo de pesquisa */}
        {searchable && (
          <View style={dropdownStyle.searchContainer}>
            <Search 
              size={14} 
              color={isDark ? '#95A1AC' : '#57636C'} 
              style={dropdownStyle.searchIcon}
            />
            <TextInput
              style={dropdownStyle.searchInput}
              value={searchValue}
              onChangeText={handleSearchChange}
              placeholder="Pesquisar..."
              placeholderTextColor={isDark ? '#95A1AC' : '#8B97A2'}
              data-search-input="true"
              autoFocus={autoFocus}
              // @ts-ignore - Evento específico para web
              onFocus={(e: React.FocusEvent<HTMLInputElement>) => {
                if (Platform.OS === 'web') {
                  const input = e.target as HTMLInputElement;
                  input.style.outline = 'none';
                  input.style.boxShadow = 'none';
                }
              }}
            />
            {searchValue.length > 0 && (
              <TouchableOpacity 
                onPress={handleClearSearch}
                style={dropdownStyle.clearButton}
              >
                <X 
                  size={14} 
                  color={isDark ? '#95A1AC' : '#57636C'} 
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Lista de opções */}
        {filteredOptions.length > 0 ? (
          filteredOptions.map((item: DropdownOption) => {
            const isSelected = multiple 
              ? (value as string[]).includes(item.value)
              : value === item.value;
            
            return (
              <OptionItem
                key={item.value}
                item={item}
                selected={isSelected}
                onSelect={handleItemSelect}
                isDark={isDark}
              />
            );
          })
        ) : (
          <View style={{ padding: 12, alignItems: 'center' }}>
            <Text style={{ color: isDark ? '#95A1AC' : '#57636C' }}>
              Nenhum resultado encontrado
            </Text>
          </View>
        )}
      </View>
    </>
  );

  // Usando createPortal para renderizar diretamente no body
  if (Platform.OS === 'web' && typeof document !== 'undefined') {
    return createPortal(
      <DropdownContent />,
      document.body
    );
  }
  
  // Fallback para plataformas não web
  return <DropdownContent />;
};

// Componente customizado para Mobile que usa Modal real
const MobileSelectModal = ({ 
  visible, 
  options, 
  value, 
  onSelect, 
  onClose, 
  multiple, 
  isDark,
  maxHeight,
  position,
  openDown,
  searchable,
  autoFocus = false,
  superBaseTable,
}: any) => {
  // Estado para controlar a pesquisa
  const [searchValue, setSearchValue] = useState('');
  
  // Função para normalizar texto (remover acentos)
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '');
  };
  
  // Filtrar opções baseado na pesquisa - versão melhorada
  const filteredOptions = searchable && searchValue
    ? options.filter((option: DropdownOption) => {
        const normalizedLabel = normalizeText(option.label);
        const normalizedSearch = normalizeText(searchValue);
        return normalizedLabel.includes(normalizedSearch);
      })
    : options;
  
  // Ref para a ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Ref para a posição de scroll
  const scrollPositionRef = useRef(0);
  
  // Reset da pesquisa quando fechar
  useEffect(() => {
    if (!visible) {
      setSearchValue('');
    }
  }, [visible]);
  
  // Adicionar estilos para remover outline de foco no campo de busca
  useEffect(() => {
    if (Platform.OS === 'web' && searchable && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        /* Remover outline azul padrão nos inputs de busca do Select */
        [data-search-input-mobile="true"]:focus {
          outline: none !important;
          outline-width: 0 !important;
          box-shadow: none !important;
          -moz-box-shadow: none !important;
          -webkit-box-shadow: none !important;
        }
        
        /* Remover cor de seleção padrão (azul) */
        [data-search-input-mobile="true"]::selection {
          background-color: rgba(128, 128, 128, 0.2) !important;
          color: inherit !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [searchable, visible]);
  
  // Lidar com alteração na pesquisa
  const handleSearchChange = (text: string) => {
    setSearchValue(text);
    
    // Reset do scroll para o topo quando pesquisar
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
      scrollPositionRef.current = 0;
    }
  };
  
  // Funções para salvar e restaurar a posição de scroll
  const handleScroll = (event: any) => {
    scrollPositionRef.current = event.nativeEvent.contentOffset.y;
  };
  
  // Restaurar a posição de scroll quando o dropdown abrir novamente
  useEffect(() => {
    if (visible && scrollViewRef.current && scrollPositionRef.current > 0) {
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: scrollPositionRef.current, animated: false });
        }
      }, 100);
    }
  }, [visible]);
  
  // Limpar campo de pesquisa
  const handleClearSearch = () => {
    setSearchValue('');
  };
  
  // Lidar com seleção de item
  const handleItemSelect = (item: DropdownOption) => {
    if (multiple) {
      // Lógica para seleção múltipla
      const isSelected = (value as string[]).includes(item.value);
      let newValue;
      
      if (isSelected) {
        newValue = (value as string[]).filter(v => v !== item.value);
      } else {
        newValue = [...(value as string[]), item.value];
      }
      
      onSelect(newValue);
      
      // Usando setTimeout para garantir que o scroll seja mantido após a renderização
      setTimeout(() => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollTo({ y: scrollPositionRef.current, animated: false });
        }
      }, 0);
    } else {
      // Lógica para seleção única
      onSelect(item.value);
      onClose(); // Fechar automaticamente após seleção única
    }
  };
  
  // Garantir que o toque seja tratado corretamente
  const handlePressOutside = () => {
    // Pequeno timeout para evitar conflitos de eventos
    setTimeout(() => {
      onClose();
    }, 50);
  };
  
  console.log("Renderizando MobileSelectModal com posição:", position, "openDown:", openDown);
  
  // Estilos do dropdown
  const dropdownStyle = StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'transparent',
    },
    container: {
      position: 'absolute',
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderColor: isDark ? '#262D34' : '#E0E3E7',
      maxHeight: maxHeight || 300,
      width: position?.width || '90%',
      marginHorizontal: 16,
      left: position?.left - 16 || 0,
      // Define a posição vertical com base na direção
      ...(openDown 
        ? { top: position?.top || 100 } // Abre para baixo
        : { bottom: position?.bottom || 100 }), // Abre para cima
      borderWidth: 1,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.08,
      shadowRadius: 6,
      elevation: 5,
    },
    optionsContainer: {
      maxHeight: maxHeight || 300,
      overflow: 'scroll',
    },
    searchContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: isDark ? '#262D34' : '#E0E3E7',
      paddingHorizontal: 8,
      paddingVertical: 6,
    },
    searchInput: {
      flex: 1,
      color: isDark ? '#FFFFFF' : '#14181B',
      fontSize: 14,
      paddingVertical: 4,
      height: 30, // Mais compacto que o Input padrão
      marginLeft: 4,
    },
    searchIcon: {
      marginRight: 4,
    },
    clearButton: {
      padding: 4,
    },
    noResultsContainer: {
      padding: 12,
      alignItems: 'center'
    },
    noResultsText: {
      color: isDark ? '#95A1AC' : '#57636C',
      fontSize: 14
    }
  });
  
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Pressable 
        style={dropdownStyle.overlay}
        onPress={handlePressOutside}
      >
        <View 
          style={dropdownStyle.container}
        >
          {/* Campo de pesquisa */}
          {searchable && (
            <View style={dropdownStyle.searchContainer}>
              <Search 
                size={14} 
                color={isDark ? '#95A1AC' : '#57636C'} 
                style={dropdownStyle.searchIcon}
              />
              <TextInput
                style={[
                  dropdownStyle.searchInput,
                  Platform.OS === 'web' && {
                    // @ts-ignore - Estilos específicos para web que mantêm o input sem contorno
                    WebkitAppearance: 'none'
                  }
                ]}
                value={searchValue}
                onChangeText={handleSearchChange}
                placeholder="Pesquisar..."
                placeholderTextColor={isDark ? '#95A1AC' : '#8B97A2'}
                data-search-input-mobile="true"
                autoFocus={autoFocus}
              />
              {searchValue.length > 0 && (
                <TouchableOpacity 
                  onPress={handleClearSearch}
                  style={dropdownStyle.clearButton}
                >
                  <X 
                    size={14} 
                    color={isDark ? '#95A1AC' : '#57636C'} 
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
          
          {/* Lista de opções */}
          <ScrollView 
            ref={scrollViewRef}
            nestedScrollEnabled={true}
            contentContainerStyle={{ flexGrow: 0 }}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((item: DropdownOption) => {
                const isSelected = multiple 
                  ? (value as string[]).includes(item.value)
                  : value === item.value;
                
                return (
                  <OptionItem
                    key={item.value}
                    item={item}
                    selected={isSelected}
                    onSelect={handleItemSelect}
                    isDark={isDark}
                  />
                );
              })
            ) : (
              <View style={dropdownStyle.noResultsContainer}>
                <Text style={dropdownStyle.noResultsText}>
                  Nenhum resultado encontrado
                </Text>
              </View>
            )}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export const Select = ({
  options = [],
  value,
  setValue,
  placeholder = 'Selecione uma opção',
  zIndex = 9999,
  zIndexInverse = 9999,
  maxHeight = 200,
  label,
  disabled = false,
  loading = false,
  searchable = false,
  multiple = false,
  min,
  max,
  onOpen,
  onClose,
  autoFocus = Platform.OS === 'web',
  superBaseTable = false,
  supabaseTable,
  supabaseColumn,
  supabaseOrderBy,
  supabaseAscending = true,
}: SelectProps) => {
  const { isMobile } = useResponsive();
  const [isOpen, setIsOpen] = useState(false);
  const [internalOptions, setInternalOptions] = useState<DropdownOption[]>(options);
  
  // Estados para dados do Supabase
  const [supabaseOptions, setSupabaseOptions] = useState<DropdownOption[]>([]);
  const [isLoadingSupabase, setIsLoadingSupabase] = useState(false);
  const [supabaseError, setSupabaseError] = useState<string | null>(null);
  
  // Ref para calcular a posição do dropdown
  const selectRef = useRef<any>(null);
  
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Obter cores do theme.ts
  const themeColors = getThemeColors(isDark);
  
  // Estado para controlar abertura do dropdown
  const [open, setOpen] = useState(false);
  
  // Posicionamento para o dropdown web
  const [position, setPosition] = useState<{
    top?: number;
    left: number;
    width: number;
    bottom?: number;
    openDown?: boolean;
  }>({ top: 0, left: 0, width: 0 });
  
  // Verificar se estamos usando Supabase
  const isUsingSupabase = !!supabaseTable && !!supabaseColumn;
  
  // Função para buscar dados do Supabase
  const fetchSupabaseOptions = async () => {
    // Verifica se tem dados suficientes para fazer a consulta
    if (!supabaseTable || !supabaseColumn) {
      return;
    }
    
    try {
      // Valores de fallback para as props opcionais
      const orderByColumn = supabaseOrderBy || supabaseColumn;
      const ascending = supabaseAscending !== undefined ? supabaseAscending : true;
      
      // Indicador de carregamento - usar diretamente setIsLoading
      setIsLoadingSupabase(true);
      
      const { data, error } = await supabase
        .from(supabaseTable)
        .select(`${supabaseColumn}, id`)
        .order(orderByColumn, { ascending });
      
      if (error) {
        console.error('Erro do Supabase:', error);
        return;
      }
      
      if (data && data.length > 0) {
        // Mapear os dados para o formato de opções do dropdown
        const newOptions = data.map((item: any) => ({
          label: item[supabaseColumn],
          value: String(item.id),
        }));
        
        setInternalOptions(newOptions);
      } else {
        setInternalOptions([]);
      }
    } catch (err: any) {
      console.error('Erro ao buscar dados do Supabase:', err);
    } finally {
      setIsLoadingSupabase(false);
      // Atualizamos o estado de loading diretamente ao final da operação
      setIsLoading(loading);
    }
  };
  
  // Carregar dados do Supabase quando o componente montar
  useEffect(() => {
    if (isUsingSupabase) {
      fetchSupabaseOptions();
    }
  }, [supabaseTable, supabaseColumn, supabaseOrderBy, supabaseAscending]);
  
  // Opções efetivas (do Supabase ou passadas diretamente)
  const effectiveOptions = useMemo(() => {
    return isUsingSupabase ? supabaseOptions : options;
  }, [isUsingSupabase, supabaseOptions, options]);
  
  // Estado de carregamento efetivo
  const [isLoading, setIsLoading] = useState(loading);
  useEffect(() => {
    setIsLoading(loading || (isUsingSupabase && isLoadingSupabase));
  }, [loading, isUsingSupabase, isLoadingSupabase]);
  
  // Otimizar recálculo de posição para evitar tremedeira
  useEffect(() => {
    if (Platform.OS === 'web' && open && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Se estiver em uma tabela, força sempre abrir para baixo
      // Caso contrário, verifica se há espaço disponível abaixo
      const openDown = superBaseTable || rect.bottom + maxHeight <= viewportHeight || rect.top < maxHeight;
      
      // Espaçamento consistente
      const spacingUp = 3;
      const spacingDown = 3;
      
      // Usar requestAnimationFrame para suavizar a atualização
      requestAnimationFrame(() => {
        if (openDown) {
          setPosition({
            top: rect.bottom + spacingDown + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            openDown: true
          });
        } else {
          setPosition({
            top: rect.top - spacingUp + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width,
            openDown: false
          });
        }
      });
    }
  }, [open, maxHeight]); // Removido options da dependência para evitar recálculos desnecessários
  
  // Adicionar estilos para remover outline de foco no campo de busca
  useEffect(() => {
    if (Platform.OS === 'web' && searchable && typeof document !== 'undefined') {
      const style = document.createElement('style');
      style.textContent = `
        input[data-search-input="true"] {
          outline: none !important;
          -webkit-appearance: none !important;
          -moz-appearance: none !important;
          appearance: none !important;
        }
        
        input[data-search-input="true"]:focus {
          outline: none !important;
          box-shadow: none !important;
        }
        
        input[data-search-input="true"]:focus-visible {
          outline: none !important;
          box-shadow: none !important;
        }
        
        input[data-search-input="true"]::-webkit-search-decoration,
        input[data-search-input="true"]::-webkit-search-cancel-button,
        input[data-search-input="true"]::-webkit-search-results-button,
        input[data-search-input="true"]::-webkit-search-results-decoration {
          -webkit-appearance: none !important;
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [searchable]);
  
  // Bloquear scroll da página quando dropdown está aberto (web)
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      const originalStyle = {
        overflow: document.body.style.overflow,
        position: document.body.style.position,
        top: document.body.style.top,
        width: document.body.style.width,
        height: document.body.style.height,
        paddingRight: document.body.style.paddingRight
      };
      
      const scrollY = window.scrollY;
      
      if (open) {
        // Salvar a posição atual de scroll
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollY}px`;
        document.body.style.width = '100%';
        document.body.style.height = '100%';
        document.body.style.overflow = 'hidden';
        
        // Prevenir o salto causado pelo scrollbar desaparecendo
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        if (scrollbarWidth > 0) {
          document.body.style.paddingRight = `${scrollbarWidth}px`;
        }
        
        // Prevenir eventos de roda do mouse na página, mas não dentro do dropdown
        const wheelHandler = (e: Event) => {
          // Verificar se o evento veio do dropdown ou de seus filhos
          let targetElement = e.target as Element;
          let isInsideDropdown = false;
          
          // Verifica se o evento aconteceu dentro do dropdown
          while (targetElement && targetElement !== document.body) {
            if (targetElement.classList && (
              targetElement.classList.contains('dropdown-options') || 
              targetElement.hasAttribute('data-dropdown-content')
            )) {
              isInsideDropdown = true;
              break;
            }
            
            const parentNode = targetElement.parentNode as Element;
            if (parentNode) {
              targetElement = parentNode;
            } else {
              break;
            }
          }
          
          // Se não estiver dentro do dropdown, previne o scroll
          if (!isInsideDropdown) {
            e.preventDefault();
          }
        };
        
        window.addEventListener('wheel', wheelHandler, { passive: false });
        window.addEventListener('touchmove', wheelHandler as EventListener, { passive: false });
        
        return () => {
          window.removeEventListener('wheel', wheelHandler);
          window.removeEventListener('touchmove', wheelHandler as EventListener);
          
          // Restaurar o estilo original
          document.body.style.overflow = originalStyle.overflow;
          document.body.style.position = originalStyle.position;
          document.body.style.top = originalStyle.top;
          document.body.style.width = originalStyle.width;
          document.body.style.height = originalStyle.height;
          document.body.style.paddingRight = originalStyle.paddingRight;
          
          // Restaurar a posição de scroll
          window.scrollTo(0, scrollY);
        };
      }
    }
  }, [open]);
  
  // Chamar callbacks externos
  useEffect(() => {
    if (open) {
      onOpen && onOpen();
    } else {
      onClose && onClose();
    }
  }, [open, onOpen, onClose]);
  
  // Adicionar estilos de hover para web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* Estilo para o trigger do dropdown */
        .dropdown-trigger:hover {
          border-color: ${themeColors['primary']};
          transition: all 0.2s ease;
        }
        
        /* Garantir que elementos com position:fixed não sejam cortados */
        *, *::before, *::after {
          transform-style: preserve-3d;
        }
        
        /* Garantir que elementos com position:fixed tenham o maior z-index possível */
        body > [style*="position: fixed"] {
          z-index: 2147483647 !important;
          isolation: isolate;
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
      `;
      document.head.appendChild(style);

      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark, themeColors]);
  
  // Adicionar classe para hover no web
  useEffect(() => {
    if (Platform.OS === 'web' && selectRef.current) {
      // Adicionar classe dropdown-trigger para o elemento
      if (selectRef.current.classList) {
        selectRef.current.classList.add('dropdown-trigger');
      }
    }
  }, []);
  
  // Lidar com toggle do dropdown
  const handleToggleDropdown = () => {
    if (!disabled && !loading) {
      // Calcular a posição para mobile também
      if (!open) {
        if (Platform.OS !== 'web' && selectRef.current) {
          selectRef.current.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            // Verifica o espaço disponível para baixo no mobile
            // Usando Dimensions para obter o tamanho da tela
            const { height: windowHeight } = require('react-native').Dimensions.get('window');
            const spaceBelow = windowHeight - (pageY + height);
            
            // Se não houver espaço suficiente embaixo, abre para cima
            // Mas apenas se houver espaço suficiente para cima
            const openDown = superBaseTable || spaceBelow >= maxHeight || pageY < maxHeight;
            
            // Espaçamento consistente
            const spacingDown = 3; // Mantido em 3px
            const spacingUp = 3; // Mantido em 3px
            
            if (openDown) {
              // Abre para baixo - há espaço suficiente
              setPosition({
                top: pageY + height + spacingDown,
                left: pageX,
                width: width,
                bottom: undefined,
                openDown: true
              });
            } else {
              // Abre para cima - não há espaço suficiente abaixo
              setPosition({
                top: undefined,
                bottom: windowHeight - pageY + spacingUp,
                left: pageX,
                width: width,
                openDown: false
              });
            }
          });
        } else if (Platform.OS === 'web' && selectRef.current) {
          const rect = selectRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Se estiver em uma tabela, força sempre abrir para baixo
          // Caso contrário, verifica se há espaço disponível abaixo
          const openDown = superBaseTable || rect.bottom + maxHeight <= viewportHeight || rect.top < maxHeight;
          
          // Espaçamento consistente
          const spacingUp = 3; // Mantido em 3px
          const spacingDown = 3; // Mantido em 3px
          
          // Cálculo mais direto
          if (openDown) {
            setPosition({
              top: rect.bottom + spacingDown + window.scrollY,
              left: rect.left + window.scrollX,
              width: rect.width,
              openDown: true
            });
          } else {
            setPosition({
              top: rect.top - spacingUp + window.scrollY,
              left: rect.left + window.scrollX,
              width: rect.width,
              openDown: false
            });
          }
        }
      }
      setOpen(!open);
    }
  };
  
  // Lidar com seleção de valor
  const handleSelectValue = (newValue: string | string[]) => {
    setValue(newValue as any);
  };
  
  // Obter texto de exibição
  const getDisplayText = () => {
    if (multiple) {
      const selectedValues = value as string[];
      if (selectedValues.length === 0) return placeholder;
      return `${selectedValues.length} ${selectedValues.length === 1 ? 'item selecionado' : 'itens selecionados'}`;
    } else {
      if (!effectiveOptions) return placeholder;
      const selectedOption = effectiveOptions.find(opt => opt.value === value);
      return selectedOption ? selectedOption.label : placeholder;
    }
  };
  
  // Estilos compartilhados para o botão do select
  const selectButtonStyle = StyleSheet.create({
    container: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 8,
      paddingHorizontal: 12,
      borderWidth: 1,
      borderColor: isDark ? '#262D34' : '#E0E3E7',
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderRadius: 6,
      minHeight: 38
    },
    text: {
      fontSize: 14,
      color: value && (multiple ? (value as string[]).length > 0 : true)
        ? (isDark ? '#FFFFFF' : '#14181B')
        : (isDark ? '#95A1AC' : '#8B97A2')
    },
    loadingContainer: {
      flexDirection: 'row',
      alignItems: 'center'
    },
    loadingIndicator: {
      width: 16,
      height: 16,
      borderRadius: 8,
      borderWidth: 2,
      borderColor: isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)',
      borderTopColor: isDark ? '#4A6' : themeColors['primary'],
      marginRight: 8
    },
    errorText: {
      fontSize: 12,
      color: isDark ? '#F87171' : '#DC2626',
      marginTop: 4
    }
  });

  // Verificar se a opção selecionada está visível e rolar para ela quando abrir o dropdown
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    if (open && effectiveOptions?.length > 0) {
      const selectedOptionIndex = effectiveOptions.findIndex(
        (option) => option.value === value
      );
      if (selectedOptionIndex !== -1 && flatListRef.current) {
        flatListRef.current.scrollToIndex({
          index: selectedOptionIndex,
          animated: true,
          viewPosition: 0.5,
        });
      }
    }
  }, [open, effectiveOptions, value]);

  // Função para fechar o dropdown
  const handleClose = () => {
    setOpen(false);
    // Reset imediato do estado para garantir responsividade ao próximo toque
    setTimeout(() => {
      // Este timeout ajuda a evitar problemas de duplo toque
    }, 50);
  };

  return (
    <View style={{ width: '100%', position: 'relative' }}>
      {label && (
        <Text style={{ 
          fontSize: 12, 
          marginBottom: 4, 
          color: isDark ? '#95A1AC' : '#57636C',
          fontWeight: '500' 
        }}>
          {label}
        </Text>
      )}
      
      {/* Gatilho do dropdown */}
      <TouchableOpacity
        ref={selectRef}
        onPress={handleToggleDropdown}
        style={[
          selectButtonStyle.container,
          disabled || isLoading ? { opacity: 0.5 } : {}
        ]}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <View style={selectButtonStyle.loadingContainer}>
            <View style={[
              selectButtonStyle.loadingIndicator,
              Platform.OS === 'web' && { 
                // @ts-ignore - Animação específica para web
                animation: 'spin 1s linear infinite' 
              }
            ]} />
            <Text style={selectButtonStyle.text}>
              Carregando...
            </Text>
          </View>
        ) : (
          <Text 
            style={selectButtonStyle.text}
            numberOfLines={1}
          >
            {getDisplayText()}
          </Text>
        )}
        
        {isLoading ? null : (
          open ? (
            <ChevronUp size={16} color={isDark ? '#95A1AC' : '#57636C'} />
          ) : (
            <ChevronDown size={16} color={isDark ? '#95A1AC' : '#57636C'} />
          )
        )}
      </TouchableOpacity>
      
      {/* Exibir mensagem de erro se houver */}
      {supabaseError && (
        <Text style={selectButtonStyle.errorText}>
          Erro: {supabaseError}
        </Text>
      )}
      
      {/* Dropdown no mobile - usa Modal */}
      {Platform.OS !== 'web' && (
        <MobileSelectModal
          visible={open}
          options={effectiveOptions}
          value={value}
          onSelect={handleSelectValue}
          onClose={handleClose}
          multiple={multiple}
          isDark={isDark}
          maxHeight={maxHeight}
          position={position}
          openDown={position.openDown}
          searchable={searchable}
          autoFocus={autoFocus}
          superBaseTable={superBaseTable}
        />
      )}
      
      {/* Dropdown na web - usa posicionamento absoluto */}
      {Platform.OS === 'web' && (
        <WebDropdownOptions
          visible={open}
          options={effectiveOptions}
          value={value}
          onSelect={handleSelectValue}
          onClose={handleClose}
          multiple={multiple}
          isDark={isDark}
          position={position}
          maxHeight={maxHeight}
          searchable={searchable}
          autoFocus={autoFocus}
          superBaseTable={superBaseTable}
        />
      )}
    </View>
  );
};