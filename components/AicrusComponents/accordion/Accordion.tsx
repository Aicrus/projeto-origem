import React, { useState, useRef, useEffect, useContext } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Animated, Platform, LayoutAnimation, UIManager, ViewStyle, TextStyle, ImageStyle } from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useTheme } from '../../../hooks/ThemeContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { colors } from '../constants/theme';

/**
 * @component Accordion
 * @description Componente de acordeão (expansível) altamente personalizável que suporta:
 * - Animações suaves de expansão e colapso
 * - Tema claro/escuro automático
 * - Responsividade
 * - Personalização completa do cabeçalho e conteúdo
 * - Controle de estados: aberto/fechado
 * - Comportamento de grupo (apenas um aberto por vez)
 * 
 * Exemplos de uso:
 * 
 * ```tsx
 * // Accordion simples
 * <Accordion 
 *   title="Título do Accordion" 
 *   content="Conteúdo do accordion que será exibido quando expandido."
 * />
 * 
 * // Accordion com conteúdo personalizado
 * <Accordion 
 *   title="FAQ"
 *   defaultOpen={true}
 * >
 *   <Text>Conteúdo personalizado que pode incluir qualquer componente.</Text>
 *   <Button title="Clique aqui" onPress={() => {}} />
 * </Accordion>
 * 
 * // Accordion sem contorno e estilo minimalista
 * <Accordion 
 *   title="FAQ Minimalista"
 *   content="Conteúdo clean sem bordas."
 *   bordered={false}
 *   showOutline={false}
 * />
 * 
 * // Accordion com cabeçalho personalizado
 * <Accordion
 *   customHeader={(isOpen) => (
 *     <View style={{flexDirection: 'row', alignItems: 'center'}}>
 *       <Icon name="star" />
 *       <Text>Título personalizado</Text>
 *       {isOpen ? <Text>Aberto</Text> : <Text>Fechado</Text>}
 *     </View>
 *   )}
 * >
 *   <Text>Conteúdo do accordion</Text>
 * </Accordion>
 * 
 * // Grupo de Accordions (apenas um aberto por vez)
 * <AccordionGroup>
 *   <Accordion title="Seção 1" content="Conteúdo da seção 1" />
 *   <Accordion title="Seção 2" content="Conteúdo da seção 2" />
 *   <Accordion title="Seção 3" content="Conteúdo da seção 3" />
 * </AccordionGroup>
 * ```
 */

// Contexto para gerenciar o estado de grupo dos accordions
const AccordionGroupContext = React.createContext<{
  activeAccordion: string | null;
  setActiveAccordion: (id: string | null) => void;
} | null>(null);

/**
 * Hook para usar o contexto do AccordionGroup
 */
const useAccordionGroup = () => {
  return useContext(AccordionGroupContext);
};

export interface AccordionProps {
  /** Título do acordeão (ignorado se customHeader for fornecido) */
  title?: string;
  /** Conteúdo do acordeão (como string, ignorado se children for fornecido) */
  content?: string;
  /** Conteúdo personalizado do acordeão */
  children?: React.ReactNode;
  /** Se o acordeão deve iniciar aberto */
  defaultOpen?: boolean;
  /** Função de renderização personalizada para o cabeçalho */
  customHeader?: (isOpen: boolean) => React.ReactNode;
  /** Função chamada quando o acordeão é aberto ou fechado */
  onToggle?: (isOpen: boolean) => void;
  /** Estilo personalizado para o container do acordeão */
  style?: ViewStyle;
  /** Estilo personalizado para o cabeçalho do acordeão */
  headerStyle?: ViewStyle;
  /** Estilo personalizado para o conteúdo do acordeão */
  contentStyle?: ViewStyle;
  /** ID para testes automatizados */
  testID?: string;
  /** Se o acordeão deve ter borda ao redor dos itens */
  bordered?: boolean;
  /** Se o acordeão deve mostrar o contorno/borda externa */
  showOutline?: boolean;
  /** Se deve mostrar a linha divisória quando o acordeão está aberto */
  showSeparator?: boolean;
  /** ID único para o accordion quando usado em um grupo */
  id?: string;
  /** Espaçamento entre o cabeçalho e a linha divisória */
  separatorSpacing?: number;
  /** Duração da animação de abertura/fechamento em milissegundos */
  animationDuration?: number;
  /** Propriedade interna - se está dentro de um AccordionGroup */
  isInAccordionGroup?: boolean;
  /** Propriedade interna - se é o último item no grupo */
  isLastInGroup?: boolean;
  /** Propriedade interna - se o grupo tem showOutline */
  groupShowOutline?: boolean;
  /** Propriedade interna - se o grupo tem showSeparator */
  groupShowSeparator?: boolean;
  /** Propriedade interna - índice no grupo */
  index?: number;
}

