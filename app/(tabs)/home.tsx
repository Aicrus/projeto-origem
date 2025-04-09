import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '../../contexts/auth';
import { useTheme } from '../../hooks/ThemeContext';
import { useResponsive } from '../../hooks/useResponsive';
import { ThemeSelector } from '../../components/ThemeSelector';

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

  return (
    <View className={`flex-1 items-center justify-center ${isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light'}`}>
      <Text 
        className={`mb-lg text-center ${isDark ? 'text-text-primary-dark' : 'text-text-primary-light'}`}
        style={{
          fontSize: responsive({
            mobile: 24,
            tablet: 32,
            desktop: 40,
            default: 24
          }),
          lineHeight: responsive({
            mobile: 32,
            tablet: 40,
            desktop: 48,
            default: 32
          }),
          fontFamily: 'Inter_700Bold',
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
        className={`mb-xl text-center mx-lg ${isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}
        style={{
          fontSize: responsive({
            mobile: 14,
            tablet: 16,
            desktop: 18,
            default: 14
          }),
          lineHeight: responsive({
            mobile: 20,
            tablet: 24,
            desktop: 28,
            default: 20
          }),
          fontFamily: 'Inter_400Regular',
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
          className={`px-lg py-md rounded-md ${isDark ? 'bg-primary-dark' : 'bg-primary-light'}`}
          style={{
            minWidth: responsive({
              mobile: 180,
              tablet: 160,
              desktop: 200,
              default: 180
            })
          }}
        >
          <Text className={`text-center text-label-md font-inter-semibold ${isDark ? 'text-text-primary-dark' : 'text-white'}`}>
            Sair do Aplicativo
          </Text>
        </Pressable>
        
        {!isMobile && (
          <Pressable
            onPress={() => {}}
            className={`px-lg py-md rounded-md border ${isDark ? 'border-primary-dark bg-transparent' : 'border-primary-light bg-transparent'}`}
            style={{
              minWidth: responsive({
                mobile: 180,
                tablet: 160,
                desktop: 200,
                default: 180
              })
            }}
          >
            <Text className={`text-center text-label-md font-inter-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
              Botão Secundário
            </Text>
          </Pressable>
        )}
      </View>
      
      {/* Status do breakpoint atual */}
      <View style={styles.statusContainer}>
        <Text style={[
          styles.statusText, 
          { color: isDark ? '#95A1AC' : '#57636C' }
        ]}>
          Breakpoint: {isMobile ? 'Mobile' : (isTablet ? 'Tablet' : 'Desktop')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusContainer: {
    marginTop: 32,
    padding: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.05)'
  },
  statusText: {
    fontSize: 12,
    textAlign: 'center'
  }
}); 