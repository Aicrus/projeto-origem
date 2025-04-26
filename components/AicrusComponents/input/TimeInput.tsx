import React, { useState, useRef, useEffect } from 'react';
import { Platform, Modal, View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Input, InputProps } from './Input';
import { useTheme } from '../../../hooks/ThemeContext';

// Função para obter as cores do tailwind.config.js
const getTailwindConfig = () => {
  try {
    // Importando dinamicamente o tailwind.config.js
    const tailwindConfig = require('../../../tailwind.config.js');
    return tailwindConfig.theme.extend.colors;
  } catch (error) {
    // Fallback para valores padrão caso não consiga importar
    console.error('Erro ao carregar tailwind.config.js:', error);
    return {
      'primary-light': '#892CDC',
      'primary-dark': '#C13636',
      'bg-primary-light': '#F7F8FA',
      'bg-primary-dark': '#1C1E26',
      'bg-secondary-light': '#FFFFFF',
      'bg-secondary-dark': '#14181B',
      'text-primary-light': '#14181B',
      'text-primary-dark': '#FFFFFF',
    };
  }
};

/**
 * @component TimeInput
 * @description Componente de entrada de hora com suporte a:
 * - Máscara de hora no formato HH:MM
 * - Seletor de hora nativo no iOS e Android
 * - Seletor de hora HTML5 nativo para web estilizado
 * - Tema claro/escuro 
 * 
 * Exemplo:
 * ```tsx
 * <TimeInput
 *   value={hora}
 *   onChangeText={setHora}
 *   label="Horário"
 *   placeholder="HH:MM"
 * />
 * ```
 */

export interface TimeInputProps extends Omit<InputProps, 'type' | 'mask' | 'onCalendarPress' | 'onTimePress'> {
  /** Valor inicial para o seletor de hora (quando aberto pela primeira vez) */
  initialTime?: Date;
  /** Se deve mostrar o seletor de 24 horas (vs. AM/PM) */
  is24Hour?: boolean;
  /** Intervalo em minutos para o seletor de minutos (iOS) */
  minuteInterval?: 1 | 5 | 10 | 15 | 20 | 30;
}