export interface AccordionGroupProps {
  /** Componentes Accordion filhos */
  children: React.ReactNode;
  /** ID do accordion que deve iniciar aberto */
  defaultOpenId?: string;
}

// Ativar LayoutAnimation para Android
if (Platform.OS === 'android') {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

// Configuração de animação para abertura
const openAnimConfig = {
  duration: 200, // Reduzir tempo de abertura para ser mais rápido
  create: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.spring,
    springDamping: 0.8, // Mais rápido
  },
  delete: {
    type: LayoutAnimation.Types.easeInEaseOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

// Configuração de animação para fechamento (muito mais rápida)
const closeAnimConfig = {
  duration: 130, // Ainda mais rápido para fechar
  create: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity,
  },
  update: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity,
  },
  delete: {
    type: LayoutAnimation.Types.easeOut,
    property: LayoutAnimation.Properties.opacity,
  },
};

/**
 * Componente de grupo de accordions que gerencia o estado de qual accordion está aberto
 */
export const AccordionGroup: React.FC<AccordionGroupProps> = ({
  children,
  defaultOpenId
}) => {
  // Estado para controlar qual accordion está aberto
  const [activeAccordion, setActiveAccordion] = useState<string | null>(defaultOpenId || null);

  // Processa os filhos para detectar propriedades
  let showOutlineValue = true;
  let showSeparatorValue = true;
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if ('showOutline' in child.props) {
        showOutlineValue = child.props.showOutline;
      }
      if ('showSeparator' in child.props) {
        showSeparatorValue = child.props.showSeparator;
      }
    }
  });

  // Enumeração dos filhos para aplicar estilos no último
  const childrenArray = React.Children.toArray(children);
  const enhancedChildren = childrenArray.map((child, index) => {
    if (React.isValidElement(child) && typeof child.type !== 'string') {
      // Determina se é o último item do grupo
      const isLastItem = index === childrenArray.length - 1;
      
      // Passa propriedades adicionais apenas se for componente Accordion
      // Usamos type assertion aqui para informar ao TypeScript que essas props existem
      return React.cloneElement(child, {
        isInAccordionGroup: true,
        isLastInGroup: isLastItem,
        groupShowOutline: showOutlineValue,
        groupShowSeparator: showSeparatorValue,
        index: index
      } as Partial<AccordionProps>);
    }
    return child;
  });

  return (
    <AccordionGroupContext.Provider value={{ activeAccordion, setActiveAccordion }}>
      {enhancedChildren}
    </AccordionGroupContext.Provider>
  );
};

