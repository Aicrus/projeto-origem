import React, { useState, useRef } from 'react';
import { View, StyleSheet, Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { Header } from '../../components/AicrusComponents/header';
import { Sidebar } from '../../components/AicrusComponents/sidebar';
import { PageContainer } from '../../components/AicrusComponents/page-container';
import { Portal } from '@gorhom/portal';
import { useResponsive } from '../../hooks/useResponsive';
import { Building2, Users, ClipboardList, AlertTriangle, MoreVertical, Edit, Trash2, Share, Eye, Copy, FileText } from 'lucide-react-native';
import { BREAKPOINTS } from '../../constants/responsive';
import { DropdownMenu, useDropdownMenu } from '../../components/dropdown-menu';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile, isTablet, isDesktop } = useResponsive();
  const { width } = useWindowDimensions();
  
  // Usar o hook para gerenciar o menu
  const menuButtonRef = useRef(null);
  const { isOpen: isMenuOpen, open: openMenu, close: closeMenu } = useDropdownMenu(menuButtonRef);
  
  const showHeader = true;
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const cardBg = isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light';
  const sidebarWidth = isTablet ? 65 : 250;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  // Opções do menu
  const menuOptions = [
    { 
      value: 'view', 
      label: 'Visualizar detalhes', 
      icon: <Eye size={16} color={isDark ? '#D1D5DB' : '#57636C'} />,
      onPress: () => {
        console.log('Visualizar detalhes');
        closeMenu();
      }
    },
    { 
      value: 'edit', 
      label: 'Editar', 
      icon: <Edit size={16} color={isDark ? '#D1D5DB' : '#57636C'} />,
      onPress: () => {
        console.log('Editar');
        closeMenu();
      }
    },
    { 
      value: 'duplicate', 
      label: 'Duplicar', 
      icon: <Copy size={16} color={isDark ? '#D1D5DB' : '#57636C'} />,
      onPress: () => {
        console.log('Duplicar');
        closeMenu();
      }
    },
    { 
      value: 'share', 
      label: 'Compartilhar', 
      icon: <Share size={16} color={isDark ? '#D1D5DB' : '#57636C'} />,
      onPress: () => {
        console.log('Compartilhar');
        closeMenu();
      }
    },
    { 
      value: 'export', 
      label: 'Exportar relatório', 
      icon: <FileText size={16} color={isDark ? '#D1D5DB' : '#57636C'} />,
      onPress: () => {
        console.log('Exportar relatório');
        closeMenu();
      }
    },
    { 
      value: 'delete', 
      label: 'Excluir', 
      icon: <Trash2 size={16} color="#EF4444" />,
      onPress: () => {
        console.log('Excluir');
        closeMenu();
      }
    },
  ];

  interface StatCardProps {
    title: string;
    value: number;
    change: string;
    trend: 'up' | 'down';
    subtitle: string;
    icon: any;
    height?: number;
    className?: string;
    style?: any;
  }

  const StatCard = ({ title, value, change, trend, subtitle, icon: Icon, height, className = '', style }: StatCardProps) => (
    <View className={`${cardBg} rounded-lg p-4 ${className}`} style={[style, height ? { height } : null]}>
      <View style={styles.statHeader}>
        <View style={styles.statTitleContainer}>
          <Text style={[styles.statTitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {title}
          </Text>
        </View>
        <View style={[
          styles.changeTag,
          trend === 'up' ? styles.positiveChange : styles.negativeChange
        ]}>
          <Text style={[
            styles.changeText,
            trend === 'up' ? styles.positiveText : styles.negativeText
          ]}>
            {change}
          </Text>
        </View>
      </View>

      <View style={styles.statContent}>
        <View>
          <Text style={[styles.statValue, { color: isDark ? '#F1F5F9' : '#1E293B' }]}>
            {value}
          </Text>
          <Text style={[styles.statSubtitle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
            {subtitle}
          </Text>
        </View>
        <Icon 
          size={24} 
          color={isDark ? '#64748B' : '#94A3B8'} 
          strokeWidth={1.5} 
          style={styles.statIcon} 
        />
      </View>
    </View>
  );

  const stats = [
    {
      id: 1,
      title: 'Imobiliárias Ativas',
      value: 152,
      change: '+12.5%',
      trend: 'up' as const,
      subtitle: '+8 novas',
      icon: Building2,
    },
    {
      id: 2,
      title: 'Vistoriadores Ativos',
      value: 48,
      change: '+8.2%',
      trend: 'up' as const,
      subtitle: '+3 novos',
      icon: Users,
    },
    {
      id: 3,
      title: 'Vistorias Agendadas',
      value: 89,
      change: '+23.1%',
      trend: 'up' as const,
      subtitle: 'Hoje: 12',
      icon: ClipboardList,
    },
    {
      id: 4,
      title: 'Vistorias Atrasadas',
      value: 12,
      change: '-5.4%',
      trend: 'down' as const,
      subtitle: 'Crítico',
      icon: AlertTriangle,
    },
  ];

  const renderContent = () => {
    // Layout adaptativo:
    // - mobile/tablet: 2x2 (grid-cols-2)
    // - desktop: 4 em linha (grid-cols-4)
    const topCardsLayout = isMobile || isTablet ? 'grid-cols-2' : 'grid-cols-4';
    
    // Layout adaptativo para cards inferiores:
    // - mobile: coluna (flex-col)
    // - tablet/desktop: 2 colunas (grid-cols-2)
    const bottomCardsLayout = isMobile ? 'flex-col' : 'grid-cols-2';
    
    return (
      <View style={styles.contentContainer}>
        {/* Botão do menu e dropdown */}
        <View style={styles.menuButtonContainer}>
          <TouchableOpacity
            ref={menuButtonRef}
            onPress={openMenu}
            style={[
              styles.menuButton,
              { backgroundColor: isDark ? '#1F2937' : '#F3F4F6' }
            ]}
            activeOpacity={0.7}
          >
            <Text style={{ 
              color: isDark ? '#D1D5DB' : '#4B5563',
              marginRight: 8
            }}>
              Ações
            </Text>
            <MoreVertical size={18} color={isDark ? '#D1D5DB' : '#4B5563'} />
          </TouchableOpacity>
          
          <DropdownMenu
            options={menuOptions}
            isOpen={isMenuOpen}
            onClose={closeMenu}
            triggerRef={menuButtonRef}
            searchable={true}
            maxHeight={300}
          />
        </View>
        
        {/* Cards superiores - agora vazios */}
        <View className={`gap-5 mb-5 grid ${topCardsLayout}`} style={styles.topSection}>
          {stats.map((stat) => (
            // Renderiza apenas o container do StatCard vazio
            <View key={stat.id} className={`${cardBg} rounded-lg p-4`} style={{ height: 140 }} />
          ))}
        </View>

        {/* Cards inferiores - agora vazios */}
        <View className={`gap-5 ${isMobile ? 'flex' : 'grid'} ${bottomCardsLayout}`} style={styles.bottomSection}>
          {/* Card inferior 1 - vazio */}
          <View className={`${cardBg} rounded-lg p-4 flex-1`} style={styles.bottomCard} />
          {/* Card inferior 2 - vazio */}
          <View className={`${cardBg} rounded-lg p-4 flex-1`} style={styles.bottomCard} />
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
    display: 'flex',
    flexDirection: 'column',
  },
  menuButtonContainer: {
    marginBottom: 16,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    alignSelf: 'flex-start',
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
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statTitleContainer: {
    flex: 1,
    marginRight: 8,
  },
  statTitle: {
    fontSize: 16,
  },
  changeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 12,
  },
  positiveChange: {
    backgroundColor: '#dcfce7',
  },
  negativeChange: {
    backgroundColor: '#fee2e2',
  },
  changeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  positiveText: {
    color: '#16a34a',
  },
  negativeText: {
    color: '#dc2626',
  },
  statContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statSubtitle: {
    fontSize: 14,
  },
  statIcon: {
    opacity: 0.8,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  chartSubtitle: {
    fontSize: 14,
  },
}); 