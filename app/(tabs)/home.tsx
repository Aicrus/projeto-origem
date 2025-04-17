import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Header } from '../../components/AicrusComponents/header';
import { Sidebar } from '../../components/Sidebar';
import { DesktopSidebar } from '../../components/DesktopSidebar';
import { Portal } from '@gorhom/portal';
import { useResponsive } from '../../hooks/useResponsive';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Layout para tablets e desktop terá um sidebar fixo
  const hasFixedSidebar = !isMobile;
  
  // Exemplo de opção para controlar a exibição do Header
  // Isto deixa explícito que o Header é opcional e a pessoa que desenvolve pode escolher
  // mostrar ou não o Header em cada tela
  const showHeader = true;
  
  // Classe de fundo baseada no tema
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const textColor = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';

  // Função para abrir/fechar o sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <>
      <View className={`flex-1 ${bgPrimary}`} style={styles.container}>
        {/* 
          O Header é opcional e pode ser incluído ou não pelo desenvolvedor,
          dependendo da sua necessidade. Cada tela é independente e pode
          decidir se quer usar o Header ou não.
          
          Quando incluído, passamos onToggleDrawer para controlar nossa sidebar
        */}
        {showHeader && (
          <Header 
            onToggleDrawer={isMobile ? toggleSidebar : undefined} 
          />
        )}

        <View style={{ flex: 1, flexDirection: 'row' }}>
          {/* Sidebar fixo para tablet/desktop */}
          {hasFixedSidebar && (
            <DesktopSidebar withHeader={showHeader} />
          )}

          {/* Conteúdo principal da tela */}
          <View 
            className="flex-1 p-4" 
            style={{ 
              marginTop: showHeader ? 64 : 0,
              paddingTop: 16
            }}
          >
            <Text className={`text-lg font-bold ${textColor}`}>
              Tela Home
            </Text>
            
            <Text className={`mt-4 ${textColor}`}>
              Esta é uma tela de exemplo que mostra como o componente Header é opcional.
              Cada tela pode decidir se quer incluir o Header ou não.
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
        </View>
      </View>

      {/* 
        Sidebar móvel renderizado via Portal, fora da hierarquia normal.
        Só é usado em dispositivos móveis.
      */}
      {isMobile && (
        <Portal>
          <Sidebar 
            isOpen={isSidebarOpen} 
            onClose={() => setIsSidebarOpen(false)} 
            withHeader={showHeader}
          />
        </Portal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
}); 