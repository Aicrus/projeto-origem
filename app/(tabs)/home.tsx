import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Header } from '../../components/AicrusComponents/header';
import { Sidebar } from '../../components/AicrusComponents/sidebar';
import { PageContainer } from '../../components/AicrusComponents/page-container';
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

  // Largura da sidebar
  const sidebarWidth = isTablet ? 65 : 250;

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
        
        <PageContainer withHeader={showHeader}>
          {renderContent()}
        </PageContainer>
        
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
      {/* Sidebar fixa à esquerda */}
      <View style={[styles.sidebarColumn, { width: sidebarWidth }]}>
        <Sidebar withHeader={showHeader} />
      </View>

      {/* Área de conteúdo */}
      <View style={[styles.mainArea, { marginLeft: sidebarWidth }]}>
        {/* Header no topo */}
        {showHeader && <Header sidebarWidth={sidebarWidth} />}
        
        {/* PageContainer para gerenciar o layout do conteúdo */}
        <PageContainer 
          withHeader={showHeader}
          withSidebar={false} 
          // Não precisamos passar sidebarWidth aqui pois já aplicamos marginLeft acima
        >
          {renderContent()}
        </PageContainer>
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
    flexDirection: 'row',
    position: 'relative',
  },
  sidebarColumn: {
    height: '100%',
    position: 'fixed',
    left: 0,
    top: 0,
    zIndex: 10,
  },
  mainArea: {
    flex: 1,
    width: '100%',
  },
  contentContainer: {
    flex: 1,
  }
}); 