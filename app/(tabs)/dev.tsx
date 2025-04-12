import React, { useState, useEffect } from 'react';
import { Stack } from 'expo-router';
import { StyleSheet, View, Text, ScrollView, Pressable, Platform, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Input } from '../../components/AicrusComponents/input';
import { Select } from '../../components/AicrusComponents/select';
import { Accordion, AccordionGroup } from '../../components/AicrusComponents/accordion';
import { colors } from '../../components/AicrusComponents/constants/theme';

export default function DevPage() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [activeSection, setActiveSection] = useState<'config' | 'components'>('config');
  const [activeComponent, setActiveComponent] = useState<'input' | 'select' | 'accordion' | null>(null);
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
    { id: 'input', name: 'Input', icon: 'Type' },
    { id: 'select', name: 'Select', icon: 'ChevronDown' },
    { id: 'accordion', name: 'Accordion', icon: 'ChevronsUpDown' },
  ];
  
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
              className={`text-subtitle-md font-jakarta-semibold ${
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
              className={`text-subtitle-md font-jakarta-semibold ${
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
          <ScrollView className="flex-1"
            contentContainerStyle={{ 
              paddingBottom: isMobile ? 120 : 0 
            }}
            showsVerticalScrollIndicator={false}
          >
            <View className={`p-lg`}>
              {/* Título da seção */}
              <Text className={`text-headline-lg font-jakarta-bold ${textPrimary} mb-md`}>
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
                <Text className={`text-display-lg font-jakarta-extrabold ${textPrimary} mb-sm`}>Display Lg (Jakarta ExtraBold)</Text>
                <Text className={`text-display-md font-jakarta-bold ${textPrimary} mb-sm`}>Display Md (Jakarta Bold)</Text>
                <Text className={`text-display-sm font-jakarta-bold ${textPrimary} mb-sm`}>Display Sm (Jakarta Bold)</Text>
                
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
                  <SpacingExample size="xxxs" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="xxs" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="xs" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="sm" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="md" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="lg" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="xl" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="2xl" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="3xl" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="4xl" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <SpacingExample size="5xl" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                </View>
                
                <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Pequenos (0-20px)</Text>
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
                
                <Text className={`text-subtitle-md font-jakarta-bold ${textPrimary} mb-md`}>Grandes (72px+)</Text>
                <View className="flex-row flex-wrap mb-md">
                  <SpacingExample size="18" value="72px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
                  <SpacingExample size="20" value="80px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
                  <SpacingExample size="24" value="96px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
                  <SpacingExample size="32" value="128px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
                  <SpacingExample size="40" value="160px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
                  <SpacingExample size="64" value="256px" bgColor={isDark ? 'bg-primary-dark/70' : 'bg-primary-light/70'} textColor={textPrimary} />
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
                  <OpacityExample name="20" value="0.2" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <OpacityExample name="30" value="0.3" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <OpacityExample name="40" value="0.4" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <OpacityExample name="50" value="0.5" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <OpacityExample name="60" value="0.6" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <OpacityExample name="70" value="0.7" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <OpacityExample name="80" value="0.8" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
                  <OpacityExample name="90" value="0.9" bgColor={isDark ? 'bg-primary-dark' : 'bg-primary-light'} textColor={textPrimary} />
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

              {/* Seção de Componentes */}
              <SectionTitle title="Componentes" textColor={textPrimary} />
              
              <View className={`${bgSecondary} rounded-lg p-lg mb-xl`}>
                {/* Botões */}
                <Text className={`text-subtitle-md font-jakarta-semibold ${textPrimary} mb-md`}>Botões</Text>
                
                <View className="flex-row flex-wrap gap-md mb-lg">
                  <Pressable 
                    className={`px-lg py-md rounded-md bg-primary-light dark:bg-primary-dark`}
                  >
                    <Text className={`text-label-md font-jakarta-semibold text-white`}>Botão Primário</Text>
                  </Pressable>
                  
                  <Pressable 
                    className={`px-lg py-md rounded-md bg-secondary-light dark:bg-secondary-dark`}
                  >
                    <Text className={`text-label-md font-jakarta-semibold text-white`}>Botão Secundário</Text>
                  </Pressable>
                  
                  <Pressable 
                    className={`px-lg py-md rounded-md border border-primary-light dark:border-primary-dark bg-transparent`}
                  >
                    <Text className={`text-label-md font-jakarta-semibold text-primary-light dark:text-primary-dark`}>
                      Botão Outline
                    </Text>
                  </Pressable>
                </View>

                {/* Cards */}
                <Text className={`text-subtitle-md font-jakarta-semibold ${textPrimary} mb-md`}>Cards</Text>
                
                <View className="gap-md mb-lg">
                  <View className={`${bgTertiary} rounded-lg p-md border ${border}`}>
                    <Text className={`text-subtitle-md font-jakarta-semibold ${textPrimary} mb-xs`}>
                      Card Básico
                    </Text>
                    <Text className={`text-body-md ${textSecondary}`}>
                      Este é um exemplo de card básico que pode ser usado para exibir informações.
                    </Text>
                  </View>
                  
                  <View className={`bg-success-bg-light dark:bg-success-bg-dark rounded-lg p-md border border-success-border-light dark:border-success-border-dark`}>
                    <Text className={`text-subtitle-md font-jakarta-semibold text-success-text-light dark:text-success-text-dark mb-xs`}>
                      Card de Sucesso
                    </Text>
                    <Text className={`text-body-md text-success-text-light dark:text-success-text-dark`}>
                      Este é um exemplo de card de sucesso para feedback positivo.
                    </Text>
                  </View>
                  
                  <View className={`bg-error-bg-light dark:bg-error-bg-dark rounded-lg p-md border border-error-border-light dark:border-error-border-dark`}>
                    <Text className={`text-subtitle-md font-jakarta-semibold text-error-text-light dark:text-error-text-dark mb-xs`}>
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
                      onPress={() => setActiveComponent(component.id as 'input' | 'select' | 'accordion')}
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
                        } text-label-md font-jakarta-semibold`}
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
                        // Obter o componente de ícone do Lucide React Native
                        const IconComponent = require('lucide-react-native')[component.icon];
                        
                        return (
                          <Pressable
                            key={component.id}
                            onPress={() => setActiveComponent(component.id as 'input' | 'select' | 'accordion')}
                            className={`flex-row items-center py-xs px-xs my-[2px] rounded-md ${
                              activeComponent === component.id
                                ? isDark
                                  ? 'bg-primary-dark/20'
                                  : 'bg-primary-light/10'
                                : 'hover:bg-bg-tertiary-light hover:dark:bg-bg-tertiary-dark'
                            }`}
                          >
                            <View className="mr-xs">
                              <IconComponent 
                                size={16} 
                                color={
                                  activeComponent === component.id
                                    ? isDark 
                                      ? colors.primary.dark 
                                      : colors.primary.light
                                    : isDark 
                                      ? '#95A1AC' 
                                      : '#57636C'
                                } 
                              />
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