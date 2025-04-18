import React, { useState } from 'react';
import { View, StyleSheet, Platform, ScrollView, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Header } from '../../components/AicrusComponents/header';
import { Sidebar } from '../../components/AicrusComponents/sidebar';
import { PageContainer } from '../../components/AicrusComponents/page-container';
import { Portal } from '@gorhom/portal';
import { useResponsive } from '../../hooks/useResponsive';
import { BREAKPOINTS } from '../../constants/responsive';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile, isTablet, isDesktop, width, responsive } = useResponsive();
  
  const showHeader = true;
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const cardBg = isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light';
  const sidebarWidth = isTablet ? 65 : 250;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  interface EmptyCardProps {
    height?: number;
    className?: string;
    style?: any;
  }

  const EmptyCard = ({ height, className = '', style }: EmptyCardProps) => (
    <View className={`${cardBg} rounded-lg ${className}`} style={[style, height ? { height } : null]} />
  );

  const renderContent = () => {
    // Definição dinâmica do layout baseado no tamanho exato da tela
    const getGridColumns = () => {
      if (width < BREAKPOINTS.SMALL_MOBILE) return 1; // Dispositivos muito pequenos
      if (width < BREAKPOINTS.TABLET) return 1; // Mobile
      if (width < BREAKPOINTS.DESKTOP) return 2; // Tablet
      if (width < BREAKPOINTS.LARGE_DESKTOP) return 3; // Desktop
      return 4; // Telas grandes
    };

    // Ajustes dinâmicos baseados no tipo de dispositivo atual
    const gridColumns = getGridColumns();
    
    // Espaçamento dinâmico entre cards
    const cardGap = responsive({
      mobile: 12,
      tablet: 16,
      desktop: 24,
      default: 16
    });
    
    // Altura dinâmica dos cards superiores
    const topCardHeight = responsive({
      mobile: 120,
      tablet: 140,
      desktop: 140,
      default: 140
    });
    
    // Altura mínima para os cards inferiores
    const bottomCardMinHeight = responsive({
      mobile: 350,
      tablet: 400,
      desktop: 500,
      default: 400
    });

    // Definição do estilo de layout para os cards superiores
    const topCardsContainerStyle: ViewStyle = {
      flexDirection: gridColumns === 1 ? 'column' : 'row',
      flexWrap: 'wrap',
      marginBottom: cardGap * 1.5
    };

    // Cálculo da largura dos cards superiores e margens
    const topCardStyle: any = {
      width: gridColumns === 1 
        ? '100%' 
        : `calc(${100 / Math.min(gridColumns, 4)}% - ${(cardGap * (Math.min(gridColumns, 4) - 1)) / Math.min(gridColumns, 4)}px)`,
      marginBottom: cardGap,
      ...(gridColumns > 1 && {
        marginRight: cardGap
      })
    };

    // Ajuste para remover margem do último card em cada linha quando em layout de múltiplas colunas
    const topCardLastInRowStyle: any = {
      ...topCardStyle,
      ...(gridColumns > 1 && {
        marginRight: 0
      })
    };

    // Definição do estilo de layout para os cards inferiores
    const bottomCardsContainerStyle: ViewStyle = {
      flexDirection: gridColumns === 1 ? 'column' : 'row',
      flex: 1,
      minHeight: bottomCardMinHeight
    };

    // Cálculo da largura dos cards inferiores
    const bottomCardLeftStyle: any = {
      width: gridColumns === 1 ? '100%' : `calc(50% - ${cardGap / 2}px)`,
      minHeight: gridColumns === 1 ? bottomCardMinHeight : '100%',
      ...(gridColumns > 1 && {
        marginRight: cardGap / 2
      }),
      ...(gridColumns === 1 && {
        marginBottom: cardGap
      })
    };

    const bottomCardRightStyle: any = {
      width: gridColumns === 1 ? '100%' : `calc(50% - ${cardGap / 2}px)`,
      minHeight: gridColumns === 1 ? bottomCardMinHeight : '100%',
      ...(gridColumns > 1 && {
        marginLeft: cardGap / 2
      })
    };
    
    return (
      <View style={styles.contentContainer}>
        {/* Cards superiores com layout responsivo */}
        <View style={topCardsContainerStyle}>
          <EmptyCard height={topCardHeight} style={topCardStyle} />
          <EmptyCard height={topCardHeight} style={gridColumns === 4 ? topCardStyle : gridColumns === 3 ? topCardLastInRowStyle : topCardStyle} />
          <EmptyCard height={topCardHeight} style={gridColumns === 2 ? topCardLastInRowStyle : topCardStyle} />
          <EmptyCard height={topCardHeight} style={topCardLastInRowStyle} />
        </View>

        {/* Cards inferiores com layout responsivo */}
        <View style={bottomCardsContainerStyle}>
          <EmptyCard style={[styles.bottomCard, bottomCardLeftStyle]} />
          <EmptyCard style={[styles.bottomCard, bottomCardRightStyle]} />
        </View>
      </View>
    );
  };

  if (isMobile) {
    return (
      <View className={`flex-1 ${bgPrimary}`} style={styles.container}>
        {showHeader && (
          <Header onToggleDrawer={toggleSidebar} />
        )}
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <PageContainer withHeader={showHeader}>
            {renderContent()}
          </PageContainer>
        </ScrollView>
        
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
  
  return (
    <View className={`flex-1 ${bgPrimary}`} style={styles.containerDesktop}>
      {/* Sidebar mantida */}
      <View style={[styles.sidebarColumn, { width: sidebarWidth }]}>
        <Sidebar withHeader={showHeader} />
      </View>

      {/* mainArea sem marginLeft */}
      <View style={styles.mainArea}>
        {/* Header ocupa largura total (sem offset da sidebar aqui) */}
        {showHeader && <Header sidebarWidth={0} />}
        
        {/* Restaurando ScrollView com paddingLeft para compensar a Sidebar */}
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={{
            ...styles.scrollContent,
            paddingLeft: sidebarWidth // Adicionado padding aqui
          }}
          showsVerticalScrollIndicator={false}
        >
          <PageContainer 
            withHeader={showHeader}
            withSidebar={false} // Sidebar está fora, PageContainer não precisa saber
          >
            {renderContent()}
          </PageContainer>
        </ScrollView>
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
    // marginLeft removido permanentemente
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    // paddingLeft será adicionado dinamicamente acima
    ...(Platform.OS !== 'web' && {
      paddingBottom: 100, 
    }),
  },
  contentContainer: {
    flex: 1,
    minHeight: '100%',
    flexDirection: 'column',
  },
  bottomCard: {
    height: '100%',
  }
}); 