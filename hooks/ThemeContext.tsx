import React, { createContext, useContext, useEffect, useState } from 'react';
import { useColorScheme as useDeviceColorScheme, Appearance } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  ThemeMode, 
  ColorScheme, 
  theme, 
  getColorByMode, 
  getThemedValue 
} from '../constants/theme';

interface ThemeContextType {
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  currentTheme: ColorScheme;
  // Expõe todos os valores do tema
  theme: typeof theme;
  // Funções utilitárias
  getColorByMode: (colorBase: string) => string;
  getThemedValue: <T>(lightValue: T, darkValue: T) => T;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@app_theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // Estado para o modo do tema (light/dark/system)
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  // Estado para o tema do dispositivo
  const [systemTheme, setSystemTheme] = useState<ColorScheme>(Appearance.getColorScheme() || 'light');
  const [isLoading, setIsLoading] = useState(true);

  // Carrega o tema salvo quando o app inicia
  useEffect(() => {
    const loadSavedTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        console.log('🎨 Tema salvo carregado:', savedTheme);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme as ThemeMode)) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error('Erro ao carregar tema:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSavedTheme();
  }, []);

  // Monitora mudanças no tema do sistema
  useEffect(() => {
    const subscription = Appearance.addChangeListener(({ colorScheme }) => {
      const newTheme = colorScheme || 'light';
      console.log('🔄 Tema do sistema mudou para:', newTheme);
      setSystemTheme(newTheme as ColorScheme);
    });

    return () => {
      subscription.remove();
    };
  }, []);

  // Função para alterar o modo do tema
  const setThemeMode = async (mode: ThemeMode) => {
    console.log('🎨 Alterando modo do tema para:', mode);
    setThemeModeState(mode);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
    } catch (error) {
      console.error('Erro ao salvar tema:', error);
    }
  };

  // Determina o tema atual baseado no modo e tema do sistema
  const currentTheme: ColorScheme = themeMode === 'system' ? systemTheme : themeMode as ColorScheme;
  
  // Funções utilitárias especificas deste contexto
  const getThemeColor = (colorBase: string): string => {
    return getColorByMode(colorBase, currentTheme);
  };
  
  // Função utilitária para obter valores baseados no tema
  const getThemed = <T,>(lightValue: T, darkValue: T): T => {
    return getThemedValue(currentTheme, lightValue, darkValue);
  };

  // Log para debug
  useEffect(() => {
    console.log('📱 Estado do tema:', {
      themeMode,
      systemTheme,
      currentTheme,
    });
  }, [themeMode, systemTheme, currentTheme]);

  if (isLoading) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={{
        themeMode,
        setThemeMode,
        currentTheme,
        theme,
        getColorByMode: getThemeColor,
        getThemedValue: getThemed,
      }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
} 