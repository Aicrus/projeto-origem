import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Platform, Keyboard, PanResponder, GestureResponderEvent, PanResponderGestureState, Modal, ScrollView } from 'react-native';
import { Eye, EyeOff, Search, X, Calendar, Plus, Minus, Clock, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '../../hooks/DesignSystemContext';
import { useResponsive } from '../../hooks/useResponsive';
import { colors, ColorType } from '../../design-system/tokens/colors';
import { spacing } from '../../design-system/tokens/spacing';
import { borderRadius, getBorderRadius } from '../../design-system/tokens/borders';
import { fontSize, fontFamily } from '../../design-system/tokens/typography';
import { opacity, getOpacity } from '../../design-system/tokens/effects';

/**
 * @component Input
 * @description Componente de entrada de texto altamente personalizável que suporta:
 * - Vários formatos: texto simples, senha, pesquisa, número, email, data
 * - Máscaras: CPF, CNPJ, telefone, data, CEP, moeda
 * - Tema claro/escuro automático
 * - Responsividade
 * - Estados: erro, desabilitado, foco
 * - Acessibilidade e personalização
 * 
 * Exemplos de uso:
 * 
 * ```tsx
 * // Input simples
 * <Input 
 *   value={texto} 
 *   onChangeText={setTexto} 
 *   label="Nome" 
 *   placeholder="Digite seu nome" 
 * />
 * 
 * // Input com máscara de CPF
 * <Input 
 *   value={cpf} 
 *   onChangeText={setCpf} 
 *   label="CPF" 
 *   mask="cpf" 
 *   keyboardType="numeric" 
 * />
 * 
 * // Input de senha
 * <Input 
 *   value={senha} 
 *   onChangeText={setSenha} 
 *   type="password" 
 *   label="Senha" 
 * />
 * 
 * // Input de busca
 * <Input 
 *   value={busca} 
 *   onChangeText={setBusca} 
 *   type="search" 
 *   onClear={() => setBusca('')} 
 * />
 * 
 * // Input de data
 * <Input 
 *   value={data} 
 *   onChangeText={setData} 
 *   type="date" 
 *   mask="date" 
 *   placeholder="dd/mm/aaaa" 
 *   label="Data" 
 * />
 * ```
 */

export interface InputProps {
  /** Valor atual do input */
  value: string;
  /** Função chamada quando o valor muda */
  onChangeText: (text: string) => void;
  /** Texto exibido quando o input está vazio */
  placeholder?: string;
  /** Rótulo exibido acima do input */
  label?: string;
  /** Mensagem de erro exibida abaixo do input */
  error?: string;
  /** Se o input está desabilitado */
  disabled?: boolean;
  /** Tipo de input - determina o comportamento e ícones */
  type?: 'text' | 'password' | 'search' | 'number' | 'email' | 'date' | 'time';
  /** Máscara aplicada ao texto digitado */
  mask?: 'cpf' | 'cnpj' | 'phone' | 'date' | 'time' | 'cep' | 'currency' | 'none';
  /** Número máximo de caracteres permitidos */
  maxLength?: number;
  /** Como capitalizar o texto automaticamente */
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  /** Se deve corrigir o texto automaticamente */
  autoCorrect?: boolean;
  /** Sugestão de preenchimento automático (web) */
  autoComplete?: string;
  /** Tipo de teclado exibido */
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  /** Tipo de botão de retorno no teclado */
  returnKeyType?: 'done' | 'go' | 'next' | 'search' | 'send';
  /** Função chamada ao pressionar o botão de retorno */
  onSubmitEditing?: () => void;
  /** Função chamada quando o input recebe foco */
  onFocus?: () => void;
  /** Função chamada quando o input perde foco */
  onBlur?: () => void;
  /** Se o input deve permitir múltiplas linhas */
  multiline?: boolean;
  /** Número de linhas visíveis quando multiline=true */
  numberOfLines?: number;
  /** Função chamada quando o botão de limpar é pressionado */
  onClear?: () => void;
  /** Função chamada quando o ícone de calendário é pressionado (apenas para type="date") */
  onCalendarPress?: () => void;
  /** Componente de ícone personalizado para exibir à direita do input */
  rightIcon?: React.ComponentType;
  /** Função chamada quando o ícone à direita é pressionado */
  onRightIconPress?: () => void;
  /** ID para testes automatizados */
  testID?: string;
  /** Estilo personalizado para o container do input */
  style?: any;
  /** Estilo personalizado para o texto do input */
  inputStyle?: any;
  /** Se o input deve receber foco automaticamente ao ser renderizado */
  autoFocus?: boolean;
  /** Valor mínimo (para type="number") */
  min?: number;
  /** Valor máximo (para type="number") */
  max?: number;
  /** Incremento/decremento (para type="number") */
  step?: number;
  /** Se deve mostrar botões de incremento/decremento (para type="number") */
  showNumberControls?: boolean;
  /** Função chamada quando o botão de relógio é pressionado (apenas para type="time") */
  onTimePress?: () => void;
  /** Se o input deve ser redimensionável (funciona em todas as plataformas quando multiline=true) */
  resizable?: boolean;
  /** Altura mínima para inputs redimensionáveis */
  minHeight?: number;
  /** Altura máxima para inputs redimensionáveis */
  maxHeight?: number;
  /** Função para desativar o scroll do container pai (necessário para redimensionamento no nativo) */
  setScrollEnabled?: (enabled: boolean) => void;
}

export const Input = ({
  value,
  onChangeText,
  placeholder = '',
  label,
  error,
  disabled = false,
  type = 'text',
  mask = 'none',
  maxLength,
  autoCapitalize = 'none',
  autoCorrect = true,
  autoComplete,
  keyboardType = 'default',
  returnKeyType = 'done',
  onSubmitEditing,
  onFocus,
  onBlur,
  multiline = false,
  numberOfLines = 1,
  onClear,
  onCalendarPress,
  onTimePress,
  rightIcon,
  onRightIconPress,
  testID,
  style,
  inputStyle,
  autoFocus = false,
  min,
  max,
  step = 1,
  showNumberControls = false,
  resizable = false,
  minHeight = 38,
  maxHeight = 200,
  setScrollEnabled,
}: InputProps) => {
  // Estado para controlar visibilidade da senha
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Estado para controlar foco
  const [isFocused, setIsFocused] = useState(false);
  
  // Estado para controlar altura do input (para multiline)
  const [inputHeight, setInputHeight] = useState<number | undefined>(undefined);
  
  // Referência ao input nativo para web
  const inputRef = useRef<TextInput>(null);
  
  // Referência ao input number nativo HTML5 para web 
  const nativeNumberInputRef = useRef<HTMLInputElement>(null);
  
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Obter cores do design system
  const getThemeColor = (baseColor: string): string => {
    const darkKey = `${baseColor}-dark` as ColorType;
    const lightKey = `${baseColor}-light` as ColorType;
    return isDark ? colors[darkKey] : colors[lightKey];
  };
  
  // Responsividade
  const { isMobile } = useResponsive();
  
  // Verificar se estamos na plataforma web
  const isWeb = Platform.OS === 'web';
  
  // Estado para controlar altura do input no nativo quando redimensionável
  const [nativeInputHeight, setNativeInputHeight] = useState(multiline ? minHeight : 38);
  
  // Ref para armazenar a posição inicial do toque para redimensionamento
  const touchStartY = useRef(0);
  
  // Estados para calendário personalizado (web)
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarDate, setCalendarDate] = useState(new Date());
  
  // Estados para seletor de hora personalizado (web)
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedHour, setSelectedHour] = useState(12);
  const [selectedMinute, setSelectedMinute] = useState(0);
  
  // Função para desabilitar o scroll do componente pai durante o redimensionamento
  const disableParentScroll = () => {
    if (setScrollEnabled && !isWeb) {
      setScrollEnabled(false);
    }
  };

  // Função para reabilitar o scroll do componente pai após o redimensionamento
  const enableParentScroll = () => {
    if (setScrollEnabled && !isWeb) {
      setScrollEnabled(true);
    }
  };
  
  // Configurar PanResponder para manipular gestos de redimensionamento no nativo
  const panResponder = useRef(
    PanResponder.create({
      // Capturar qualquer toque que comece na área da alça de redimensionamento
      onStartShouldSetPanResponder: () => true,
      // Capturar movimentos mesmo que outro componente já tenha capturado
      onStartShouldSetPanResponderCapture: () => true,
      // Também capturar movimentos novos que começaram em outro lugar
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Somente responder a movimentos verticais significativos
        return Math.abs(gestureState.dy) > 2;
      },
      // Capturar todos os movimentos durante o redimensionamento com alta prioridade
      onMoveShouldSetPanResponderCapture: (_, gestureState) => {
        // Somente para movimentos verticais significativos
        return Math.abs(gestureState.dy) > 2;
      },
      onPanResponderGrant: (evt: GestureResponderEvent) => {
        // Armazena posição inicial do toque
        touchStartY.current = evt.nativeEvent.pageY;
        
        // Impede o scroll nativo da página
        if (Platform.OS === 'web') {
          document.body.style.overflow = 'hidden';
        } else {
          // Desativa o scroll de forma enfática
          disableParentScroll();
          Keyboard.dismiss(); // Garantir que o teclado esteja fechado para foco total no redimensionamento
        }
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        if (!resizable || !multiline) return;
        
        // Previne o evento de scroll padrão
        evt.preventDefault?.();
        
        // Previne que o evento se propague para outros manipuladores
        evt.stopPropagation?.();
        
        // Calcula a nova altura com base no movimento do dedo
        const newHeight = nativeInputHeight + gestureState.dy;
        
        // Aplica limites mínimo e máximo
        if (newHeight >= minHeight && newHeight <= maxHeight) {
          setNativeInputHeight(newHeight);
        }
        
        // Retorna true para indicar que o evento foi consumido
        return true;
      },
      onPanResponderRelease: () => {
        // Reseta a posição inicial
        touchStartY.current = 0;
        
        // Restaura o scroll nativo da página
        if (Platform.OS === 'web') {
          document.body.style.overflow = '';
        } else {
          // Atrasa ligeiramente a reativação do scroll para evitar conflitos
          setTimeout(() => {
            enableParentScroll();
          }, 100);
        }
      },
      onPanResponderTerminate: () => {
        // Restaura o scroll nativo da página caso o gesto seja interrompido
        if (Platform.OS === 'web') {
          document.body.style.overflow = '';
        } else {
          enableParentScroll();
        }
      },
      // Não ceder o responder a outros componentes
      onPanResponderTerminationRequest: () => false
    })
  ).current;
  
  // Estilo do container do input
  const containerStyle = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: error ? Number(spacing['1'].replace('px', '')) : 0,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: Number(getBorderRadius('md').replace('px', '')),
      backgroundColor: isDark ? colors['bg-primary-dark'] : colors['bg-primary-light'],
      borderColor: error 
        ? isDark ? colors['error-border-dark'] : colors['error-border-light']
        : isFocused
          ? isDark ? colors['primary-dark'] : colors['primary-light']
          : isDark ? colors['divider-dark'] : colors['divider-light'],
      minHeight: Number(spacing['9'].replace('px', '')), // Voltando para spacing-9 (era spacing-9, aumentei para 10, agora volta para 9)
      paddingHorizontal: Number(spacing['3'].replace('px', '')),
      // Sombra sutil para dar profundidade (similar ao shadcn)
      shadowColor: isDark ? '#000000' : '#000000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: isDark ? 0.3 : 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    inputStyle: {
      flex: 1,
      color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
      fontSize: Number(fontSize['body-md'].size.replace('px', '')),
      lineHeight: Platform.OS === 'web' 
        ? Number(fontSize['body-md'].lineHeight.replace('px', ''))
        : Number(fontSize['body-md'].size.replace('px', '')) * 1.3, // Aumentado para melhor proporção
      fontFamily: fontFamily['jakarta-regular'],
      paddingVertical: Platform.OS === 'web' 
        ? Number(spacing['2.5'].replace('px', ''))
        : Number(spacing['3.5'].replace('px', '')), // Mais padding para altura maior
      height: multiline ? undefined : Number(spacing['9'].replace('px', '')), // Voltando para spacing-9
      textAlignVertical: multiline ? 'top' : 'center',
      ...(Platform.OS === 'ios' && multiline ? { paddingTop: Number(spacing['2.5'].replace('px', '')) } : {}),
      // Ajustes específicos para o nativo para evitar corte do texto
      ...(Platform.OS !== 'web' && !multiline ? {
        includeFontPadding: false, // Remove padding extra no Android
        textAlignVertical: 'center',
        paddingTop: 0,
        paddingBottom: 0,
      } : {}),
    },
    searchIcon: {
      padding: Number(spacing['1'].replace('px', '')), // Aumentado para melhor proporção
      marginRight: Number(spacing['2'].replace('px', '')), // Aumentado
      marginLeft: -2, // Ajustado para novo tamanho
    },
    iconContainer: {
      padding: Number(spacing['1.5'].replace('px', '')), // Aumentado para melhor área de toque
      borderRadius: Number(getBorderRadius('sm').replace('px', '')), // Adiciona border radius nos ícones
    },
    labelStyle: {
      fontSize: Number(fontSize['label-sm'].size.replace('px', '')),
      lineHeight: Number(fontSize['label-sm'].lineHeight.replace('px', '')),
      fontFamily: fontFamily['jakarta-medium'],
      marginBottom: Number(spacing['1.5'].replace('px', '')), // Aumentado para melhor espaçamento
      color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'], // Mudado para primary para maior contraste
    },
    errorText: {
      fontSize: Number(fontSize['body-sm'].size.replace('px', '')),
      lineHeight: Number(fontSize['body-sm'].lineHeight.replace('px', '')),
      fontFamily: fontFamily['jakarta-regular'],
      color: isDark ? colors['error-text-dark'] : colors['error-text-light'],
      marginTop: Number(spacing['1'].replace('px', '')), // Aumentado para melhor espaçamento
    },
    numberControlsContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      bottom: 0,
      width: Number(spacing['6'].replace('px', '')),
      borderTopRightRadius: Number(getBorderRadius('md').replace('px', '')),
      borderBottomRightRadius: Number(getBorderRadius('md').replace('px', '')),
      overflow: 'hidden',
      flexDirection: 'column',
      justifyContent: 'space-between',
      backgroundColor: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
      borderLeftWidth: 1,
      borderLeftColor: isDark ? colors['divider-dark'] : colors['divider-light'],
    },
    numberControlButton: {
      height: '50%',
      width: Number(spacing['6'].replace('px', '')),
      alignItems: 'center',
      justifyContent: 'center',
    },
    numberControlButtonUp: {
      borderBottomWidth: 1,
      borderBottomColor: isDark ? colors['divider-dark'] : colors['divider-light'],
    },
    numberControlButtonDown: {
      borderTopWidth: 0,
    },
  });
  
  // Função para aplicar máscara
  const applyMask = (text: string): string => {
    if (!text) return '';
    
    // Implementação básica de algumas máscaras
    switch (mask) {
      case 'cpf':
        // Remove caracteres não numéricos
        text = text.replace(/\D/g, '');
        // Limita a 11 dígitos (CPF completo)
        text = text.substring(0, 11);
        // Aplica máscara de CPF: 000.000.000-00
        text = text.replace(/(\d{3})(\d)/, '$1.$2');
        text = text.replace(/(\d{3})(\d)/, '$1.$2');
        text = text.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return text;
        
      case 'cnpj':
        // Remove caracteres não numéricos
        text = text.replace(/\D/g, '');
        // Limita a 14 dígitos (CNPJ completo)
        text = text.substring(0, 14);
        // Aplica máscara de CNPJ: 00.000.000/0000-00
        text = text.replace(/(\d{2})(\d)/, '$1.$2');
        text = text.replace(/(\d{3})(\d)/, '$1.$2');
        text = text.replace(/(\d{3})(\d)/, '$1/$2');
        text = text.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        return text;
        
      case 'phone':
        // Remove caracteres não numéricos
        text = text.replace(/\D/g, '');
        // Aplica máscara de telefone: (00) 00000-0000 ou (00) 0000-0000
        if (text.length > 10) {
          // Celular: (00) 00000-0000
          text = text.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else {
          // Fixo: (00) 0000-0000
          text = text.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        }
        return text.substring(0, 15);
        
      case 'date':
        // Remove caracteres não numéricos
        text = text.replace(/\D/g, '');
        // Aplica máscara de data: dd/mm/aaaa
        text = text.replace(/(\d{2})(\d)/, '$1/$2');
        text = text.replace(/(\d{2})(\d)/, '$1/$2');
        return text.substring(0, 10);
        
      case 'cep':
        // Remove caracteres não numéricos
        text = text.replace(/\D/g, '');
        // Aplica máscara de CEP: 00000-000
        text = text.replace(/(\d{5})(\d{0,3})/, '$1-$2');
        return text.substring(0, 9);
        
      case 'currency':
        // Remove tudo exceto números e ponto
        text = text.replace(/[^\d.]/g, '');
        
        // Converte para número e formata
        const number = parseFloat(text);
        if (isNaN(number)) return 'R$ 0,00';
        
        // Formata para moeda brasileira
        return `R$ ${number.toFixed(2).replace('.', ',')}`;
        
      case 'time':
        // Remove caracteres não numéricos
        text = text.replace(/\D/g, '');
        // Aplica máscara de hora: HH:MM
        text = text.replace(/(\d{2})(\d{0,2})/, '$1:$2');
        return text.substring(0, 5);
        
      default:
        return text;
    }
  };
  
  // Função para lidar com mudança de texto
  const handleChangeText = (text: string) => {
    // Se for tipo data, define automaticamente a máscara de data
    // Se for tipo time, define automaticamente a máscara de time
    let activeMask = mask;
    if (type === 'date' && mask === 'none') activeMask = 'date';
    if (type === 'time' && mask === 'none') activeMask = 'time';
    
    if (activeMask !== 'none') {
      // Aplica máscara se necessário
      text = applyMask(text);
    }
    
    onChangeText(text);
  };
  
  // Alterna visibilidade da senha
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };
  
  // Lidar com foco
  const handleFocus = () => {
    setIsFocused(true);
    onFocus && onFocus();
  };
  
  // Lidar com perda de foco
  const handleBlur = () => {
    setIsFocused(false);
    onBlur && onBlur();
  };
  
  // Limpar o campo
  const handleClear = () => {
    onChangeText('');
    onClear && onClear();
    // Focar no input após limpar
    inputRef.current?.focus();
  };
  
  // Função para lidar com clique no ícone direito personalizado
  const handleRightIconPress = () => {
    if (onRightIconPress) {
      onRightIconPress();
    }
  };
  
  // Função para abrir o seletor de data (se disponível)
  const handleCalendarPress = () => {
    if (onCalendarPress) {
      onCalendarPress();
    } else if (isWeb && type === 'date') {
      // Para web, abrimos o calendário personalizado
      setShowCalendar(true);
      // Inicializa com a data atual do input ou hoje
      if (value) {
        const dateParts = value.split('/');
        if (dateParts.length === 3) {
          const day = parseInt(dateParts[0]);
          const month = parseInt(dateParts[1]) - 1;
          const year = parseInt(dateParts[2]);
          setCalendarDate(new Date(year, month, day));
        }
      }
    } else if (isWeb) {
      // Fallback para input nativo
      inputRef.current?.focus();
    }
  };
  
  // Função para abrir o input number nativo para web
  const focusNumberInput = () => {
    if (isWeb && type === 'number' && nativeNumberInputRef.current) {
      nativeNumberInputRef.current.focus();
    }
  };
  
  // Função para abrir o seletor de hora personalizado
  const handleTimePress = () => {
    if (onTimePress) {
      onTimePress();
    } else if (isWeb && type === 'time') {
      // Para web, abrimos o seletor personalizado
      setShowTimePicker(true);
      // Inicializa com a hora atual do input ou agora
      if (value) {
        const timeParts = value.split(':');
        if (timeParts.length === 2) {
          setSelectedHour(parseInt(timeParts[0]));
          setSelectedMinute(parseInt(timeParts[1]));
        }
      } else {
        const now = new Date();
        setSelectedHour(now.getHours());
        setSelectedMinute(now.getMinutes());
      }
    }
  };
  
  // Função para lidar com mudança no input number nativo HTML5
  const handleWebNativeNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numValue = e.target.value;
    onChangeText(numValue);
  };
  
  // Função para lidar com incremento e decremento para inputs numéricos
  const handleIncrement = () => {
    if (type !== 'number') return;
    
    // Converte o valor atual para número
    let numValue = value ? parseFloat(value) : 0;
    
    // Incrementa pelo valor do step
    numValue += step;
    
    // Verifica o valor máximo
    if (max !== undefined && numValue > max) {
      numValue = max;
    }
    
    // Formata o valor de volta para string
    onChangeText(numValue.toString());
  };
  
  const handleDecrement = () => {
    if (type !== 'number') return;
    
    // Converte o valor atual para número
    let numValue = value ? parseFloat(value) : 0;
    
    // Decrementa pelo valor do step
    numValue -= step;
    
    // Verifica o valor mínimo
    if (min !== undefined && numValue < min) {
      numValue = min;
    }
    
    // Formata o valor de volta para string
    onChangeText(numValue.toString());
  };
  
  // Determinar tipo seguro de teclado
  const getKeyboardType = () => {
    if (keyboardType !== 'default') return keyboardType;
    
    // Definir tipo de teclado com base no mask ou type
    if (mask === 'cpf' || mask === 'cnpj' || mask === 'phone' || mask === 'date' || mask === 'time' || mask === 'cep' || mask === 'currency' || type === 'date' || type === 'time') {
      return 'numeric';
    }
    
    if (type === 'number') return 'numeric';
    if (type === 'email') return 'email-address';
    
    return 'default';
  };
  
  // Função para lidar com mudanças no tamanho do conteúdo (para multiline)
  const handleContentSizeChange = (event: any) => {
    if (multiline) {
      if (isWeb) {
        setInputHeight(event.nativeEvent.contentSize.height);
      } else if (!resizable) {
        // No nativo, só ajusta automaticamente se não for redimensionável
        setInputHeight(event.nativeEvent.contentSize.height);
      }
    }
  };
  
  // Adicionar estilos de hover para web
  useEffect(() => {
    if (isWeb) {
      const style = document.createElement('style');
      style.textContent = `
        /* Estilos para o input */
        [data-input-container="true"] {
          transition: all 0.2s ease-in-out;
        }
        
        [data-input-container="true"]:hover:not([data-disabled="true"]) {
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border-color: ${isDark ? colors['primary-dark'] : colors['primary-light']};
          transition: all 0.2s ease-in-out;
        }
        
        [data-input-container="true"]:focus-within {
          box-shadow: 0 0 0 2px ${isDark ? colors['primary-dark'] + '40' : colors['primary-light'] + '40'};
          transition: all 0.2s ease-in-out;
        }
        
        /* Estilo para os ícones */
        [data-input-icon="true"] {
          transition: all 0.2s ease;
          border-radius: 4px;
        }
        
        [data-input-icon="true"]:hover {
          background-color: ${isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light']};
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        /* Remover highlight/seleção azul padrão nos navegadores */
        input:focus,
        textarea:focus {
          outline: none !important;
          outline-width: 0 !important;
          box-shadow: none !important;
          -moz-box-shadow: none !important;
          -webkit-box-shadow: none !important;
        }
        
        /* Remover cor de seleção padrão (azul) */
        input::selection,
        textarea::selection {
          background-color: rgba(128, 128, 128, 0.2) !important;
          color: inherit !important;
        }
        
        /* Estilo para controles numéricos */
        [data-input-number-control] {
          transition: all 0.2s ease;
        }
        
        [data-input-number-control]:hover:not(:disabled) {
          background-color: ${getThemeColor('divider')};
          cursor: pointer;
          opacity: 0.8;
          transition: all 0.2s ease;
        }
        
        [data-input-number-control]:active:not(:disabled) {
          background-color: ${getThemeColor('primary')};
          transform: scale(0.98);
          transition: all 0.1s ease;
        }
        
        /* Estilos para o input numérico nativo do HTML5 */
        input[type="number"]::-webkit-inner-spin-button,
        input[type="number"]::-webkit-outer-spin-button {
          opacity: 1;
          height: 38px;
          position: absolute;
          top: 0;
          right: 0;
          cursor: pointer;
        }
        
        /* Cor normal para os elementos do número (igual aos outros inputs) */
        input[type="number"] {
          color: ${isDark ? colors['text-primary-dark'] : colors['text-primary-light']};
        }
        
        /* Hack para aplicar cores neutras no spinner */
        :root {
          accent-color: ${isDark ? colors['text-secondary-dark'] : colors['text-secondary-light']} !important;
          --number-spinner-color: ${isDark ? colors['text-secondary-dark'] : colors['text-secondary-light']} !important;
        }
        
        /* Adiciona suporte a cores neutras no spinner */
        @supports (accent-color: ${isDark ? colors['text-secondary-dark'] : colors['text-secondary-light']}) {
          input[type="number"] {
            accent-color: ${isDark ? colors['text-secondary-dark'] : colors['text-secondary-light']};
          }
        }
        
        /* Estilos específicos para tema escuro */
        ${isDark ? `
          input[type="number"]::-webkit-inner-spin-button {
            filter: invert(0.8);
          }
        ` : ''}
        
        /* Container para o input number nativo */
        [data-number-input-container] {
          position: relative;
        }
        
        .native-number-input {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          opacity: 1;
          background: transparent;
          border: none;
          color: ${isDark ? colors['text-primary-dark'] : colors['text-primary-light']};
          font-size: 14px;
          padding: 8px 25px 8px 12px;
          z-index: 1;
          border-radius: 6px;
        }
        
        /* Estilos para input redimensionável */
        textarea.resizable {
          resize: vertical;
          min-height: ${minHeight}px;
          max-height: ${maxHeight}px;
          overflow-y: auto;
          padding-bottom: 16px; /* Espaço para o indicador de redimensionamento */
          text-align-vertical: top !important;
        }
        
        /* Container para inputs redimensionáveis */
        [data-input-container][data-multiline="true"] {
          position: relative;
          overflow: visible;
        }
        
        /* Ícone de redimensionamento visível (semelhante ao nativo) */
        [data-resize-handle] {
          position: absolute;
          bottom: 2px;
          right: 2px;
          width: 18px;
          height: 18px;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 10;
          pointer-events: auto;
          cursor: nw-resize;
        }
        
        /* Não esconda o redimensionador nativo, apenas estilize o nosso ícone por cima */
        textarea::-webkit-resizer {
          background-color: transparent;
        }
      `;
      document.head.appendChild(style);
      
      // Adicionando prevenção de scroll quando o cursor estiver sobre o input numérico
      const handleWheel = (e: WheelEvent) => {
        // Verifica se o alvo do evento é um input do tipo number ou está dentro de um container de input number
        const target = e.target as HTMLElement;
        const isNumberInput = target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'number';
        const isInNumberInputContainer = target.closest('[data-number-input-container]') !== null;
        
        if (isNumberInput || isInNumberInputContainer) {
          // Previne o scroll da página
          e.preventDefault();
          
          // Encontra o input numérico
          let inputElement: HTMLInputElement | null = null;
          if (isNumberInput) {
            inputElement = target as HTMLInputElement;
          } else if (isInNumberInputContainer) {
            inputElement = target.closest('[data-number-input-container]')?.querySelector('input[type="number"]') || null;
          }
          
          if (inputElement) {
            // Obtém os valores atuais
            const currentValue = parseFloat(inputElement.value) || 0;
            const step = parseFloat(inputElement.step) || 1;
            const min = inputElement.min !== '' ? parseFloat(inputElement.min) : undefined;
            const max = inputElement.max !== '' ? parseFloat(inputElement.max) : undefined;
            
            // Determina a direção do scroll (negativo = para cima = aumentar valor)
            let newValue = currentValue;
            if (e.deltaY < 0) {
              // Scroll para cima, aumenta o valor
              newValue = currentValue + step;
              if (max !== undefined && newValue > max) newValue = max;
            } else {
              // Scroll para baixo, diminui o valor
              newValue = currentValue - step;
              if (min !== undefined && newValue < min) newValue = min;
            }
            
            // Atualiza o valor do input
            inputElement.value = newValue.toString();
            
            // Dispara um evento de change para que React e outros frameworks detectem a mudança
            const event = new Event('change', { bubbles: true });
            inputElement.dispatchEvent(event);
            
            // Se tiver um evento de input, também dispara
            const inputEvent = new Event('input', { bubbles: true });
            inputElement.dispatchEvent(inputEvent);
          }
        }
      };
      
      // Adiciona o listener em modo de captura para garantir que ele é executado antes do comportamento padrão
      document.addEventListener('wheel', handleWheel, { passive: false, capture: true });
      
      return () => {
        document.head.removeChild(style);
        document.removeEventListener('wheel', handleWheel, { capture: true });
      };
    }
  }, [isDark, minHeight, maxHeight]);

  // Efeito para garantir que o texto comece no topo em inputs multilinhas
  useEffect(() => {
    if (multiline && inputRef.current) {
      // Forçar o alinhamento vertical no topo no iOS/Android
      if (Platform.OS !== 'web') {
        const node = inputRef.current;
        if (node) {
          // Forçar re-render para garantir que o textAlignVertical seja aplicado
          setTimeout(() => {
            const currentSelection = node.props?.selection;
            node.setNativeProps({
              style: { textAlignVertical: 'top' },
              selection: currentSelection
            });
          }, 50);
        }
      }
    }
  }, [multiline]);
  
  // Função para garantir que o texto comece no topo em inputs multilinhas
  const initInputLayout = () => {
    if (multiline && inputRef.current && Platform.OS !== 'web') {
      // Garante que o texto comece no topo
      inputRef.current.setNativeProps({
        style: { textAlignVertical: 'top' }
      });
    }
  };
  
  // Executar inicialização após a montagem
  useEffect(() => {
    // Chamar a função de inicialização
    if (multiline && inputRef.current && Platform.OS !== 'web') {
      // Garante que o texto comece no topo
      inputRef.current.setNativeProps({
        style: { textAlignVertical: 'top' }
      });
    }
  }, [multiline]);

  // Funções auxiliares para o calendário
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };
  
  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };
  
  const formatDateValue = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };
  
  const formatTimeValue = (hour: number, minute: number) => {
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  };
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  return (
    <View style={[containerStyle.container, style]}>
      {label && (
        <Text style={containerStyle.labelStyle}>{label}</Text>
      )}
      
      <View 
        style={[
          containerStyle.inputContainer, 
          disabled ? { 
            opacity: 0.6, 
            backgroundColor: isDark ? colors['bg-tertiary-dark'] : colors['bg-tertiary-light'] // Fundo mais sutil quando desabilitado
          } : {},
          type === 'number' && showNumberControls && !isWeb ? { paddingRight: 32 } : {},
          multiline && { minHeight: minHeight },
          !isWeb && multiline && resizable ? { height: nativeInputHeight } : {},
          multiline ? { alignItems: 'flex-start' } : {}
        ]}
        {...(isWeb ? {
          'data-input-container': 'true',
          'data-disabled': disabled ? 'true' : 'false',
          'data-multiline': multiline ? 'true' : 'false',
          ...(type === 'number' ? { 'data-number-input-container': 'true' } : {})
        } : {})}
        onLayout={() => {
          if (multiline && inputRef.current && Platform.OS !== 'web') {
            inputRef.current.setNativeProps({
              style: { textAlignVertical: 'top' }
            });
          }
        }}
      >
        {/* Ícone de pesquisa para type="search" */}
        {type === 'search' && (
          <View style={containerStyle.searchIcon}>
            <Search 
              size={16} 
              color={getThemeColor('text-secondary')} 
            />
          </View>
        )}
        
        {/* Input numérico nativo HTML5 para web */}
        {isWeb && type === 'number' && showNumberControls && (
          <input
            ref={nativeNumberInputRef}
            type="number"
            className="native-number-input"
            onChange={handleWebNativeNumberChange}
            value={value || ''}
            min={min}
            max={max}
            step={step}
            disabled={disabled}
            placeholder={placeholder}
          />
        )}
        
        {/* Texto original mascarado para type="number" no web */}
        {isWeb && type === 'number' && showNumberControls ? (
          <View style={{ opacity: 0, height: 0, width: 0, overflow: 'hidden' }}>
            <TextInput
              ref={inputRef}
              style={[
                containerStyle.inputStyle, 
                inputStyle,
                { height: multiline ? inputHeight : undefined }
              ]}
              value={value}
              onChangeText={handleChangeText}
              placeholder={placeholder}
              placeholderTextColor={getThemeColor('text-secondary')}
              editable={!disabled}
              keyboardType={getKeyboardType()}
              onFocus={handleFocus}
              onBlur={handleBlur}
              selectionColor={isDark ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.3)'}
            />
          </View>
        ) : (
                      <TextInput
              ref={inputRef}
              style={[
                containerStyle.inputStyle, 
                inputStyle,
                { height: multiline ? inputHeight : undefined },
                // Adiciona estilos para redimensionamento se necessário
                isWeb && multiline && resizable ? {
                  minHeight: minHeight,
                  maxHeight: maxHeight,
                  height: 'auto'
                } : {},
                // Garante que o texto comece no topo em inputs multilinhas
                multiline ? { textAlignVertical: 'top' } : {}
              ]}
              value={value}
              onChangeText={handleChangeText}
              placeholder={placeholder}
              placeholderTextColor={isDark ? colors['text-tertiary-dark'] : colors['text-tertiary-light']} // Mudado para tertiary para ficar mais sutil
            editable={!disabled}
            secureTextEntry={type === 'password' && !passwordVisible}
            keyboardType={getKeyboardType()}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            // @ts-ignore - Para compatibilidade web
            autoComplete={autoComplete || (type === 'date' ? 'bday' : undefined)}
            returnKeyType={returnKeyType}
            onSubmitEditing={onSubmitEditing}
            onFocus={handleFocus}
            onBlur={handleBlur}
            maxLength={maxLength}
            multiline={multiline}
            numberOfLines={multiline ? numberOfLines : 1}
            testID={testID}
                          // Cor de seleção elegante baseada na cor primária
              selectionColor={isDark ? colors['primary-dark'] + '60' : colors['primary-light'] + '60'}
            autoFocus={autoFocus}
            onContentSizeChange={handleContentSizeChange}
            // Para web, adiciona suporte nativo ao input de data HTML5
            {...(isWeb && type === 'date' ? { 
              type: 'text', // Mantemos como text para usar nossa máscara customizada
              inputMode: 'numeric'
            } : {})}
            // Para web, adiciona suporte à redimensionamento
            {...(isWeb && multiline && resizable ? {
              className: 'resizable'
            } : {})}
            // Garante que o texto comece no topo - IMPORTANTE: esta propriedade precisa ser definida por último
            textAlignVertical={multiline ? 'top' : 'center'}
          />
        )}
        
        {/* Ícone personalizado à direita */}
        {rightIcon && (
          <TouchableOpacity 
            onPress={handleRightIconPress}
            style={containerStyle.iconContainer}
            {...(isWeb ? { 'data-input-icon': 'true' } : {})}
            disabled={disabled}
          >
            {React.createElement(rightIcon)}
          </TouchableOpacity>
        )}
        
        {/* Botão para limpar input quando houver valor e não for disabled */}
        {value.length > 0 && !disabled && onClear && (
          <TouchableOpacity 
            onPress={handleClear}
            style={containerStyle.iconContainer}
            {...(isWeb ? { 'data-input-icon': 'true' } : {})}
          >
            <X 
              size={16} 
              color={getThemeColor('text-secondary')} 
            />
          </TouchableOpacity>
        )}
        
        {/* Ícone de calendário para input tipo data */}
        {type === 'date' && (
          <TouchableOpacity 
            onPress={handleCalendarPress}
            style={containerStyle.iconContainer}
            {...(isWeb ? { 'data-input-icon': 'true' } : {})}
            disabled={disabled}
          >
            <Calendar 
              size={16} 
              color={getThemeColor('text-secondary')} 
            />
          </TouchableOpacity>
        )}
        
        {        /* Ícone de relógio para input tipo hora */}
        {type === 'time' && (
          <TouchableOpacity 
            onPress={handleTimePress}
            style={containerStyle.iconContainer}
            {...(isWeb ? { 'data-input-icon': 'true' } : {})}
            disabled={disabled}
          >
            <Clock 
              size={16} 
              color={getThemeColor('text-secondary')} 
            />
          </TouchableOpacity>
        )}
        
        {/* Botão de mostrar/esconder senha */}
        {type === 'password' && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={containerStyle.iconContainer}
            {...(isWeb ? { 'data-input-icon': 'true' } : {})}
            disabled={disabled}
          >
            {passwordVisible ? (
              <EyeOff 
                size={16} 
                color={getThemeColor('text-secondary')} 
              />
            ) : (
              <Eye 
                size={16} 
                color={getThemeColor('text-secondary')} 
              />
            )}
          </TouchableOpacity>
        )}
        
        {/* Controles verticais para input numérico (apenas no NATIVO) */}
        {type === 'number' && showNumberControls && !isWeb && (
          <View style={containerStyle.numberControlsContainer}>
            <TouchableOpacity 
              onPress={handleIncrement}
              style={[containerStyle.numberControlButton, containerStyle.numberControlButtonUp]}
              disabled={disabled || (max !== undefined && value ? parseFloat(value) >= max : false)}
              activeOpacity={0.6}
            >
              <ChevronUp 
                size={12} 
                color={getThemeColor('text-secondary')} 
              />
            </TouchableOpacity>
            
            <TouchableOpacity 
              onPress={handleDecrement}
              style={[containerStyle.numberControlButton, containerStyle.numberControlButtonDown]}
              disabled={disabled || (min !== undefined && value ? parseFloat(value) <= min : false)}
              activeOpacity={0.6}
            >
              <ChevronDown 
                size={12} 
                color={getThemeColor('text-secondary')} 
              />
            </TouchableOpacity>
          </View>
        )}
        
        {/* Indicador de redimensionamento para web (similar ao nativo) */}
        {isWeb && multiline && resizable && (
          <View 
            style={{
              position: 'absolute',
              bottom: 2,
              right: 2,
              width: 18,
              height: 18,
              zIndex: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            {...(isWeb ? { 'data-resize-handle': 'true' } : {})}
          >
            {/* Usando o mesmo indicador visual do nativo */}
            <View style={{
              width: 12,
              height: 12,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
              <View style={{
                width: 12,
                height: 1.5,
                backgroundColor: getThemeColor('divider'),
                marginBottom: 1.5,
                transform: [{ rotate: '-45deg' }, { translateX: 1 }],
              }} />
              <View style={{
                width: 9,
                height: 1.5,
                backgroundColor: getThemeColor('divider'),
                marginBottom: 1.5,
                transform: [{ rotate: '-45deg' }],
              }} />
              <View style={{
                width: 6,
                height: 1.5,
                backgroundColor: getThemeColor('divider'),
                transform: [{ rotate: '-45deg' }, { translateX: -1 }],
              }} />
            </View>
          </View>
        )}
        
        {/* Alça de redimensionamento para textarea (no React Native) */}
        {!isWeb && multiline && resizable && (
          <View 
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              width: 32, 
              height: 32,
              justifyContent: 'flex-end',
              alignItems: 'flex-end',
              paddingRight: 4,
              paddingBottom: 4,
              zIndex: 100,
            }}
            {...panResponder.panHandlers}
            hitSlop={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            {/* Três linhas diagonais como indicador de redimensionamento */}
            <View style={{
              width: 10,
              height: 10,
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
            }}>
              <View style={{
                width: 10,
                height: 1,
                backgroundColor: getThemeColor('divider'),
                marginBottom: 2,
                transform: [{ rotate: '-45deg' }, { translateX: 1 }],
              }} />
              <View style={{
                width: 7,
                height: 1,
                backgroundColor: getThemeColor('divider'),
                marginBottom: 2,
                transform: [{ rotate: '-45deg' }],
              }} />
              <View style={{
                width: 4,
                height: 1,
                backgroundColor: getThemeColor('divider'),
                transform: [{ rotate: '-45deg' }, { translateX: -1 }],
              }} />
            </View>
          </View>
        )}
      </View>
      
      {/* Mensagem de erro */}
      {error && (
        <Text style={containerStyle.errorText}>{error}</Text>
      )}
      
      {/* Calendário personalizado para web */}
      {isWeb && showCalendar && (
        <Modal
          visible={showCalendar}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowCalendar(false)}
        >
          <TouchableOpacity 
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={1}
            onPress={() => setShowCalendar(false)}
          >
            <TouchableOpacity 
              style={{
                backgroundColor: isDark ? colors['bg-primary-dark'] : colors['bg-primary-light'],
                borderRadius: Number(getBorderRadius('lg').replace('px', '')),
                padding: Number(spacing['4'].replace('px', '')),
                width: 320,
                maxWidth: '90%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              activeOpacity={1}
            >
              {/* Header do calendário */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: Number(spacing['4'].replace('px', '')),
              }}>
                <TouchableOpacity
                  onPress={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() - 1, 1))}
                  style={{
                    padding: Number(spacing['2'].replace('px', '')),
                    borderRadius: Number(getBorderRadius('md').replace('px', '')),
                  }}
                >
                  <ChevronLeft size={20} color={getThemeColor('text-primary')} />
                </TouchableOpacity>
                
                <Text style={{
                  fontSize: Number(fontSize['subtitle-md'].size.replace('px', '')),
                  fontFamily: fontFamily['jakarta-bold'],
                  color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                }}>
                  {monthNames[calendarDate.getMonth()]} {calendarDate.getFullYear()}
                </Text>
                
                <TouchableOpacity
                  onPress={() => setCalendarDate(new Date(calendarDate.getFullYear(), calendarDate.getMonth() + 1, 1))}
                  style={{
                    padding: Number(spacing['2'].replace('px', '')),
                    borderRadius: Number(getBorderRadius('md').replace('px', '')),
                  }}
                >
                  <ChevronRight size={20} color={getThemeColor('text-primary')} />
                </TouchableOpacity>
              </View>
              
              {/* Dias da semana */}
              <View style={{
                flexDirection: 'row',
                marginBottom: Number(spacing['2'].replace('px', '')),
              }}>
                {dayNames.map((day) => (
                  <View key={day} style={{
                    flex: 1,
                    alignItems: 'center',
                    paddingVertical: Number(spacing['2'].replace('px', '')),
                  }}>
                    <Text style={{
                      fontSize: Number(fontSize['body-sm'].size.replace('px', '')),
                      fontFamily: fontFamily['jakarta-medium'],
                      color: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
                    }}>
                      {day}
                    </Text>
                  </View>
                ))}
              </View>
              
              {/* Grid de dias */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {Array.from({ length: getFirstDayOfMonth(calendarDate) }, (_, i) => (
                  <View key={`empty-${i}`} style={{ width: '14.28%', height: 40 }} />
                ))}
                
                {Array.from({ length: getDaysInMonth(calendarDate) }, (_, i) => {
                  const day = i + 1;
                  const currentDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                  const isToday = new Date().toDateString() === currentDate.toDateString();
                  const isSelected = value === formatDateValue(currentDate);
                  
                  return (
                    <TouchableOpacity
                      key={day}
                      style={{
                        width: '14.28%',
                        height: 40,
                        justifyContent: 'center',
                        alignItems: 'center',
                        borderRadius: Number(getBorderRadius('md').replace('px', '')),
                        backgroundColor: isSelected 
                          ? (isDark ? colors['primary-dark'] : colors['primary-light'])
                          : isToday
                          ? (isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'])
                          : 'transparent',
                      }}
                      onPress={() => {
                        const selectedDate = new Date(calendarDate.getFullYear(), calendarDate.getMonth(), day);
                        onChangeText(formatDateValue(selectedDate));
                        setShowCalendar(false);
                      }}
                    >
                      <Text style={{
                        fontSize: Number(fontSize['body-md'].size.replace('px', '')),
                        fontFamily: fontFamily['jakarta-regular'],
                        color: isSelected
                          ? '#FFFFFF'
                          : isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                      }}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              
              {/* Botões de ação */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'flex-end',
                marginTop: Number(spacing['4'].replace('px', '')),
                gap: Number(spacing['2'].replace('px', '')),
              }}>
                <TouchableOpacity
                  onPress={() => setShowCalendar(false)}
                  style={{
                    paddingHorizontal: Number(spacing['4'].replace('px', '')),
                    paddingVertical: Number(spacing['2'].replace('px', '')),
                    borderRadius: Number(getBorderRadius('md').replace('px', '')),
                  }}
                >
                  <Text style={{
                    fontSize: Number(fontSize['body-md'].size.replace('px', '')),
                    fontFamily: fontFamily['jakarta-medium'],
                    color: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
                  }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {
                    onChangeText(formatDateValue(new Date()));
                    setShowCalendar(false);
                  }}
                  style={{
                    paddingHorizontal: Number(spacing['4'].replace('px', '')),
                    paddingVertical: Number(spacing['2'].replace('px', '')),
                    borderRadius: Number(getBorderRadius('md').replace('px', '')),
                    backgroundColor: isDark ? colors['primary-dark'] : colors['primary-light'],
                  }}
                >
                  <Text style={{
                    fontSize: Number(fontSize['body-md'].size.replace('px', '')),
                    fontFamily: fontFamily['jakarta-medium'],
                    color: '#FFFFFF',
                  }}>
                    Hoje
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
      
      {/* Seletor de hora personalizado para web */}
      {isWeb && showTimePicker && (
        <Modal
          visible={showTimePicker}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowTimePicker(false)}
        >
          <TouchableOpacity 
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            activeOpacity={1}
            onPress={() => setShowTimePicker(false)}
          >
            <TouchableOpacity 
              style={{
                backgroundColor: isDark ? colors['bg-primary-dark'] : colors['bg-primary-light'],
                borderRadius: Number(getBorderRadius('lg').replace('px', '')),
                padding: Number(spacing['6'].replace('px', '')),
                width: 280,
                maxWidth: '90%',
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 8,
              }}
              activeOpacity={1}
            >
              {/* Header */}
              <Text style={{
                fontSize: Number(fontSize['subtitle-md'].size.replace('px', '')),
                fontFamily: fontFamily['jakarta-bold'],
                color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                textAlign: 'center',
                marginBottom: Number(spacing['6'].replace('px', '')),
              }}>
                Selecionar Hora
              </Text>
              
              {/* Display da hora */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: Number(spacing['6'].replace('px', '')),
              }}>
                <Text style={{
                  fontSize: 48,
                  fontFamily: fontFamily['jakarta-bold'],
                  color: isDark ? colors['primary-dark'] : colors['primary-light'],
                  textAlign: 'center',
                }}>
                  {formatTimeValue(selectedHour, selectedMinute)}
                </Text>
              </View>
              
              {/* Controles de hora e minuto */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                marginBottom: Number(spacing['6'].replace('px', '')),
              }}>
                {/* Controle de hora */}
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{
                    fontSize: Number(fontSize['body-sm'].size.replace('px', '')),
                    fontFamily: fontFamily['jakarta-medium'],
                    color: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
                    marginBottom: Number(spacing['2'].replace('px', '')),
                  }}>
                    Hora
                  </Text>
                  
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => setSelectedHour(selectedHour === 23 ? 0 : selectedHour + 1)}
                      style={{
                        padding: Number(spacing['2'].replace('px', '')),
                        borderRadius: Number(getBorderRadius('md').replace('px', '')),
                        backgroundColor: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
                        marginBottom: Number(spacing['2'].replace('px', '')),
                      }}
                    >
                      <ChevronUp size={20} color={getThemeColor('text-primary')} />
                    </TouchableOpacity>
                    
                    <Text style={{
                      fontSize: Number(fontSize['headline-sm'].size.replace('px', '')),
                      fontFamily: fontFamily['jakarta-bold'],
                      color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                      minWidth: 40,
                      textAlign: 'center',
                    }}>
                      {selectedHour.toString().padStart(2, '0')}
                    </Text>
                    
                    <TouchableOpacity
                      onPress={() => setSelectedHour(selectedHour === 0 ? 23 : selectedHour - 1)}
                      style={{
                        padding: Number(spacing['2'].replace('px', '')),
                        borderRadius: Number(getBorderRadius('md').replace('px', '')),
                        backgroundColor: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
                        marginTop: Number(spacing['2'].replace('px', '')),
                      }}
                    >
                      <ChevronDown size={20} color={getThemeColor('text-primary')} />
                    </TouchableOpacity>
                  </View>
                </View>
                
                {/* Separador */}
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: Number(spacing['4'].replace('px', '')),
                }}>
                  <Text style={{
                    fontSize: Number(fontSize['headline-md'].size.replace('px', '')),
                    fontFamily: fontFamily['jakarta-bold'],
                    color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                  }}>
                    :
                  </Text>
                </View>
                
                {/* Controle de minuto */}
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{
                    fontSize: Number(fontSize['body-sm'].size.replace('px', '')),
                    fontFamily: fontFamily['jakarta-medium'],
                    color: isDark ? colors['text-secondary-dark'] : colors['text-secondary-light'],
                    marginBottom: Number(spacing['2'].replace('px', '')),
                  }}>
                    Minuto
                  </Text>
                  
                  <View style={{ alignItems: 'center' }}>
                    <TouchableOpacity
                      onPress={() => setSelectedMinute(selectedMinute === 59 ? 0 : selectedMinute + 1)}
                      style={{
                        padding: Number(spacing['2'].replace('px', '')),
                        borderRadius: Number(getBorderRadius('md').replace('px', '')),
                        backgroundColor: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
                        marginBottom: Number(spacing['2'].replace('px', '')),
                      }}
                    >
                      <ChevronUp size={20} color={getThemeColor('text-primary')} />
                    </TouchableOpacity>
                    
                    <Text style={{
                      fontSize: Number(fontSize['headline-sm'].size.replace('px', '')),
                      fontFamily: fontFamily['jakarta-bold'],
                      color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                      minWidth: 40,
                      textAlign: 'center',
                    }}>
                      {selectedMinute.toString().padStart(2, '0')}
                    </Text>
                    
                    <TouchableOpacity
                      onPress={() => setSelectedMinute(selectedMinute === 0 ? 59 : selectedMinute - 1)}
                      style={{
                        padding: Number(spacing['2'].replace('px', '')),
                        borderRadius: Number(getBorderRadius('md').replace('px', '')),
                        backgroundColor: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
                        marginTop: Number(spacing['2'].replace('px', '')),
                      }}
                    >
                      <ChevronDown size={20} color={getThemeColor('text-primary')} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              
              {/* Botões de ação */}
              <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                gap: Number(spacing['3'].replace('px', '')),
              }}>
                <TouchableOpacity
                  onPress={() => setShowTimePicker(false)}
                  style={{
                    flex: 1,
                    paddingVertical: Number(spacing['3'].replace('px', '')),
                    borderRadius: Number(getBorderRadius('md').replace('px', '')),
                    backgroundColor: isDark ? colors['bg-secondary-dark'] : colors['bg-secondary-light'],
                  }}
                >
                  <Text style={{
                    fontSize: Number(fontSize['body-md'].size.replace('px', '')),
                    fontFamily: fontFamily['jakarta-medium'],
                    color: isDark ? colors['text-primary-dark'] : colors['text-primary-light'],
                    textAlign: 'center',
                  }}>
                    Cancelar
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  onPress={() => {
                    onChangeText(formatTimeValue(selectedHour, selectedMinute));
                    setShowTimePicker(false);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: Number(spacing['3'].replace('px', '')),
                    borderRadius: Number(getBorderRadius('md').replace('px', '')),
                    backgroundColor: isDark ? colors['primary-dark'] : colors['primary-light'],
                  }}
                >
                  <Text style={{
                    fontSize: Number(fontSize['body-md'].size.replace('px', '')),
                    fontFamily: fontFamily['jakarta-medium'],
                    color: '#FFFFFF',
                    textAlign: 'center',
                  }}>
                    Confirmar
                  </Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}; 