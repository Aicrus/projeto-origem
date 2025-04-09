import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';

type ThemeMode = 'light' | 'dark' | 'system';

const ThemeOption = ({ 
  title, 
  isActive, 
  onPress, 
  isDark 
}: { 
  title: string; 
  isActive: boolean; 
  onPress: () => void; 
  isDark: boolean;
}) => {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.optionButton,
        {
          backgroundColor: isActive 
            ? (isDark ? '#4A6FA5' : '#4A6FA5') 
            : (isDark ? '#14181B' : '#FFFFFF')
        }
      ]}
    >
      <Text
        style={[
          styles.optionText,
          {
            color: isActive 
              ? '#FFFFFF' 
              : (isDark ? '#95A1AC' : '#57636C'),
            fontWeight: isActive ? '600' : '400'
          }
        ]}
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

  return (
    <View style={styles.container}>
      <Text
        style={[
          styles.label,
          { color: isDark ? '#E0E3E7' : '#57636C' }
        ]}
      >
        Tema:
      </Text>
      <View style={styles.optionsContainer}>
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
        style={[
          styles.status,
          { color: isDark ? '#95A1AC' : '#57636C' }
        ]}
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

const styles = StyleSheet.create({
  container: {
    marginVertical: 24,
    alignItems: 'center',
    width: '100%',
  },
  label: {
    fontSize: 14,
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  optionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderRadius: 8,
  },
  optionText: {
    fontSize: 14,
    textAlign: 'center',
  },
  status: {
    fontSize: 12,
    marginTop: 8,
  }
}); 