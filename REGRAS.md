# 🔒 REGRAS.md - Projeto Origem

## 🎯 Propósito e Escopo
Este documento é o guia mestre OBRIGATÓRIO que estabelece as regras invioláveis para TODAS as modificações no projeto. Toda interação deve seguir estas diretrizes RIGOROSAMENTE.

## 🚨 Regras Primárias (NUNCA IGNORAR)

1. **Princípio da Preservação**
   - NUNCA modifique código existente sem solicitação explícita
   - SEMPRE preserve toda a estrutura atual do projeto
   - MANTENHA todos os padrões e convenções existentes

2. **Princípio da Consistência**
   - SEMPRE siga o Design System estabelecido em `tailwind.config.js`
   - NUNCA introduza novos padrões sem autorização
   - MANTENHA a coerência com o código existente

3. **Princípio da Mínima Interferência**
   - FAÇA apenas o que foi especificamente solicitado
   - EVITE alterações além do escopo definido
   - CONSULTE antes de fazer alterações adicionais

## ⚡ Diretrizes de Modificação

### 🚫 Proibições Absolutas
1. NÃO altere:
   - Cores não mencionadas
   - Estrutura de arquivos
   - Nomes de variáveis/funções
   - Dependências/versões
   - Configurações existentes
   - Padrões de código

2. NÃO adicione:
   - Novas dependências sem autorização
   - Funcionalidades não solicitadas
   - Novos arquivos sem pedido explícito

### ✅ Ações Obrigatórias
1. SEMPRE:
   - Siga o Design System
   - Use as classes de tema do NativeWind/Tailwind
   - Mantenha a responsividade
   - Preserve a tipagem TypeScript
   - Respeite os breakpoints definidos

2. ANTES de cada modificação:
   - Confirme o escopo exato da mudança
   - Verifique impactos em outras partes
   - Valide a necessidade real da alteração

## 🎨 Sistema de Design (NUNCA IGNORAR)

### 🎨 Sistema de Cores do Tailwind (OBRIGATÓRIO)
```typescript
// NUNCA use cores genéricas do Tailwind como:
// ❌ ERRADO: 'bg-blue-500', 'text-gray-800', 'border-gray-300', etc.

// SEMPRE use a nomenclatura de cores personalizada definida no tailwind.config.js:
// ✅ CORRETO: 'bg-primary-light', 'bg-primary-dark', 'text-text-primary-light', etc.

// Validação de cores:
// 1. Verificar se a cor existe no arquivo tailwind.config.js
// 2. Usar sempre o prefixo correto: bg-, text-, border-, etc.
// 3. Usar o sufixo -light ou -dark conforme o tema

// Aplicação correta das cores baseada no tema atual:
const isDark = currentTheme === 'dark';

// ✅ CORRETO: Uso condicional para temas
<View className={`${isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light'}`}>
  <Text className={`${isDark ? 'text-text-primary-dark' : 'text-text-primary-light'}`}>
    Texto no tema correto
  </Text>
</View>

// ❌ ERRADO: Usar a notação 'dark:' do Tailwind
// Não use: className="bg-white dark:bg-black"
// Em vez disso, use a condição isDark como mostrado acima

// Cores disponíveis no tema (ver tailwind.config.js para lista completa):
// Tema claro:
// - primary-light: '#4A6FA5' - Cor principal
// - secondary-light: '#22D3EE' - Cor secundária
// - tertiary-light: '#D3545D' - Cor terciária
// - bg-primary-light: '#F7F8FA' - Fundo principal
// - bg-secondary-light: '#FFFFFF' - Fundo secundário
// - text-primary-light: '#14181B' - Texto principal

// Tema escuro:
// - primary-dark: '#4A6FA5' - Cor principal
// - secondary-dark: '#2C3E50' - Cor secundária
// - tertiary-dark: '#D3545D' - Cor terciária
// - bg-primary-dark: '#1C1E26' - Fundo principal
// - bg-secondary-dark: '#14181B' - Fundo secundário
// - text-primary-dark: '#FFFFFF' - Texto principal
```

### 📱 Breakpoints (SEMPRE RESPEITAR)
```typescript
// Os breakpoints reais do projeto são:
export const BREAKPOINTS = {
  // Celulares pequenos (até iPhone SE)
  SMALL_MOBILE: 320, 
  
  // Celulares maiores (até iPhone Pro Max)
  MOBILE: 480,
  
  // Tablets pequenos e celulares em landscape
  SMALL_TABLET: 640,
  
  // Tablets (iPad, etc)
  TABLET: 768,
  
  // Tablets grandes e pequenos laptops
  LARGE_TABLET: 900,
  
  // Laptops e desktops
  DESKTOP: 1024,
  
  // Telas grandes
  LARGE_DESKTOP: 1280,
};

// ✅ CORRETO - Usando o hook useResponsive
import { useResponsive } from '../hooks/useResponsive';

// No componente
const { responsive, isMobile, isTablet, isDesktop } = useResponsive();

// Usar valores diferentes por breakpoint:
const styles = {
  maxWidth: responsive({
    mobile: '95%',    // Para mobile (até 480px)
    tablet: '70%',    // Para tablet (481-1023px)
    desktop: '50%',   // Para desktop (1024px+)
    default: '95%'    // Valor padrão se nenhum caso acima se aplicar
  })
}
```

## 📱 Regras Específicas do Expo

1. **Configurações do Expo**
   - NUNCA altere o app.json sem autorização
   - MANTENHA as configurações de plugins inalteradas
   - RESPEITE as configurações específicas de plataforma