export const TimeInput: React.FC<TimeInputProps> = ({
  value,
  onChangeText,
  initialTime = new Date(),
  placeholder = 'HH:MM',
  label,
  disabled = false,
  is24Hour = true,
  minuteInterval = 1,
  ...otherProps
}) => {
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Obter as cores do tailwind.config.js
  const twColors = getTailwindConfig();
  
  // Estado para controlar visibilidade do seletor de hora
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  // Estado para armazenar a hora selecionada temporariamente (antes de confirmar)
  const [tempTime, setTempTime] = useState<Date | null>(null);
  
  // Referência ao input nativo de hora para web
  const nativeTimeInputRef = useRef<HTMLInputElement>(null);
  
  // Animação para o overlay
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(150)).current;
  
  // Animação de entrada e saída do modal
  useEffect(() => {
    if (showTimePicker) {
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
      slideAnim.setValue(150);
    }
  }, [showTimePicker, fadeAnim, slideAnim]);
  
  // Observar mensagens do seletor HTML5 para interceptar "Limpar"
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Função para ouvir mensagens do seletor HTML5
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
  
  // Função para abrir o seletor de hora
  const openTimePicker = () => {
    if (!disabled) {
      // Inicializa a hora temporária com a hora atual do input ou a hora inicial
      setTempTime(value ? stringToTime(value) : initialTime);
      
      if (Platform.OS === 'web') {
        // Para web, precisamos acionar o clique no input nativo de hora
        setTimeout(() => {
          if (nativeTimeInputRef.current) {
            nativeTimeInputRef.current.showPicker();
            nativeTimeInputRef.current.focus();
          }
        }, 100);
      } else {
        // Para mobile, abrimos o modal customizado
        setShowTimePicker(true);
      }
    }
  };
  
  // Função para converter string no formato HH:MM para objeto Date
  const stringToTime = (timeString: string): Date => {
    if (!timeString || timeString.length !== 5) return initialTime;
    
    const parts = timeString.split(':');
    if (parts.length !== 2) return initialTime;
    
    const hours = parseInt(parts[0], 10);
    const minutes = parseInt(parts[1], 10);
    
    if (isNaN(hours) || isNaN(minutes) || hours < 0 || hours > 23 || minutes < 0 || minutes > 59) {
      return initialTime;
    }
    
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    date.setSeconds(0);
    date.setMilliseconds(0);
    
    return date;
  };
  
  // Função para converter Date para string no formato HH:MM
  const timeToString = (date: Date): string => {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return '';
    }
    
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    
    return `${hours}:${minutes}`;
  };
  
  // Função para aplicar máscara de hora (HH:MM)
  const applyTimeMask = (text: string): string => {
    // Remove caracteres não numéricos
    text = text.replace(/\D/g, '');
    
    // Limita a 4 dígitos (2 para hora, 2 para minutos)
    text = text.substring(0, 4);
    
    // Formata para HH:MM
    if (text.length <= 2) {
      // Apenas horas
      return text;
    } else {
      // Horas e minutos
      const hours = text.substring(0, 2);
      const minutes = text.substring(2, 4);
      
      // Validação básica
      const hoursNum = parseInt(hours, 10);
      const minutesNum = parseInt(minutes, 10);
      
      const validHours = hoursNum <= 23 ? hours : '23';
      const validMinutes = minutesNum <= 59 ? minutes : '59';
      
      return `${validHours}:${validMinutes || '00'}`;
    }
  };
  
  // Função para lidar com mudança de texto
  const handleTimeChange = (text: string) => {
    const maskedText = applyTimeMask(text);
    onChangeText(maskedText);
  };
  
  // Função para lidar com a mudança de hora no seletor nativo (iOS/Android)
  const handleTimePickerChange = (event: any, selectedTime?: Date) => {
    // Se o usuário cancelou ou não selecionou nenhuma hora
    if (!selectedTime) {
      return;
    }
    
    // Garantir que os minutos sejam preservados
    const newTime = new Date(selectedTime);
    
    // Atualiza a hora temporária, não confirma ainda
    setTempTime(newTime);
  };
  
  // Função para lidar com a confirmação da hora
  const handleConfirm = () => {
    // Se temos uma hora temporária selecionada, aplica-a
    if (tempTime) {
      // Assegurar que estamos capturando horas e minutos corretamente
      const timeString = timeToString(tempTime);
      onChangeText(timeString);
      
      // Depuração para verificar valores
      if (Platform.OS === 'web' && process.env.NODE_ENV === 'development') {
        console.log('Hora confirmada:', tempTime);
        console.log('String formatada:', timeString);
      }
    }
    
    // Fecha o picker
    setShowTimePicker(false);
  };
  
  // Função para lidar com o cancelamento
  const handleCancel = () => {
    // Descarta a hora temporária
    setTempTime(null);
    
    // Fecha o picker
    setShowTimePicker(false);
  };
  
  // Fechar ao clicar no overlay
  const handleOverlayPress = () => {
    setShowTimePicker(false);
  };
  
  // Função para lidar com mudança no input nativo de hora HTML5 (web)
  const handleWebNativeTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const timeValue = e.target.value; // Formato HH:MM
    
    // Se o input está vazio, limpa o valor
    if (!timeValue) {
      onChangeText('');
      return;
    }
    
    // Formata a hora se necessário
    onChangeText(timeValue);
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
      backgroundColor: isDark ? twColors['bg-secondary-dark'] : twColors['bg-secondary-light'],
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
      borderTopColor: isDark ? twColors['divider-dark'] : twColors['divider-light'],
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
      backgroundColor: isDark ? twColors['primary-dark'] : twColors['primary-light'],
    },
    buttonTextCancel: {
      color: isDark ? twColors['text-primary-dark'] : twColors['text-primary-light'],
      fontWeight: '500',
      fontSize: 14,
    },
    buttonTextConfirm: {
      color: twColors['text-primary-dark'],
      fontWeight: '600',
      fontSize: 14,
    },
    pickerContainer: {
      alignItems: 'center',
      backgroundColor: isDark ? twColors['bg-secondary-dark'] : twColors['bg-secondary-light'],
    },
    pickerTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: isDark ? twColors['text-primary-dark'] : twColors['text-primary-light'],
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
  
  // Inject CSS para estilizar o seletor de hora HTML5 nativo
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      const primaryColor = isDark ? twColors['primary-dark'] : twColors['primary-light'];
      const textColor = isDark ? twColors['text-primary-dark'] : twColors['text-primary-light'];
      const bgColor = isDark ? twColors['bg-secondary-dark'] : twColors['bg-secondary-light'];
      
      style.textContent = `
        /* Estilização do seletor de hora HTML5 nativo */
        input[type="time"]::-webkit-calendar-picker-indicator {
          cursor: pointer;
          filter: ${isDark ? 'invert(1)' : 'none'};
          opacity: 0.6;
        }
        
        input[type="time"]::-webkit-calendar-picker-indicator:hover {
          opacity: 1;
        }
        
        /* Cor principal para o calendário e elementos selecionados */
        input[type="time"]::-webkit-datetime-edit-fields-wrapper {
          color: ${textColor};
        }
        
        /* Reposicionar o seletor para não sobrepor o campo */
        [data-time-input-container] {
          position: relative;
        }
        
        /* Estilos específicos para diferentes navegadores */
        
        /* Chrome */
        input::-webkit-calendar-picker-indicator {
          background-color: transparent;
        }
        
        /* Firefox */
        input[type="time"] {
          position: relative;
        }
        
        /* Estilizações para o seletor nativo */
        ::-webkit-time-picker {
          background-color: ${bgColor};
        }
        
        /* Estilizações para o seletor nativo */
        ::-webkit-datetime-edit {
          color: ${textColor};
        }
        
        /* Para navegadores baseados em Chromium */
        ::-webkit-time-picker-indicator,
        ::-webkit-calendar-picker-indicator {
          filter: ${isDark ? 'invert(1)' : 'none'};
        }
        
        /* Hack para aplicar cores no seletor */
        :root {
          accent-color: ${primaryColor} !important;
          --calendar-selected-bg: ${primaryColor} !important;
          --calendar-selected-color: white !important;
          --calendar-active-color: ${primaryColor} !important;
          --calendar-header-color: ${primaryColor} !important;
          --time-picker-selected-bg: ${primaryColor} !important;
          --time-picker-selected-color: white !important;
          --time-picker-active-color: ${primaryColor} !important;
        }
        
        /* Adiciona suporte a cores personalizadas no seletor */
        @supports (accent-color: ${primaryColor}) {
          input[type="time"] {
            accent-color: ${primaryColor};
          }
        }
        
        /* Hack para Chrome/Blink */
        @supports (-webkit-appearance: none) {
          .time-color-override {
            color: ${primaryColor} !important;
          }
        }
        
        /* Estilos para temas escuros */
        ${isDark ? `
          ::-webkit-time-picker-indicator,
          ::-webkit-calendar-picker-indicator {
            filter: invert(1) !important;
          }
          
          [role="dialog"], [role="application"] {
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
    <View {...(Platform.OS === 'web' ? { 'data-time-input-container': 'true' } : {})}>
      <Input
        value={value}
        onChangeText={handleTimeChange}
        placeholder={placeholder}
        label={label}
        disabled={disabled}
        keyboardType="numeric"
        type="time"
        onTimePress={openTimePicker}
        {...otherProps}
      />
      
      {/* Input nativo de hora para web */}
      {Platform.OS === 'web' && (
        <input
          ref={nativeTimeInputRef}
          type="time"
          style={styles.webNativeTimeInput}
          onChange={handleWebNativeTimeChange}
          onInput={(e) => {
            // Verificar se foi limpo
            if (!(e.target as HTMLInputElement).value && value) {
              onChangeText('');
            }
          }}
          value={value || ''}
          disabled={disabled}
        />
      )}
      
      {/* Modal de hora para iOS e Android com design melhorado */}
      {(Platform.OS === 'ios' || Platform.OS === 'android') && (
        <Modal
          transparent
          visible={showTimePicker}
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
              <Text style={styles.pickerTitle}>Selecione uma hora</Text>
              
              <View style={styles.pickerContainer}>
                <DateTimePicker
                  value={tempTime || initialTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTimePickerChange}
                  is24Hour={is24Hour}
                  minuteInterval={minuteInterval}
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