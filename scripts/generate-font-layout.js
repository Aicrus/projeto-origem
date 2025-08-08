#!/usr/bin/env node

/**
 * 🤖 GERADOR AUTOMÁTICO DE LAYOUT COM FONTES
 * ==========================================
 * 
 * Este script gera automaticamente o _layout.tsx baseado na configuração
 * de fonte definida em design-system/tokens/typography.ts
 * 
 * Uso:
 * node scripts/generate-font-layout.js
 */

const fs = require('fs');
const path = require('path');

// Importar a configuração de fonte (simulado - em produção usaria require)
const FONT_CONFIG = { primary: 'jakarta', mono: 'spaceMono' };

const FONT_SYSTEMS = {
  jakarta: {
    package: '@expo-google-fonts/plus-jakarta-sans',
    imports: ['PlusJakartaSans_200ExtraLight', 'PlusJakartaSans_300Light', 'PlusJakartaSans_400Regular', 'PlusJakartaSans_500Medium', 'PlusJakartaSans_600SemiBold', 'PlusJakartaSans_700Bold', 'PlusJakartaSans_800ExtraBold'],
  },
  poppins: {
    package: '@expo-google-fonts/poppins', 
    imports: ['Poppins_100Thin', 'Poppins_300Light', 'Poppins_400Regular', 'Poppins_500Medium', 'Poppins_600SemiBold', 'Poppins_700Bold', 'Poppins_800ExtraBold'],
  },
  inter: {
    package: '@expo-google-fonts/inter',
    imports: ['Inter_100Thin', 'Inter_300Light', 'Inter_400Regular', 'Inter_500Medium', 'Inter_600SemiBold', 'Inter_700Bold', 'Inter_800ExtraBold'],
  },
  spaceMono: {
    package: '@expo-google-fonts/space-mono',
    imports: ['SpaceMono_400Regular'],
  }
};

