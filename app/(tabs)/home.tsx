import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Header } from '../../components/AicrusComponents/header';
import { Sidebar } from '../../components/Sidebar';
import { Portal } from '@gorhom/portal';
import { useResponsive } from '../../hooks/useResponsive';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Exemplo de opção para controlar a exibição do Header
  // Isto deixa explícito que o Header é opcional e a pessoa que desenvolve pode escolher
  // mostrar ou não o Header em cada tela
  const showHeader = true;
  
  // Classe de fundo baseada no tema
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const textColor = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';

  // Função para abrir/fechar o sidebar móvel
  const toggleSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  const sidebarWidth = 256; // A largura do nosso sidebar, deve ser o mesmo valor usado no componente

  return (
    <>
      <View className={`flex-1 ${bgPrimary}`} style={styles.container}>
        {/* 
          Sidebar fixa para tablet/desktop
          Renderizada diretamente no layout (sem Portal)
        */}
        {!isMobile && (
          <Sidebar fixed withHeader={showHeader} />
        )}

        {/* Área principal de conteúdo que dá espaço para a sidebar fixa */}
        <View style={{ 
          flex: 1, 
          marginLeft: isMobile ? 0 : sidebarWidth
        }}>
          {/* 
            O Header é opcional e pode ser incluído ou não pelo desenvolvedor.
            Quando em tablet/desktop, informamos a largura da sidebar para que o Header se ajuste.
          */}
          {showHeader && (
            <Header 
              onToggleDrawer={isMobile ? toggleSidebar : undefined}
              sidebarWidth={!isMobile ? sidebarWidth : 0}
            />
          )}

          {/* Conteúdo principal da tela */}
          <View 
            className="flex-1 p-4" 
            style={{ 
              marginTop: showHeader ? 64 : 0
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
              Em tablets e desktops, o sidebar fica fixo ao lado, dando espaço para o conteúdo.
            </Text>
            
            <Text className={`mt-4 ${textColor}`}>
              O sidebar fixo se adapta ao layout da tela, respeitando o espaço do Header.
            </Text>

            <Text className={`mt-8 text-sm ${textColor}`}>
              Breakpoint atual: {isMobile ? "Mobile" : isTablet ? "Tablet" : "Desktop"}
            </Text>
          </View>
        </View>
      </View>

      {/* 
        Sidebar móvel renderizada via Portal.
        Só é renderizada quando estamos em dispositivos móveis e o sidebar é aberto.
      */}
      {isMobile && (
        <Portal>
          <Sidebar 
            isOpen={isMobileSidebarOpen} 
            onClose={() => setIsMobileSidebarOpen(false)} 
            withHeader={showHeader}
            fixed={false}
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