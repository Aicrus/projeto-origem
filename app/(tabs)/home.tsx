import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Header } from '../../components/AicrusComponents/header';
import { Sidebar } from '../../components/Sidebar';
import { Portal } from '@gorhom/portal';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
        {showHeader && <Header onToggleDrawer={toggleSidebar} />}

        {/* Conteúdo principal da tela */}
        <View className={`flex-1 p-4 ${showHeader ? 'mt-16' : ''}`}>
          <Text className={`text-lg font-bold ${textColor}`}>
            Tela Home
          </Text>
          
          <Text className={`mt-4 ${textColor}`}>
            Esta é uma tela de exemplo que mostra como o componente Header é opcional.
            Cada tela pode decidir se quer incluir o Header ou não.
          </Text>
          
          <Text className={`mt-4 ${textColor}`}>
            O sidebar agora é exibido por cima de toda a interface, incluindo
            a TabBar inferior, quando o botão de hambúrguer é clicado.
          </Text>
          
          <Text className={`mt-4 ${textColor}`}>
            O botão de hambúrguer no Header controla a abertura da sidebar.
          </Text>
        </View>
      </View>

      {/* 
        Usando Portal para garantir que o sidebar seja renderizado 
        fora da hierarquia normal dos componentes, ficando
        absolutamente por cima de tudo, incluindo a TabBar.
      */}
      <Portal>
        <Sidebar 
          isOpen={isSidebarOpen} 
          onClose={() => setIsSidebarOpen(false)} 
          withHeader={showHeader}
        />
      </Portal>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
}); 