function generateLayout() {
  const currentFont = FONT_SYSTEMS[FONT_CONFIG.primary];
  const monoFont = FONT_SYSTEMS[FONT_CONFIG.mono];
  
  const allImports = [...currentFont.imports];
  if (FONT_CONFIG.mono !== FONT_CONFIG.primary) {
    allImports.push(...monoFont.imports);
  }
  
  const importNames = allImports.join(',\\n  ');
  const useFontsObject = allImports.map(imp => `    ${imp},`).join('\\n');
  
  return `// ⚠️ ARQUIVO GERADO AUTOMATICAMENTE - NÃO EDITAR MANUALMENTE!
// Este arquivo é gerado baseado na configuração em design-system/tokens/typography.ts
// Para trocar a fonte, altere FONT_CONFIG.primary no typography.ts e execute:
// node scripts/generate-font-layout.js

// Importar polyfills antes de tudo para garantir compatibilidade
import '@/lib/polyfills';

import { DarkTheme, DefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { useFonts, 
  ${importNames}
} from '${currentFont.package}';
${FONT_CONFIG.mono !== FONT_CONFIG.primary ? `import { SpaceMono_400Regular } from '${monoFont.package}';` : ''}
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar as ExpoStatusBar } from 'expo-status-bar';
import { useEffect, useState, memo, useRef } from 'react';
import { ActivityIndicator, Platform, View, StatusBar } from 'react-native';
import 'react-native-reanimated';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { Session } from '@supabase/supabase-js';
import { PortalProvider } from '@gorhom/portal';
import Head from './head';

// Importação do arquivo global.css para NativeWind
import '@/global.css';

import { useTheme } from '@/hooks/DesignSystemContext';
import { DesignSystemProvider } from '@/hooks/DesignSystemContext';
import { ToastProvider } from '@/hooks/useToast';
import { AuthProvider } from '@/contexts/auth';
import { useAuth } from '@/contexts/auth';
import { supabase } from '@/lib/supabase';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Memoize o componente LoadingScreen para evitar renderizações desnecessárias
const LoadingScreen = memo(function LoadingScreen() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  
  return (
    <View className={\`flex-1 justify-center items-center \${isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light'}\`}>
      <ExpoStatusBar 
        style={isDark ? 'light' : 'dark'}
        backgroundColor={isDark ? '#1C1E26' : '#FFFFFF'}
      />
      <ActivityIndicator 
        size="large" 
        color="#892CDC" // Cor primária fixa do tema
      />
    </View>
  );
});

// Cria um contexto para o Helmet
const helmetContext = {};

export default function RootLayout() {
  // 🎯 CARREGAMENTO AUTOMÁTICO DE FONTES (baseado em FONT_CONFIG.primary)
  const [fontsLoaded] = useFonts({
${useFontsObject}
  });
  
  const [initialCheckDone, setInitialCheckDone] = useState(false);
  const [initialSession, setInitialSession] = useState<Session | null>(null);
  const sessionCheckTimeout = useRef<NodeJS.Timeout | number | undefined>(undefined);

  // Verificar e limpar tokens inválidos na inicialização
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session) {
          await supabase.auth.signOut();
          setInitialSession(null);
        } else {
          setInitialSession(data.session);
        }
      } catch (e) {
        console.error('Erro ao verificar sessão inicial:', e);
        setInitialSession(null);
      } finally {
        // Usa um pequeno timeout para suavizar a transição
        sessionCheckTimeout.current = setTimeout(() => {
          setInitialCheckDone(true);
        }, 100) as any;
      }
    };

    checkSession();

    return () => {
      if (sessionCheckTimeout.current) {
        clearTimeout(sessionCheckTimeout.current);
      }
    };
  }, []);

  useEffect(() => {
    if (fontsLoaded && initialCheckDone) {
      SplashScreen.hideAsync().catch(console.error);
    }
  }, [fontsLoaded, initialCheckDone]);

  // Mantém a tela de splash até ter certeza do estado de autenticação
  if (!fontsLoaded || !initialCheckDone) {
    return (
      <SafeAreaProvider>
        <DesignSystemProvider>
          <LoadingScreen />
        </DesignSystemProvider>
      </SafeAreaProvider>
    );
  }

  return (
    <HelmetProvider context={helmetContext}>
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
      <SafeAreaProvider>
        <DesignSystemProvider>
          <Head />
          <PortalProvider>
            <ToastProvider>
              <AuthProvider initialSession={initialSession}>
                <RootLayoutNav />
              </AuthProvider>
            </ToastProvider>
          </PortalProvider>
        </DesignSystemProvider>
      </SafeAreaProvider>
    </HelmetProvider>
  );
}

// Memoize o componente principal 
const RootLayoutNav = memo(function RootLayoutNav() {
  const { currentTheme } = useTheme();
  const { isLoading, isInitialized, session } = useAuth();
  const isDark = currentTheme === 'dark';

  // Se ainda está carregando ou não foi inicializado, mantém a tela de loading
  if (isLoading || !isInitialized) {
    return <LoadingScreen />;
  }

  // Cores do tema conforme definidos em tailwind.config.js e theme.ts
  const headerColors = {
    light: '#FFFFFF', // bg-secondary-light no tailwind.config.js
    dark: '#1C1E26'   // bg-primary-dark no tailwind.config.js
  };

  // Configurar a StatusBar nativa para ter a mesma cor do Header
  useEffect(() => {
    if (Platform.OS !== 'web') {
      // Configurações para Android e iOS
      StatusBar.setBarStyle(isDark ? 'light-content' : 'dark-content');
      
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor(isDark ? headerColors.dark : headerColors.light);
      }
    }
  }, [isDark, headerColors]);

  const MainContent = (
    <NavigationThemeProvider value={currentTheme === 'dark' ? DarkTheme : DefaultTheme}>
      <View className={\`flex-1 \${isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light'}\`}>
        {/* Usando a ExpoStatusBar apenas para manter compatibilidade, mas as configurações reais vêm do StatusBar nativo */}
        <ExpoStatusBar 
          style={currentTheme === 'dark' ? 'light' : 'dark'}
          backgroundColor={isDark ? headerColors.dark : headerColors.light}
        />
        <Stack 
          screenOptions={{
            headerShown: false,
            contentStyle: { 
              flex: 1,
              backgroundColor: currentTheme === 'dark' ? '#14181B' : '#F7F8FA'
            }
          }}
        >
          {session ? (
            <Stack.Screen 
              name="(tabs)" 
              options={{
                gestureEnabled: false,
                animation: 'none'
              }}
            />
          ) : (
            <Stack.Screen 
              name="(auth)" 
              options={{
                gestureEnabled: false,
                animation: 'none'
              }}
            />
          )}
          <Stack.Screen 
            name="+not-found" 
            options={{
              animation: 'none'
            }}
          />
        </Stack>
      </View>
    </NavigationThemeProvider>
  );

  if (Platform.OS === 'web') {
    return MainContent;
  }

  return (
    <SafeAreaView 
      className={\`flex-1 \${isDark ? 'bg-bg-tertiary-dark' : 'bg-bg-tertiary-light'}\`}
      edges={['top', 'right', 'left']}
      style={{ 
        backgroundColor: isDark ? headerColors.dark : headerColors.light 
      }}
    >
      {MainContent}
    </SafeAreaView>
  );
});

// 📝 INFORMAÇÕES DE DEBUG
console.log('🎨 Fonte atual:', '${FONT_CONFIG.primary}');
console.log('📦 Pacote:', '${currentFont.package}');
console.log('📚 Imports:', [${allImports.map(imp => `'${imp}'`).join(', ')}]);
`;
}

// Executar se chamado diretamente
if (require.main === module) {
  console.log('🤖 Gerando _layout.tsx automaticamente...');
  
  const layoutContent = generateLayout();
  const outputPath = path.join(__dirname, '..', 'app', '_layout.tsx');
  
  // Fazer backup do arquivo atual
  if (fs.existsSync(outputPath)) {
    const backupPath = outputPath + '.backup.' + Date.now();
    fs.copyFileSync(outputPath, backupPath);
    console.log('💾 Backup criado:', backupPath);
  }
  
  fs.writeFileSync(outputPath, layoutContent);
  console.log('✅ _layout.tsx gerado com sucesso!');
  console.log('🎯 Para trocar a fonte: altere FONT_CONFIG.primary no typography.ts e execute novamente este script');
}

module.exports = { generateLayout };
