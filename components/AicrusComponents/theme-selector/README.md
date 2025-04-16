# ThemeSelector

O ThemeSelector é um componente interativo que permite alternar entre os modos de tema (claro, escuro e sistema) com animações suaves e feedback visual.

## Características

- **Animações suaves**: Transições fluidas entre os modos de tema usando react-native-reanimated
- **Design responsivo**: Funciona igualmente bem em todas as plataformas (iOS, Android e Web)
- **Adaptação automática**: Adapta-se automaticamente ao tema atual do aplicativo
- **Ícones intuitivos**: Representação visual clara de cada modo (sol, lua, desktop)
- **Personalização**: Suporta classes adicionais para customização de tamanho e posicionamento

## Uso

```jsx
import { ThemeSelector } from '@/components/AicrusComponents/theme-selector';

// Uso básico
<ThemeSelector />

// Com tamanho personalizado
<ThemeSelector className="scale-150" />

// Posicionamento personalizado
<ThemeSelector className="mt-4 self-center" />
```

## Props

| Prop      | Tipo     | Padrão | Descrição                                        |
|-----------|----------|--------|-------------------------------------------------|
| className | string   | ''     | Classes adicionais para personalização de estilo |

## Exemplos

### Básico

```jsx
<ThemeSelector />
```

### Com tamanho personalizado

```jsx
<ThemeSelector className="scale-150" />
```

## Implementação Técnica

O componente utiliza:

- **react-native-reanimated**: Para animações fluidas do slider
- **@expo/vector-icons**: Para os ícones de cada modo de tema
- **Hooks personalizados**: Integração com o hook `useTheme` para gerenciar o estado do tema

## Acessibilidade

O componente segue boas práticas de acessibilidade:

- Ícones intuitivos para cada modo
- Contraste suficiente entre elementos
- Feedback visual claro para o modo atual

## Compatibilidade

- iOS
- Android
- Web

## Customização

O componente pode ser personalizado através da prop `className`, que aceita qualquer classe compatível com o sistema de estilo usado no projeto (TailwindCSS/NativeWind). 