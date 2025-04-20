import React, { useEffect, useRef, useState } from 'react';
import { StyleSheet, Platform, TouchableOpacity, Text, View, Modal, Pressable, ScrollView, TextInput, Animated } from 'react-native';
import { ChevronUp, ChevronDown, Check, Search, X } from 'lucide-react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { useResponsive } from '../../hooks/useResponsive';
import { createPortal } from 'react-dom';

/**
 * @component DropdownMenu
 * @description Componente de menu dropdown que pode ser aberto a partir de qualquer elemento:
 * - Tema claro/escuro automático
 * - Responsividade em todas as plataformas (iOS, Android, Web)
 * - Posicionamento inteligente (abre para cima ou para baixo conforme espaço disponível)
 * 
 * Pode ser usado como menu contextual, menu de opções, etc.
 */

export interface DropdownOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}

interface DropdownMenuProps {
  options: DropdownOption[];
  isOpen: boolean;
  onClose: () => void;
  triggerRef: React.RefObject<any>;
  maxHeight?: number;
  searchable?: boolean;
  autoFocus?: boolean;
  position?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    width?: number;
    height?: number;
  };
}

// Componente para renderizar um item da lista de opções
const OptionItem = ({ item, isDark, onSelect }: { 
  item: DropdownOption; 
  isDark: boolean; 
  onSelect: (item: DropdownOption) => void;
}) => {
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
      backgroundColor: isHovered
        ? (isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)') 
        : 'transparent'
    },
    itemText: {
      fontSize: 14,
      color: isDark ? '#D1D5DB' : '#57636C',
      fontWeight: 'normal'
    },
    leftContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    }
  });
  
  return (
    <TouchableOpacity
      style={styles.itemContainer}
      onPress={() => {
        onSelect(item);
        if (item.onPress) {
          item.onPress();
        }
      }}
      // @ts-ignore - Eventos de hover exclusivos para web
      onMouseEnter={handleHoverIn}
      onMouseLeave={handleHoverOut}
    >
      <View style={styles.leftContainer}>
        {item.icon && item.icon}
        <Text style={styles.itemText}>
          {item.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

// Para Web: Renderiza uma lista de opções com posicionamento absoluto
const WebDropdownMenu = ({ 
  isOpen, 
  options, 
  onClose, 
  position,
  maxHeight = 300,
  searchable = false,
  autoFocus = false,
  triggerRef,
  animatedValues
}: {
  isOpen: boolean;
  options: DropdownOption[];
  onClose: () => void;
  triggerRef: React.RefObject<any>;
  position?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    width?: number;
    height?: number;
  };
  maxHeight?: number;
  searchable?: boolean;
  autoFocus?: boolean;
  animatedValues?: {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
  };
}) => {
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // Ref para a lista de opções
  const optionsRef = useRef<any>(null);
  
  // Ref para armazenar a posição de scroll
  const scrollPositionRef = useRef(0);
  
  // Estado para controlar a pesquisa
  const [searchValue, setSearchValue] = useState('');
  
  // Estado para controlar posicionamento
  const [menuPosition, setMenuPosition] = useState<{
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    width: number;
  }>({ 
    top: 0, 
    left: 0, 
    width: 200 
  });
  
  // Usar valores de animação do componente pai
  const fadeAnim = animatedValues?.fadeAnim || useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const slideAnim = animatedValues?.slideAnim || useRef(new Animated.Value(isOpen ? 0 : -10)).current;

  // Calcular a posição do menu quando abrir
  useEffect(() => {
    if (isOpen && triggerRef.current && Platform.OS === 'web') {
      const rect = triggerRef.current.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      
      // Verificar se há espaço abaixo
      const openDown = rect.bottom + maxHeight <= viewportHeight || rect.top < maxHeight;
      
      // Espaçamento consistente
      const spacing = 3;
      
      // Calcular posição baseada no gatilho
      if (position) {
        // Usar posição customizada se fornecida
        setMenuPosition({
          ...position,
          width: position.width || rect.width
        });
      } else {
        // Calcular posição automática
        if (openDown) {
          setMenuPosition({
            top: rect.bottom + spacing + window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          });
        } else {
          setMenuPosition({
            bottom: viewportHeight - rect.top + spacing - window.scrollY,
            left: rect.left + window.scrollX,
            width: rect.width
          });
        }
      }
    }
  }, [isOpen, maxHeight, position]);
  
  // Função para normalizar texto (remover acentos)
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '');
  };
  
  // Filtrar opções baseado na pesquisa
  const filteredOptions = searchable && searchValue
    ? options.filter((option: DropdownOption) => {
        const normalizedLabel = normalizeText(option.label);
        const normalizedSearch = normalizeText(searchValue);
        return normalizedLabel.includes(normalizedSearch);
      })
    : options;
  
  // Reset da pesquisa quando fechar
  useEffect(() => {
    if (!isOpen) {
      setSearchValue('');
    }
  }, [isOpen]);
  
  // Se não estiver visível, não renderiza
  if (!isOpen) return null;
  
  // Lidar com seleção de item
  const handleItemSelect = (item: DropdownOption) => {
    if (item.onPress) {
      // Não fecha automaticamente para permitir que o handler decida
      // quando fechar o menu, se necessário
    } else {
      // Fecha automaticamente se não houver handler
      onClose();
    }
  };
  
  // Permitir scroll dentro do dropdown
  const handleOptionsWheel = (e: React.WheelEvent) => {
    // Permitir o scroll dentro das opções
    e.stopPropagation();
  };
  
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
      position: 'fixed' as 'fixed',
      zIndex: 2147483647,
      overflowY: 'auto' as 'auto',
      ...menuPosition,
      maxHeight
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
      <Animated.View
        ref={optionsRef}
        style={[
          dropdownStyle.container,
          {
            opacity: fadeAnim,
            transform: [
              { 
                translateY: slideAnim 
              }
            ]
          }
        ]}
        // @ts-ignore - Permitir eventos de wheel para scroll
        onWheel={handleOptionsWheel}
        // @ts-ignore - Adicionar classe e atributo para detectar se o scroll está dentro do dropdown
        className="dropdown-menu"
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
          filteredOptions.map((item: DropdownOption) => (
            <OptionItem
              key={item.value}
              item={item}
              onSelect={handleItemSelect}
              isDark={isDark}
            />
          ))
        ) : (
          <View style={{ padding: 12, alignItems: 'center' }}>
            <Text style={{ color: isDark ? '#95A1AC' : '#57636C' }}>
              Nenhum resultado encontrado
            </Text>
          </View>
        )}
      </Animated.View>
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
const MobileDropdownMenu = ({ 
  isOpen, 
  options, 
  onClose, 
  position,
  maxHeight = 300,
  searchable = false,
  autoFocus = false,
  animatedValues
}: {
  isOpen: boolean;
  options: DropdownOption[];
  onClose: () => void;
  position?: {
    top?: number;
    left?: number;
    bottom?: number;
    right?: number;
    width?: number;
    height?: number;
  };
  maxHeight?: number;
  searchable?: boolean;
  autoFocus?: boolean;
  animatedValues?: {
    fadeAnim: Animated.Value;
    slideAnim: Animated.Value;
  };
}) => {
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // Estado para controlar a pesquisa
  const [searchValue, setSearchValue] = useState('');
  
  // Usar valores de animação do componente pai
  const fadeAnim = animatedValues?.fadeAnim || useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  const slideAnim = animatedValues?.slideAnim || useRef(new Animated.Value(isOpen ? 0 : 20)).current;

  // Função para normalizar texto (remover acentos)
  const normalizeText = (text: string): string => {
    return text.toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^\w\s]/gi, '');
  };
  
  // Filtrar opções baseado na pesquisa
  const filteredOptions = searchable && searchValue
    ? options.filter((option: DropdownOption) => {
        const normalizedLabel = normalizeText(option.label);
        const normalizedSearch = normalizeText(searchValue);
        return normalizedLabel.includes(normalizedSearch);
      })
    : options;
  
  // Ref para a ScrollView
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Reset da pesquisa quando fechar
  useEffect(() => {
    if (!isOpen) {
      setSearchValue('');
    }
  }, [isOpen]);
  
  // Lidar com alteração na pesquisa
  const handleSearchChange = (text: string) => {
    setSearchValue(text);
    
    // Reset do scroll para o topo quando pesquisar
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ y: 0, animated: true });
    }
  };
  
  // Limpar campo de pesquisa
  const handleClearSearch = () => {
    setSearchValue('');
  };
  
  // Lidar com seleção de item
  const handleItemSelect = (item: DropdownOption) => {
    if (item.onPress) {
      // Não fecha automaticamente para permitir que o handler decida
      // quando fechar o menu, se necessário
    } else {
      // Fecha automaticamente se não houver handler
      onClose();
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
      backgroundColor: 'rgba(0, 0, 0, 0.4)',
    },
    container: {
      position: 'absolute',
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderColor: isDark ? '#262D34' : '#E0E3E7',
      maxHeight: maxHeight,
      width: position?.width || '90%',
      marginHorizontal: 16,
      left: position?.left || 0,
      top: position?.top || 100,
      borderWidth: 1,
      borderRadius: 6,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: isDark ? 0.2 : 0.08,
      shadowRadius: 6,
      elevation: 5,
    },
    optionsContainer: {
      maxHeight: maxHeight,
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
      height: 30,
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
      visible={isOpen}
      transparent={true}
      animationType="none" // Removemos a animação padrão para usar nossa própria
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <Animated.View 
        style={[
          dropdownStyle.overlay,
          { opacity: fadeAnim }
        ]}
      >
        <Pressable 
          style={{ flex: 1 }}
          onPress={handlePressOutside}
        >
          <Animated.View 
            style={[
              dropdownStyle.container,
              {
                transform: [
                  { translateY: slideAnim }
                ]
              }
            ]}
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
              scrollEventThrottle={16}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((item: DropdownOption) => (
                  <OptionItem
                    key={item.value}
                    item={item}
                    onSelect={handleItemSelect}
                    isDark={isDark}
                  />
                ))
              ) : (
                <View style={dropdownStyle.noResultsContainer}>
                  <Text style={dropdownStyle.noResultsText}>
                    Nenhum resultado encontrado
                  </Text>
                </View>
              )}
            </ScrollView>
          </Animated.View>
        </Pressable>
      </Animated.View>
    </Modal>
  );
};

