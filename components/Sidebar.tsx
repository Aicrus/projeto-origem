import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView, Platform, Dimensions, StatusBar } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';
import { Home, Settings, User, HelpCircle, FileText, LogOut } from 'lucide-react-native';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  withHeader?: boolean;
}

// Z-index absurdamente alto para garantir que esteja acima de tudo
// Mesmo em bibliotecas de terceiros que possam usar valores altos
const EXTREME_Z_INDEX = {
  BACKDROP: 9999990,
  SIDEBAR: 9999999
};

export function Sidebar({ isOpen, onClose, withHeader = true }: SidebarProps) {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const windowDimensions = Dimensions.get('window');
  const statusBarHeight = StatusBar.currentHeight || 0;

  // Classes e cores baseadas no tema
  const bgColor = isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light';
  const textColor = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';
  const borderColor = isDark ? 'border-divider-dark' : 'border-divider-light';
  const itemHoverBg = isDark ? 'bg-bg-hover-dark' : 'bg-bg-hover-light';

  // Posição da sidebar
  const sidebarPosition = isOpen ? 'left-0' : '-left-64';

  // Lista de itens do menu
  const menuItems = [
    { icon: Home, label: 'Início', route: '/home' },
    { icon: User, label: 'Perfil', route: '/profile' },
    { icon: FileText, label: 'Documentos', route: '/documents' },
    { icon: Settings, label: 'Configurações', route: '/settings' },
    { icon: HelpCircle, label: 'Ajuda', route: '/help' },
  ];

  if (!isOpen) return null;

  // Usar a altura e largura totais da tela para cobrir inclusive a TabBar
  const screenHeight = Dimensions.get('screen').height;
  const screenWidth = Dimensions.get('screen').width;

  return (
    <>
      {/* Backdrop para fechar o menu ao clicar fora */}
      <View 
        style={[
          StyleSheet.absoluteFillObject, // Preenche absolutamente todo o espaço disponível
          { 
            zIndex: EXTREME_Z_INDEX.BACKDROP,
            elevation: 1000,
            backgroundColor: 'rgba(0,0,0,0.5)',
            width: screenWidth,
            height: screenHeight,
            position: 'absolute',
            top: 0,
            left: 0,
          }
        ]}
      >
        <Pressable 
          style={StyleSheet.absoluteFillObject}
          onPress={onClose}
        />
      </View>

      {/* Sidebar */}
      <View 
        className={`${Platform.OS === 'web' ? `absolute top-0 ${sidebarPosition} h-screen w-64 ${bgColor} shadow-lg transition-all border-r ${borderColor} z-[9999999]` : ''}`}
        style={[
          styles.sidebar,
          Platform.OS !== 'web' ? {
            backgroundColor: isDark ? '#1e293b' : '#ffffff', // equivalente ao bg-secondary-dark/light
            borderRightColor: isDark ? '#262D34' : '#E0E3E7', // equivalente ao divider-dark/light
            borderRightWidth: 1,
            width: 256, // equivalente a w-64
            position: 'absolute',
            top: 0,
            left: isOpen ? 0 : -256,
            height: screenHeight,
            zIndex: EXTREME_Z_INDEX.SIDEBAR,
            elevation: 1001, // Maior que o backdrop
          } : null
        ]}
      >
        <View className={`py-6 px-4 border-b ${isDark ? 'border-gray-700' : 'border-gray-200'}`} 
          style={Platform.OS !== 'web' ? {
            paddingVertical: 24,
            paddingHorizontal: 16,
            borderBottomWidth: 1,
            borderBottomColor: isDark ? '#374151' : '#e5e7eb',
          } : null}
        >
          <Text 
            className={`text-xl font-bold ${textColor}`}
            style={Platform.OS !== 'web' ? {
              fontSize: 20,
              fontWeight: 'bold',
              color: isDark ? '#f3f4f6' : '#1f2937'
            } : null}
          >
            Menu
          </Text>
        </View>

        <ScrollView className="flex-1" style={styles.scrollView}>
          <View className="py-2" style={Platform.OS !== 'web' ? { paddingVertical: 8 } : null}>
            {menuItems.map((item, index) => (
              <Pressable 
                key={index}
                className={`flex-row items-center px-4 py-3 mx-2 my-1 rounded-md hover:${itemHoverBg}`}
                style={[
                  styles.menuItem,
                  Platform.OS !== 'web' ? { 
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingHorizontal: 16,
                    paddingVertical: 12,
                    marginHorizontal: 8,
                    marginVertical: 4,
                    borderRadius: 6,
                  } : null
                ]}
              >
                <item.icon size={20} color={isDark ? '#E5E7EB' : '#374151'} />
                <Text 
                  className={`ml-3 ${textColor}`}
                  style={Platform.OS !== 'web' ? { 
                    marginLeft: 12,
                    color: isDark ? '#f3f4f6' : '#1f2937'
                  } : null}
                >
                  {item.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </ScrollView>

        <View 
          className={`py-4 px-4 border-t ${isDark ? 'border-gray-700' : 'border-gray-200'}`}
          style={Platform.OS !== 'web' ? {
            paddingVertical: 16,
            paddingHorizontal: 16,
            borderTopWidth: 1,
            borderTopColor: isDark ? '#374151' : '#e5e7eb'
          } : null}
        >
          <Pressable 
            className="flex-row items-center px-4 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
            style={[
              styles.menuItem,
              Platform.OS !== 'web' ? {
                flexDirection: 'row',
                alignItems: 'center',
                paddingHorizontal: 16,
                paddingVertical: 12,
                borderRadius: 6,
              } : null
            ]}
          >
            <LogOut size={20} color={isDark ? '#E5E7EB' : '#374151'} />
            <Text 
              className={`ml-3 ${textColor}`}
              style={Platform.OS !== 'web' ? {
                marginLeft: 12,
                color: isDark ? '#f3f4f6' : '#1f2937'
              } : null}
            >
              Sair
            </Text>
          </Pressable>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  sidebar: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  scrollView: {
    flex: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
  }
}); 