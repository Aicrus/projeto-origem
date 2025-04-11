import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { useTheme } from '../../hooks/ThemeContext';
import { useResponsive } from '../../hooks/useResponsive';
import { ThemeSelector } from '../../components/ThemeSelector';
import { Select } from '../../components/AicrusComponents';

export default function Home() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { currentTheme } = useTheme();
  const { responsive, isMobile, isTablet } = useResponsive();
  const isDark = currentTheme === 'dark';
  
  // Estado para o valor selecionado no Select
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedMultiValues, setSelectedMultiValues] = useState<string[]>([]);

  // Opções para o Select
  const opcoesSelect = [
    { label: 'Opção 1', value: 'opcao1' },
    { label: 'Opção 2', value: 'opcao2' },
    { label: 'Opção 3', value: 'opcao3' },
    { label: 'Opção 4', value: 'opcao4' },
    { label: 'Opção 5', value: 'opcao5' },
    { label: 'Opção 6', value: 'opcao6' },
    { label: 'Opção 7', value: 'opcao7' },
    { label: 'Opção 8', value: 'opcao8' },
    { label: 'Opção 9', value: 'opcao9' },
    { label: 'Opção 10', value: 'opcao10' },
    { label: 'Opção 11', value: 'opcao11' },
    { label: 'Opção 12', value: 'opcao12' },
    { label: 'Opção 13', value: 'opcao13' },
    { label: 'Opção 14', value: 'opcao14' },
    { label: 'Opção 15', value: 'opcao15' },
    { label: 'Opção 16', value: 'opcao16' },
    { label: 'Opção 17', value: 'opcao17' },
    { label: 'Opção 18', value: 'opcao18' },
    { label: 'Opção 19', value: 'opcao19' },
    { label: 'Opção 20', value: 'opcao20' },
  ];

  const handleSignOut = async () => {
    try {
      await signOut();
      // Não precisamos navegar aqui, a navegação acontecerá automaticamente
      // pelo useEffect no contexto de autenticação quando a sessão for limpa
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      // Se houver erro, pode tentar redirecionar manualmente
      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 500);
    }
  };

  // Obtenha as classes de tema corretas com base no modo atual
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const textPrimary = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';
  const textSecondary = isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light';
  const buttonPrimary = isDark ? 'bg-primary-dark' : 'bg-primary-light';
  const buttonPrimaryText = isDark ? 'text-text-primary-dark' : 'text-white';
  const buttonOutlineBorder = isDark ? 'border-primary-dark' : 'border-primary-light';
  const buttonOutlineText = isDark ? 'text-primary-dark' : 'text-primary-light';

  return (
    <ScrollView 
      className={`flex-1 ${bgPrimary}`}
      contentContainerStyle={{ 
        flexGrow: 1,
        paddingVertical: 40,
        alignItems: 'center'
      }}
    >
      <Text 
        className={`mb-lg text-center text-headline-lg font-inter-bold ${textPrimary}`}
        style={{
          maxWidth: responsive({
            mobile: '90%',
            tablet: '80%',
            desktop: '60%',
            default: '90%'
          })
        }}
      >
        Seja bem-vindo(a) ao seu aplicativo!
      </Text>
      
      {/* Seletor de Tema */}
      <ThemeSelector />
      
      {/* Componente Select */}
      <View className="w-full max-w-xs mb-xl">
        <Text className={`mb-2 text-subtitle-sm ${textPrimary}`}>
          Exemplo de Select
        </Text>
        <Select
          label="Selecione uma opção"
          options={opcoesSelect}
          value={selectedValue}
          setValue={setSelectedValue}
          placeholder="Escolha uma opção..."
        />
        {selectedValue && (
          <Text className={`mt-2 text-body-sm ${textSecondary}`}>
            Você selecionou: {opcoesSelect.find(opt => opt.value === selectedValue)?.label}
          </Text>
        )}
      </View>
      
      {/* Select com múltipla seleção */}
      <View className="w-full max-w-xs mb-xl">
        <Text className={`mb-2 text-subtitle-sm ${textPrimary}`}>
          Select com múltipla seleção
        </Text>
        <Select
          label="Selecione várias opções"
          options={opcoesSelect}
          value={selectedMultiValues}
          setValue={setSelectedMultiValues}
          placeholder="Escolha opções..."
          multiple={true}
        />
        {selectedMultiValues.length > 0 && (
          <Text className={`mt-2 text-body-sm ${textSecondary}`}>
            Selecionados: {selectedMultiValues.length} item(s)
          </Text>
        )}
      </View>
      
      {/* Status do breakpoint atual */}
      <View className={`mt-xl py-xs px-md rounded-sm ${isDark ? 'bg-bg-tertiary-dark' : 'bg-bg-tertiary-light'}`}>
        <Text className={`text-body-sm text-center ${textSecondary}`}>
          Breakpoint: {isMobile ? 'Mobile' : (isTablet ? 'Tablet' : 'Desktop')}
        </Text>
      </View>
      
      <Text 
        className={`mb-xl text-center mx-lg text-body-md font-inter-regular ${textSecondary}`}
        style={{
          maxWidth: responsive({
            mobile: '95%',
            tablet: '70%',
            desktop: '50%',
            default: '95%'
          })
        }}
      >
        Este é o seu aplicativo multiplataforma construído com React Native, Expo e diversas tecnologias modernas.
      </Text>
      
      <View style={{
        flexDirection: responsive({
          mobile: 'column',
          tablet: 'row',
          desktop: 'row',
          default: 'column'
        }),
        gap: responsive({
          mobile: 16,
          tablet: 24,
          desktop: 32,
          default: 16
        })
      }}>
        <Pressable
          onPress={handleSignOut}
          className={`px-lg py-md rounded-md ${buttonPrimary}`}
          style={{
            minWidth: responsive({
              mobile: 180,
              tablet: 160,
              desktop: 200,
              default: 180
            })
          }}
        >
          <Text className={`text-center text-label-md font-inter-semibold ${buttonPrimaryText}`}>
            Sair do Aplicativo
          </Text>
        </Pressable>
        
        {!isMobile && (
          <Pressable
            onPress={() => {}}
            className={`px-lg py-md rounded-md border ${buttonOutlineBorder} bg-transparent`}
            style={{
              minWidth: responsive({
                mobile: 180,
                tablet: 160,
                desktop: 200,
                default: 180
              })
            }}
          >
            <Text className={`text-center text-label-md font-inter-semibold ${buttonOutlineText}`}>
              Botão Secundário
            </Text>
          </Pressable>
        )}
      </View>
      
      {/* Link para a página Dev */}
      <Pressable
        onPress={() => router.push('/(tabs)/dev')}
        className={`mt-md px-md py-xs rounded-md ${isDark ? 'bg-secondary-dark' : 'bg-secondary-light'}`}
      >
        <Text className={`text-label-sm font-inter-semibold text-white`}>
          Abrir Ferramentas de Dev
        </Text>
      </Pressable>
    </ScrollView>
  );
} 