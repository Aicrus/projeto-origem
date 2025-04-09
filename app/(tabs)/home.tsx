import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { useTheme } from '../../hooks/ThemeContext';
import { useResponsive } from '../../hooks/useResponsive';
import { ThemeSelector } from '../../components/ThemeSelector';
import { DesignSystemExample } from '../../components/DesignSystemExample';

export default function Home() {
  const router = useRouter();
  const { signOut } = useAuth();
  const { currentTheme } = useTheme();
  const { responsive, isMobile, isTablet } = useResponsive();
  const isDark = currentTheme === 'dark';

  const handleSignOut = async () => {
    await signOut();
    router.replace('/(auth)/login');
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
    <View className={`flex-1 items-center justify-center ${bgPrimary}`}>
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
      
      {/* Status do breakpoint atual */}
      <View className="mt-xl py-xs px-md rounded-sm bg-opacity-5 bg-black dark:bg-white dark:bg-opacity-5">
        <Text className={`text-body-sm text-center ${textSecondary}`}>
          Breakpoint: {isMobile ? 'Mobile' : (isTablet ? 'Tablet' : 'Desktop')}
        </Text>
      </View>
      
      {/* Link para a página Dev */}
      <Pressable
        onPress={() => router.push('/(tabs)/dev')}
        className={`mt-md px-md py-xs rounded-md bg-secondary-light dark:bg-secondary-dark`}
      >
        <Text className={`text-label-sm font-inter-semibold text-white dark:text-white`}>
          Abrir Ferramentas de Dev
        </Text>
      </Pressable>
    </View>
  );
} 