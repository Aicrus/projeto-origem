import React, { useState } from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';
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
    // Define o layout baseado no tamanho da tela
    const topCardsLayout = isMobile ? 'flex-col' : isTablet ? 'grid-cols-2' : 'grid-cols-4';
    const bottomCardsLayout = isMobile ? 'flex-col' : 'grid-cols-2';
    
    return (
      <View style={styles.contentContainer}>
        {/* Cards superiores - altura fixa */}
        <View className={`gap-4 mb-4 ${isMobile ? 'flex' : 'grid'} ${topCardsLayout}`} style={styles.topSection}>
          <EmptyCard height={140} />
          <EmptyCard height={140} />
          <EmptyCard height={140} />
          <EmptyCard height={140} />
        </View>

        {/* Cards inferiores - ocupando espaço restante */}
        <View className={`gap-4 ${isMobile ? 'flex' : 'grid'} ${bottomCardsLayout}`} style={styles.bottomSection}>
          <EmptyCard className="flex-1" style={styles.bottomCard} />
          <EmptyCard className="flex-1" style={styles.bottomCard} />
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
      <View style={[styles.sidebarColumn, { width: sidebarWidth }]}>
        <Sidebar withHeader={showHeader} />
      </View>

      <View style={[styles.mainArea, { marginLeft: sidebarWidth }]}>
        {showHeader && <Header sidebarWidth={sidebarWidth} />}
        
        <ScrollView 
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <PageContainer 
            withHeader={showHeader}
            withSidebar={false}
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
    width: '100%',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    ...(Platform.OS !== 'web' && {
      paddingBottom: 100, // Padding extra para nativo, permitindo rolar acima da tab
    }),
  },
  contentContainer: {
    flex: 1,
    minHeight: '100%',
    display: 'flex',
    flexDirection: 'column',
  },
  topSection: {
    flexShrink: 0,
  },
  bottomSection: {
    flex: 1,
    minHeight: Platform.select({ web: 500, default: 400 }),
    height: '100%',
  },
  bottomCard: {
    height: '100%',
  }
}); 