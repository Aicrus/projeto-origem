import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeOptionProps {
  title: string;
  isActive: boolean;
  onPress: () => void;
  isDark: boolean;
}

const ThemeOption = ({ 
  title, 
  isActive, 
  onPress, 
  isDark 
}: ThemeOptionProps) => {
  // Classes baseadas no tema e estado
  const bgColor = isActive 
    ? (isDark ? 'bg-primary-dark' : 'bg-primary-light') 
    : (isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light');
    
  const textColor = isActive 
    ? 'text-text-primary-dark' 
    : (isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light');
    
  const fontWeight = isActive ? 'font-inter-semibold' : 'font-inter-regular';

  return (
    <Pressable
      onPress={onPress}
      className={`py-xs px-md mx-xs rounded-md ${bgColor}`}
    >
      <Text
        className={`text-label-md text-center ${textColor} ${fontWeight}`}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export const ThemeSelector = () => {
  const { currentTheme, themeMode, setThemeMode } = useTheme();
  const isDark = currentTheme === 'dark';

  const changeTheme = (newTheme: ThemeMode) => {
    setThemeMode(newTheme);
  };

  // Classes de texto baseadas no tema
  const labelTextColor = isDark ? 'text-divider-light' : 'text-text-secondary-light';
  const statusTextColor = isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light';

  return (
    <View className="my-xl items-center w-full">
      <Text
        className={`text-body-md ${labelTextColor} mb-sm`}
      >
        Tema:
      </Text>
      <View className="flex-row justify-center mb-xs">
        <ThemeOption
          title="Claro"
          isActive={themeMode === 'light'}
          onPress={() => changeTheme('light')}
          isDark={isDark}
        />
        <ThemeOption
          title="Escuro"
          isActive={themeMode === 'dark'}
          onPress={() => changeTheme('dark')}
          isDark={isDark}
        />
        <ThemeOption
          title="Sistema"
          isActive={themeMode === 'system'}
          onPress={() => changeTheme('system')}
          isDark={isDark}
        />
      </View>
      <Text
        className={`text-body-sm ${statusTextColor} mt-xs`}
      >
        {themeMode === 'system' 
          ? `Sistema (${currentTheme === 'dark' ? 'escuro' : 'claro'})` 
          : themeMode === 'dark' 
            ? 'Escuro' 
            : 'Claro'}
      </Text>
    </View>
  );
}; 