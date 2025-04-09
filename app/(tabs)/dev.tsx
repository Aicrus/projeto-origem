import React from 'react';
import { Stack } from 'expo-router';
import { useTheme } from '../../hooks/ThemeContext';
import { DesignSystemExample } from '../../components/DesignSystemExample';

export default function DevPage() {
  const { currentTheme } = useTheme();
  
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
      <DesignSystemExample />
    </>
  );
} 