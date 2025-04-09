import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';

/**
 * Componente de exemplo que demonstra o uso do Design System
 * Utilize este componente como referência para implementar os padrões de design em todo o projeto
 */
export const DesignSystemExample = () => {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // Cores do tema atual
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const bgSecondary = isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light';
  const bgTertiary = isDark ? 'bg-bg-tertiary-dark' : 'bg-bg-tertiary-light';
  const textPrimary = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';
  const textSecondary = isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light';
  const border = isDark ? 'border-divider-dark' : 'border-divider-light';

  return (
    <ScrollView className={`flex-1 ${bgPrimary}`}>
      <View className={`p-lg`}>
        {/* Título da seção */}
        <Text className={`text-headline-lg font-inter-bold ${textPrimary} mb-md`}>
          Ferramentas de Dev
        </Text>
        <Text className={`text-body-md ${textSecondary} mb-xl`}>
          Use este componente como referência para implementar a UI consistente em todo o aplicativo.
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
          
          {/* Sombras */}
          <Text className={`text-subtitle-md font-inter-semibold ${textPrimary} mb-md`}>Sombras</Text>
          
          <View className="flex-row flex-wrap gap-md mb-lg">
            <View className="mb-md">
              <View className={`${bgSecondary} shadow-xs w-20 h-20 rounded-md mb-xs items-center justify-center`}>
                <Text className={`text-label-sm ${textPrimary}`}>XS</Text>
              </View>
              <Text className={`text-label-sm ${textPrimary} text-center`}>shadow-xs</Text>
            </View>
            
            <View className="mb-md">
              <View className={`${bgSecondary} shadow-sm w-20 h-20 rounded-md mb-xs items-center justify-center`}>
                <Text className={`text-label-sm ${textPrimary}`}>SM</Text>
              </View>
              <Text className={`text-label-sm ${textPrimary} text-center`}>shadow-sm</Text>
            </View>
            
            <View className="mb-md">
              <View className={`${bgSecondary} shadow-md w-20 h-20 rounded-md mb-xs items-center justify-center`}>
                <Text className={`text-label-sm ${textPrimary}`}>MD</Text>
              </View>
              <Text className={`text-label-sm ${textPrimary} text-center`}>shadow-md</Text>
            </View>
            
            <View className="mb-md">
              <View className={`${bgSecondary} shadow-lg w-20 h-20 rounded-md mb-xs items-center justify-center`}>
                <Text className={`text-label-sm ${textPrimary}`}>LG</Text>
              </View>
              <Text className={`text-label-sm ${textPrimary} text-center`}>shadow-lg</Text>
            </View>
            
            <View className="mb-md">
              <View className={`${bgSecondary} shadow-xl w-20 h-20 rounded-md mb-xs items-center justify-center`}>
                <Text className={`text-label-sm ${textPrimary}`}>XL</Text>
              </View>
              <Text className={`text-label-sm ${textPrimary} text-center`}>shadow-xl</Text>
            </View>
            
            <View className="mb-md">
              <View className={`${bgSecondary} shadow-2xl w-20 h-20 rounded-md mb-xs items-center justify-center`}>
                <Text className={`text-label-sm ${textPrimary}`}>2XL</Text>
              </View>
              <Text className={`text-label-sm ${textPrimary} text-center`}>shadow-2xl</Text>
            </View>
            
            <View className="mb-md">
              <View className={`${bgSecondary} shadow-light-card w-20 h-20 rounded-md mb-xs items-center justify-center`}>
                <Text className={`text-label-sm ${textPrimary}`}>Card</Text>
              </View>
              <Text className={`text-label-sm ${textPrimary} text-center`}>shadow-light-card</Text>
            </View>
            
            <View className="mb-md">
              <View className={`${bgSecondary} shadow-float w-20 h-20 rounded-md mb-xs items-center justify-center`}>
                <Text className={`text-label-sm ${textPrimary}`}>Float</Text>
              </View>
              <Text className={`text-label-sm ${textPrimary} text-center`}>shadow-float</Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

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