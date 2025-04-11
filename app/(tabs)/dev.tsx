import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { View, Text, ScrollView, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Input } from '../../components/AicrusComponents/input';
import { Select } from '../../components/AicrusComponents/select';

export default function DevPage() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [activeSection, setActiveSection] = useState<'config' | 'components'>('config');
  const [activeComponent, setActiveComponent] = useState<'input' | 'select' | null>(null);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  // Estados separados para cada exemplo de Input
  const [inputBasico, setInputBasico] = useState('');
  const [inputSenha, setInputSenha] = useState('');
  const [inputErro, setInputErro] = useState('');
  const [inputBusca, setInputBusca] = useState('');
  const [inputMascara, setInputMascara] = useState('');
  
  // Estados separados para cada exemplo de Select
  const [selectBasico, setSelectBasico] = useState('');
  const [selectBusca, setSelectBusca] = useState('');
  const [multiSelect, setMultiSelect] = useState<string[]>([]);

  // Validar email
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Selecionar o primeiro componente automaticamente quando mudar para a seção de componentes
  useEffect(() => {
    if (activeSection === 'components' && !activeComponent) {
      setActiveComponent('input');
    }
  }, [activeSection, activeComponent]);

  // Cores do tema atual
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const bgSecondary = isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light';
  const bgTertiary = isDark ? 'bg-bg-tertiary-dark' : 'bg-bg-tertiary-light';
  const textPrimary = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';
  const textSecondary = isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light';
  const border = isDark ? 'border-divider-dark' : 'border-divider-light';
  
  // Opções para o componente Select
  const selectOptions = [
    { value: 'option1', label: 'Opção 1' },
    { value: 'option2', label: 'Opção 2' },
    { value: 'option3', label: 'Opção 3' },
    { value: 'option4', label: 'Opção 4' },
    { value: 'option5', label: 'Opção 5' },
    { value: 'option8', label: 'Opção 8' },
    { value: 'option10', label: 'Opção 10' },
    { value: 'option_sp', label: 'São Paulo' },
    { value: 'option_rj', label: 'Rio de Janeiro' },
    { value: 'option_bh', label: 'Belo Horizonte' },
    { value: 'option_test', label: 'Teste de Busca' },
  ];
  
  // Componentes disponíveis
  const availableComponents = [
    { id: 'input', name: 'Input' },
    { id: 'select', name: 'Select' },
  ];
  
  // Função para renderizar o conteúdo do componente selecionado
  const renderComponentContent = () => {
    if (!activeComponent) {
      return (
        <View className="p-lg">
          <Text className={`text-headline-sm font-inter-bold ${textPrimary} mb-md`}>
            Selecione um componente
          </Text>
          <Text className={`text-body-md ${textSecondary} mb-lg`}>
            Escolha um componente da lista ao lado para ver exemplos e documentação.
          </Text>
        </View>
      );
    }

    switch (activeComponent) {
      case 'input':
        return renderInputComponent();
      case 'select':
        return renderSelectComponent();
      default:
        return null;
    }
  };
  
  // Função para renderizar o componente Input e seus exemplos
  const renderInputComponent = () => {
    return (
      <View className="p-lg">
        <Text className={`text-headline-sm font-inter-bold ${textPrimary} mb-sm`}>
          Componente Input
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O Input é um componente altamente personalizável para entrada de texto, que suporta
          vários tipos de entrada, máscaras, estados e estilos. Mantém a mesma experiência 
          consistente entre plataformas (iOS, Android, Web).
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-inter-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* Input básico */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-inter-bold ${textPrimary} mb-sm`}>Input básico</Text>
            <Input
              value={inputBasico}
              onChangeText={setInputBasico}
              placeholder="Digite aqui"
              label="Input básico"
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Input simples com label, placeholder e foco estilizado.
            </Text>
          </View>
          
          {/* Input com senha */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-inter-bold ${textPrimary} mb-sm`}>Input de senha</Text>
            <Input
              value={inputSenha}
              onChangeText={setInputSenha}
              placeholder="Digite sua senha"
              label="Senha"
              type="password"
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Inclui ícone de mostrar/ocultar senha e proteção do conteúdo.
            </Text>
          </View>
          
          {/* Input com erro */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-inter-bold ${textPrimary} mb-sm`}>Input com validação de email</Text>
            <Input
              value={inputErro}
              onChangeText={setInputErro}
              placeholder="seu@email.com"
              label="Email"
              error={inputErro.length > 0 && !isValidEmail(inputErro) ? "Por favor, insira um email válido" : ""}
              type="email"
              keyboardType="email-address"
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Validação de email automática com feedback visual de erro.
            </Text>
          </View>
          
          {/* Input de busca */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-inter-bold ${textPrimary} mb-sm`}>Input de busca</Text>
            <Input
              value={inputBusca}
              onChangeText={setInputBusca}
              placeholder="Pesquisar..."
              type="search"
              onClear={() => setInputBusca('')}
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Inclui ícone de busca e botão de limpar quando houver texto.
            </Text>
          </View>
          
          {/* Input com máscara */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-inter-bold ${textPrimary} mb-sm`}>Input com máscara (CPF)</Text>
            <Input
              value={inputMascara}
              onChangeText={setInputMascara}
              placeholder="000.000.000-00"
              label="CPF"
              mask="cpf"
              keyboardType="numeric"
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Formata automaticamente entradas numéricas no padrão de CPF: 000.000.000-00.
            </Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-inter-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O Input é totalmente adaptável às necessidades do seu projeto:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Tema adaptativo</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Alterna automaticamente entre temas claro e escuro</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Responsividade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Comportamento consistente entre desktop e dispositivos móveis</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Acessibilidade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Compatível com leitores de tela e navegação por teclado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Personalização</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Estilo totalmente customizável via props</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Multiformato</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Suporta diversos tipos de entrada e formatação</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-inter-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente Input possui diversas propriedades para personalização:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>value</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Valor atual do input (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>onChangeText</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Função chamada quando o valor muda (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>placeholder</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Texto exibido quando o input está vazio</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>label</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Rótulo exibido acima do input</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>type</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Tipo de input: 'text', 'password', 'search', 'number', 'email'</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>mask</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Máscara: 'cpf', 'cnpj', 'phone', 'date', 'cep', 'currency', 'none'</Text>
          </View>
          
          <Text className={`text-body-sm ${textSecondary} mt-md`}>
            E muitas outras propriedades para personalização completa...
          </Text>
        </View>
      </View>
    );
  };
  
  // Função para renderizar o componente Select e seus exemplos
  const renderSelectComponent = () => {
    return (
      <View className="p-lg">
        <Text className={`text-headline-sm font-inter-bold ${textPrimary} mb-sm`}>
          Componente Select
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O Select é um componente de seleção dropdown altamente personalizável que oferece
          uma experiência unificada em todas as plataformas (iOS, Android, Web), adaptando-se 
          às convenções de cada plataforma.
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-inter-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* Select básico */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-inter-bold ${textPrimary} mb-sm`}>Select básico</Text>
            <Select
              options={selectOptions}
              value={selectBasico}
              setValue={setSelectBasico}
              placeholder="Selecione uma opção"
              label="Select básico"
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Select simples com seleção única e animações suaves.
            </Text>
          </View>
          
          {/* Select com busca */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-inter-bold ${textPrimary} mb-sm`}>Select com busca</Text>
            <Select
              options={selectOptions}
              value={selectBusca}
              setValue={setSelectBusca}
              placeholder="Pesquise e selecione"
              label="Select com busca"
              searchable
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Inclui campo de busca para filtrar opções em listas grandes. Digite qualquer parte do 
              texto (exemplo: "3", "São", "Rio", "Teste") para encontrar correspondências.
            </Text>
          </View>
          
          {/* Select múltiplo */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-inter-bold ${textPrimary} mb-sm`}>Select múltiplo</Text>
            <Select
              options={selectOptions}
              value={multiSelect}
              setValue={setMultiSelect as any}
              placeholder="Selecione várias opções"
              label="Select múltiplo"
              multiple={true}
              searchable={true}
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Permite selecionar múltiplos itens com contagem e gerenciamento automático.
              Também inclui campo de pesquisa para facilitar a seleção em listas grandes.
            </Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-inter-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O Select se adapta inteligentemente ao ambiente:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Posicionamento inteligente</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Abre para cima ou para baixo dependendo do espaço disponível</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Interface por plataforma</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Modal em dispositivos móveis e dropdown flutuante na web</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Busca avançada</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Pesquisa em qualquer parte do texto, ignora acentos, maiúsculas e minúsculas</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Estilo consistente</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Segue o tema da aplicação com transições suaves</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Acessibilidade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Suporte para navegação por teclado e leitores de tela</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>Animações otimizadas</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Transições suaves com desempenho otimizado</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-inter-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente Select possui diversas propriedades para personalização:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>options</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Array de opções com {'{ value, label }'} (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>value</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Valor selecionado - string ou array[string] (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>setValue</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Função para atualizar o valor (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>placeholder</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Texto exibido quando nada está selecionado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>multiple</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Permite selecionar múltiplos itens</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-inter-bold ${textPrimary}`}>searchable</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Adiciona campo de busca nas opções</Text>
          </View>
          
          <Text className={`text-body-sm ${textSecondary} mt-md`}>
            E muitas outras propriedades para personalização completa...
          </Text>
        </View>
      </View>
    );
  };
  
  return (
    <>
      <Stack.Screen 
        options={{
          title: 'Dev',
          headerShown: true,
          headerTintColor: currentTheme === 'dark' ? '#FFFFFF' : '#14181B',
          headerStyle: {
            backgroundColor: currentTheme === 'dark' ? '#1C1E26' : '#F7F8FA',
          }
        }} 
      />
      
      <View className={`flex-1 ${bgPrimary}`}>
        {/* Seletor de Seção */}
        <View className={`flex-row border-b ${border}`}>
          <Pressable
            onPress={() => setActiveSection('config')}
            className={`flex-1 py-md items-center border-b-2 ${
              activeSection === 'config'
                ? isDark
                  ? 'border-primary-dark'
                  : 'border-primary-light'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-subtitle-md font-inter-semibold ${
                activeSection === 'config'
                  ? isDark
                    ? 'text-primary-dark'
                    : 'text-primary-light'
                  : textSecondary
              }`}
            >
              Config
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setActiveSection('components')}
            className={`flex-1 py-md items-center border-b-2 ${
              activeSection === 'components'
                ? isDark
                  ? 'border-primary-dark'
                  : 'border-primary-light'
                : 'border-transparent'
            }`}
          >
            <Text
              className={`text-subtitle-md font-inter-semibold ${
                activeSection === 'components'
                  ? isDark
                    ? 'text-primary-dark'
                    : 'text-primary-light'
                  : textSecondary
              }`}
            >
              Componentes
            </Text>
          </Pressable>
        </View>

        {/* Conteúdo da Seção */}
        {activeSection === 'config' ? (
          <ScrollView className="flex-1">
            <View className={`p-lg`}>
              {/* Título da seção */}
              <Text className={`text-headline-lg font-inter-bold ${textPrimary} mb-md`}>
                Ferramentas de Dev
              </Text>
              <Text className={`text-body-md ${textSecondary} mb-xl`}>
                Use este guia como referência para implementar a UI consistente em todo o aplicativo.
              </Text>

              {/* Seção de Cores */}
              <SectionTitle title="Cores" textColor={textPrimary} />
              
              <View className="flex-row flex-wrap gap-md mb-xl">
                <ColorCard name="Primary" color="bg-primary-light dark:bg-primary-dark" textColor={textPrimary} />
                <ColorCard name="Secondary" color="bg-secondary-light dark:bg-secondary-dark" textColor={textPrimary} />
                <ColorCard name="Tertiary" color="bg-tertiary-light dark:bg-tertiary-dark" textColor={textPrimary} />
                <ColorCard name="Background" color={bgPrimary} textColor={textPrimary} />
                <ColorCard name="Card Background" color={bgSecondary} textColor={textPrimary} />
                <ColorCard name="Success" color="bg-success-bg-light dark:bg-success-bg-dark" textColor={textPrimary} />
                <ColorCard name="Warning" color="bg-warning-bg-light dark:bg-warning-bg-dark" textColor={textPrimary} />
                <ColorCard name="Error" color="bg-error-bg-light dark:bg-error-bg-dark" textColor={textPrimary} />
                <ColorCard name="Info" color="bg-info-bg-light dark:bg-info-bg-dark" textColor={textPrimary} />
              </View>

              {/* Seção de Tipografia */}
              <SectionTitle title="Tipografia" textColor={textPrimary} />
              
              <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
                <Text className={`text-display-lg font-inter-bold ${textPrimary} mb-sm`}>Display Lg</Text>
                <Text className={`text-display-md font-inter-bold ${textPrimary} mb-sm`}>Display Md</Text>
                <Text className={`text-display-sm font-inter-bold ${textPrimary} mb-sm`}>Display Sm</Text>
                <Text className={`text-headline-lg font-inter-bold ${textPrimary} mb-sm`}>Headline Lg</Text>
                <Text className={`text-headline-md font-inter-bold ${textPrimary} mb-sm`}>Headline Md</Text>
                <Text className={`text-headline-sm font-inter-bold ${textPrimary} mb-sm`}>Headline Sm</Text>
                <Text className={`text-title-lg font-inter-bold ${textPrimary} mb-sm`}>Title Lg</Text>
                <Text className={`text-title-md font-inter-bold ${textPrimary} mb-sm`}>Title Md</Text>
                <Text className={`text-title-sm font-inter-bold ${textPrimary} mb-sm`}>Title Sm</Text>
                <Text className={`text-subtitle-lg font-inter-semibold ${textPrimary} mb-sm`}>Subtitle Lg</Text>
                <Text className={`text-subtitle-md font-inter-semibold ${textPrimary} mb-sm`}>Subtitle Md</Text>
                <Text className={`text-subtitle-sm font-inter-semibold ${textPrimary} mb-sm`}>Subtitle Sm</Text>
                <Text className={`text-label-lg font-inter-semibold ${textPrimary} mb-sm`}>Label Lg</Text>
                <Text className={`text-label-md font-inter-semibold ${textPrimary} mb-sm`}>Label Md</Text>
                <Text className={`text-label-sm font-inter-semibold ${textPrimary} mb-sm`}>Label Sm</Text>
                <Text className={`text-body-lg font-inter-regular ${textPrimary} mb-sm`}>Body Lg</Text>
                <Text className={`text-body-md font-inter-regular ${textPrimary} mb-sm`}>Body Md</Text>
                <Text className={`text-body-sm font-inter-regular ${textPrimary} mb-sm`}>Body Sm</Text>
                <Text className={`text-body-xs font-inter-regular ${textPrimary} mb-sm`}>Body Xs</Text>
              </View>

              {/* Seção de Espaçamentos */}
              <SectionTitle title="Espaçamentos" textColor={textPrimary} />
              
              <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
                <View className="flex-row flex-wrap mb-md">
                  <SpacingExample size="xxs" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="xs" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="sm" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="md" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="lg" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="xl" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="2xl" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="3xl" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                </View>
              </View>

              {/* Seção de Componentes */}
              <SectionTitle title="Componentes" textColor={textPrimary} />
              
              <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
                {/* Botões */}
                <Text className={`text-subtitle-md font-inter-semibold ${textPrimary} mb-md`}>Botões</Text>
                
                <View className="flex-row flex-wrap gap-md mb-lg">
                  <Pressable 
                    className={`px-lg py-md rounded-md bg-primary-light dark:bg-primary-dark`}
                  >
                    <Text className={`text-label-md font-inter-semibold text-white`}>Botão Primário</Text>
                  </Pressable>
                  
                  <Pressable 
                    className={`px-lg py-md rounded-md bg-secondary-light dark:bg-secondary-dark`}
                  >
                    <Text className={`text-label-md font-inter-semibold text-white`}>Botão Secundário</Text>
                  </Pressable>
                  
                  <Pressable 
                    className={`px-lg py-md rounded-md border border-primary-light dark:border-primary-dark bg-transparent`}
                  >
                    <Text className={`text-label-md font-inter-semibold text-primary-light dark:text-primary-dark`}>
                      Botão Outline
                    </Text>
                  </Pressable>
                </View>

                {/* Cards */}
                <Text className={`text-subtitle-md font-inter-semibold ${textPrimary} mb-md`}>Cards</Text>
                
                <View className="gap-md mb-lg">
                  <View className={`${bgTertiary} rounded-lg p-md border ${border}`}>
                    <Text className={`text-subtitle-md font-inter-semibold ${textPrimary} mb-xs`}>
                      Card Básico
                    </Text>
                    <Text className={`text-body-md ${textSecondary}`}>
                      Este é um exemplo de card básico que pode ser usado para exibir informações.
                    </Text>
                  </View>
                  
                  <View className={`bg-success-bg-light dark:bg-success-bg-dark rounded-lg p-md border border-success-border-light dark:border-success-border-dark`}>
                    <Text className={`text-subtitle-md font-inter-semibold text-success-text-light dark:text-success-text-dark mb-xs`}>
                      Card de Sucesso
                    </Text>
                    <Text className={`text-body-md text-success-text-light dark:text-success-text-dark`}>
                      Este é um exemplo de card de sucesso para feedback positivo.
                    </Text>
                  </View>
                  
                  <View className={`bg-error-bg-light dark:bg-error-bg-dark rounded-lg p-md border border-error-border-light dark:border-error-border-dark`}>
                    <Text className={`text-subtitle-md font-inter-semibold text-error-text-light dark:text-error-text-dark mb-xs`}>
                      Card de Erro
                    </Text>
                    <Text className={`text-body-md text-error-text-light dark:text-error-text-dark`}>
                      Este é um exemplo de card de erro para feedback negativo.
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </ScrollView>
        ) : (
          <View className="flex-1">
            {isMobile ? (
              // Layout para dispositivos móveis com botões compactos no topo
              <View className="flex-1">
                {/* Navegação compacta para dispositivos móveis */}
                <View className={`flex-row justify-center py-xs border-b ${border}`}>
                  {availableComponents.map((component) => (
                    <Pressable
                      key={component.id}
                      onPress={() => setActiveComponent(component.id as 'input' | 'select')}
                      className={`mx-xs px-lg py-xs rounded-full ${
                        activeComponent === component.id
                          ? isDark
                            ? 'bg-primary-dark'
                            : 'bg-primary-light'
                          : isDark 
                            ? 'bg-bg-tertiary-dark' 
                            : 'bg-bg-tertiary-light'
                      }`}
                    >
                      <Text
                        className={`${
                          activeComponent === component.id
                            ? 'text-white'
                            : textPrimary
                        } text-label-md font-inter-semibold`}
                      >
                        {component.name}
                      </Text>
                    </Pressable>
                  ))}
                </View>
                
                {/* Conteúdo do componente em um ScrollView isolado */}
                <ScrollView 
                  className="flex-1" 
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  {renderComponentContent()}
                </ScrollView>
              </View>
            ) : (
              // Layout para desktop com sidebar lateral
              <View className="flex-row flex-1">
                {/* Lista de componentes */}
                <View className={`w-1/4 border-r ${border}`}>
                  <View className="p-lg">
                    <Text className={`text-headline-lg font-inter-bold ${textPrimary} mb-md`}>
                      Componentes
                    </Text>
                    <Text className={`text-body-md ${textSecondary} mb-lg`}>
                      Biblioteca de componentes reutilizáveis do sistema.
                    </Text>
                    
                    <View className="flex-col gap-sm">
                      {availableComponents.map((component) => (
                        <Pressable
                          key={component.id}
                          onPress={() => setActiveComponent(component.id as 'input' | 'select')}
                          className={`p-md rounded-md ${
                            activeComponent === component.id
                              ? isDark
                                ? 'bg-primary-dark/10'
                                : 'bg-primary-light/10'
                              : 'bg-transparent'
                          }`}
                        >
                          <Text
                            className={`${
                              activeComponent === component.id
                                ? isDark
                                  ? 'text-primary-dark'
                                  : 'text-primary-light'
                                : textPrimary
                            } text-subtitle-md font-inter-semibold`}
                          >
                            {component.name}
                          </Text>
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
                
                {/* Conteúdo do componente */}
                <View className="flex-1">
                  {renderComponentContent()}
                </View>
              </View>
            )}
          </View>
        )}
      </View>
    </>
  );
}

// Tipos
interface SectionTitleProps {
  title: string;
  textColor: string;
}

interface ColorCardProps {
  name: string;
  color: string;
  textColor: string;
}

interface SpacingExampleProps {
  size: string;
  bgColor: string;
  textColor: string;
}

// Componentes auxiliares
const SectionTitle = ({ title, textColor }: SectionTitleProps) => (
  <View className="mb-md">
    <Text className={`text-headline-sm font-inter-bold ${textColor}`}>{title}</Text>
    <View className="h-[1px] bg-divider-light dark:bg-divider-dark mt-xs" />
  </View>
);

const ColorCard = ({ name, color, textColor }: ColorCardProps) => (
  <View className="mb-sm">
    <View className={`${color} w-16 h-16 rounded-md mb-xs`} />
    <Text className={`text-label-sm ${textColor}`}>{name}</Text>
  </View>
);

const SpacingExample = ({ size, bgColor, textColor }: SpacingExampleProps) => (
  <View className="items-center mr-md mb-md">
    <View className={`${bgColor} h-8`} style={{ width: parseInt(size.replace(/[^0-9]/g, '') || '4') * 4 }} />
    <Text className={`text-label-sm ${textColor} mt-xs`}>{size}</Text>
  </View>
);