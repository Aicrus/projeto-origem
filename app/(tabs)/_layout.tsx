import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Home as HomeIcon, Code as CodeIcon } from 'lucide-react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useResponsive } from '../../hooks/useResponsive';
import { HapticTab } from '../../components/HapticTab';

/**
 * Estrutura base simplificada para o TabsLayout
 */
export default function TabsLayout() {
  const { currentTheme } = useTheme();
  const { 
    isMobile, 
    width, 
    currentBreakpoint 
  } = useResponsive();
  
  const isDark = currentTheme === 'dark';

  // Definindo cores baseadas no tema
  const activeTabColor = isDark ? '#4A6FA5' : '#892CDC'; // primary-dark / primary-light
  const inactiveTabColor = isDark ? '#95A1AC' : '#57636C'; // text-tertiary-dark / text-secondary-light
  const tabBackgroundColor = isDark 
    ? 'rgba(20, 24, 27, 0.75)' // bg-secondary-dark com transparência
    : 'rgba(255, 255, 255, 0.75)'; // bg-secondary-light com transparência
  const tabBorderColor = isDark 
    ? 'rgba(38, 45, 52, 0.5)' // divider-dark com transparência
    : 'rgba(224, 227, 231, 0.5)'; // divider-light com transparência

  // Log para debug apenas uma vez quando o componente é montado
  useEffect(() => {
    console.log(`[Tabs] Status inicial: ${isMobile ? 'Visível' : 'Oculto'} (${width}px / ${currentBreakpoint})`);
  }, []);

  return (
    <ProtectedRoute>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: activeTabColor,
          tabBarInactiveTintColor: inactiveTabColor,
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
          ...(Platform.OS === 'ios' && { tabBarButton: HapticTab }),
          tabBarStyle: [
            styles.tabBar,
            Platform.select({
              ios: styles.iosTabBar,
              android: styles.androidTabBar,
              web: {
                ...styles.webTabBar,
                backgroundColor: tabBackgroundColor,
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                borderTopColor: tabBorderColor,
                // Esconde a tab bar em tablets e telas grandes
                display: isMobile ? 'flex' : 'none',
              },
              default: {},
            }),
          ],
          tabBarItemStyle: Platform.select({
            web: {
              ...styles.webTabItem,
              paddingTop: 0,
              marginTop: -4,
              height: '100%',
              gap: 2,
            },
            native: {
              ...styles.tabItem,
              marginTop: -6,
            },
          }),
          tabBarLabelStyle: Platform.select({
            web: styles.webTabLabel,
            native: {
              fontSize: 12,
              lineHeight: 16,
              marginTop: -2
            }
          }),
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
              <HomeIcon 
                size={24} 
                color={color} 
                strokeWidth={focused ? 2 : 1.5} 
              />
            ),
          }}
        />
        <Tabs.Screen
          name="dev"
          options={{
            title: 'Dev',
            tabBarIcon: ({ color, focused }: { color: string, focused: boolean }) => (
              <CodeIcon 
                size={24} 
                color={color} 
                strokeWidth={focused ? 2 : 1.5} 
              />
            ),
          }}
        />
      </Tabs>
    </ProtectedRoute>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    display: 'flex',
    height: 80,
    paddingBottom: 25,
  },
  iosTabBar: {
    position: 'absolute',
  },
  androidTabBar: {},
  webTabBar: {
    height: 70,
    paddingTop: 4,
    paddingBottom: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  tabItem: {
    paddingTop: 8,
    gap: 4,
  },
  webTabItem: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webTabLabel: {
    fontSize: 12,
    lineHeight: 16,
    marginTop: -2,
  },
});
