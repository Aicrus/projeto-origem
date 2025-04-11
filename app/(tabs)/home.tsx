import React, { useState, useEffect } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Switch, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { useTheme } from '../../hooks/ThemeContext';
import { useResponsive } from '../../hooks/useResponsive';
import { ThemeSelector } from '../../components/ThemeSelector';
import { Select, Input } from '../../components/AicrusComponents';
import { useSupabase } from '../../hooks/useSupabase';

export default function Home() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { currentTheme } = useTheme();
  const { responsive, isMobile, isTablet } = useResponsive();
  const isDark = currentTheme === 'dark';
  
  // Estado para o valor selecionado no Select
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedMultiValues, setSelectedMultiValues] = useState<string[]>([]);
  
  // Estados para os campos de Input
  const [textoNormal, setTextoNormal] = useState('');
  const [senha, setSenha] = useState('');
  const [pesquisa, setPesquisa] = useState('');
  const [cpf, setCpf] = useState('');

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
  
  // Estados e dados do Supabase
  const { supabase } = useSupabase();
  const [loadingEmails, setLoadingEmails] = useState(true);
  const [emailOptions, setEmailOptions] = useState<{value: string, label: string}[]>([]);
  const [selectedEmail, setSelectedEmail] = useState('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  
  // Buscar e-mails do Supabase quando o componente for montado
  useEffect(() => {
    async function fetchEmails() {
      try {
        setLoadingEmails(true);
        setErrorMessage('');
        
        console.log('Iniciando busca de emails no Supabase...');
        
        // Buscar dados diretamente da tabela usersAicrusAcademy
        console.log('Tentando buscar da tabela: usersAicrusAcademy');
        const { data, error } = await supabase
          .from('usersAicrusAcademy')
          .select('id, email')
          .order('email');
          
        if (error) {
          console.error('Erro ao buscar emails:', error);
          
          // Verificar se é erro de tabela não encontrada
          if (error.message.includes('does not exist') || error.code === '42P01') {
            setErrorMessage(`A tabela 'usersAicrusAcademy' não existe. Verifique o nome da tabela.`);
          } else {
            setErrorMessage(`Erro ao carregar dados: ${error.message || error.code || 'Erro desconhecido'}`);
          }
          return;
        }
        
        if (data && data.length > 0) {
          console.log('Dados recebidos:', data);
          // Converter para o formato esperado pelo Select
          const options = data.map(user => ({
            value: user.id.toString(),
            label: user.email
          }));
          
          setEmailOptions(options);
          console.log(`Carregados ${options.length} emails do Supabase`);
        } else {
          console.log('Nenhum dado encontrado na tabela');
          setErrorMessage('A tabela existe, mas não foram encontrados registros.');
        }
      } catch (error: any) {
        console.error('Erro na requisição:', error);
        setErrorMessage(`Erro geral: ${error?.message || 'Falha na conexão'}`);
      } finally {
        setLoadingEmails(false);
      }
    }
    
    fetchEmails();
  }, []);

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
      
      {/* Componentes de Input */}
      <View className="w-full max-w-xs mb-xl">
        <Text className={`mb-2 text-subtitle-sm ${textPrimary}`}>
          Exemplos de Input
        </Text>
        
        {/* Input de texto normal */}
        <View className="mb-md">
          <Input
            label="Texto normal"
            value={textoNormal}
            onChangeText={setTextoNormal}
            placeholder="Digite um texto..."
            onClear={() => setTextoNormal('')}
          />
        </View>
        
        {/* Input de senha */}
        <View className="mb-md">
          <Input
            label="Senha"
            value={senha}
            onChangeText={setSenha}
            placeholder="Digite sua senha..."
            type="password"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>
        
        {/* Input de pesquisa */}
        <View className="mb-md">
          <Input
            label="Pesquisa"
            value={pesquisa}
            onChangeText={setPesquisa}
            placeholder="Digite sua pesquisa..."
            type="search"
            onClear={() => setPesquisa('')}
          />
        </View>
        
        {/* Input com máscara de CPF */}
        <View className="mb-md">
          <Input
            label="CPF"
            value={cpf}
            onChangeText={setCpf}
            placeholder="000.000.000-00"
            mask="cpf"
            keyboardType="numeric"
            maxLength={14}
            onClear={() => setCpf('')}
          />
        </View>
      </View>
      
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
      
      {/* Select com pesquisa */}
      <View className="w-full max-w-xs mb-xl">
        <Text className={`mb-2 text-subtitle-sm ${textPrimary}`}>
          Select com pesquisa
        </Text>
        <Select
          label="Pesquise e selecione"
          options={opcoesSelect}
          value={selectedValue}
          setValue={setSelectedValue}
          placeholder="Pesquise uma opção..."
          searchable={true}
        />
      </View>
      
      {/* Select com múltipla seleção e pesquisa */}
      <View className="w-full max-w-xs mb-xl">
        <Text className={`mb-2 text-subtitle-sm ${textPrimary}`}>
          Select múltiplo com pesquisa
        </Text>
        <Select
          label="Pesquise e selecione vários"
          options={opcoesSelect}
          value={selectedMultiValues}
          setValue={setSelectedMultiValues}
          placeholder="Pesquise opções..."
          multiple={true}
          searchable={true}
          maxHeight={250}
        />
      </View>
      
      {/* SELECT COM SUPABASE - REPOSICIONADO AQUI */}
      <View className="w-full max-w-xs mb-xl">
        <Text className={`mb-2 text-subtitle-sm ${textPrimary} text-center`}>
          Select com Supabase - Emails
        </Text>
        
        {errorMessage ? (
          <View className="bg-red-50 p-2 rounded-md mb-2 border border-red-200">
            <Text className="text-red-700 text-xs">{errorMessage}</Text>
            <Text className="text-red-700 text-xs mt-1">
              Verifique as credenciais e o nome da tabela no Supabase.
            </Text>
          </View>
        ) : null}
        
        {/* SELECT COM SUPABASE - SELEÇÃO ÚNICA */}
        <View className="mb-md">
          <Text className={`text-body-sm ${textPrimary}`}>
            Seleção única
          </Text>
          <Select
            label="Selecione um email"
            options={emailOptions}
            value={selectedEmail}
            setValue={setSelectedEmail}
            placeholder={loadingEmails ? "Carregando emails..." : emailOptions.length ? "Selecione um email" : "Nenhum email disponível"}
            searchable={true}
            loading={loadingEmails}
            maxHeight={250}
          />
          
          {selectedEmail && !loadingEmails && (
            <Text className={`mt-2 text-body-sm ${textSecondary}`}>
              Email selecionado: {emailOptions.find(opt => opt.value === selectedEmail)?.label}
            </Text>
          )}
        </View>
        
        {/* SELECT COM SUPABASE - MÚLTIPLA SELEÇÃO */}
        <View className="mt-xl">
          <Text className={`text-body-sm ${textPrimary}`}>
            Múltipla seleção
          </Text>
          <Select
            label="Selecione vários emails"
            options={emailOptions}
            value={selectedEmails}
            setValue={setSelectedEmails}
            placeholder={loadingEmails ? "Carregando emails..." : "Selecione emails"}
            multiple={true}
            searchable={true}
            loading={loadingEmails}
            maxHeight={250}
          />
          
          {selectedEmails.length > 0 && !loadingEmails && (
            <View className="mt-2">
              <Text className={`text-body-sm ${textSecondary}`}>
                {selectedEmails.length} email(s) selecionado(s):
              </Text>
              {selectedEmails.map(emailId => {
                const emailInfo = emailOptions.find(opt => opt.value === emailId);
                return (
                  <Text key={emailId} className={`text-body-xs ${textSecondary} ml-2`}>
                    • {emailInfo?.label || emailId}
                  </Text>
                );
              })}
            </View>
          )}
        </View>
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