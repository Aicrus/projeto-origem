import React, { useState, useRef, useEffect } from 'react';
import { StyleSheet, View, TextInput, Text, TouchableOpacity, Platform } from 'react-native';
import { Eye, EyeOff, Search, X, Calendar } from 'lucide-react-native';
import { useTheme } from '../../../hooks/ThemeContext';
import { useResponsive } from '../../../hooks/useResponsive';
import { colors } from '../constants/theme';

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
  type?: 'text' | 'password' | 'search' | 'number' | 'email' | 'date';
  /** Máscara aplicada ao texto digitado */
  mask?: 'cpf' | 'cnpj' | 'phone' | 'date' | 'cep' | 'currency' | 'none';
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
  autoCapitalize = 'sentences',
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
  rightIcon,
  onRightIconPress,
  testID,
  style,
  inputStyle,
  autoFocus = false,
}: InputProps) => {
  // Estado para controlar visibilidade da senha
  const [passwordVisible, setPasswordVisible] = useState(false);
  
  // Estado para controlar foco
  const [isFocused, setIsFocused] = useState(false);
  
  // Referência ao input
  const inputRef = useRef<TextInput>(null);
  
  // Tema atual
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  // Responsividade
  const { isMobile } = useResponsive();
  
  // Função para aplicar máscara
  const applyMask = (text: string): string => {
    if (!text) return '';
    
    // Implementação básica de algumas máscaras
    switch (mask) {
      case 'cpf':
        // Remove caracteres não numéricos
        text = text.replace(/\D/g, '');
        // Aplica máscara de CPF: 000.000.000-00
        text = text.replace(/(\d{3})(\d)/, '$1.$2');
        text = text.replace(/(\d{3})(\d)/, '$1.$2');
        text = text.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        return text.substring(0, 14);
        
      case 'cnpj':
        // Remove caracteres não numéricos
        text = text.replace(/\D/g, '');
        // Aplica máscara de CNPJ: 00.000.000/0000-00
        text = text.replace(/(\d{2})(\d)/, '$1.$2');
        text = text.replace(/(\d{3})(\d)/, '$1.$2');
        text = text.replace(/(\d{3})(\d)/, '$1/$2');
        text = text.replace(/(\d{4})(\d{1,2})$/, '$1-$2');
        return text.substring(0, 18);
        
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
        
      default:
        return text;
    }
  };
  
  // Função para lidar com mudança de texto
  const handleChangeText = (text: string) => {
    // Se for tipo data, define automaticamente a máscara de data
    const activeMask = type === 'date' && mask === 'none' ? 'date' : mask;
    
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
    } else if (Platform.OS === 'web') {
      // No ambiente web, podemos acionar o input de data nativo se estiver usando type="date"
      inputRef.current?.focus();
    }
  };
  
  // Determinar tipo seguro de teclado
  const getKeyboardType = () => {
    if (keyboardType !== 'default') return keyboardType;
    
    // Definir tipo de teclado com base no mask ou type
    if (mask === 'cpf' || mask === 'cnpj' || mask === 'phone' || mask === 'date' || mask === 'cep' || mask === 'currency' || type === 'date') {
      return 'numeric';
    }
    
    if (type === 'number') return 'numeric';
    if (type === 'email') return 'email-address';
    
    return 'default';
  };
  
  // Estilo do container do input
  const containerStyle = StyleSheet.create({
    container: {
      width: '100%',
      marginBottom: error ? 4 : 0,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      borderWidth: 1,
      borderRadius: 6,
      backgroundColor: isDark ? '#14181B' : '#FFFFFF',
      borderColor: error 
        ? (isDark ? '#FF6B6B' : '#FF4040')
        : isFocused
          ? (isDark ? colors.primary.dark : colors.primary.main)
          : (isDark ? '#262D34' : '#E0E3E7'),
      minHeight: 38,
      paddingHorizontal: 12,
    },
    inputStyle: {
      flex: 1,
      color: isDark ? '#FFFFFF' : '#14181B',
      fontSize: 14,
      paddingVertical: 8,
      height: multiline ? undefined : 38,
      textAlignVertical: multiline ? 'top' : 'center',
    },
    // Estilo específico para o ícone de pesquisa (mais à esquerda)
    searchIcon: {
      padding: 2,
      marginRight: 4,
      marginLeft: -4, // Move o ícone mais para a esquerda
    },
    // Estilos padrão para ícones à direita
    iconContainer: {
      padding: 4,
    },
    labelStyle: {
      fontSize: 12,
      marginBottom: 4,
      color: isDark ? '#95A1AC' : '#57636C',
      fontWeight: '500',
    },
    errorText: {
      fontSize: 12,
      color: isDark ? '#FF6B6B' : '#FF4040',
      marginTop: 2,
    },
  });
  
  // Adicionar estilos de hover para web
  useEffect(() => {
    if (Platform.OS === 'web') {
      const style = document.createElement('style');
      style.textContent = `
        /* Estilo para o input */
        [data-input-container="true"]:hover:not([data-disabled="true"]) {
          border-color: ${isDark ? colors.primary.dark : colors.primary.main};
          transition: all 0.2s ease;
        }
        
        /* Estilo para os ícones */
        [data-input-icon="true"]:hover {
          opacity: 0.8;
          cursor: pointer;
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
      `;
      document.head.appendChild(style);
      
      return () => {
        document.head.removeChild(style);
      };
    }
  }, [isDark]);

  return (
    <View style={[containerStyle.container, style]}>
      {label && (
        <Text style={containerStyle.labelStyle}>{label}</Text>
      )}
      
      <View 
        style={[
          containerStyle.inputContainer, 
          disabled ? { opacity: 0.5 } : {}
        ]}
        {...(Platform.OS === 'web' ? {
          'data-input-container': 'true',
          'data-disabled': disabled ? 'true' : 'false'
        } : {})}
      >
        {/* Ícone de pesquisa para type="search" */}
        {type === 'search' && (
          <View style={containerStyle.searchIcon}>
            <Search 
              size={16} 
              color={isDark ? '#95A1AC' : '#57636C'} 
            />
          </View>
        )}
        
        <TextInput
          ref={inputRef}
          style={[containerStyle.inputStyle, inputStyle]}
          value={value}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor={isDark ? '#95A1AC' : '#8B97A2'}
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
          // Cor de seleção mais sutil
          selectionColor={isDark ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.1)'}
          autoFocus={autoFocus}
          // Para web, adiciona suporte nativo ao input de data HTML5
          {...(Platform.OS === 'web' && type === 'date' ? { 
            type: 'text', // Mantemos como text para usar nossa máscara customizada
            inputMode: 'numeric'
          } : {})}
        />
        
        {/* Ícone personalizado à direita */}
        {rightIcon && (
          <TouchableOpacity 
            onPress={handleRightIconPress}
            style={containerStyle.iconContainer}
            {...(Platform.OS === 'web' ? { 'data-input-icon': 'true' } : {})}
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
            {...(Platform.OS === 'web' ? { 'data-input-icon': 'true' } : {})}
          >
            <X 
              size={16} 
              color={isDark ? '#95A1AC' : '#57636C'} 
            />
          </TouchableOpacity>
        )}
        
        {/* Ícone de calendário para input tipo data */}
        {type === 'date' && (
          <TouchableOpacity 
            onPress={handleCalendarPress}
            style={containerStyle.iconContainer}
            {...(Platform.OS === 'web' ? { 'data-input-icon': 'true' } : {})}
            disabled={disabled}
          >
            <Calendar 
              size={16} 
              color={isDark ? '#95A1AC' : '#57636C'} 
            />
          </TouchableOpacity>
        )}
        
        {/* Botão de mostrar/esconder senha */}
        {type === 'password' && (
          <TouchableOpacity 
            onPress={togglePasswordVisibility}
            style={containerStyle.iconContainer}
            {...(Platform.OS === 'web' ? { 'data-input-icon': 'true' } : {})}
            disabled={disabled}
          >
            {passwordVisible ? (
              <EyeOff 
                size={16} 
                color={isDark ? '#95A1AC' : '#57636C'} 
              />
            ) : (
              <Eye 
                size={16} 
                color={isDark ? '#95A1AC' : '#57636C'} 
              />
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {/* Mensagem de erro */}
      {error && (
        <Text style={containerStyle.errorText}>{error}</Text>
      )}
    </View>
  );
}; 