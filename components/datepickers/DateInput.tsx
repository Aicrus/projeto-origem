import React, { useState, useRef, useEffect } from 'react';
import { Platform, Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, InputProps } from '../inputs/Input';
import { useTheme } from '../../hooks/DesignSystemContext';
import { useResponsive } from '../../hooks/useResponsive';
import { colors } from '../../design-system/tokens/colors';
import { getResponsiveValues } from '../../design-system/tokens/typography';

/**
 * @component DateInput
 * @description Componente de entrada de data com suporte a:
 * - Máscara de data no formato dd/mm/aaaa
 * - Seletor de data nativo no iOS e Android
 * - Calendário HTML5 nativo para web estilizado
 * - Tema claro/escuro 
 * 
 * Exemplo:
 * ```tsx
 * <DateInput
 *   value={data}
 *   onChangeText={setData}
 *   label="Data de nascimento"
 *   placeholder="dd/mm/aaaa"
 * />
 * ```
 */

export interface DateInputProps extends Omit<InputProps, 'type' | 'mask' | 'onCalendarPress'> {
  /** Data mínima permitida */
  minDate?: Date;
  /** Data máxima permitida */
  maxDate?: Date;
  /** Valor inicial para o seletor de data (quando aberto pela primeira vez) */
  initialDate?: Date;
}

