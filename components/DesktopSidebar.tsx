import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { Home, Settings, User, HelpCircle, FileText, LogOut } from 'lucide-react-native';

interface DesktopSidebarProps {
  withHeader?: boolean;
}

export function DesktopSidebar({ withHeader = true }: DesktopSidebarProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';

  // Classes e cores baseadas no tema
  const bgColor = isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light';
  const textColor = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';
  const borderColor = isDark ? 'border-divider-dark' : 'border-divider-light';
  const itemHoverBg = isDark ? 'bg-bg-hover-dark' : 'bg-bg-hover-light';

  // Lista de itens do menu
  const menuItems = [
    { icon: Home, label: 'Início', route: '/home' },
    { icon: User, label: 'Perfil', route: '/profile' },
    { icon: FileText, label: 'Documentos', route: '/documents' },
    { icon: Settings, label: 'Configurações', route: '/settings' },
    { icon: HelpCircle, label: 'Ajuda', route: '/help' },
  ];

  return (
    <View 
      className={`${bgColor} h-full border-r ${borderColor} w-64`}
      style={[
        styles.sidebar,
        { marginTop: withHeader ? 64 : 0 }
      ]}
    >
      <View className={`py-6 px-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <Text className={`text-xl font-bold ${textColor}`}>Menu</Text>
      </View>

      <ScrollView className="flex-1">
        <View className="py-2">
          {menuItems.map((item, index) => (
            <Pressable 
              key={index}
              className={`flex-row items-center px-4 py-3 mx-2 my-1 rounded-md hover:${itemHoverBg}`}
              style={styles.menuItem}
            >
              <item.icon size={20} color={isDark ? '#E5E7EB' : '#374151'} />
              <Text className={`ml-3 ${textColor}`}>{item.label}</Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <View className={`py-4 px-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}>
        <Pressable 
          className="flex-row items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          style={styles.menuItem}
        >
          <LogOut size={20} color={isDark ? '#E5E7EB' : '#374151'} />
          <Text className={`ml-3 ${textColor}`}>Sair</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    width: 256, // 64 * 4 = 256px (equivalente a w-64)
    height: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  }
}); 