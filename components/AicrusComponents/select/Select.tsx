import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Text, View, Modal, Pressable, ScrollView } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { ChevronUp, ChevronDown, Check } from 'lucide-react-native';
import { useTheme } from '../../../hooks/ThemeContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { colors } from '../constants/theme';
import { createPortal } from 'react-dom';

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
  options: DropdownOption[];
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

// Componente para renderizar um item da lista de opções
const OptionItem = ({ item, selected, onSelect, isDark }: any) => {
  const [isHovered, setIsHovered] = useState(false);
  
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
      borderBottomColor: isDark ? '#262D34' : '#E0E3E7',
      backgroundColor: selected 
        ? (isDark ? 'rgba(137, 44, 220, 0.08)' : 'rgba(137, 44, 220, 0.05)')
        : (isHovered && !selected && Platform.OS === 'web' 
            ? (isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)') 
            : 'transparent')
    },
    itemText: {
      fontSize: 14,
      color: selected 
        ? (isDark ? colors.primary.dark : colors.primary.main)
        : (isDark ? '#D1D5DB' : '#57636C'),
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
        <Check size={16} color={isDark ? colors.primary.dark : colors.primary.main} strokeWidth={2} />
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
  maxHeight
}: any) => {
  // Ref para a lista de opções
  const optionsRef = useRef<any>(null);
  
  // Ref para armazenar a posição de scroll
  const scrollPositionRef = useRef(0);
  
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
    if (multiple) {
      // Em seleção múltipla, salvar posição de scroll atual
      if (optionsRef.current) {
        scrollPositionRef.current = optionsRef.current.scrollTop;
      }
      
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
      requestAnimationFrame(() => {
        if (optionsRef.current && multiple) {
          optionsRef.current.scrollTop = scrollPositionRef.current;
        }
      });
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
  
  // Posicionamento web
  const positionStyle = {
    position: 'fixed' as 'fixed',
    top: position?.top || 0,  // Voltamos a usar top sempre
    left: position?.left || 0,
    width: position?.width || 200,
    maxHeight: maxHeight || 300,
    zIndex: 2147483647, // Valor máximo possível para z-index
    overflowY: 'auto' as 'auto',
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
        {options.map((item: DropdownOption) => {
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
        })}
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
  openDown
}: any) => {
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
          <ScrollView 
            nestedScrollEnabled={true}
            contentContainerStyle={{ flexGrow: 0 }}
          >
            {options.map((item: DropdownOption) => {
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
            })}
          </ScrollView>
        </View>
      </Pressable>
    </Modal>
  );
};

export const Select = ({
  options,
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
}: SelectProps) => {
  // Estado para controlar abertura do dropdown
  const [open, setOpen] = useState(false);
  
  // Ref para o componente principal
  const selectRef = useRef<any>(null);
  
  // Posicionamento para o dropdown web
  const [position, setPosition] = useState<{
    top?: number;
    left: number;
    width: number;
    bottom?: number;
    openDown?: boolean;
  }>({ top: 0, left: 0, width: 0 });
  
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Calcular posição para o dropdown web
  useEffect(() => {
    if (Platform.OS === 'web' && open && selectRef.current) {
      const rect = selectRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      
      // Calcula se deve abrir para cima ou para baixo
      const openDown = rect.bottom + maxHeight <= viewportHeight;
      
      // Espaçamento diferente para cima e para baixo
      const spacingUp = 3; // Aumentado para ser visível
      const spacingDown = 3; // Valor menor para quando abre para baixo
      
      // Cálculo mais direto
      const topPosition = openDown 
        ? rect.bottom + spacingDown + window.scrollY  // Abre para baixo
        : rect.top - maxHeight - spacingUp + window.scrollY;  // Abre para cima
      
      setPosition({
        top: topPosition,
        left: rect.left + window.scrollX,
        width: rect.width,
        openDown: openDown
      });
    }
  }, [open, maxHeight]);
  
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
          border-color: ${isDark ? colors.primary.dark : colors.primary.main};
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
  }, [isDark]);
  
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
            const openDown = spaceBelow >= maxHeight;
            
            // Espaçamento consistente
            const spacingDown = 3; // Valor consistente
            const spacingUp = 3; // Mesmo valor que para baixo
            
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
                bottom: windowHeight - pageY + spacingUp, // Espaçamento consistente
                left: pageX,
                width: width,
                openDown: false
              });
            }
          });
        } else if (Platform.OS === 'web' && selectRef.current) {
          const rect = selectRef.current.getBoundingClientRect();
          const viewportHeight = window.innerHeight;
          
          // Calcula se deve abrir para cima ou para baixo
          const openDown = rect.bottom + maxHeight <= viewportHeight;
          
          // Espaçamento diferente para cima e para baixo
          const spacingUp = 3; // Mesmo valor usado no useEffect (3px)
          const spacingDown = 3; // Valor consistente para quando abre para baixo
          
          // Cálculo mais direto
          const topPosition = openDown 
            ? rect.bottom + spacingDown + window.scrollY  // Abre para baixo
            : rect.top - maxHeight - spacingUp + window.scrollY;  // Abre para cima
          
          setPosition({
            top: topPosition,
            left: rect.left + window.scrollX,
            width: rect.width,
            openDown: openDown
          });
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
      const selectedOption = options.find(opt => opt.value === value);
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
    }
  });

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
          disabled ? { opacity: 0.5 } : {}
        ]}
        disabled={disabled || loading}
      >
        <Text 
          style={selectButtonStyle.text}
          numberOfLines={1}
        >
          {getDisplayText()}
        </Text>
        
        {open ? (
          <ChevronUp size={16} color={isDark ? '#95A1AC' : '#57636C'} />
        ) : (
          <ChevronDown size={16} color={isDark ? '#95A1AC' : '#57636C'} />
        )}
      </TouchableOpacity>
      
      {/* Dropdown no mobile - usa Modal */}
      {Platform.OS !== 'web' && (
        <MobileSelectModal
          visible={open}
          options={options}
          value={value}
          onSelect={handleSelectValue}
          onClose={handleClose}
          multiple={multiple}
          isDark={isDark}
          maxHeight={maxHeight}
          position={position}
          openDown={position.openDown}
        />
      )}
      
      {/* Dropdown na web - usa posicionamento absoluto */}
      {Platform.OS === 'web' && (
        <WebDropdownOptions
          visible={open}
          options={options}
          value={value}
          onSelect={handleSelectValue}
          onClose={() => setOpen(false)}
          multiple={multiple}
          isDark={isDark}
          position={position}
          maxHeight={maxHeight}
        />
      )}
    </View>
  );
};