export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChangeText,
  minDate,
  maxDate,
  initialDate = new Date(),
  placeholder = 'dd/mm/aaaa',
  label,
  disabled = false,
  ...otherProps
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(null);
  const { currentTheme, getColorByMode } = useTheme();
  const { responsive } = useResponsive();
  const isDark = currentTheme === 'dark';
  
  // Tipografia responsiva
  const buttonTypography = getResponsiveValues('body-md');
  const titleTypography = getResponsiveValues('title-sm');
  
  // Animations
  const slideAnim = useRef(new Animated.Value(500)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  
  // Referência para o input nativo de data no web
  const nativeTimeInputRef = useRef<HTMLInputElement>(null);
  
  // Animação de entrada e saída do modal
  useEffect(() => {
    if (showDatePicker) {
      // Animação de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Animação de saída (não usamos porque o Modal fecha instantaneamente)
      fadeAnim.setValue(0);
      slideAnim.setValue(500);
    }
  }, [showDatePicker, fadeAnim, slideAnim]);
  
  // Observar mensagens do calendário HTML5 para interceptar "Limpar"
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Função para ouvir mensagens do calendário HTML5
      const handleClearButton = (event: MessageEvent) => {
        // Tentar detectar padrões conhecidos de eventos para o botão "Limpar"
        if (
          (event.data && typeof event.data === 'string' && event.data.includes('clear')) || 
          (event.data && typeof event.data === 'object' && event.data.type === 'clear')
        ) {
          onChangeText('');
        }
      };
      
      // Adicionar para eventos da página - alguns navegadores usam postMessage
      window.addEventListener('message', handleClearButton);
      
      // Também podemos observer mudanças no input
      const observeInputChange = () => {
        if (nativeTimeInputRef.current) {
          // Se o valor do input estiver vazio mas o componente tem valor
          if (!nativeTimeInputRef.current.value && value) {
            onChangeText('');
          }
        }
      };
      
      // Verificar periodicamente se o input nativo foi limpo
      const interval = setInterval(observeInputChange, 500);
      
      return () => {
        window.removeEventListener('message', handleClearButton);
        clearInterval(interval);
      };
    }
  }, [value, onChangeText]);
  
  // Criar um handler global para a tecla de limpar o calendário
  useEffect(() => {
    if (Platform.OS === 'web') {
      const handleKeyDown = (e: KeyboardEvent) => {
        // Muitos navegadores usam Escape ou Delete para limpar
        if ((e.key === 'Escape' || e.key === 'Delete' || e.key === 'Backspace') && 
            document.activeElement === nativeTimeInputRef.current) {
          onChangeText('');
        }
      };
      
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [onChangeText]);
  
  // Função para abrir o seletor de data
  const openDatePicker = () => {
    if (!disabled) {
      // Inicializa a data temporária com a data atual do input ou a data inicial
      setTempDate(value ? stringToDate(value) : initialDate);
      
      if (Platform.OS === 'web') {
        // Para web, precisamos acionar o clique no input nativo de data
        setTimeout(() => {
          if (nativeTimeInputRef.current) {
            nativeTimeInputRef.current.showPicker();
            nativeTimeInputRef.current.focus();
          }
        }, 100);
      } else {
        // Para mobile, abrimos o modal customizado
        setShowDatePicker(true);
      }
    }
  };
  
  // Função para converter string no formato dd/mm/aaaa para objeto Date
  const stringToDate = (dateString: string): Date => {
    if (!dateString || dateString.length !== 10) return initialDate;
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return initialDate;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês em JS começa em 0
    const year = parseInt(parts[2], 10);
    
    // Criar data usando UTC para evitar problemas de fuso horário
    const date = new Date(Date.UTC(year, month, day));
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) return initialDate;
    
    return date;
  };
  
  // Função para converter Data para string no formato dd/mm/aaaa
  const dateToString = (date: Date): string => {
    // Usamos UTC para evitar problemas de fuso horário
    const day = date.getUTCDate().toString().padStart(2, '0');
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0'); // Mês em JS começa em 0
    const year = date.getUTCFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  // Função para formatar data no formato ISO (usado pelo input date HTML5)
  const dateToISO = (date: Date): string => {
    // Usamos UTC para ter consistência entre a exibição e o valor interno
    const year = date.getUTCFullYear();
    const month = (date.getUTCMonth() + 1).toString().padStart(2, '0');
    const day = date.getUTCDate().toString().padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  };
  
  // Função para converter formato ISO para o formato dd/mm/aaaa
  const isoToFormattedDate = (isoDate: string): string => {
    // Criar data a partir do formato ISO
    const date = new Date(isoDate + 'T00:00:00Z'); // Adicionamos T00:00:00Z para forçar UTC
    return dateToString(date);
  };
  
  // Função para lidar com a mudança de data no seletor nativo (iOS/Android)
  const handleDateChange = (event: any, selectedDate?: Date) => {
    // Não fecha mais o picker automaticamente
    
    // Se o usuário cancelou ou não selecionou nenhuma data
    if (!selectedDate) {
      return;
    }
    
    // Atualiza a data temporária
    setTempDate(selectedDate);
  };
  
  // Função para lidar com a confirmação da data
  const handleConfirm = () => {
    // Se temos uma data temporária selecionada, aplica-a
    if (tempDate) {
      onChangeText(dateToString(tempDate));
    }
    
    // Fecha o picker
    setShowDatePicker(false);
  };
  
  // Função para lidar com o cancelamento
  const handleCancel = () => {
    // Descarta a data temporária
    setTempDate(null);
    
    // Fecha o picker
    setShowDatePicker(false);
  };
  
  // Função para lidar com mudança no input nativo de data HTML5 (web)
  const handleWebNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isoDate = e.target.value; // Formato YYYY-MM-DD
    
    // Se o input está vazio, limpa o valor
    if (!isoDate) {
      onChangeText('');
      return;
    }
    
    // Senão, formata a data
    onChangeText(isoToFormattedDate(isoDate));
  };
  
  // Fechar ao clicar no overlay
  const handleOverlayPress = () => {
    setShowDatePicker(false);
  };
  
  // Pegar a largura da tela para centralizar o seletor
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  
  // Estilo para o modal e componentes relacionados
  const styles = StyleSheet.create({
    modalContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      margin: 0,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    modalContent: {
      width: Math.min(windowWidth * 0.9, 320),
      backgroundColor: getColorByMode('bg-secondary'),
      borderRadius: 12,
      padding: 16,
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: getColorByMode('divider'),
    },
    button: {
      padding: 10,
      minWidth: 80,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonCancel: {
      backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
    },
    buttonConfirm: {
      backgroundColor: getColorByMode('primary'),
    },
    buttonTextCancel: {
      color: getColorByMode('text-primary'),
      fontWeight: '500',
      fontSize: responsive(buttonTypography.fontSize),
      fontFamily: buttonTypography.fontFamily,
      lineHeight: responsive(buttonTypography.lineHeight),
    },
    buttonTextConfirm: {
      color: '#FFFFFF',
      fontWeight: '600',
      fontSize: responsive(buttonTypography.fontSize),
      fontFamily: buttonTypography.fontFamily,
      lineHeight: responsive(buttonTypography.lineHeight),
    },
    pickerContainer: {
      alignItems: 'center',
      backgroundColor: getColorByMode('bg-secondary'),
    },
    pickerTitle: {
      fontSize: responsive(titleTypography.fontSize),
      fontFamily: titleTypography.fontFamily,
      lineHeight: responsive(titleTypography.lineHeight),
      fontWeight: '600',
      color: getColorByMode('text-primary'),
      marginBottom: 16,
      textAlign: 'center',
    },
    webNativeTimeInput: {
      position: 'absolute',
      width: 1,
      height: 1,
      opacity: 0,
      zIndex: -1,
    },
  });
  
  // Inject CSS para estilizar o calendário HTML5 nativo
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      const primaryColor = getColorByMode('primary');
      
      style.textContent = `
        /* Estilização do calendário nativo HTML5 */
        input[type="date"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: ${isDark ? 'invert(1)' : 'none'};
          opacity: 0.6;
        }
        
        input[type="date"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        
        /* Cor principal para o calendário e elementos selecionados */
        input[type="date"]::-webkit-datetime-edit-fields-wrapper {
          color: ${getColorByMode('text-primary')};
        }
        
        /* Reposicionar o calendário para não sobrepor o campo */
        [data-date-input-container] {
          position: relative;
        }
        
        /* Estilos específicos para diferentes navegadores */
        
        /* Chrome */
        input::-webkit-calendar-picker-indicator {
          background-color: transparent;
        }
        
        /* Firefox */
        input[type="date"] {
          position: relative;
        }
        
        /* Estilizações para o calendário nativo */
        ::-webkit-calendar-picker {
          background-color: ${getColorByMode('bg-secondary')};
        }
        
        ::-webkit-datetime-edit {
          color: ${getColorByMode('text-primary')};
        }
        
        /* Para navegadores baseados em Chromium */
        ::-webkit-calendar-picker-indicator {
          filter: ${isDark ? 'invert(1)' : 'none'};
        }
        
        /* Hack para aplicar cores no calendário */
        :root {
          accent-color: ${primaryColor} !important;
          --calendar-selected-bg: ${primaryColor} !important;
          --calendar-selected-color: white !important;
          --calendar-active-color: ${primaryColor} !important;
          --calendar-header-color: ${primaryColor} !important;
          --calendar-today-color: ${primaryColor} !important;
          --calendar-today-bg: ${primaryColor}20 !important;
          
          /* Cores específicas para Chrome e Firefox */
          --webkit-calendar-selected-bg: ${primaryColor} !important;
          --moz-calendar-selected-bg: ${primaryColor} !important;
          
          /* Tenta forçar a cor personalizada no botão "Hoje" */
          --today-button-color: ${primaryColor} !important;
          --reset-button-color: ${primaryColor} !important;
          --clear-button-color: ${primaryColor} !important;
        }
        
        /* Adiciona suporte a cores personalizadas no calendário */
        @supports (accent-color: ${primaryColor}) {
          input[type="date"] {
            accent-color: ${primaryColor};
          }
        }
        
        /* Hack para Chrome/Blink */
        @supports (-webkit-appearance: none) {
          .calendar-color-override {
            color: ${primaryColor} !important;
          }
        }
        
        /* Estilos para temas escuros */
        ${isDark ? `
          ::-webkit-calendar-picker-indicator {
            filter: invert(1) !important;
          }
          
          /* Tenta forçar o tema escuro no calendário */
          [role="dialog"], [role="application"] {
            background-color: #1A1F24 !important;
            color: #FFFFFF !important;
          }
          
          [role="grid"], [role="row"], [role="gridcell"] {
            background-color: #1A1F24 !important;
            color: #FFFFFF !important;
          }
        ` : ''}
      `;
      
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark]);

  return (
    <View {...(Platform.OS === 'web' ? { 'data-date-input-container': 'true' } : {})}>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        label={label}
        disabled={disabled}
        type="date"
        mask="date"
        onCalendarPress={openDatePicker}
        {...otherProps}
      />
      
      {/* Input nativo de data para web */}
      {Platform.OS === 'web' && (
        <input
          ref={nativeTimeInputRef}
          type="date"
          style={styles.webNativeTimeInput}
          onChange={handleWebNativeDateChange}
          onInput={(e) => {
            // Verificar se foi limpo
            if (!(e.target as HTMLInputElement).value && value) {
              onChangeText('');
            }
          }}
          min={minDate ? dateToISO(minDate) : undefined}
          max={maxDate ? dateToISO(maxDate) : undefined}
          value={value ? dateToISO(stringToDate(value)) : ''}
          disabled={disabled}
        />
      )}
      
      {/* Modal de data para iOS e Android com design melhorado */}
      {(Platform.OS === 'ios' || Platform.OS === 'android') && (
        <Modal
          transparent
          visible={showDatePicker}
          animationType="fade"
          onRequestClose={handleCancel}
        >
          <View style={styles.modalContainer}>
            <Animated.View 
              style={[
                styles.overlay,
                { opacity: fadeAnim }
              ]}
            >
              <TouchableOpacity
                style={{ width: '100%', height: '100%' }}
                onPress={handleOverlayPress}
                activeOpacity={1}
              />
            </Animated.View>
            
            <Animated.View 
              style={[
                styles.modalContent,
                { 
                  transform: [{ translateY: slideAnim }],
                  opacity: fadeAnim
                }
              ]}
            >
              <Text style={styles.pickerTitle}>Selecione uma data</Text>
              
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempDate || initialDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  locale="pt-BR"
                  textColor={isDark ? '#FFFFFF' : '#000000'}
                  themeVariant={isDark ? 'dark' : 'light'}
                  style={{ 
                    width: 280,
                    backgroundColor: 'transparent',
                    height: 180
                  }}
                />
              </View>
              
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={[styles.button, styles.buttonCancel]} 
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonTextCancel}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonTextConfirm}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </Animated.View>
          </View>
        </Modal>
      )}
    </View>
  );
}; 