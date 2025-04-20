import React, { useState, useRef, useEffect } from 'react';
import { Platform, Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, InputProps } from './Input';
import { useTheme } from '../../../hooks/ThemeContext';
import { colors } from '../constants/theme';

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
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Estado para controlar visibilidade do seletor de data
  const [showDatePicker, setShowDatePicker] = useState(false);
  
  // Estado para armazenar a data selecionada temporariamente (antes de confirmar)
  const [tempDate, setTempDate] = useState<Date | null>(null);
  
  // Referência ao input nativo de data para web
  const nativeDateInputRef = useRef<HTMLInputElement>(null);
  
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
        if (nativeDateInputRef.current) {
          // Se o valor do input estiver vazio mas o componente tem valor
          if (!nativeDateInputRef.current.value && value) {
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
            document.activeElement === nativeDateInputRef.current) {
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
          if (nativeDateInputRef.current) {
            nativeDateInputRef.current.showPicker();
            nativeDateInputRef.current.focus();
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
    
    // Atualiza apenas a data temporária, não confirma ainda
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
  
  // Estilo para o modal e componentes relacionados
  const styles = StyleSheet.create({
    modalOverlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      justifyContent: 'flex-end',
    },
    modalContent: {
      backgroundColor: isDark ? '#1A1F24' : '#FFFFFF',
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: 16,
    },
    buttonRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 16,
    },
    button: {
      padding: 8,
    },
    buttonText: {
      color: isDark ? colors.primary.dark : colors.primary.main,
      fontSize: 16,
      fontWeight: '500',
    },
    pickerContainer: {
      marginBottom: 16,
    },
    webNativeDateInput: {
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
      const primaryColor = isDark ? colors.primary.dark : colors.primary.main;
      
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
          color: ${isDark ? '#FFFFFF' : '#14181B'};
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
          background-color: ${isDark ? '#1A1F24' : '#FFFFFF'};
        }
        
        ::-webkit-datetime-edit {
          color: ${isDark ? '#FFFFFF' : '#14181B'};
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
          
          /* Tenta capturar o botão "Hoje" */
          [role="button"], [type="button"], button {
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
      
      // Tenta injetar a cor manualmente em todos os elementos do calendário
      const injectThemeColor = () => {
        // Tenta encontrar elementos do calendário usando consultas comuns
        const calendarElements = document.querySelectorAll(
          '[role="dialog"], [role="application"], [role="grid"], [role="button"], [type="button"], button'
        );
        
        calendarElements.forEach(el => {
          (el as HTMLElement).classList.add('calendar-color-override');
          
          // Tenta identificar botões específicos pelo texto
          if (el.textContent && 
              (el.textContent.includes('Hoje') || 
               el.textContent.includes('Today') || 
               el.textContent.includes('Limpar') || 
               el.textContent.includes('Clear'))
          ) {
            (el as HTMLElement).style.color = primaryColor;
          }
        });
      };
      
      // Tenta injetar regularmente para pegar o calendário quando aberto
      const colorInterval = setInterval(injectThemeColor, 500);
      
      return () => {
        document.head.removeChild(style);
        clearInterval(colorInterval);
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
          ref={nativeDateInputRef}
          type="date"
          style={styles.webNativeDateInput}
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
      
      {/* DatePicker para Android com modal customizado */}
      {Platform.OS === 'android' && showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempDate || initialDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  locale="pt-BR"
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
      
      {/* DatePicker para iOS com Modal */}
      {Platform.OS === 'ios' && showDatePicker && (
        <Modal
          visible={showDatePicker}
          transparent
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.buttonRow}>
                <TouchableOpacity 
                  style={styles.button} 
                  onPress={handleCancel}
                >
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.button}
                  onPress={handleConfirm}
                >
                  <Text style={styles.buttonText}>Confirmar</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempDate || initialDate}
                  mode="date"
                  display="spinner"
                  onChange={handleDateChange}
                  minimumDate={minDate}
                  maximumDate={maxDate}
                  locale="pt-BR"
                  // @ts-ignore - iOS specific prop
                  textColor={isDark ? '#FFFFFF' : '#14181B'}
                  style={{ backgroundColor: isDark ? '#1A1F24' : '#FFFFFF' }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}; 