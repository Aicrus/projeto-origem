import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Header } from '../../components/AicrusComponents/header';
import { Sidebar } from '../../components/AicrusComponents/sidebar';
import { Portal } from '@gorhom/portal';
import { useResponsive } from '../../hooks/useResponsive';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  
  // Exemplo de opção para controlar a exibição do Header
  const showHeader = true;
  
  // Classe de fundo baseada no tema
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const textColor = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';

  // Função para abrir/fechar o sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Renderização do conteúdo principal - reutilizado em ambos os layouts
  const renderContent = () => (
    <View style={styles.contentContainer}>
      <Text className={`text-lg font-bold ${textColor}`}>
        Tela Home
      </Text>
      
      <Text className={`mt-4 ${textColor}`}>
        Esta é uma tela de exemplo que mostra como o componente Header é opcional. Cada tela pode decidir se quer incluir o Header ou não.
      </Text>
      
      <Text className={`mt-4 ${textColor}`}>
        {isMobile 
          ? "Em dispositivos móveis, o sidebar aparece sobreposto quando o botão de menu é clicado." 
          : "Em tablets e desktops, o sidebar fica fixo ao lado, dando espaço para o conteúdo."
        }
      </Text>
      
      <Text className={`mt-4 ${textColor}`}>
        {isMobile
          ? "A sidebar móvel fecha automaticamente quando a tela aumenta de tamanho."
          : "O sidebar fixo se adapta ao layout da tela, respeitando o espaço do Header."
        }
      </Text>

      <Text className={`mt-8 text-sm ${textColor}`}>
        Breakpoint atual: {isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}
      </Text>
    </View>
  );

  // Layout para dispositivos móveis
  if (isMobile) {
    return (
      <View className={`flex-1 ${bgPrimary}`} style={styles.container}>
        {showHeader && (
          <Header onToggleDrawer={toggleSidebar} />
        )}
        
        <View style={{ 
          flex: 1, 
          marginTop: showHeader ? 64 : 0 
        }}>
          {renderContent()}
        </View>
        
        <Portal>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            withHeader={showHeader}
          />
        </Portal>
      </View>
    );
  }
  
  // Layout para tablets e desktops com Sidebar fixa
  return (
    <View className={`flex-1 ${bgPrimary}`} style={styles.containerDesktop}>
      {/* Layout flexbox horizontal */}
      <View style={styles.horizontalLayout}>
        {/* Sidebar fixa à esquerda */}
        <View style={styles.sidebarColumn}>
          <Sidebar withHeader={showHeader} />
        </View>
        
        {/* Coluna principal à direita */}
        <View style={styles.mainColumn}>
          {/* Header no topo */}
          {showHeader && <Header />}
          
          {/* Conteúdo principal abaixo do Header */}
          {renderContent()}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDesktop: {
    flex: 1,
  },
  horizontalLayout: {
    flex: 1,
    flexDirection: 'row',
    width: '100%',
  },
  sidebarColumn: {
    width: 260,
    height: '100%',
    zIndex: 10,
  },
  mainColumn: {
    flex: 1,
    flexDirection: 'column',
    minWidth: 0,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  }
}); 