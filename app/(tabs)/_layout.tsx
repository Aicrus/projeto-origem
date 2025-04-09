import { Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { Platform, StyleSheet, View, Text } from 'react-native';
import { Home as HomeIcon, Code as CodeIcon } from 'lucide-react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { ProtectedRoute } from '../../components/ProtectedRoute';
import { useResponsive } from '../../hooks/useResponsive';

/**
 * Mostra um indicador de depuração do breakpoint atual quando em desenvolvimento
 * Útil para testar e verificar os breakpoints
 */
const BreakpointDebugger = ({ currentBreakpoint, width }: { currentBreakpoint: string, width: number }) => {
  if (process.env.NODE_ENV !== 'development') return null;
  
  return (
    <View style={{
      position: 'absolute',
      top: 4,
      right: 4,
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: 4,
      borderRadius: 4,
      zIndex: 9999,
    }}>
      <Text style={{ color: 'white', fontSize: 10 }}>
        {currentBreakpoint} ({width}px)
      </Text>
    </View>
  );
};

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

  // Log para debug apenas uma vez quando o componente é montado
  useEffect(() => {
    console.log(`[Tabs] Status inicial: ${isMobile ? 'Visível' : 'Oculto'} (${width}px / ${currentBreakpoint})`);
  }, []);

  return (
    <ProtectedRoute>
      <BreakpointDebugger currentBreakpoint={currentBreakpoint} width={width} />
      
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: isDark ? '#60a5fa' : '#2563eb',
          headerShown: false,
          tabBarLabelPosition: 'below-icon',
          tabBarStyle: [
            styles.tabBar,
            Platform.select({
              ios: styles.iosTabBar,
              android: styles.androidTabBar,
              web: {
                ...styles.webTabBar,
                backgroundColor: isDark 
                  ? 'rgba(0, 0, 0, 0.75)' 
                  : 'rgba(255, 255, 255, 0.75)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
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
            tabBarIcon: ({ color }: { color: string }) => <HomeIcon size={24} color={color} strokeWidth={1.5} />,
          }}
        />
        <Tabs.Screen
          name="dev"
          options={{
            title: 'Dev',
            tabBarIcon: ({ color }: { color: string }) => <CodeIcon size={24} color={color} strokeWidth={1.5} />,
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
    borderTopColor: 'rgba(128, 128, 128, 0.2)',
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