export const Accordion = ({
  title,
  content,
  children,
  defaultOpen = false,
  customHeader,
  onToggle,
  style,
  headerStyle,
  contentStyle,
  testID,
  bordered = true,
  showOutline = true,
  showSeparator = true,
  id = Math.random().toString(36).substring(2, 9), // ID aleatório se não fornecido
  separatorSpacing = 8, // Espaçamento padrão
  animationDuration = 300, // Duração padrão em ms
  isInAccordionGroup = false,
  isLastInGroup = false,
  groupShowOutline,
  groupShowSeparator,
  index,
}: AccordionProps) => {
  // Verificar se está dentro de um grupo de accordions
  const accordionGroup = useAccordionGroup();
  
  // Estado para controlar se o acordeão está aberto ou fechado
  // Se estiver em um grupo, depende do activeAccordion do grupo
  const isInGroup = !!accordionGroup;
  const isOpenInGroup = isInGroup ? accordionGroup.activeAccordion === id : false;
  const [isOpenLocal, setIsOpenLocal] = useState(defaultOpen);
  
  // Determinar o estado de abertura atual
  const isOpen = isInGroup ? isOpenInGroup : isOpenLocal;
  
  // Use o valor de showOutline do grupo se estiver em um grupo
  const effectiveShowOutline = isInAccordionGroup && groupShowOutline !== undefined 
    ? groupShowOutline 
    : showOutline;
    
  // Use o valor de showSeparator do grupo se estiver em um grupo
  const effectiveShowSeparator = isInAccordionGroup && groupShowSeparator !== undefined 
    ? groupShowSeparator 
    : showSeparator;
  
  // Animação para a rotação do ícone
  const rotateAnimation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  
  // Animação para a altura do conteúdo
  const heightAnimation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  
  // Animação para a opacidade do conteúdo
  const opacityAnimation = useRef(new Animated.Value(isOpen ? 1 : 0)).current;
  
  // Referência ao conteúdo para medição de altura
  const contentRef = useRef<View>(null);
  
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Responsividade
  const { isMobile } = useResponsive();
  
  // Atualizar o estado quando o activeAccordion do grupo mudar
  useEffect(() => {
    if (isInGroup) {
      const newIsOpen = accordionGroup.activeAccordion === id;
      
      // Atualizar animações de acordo com o novo estado
      if (Platform.OS === 'web') {
        // Duração diferente para abrir e fechar
        const duration = newIsOpen ? animationDuration : Math.floor(animationDuration * 0.45);
        
        // Criar sequência para animação mais natural
        if (newIsOpen) {
          // Para abertura acelerada: mostrar o conteúdo junto com a expansão
          Animated.parallel([
            // Rotaciona o ícone
            Animated.timing(rotateAnimation, {
              toValue: 1,
              duration: duration * 0.6,
              useNativeDriver: true,
              easing: (t) => t * t, // Aceleração no início
            }),
            // Expande a altura rapidamente
            Animated.timing(heightAnimation, {
              toValue: 1,
              duration: duration * 0.9,
              useNativeDriver: false,
              easing: t => 1 - Math.pow(1 - t, 3), // Mais rápido no início, mais suave no final
            }),
            // Mostra o conteúdo imediatamente junto com a expansão
            Animated.timing(opacityAnimation, {
              toValue: 1,
              duration: duration * 0.4, // Bem mais rápido para o conteúdo aparecer
              useNativeDriver: true,
              easing: t => t, // Linear para aparecer rápido
            }),
          ]).start();
        } else {
          // Ao fechar: primeiro esconde o conteúdo, depois colapsa - mais rápido
          Animated.sequence([
            // Rapidamente reduz a opacidade 
            Animated.timing(opacityAnimation, {
              toValue: 0,
              duration: duration * 0.3, // Bem mais rápido
              useNativeDriver: true,
              easing: t => t, // Linear
            }),
            // Após começar a esconder, colapsa e rotaciona (praticamente imediato)
            Animated.parallel([
              Animated.timing(rotateAnimation, {
                toValue: 0,
                duration: duration * 0.5,
                useNativeDriver: true,
                easing: t => t, // Linear
              }),
              Animated.timing(heightAnimation, {
                toValue: 0,
                duration: duration * 0.6,
                useNativeDriver: false,
                easing: t => t * t, // Aceleração no início
              }),
            ]),
          ]).start();
        }
      } else {
        // Mobile: Usar LayoutAnimation
        LayoutAnimation.configureNext(newIsOpen ? openAnimConfig : closeAnimConfig);
      }
    }
  }, [isInGroup, accordionGroup?.activeAccordion, id, animationDuration]);
  
  // Alternar o estado do acordeão
  const toggleAccordion = () => {
    const newIsOpen = !isOpen;
    
    if (isInGroup) {
      // Atualizar o accordion ativo no grupo
      accordionGroup.setActiveAccordion(newIsOpen ? id : null);
    } else {
      // Gerenciar animações localmente
      if (Platform.OS === 'web') {
        // Duração diferente para abrir e fechar
        const duration = newIsOpen ? animationDuration : Math.floor(animationDuration * 0.45);
        
        // Criar sequência para animação mais natural
        if (newIsOpen) {
          // Para abertura acelerada: mostrar o conteúdo junto com a expansão
          Animated.parallel([
            // Rotaciona o ícone
            Animated.timing(rotateAnimation, {
              toValue: 1,
              duration: duration * 0.6,
              useNativeDriver: true,
              easing: (t) => t * t, // Aceleração no início
            }),
            // Expande a altura rapidamente
            Animated.timing(heightAnimation, {
              toValue: 1,
              duration: duration * 0.9,
              useNativeDriver: false,
              easing: t => 1 - Math.pow(1 - t, 3), // Mais rápido no início, mais suave no final
            }),
            // Mostra o conteúdo imediatamente junto com a expansão
            Animated.timing(opacityAnimation, {
              toValue: 1,
              duration: duration * 0.4, // Bem mais rápido para o conteúdo aparecer
              useNativeDriver: true,
              easing: t => t, // Linear para aparecer rápido
            }),
          ]).start();
        } else {
          // Ao fechar: primeiro esconde o conteúdo, depois colapsa - mais rápido
          Animated.sequence([
            // Rapidamente reduz a opacidade 
            Animated.timing(opacityAnimation, {
              toValue: 0,
              duration: duration * 0.3, // Bem mais rápido
              useNativeDriver: true,
              easing: t => t, // Linear
            }),
            // Após começar a esconder, colapsa e rotaciona (praticamente imediato)
            Animated.parallel([
              Animated.timing(rotateAnimation, {
                toValue: 0,
                duration: duration * 0.5,
                useNativeDriver: true,
                easing: t => t, // Linear
              }),
              Animated.timing(heightAnimation, {
                toValue: 0,
                duration: duration * 0.6,
                useNativeDriver: false,
                easing: t => t * t, // Aceleração no início
              }),
            ]),
          ]).start();
        }
      } else {
        // Mobile: Usar LayoutAnimation com configuração otimizada
        LayoutAnimation.configureNext(newIsOpen ? openAnimConfig : closeAnimConfig);
      }
      
      setIsOpenLocal(newIsOpen);
    }
    
    onToggle && onToggle(newIsOpen);
  };
  
  // Calcular rotação do ícone
  const rotate = rotateAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '180deg'],
  });
  
  // Estilo para o container do acordeão
  const containerStyle = StyleSheet.create({
    container: {
      width: '100%',
      overflow: 'hidden',
      backgroundColor: isDark ? '#1C1E26' : '#FFFFFF',
      borderRadius: effectiveShowOutline ? 6 : 0,
      marginBottom: effectiveShowOutline ? 8 : 0, // Remover margem inferior quando não tem contorno
      borderWidth: effectiveShowOutline && bordered ? 1 : 0,
      borderColor: isDark ? '#262D34' : '#E0E3E7',
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: 12,
      minHeight: 48,
    },
    title: {
      fontSize: 16,
      color: isDark ? '#FFFFFF' : '#14181B',
      fontWeight: '500',
      flex: 1,
    } as TextStyle,
    content: {
      padding: 12,
      paddingTop: isOpen ? 4 : 0,
      paddingBottom: 8,
      // Otimização para Android/iOS
      ...(Platform.OS !== 'web' ? {
        opacity: 1, // Controlado por LayoutAnimation
        transform: [{
          translateY: 0 as const, // Permite animação de hardware-accelerated
          scale: 1 as const,     // Permite animação de hardware-accelerated
        }],
      } : {})
    } as ViewStyle,
    contentText: {
      fontSize: 14,
      color: isDark ? '#D1D5DB' : '#57636C',
      lineHeight: 20,
    } as TextStyle,
    // Separador externo - linha divisória única
    outerSeparator: {
      height: 1,
      backgroundColor: isDark ? '#262D34' : '#E0E3E7',
      width: '100%',
      marginTop: 0,
      marginBottom: 0,
    }
  });
  
  // Adicionar estilos de hover para web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* Estilo para o header do accordion */
        [data-accordion-header="true"]:hover:not([data-disabled="true"]) {
          background-color: ${isDark ? 'rgba(255, 255, 255, 0.03)' : 'rgba(0, 0, 0, 0.02)'};
          transition: all 0.2s ease;
        }
        
        /* Estilo para o ícone */
        [data-accordion-icon="true"] {
          transition: transform ${animationDuration * 0.4}ms cubic-bezier(0.175, 0.885, 0.32, 1.275);
          will-change: transform;
        }
        
        /* Animação suave para o conteúdo */
        [data-accordion-content="true"] {
          transition: 
            max-height ${animationDuration * 0.9}ms cubic-bezier(0.33, 1, 0.68, 1), 
            opacity ${animationDuration * 0.4}ms ease-in-out,
            transform ${animationDuration * 0.4}ms cubic-bezier(0.33, 1, 0.68, 1);
          backface-visibility: hidden;
          will-change: max-height, opacity, transform;
          transform: translateZ(0);
        }
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark, animationDuration]);

  // Renderizar o cabeçalho do acordeão
  const renderHeader = () => {
    if (customHeader) {
      return (
        <TouchableOpacity 
          onPress={toggleAccordion} 
          testID={`${testID}-header`}
          activeOpacity={0.7}
        >
          {customHeader(isOpen)}
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={[containerStyle.header, headerStyle]}
        onPress={toggleAccordion}
        testID={`${testID}-header`}
        activeOpacity={0.7}
        {...(Platform.OS === 'web' ? {
          'data-accordion-header': 'true',
        } : {})}
      >
        <Text style={containerStyle.title} numberOfLines={1}>
          {title}
        </Text>
        
        <Animated.View
          style={{
            transform: [{ rotate }]
          }}
          {...(Platform.OS === 'web' ? {
            'data-accordion-icon': 'true',
          } : {})}
        >
          <ChevronDown size={16} color={isDark ? '#95A1AC' : '#57636C'} />
        </Animated.View>
      </TouchableOpacity>
    );
  };
  
  // Renderizar o conteúdo do acordeão
  const renderContent = () => {
    if (!isOpen && Platform.OS !== 'web') {
      return null;
    }
    
    const contentElement = (
      <View 
        style={[
          containerStyle.content,
          contentStyle as ViewStyle, 
          Platform.OS === 'web' ? {
            // Adicionar opacidade no estilo diretamente para web
            opacity: isOpen ? 1 : 0,
            transform: [{ 
              translateY: isOpen ? 0 : -5 // Pequeno deslocamento para efeito visual
            }]
          } : {}
        ]}
        ref={contentRef}
        testID={`${testID}-content`}
      >
        {children ? (
          children
        ) : (
          <Text style={containerStyle.contentText as TextStyle}>{content}</Text>
        )}
      </View>
    );
    
    if (Platform.OS === 'web') {
      return (
        <Animated.View
          style={{
            opacity: opacityAnimation,
            maxHeight: heightAnimation.interpolate({
              inputRange: [0, 1],
              outputRange: ['0px', '2000px'],
            }),
            transform: [{ 
              translateY: opacityAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [-8, 0], // Desloca o conteúdo levemente durante animação
              }) as any
            }],
            overflow: 'hidden',
          } as any}
          {...(Platform.OS === 'web' ? {
            'data-accordion-content': 'true',
          } : {})}
        >
          {contentElement}
        </Animated.View>
      );
    }
    
    return contentElement;
  };

  // Combinar lógica de separadores em um único separador externo
  // Mostrar sempre que:
  // 1. Não tem contorno (showOutline=false) E
  // 2. O separador está habilitado (showSeparator=true)
  // Agora mostra para todos os itens, incluindo o último
  const needsSeparator = !effectiveShowOutline && effectiveShowSeparator;

  return (
    <>
      <View style={[containerStyle.container, style]} testID={testID}>
        {renderHeader()}
        {renderContent()}
      </View>
      {needsSeparator && <View style={containerStyle.outerSeparator} />}
    </>
  );
}; 