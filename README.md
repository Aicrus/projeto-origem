# 🎨 Projeto Origem

## 📋 Índice
- [👋 Introdução](#-introdução)
- [✨ Destaques](#-destaques)
- [🚀 Começando](#-começando)
- [🔐 Configuração do Supabase](#-configuração-do-supabase)
- [🚀 Deploy](#-deploy)
- [📱 Executando o Projeto](#-executando-o-projeto)
- [🎯 Estrutura de Navegação](#-estrutura-de-navegação)
- [🎨 Design System](#-design-system)
- [📦 Componentes Principais](#-componentes-principais)
- [📁 Estrutura do Projeto](#-estrutura-do-projeto)
- [💻 Desenvolvimento](#-desenvolvimento)
- [🔄 Renomeando o Projeto](#-renomeando-o-projeto)
- [🤝 Suporte](#-suporte)

## 👋 Introdução

Bem-vindo ao Projeto Origem! Este é um template moderno e flexível para criar aplicações incríveis que funcionam tanto na web quanto em dispositivos móveis. Nosso objetivo é tornar o desenvolvimento mais fácil e divertido, fornecendo uma base sólida com as melhores práticas já implementadas.

## ✨ Destaques

- 🌓 Modo Claro e Escuro (igual ao Instagram/WhatsApp)
- 📱 Design Responsivo (funciona em qualquer tela)
- 🎯 Componentes Reutilizáveis
- 🖌️ Design System Completo
- 🌐 Suporte Web e Mobile Nativo
- 🚀 Deploy Simplificado

## 🚀 Começando

### 📋 Pré-requisitos

Antes de começar, você precisa ter instalado em sua máquina:

1. [Git](https://git-scm.com) - Para baixar e versionar o projeto
2. [Node.js](https://nodejs.org/) - Use a versão LTS
3. [npm](https://www.npmjs.com/) - Vem junto com o Node.js
4. [Expo CLI](https://docs.expo.dev/workflow/expo-cli/) - Para desenvolvimento mobile

> 💡 **Dica**: Verifique se já tem algo instalado usando estes comandos:
> ```bash
> git --version
> node --version
> npm --version
> gh --version  # Verifica se o GitHub CLI está instalado
> gh auth status  # Verifica se está logado no GitHub CLI
> ```
>
> 🔑 **Configurando GitHub CLI**:
> Se não estiver logado no GitHub CLI, siga estes passos:
> 1. Execute `gh auth login`
> 2. Selecione "GitHub.com"
> 3. Escolha "HTTPS" como protocolo
> 4. Confirme com "Yes" para autenticar via web browser
> 5. O browser abrirá automaticamente para você fazer login
> 6. Após o login, copie o código mostrado no terminal e cole no browser
> 7. Pronto! Você está logado e pode criar PRs via terminal

### 🎮 Configuração Inicial

1. **Clone o Projeto**
   ```bash
   git clone [url-do-repositório]
   cd [nome-do-projeto]
   ```

2. **Instale as Dependências**
   ```bash
   npm install
   ```

3. **Instale o Expo CLI**
   ```bash
   npm install -g expo-cli
   ```

## 🔐 Configuração do Supabase

### 🎯 Passo a Passo

1. **Crie o Arquivo de Ambiente**
   ```bash
   # Mac/Linux
   touch .env
   # Windows
   type nul > .env
   ```

2. **Configure as Variáveis**
   - Copie o conteúdo de `.env.example` para `.env`
   ```bash
   cp .env.example .env
   ```

3. **Obtenha suas Credenciais**
   1. Acesse [supabase.com](https://supabase.com)
   2. Crie uma conta ou faça login
   3. Crie um novo projeto
   4. Vá em "Settings" > "API"
   5. Copie:
      - Project URL → Cole em `EXPO_PUBLIC_SUPABASE_URL`
      - anon public → Cole em `EXPO_PUBLIC_SUPABASE_ANON_KEY`

## 🚀 Deploy

### 💡 Configuração na Vercel

1. Acesse [vercel.com](https://vercel.com)
2. Vá em seu projeto
3. Clique em "Settings" > "Environment Variables"
4. Adicione cada variável separadamente:

   **Primeira Variável:**
   - Key: `EXPO_PUBLIC_SUPABASE_URL`
   - Value: sua_url_do_supabase (exemplo: https://seu-projeto.supabase.co)

   **Segunda Variável:**
   - Key: `EXPO_PUBLIC_SUPABASE_ANON_KEY`
   - Value: sua_chave_anonima_do_supabase

   > 💡 **Dica**: Você verá dois campos separados para cada variável: um para a "Key" (nome da variável) e outro para o "Value" (valor da variável)

> ⚠️ **Importante**: Use EXATAMENTE estes nomes de variáveis e mantenha suas credenciais seguras!

### 🎯 Por que a Vercel?

- ✨ Padrão da Indústria
- 🚀 Performance Excepcional
- 🎁 Plano Gratuito Generoso
- 🔒 Segurança de Primeira
- 🎯 Deploy Automático
- 📊 Analytics Incluído

## 📱 Executando o Projeto

Para iniciar o projeto em qualquer sistema operacional (Windows, macOS ou Linux), use o comando:

```bash
npm start
```

Este comando irá:
1. ✅ Verificar automaticamente se as dependências estão instaladas
2. 📦 Instalar as dependências caso necessário
3. 🚀 Iniciar o Expo em modo de desenvolvimento

> 💡 **Dicas para Windows**:
> - O comando `npm start` funciona perfeitamente no Windows
> - Use o Windows Terminal ou PowerShell para melhor experiência
> - Se encontrar algum erro de permissão:
>   1. Execute o PowerShell como administrador
>   2. Execute o comando: `Set-ExecutionPolicy RemoteSigned`
>   3. Tente `npm start` novamente
> - Certifique-se de ter o Node.js instalado corretamente no Windows

> 💡 **Dica**: Este é o comando recomendado para iniciar o projeto, pois ele garante que todas as dependências estejam corretamente instaladas antes de iniciar.

Alternativamente, se você precisar iniciar o projeto para uma plataforma específica, pode usar:

```bash
# Web (Windows, macOS, Linux)
npm run web

# iOS (apenas em macOS)
npm run ios

# Android (Windows, macOS, Linux)
npm run android
```

> ⚠️ **Notas importantes**:
> - O comando `npm run ios` só está disponível em computadores macOS, pois requer o Xcode instalado
> - Para rodar no Android, você precisa ter o Android Studio instalado e configurado em qualquer sistema operacional

## 🎯 Estrutura de Navegação

### 🔄 Rotas Principais

1. **Usuários Não Logados**
   - Padrão: `/(auth)/login`
   - Para alterar, edite `app/index.tsx`:
   ```typescript
   import { Redirect } from 'expo-router';
   
   export default function Index() {
     return <Redirect href="/(auth)/sua-nova-rota" />;
   }
   ```
   > 💡 **Dica**: Crie o arquivo correspondente em `app/(auth)/sua-nova-rota.tsx`

2. **Usuários Logados**
   - Padrão: `/(tabs)/home` (nossa tela inicial após login)
   - Para alterar, edite `contexts/auth.tsx`

### 📱 Fluxo de Autenticação
- Login: `/(auth)/login`
- Cadastro: `/(auth)/signup`
- Home após login: `/(tabs)/home`

## 🎨 Design System

O projeto utiliza um design system completo e consistente para todas as plataformas (web, iOS e Android). 

Principais características:
- 🎨 Cores temáticas para modo claro e escuro
- 📏 Sistema consistente de espaçamento e tipografia
- 📱 Componentes adaptados para todas as plataformas
- 🔄 Suporte completo a temas

### 🔤 Fontes do Projeto

O projeto utiliza as seguintes fontes:
- **Inter**: fonte principal para textos e interfaces
- **SpaceMono**: fonte monoespaçada para códigos e dados técnicos

Para modificar as fontes do projeto:

1. **Adicionar arquivos de fonte**:
   - Coloque seus arquivos de fonte (.ttf ou .otf) na pasta `assets/fonts/`
   - A pasta já contém o arquivo `SpaceMono-Regular.ttf` como exemplo

2. **Configurar no Tailwind**:
   - Edite o arquivo `tailwind.config.js`
   - Modifique a seção `fontFamily` para incluir suas fontes:
   ```js
   fontFamily: {
     'inter-regular': ['Inter_400Regular'],
     'inter-semibold': ['Inter_600SemiBold'],
     'inter-bold': ['Inter_700Bold'],
     // Adicione suas novas fontes aqui
     'sua-fonte': ['SuaFonte-Regular'],
   }
   ```

3. **Importar fontes no projeto**:
   - Caso use o Expo Font, importe e carregue as fontes no arquivo `app/_layout.tsx`

> 💡 **Dica**: Para usar fontes carregadas pelo Expo, consulte a [documentação oficial do Expo sobre fontes](https://docs.expo.dev/guides/using-custom-fonts/).

### 🔎 SEO e Meta Tags

O projeto já vem com configurações de SEO otimizadas para web. Para personalizar o SEO:

1. **Editar arquivo de SEO**: 
   - Abra o arquivo `app/head.tsx`
   - Este arquivo contém todas as metatags relacionadas a SEO e compartilhamento em redes sociais

2. **Principais configurações**:
   ```jsx
   <title>Seu Título Aqui</title>
   <meta name="description" content="Sua descrição aqui" />
   
   // Open Graph (para compartilhamento em redes sociais)
   <meta property="og:title" content="Título para compartilhamento" />
   <meta property="og:description" content="Descrição para compartilhamento" />
   <meta property="og:image" content="https://seu-site.com/imagem.jpg" />
   
   // Tema e cores
   <meta name="theme-color" content={themeColor} /> // Usa a cor primária do tema
   ```

3. **Imagens e ícones**:
   - Para imagens de compartilhamento (og:image), use imagens de 1200x630px
   - Substitua os ícones em `/assets/images/` com seus próprios ícones

4. **Arquivos de SEO adicionais**:
   - O projeto inclui arquivos importantes de SEO em `assets/seo-web/`:
     - `robots.txt`: Controla o acesso de bots de busca ao seu site
     - `sitemap.xml`: Ajuda os buscadores a indexarem suas páginas
     - `site.webmanifest`: Configurações para instalação da app como PWA
   - Edite estes arquivos conforme necessário para seu projeto

> 💡 **Nota**: As cores e temas no arquivo `head.tsx` são obtidas do `tailwind.config.js`, garantindo consistência em todo o aplicativo.

### 📱 Configuração da StatusBar

A barra de status (onde aparecem as horas, sinal, bateria) está configurada para respeitar o tema atual do aplicativo:

```typescript
// Configuração da StatusBar do Expo
import { StatusBar } from 'expo-status-bar';

<StatusBar 
  style={currentTheme === 'dark' ? 'light' : 'dark'} // Texto branco em fundo escuro, texto preto em fundo claro
  backgroundColor={currentTheme === 'dark' ? '#1C1E26' : '#F7F8FA'} // Fundo transparente ou cores do tema
/>
```

Esta configuração pode ser encontrada no arquivo `app/_layout.tsx` e garante que a StatusBar sempre se ajuste ao tema atual do aplicativo.

### 🎨 Cores do Sistema e NativeWind

O projeto utiliza o NativeWind (Tailwind para React Native) para estilização. As definições de cores, espaçamento, tipografia e sombras estão no arquivo `tailwind.config.js`.

Para usar as classes do design system:

```tsx
// Em um componente:
const isDark = currentTheme === 'dark';
const bgPrimary = isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light';
const textPrimary = isDark ? 'text-text-primary-dark' : 'text-text-primary-light';

<View className={`p-md ${bgPrimary}`}>
  <Text className={`text-headline-lg font-inter-bold ${textPrimary}`}>
    Título Principal
  </Text>
</View>
```

### 🎨 Visualização do Design System

Para visualizar todas as opções do Design System, acesse a rota "/(tabs)/dev" no aplicativo. Lá você encontrará exemplos visuais de:
- Cores
- Tipografia
- Espaçamentos
- Sombras
- Componentes básicos

### 🎨 Cores do Sistema
```typescript
const COLORS = {
  light: {
    primary: '#0a7ea4',
    text: '#11181C',
    background: '#fff',
    icon: '#71717A',
    divider: '#EBEBEB',
  },
  dark: {
    primary: '#0a7ea4',
    text: '#ECEDEE',
    background: '#151718',
    icon: '#A1A1AA',
    divider: '#292929',
  },
};
```

## 📦 Componentes Principais

### 🔔 Toast
```typescript
import { useToast } from '@/hooks/useToast';

const { showToast } = useToast();
showToast({
  type: 'success', // 'success' | 'warning' | 'error' | 'info'
  message: 'Deu tudo certo!',
  description: 'Seus dados foram salvos', // Opcional
  position: 'top', // Opcional
  duration: 5000, // Opcional
});
```

## 📁 Estrutura do Projeto

```
📱 Estrutura Principal
/.expo              # Configurações do Expo
/app                # Páginas e rotas da aplicação
  /(auth)           # Rotas de autenticação
    /_layout.tsx    # Layout das telas de auth
    /login.tsx      # Tela de login
    /register.tsx   # Tela de registro
  /(tabs)           # Rotas autenticadas
    /_layout.tsx    # Layout das tabs
    /home.tsx       # Home (tela inicial)
    /dev.tsx        # Ferramentas de desenvolvimento e Design System
  /+not-found.tsx   # Página 404

🎨 Assets e Componentes
/assets            # Recursos estáticos
  /images         # Imagens e ícones
  /fonts          # Fontes utilizadas
  /seo-web        # Arquivos de SEO e configurações para web
/components        # Componentes reutilizáveis
  /ui             # Componentes base (botões, inputs, etc)
/constants        # Constantes de responsividade e breakpoints
/contexts         # Contextos do React
/hooks            # Hooks personalizados
/lib              # Bibliotecas e utilitários
/types            # Definições de tipos TypeScript

🛠️ Configuração
/.env             # Variáveis de ambiente
/.env.example     # Exemplo de variáveis de ambiente
/package.json     # Dependências e scripts
/tsconfig.json    # Configuração do TypeScript
```

## 💻 Desenvolvimento

### 📤 Git e GitHub

**Primeira vez?**
```bash
git remote add origin [URL_DO_SEU_REPOSITÓRIO]
git branch -M main
git push -u origin main
```

**Commits diários**
```bash
git add .
git commit -m "Explique o que você mudou"
git push
```

### 🎯 Checklist para Novos Componentes

1. [ ] Usar imports corretos do Design System
2. [ ] Implementar suporte a tema claro/escuro
3. [ ] Usar tipografia responsiva
4. [ ] Considerar os três breakpoints
5. [ ] Usar espaçamentos do Design System
6. [ ] Usar cores do tema atual
7. [ ] Implementar animações suaves (quando necessário)

## 🔄 Renomeando o Projeto

Se você deseja usar este projeto como base e mudar seu nome, siga estes passos para evitar erros:

### 📋 Passo a Passo para Renomear

1. **Renomeie a pasta do projeto**
   ```bash
   # Fora do diretório do projeto
   mv projeto-origem seu-novo-nome
   cd seu-novo-nome
   ```

2. **Limpe o cache e reinstale dependências**
   ```bash
   # Limpe completamente tudo para evitar referências ao nome antigo
   rm -rf node_modules
   rm -rf .expo
   npm cache clean --force
   
   # Reinstale as dependências
   npm install
   ```

3. **Atualize o arquivo package.json**
   Edite o arquivo e mude o nome do projeto:
   ```json
   {
     "name": "seu-novo-nome",
     // outras configurações...
   }
   ```

4. **Atualize o app.json**
   Edite o nome, slug e outras referências:
   ```json
   {
     "expo": {
       "name": "Seu Novo Nome",
       "slug": "seu-novo-nome",
       // outras configurações...
     }
   }
   ```

5. **Atualize metadados no Head (para web)**
   Edite o arquivo `app/_layout.tsx` atualizando o title e meta description:
   ```tsx
   <Helmet>
     <title>Seu Novo Nome - Aplicativo Multiplataforma</title>
     <meta name="description" content="Seu Novo Nome para desenvolvimento de aplicativos..." />
     // outros metadados...
   </Helmet>
   ```

6. **Reinicie com cache limpo**
   ```bash
   npx expo start -c
   ```

### ⚠️ Resolução de Problemas

Se encontrar erros relacionados a caminhos ou nomes antigos do projeto:

1. **Erro de caminhos**: Se aparecer erro mencionando caminhos com o nome antigo:
   ```
   Unable to resolve module [path/com/nome-antigo]
   ```

   Execute:
   ```bash
   # Limpe o cache do Metro
   npx react-native start --reset-cache
   # OU
   npx expo start -c
   ```

2. **Persistência de erros**: Se os erros continuarem após limpar o cache:
   - Verifique se há referências hardcoded ao nome antigo no código
   - Considere remover completamente o projeto e clonar novamente
   - Verifique se há variáveis de ambiente ou configurações locais com o nome antigo

> 💡 **Dica**: Para projetos em produção, considere usar um nome de projeto genérico nas dependências internas para evitar problemas de renomeação.

## 🤝 Suporte

- 📖 Consulte nossa documentação acima
- 🐛 Encontrou um bug? Abra uma issue no GitHub
- 💡 Tem uma sugestão? Adoramos ouvir ideias novas!

## 📜 Licença

Este projeto está sob uma **Licença Exclusiva da Aicrus Academy**. 

⚠️ **IMPORTANTE**: Este software só pode ser utilizado por membros ativos da Aicrus Academy. A licença permite que membros desenvolvam projetos pessoais e comerciais para seus clientes usando este software como base, mas proíbe expressamente:
- Revenda ou redistribuição para terceiros
- Uso por não-membros da Aicrus Academy
- Remoção dos avisos de direitos autorais

Por favor, leia o arquivo `LICENSE` na raiz do projeto para entender completamente os termos e restrições de uso.

O uso não autorizado resultará em penalidades legais e fiscais.

---

Feito com ❤️ pela [Aicrus Tech](https://www.aicrustech.com/)  
