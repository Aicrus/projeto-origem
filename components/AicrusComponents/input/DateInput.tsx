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
  
  // Função para abrir o seletor de data
  const openDatePicker = () => {
    if (!disabled) {
      // Inicializa a data temporária com a data atual do input ou a data inicial
      setTempDate(value ? stringToDate(value) : initialDate);
      setShowDatePicker(true);
      
      // Para web, aciona o input nativo de data HTML5
      if (Platform.OS === 'web' && nativeDateInputRef.current) {
        nativeDateInputRef.current.click();
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
    
    const date = new Date(year, month, day);
    
    // Verificar se a data é válida
    if (isNaN(date.getTime())) return initialDate;
    
    return date;
  };
  
  // Função para converter Data para string no formato dd/mm/aaaa
  const dateToString = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Mês em JS começa em 0
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };
  
  // Função para formatar data no formato ISO (usado pelo input date HTML5)
  const dateToISO = (date: Date): string => {
    return date.toISOString().split('T')[0]; // Formato YYYY-MM-DD
  };
  
  // Função para converter formato ISO para o formato dd/mm/aaaa
  const isoToFormattedDate = (isoDate: string): string => {
    const date = new Date(isoDate);
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
    if (isoDate) {
      onChangeText(isoToFormattedDate(isoDate));
    }
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
        
        /* Esconde o input nativo de data, mas mantém funcional */
        .native-date-input-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          z-index: -1;
        }
        
        /* Estilos para o calendário aberto - infelizmente limitados devido ao shadow DOM */
        :root {
          --calendar-highlight-color: ${primaryColor};
        }
        
        /* Hack para colorir o dia selecionado usando uma variável CSS personalizada */
        @supports (color: var(--calendar-highlight-color)) {
          ::-webkit-calendar-picker-indicator {
            color: var(--calendar-highlight-color);
          }
        }
      `;
      
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark]);

  return (
    <>
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
      
      {/* Input nativo de data escondido para web */}
      {Platform.OS === 'web' && (
        <input
          ref={nativeDateInputRef}
          type="date"
          className="native-date-input-hidden"
          onChange={handleWebNativeDateChange}
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
    </>
  );
}; 