export const DropdownMenu = ({
  options,
  isOpen,
  onClose,
  triggerRef,
  maxHeight = 300,
  searchable = false,
  autoFocus = false,
  position,
}: DropdownMenuProps) => {
  // Estado interno para controle de animação de saída
  const [isVisible, setIsVisible] = useState(false);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(-10)).current;
  
  // Controlar visibilidade com animação
  useEffect(() => {
    // Cancelar qualquer animação em andamento
    if (animationRef.current) {
      animationRef.current.stop();
    }
    
    if (isOpen) {
      // Mostrar imediatamente
      setIsVisible(true);
      
      // Reset para valores iniciais
      fadeAnim.setValue(0);
      slideAnim.setValue(-10);
      
      // Iniciar animação de entrada
      animationRef.current = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 180,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 180,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]);
      
      animationRef.current.start();
    } else if (isVisible) {
      // Iniciar animação de saída
      animationRef.current = Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 100,
          useNativeDriver: Platform.OS !== 'web',
        }),
        Animated.timing(slideAnim, {
          toValue: -10,
          duration: 100,
          useNativeDriver: Platform.OS !== 'web',
        }),
      ]);
      
      animationRef.current.start(() => {
        // Esconder o componente após a animação
        setIsVisible(false);
      });
    }
    
    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [isOpen, fadeAnim, slideAnim]);
  
  // Componente só é renderizado quando isOpen ou isVisible são true
  if (!isOpen && !isVisible) return null;
  
  // Função para fechar com animação
  const handleClose = () => {
    onClose();
  };
  
  // Renderização baseada na plataforma
  if (Platform.OS === 'web') {
    return (
      <WebDropdownMenu
        isOpen={isOpen}
        options={options}
        onClose={handleClose}
        triggerRef={triggerRef}
        maxHeight={maxHeight}
        searchable={searchable}
        autoFocus={autoFocus}
        position={position}
        animatedValues={{ fadeAnim, slideAnim }}
      />
    );
  } else {
    return (
      <MobileDropdownMenu
        isOpen={isOpen}
        options={options}
        onClose={handleClose}
        maxHeight={maxHeight}
        searchable={searchable}
        autoFocus={autoFocus}
        position={position}
        animatedValues={{ fadeAnim, slideAnim }}
      />
    );
  }
};