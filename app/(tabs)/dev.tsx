import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput, Switch, Image, Platform, useWindowDimensions, Pressable } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Input } from '../../components/AicrusComponents/input';
import { Select } from '../../components/AicrusComponents/select';
import { Accordion, AccordionGroup } from '../../components/AicrusComponents/accordion';
import { colors } from '../../components/AicrusComponents/constants/theme';
import { Button } from '../../components/AicrusComponents/button';
import { Mail, Plus, ChevronRight, Type, ChevronDown, ChevronsUpDown, Square, Settings, AlertCircle, Info, CheckCircle, AlertTriangle, X, Bell, MessageSquare, Sun, SunMoon, MousePointer, Move } from 'lucide-react-native';
import { Toast, ToastPositionLabels } from '../../components/AicrusComponents/toast';
import { ThemeSelector } from '../../components/AicrusComponents/theme-selector';
import { HoverableView } from '@/components/AicrusComponents/hoverable-view';

export default function DevPage() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [activeComponent, setActiveComponent] = useState<'input' | 'select' | 'accordion' | 'button' | 'designSystem' | 'toast' | 'themeSelector' | 'hoverableView' | null>('designSystem');
  const [toastVisible, setToastVisible] = useState(false);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info' | 'warning'>('success');
  const [toastPosition, setToastPosition] = useState<'top' | 'bottom' | 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'>('top');
  const [toastClosable, setToastClosable] = useState(false);
  const [toastProgressBar, setToastProgressBar] = useState(true);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  // HoverableView estados de exemplo
  const [activeItem, setActiveItem] = useState<number | null>(null);
  
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
  
  // Verifica se estamos em ambiente móvel/nativo
  const isNative = Platform.OS !== 'web';
  
  // Ajusta posição do toast para ambiente nativo
  useEffect(() => {
    if (isNative) {
      // Em ambiente nativo, apenas 'top' e 'bottom' são posições válidas
      if (!['top', 'bottom'].includes(toastPosition)) {
        setToastPosition('top');
      }
    }
  }, [isNative, toastPosition]);
  
  // Validar email
  const isValidEmail = (email: string) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  // Selecionar o primeiro componente automaticamente quando mudar para a seção de componentes
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
    { id: 'designSystem', name: 'Design System', icon: 'Settings' },
    { id: 'input', name: 'Input', icon: 'Type' },
    { id: 'select', name: 'Select', icon: 'ChevronDown' },
    { id: 'accordion', name: 'Accordion', icon: 'ChevronsUpDown' },
    { id: 'button', name: 'Button', icon: 'Square' },
    { id: 'toast', name: 'Toast', icon: 'Bell' },
    { id: 'themeSelector', name: 'Theme Selector', icon: 'SunMoon' },
    { id: 'hoverableView', name: 'Hoverable View', icon: 'MousePointer' },
  ];
  
  // Função para renderizar o ícone correto
  const renderIcon = (iconName: string) => {
    const iconColor = isDark ? '#FFFFFF' : '#57636C'; // Branco para modo escuro, cor original para claro
    
    switch (iconName) {
      case 'Type':
        return <Type strokeWidth={1.5} color={iconColor} />;
      case 'ChevronDown':
        return <ChevronDown strokeWidth={1.5} color={iconColor} />;
      case 'ChevronsUpDown':
        return <ChevronsUpDown strokeWidth={1.5} color={iconColor} />;
      case 'Square':
        return <Square strokeWidth={1.5} color={iconColor} />;
      case 'Settings':
        return <Settings strokeWidth={1.5} color={iconColor} />;
      case 'Bell':
        return <Bell strokeWidth={1.5} color={iconColor} />;
      case 'MessageSquare':
        return <MessageSquare strokeWidth={1.5} color={iconColor} />;
      case 'Sun':
        return <Sun strokeWidth={1.5} color={iconColor} />;
      case 'SunMoon':
        return <SunMoon strokeWidth={1.5} color={iconColor} />;
      case 'MousePointer':
        return <MousePointer strokeWidth={1.5} color={iconColor} />;
      default:
        return <Settings strokeWidth={1.5} color={iconColor} />;
    }
  };
  
  // Função para renderizar o conteúdo do componente selecionado
  const renderComponentContent = () => {
    if (!activeComponent) {
      return (
        <View className="p-lg">
          <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-md`}>
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
      case 'accordion':
        return renderAccordionComponent();
      case 'button':
        return renderButtonComponent();
      case 'designSystem':
        return renderDesignSystem();
      case 'toast':
        return renderToastComponent();
      case 'themeSelector':
        return renderThemeSelectorComponent();
      case 'hoverableView':
        return renderHoverableViewComponent();
      default:
        return null;
    }
  };
  
  // Função para renderizar o componente Input e seus exemplos
  const renderInputComponent = () => {
    return (
      <View className="p-lg">
        <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-sm`}>
          Componente Input
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O Input é um componente altamente personalizável para entrada de texto, que suporta
          vários tipos de entrada, máscaras, estados e estilos. Mantém a mesma experiência 
          consistente entre plataformas (iOS, Android, Web).
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* Input básico */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Input básico</Text>
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
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Input de senha</Text>
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
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Input com validação de email</Text>
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
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Input de busca</Text>
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
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Input com máscara (CPF)</Text>
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
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O Input é totalmente adaptável às necessidades do seu projeto:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tema adaptativo</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Alterna automaticamente entre temas claro e escuro</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Responsividade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Comportamento consistente entre desktop e dispositivos móveis</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Acessibilidade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Compatível com leitores de tela e navegação por teclado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Personalização</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Estilo totalmente customizável via props</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Multiformato</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Suporta diversos tipos de entrada e formatação</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente Input possui diversas propriedades para personalização:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>value</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Valor atual do input (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>onChangeText</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Função chamada quando o valor muda (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>placeholder</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Texto exibido quando o input está vazio</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>label</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Rótulo exibido acima do input</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>type</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Tipo de input: 'text', 'password', 'search', 'number', 'email'</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>mask</Text>
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
        <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-sm`}>
          Componente Select
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O Select é um componente de seleção dropdown altamente personalizável que oferece
          uma experiência unificada em todas as plataformas (iOS, Android, Web), adaptando-se 
          às convenções de cada plataforma.
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* Select básico */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Select básico</Text>
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
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Select com busca</Text>
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
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Select múltiplo</Text>
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
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O Select se adapta inteligentemente ao ambiente:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Posicionamento inteligente</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Abre para cima ou para baixo dependendo do espaço disponível</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Interface por plataforma</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Modal em dispositivos móveis e dropdown flutuante na web</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Busca avançada</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Pesquisa em qualquer parte do texto, ignora acentos, maiúsculas e minúsculas</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Estilo consistente</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Segue o tema da aplicação com transições suaves</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Acessibilidade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Suporte para navegação por teclado e leitores de tela</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Animações otimizadas</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Transições suaves com desempenho otimizado</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente Select possui diversas propriedades para personalização:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>options</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Array de opções com {'{ value, label }'} (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>value</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Valor selecionado - string ou array[string] (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>setValue</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Função para atualizar o valor (obrigatório)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>placeholder</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Texto exibido quando nada está selecionado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>multiple</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Permite selecionar múltiplos itens</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>searchable</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Adiciona campo de busca nas opções</Text>
          </View>
          
          <Text className={`text-body-sm ${textSecondary} mt-md`}>
            E muitas outras propriedades para personalização completa...
          </Text>
        </View>
      </View>
    );
  };
  
  // Função para renderizar o componente Accordion e seus exemplos
  const renderAccordionComponent = () => {
    return (
      <View className="p-lg">
        <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-sm`}>
          Componente Accordion
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O Accordion é um componente expansível que permite ocultar e mostrar conteúdo conforme
          necessário, economizando espaço na interface e melhorando a organização da informação.
          Oferece uma experiência consistente em todas as plataformas.
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* FAQ como na imagem - diretamente visível */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>FAQ - Perguntas Frequentes</Text>
            <View>
              <AccordionGroup>
                <Accordion
                  title="É acessível?"
                  content="Sim, o componente Accordion é totalmente acessível, compatível com leitores de tela e navegável por teclado. Ele segue as melhores práticas de acessibilidade WCAG."
                  bordered={true}
                  showOutline={false}
                  showSeparator={true}
                  separatorSpacing={12}
                  id="accessible"
                  animationDuration={350}
                />
                <Accordion
                  title="É estilizado?"
                  content="Sim, o Accordion é altamente estilizável. Você pode personalizar completamente a aparência do cabeçalho, conteúdo, ícones e animações usando as propriedades style, headerStyle e contentStyle."
                  bordered={true}
                  showOutline={false}
                  showSeparator={true}
                  separatorSpacing={12}
                  id="styled"
                  animationDuration={350}
                />
                <Accordion
                  title="É animado?"
                  content="Sim, o Accordion possui animações suaves e otimizadas para expandir e colapsar o conteúdo. As animações são adaptadas para cada plataforma, garantindo a melhor experiência possível."
                  bordered={true}
                  showOutline={false}
                  showSeparator={true}
                  separatorSpacing={12}
                  id="animated"
                  animationDuration={350}
                />
              </AccordionGroup>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Grupo de accordions em estilo minimalista sem contorno externo com linhas divisórias entre todos os itens.
            </Text>
          </View>
          
          {/* Accordion básico */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Accordion básico</Text>
            <Accordion
              title="Clique para expandir"
              content="Este é o conteúdo do accordion básico. O componente oferece uma forma elegante de ocultar conteúdo que pode ser expandido quando necessário."
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Accordion simples com título e conteúdo como texto.
            </Text>
          </View>
          
          {/* Accordion com conteúdo personalizado */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Accordion com conteúdo personalizado</Text>
            <Accordion
              title="Conteúdo personalizado"
              defaultOpen={true}
            >
              <View className="p-xs">
                <Text className={`text-body-md ${textPrimary} mb-sm`}>
                  Este accordion contém elementos personalizados.
                </Text>
                <View className={`${bgTertiary} p-sm rounded-md mb-sm`}>
                  <Text className={`text-body-sm ${textSecondary}`}>
                    Você pode incluir qualquer componente React Native aqui.
                  </Text>
                </View>
                <Pressable 
                  className={`px-md py-sm rounded-md bg-primary-light dark:bg-primary-dark items-center`}
                >
                  <Text className={`text-label-sm font-jakarta-semibold text-white`}>Botão de Exemplo</Text>
                </Pressable>
              </View>
            </Accordion>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Accordion com conteúdo personalizado usando elementos React Native.
            </Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O Accordion oferece uma série de recursos para facilitar a navegação em conteúdos extensos:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Animações suaves</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Transições animadas para expandir e colapsar o conteúdo</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tema adaptativo</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Adapta-se automaticamente a temas claros e escuros</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Personalização</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Cabeçalho e conteúdo personalizáveis</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Responsividade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Funciona igualmente bem em dispositivos móveis e desktop</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Estrutura aninhada</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Suporte para accordions dentro de accordions</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente Accordion possui diversas propriedades para personalização:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>title</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Título do accordion (string)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>content</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Conteúdo de texto simples (string)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>children</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Componentes React Native para conteúdo personalizado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>defaultOpen</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se o accordion deve iniciar aberto (boolean)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>separatorSpacing</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Espaçamento da linha divisória em pixels (number)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>customHeader</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Função para renderizar um cabeçalho personalizado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>onToggle</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Callback chamado ao abrir ou fechar</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>bordered</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se deve mostrar borda ao redor do accordion</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>showOutline</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se deve mostrar o contorno/borda externa (boolean)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>showSeparator</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se deve mostrar a linha divisória quando expandido (boolean)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>animationDuration</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Duração da animação em milissegundos (number)</Text>
          </View>
          
          <Text className={`text-body-sm ${textSecondary} mt-md`}>
            E outras propriedades para personalização completa do componente...
          </Text>
        </View>

        {/* Adicionar seção de AccordionGroup */}
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          AccordionGroup
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente AccordionGroup permite agrupar múltiplos accordions e garantir que apenas um esteja aberto por vez:
        </Text>

        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Uso</Text>
            <Text className={`text-body-sm ${textSecondary}`}>
              Envolva vários accordions com o componente AccordionGroup para criar comportamento de grupo.
            </Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Benefícios</Text>
            <Text className={`text-body-sm ${textSecondary}`}>
              • Melhora a experiência do usuário evitando múltiplos conteúdos abertos
              • Ideal para FAQs e menus de navegação
              • Gerencia automaticamente o estado de abertura/fechamento
            </Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Propriedades</Text>
            <Text className={`text-body-sm ${textSecondary}`}>
              • children: Os componentes Accordion a serem agrupados
              • defaultOpenId: ID do accordion que deve iniciar aberto
            </Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Exemplo de código</Text>
            <Text className={`text-body-sm ${textSecondary}`}>
              {`<AccordionGroup defaultOpenId="section1">
  <Accordion id="section1" title="Seção 1" content="Conteúdo 1" />
  <Accordion id="section2" title="Seção 2" content="Conteúdo 2" />
</AccordionGroup>`}
            </Text>
          </View>
        </View>
      </View>
    );
  };
  
  const renderButtonComponent = () => {
    return (
      <View className="p-lg">
        <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-sm`}>
          Componente Button
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O Button é um componente altamente personalizável para ações interativas, oferecendo
          diversas variantes, estados e opções de personalização. Ele mantém uma experiência visual
          e interativa consistente em todas as plataformas.
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* Variantes básicas */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Variantes de Botão</Text>
            <View className="flex-row flex-wrap gap-sm mb-sm">
              <Button variant="primary" onPress={() => {}}>
                Primary
              </Button>
              <Button variant="destructive" onPress={() => {}}>
                Destructive
              </Button>
              <Button variant="outline" onPress={() => {}}>
                Outline
              </Button>
              <Button variant="ghost" onPress={() => {}}>
                Ghost
              </Button>
              <Button variant="link" onPress={() => {}}>
                Link
              </Button>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Principais variantes visuais disponíveis para uso em diferentes contextos.
            </Text>
          </View>
          
          {/* Tamanhos */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Tamanhos</Text>
            <View className="flex-row flex-wrap items-center gap-sm mb-sm">
              <Button size="xs" variant="primary" onPress={() => {}}>
                Extra pequeno
              </Button>
              <Button size="sm" variant="primary" onPress={() => {}}>
                Pequeno
              </Button>
              <Button size="md" variant="primary" onPress={() => {}}>
                Médio (padrão)
              </Button>
              <Button size="lg" variant="primary" onPress={() => {}}>
                Grande
              </Button>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Botões em diferentes tamanhos para se adequar a diversas necessidades de UI.
            </Text>
          </View>
          
          {/* Botões com ícones */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Botões com Ícones</Text>
            <View className="flex-row flex-wrap gap-sm mb-sm">
              <Button 
                variant="primary" 
                leftIcon={<Mail size={16} strokeWidth={1.5} color="#FFFFFF" />}
                onPress={() => {}}
                size="md"
              >
                Ícone à esquerda
              </Button>
              <Button 
                variant="outline" 
                rightIcon={<ChevronRight size={16} strokeWidth={1.5} color={isDark ? "#FFFFFF" : "#14181B"} />}
                onPress={() => {}}
                size="md"
              >
                Ícone à direita
              </Button>
              <Button 
                variant="ghost" 
                isIconOnly
                onPress={() => {}}
                size="md"
              >
                <Plus size={16} strokeWidth={1.5} color={isDark ? "#FFFFFF" : "#14181B"} />
              </Button>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Botões podem incluir ícones à esquerda, à direita ou serem compostos apenas por um ícone.
            </Text>
          </View>
          
          {/* Estados do botão */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Estados</Text>
            <View className="flex-row flex-wrap gap-sm mb-sm">
              <Button 
                variant="primary" 
                onPress={() => {}}
              >
                Normal
              </Button>
              <Button 
                variant="primary" 
                onPress={() => {}}
                disabled
              >
                Desabilitado
              </Button>
              <Button 
                variant="primary" 
                onPress={() => {}}
                loading
              >
                Carregando
              </Button>
              <Button 
                variant="primary" 
                onPress={() => {}}
                loading
                loadingText="Aguarde..."
              >
                Com texto
              </Button>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Botões em diferentes estados: normal, desabilitado e carregamento.
            </Text>
          </View>
          
          {/* Botão Login com Email com ícone */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Exemplo prático</Text>
            <View className="mb-sm">
              <Button 
                variant="primary" 
                leftIcon={<Mail size={16} strokeWidth={1.5} color="#FFFFFF" />}
                onPress={() => {}}
                fullWidth
                size="md"
              >
                Login with Email
              </Button>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Botão de login com largura total e ícone, ilustrando um caso de uso comum.
            </Text>
          </View>
          
          {/* Botão de loading */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Botão com loading</Text>
            <View className="mb-sm">
              <Button 
                variant="primary" 
                onPress={() => {}}
                loading
                loadingText="Please wait"
              >
                Please wait
              </Button>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Botão em estado de carregamento com texto informativo para o usuário.
            </Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O Button oferece diversas características para atender diferentes necessidades:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Variantes</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Primary, Destructive, Outline, Ghost, Link</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tamanhos</Text>
            <Text className={`text-body-sm ${textSecondary}`}>xs, sm, md, lg para diferentes necessidades de UI</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tema adaptativo</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Adapta-se automaticamente a temas claros e escuros</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Acessibilidade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Compatível com leitores de tela e navegação por teclado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Estados</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Normal, Disabled, Loading com feedback visual adequado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Ícones</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Suporte a ícones à esquerda, à direita ou botão de ícone</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente Button possui diversas propriedades para personalização:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>children</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Texto do botão ou conteúdo React</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>variant</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Estilo visual ('primary', 'destructive', 'outline', 'ghost', 'link')</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>size</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Tamanho do botão ('xs', 'sm', 'md', 'lg')</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>loading</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se o botão está em estado de carregamento (boolean)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>loadingText</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Texto exibido durante o carregamento (string)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>disabled</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se o botão está desabilitado (boolean)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>leftIcon / rightIcon</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Ícones exibidos à esquerda/direita do texto (ReactNode)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>isIconOnly</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se o botão contém apenas um ícone (boolean)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>onPress</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Função chamada quando o botão é pressionado</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>fullWidth</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se o botão deve ocupar toda a largura disponível (boolean)</Text>
          </View>
          
          <Text className={`text-body-sm ${textSecondary} mt-md`}>
            E outras propriedades para personalização completa do componente...
          </Text>
        </View>
      </View>
    );
  };

  const renderDesignSystem = () => {
    return (
      <ScrollView className="flex-1"
        contentContainerStyle={{ 
          paddingBottom: isMobile ? 120 : 0 
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className={`p-lg`}>
          {/* Título da seção */}
          <Text className={`text-headline-lg font-jakarta-bold ${textPrimary} mb-md`}>
            Design System
          </Text>
          <Text className={`text-body-md ${textSecondary} mb-xl`}>
            Use este guia como referência para implementar a UI consistente em todo o aplicativo.
          </Text>

          {/* Seção de Cores */}
          <SectionTitle title="Cores" textColor={textPrimary} />
          
          {/* Cores Primárias - Light/Dark theme */}
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Cores Primárias</Text>
          <View className="flex-row flex-wrap gap-md mb-lg">
            <ColorCard name="Primary" color="bg-primary-light dark:bg-primary-dark" textColor={textPrimary} />
            <ColorCard name="Primary Hover" color="bg-primary-light-hover dark:bg-primary-dark-hover" textColor={textPrimary} />
            <ColorCard name="Primary Active" color="bg-primary-light-active dark:bg-primary-dark-active" textColor={textPrimary} />
            <ColorCard name="Secondary" color="bg-secondary-light dark:bg-secondary-dark" textColor={textPrimary} />
            <ColorCard name="Secondary Hover" color="bg-secondary-light-hover dark:bg-secondary-dark-hover" textColor={textPrimary} />
            <ColorCard name="Secondary Active" color="bg-secondary-light-active dark:bg-secondary-dark-active" textColor={textPrimary} />
            <ColorCard name="Tertiary" color="bg-tertiary-light dark:bg-tertiary-dark" textColor={textPrimary} />
            <ColorCard name="Tertiary Hover" color="bg-tertiary-light-hover dark:bg-tertiary-dark-hover" textColor={textPrimary} />
            <ColorCard name="Tertiary Active" color="bg-tertiary-light-active dark:bg-tertiary-dark-active" textColor={textPrimary} />
            <ColorCard name="Alternate" color="bg-alternate-light dark:bg-alternate-dark" textColor={textPrimary} />
          </View>
          
          {/* Cores de Texto */}
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Texto</Text>
          <View className="flex-row flex-wrap gap-md mb-lg">
            <ColorCard name="Text Primary" color="bg-text-primary-light dark:bg-text-primary-dark" textColor={textPrimary} />
            <ColorCard name="Text Secondary" color="bg-text-secondary-light dark:bg-text-secondary-dark" textColor={textPrimary} />
            <ColorCard name="Text Tertiary" color="bg-text-tertiary-light dark:bg-text-tertiary-dark" textColor={textPrimary} />
          </View>
          
          {/* Cores de Background */}
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Background</Text>
          <View className="flex-row flex-wrap gap-md mb-lg">
            <ColorCard name="BG Primary" color="bg-bg-primary-light dark:bg-bg-primary-dark" textColor={textPrimary} />
            <ColorCard name="BG Secondary" color="bg-bg-secondary-light dark:bg-bg-secondary-dark" textColor={textPrimary} />
            <ColorCard name="BG Tertiary" color="bg-bg-tertiary-light dark:bg-bg-tertiary-dark" textColor={textPrimary} />
            <ColorCard name="Icon" color="bg-icon-light dark:bg-icon-dark" textColor={textPrimary} />
            <ColorCard name="Divider" color="bg-divider-light dark:bg-divider-dark" textColor={textPrimary} />
            <ColorCard name="Hover" color="bg-hover-light dark:bg-hover-dark" textColor={textPrimary} />
            <ColorCard name="Active" color="bg-active-light dark:bg-active-dark" textColor={textPrimary} />
          </View>
          
          {/* Cores de Feedback */}
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Feedback</Text>
          <View className="flex-row flex-wrap gap-md mb-lg">
            {/* Success */}
            <View className="mb-sm">
              <Text className={`text-subtitle-sm font-jakarta-semibold ${textPrimary} mb-xs`}>Sucesso</Text>
              <View className="flex-row flex-wrap gap-sm">
                <ColorCard name="Success BG" color="bg-success-bg-light dark:bg-success-bg-dark" textColor={textPrimary} />
                <ColorCard name="Success Text" color="bg-success-text-light dark:bg-success-text-dark" textColor={textPrimary} />
                <ColorCard name="Success Border" color="bg-success-border-light dark:bg-success-border-dark" textColor={textPrimary} />
                <ColorCard name="Success Icon" color="bg-success-icon-light dark:bg-success-icon-dark" textColor={textPrimary} />
              </View>
            </View>
            
            {/* Warning */}
            <View className="mb-sm">
              <Text className={`text-subtitle-sm font-jakarta-semibold ${textPrimary} mb-xs`}>Alerta</Text>
              <View className="flex-row flex-wrap gap-sm">
                <ColorCard name="Warning BG" color="bg-warning-bg-light dark:bg-warning-bg-dark" textColor={textPrimary} />
                <ColorCard name="Warning Text" color="bg-warning-text-light dark:bg-warning-text-dark" textColor={textPrimary} />
                <ColorCard name="Warning Border" color="bg-warning-border-light dark:bg-warning-border-dark" textColor={textPrimary} />
                <ColorCard name="Warning Icon" color="bg-warning-icon-light dark:bg-warning-icon-dark" textColor={textPrimary} />
              </View>
            </View>
            
            {/* Error */}
            <View className="mb-sm">
              <Text className={`text-subtitle-sm font-jakarta-semibold ${textPrimary} mb-xs`}>Erro</Text>
              <View className="flex-row flex-wrap gap-sm">
                <ColorCard name="Error BG" color="bg-error-bg-light dark:bg-error-bg-dark" textColor={textPrimary} />
                <ColorCard name="Error Text" color="bg-error-text-light dark:bg-error-text-dark" textColor={textPrimary} />
                <ColorCard name="Error Border" color="bg-error-border-light dark:bg-error-border-dark" textColor={textPrimary} />
                <ColorCard name="Error Icon" color="bg-error-icon-light dark:bg-error-icon-dark" textColor={textPrimary} />
              </View>
            </View>
            
            {/* Info */}
            <View className="mb-sm">
              <Text className={`text-subtitle-sm font-jakarta-semibold ${textPrimary} mb-xs`}>Informação</Text>
              <View className="flex-row flex-wrap gap-sm">
                <ColorCard name="Info BG" color="bg-info-bg-light dark:bg-info-bg-dark" textColor={textPrimary} />
                <ColorCard name="Info Text" color="bg-info-text-light dark:bg-info-text-dark" textColor={textPrimary} />
                <ColorCard name="Info Border" color="bg-info-border-light dark:bg-info-border-dark" textColor={textPrimary} />
                <ColorCard name="Info Icon" color="bg-info-icon-light dark:bg-info-icon-dark" textColor={textPrimary} />
              </View>
            </View>
          </View>
          
          {/* Cores de Gradiente */}
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Gradientes</Text>
          <View className="flex-row flex-wrap gap-md mb-xl">
            <View className="h-20 w-48 rounded-lg bg-gradient-to-r from-gradient-primary-start to-gradient-primary-end">
              <Text className="text-white text-subtitle-sm font-jakarta-semibold p-md">Primário</Text>
            </View>
            <View className="h-20 w-48 rounded-lg bg-gradient-to-r from-gradient-secondary-start to-gradient-secondary-end">
              <Text className="text-white text-subtitle-sm font-jakarta-semibold p-md">Secundário</Text>
            </View>
            <View className="h-20 w-48 rounded-lg bg-gradient-to-r from-gradient-tertiary-start to-gradient-tertiary-end">
              <Text className="text-white text-subtitle-sm font-jakarta-semibold p-md">Terciário</Text>
            </View>
          </View>

          {/* Seção de Tipografia */}
          <SectionTitle title="Tipografia" textColor={textPrimary} />
          
          <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
            <Text className={`text-display-xl font-jakarta-extrabold ${textPrimary} mb-sm`}>Display XL (Jakarta ExtraBold)</Text>
            <Text className={`text-display-lg font-jakarta-extrabold ${textPrimary} mb-sm`}>Display Lg (Jakarta ExtraBold)</Text>
            <Text className={`text-display-md font-jakarta-bold ${textPrimary} mb-sm`}>Display Md (Jakarta Bold)</Text>
            <Text className={`text-display-sm font-jakarta-bold ${textPrimary} mb-sm`}>Display Sm (Jakarta Bold)</Text>
            
            <Text className={`text-headline-xl font-jakarta-bold ${textPrimary} mb-sm`}>Headline XL (Jakarta Bold)</Text>
            <Text className={`text-headline-lg font-jakarta-bold ${textPrimary} mb-sm`}>Headline Lg (Jakarta Bold)</Text>
            <Text className={`text-headline-md font-jakarta-bold ${textPrimary} mb-sm`}>Headline Md (Jakarta Bold)</Text>
            <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-sm`}>Headline Sm (Jakarta Bold)</Text>
            
            <Text className={`text-title-lg font-jakarta-bold ${textPrimary} mb-sm`}>Title Lg (Jakarta Bold)</Text>
            <Text className={`text-title-md font-jakarta-bold ${textPrimary} mb-sm`}>Title Md (Jakarta Bold)</Text>
            <Text className={`text-title-sm font-jakarta-bold ${textPrimary} mb-sm`}>Title Sm (Jakarta Bold)</Text>
            
            <Text className={`text-subtitle-lg font-jakarta-semibold ${textPrimary} mb-sm`}>Subtitle Lg (Jakarta SemiBold)</Text>
            <Text className={`text-subtitle-md font-jakarta-semibold ${textPrimary} mb-sm`}>Subtitle Md (Jakarta SemiBold)</Text>
            <Text className={`text-subtitle-sm font-jakarta-semibold ${textPrimary} mb-sm`}>Subtitle Sm (Jakarta SemiBold)</Text>
            
            <Text className={`text-label-lg font-jakarta-semibold ${textPrimary} mb-sm`}>Label Lg (Jakarta SemiBold)</Text>
            <Text className={`text-label-md font-jakarta-semibold ${textPrimary} mb-sm`}>Label Md (Jakarta SemiBold)</Text>
            <Text className={`text-label-sm font-jakarta-semibold ${textPrimary} mb-sm`}>Label Sm (Jakarta SemiBold)</Text>
            
            <Text className={`text-body-lg font-jakarta-regular ${textPrimary} mb-sm`}>Body Lg (Jakarta Regular)</Text>
            <Text className={`text-body-md font-jakarta-regular ${textPrimary} mb-sm`}>Body Md (Jakarta Regular)</Text>
            <Text className={`text-body-sm font-jakarta-regular ${textPrimary} mb-sm`}>Body Sm (Jakarta Regular)</Text>
            <Text className={`text-body-xs font-jakarta-regular ${textPrimary} mb-sm`}>Body Xs (Jakarta Regular)</Text>
            
            <Text className={`text-mono-lg font-mono-regular ${textPrimary} mb-sm`}>Mono Lg (Space Mono)</Text>
            <Text className={`text-mono-md font-mono-regular ${textPrimary} mb-sm`}>Mono Md (Space Mono)</Text>
            <Text className={`text-mono-sm font-mono-regular ${textPrimary} mb-sm`}>Mono Sm (Space Mono)</Text>
            
            <View className="border-t border-divider-light dark:border-divider-dark my-md"></View>
            
            <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>Pesos disponíveis da fonte</Text>
            
            <Text className={`text-body-lg font-jakarta-thin ${textPrimary} mb-sm`}>Plus Jakarta Sans ExtraLight (200)</Text>
            <Text className={`text-body-lg font-jakarta-light ${textPrimary} mb-sm`}>Plus Jakarta Sans Light (300)</Text>
            <Text className={`text-body-lg font-jakarta-regular ${textPrimary} mb-sm`}>Plus Jakarta Sans Regular (400)</Text>
            <Text className={`text-body-lg font-jakarta-medium ${textPrimary} mb-sm`}>Plus Jakarta Sans Medium (500)</Text>
            <Text className={`text-body-lg font-jakarta-semibold ${textPrimary} mb-sm`}>Plus Jakarta Sans SemiBold (600)</Text>
            <Text className={`text-body-lg font-jakarta-bold ${textPrimary} mb-sm`}>Plus Jakarta Sans Bold (700)</Text>
            <Text className={`text-body-lg font-jakarta-extrabold ${textPrimary} mb-sm`}>Plus Jakarta Sans ExtraBold (800)</Text>
            
            <View className="border-t border-divider-light dark:border-divider-dark my-md"></View>
            
            <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>Exemplo de fonte mono</Text>
            <Text className={`text-body-lg font-mono-regular ${textPrimary} mb-sm`}>Space Mono (para código)</Text>
          </View>

          {/* Seção de Espaçamentos */}
          <SectionTitle title="Espaçamentos" textColor={textPrimary} />
          
          <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
            <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Aliases Semânticos</Text>
            <View className="flex-row flex-wrap mb-lg">
              <SpacingExample size="xxxs" value="2px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="xxs" value="4px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="xs" value="8px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="sm" value="12px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="md" value="16px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="lg" value="24px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="xl" value="32px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="2xl" value="48px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="3xl" value="64px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="4xl" value="80px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="5xl" value="96px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <SpacingExample size="6xl" value="128px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
            </View>
            
            <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Extra Pequenos/Pequenos (0-20px)</Text>
            <View className="flex-row flex-wrap mb-lg">
              <SpacingExample size="0" value="0px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="px" value="1px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="0.5" value="2px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="1" value="4px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="1.5" value="6px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="2" value="8px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="2.5" value="10px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="3" value="12px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="3.5" value="14px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="4" value="16px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
              <SpacingExample size="5" value="20px" bgColor={isDark ? 'bg-secondary-dark' : 'bg-secondary-light'} textColor={textPrimary} />
            </View>
            
            <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Médios (24-64px)</Text>
            <View className="flex-row flex-wrap mb-lg">
              <SpacingExample size="6" value="24px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
              <SpacingExample size="7" value="28px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
              <SpacingExample size="8" value="32px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
              <SpacingExample size="9" value="36px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
              <SpacingExample size="10" value="40px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
              <SpacingExample size="11" value="44px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
              <SpacingExample size="12" value="48px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
              <SpacingExample size="14" value="56px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
              <SpacingExample size="16" value="64px" bgColor={isDark ? 'bg-tertiary-dark' : 'bg-tertiary-light'} textColor={textPrimary} />
            </View>
            
            <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Grandes (72-128px)</Text>
            <View className="flex-row flex-wrap mb-lg">
              <SpacingExample size="18" value="72px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
              <SpacingExample size="20" value="80px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
              <SpacingExample size="24" value="96px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
              <SpacingExample size="28" value="112px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
              <SpacingExample size="32" value="128px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
            </View>
            
            <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Gigantes (144-384px)</Text>
            <View className="flex-row flex-wrap mb-md">
              <SpacingExample size="36" value="144px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="40" value="160px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="44" value="176px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="48" value="192px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="52" value="208px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="56" value="224px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="60" value="240px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="64" value="256px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="72" value="288px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="80" value="320px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
              <SpacingExample size="96" value="384px" bgColor={isDark ? 'bg-secondary-dark/70' : 'bg-secondary-light/70'} textColor={textPrimary} />
            </View>
          </View>
          
          {/* Seção de Border Radius */}
          <SectionTitle title="Border Radius" textColor={textPrimary} />
          
          <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
            <View className="flex-row flex-wrap gap-md">
              <BorderRadiusExample name="none" value="0" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="xs" value="2px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="sm" value="4px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="md" value="8px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="lg" value="12px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="xl" value="16px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="2xl" value="20px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="3xl" value="24px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="4xl" value="28px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="5xl" value="32px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <BorderRadiusExample name="full" value="9999px" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
            </View>
          </View>
          
          {/* Seção de Sombras */}
          <SectionTitle title="Sombras" textColor={textPrimary} />
          
          <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
            <View className="grid grid-cols-2 md:grid-cols-3 gap-md">
              <ShadowExample name="none" shadow="shadow-none" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="xs" shadow="shadow-xs" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="sm" shadow="shadow-sm" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="md" shadow="shadow-md" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="lg" shadow="shadow-lg" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="xl" shadow="shadow-xl" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="2xl" shadow="shadow-2xl" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="inner" shadow="shadow-inner" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="light-card" shadow="shadow-light-card dark:shadow-dark-card" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="light-button" shadow="shadow-light-button dark:shadow-dark-button" textColor={textPrimary} bgColor={bgTertiary} />
              <ShadowExample name="float" shadow="shadow-float" textColor={textPrimary} bgColor={bgTertiary} />
            </View>
          </View>
          
          {/* Seção de Opacidade */}
          <SectionTitle title="Opacidade" textColor={textPrimary} />
          
          <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
            <View className="grid grid-cols-3 md:grid-cols-6 gap-md">
              <OpacityExample name="0" value="0" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="5" value="0.05" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="10" value="0.1" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="15" value="0.15" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="20" value="0.2" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="25" value="0.25" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="30" value="0.3" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="40" value="0.4" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="50" value="0.5" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="60" value="0.6" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="70" value="0.7" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="75" value="0.75" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="80" value="0.8" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="85" value="0.85" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="90" value="0.9" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="95" value="0.95" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
              <OpacityExample name="100" value="1" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
            </View>
          </View>
          
          {/* Seção de z-index */}
          <SectionTitle title="Z-Index" textColor={textPrimary} />
          
          <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
            <View className="grid grid-cols-3 md:grid-cols-6 gap-md">
              <ValueDisplay name="0" value="0" textColor={textPrimary} />
              <ValueDisplay name="10" value="10" textColor={textPrimary} />
              <ValueDisplay name="20" value="20" textColor={textPrimary} />
              <ValueDisplay name="30" value="30" textColor={textPrimary} />
              <ValueDisplay name="40" value="40" textColor={textPrimary} />
              <ValueDisplay name="50" value="50" textColor={textPrimary} />
              <ValueDisplay name="60" value="60" textColor={textPrimary} />
              <ValueDisplay name="70" value="70" textColor={textPrimary} />
              <ValueDisplay name="80" value="80" textColor={textPrimary} />
              <ValueDisplay name="90" value="90" textColor={textPrimary} />
              <ValueDisplay name="100" value="100" textColor={textPrimary} />
              <ValueDisplay name="auto" value="auto" textColor={textPrimary} />
            </View>
          </View>
          
          {/* Seção de Tempos de Transição */}
          <SectionTitle title="Tempos de Transição" textColor={textPrimary} />
          
          <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
            <View className="grid grid-cols-2 md:grid-cols-4 gap-md">
              <ValueDisplay name="75" value="75ms" textColor={textPrimary} />
              <ValueDisplay name="100" value="100ms" textColor={textPrimary} />
              <ValueDisplay name="150" value="150ms" textColor={textPrimary} />
              <ValueDisplay name="200" value="200ms" textColor={textPrimary} />
              <ValueDisplay name="300" value="300ms" textColor={textPrimary} />
              <ValueDisplay name="500" value="500ms" textColor={textPrimary} />
              <ValueDisplay name="700" value="700ms" textColor={textPrimary} />
              <ValueDisplay name="1000" value="1000ms" textColor={textPrimary} />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  };

  const renderToastComponent = () => {
    const showToast = (type: 'success' | 'error' | 'info' | 'warning') => {
      // Primeiro esconde qualquer toast visível
      setToastVisible(false);
      
      // Pequeno atraso para garantir que o estado anterior seja processado
      setTimeout(() => {
        setToastType(type);
        setToastVisible(true);
      }, 100);
    };

    // Verifica se estamos em ambiente móvel/nativo - removido pois já existe no escopo global
    const mobilePositions = ['top', 'bottom'];

    return (
      <View className="p-lg">
        <Toast
          visible={toastVisible}
          type={toastType}
          position={toastPosition}
          message={`Toast de ${toastType === 'success' ? 'sucesso' : 
                          toastType === 'error' ? 'erro' : 
                          toastType === 'warning' ? 'alerta' : 'informação'}`}
          description={`Este é um exemplo de toast do tipo ${toastType}, posicionado na posição ${ToastPositionLabels[toastPosition]}.`}
          closable={toastClosable}
          showProgressBar={toastProgressBar}
          duration={10000} // Aumentando a duração para testes
          onHide={() => setToastVisible(false)}
        />

        <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-sm`}>
          Componente Toast
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O Toast é um componente de notificação que fornece feedback contextual aos usuários.
          Suporta diferentes tipos, posições e opções de personalização, mantendo uma experiência
          consistente em todas as plataformas.
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* Tipos de Toast */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Tipos de Toast</Text>
            <View className="flex-row flex-wrap gap-sm mb-sm">
              <Button 
                variant="primary" 
                onPress={() => showToast('success')}
                leftIcon={<CheckCircle size={16} strokeWidth={1.5} color="#FFFFFF" />}
              >
                Sucesso
              </Button>
              <Button 
                variant="destructive" 
                onPress={() => showToast('error')}
                leftIcon={<AlertCircle size={16} strokeWidth={1.5} color="#FFFFFF" />}
              >
                Erro
              </Button>
              <Button 
                variant="outline" 
                onPress={() => showToast('warning')}
                leftIcon={<AlertTriangle size={16} strokeWidth={1.5} color={isDark ? "#FFFFFF" : "#14181B"} />}
              >
                Alerta
              </Button>
              <Button 
                variant="ghost" 
                onPress={() => showToast('info')}
                leftIcon={<Info size={16} strokeWidth={1.5} color={isDark ? "#FFFFFF" : "#14181B"} />}
              >
                Informação
              </Button>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Diferentes tipos de Toast para diferentes contextos de feedback.
            </Text>
          </View>
          
          {/* Posições */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Posições</Text>
            {isNative ? (
              // Em dispositivos nativos, mostramos apenas top e bottom
              <View className="flex-row flex-wrap gap-sm mb-sm">
                <Button 
                  variant={toastPosition === 'top' ? "primary" : "outline"} 
                  onPress={() => {
                    setToastPosition('top');
                    showToast(toastType);
                  }}
                  size="sm"
                >
                  {ToastPositionLabels['top']}
                </Button>
                <Button 
                  variant={toastPosition === 'bottom' ? "primary" : "outline"} 
                  onPress={() => {
                    setToastPosition('bottom');
                    showToast(toastType);
                  }}
                  size="sm"
                >
                  {ToastPositionLabels['bottom']}
                </Button>
                <Text className={`text-body-sm ${textSecondary} mt-sm`}>
                  Em dispositivos móveis, o Toast é exibido apenas nas posições superior e inferior.
                </Text>
              </View>
            ) : (
              // Na web, mostramos todas as opções de posição
              <View className="flex-row flex-wrap gap-sm mb-sm">
                <View className="flex-col gap-sm mr-sm">
                  <Text className={`text-body-sm font-jakarta-semibold ${textPrimary} mb-xs`}>Topo</Text>
                  <Button 
                    variant={toastPosition === 'top' ? "primary" : "outline"} 
                    onPress={() => {
                      setToastPosition('top');
                      showToast(toastType);
                    }}
                    size="sm"
                  >
                    {ToastPositionLabels['top']}
                  </Button>
                  <Button 
                    variant={toastPosition === 'top-left' ? "primary" : "outline"} 
                    onPress={() => {
                      setToastPosition('top-left');
                      showToast(toastType);
                    }}
                    size="sm"
                  >
                    {ToastPositionLabels['top-left']}
                  </Button>
                  <Button 
                    variant={toastPosition === 'top-right' ? "primary" : "outline"} 
                    onPress={() => {
                      setToastPosition('top-right');
                      showToast(toastType);
                    }}
                    size="sm"
                  >
                    {ToastPositionLabels['top-right']}
                  </Button>
                </View>
                <View className="flex-col gap-sm">
                  <Text className={`text-body-sm font-jakarta-semibold ${textPrimary} mb-xs`}>Base</Text>
                  <Button 
                    variant={toastPosition === 'bottom' ? "primary" : "outline"} 
                    onPress={() => {
                      setToastPosition('bottom');
                      showToast(toastType);
                    }}
                    size="sm"
                  >
                    {ToastPositionLabels['bottom']}
                  </Button>
                  <Button 
                    variant={toastPosition === 'bottom-left' ? "primary" : "outline"} 
                    onPress={() => {
                      setToastPosition('bottom-left');
                      showToast(toastType);
                    }}
                    size="sm"
                  >
                    {ToastPositionLabels['bottom-left']}
                  </Button>
                  <Button 
                    variant={toastPosition === 'bottom-right' ? "primary" : "outline"} 
                    onPress={() => {
                      setToastPosition('bottom-right');
                      showToast(toastType);
                    }}
                    size="sm"
                  >
                    {ToastPositionLabels['bottom-right']}
                  </Button>
                </View>
              </View>
            )}
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              {isNative 
                ? "Em dispositivos móveis, o Toast é posicionado no topo (acima da StatusBar) ou na parte inferior (acima da TabBar)."
                : "O Toast pode ser posicionado em diferentes áreas da tela, incluindo todos os cantos."
              }
            </Text>
          </View>
          
          {/* Opções */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Opções</Text>
            <View className="flex-row flex-wrap gap-sm mb-sm">
              <Button 
                variant={toastClosable ? "primary" : "outline"} 
                onPress={() => {
                  setToastClosable(!toastClosable);
                  showToast(toastType);
                }}
              >
                {toastClosable ? "Com botão de fechar" : "Sem botão de fechar"}
              </Button>

              <Button 
                variant={toastProgressBar ? "primary" : "outline"} 
                onPress={() => {
                  setToastProgressBar(!toastProgressBar);
                  showToast(toastType);
                }}
              >
                {toastProgressBar ? "Com barra de progresso" : "Sem barra de progresso"}
              </Button>
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              O Toast pode ter um botão de fechamento, barra de progresso e outras opções de personalização.
            </Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O Toast oferece diversas características para atender diferentes necessidades:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tipos</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Success, Error, Warning, Info para diferentes contextos</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Posições</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Flexibilidade para posicionamento em seis posições diferentes: ${Object.values(ToastPositionLabels).join(', ')}</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Animações</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Animações suaves de entrada e saída</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Personalização</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Título, descrição e opções de fechamento</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tema adaptativo</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Adapta-se automaticamente a temas claros e escuros</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Responsividade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Layout responsivo para diferentes tamanhos de tela</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente Toast possui diversas propriedades para personalização:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>visible</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se o toast está visível (boolean)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>type</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Tipo de toast ('success', 'error', 'warning', 'info')</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>position</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Posição na tela ('top', 'bottom', 'top-left', 'top-right', 'bottom-left', 'bottom-right')</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>message</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Mensagem principal do toast (string)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>description</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Descrição opcional para detalhes adicionais (string)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>duration</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Tempo de exibição em ms (0 para não desaparecer automaticamente)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>closable</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se o toast possui botão de fechamento (boolean)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>onHide</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Função chamada quando o toast é fechado (callback)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>showProgressBar</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Se deve mostrar a barra de progresso (boolean)</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Uso
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          Exemplo de implementação com useToast hook para gerenciar os estados:
        </Text>
        
        <View className={`bg-bg-tertiary-${isDark ? 'dark' : 'light'} rounded-lg p-md mb-lg`}>
          <Text className={`text-mono-md font-mono-regular ${textPrimary}`}>
{`// Usando o hook useToast
const { showToast } = useToast();

// Mostrar um toast de sucesso
showToast({
  type: 'success',
  message: 'Operação concluída',
  description: 'Os dados foram salvos com sucesso.',
  showProgressBar: true
});

// Mostrar um toast de erro com mais duração
showToast({
  type: 'error',
  message: 'Erro ao processar',
  description: 'Tente novamente mais tarde.',
  duration: 6000,
  position: 'bottom',
  showProgressBar: true
});`}
          </Text>
        </View>
      </View>
    );
  };

  const renderThemeSelectorComponent = () => {
    // Para verificar se estamos em ambiente móvel/nativo ou desktop
    const isNative = Platform.OS !== 'web';
    const isMobile = width < 768;
    const isSmallScreen = isNative || isMobile;

    return (
      <View className="p-lg">
        <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-sm`}>
          Componente Theme Selector
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O Theme Selector é um componente interativo que permite alternar entre os modos de tema
          (claro, escuro e sistema) com animações suaves e feedback visual.
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* Tamanhos diferentes */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Diferentes tamanhos</Text>
            {isSmallScreen ? (
              // Em dispositivos móveis e nativos, mostrar apenas o tamanho pequeno (sm)
              <View className="flex-row space-x-lg items-center">
                <ThemeSelector size="sm" />
                <Text className={`text-body-sm ${textSecondary} ml-sm`}>
                  Tamanho SM (recomendado para mobile)
                </Text>
              </View>
            ) : (
              // Em tablets e desktop, mostrar todos os tamanhos
              <View className="flex-row space-x-lg items-center">
                <ThemeSelector size="sm" />
                <ThemeSelector size="md" />
                <ThemeSelector size="lg" />
                <ThemeSelector size="xl" />
              </View>
            )}
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              {isSmallScreen 
                ? "Em dispositivos móveis, recomendamos usar apenas o tamanho pequeno (sm)."
                : "Tamanhos disponíveis: sm, md (padrão), lg, xl"}
            </Text>
          </View>

          {/* Variante pill */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Estilo pill (arredondado)</Text>
            <ThemeSelector variant="pill" size={isSmallScreen ? "sm" : "md"} />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Versão com cantos completamente arredondados.
            </Text>
          </View>
          
          {/* Variante minimal */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Estilo minimal (sem fundo)</Text>
            <ThemeSelector variant="minimal" size={isSmallScreen ? "sm" : "md"} />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Versão minimalista sem fundo ou slider.
            </Text>
          </View>

          {/* Exemplo com rótulos */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Com rótulos integrados</Text>
            <ThemeSelector variant="labeled" showLabels={true} size={isSmallScreen ? "sm" : "lg"} />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Versão com rótulos abaixo dos ícones para melhor compreensão.
            </Text>
          </View>

          {/* Estilo toggle */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Alternância simples (toggle)</Text>
            <ThemeSelector variant="toggle" size={isSmallScreen ? "sm" : "lg"} />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Versão simplificada para alternar entre claro e escuro.
            </Text>
          </View>

          {/* Estilo Single */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Botão único</Text>
            <View className="flex-row items-center space-x-lg">
              <ThemeSelector variant="single" size={isSmallScreen ? "sm" : "md"} />
              <ThemeSelector variant="single" size={isSmallScreen ? "sm" : "md"} transparentSingle={true} />
              <ThemeSelector variant="single" size={isSmallScreen ? "sm" : "md"} iconOnly={true} />
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Um único botão que alterna entre temas ao ser clicado. Versões com fundo colorido (esquerda), transparente com borda (centro) e apenas ícone sem fundo/borda (direita).
            </Text>
          </View>

          {/* Sem opção de sistema */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Sem opção de sistema</Text>
            <ThemeSelector showSystemOption={false} size={isSmallScreen ? "sm" : "md"} />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Versão com apenas dois modos (claro/escuro).
            </Text>
          </View>
          
          {/* Exemplo com cores personalizadas */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Cores personalizadas</Text>
            <ThemeSelector 
              customColors={{
                background: isDark ? '#2A2D3A' : '#E8EAED',
                sliderBackground: isDark ? '#6C5CE7' : '#6C5CE7',
                activeIconColor: '#FFFFFF',
              }} 
              size={isSmallScreen ? "sm" : "md"}
            />
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Customização completa de cores.
            </Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>transparentSingle</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Tornar o botão único (single) transparente (boolean, padrão: false)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>iconOnly</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Mostrar apenas o ícone sem fundo e sem borda (boolean, padrão: false)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>customColors</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Objeto para personalização das cores (background, sliderBackground, activeIconColor, inactiveIconColor)</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O Theme Selector oferece diversas características para uma experiência de usuário fluida:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Animações suaves</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Transições animadas entre os modos de tema</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tema adaptativo</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Adapta-se automaticamente ao tema atual</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Ícones intuitivos</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Representação visual clara de cada modo de tema</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Responsividade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Funciona igualmente bem em todas as plataformas</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Variantes de estilo</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Diferentes estilos visuais para adaptação ao design</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tamanhos múltiplos</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Opções de tamanho para diferentes contextos</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente Theme Selector possui as seguintes propriedades:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>className</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Classes adicionais para personalização (string)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>size</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Tamanho do componente: 'sm', 'md', 'lg', 'xl' (padrão: 'md')</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>variant</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Estilo visual: 'default', 'pill', 'minimal', 'labeled', 'toggle', 'single' (padrão: 'default')</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>showLabels</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Exibir rótulos para os modos (boolean, padrão: false)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>showSystemOption</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Exibir opção de tema do sistema (boolean, padrão: true)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>customColors</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Objeto para personalização das cores (background, sliderBackground, activeIconColor, inactiveIconColor)</Text>
          </View>
        </View>
      </View>
    );
  };

  // Função para renderizar o componente HoverableView e seus exemplos
  const renderHoverableViewComponent = () => {
    return (
      <View className="p-lg">
        <Text className={`text-headline-sm font-jakarta-bold ${textPrimary} mb-sm`}>
          Componente HoverableView
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O HoverableView é um componente para criar elementos interativos com efeitos de hover 
          personalizáveis. Melhora a experiência do usuário ao fornecer feedback visual quando 
          o cursor do mouse passa sobre o elemento.
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-lg`}>Exemplos:</Text>
          
          {/* Exemplo básico */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Hover básico</Text>
            <HoverableView className="p-md rounded-md border border-divider-light">
              <Text className={`${textPrimary}`}>Passe o mouse sobre este elemento</Text>
            </HoverableView>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Versão básica com efeito de hover padrão (apenas cor de fundo alterada).
            </Text>
          </View>
          
          {/* Exemplo com múltiplos efeitos - igual ao básico, mas com escala */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Combinação de efeitos</Text>
            <HoverableView 
              className="p-md rounded-md border border-divider-light"
              hoverScale={1.02}
            >
              <Text className={`${textPrimary}`}>Básico + efeito de escala</Text>
            </HoverableView>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Adiciona um sutil efeito de escala ao hover básico.
            </Text>
          </View>
          
          {/* Exemplo com escala */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Efeito de escala</Text>
            <HoverableView 
              className="p-md rounded-md border border-divider-light"
              hoverScale={1.05}
              disableHoverBackground={true}
            >
              <Text className={`${textPrimary}`}>Efeito de escala (zoom) no hover</Text>
            </HoverableView>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Efeito de escala (zoom) quando o cursor passa sobre o elemento, sem alteração de cor.
            </Text>
          </View>
          
          {/* Exemplo com movimento */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Efeito de movimento</Text>
            <HoverableView 
              className="p-md rounded-md border border-divider-light"
              hoverTranslateX={8}
              hoverTranslateY={0}
              disableHoverBackground={false}
              hoverColor={isDark ? 'rgba(137, 44, 220, 0.08)' : 'rgba(137, 44, 220, 0.05)'}
            >
              <View className="flex-row items-center">
                <Text className={`${textPrimary} mr-xs`}>Movimento horizontal</Text>
                <ChevronRight size={16} color={isDark ? '#FFFFFF' : '#000000'} />
              </View>
            </HoverableView>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              O elemento se move horizontalmente e muda sutilmente a cor de fundo.
            </Text>
          </View>
          
          {/* Exemplo de estado ativo */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Estado ativo</Text>
            <View className="flex-row flex-wrap">
              {[1, 2, 3].map((item) => (
                <HoverableView 
                  key={item}
                  className="p-md rounded-md m-xs"
                  isActive={activeItem === item}
                  activeBackgroundColor={activeItem === item ? colors.primary.main : undefined}
                  hoverColor={isDark ? 'rgba(137, 44, 220, 0.15)' : 'rgba(137, 44, 220, 0.1)'}
                  onPress={() => setActiveItem(item)}
                >
                  <Text className={activeItem === item ? 'text-white' : textPrimary}>Item {item}</Text>
                </HoverableView>
              ))}
            </View>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Os itens têm estados ativos quando selecionados. Clique em um item para ativá-lo.
            </Text>
          </View>
          
          {/* Exemplo com cores personalizadas */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Cores personalizadas</Text>
            <HoverableView 
              className="p-md rounded-md"
              hoverColor={isDark ? 'rgba(22, 163, 74, 0.25)' : 'rgba(22, 163, 74, 0.15)'}
              backgroundColor={isDark ? 'rgba(22, 163, 74, 0.15)' : 'rgba(22, 163, 74, 0.05)'}
            >
              <Text className={`${textPrimary}`}>Cores personalizadas para hover</Text>
            </HoverableView>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              É possível definir cores personalizadas para os estados normal e hover.
            </Text>
          </View>
          
          {/* Hover sem animações */}
          <View className="mb-lg">
            <Text className={`text-subtitle-sm font-jakarta-bold ${textPrimary} mb-sm`}>Hover sem animações</Text>
            <HoverableView 
              className="p-md rounded-md border border-divider-light"
              disableAnimation={true}
              hoverColor={isDark ? 'rgba(0, 0, 0, 0.06)' : 'rgba(0, 0, 0, 0.04)'}
            >
              <Text className={`${textPrimary}`}>Mesmo que o básico, mas sem animação</Text>
            </HoverableView>
            <Text className={`text-body-sm ${textSecondary} mt-xs`}>
              Igual ao Hover básico, mas sem as animações suaves na transição.
            </Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Características
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O HoverableView oferece diversas características para melhorar a interatividade:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Efeitos visuais</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Escala, movimento, rotação e elevação</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Transições suaves</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Animações configuráveis com duração personalizada</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Compatibilidade</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Funciona em todas as plataformas (efeitos completos na web)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>Tema adaptativo</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Cores adaptadas automaticamente ao tema atual</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Propriedades
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-lg`}>
          O componente HoverableView possui as seguintes propriedades:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>hoverScale</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Escala ao passar o mouse (number, padrão: 1 - sem escala)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>hoverTranslateX/Y</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Deslocamento horizontal/vertical (number, padrão: 0)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>hoverRotate</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Rotação em graus (number, padrão: 0)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>hoverElevation</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Sombra/elevação adicional (number, padrão: 0)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>hoverOpacity</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Opacidade ao passar o mouse (number, 0 a 1)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>disableHoverBackground</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Desativa a mudança de cor de fundo (boolean, padrão: false)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>disableAnimation</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Desativa todas as animações (boolean, padrão: false)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>animationDuration</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Duração da animação em ms (number, padrão: 200)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>isActive</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Estado ativo do elemento (boolean, padrão: false)</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>backgroundColor/hoverColor/activeColor</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Cores personalizadas para os diferentes estados</Text>
          </View>
          
          <View className="mb-sm">
            <Text className={`text-label-md font-jakarta-bold ${textPrimary}`}>onHoverStateChange</Text>
            <Text className={`text-body-sm ${textSecondary}`}>Callback quando o estado de hover muda (function)</Text>
          </View>
        </View>
        
        <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-sm`}>
          Uso com Tailwind
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-md`}>
          O componente suporta a propriedade className para estilização com Tailwind CSS:
        </Text>
        
        <View className={`${bgSecondary} rounded-lg p-md mb-lg`}>
          <Text className={`text-body-sm font-mono ${textSecondary}`}>
            {`<HoverableView className="p-4 rounded-md bg-primary-light">\n  <Text>Conteúdo com estilo Tailwind</Text>\n</HoverableView>`}
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
        <View className="flex-1">
          {isMobile ? (
            // Layout para dispositivos móveis com botões compactos no topo
            <View className="flex-1">
              {/* Navegação compacta para dispositivos móveis */}
              <View className={`border-b ${border} py-1 ${bgSecondary}`}>
                <ScrollView 
                  horizontal 
                  showsHorizontalScrollIndicator={false} 
                  contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 4 }}
                >
                  {availableComponents.map((component) => (
                    <Pressable
                      key={component.id}
                      onPress={() => setActiveComponent(component.id as 'input' | 'select' | 'accordion' | 'button' | 'designSystem' | 'toast' | 'themeSelector' | 'hoverableView')}
                      className={`mr-2 px-3 py-1 rounded-md ${
                        activeComponent === component.id
                          ? isDark
                            ? 'bg-primary-dark'
                            : 'bg-primary-light'
                          : isDark 
                            ? 'bg-bg-tertiary-dark' 
                            : 'bg-bg-secondary-light'
                      }`}
                      style={{ 
                        height: 32,
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      <Text
                        className={`${
                          activeComponent === component.id
                            ? 'text-white'
                            : textPrimary
                        } text-body-sm font-jakarta-medium`}
                      >
                        {component.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
              
              {/* Conteúdo do componente em um ScrollView isolado */}
              <ScrollView 
                className="flex-1" 
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ 
                  flexGrow: 1,
                  paddingBottom: 120 
                }}
              >
                {renderComponentContent()}
              </ScrollView>
            </View>
          ) : (
            // Layout para desktop com sidebar lateral - versão moderna e elegante
            <View className="flex-row flex-1">
              {/* Lista de componentes - sidebar mais fina e elegante */}
              <View className={`w-[220px] border-r ${border} bg-opacity-50 ${bgSecondary}`}>
                <View className="py-md px-md">
                  <Text className={`text-title-sm font-jakarta-bold ${textPrimary} mb-xs px-xs`}>
                    Componentes
                  </Text>
                  
                  <View className="flex-col">
                    {availableComponents.map((component) => {
                      // Substituir a importação dinâmica pela nossa função renderIcon
                      return (
                        <Pressable
                          key={component.id}
                          onPress={() => setActiveComponent(component.id as 'input' | 'select' | 'accordion' | 'button' | 'designSystem' | 'toast' | 'themeSelector' | 'hoverableView')}
                          className={`flex-row items-center py-xs px-xs my-[2px] rounded-md ${
                            activeComponent === component.id
                              ? isDark
                                ? 'bg-primary-dark/10'
                                : 'bg-primary-light/10'
                              : ''
                          }`}
                        >
                          <View
                            className={`w-8 h-8 rounded-md mr-sm items-center justify-center ${
                              activeComponent === component.id
                                ? isDark 
                                  ? 'bg-primary-dark/20' 
                                  : 'bg-primary-light/20'
                                : isDark 
                                  ? 'bg-gray-700' 
                                  : 'bg-gray-200'
                            }`}
                          >
                            {renderIcon(component.icon)}
                          </View>
                          <Text
                            className={`${
                              activeComponent === component.id
                                ? isDark
                                  ? 'text-primary-dark font-jakarta-semibold'
                                  : 'text-primary-light font-jakarta-semibold'
                                : textSecondary
                            } text-body-sm`}
                          >
                            {component.name}
                          </Text>
                        </Pressable>
                      );
                    })}
                  </View>
                </View>
              </View>
              
              {/* Conteúdo do componente */}
              <ScrollView 
                className="flex-1"
                contentContainerStyle={{ paddingBottom: 40 }}
                showsVerticalScrollIndicator={false}
              >
                {renderComponentContent()}
              </ScrollView>
            </View>
          )}
        </View>
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
  value?: string;
}

interface BorderRadiusExampleProps {
  name: string;
  value: string;
  bgColor: string;
  textColor: string;
}

interface ShadowExampleProps {
  name: string;
  shadow: string;
  textColor: string;
  bgColor: string;
}

interface OpacityExampleProps {
  name: string;
  value: string;
  bgColor: string;
  textColor: string;
}

interface ValueDisplayProps {
  name: string;
  value: string;
  textColor: string;
}

// Componentes auxiliares
const SectionTitle = ({ title, textColor }: SectionTitleProps) => (
  <View className="mb-md">
    <Text className={`text-headline-sm font-jakarta-bold ${textColor}`}>{title}</Text>
    <View className="h-[1px] bg-divider-light dark:bg-divider-dark mt-xs" />
  </View>
);

const ColorCard = ({ name, color, textColor }: ColorCardProps) => (
  <View className="mb-sm">
    <View className={`${color} w-16 h-16 rounded-md mb-xs`} />
    <Text className={`text-label-sm ${textColor}`}>{name}</Text>
  </View>
);

const SpacingExample = ({ size, bgColor, textColor, value }: SpacingExampleProps) => (
  <View className="items-center mr-md mb-md">
    <View className={`${bgColor} h-8`} style={{ width: parseInt(size.replace(/[^0-9]/g, '') || '4') * 4 }} />
    <Text className={`text-label-sm ${textColor} mt-xs`}>{size}</Text>
    {value && <Text className={`text-body-xs ${textColor} opacity-60`}>{value}</Text>}
  </View>
);

const BorderRadiusExample = ({ name, value, bgColor, textColor }: BorderRadiusExampleProps) => (
  <View className="items-center mr-md mb-md">
    <View 
      className={`${bgColor} h-20 w-20 flex items-center justify-center mb-xs`} 
      style={{ borderRadius: name === "full" ? 9999 : parseInt(value.replace(/[^0-9]/g, '') || '0') }}
    >
      <Text className={`text-white text-label-sm`}>{value}</Text>
    </View>
    <Text className={`text-label-sm ${textColor}`}>{name}</Text>
  </View>
);

const ShadowExample = ({ name, shadow, textColor, bgColor }: ShadowExampleProps) => (
  <View className="items-center mb-md">
    <View className={`${bgColor} ${shadow} h-20 w-full rounded-md flex items-center justify-center mb-xs`}>
      <Text className={`text-body-sm ${textColor}`}>shadow-{name}</Text>
    </View>
    <Text className={`text-label-sm ${textColor}`}>{name}</Text>
  </View>
);

const OpacityExample = ({ name, value, bgColor, textColor }: OpacityExampleProps) => (
  <View className="items-center mb-md">
    <View className={`${bgColor} h-12 w-full rounded-md mb-xs opacity-${name}`} />
    <Text className={`text-label-sm ${textColor}`}>{name}</Text>
    <Text className={`text-body-xs ${textColor} opacity-60`}>{value}</Text>
  </View>
);

const ValueDisplay = ({ name, value, textColor }: ValueDisplayProps) => (
  <View className="items-center mb-md p-xs border border-divider-light dark:border-divider-dark rounded-md">
    <Text className={`text-body-md font-jakarta-semibold ${textColor}`}>{name}</Text>
    <Text className={`text-body-sm ${textColor} opacity-70`}>{value}</Text>
  </View>
);