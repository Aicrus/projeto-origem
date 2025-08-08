import React, { useState, useRef } from 'react';
import { View, StyleSheet, Platform, ScrollView, Text, TouchableOpacity, useWindowDimensions } from 'react-native';
import { useTheme } from '../../hooks/DesignSystemContext';
import { Header } from '@/components/headers/Header';
import { Sidebar } from '@/components/navigation/Sidebar';
import { PageContainer } from '@/components/layout/PageContainer';
import { Portal } from '@gorhom/portal';
import { useResponsive } from '../../hooks/useResponsive';
import { Building2, Users, ClipboardList, AlertTriangle } from 'lucide-react-native';
import { breakpoints as BREAKPOINTS } from '../../design-system';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/accordions/Accordion';
import { getResponsiveValues } from '../../design-system/tokens/typography';

export default function Home() {
  const { currentTheme } = useTheme();
  const isDark = currentTheme === 'dark';
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { isMobile, isTablet, isDesktop, responsive } = useResponsive();
  const { width } = useWindowDimensions();
  
  const showHeader = true;
  const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
  const cardBg = isDark ? 'bg-bg-secondary-dark' : 'bg-bg-secondary-light';
  const sidebarWidth = isTablet ? 65 : 250;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
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

  const StatCard = ({ title, value, change, trend, subtitle, icon: Icon, height, className = '', style }: StatCardProps) => {
    // Tipografia padronizada via tokens responsivos
    const statTitleTypography = getResponsiveValues('body-lg');
    const statValueTypography = getResponsiveValues('headline-md');
    const statSubtitleTypography = getResponsiveValues('body-sm');
    const changeTextTypography = getResponsiveValues('body-md');

    const statTitleStyle = {
      fontSize: responsive(statTitleTypography.fontSize),
      lineHeight: responsive(statTitleTypography.lineHeight),
      fontFamily: statTitleTypography.fontFamily,
      fontWeight: statTitleTypography.fontWeight as any,
    } as const;

    const statValueStyle = {
      fontSize: responsive(statValueTypography.fontSize),
      lineHeight: responsive(statValueTypography.lineHeight),
      fontFamily: statValueTypography.fontFamily,
      fontWeight: statValueTypography.fontWeight as any,
      marginBottom: 4,
    } as const;

    const statSubtitleStyle = {
      fontSize: responsive(statSubtitleTypography.fontSize),
      lineHeight: responsive(statSubtitleTypography.lineHeight),
      fontFamily: statSubtitleTypography.fontFamily,
      fontWeight: statSubtitleTypography.fontWeight as any,
    } as const;

    const changeTextStyle = {
      fontSize: responsive(changeTextTypography.fontSize),
      lineHeight: responsive(changeTextTypography.lineHeight),
      fontFamily: changeTextTypography.fontFamily,
      fontWeight: changeTextTypography.fontWeight as any,
    } as const;

    return (
      <View className={`${cardBg} rounded-lg p-4 ${className}`} style={[style, height ? { height } : null]}>
        <View style={styles.statHeader}>
          <View style={styles.statTitleContainer}>
            <Text style={[statTitleStyle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
              {title}
            </Text>
          </View>
          <View style={[
            styles.changeTag,
            trend === 'up' ? styles.positiveChange : styles.negativeChange
          ]}>
            <Text style={[
              changeTextStyle,
              trend === 'up' ? styles.positiveText : styles.negativeText
            ]}>
              {change}
            </Text>
          </View>
        </View>

        <View style={styles.statContent}>
          <View>
            <Text style={[statValueStyle, { color: isDark ? '#F1F5F9' : '#1E293B' }]}>
              {value}
            </Text>
            <Text style={[statSubtitleStyle, { color: isDark ? '#94A3B8' : '#64748B' }]}>
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
  };

  const stats = [
    {
      id: 1,
      title: 'Receita Total',
      value: 85,
      change: '+12.5%',
      trend: 'up' as const,
      subtitle: 'R$ 85k',
      icon: Building2,
    },
    {
      id: 2,
      title: 'Vendas',
      value: 248,
      change: '+8.2%',
      trend: 'up' as const,
      subtitle: 'Este mês',
      icon: Users,
    },
    {
      id: 3,
      title: 'Clientes',
      value: 1.2,
      change: '+23.1%',
      trend: 'up' as const,
      subtitle: '1.2k ativos',
      icon: ClipboardList,
    },
    {
      id: 4,
      title: 'Conversão',
      value: 12,
      change: '-5.4%',
      trend: 'down' as const,
      subtitle: '12.5%',
      icon: AlertTriangle,
    },
  ];

  // Função para calcular o estilo flexbox baseado no layout responsivo
  const getTopCardsStyle = () => {
    return {
      flexDirection: 'row' as const,
      flexWrap: isMobile ? 'wrap' as const : 'nowrap' as const,
      gap: 16,
      marginBottom: 16,
    };
  };

  const getCardStyle = (cardIndex: number, isTopCard: boolean) => {
    if (isTopCard) {
      return {
        flex: 1,
        ...(isMobile ? { minWidth: '45%' } : {})
      };
    }
    return { flex: 1 };
  };

  const renderContent = () => {
    return (
      <View style={styles.contentContainer}>
        {/* Cards superiores - Layout Dashboard 4x2 */}
        <View style={getTopCardsStyle()}>
          {stats.map((stat, index) => (
            <StatCard
              key={stat.id}
              title={stat.title}
              value={stat.value}
              change={stat.change}
              trend={stat.trend}
              subtitle={stat.subtitle}
              icon={stat.icon}
              height={140}
              style={getCardStyle(index, true)}
            />
          ))}
        </View>

        {/* Cards inferiores - 2 cards responsivos */}
        <View style={{
          flexDirection: isMobile ? 'column' : 'row',
          gap: 16,
          flex: 1,
        }}>
          {/* Card inferior 1 - Placeholder */}
          <View 
            className={`${cardBg} rounded-lg p-4`} 
            style={{ flex: 1 }} 
          >
            {(() => {
              const chartTitleTypography = getResponsiveValues('title-md');
              const chartTitleStyle = {
                fontSize: responsive(chartTitleTypography.fontSize),
                lineHeight: responsive(chartTitleTypography.lineHeight),
                fontFamily: chartTitleTypography.fontFamily,
                fontWeight: chartTitleTypography.fontWeight as any,
              } as const;
              return (
                <Text style={[chartTitleStyle, { color: isDark ? '#F1F5F9' : '#1E293B', marginBottom: 16 }]}> 
                  Área de Conteúdo
                </Text>
              );
            })()}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {(() => {
                const chartSubtitleTypography = getResponsiveValues('body-sm');
                const chartSubtitleStyle = {
                  fontSize: responsive(chartSubtitleTypography.fontSize),
                  lineHeight: responsive(chartSubtitleTypography.lineHeight),
                  fontFamily: chartSubtitleTypography.fontFamily,
                  fontWeight: chartSubtitleTypography.fontWeight as any,
                } as const;
                return (
                  <Text style={[chartSubtitleStyle, { color: isDark ? '#94A3B8' : '#64748B', textAlign: 'center' }]}> 
                    Espaço disponível para conteúdo personalizado
                  </Text>
                );
              })()}
            </View>
          </View>
          
          {/* Card inferior 2 - Placeholder */}
          <View 
            className={`${cardBg} rounded-lg p-4`} 
            style={{ flex: 1 }} 
          >
            {(() => {
              const chartTitleTypography = getResponsiveValues('title-md');
              const chartTitleStyle = {
                fontSize: responsive(chartTitleTypography.fontSize),
                lineHeight: responsive(chartTitleTypography.lineHeight),
                fontFamily: chartTitleTypography.fontFamily,
                fontWeight: chartTitleTypography.fontWeight as any,
              } as const;
              return (
                <Text style={[chartTitleStyle, { color: isDark ? '#F1F5F9' : '#1E293B', marginBottom: 16 }]}> 
                  Área de Conteúdo
                </Text>
              );
            })()}
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              {(() => {
                const chartSubtitleTypography = getResponsiveValues('body-sm');
                const chartSubtitleStyle = {
                  fontSize: responsive(chartSubtitleTypography.fontSize),
                  lineHeight: responsive(chartSubtitleTypography.lineHeight),
                  fontFamily: chartSubtitleTypography.fontFamily,
                  fontWeight: chartSubtitleTypography.fontWeight as any,
                } as const;
                return (
                  <Text style={[chartSubtitleStyle, { color: isDark ? '#94A3B8' : '#64748B', textAlign: 'center' }]}> 
                    Espaço disponível para conteúdo personalizado
                  </Text>
                );
              })()}
            </View>
          </View>
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
  bottomSection: {
    flex: 1,
    minHeight: Platform.select({ web: 500, default: 400 }),
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
    // tipografia aplicada via tokens em runtime
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
    marginBottom: 4,
  },
  statSubtitle: {
    // tipografia aplicada via tokens em runtime
  },
  statIcon: {
    opacity: 0.8,
  },
  chartTitle: {
    marginBottom: 4,
  },
  chartSubtitle: {
    // tipografia aplicada via tokens em runtime
  },
}); 