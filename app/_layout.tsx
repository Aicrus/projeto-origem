import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState, memo } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import Head from './head';

// Importação do arquivo global.css para NativeWind
import '@/global.css';

import { useTheme } from '@/hooks/ThemeContext';
import { ThemeProvider } from '@/hooks/ThemeContext';
import { ToastProvider } from '@/hooks/useToast';
import { AuthProvider } from '@/contexts/auth';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Memoize o componente LoadingScreen para evitar renderizações desnecessárias
const LoadingScreen = memo(function LoadingScreen() {
  const { currentTheme } = useTheme();
  
  return (
    <View className={`flex-1 justify-center items-center ${currentTheme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
      <StatusBar 
        style={currentTheme === 'dark' ? 'light' : 'dark'}
        backgroundColor={currentTheme === 'dark' ? '#111827' : '#f9fafb'}
      />
      <ActivityIndicator size="large" color={currentTheme === 'dark' ? '#60a5fa' : '#2563eb'} />
    </View>
  );
});

// Cria um contexto para o Helmet
const helmetContext = {};

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });
  const [initialCheckDone, setInitialCheckDone] = useState(false);

  // Verificar e limpar tokens inválidos na inicialização
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          // Se houver erro ou não houver sessão, limpa qualquer token residual
          await supabase.auth.signOut();
        }
      } catch (e) {
        console.error('Erro ao verificar sessão inicial:', e);
      } finally {
        setInitialCheckDone(true);
      }
    };

    checkSession();
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialCheckDone) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsLoaded, initialCheckDone]);

  if (!fontsLoaded || !initialCheckDone) {
    return (
      <SafeAreaProvider>
        <ThemeProvider>
          <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
            <ActivityIndicator size="large" color="#2563eb" />
          </View>
        </ThemeProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <HelmetProvider context={helmetContext}>
      {/* Adiciona metadados básicos inline */}
      {Platform.OS === 'web' && (
        <Helmet>
          <title>Projeto Origem - Aplicativo Multiplataforma</title>
          <meta name="description" content="Projeto Origem para desenvolvimento de aplicativos React Native/Expo multiplataforma para iOS, Android e Web." />
          <meta charSet="utf-8" />
          <html lang="pt-BR" />
          <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
          <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        </Helmet>
      )}
      <Head />
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <AuthProvider>
              <RootLayoutNav />
            </AuthProvider>
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </HelmetProvider>
  );
}

// Memoize o componente principal 
const RootLayoutNav = memo(function RootLayoutNav() {
  const { currentTheme } = useTheme();
  const { isLoading, isInitialized, session } = useAuth();
  const isDark = currentTheme === 'dark';

  if (isLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  const MainContent = (
    <NavigationThemeProvider value={currentTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View className={`flex-1 ${isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light'}`}>
        <StatusBar 
          style={currentTheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={currentTheme === 'dark' ? '#14181B' : '#F7F8FA'}
        />
        <Stack 
          screenOptions={{
            headerShown: false,
            contentStyle: { 
              flex: 1,
              backgroundColor: currentTheme === 'dark' ? '#14181B' : '#F7F8FA'
            },
            animation: 'none'
          }}
          initialRouteName="(auth)"
        >
          <Stack.Screen 
            name="(auth)" 
            options={{
              gestureEnabled: false
            }}
          />
          <Stack.Screen 
            name="(tabs)"
            options={{
              gestureEnabled: false
            }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </View>
    </NavigationThemeProvider>
  );

  if (Platform.OS === 'web') {
    return MainContent;
  }

  return (
    <SafeAreaView 
      className={`flex-1 ${isDark ? 'bg-bg-tertiary-dark' : 'bg-bg-tertiary-light'}`}
      edges={['top', 'right', 'left']}
    >
      {MainContent}
    </SafeAreaView>
  );
});
