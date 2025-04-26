/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}", "./contexts/**/*.{js,jsx,ts,tsx}", "./hooks/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        /**
         * SISTEMA DE CORES
         * ------------------------------
         * Cores primárias, secundárias e terciárias para os temas claro e escuro.
         * Cada cor possui variantes para estados: normal, hover e active.
         */
        
        // ===== TEMA CLARO =====
        // Cores primárias - Tema Claro
        'primary-light': '#892CDC',
        'primary-light-hover': '#3D5C8C',
        'primary-light-active': '#345078',
        
        // Cores secundárias - Tema Claro
        'secondary-light': '#22D',
        'secondary-light-hover': '#06B6',
        'secondary-light-active': '#0891',
        
        // Cores terciárias - Tema Claro
        'tertiary-light': '#D3545D',
        'tertiary-light-hover': '#C1414A',
        'tertiary-light-active': '#AB343C',
        
        // Cores alternativas - Tema Claro
        'alternate-light': '#E0E3E7',
        
        // Cores de texto - Tema Claro
        'text-primary-light': '#14181B',
        'text-secondary-light': '#57636C',
        'text-tertiary-light': '#8B97A2',
        
        // Cores de fundo - Tema Claro
        'bg-primary-light': '#F7F8FA',
        'bg-secondary-light': '#FFFFFF',
        'bg-tertiary-light': '#F1F4F8',
        
        // Elementos de UI - Tema Claro
        'icon-light': '#57636C',
        'divider-light': '#E0E3E7',
        'hover-light': '#00000008',
        'active-light': '#00000012',
        
        // ===== TEMA ESCURO =====
        // Cores primárias - Tema Escuro
        'primary-dark': '#C13636',
        'primary-dark-hover': '#5B80B6', 
        'primary-dark-active': '#6C91C7',
        
        // Cores secundárias - Tema Escuro
        'secondary-dark': '#2C3E',
        'secondary-dark-hover': '#3D4F61',
        'secondary-dark-active': '#4E6072',
        
        // Cores terciárias - Tema Escuro
        'tertiary-dark': '#D3545D',
        'tertiary-dark-hover': '#E4656E',
        'tertiary-dark-active': '#F5767F',
        
        // Cores alternativas - Tema Escuro
        'alternate-dark': '#262D34',
        
        // Cores de texto - Tema Escuro
        'text-primary-dark': '#FFFFFF',
        'text-secondary-dark': '#95A1AC',
        'text-tertiary-dark': '#6B7280',
        
        // Cores de fundo - Tema Escuro
        'bg-primary-dark': '#1C1E26',
        'bg-secondary-dark': '#14181B',
        'bg-tertiary-dark': '#262D34',
        
        // Elementos de UI - Tema Escuro
        'icon-dark': '#95A1AC',
        'divider-dark': '#262D34',
        'hover-dark': '#FFFFFF08',
        'active-dark': '#FFFFFF12',
        
        /**
         * CORES DE FEEDBACK
         * ------------------------------
         * Cores para estados de feedback: sucesso, alerta, erro e informação
         * Cada tipo tem variantes para background, texto, borda e ícone
         */
        
        // ===== FEEDBACK - TEMA CLARO =====
        // Sucesso - Tema Claro
        'success-bg-light': '#E7F7EE',
        'success-text-light': '#1B4332',
        'success-border-light': '#2D6A4F',
        'success-icon-light': '#059669',
        
        // Alerta - Tema Claro
        'warning-bg-light': '#FEF3C7',
        'warning-text-light': '#92400E',
        'warning-border-light': '#D97706',
        'warning-icon-light': '#F59E0B',
        
        // Erro - Tema Claro
        'error-bg-light': '#FEE2E2',
        'error-text-light': '#991B1B',
        'error-border-light': '#DC2626',
        'error-icon-light': '#EF4444',
        
        // Informação - Tema Claro
        'info-bg-light': '#E0F2FE',
        'info-text-light': '#075985',
        'info-border-light': '#0284C7',
        'info-icon-light': '#0EA5E9',
        
        // ===== FEEDBACK - TEMA ESCURO =====
        // Sucesso - Tema Escuro
        'success-bg-dark': '#064E3B',
        'success-text-dark': '#ECFDF5',
        'success-border-dark': '#059669',
        'success-icon-dark': '#10B981',
        
        // Alerta - Tema Escuro
        'warning-bg-dark': '#451A03',
        'warning-text-dark': '#FEF3C7',
        'warning-border-dark': '#D97706',
        'warning-icon-dark': '#FBBF24',
        
        // Erro - Tema Escuro
        'error-bg-dark': '#450A0A',
        'error-text-dark': '#FEE2E2',
        'error-border-dark': '#DC2626',
        'error-icon-dark': '#F87171',
        
        // Informação - Tema Escuro
        'info-bg-dark': '#082F49',
        'info-text-dark': '#E0F2FE',
        'info-border-dark': '#0284C7',
        'info-icon-dark': '#38BDF8',

        /**
         * CORES DE GRADIENTE
         * ------------------------------
         * Cores base para sobreposições de gradiente
         */
        'gradient-primary-start': '#4A6FA5',
        'gradient-primary-end': '#22D3EE',
        'gradient-secondary-start': '#4A6FA5',
        'gradient-secondary-end': '#D3545D',
        'gradient-tertiary-start': '#22D3EE',
        'gradient-tertiary-end': '#D3545D',
      },
      
      /**
       * TIPOGRAFIA
       * ------------------------------
       * Fontes e tamanhos para o sistema de design
       */
      fontFamily: {
        // Família Jakarta Sans
        'jakarta-thin': ['PlusJakartaSans_200ExtraLight'],
        'jakarta-light': ['PlusJakartaSans_300Light'],
        'jakarta-regular': ['PlusJakartaSans_400Regular'],
        'jakarta-medium': ['PlusJakartaSans_500Medium'],
        'jakarta-semibold': ['PlusJakartaSans_600SemiBold'],
        'jakarta-bold': ['PlusJakartaSans_700Bold'],
        'jakarta-extrabold': ['PlusJakartaSans_800ExtraBold'],
        // Família Monospace
        'mono-regular': ['SpaceMono-Regular', 'monospace'],
      },
      
      fontSize: {
        // Escala de tipografia completa
        
        // Display - Textos de grande destaque
        'display-xl': ['56px', { lineHeight: '64px', fontWeight: '700' }],
        'display-lg': ['48px', { lineHeight: '56px', fontWeight: '700' }],
        'display-md': ['40px', { lineHeight: '48px', fontWeight: '700' }],
        'display-sm': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        
        // Headline - Títulos principais
        'headline-xl': ['36px', { lineHeight: '44px', fontWeight: '700' }],
        'headline-lg': ['32px', { lineHeight: '40px', fontWeight: '700' }],
        'headline-md': ['28px', { lineHeight: '36px', fontWeight: '700' }],
        'headline-sm': ['24px', { lineHeight: '32px', fontWeight: '700' }],
        
        // Title - Títulos de seções
        'title-lg': ['22px', { lineHeight: '28px', fontWeight: '700' }],
        'title-md': ['20px', { lineHeight: '26px', fontWeight: '700' }],
        'title-sm': ['18px', { lineHeight: '24px', fontWeight: '700' }],
        
        // Subtitle - Subtítulos
        'subtitle-lg': ['18px', { lineHeight: '24px', fontWeight: '600' }],
        'subtitle-md': ['16px', { lineHeight: '22px', fontWeight: '600' }],
        'subtitle-sm': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        
        // Label - Rótulos
        'label-lg': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'label-md': ['14px', { lineHeight: '20px', fontWeight: '600' }],
        'label-sm': ['12px', { lineHeight: '16px', fontWeight: '600' }],
        
        // Body - Texto de corpo
        'body-lg': ['16px', { lineHeight: '24px', fontWeight: '400' }],
        'body-md': ['14px', { lineHeight: '20px', fontWeight: '400' }],
        'body-sm': ['12px', { lineHeight: '18px', fontWeight: '400' }],
        'body-xs': ['10px', { lineHeight: '14px', fontWeight: '400' }],
        
        // Mono - Texto monoespaçado
        'mono-lg': ['16px', { lineHeight: '24px', fontWeight: '400', fontFamily: 'monospace' }],
        'mono-md': ['14px', { lineHeight: '20px', fontWeight: '400', fontFamily: 'monospace' }],
        'mono-sm': ['12px', { lineHeight: '18px', fontWeight: '400', fontFamily: 'monospace' }],
      },
      
      /**
       * ESPAÇAMENTO
       * ------------------------------
       * Sistema de espaçamento organizado
       */
      spacing: {
        // Valores em pixels
        '0': '0px',
        'px': '1px',
        
        // Extra pequenos (2-6px)
        '0.5': '2px',
        '1': '4px',
        '1.5': '6px',
        
        // Pequenos (8-12px)
        '2': '8px',
        '2.5': '10px',
        '3': '12px',
        
        // Médios (14-20px)
        '3.5': '14px',
        '4': '16px',
        '5': '20px',
        
        // Grandes (24-40px)
        '6': '24px',
        '7': '28px',
        '8': '32px',
        '9': '36px',
        '10': '40px',
        
        // Extra grandes (44-64px)
        '11': '44px',
        '12': '48px',
        '14': '56px',
        '16': '64px',
        
        // Enormes (72-128px)
        '18': '72px',
        '20': '80px',
        '24': '96px',
        '28': '112px',
        '32': '128px',
        
        // Gigantes (144-384px)
        '36': '144px',
        '40': '160px',
        '44': '176px',
        '48': '192px',
        '52': '208px',
        '56': '224px',
        '60': '240px',
        '64': '256px',
        '72': '288px',
        '80': '320px',
        '96': '384px',
        
        // Aliases semânticos (para facilitar o uso)
        'xxxs': '2px',  // 0.5
        'xxs': '4px',   // 1
        'xs': '8px',    // 2
        'sm': '12px',   // 3
        'md': '16px',   // 4
        'lg': '24px',   // 6
        'xl': '32px',   // 8
        '2xl': '48px',  // 12
        '3xl': '64px',  // 16
        '4xl': '80px',  // 20
        '5xl': '96px',  // 24
        '6xl': '128px', // 32
      },
      
      /**
       * RAIOS DE BORDA
       * ------------------------------
       */
      borderRadius: {
        'none': '0',
        'xs': '2px',
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        '2xl': '20px',
        '3xl': '24px',
        '4xl': '28px',
        '5xl': '32px',
        'full': '9999px',
      },
      
      /**
       * SOMBRAS
       * ------------------------------
       */
      boxShadow: {
        // Sombras - do mais sutil ao mais forte
        'none': 'none',
        'xs': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'sm': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        
        // Aliases para temas claro/escuro
        'light-card': '0 2px 5px 0 rgba(0, 0, 0, 0.05), 0 1px 2px 0 rgba(0, 0, 0, 0.04)',
        'dark-card': '0 2px 5px 0 rgba(0, 0, 0, 0.3), 0 1px 2px 0 rgba(0, 0, 0, 0.2)',
        'light-button': '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        'dark-button': '0 1px 3px 0 rgba(0, 0, 0, 0.3)',
        'float': '0 10px 25px -5px rgba(0, 0, 0, 0.15)',
      },
      
      /**
       * OPACIDADE
       * ------------------------------
       */
      opacity: {
        '0': '0',
        '5': '0.05',
        '10': '0.1',
        '15': '0.15',
        '20': '0.2',
        '25': '0.25',
        '30': '0.3',
        '40': '0.4',
        '50': '0.5',
        '60': '0.6',
        '70': '0.7',
        '75': '0.75',
        '80': '0.8',
        '85': '0.85',
        '90': '0.9',
        '95': '0.95',
        '100': '1',
      },
      
      /**
       * Z-INDEX
       * ------------------------------
       */
      zIndex: {
        '0': '0',
        '10': '10',
        '20': '20',
        '30': '30',
        '40': '40',
        '50': '50',
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
        'auto': 'auto',
      },
      
      /**
       * TRANSIÇÕES
       * ------------------------------
       */
      transitionDuration: {
        '75': '75ms',
        '100': '100ms',
        '150': '150ms',
        '200': '200ms',
        '300': '300ms',
        '500': '500ms',
        '700': '700ms',
        '1000': '1000ms',
      },
    },
  },
  plugins: [],
}; 