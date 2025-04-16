# ThemeSelector

O ThemeSelector é um componente interativo que permite alternar entre os modos de tema (claro, escuro e sistema) com animações suaves e feedback visual.

## Características

- **Animações suaves**: Transições fluidas entre os modos de tema usando react-native-reanimated
- **Design responsivo**: Funciona igualmente bem em todas as plataformas (iOS, Android e Web)
- **Adaptação automática**: Adapta-se automaticamente ao tema atual do aplicativo
- **Ícones intuitivos**: Representação visual clara de cada modo (sol, lua, desktop)
- **Múltiplas variantes**: Diferentes estilos visuais (padrão, pill, minimal, com rótulos)
- **Tamanhos flexíveis**: Opções de tamanho (sm, md, lg, xl) para diferentes contextos
- **Personalização**: Suporta classes adicionais e cores personalizadas

## Uso

```jsx
import { ThemeSelector } from '@/components/AicrusComponents/theme-selector';

// Uso básico
<ThemeSelector />

// Com tamanho personalizado
<ThemeSelector size="lg" />

// Com estilo diferente
<ThemeSelector variant="pill" />

// Com rótulos
<ThemeSelector variant="labeled" showLabels={true} />

// Sem opção de sistema
<ThemeSelector showSystemOption={false} />

// Com cores personalizadas
<ThemeSelector 
  customColors={{
    background: '#2A2D3A',
    sliderBackground: '#6C5CE7',
    activeIconColor: '#FFFFFF',
    inactiveIconColor: '#95A1AC',
  }} 
/>
```

## Props

| Prop            | Tipo                            | Padrão     | Descrição                                        |
|-----------------|--------------------------------|------------|-------------------------------------------------|
| className       | string                         | ''         | Classes adicionais para personalização de estilo |
| size            | 'sm' \| 'md' \| 'lg' \| 'xl'   | 'md'       | Tamanho do componente                           |
| variant         | 'default' \| 'pill' \| 'minimal' \| 'labeled' | 'default' | Estilo visual do componente        |
| showLabels      | boolean                        | false      | Exibir rótulos para os modos                     |
| showSystemOption | boolean                        | true       | Exibir opção de tema do sistema                  |
| customColors    | object                         | {}         | Personalização de cores (ver abaixo)             |

### Opções de customColors

| Propriedade        | Tipo   | Descrição                                          |
|--------------------|--------|---------------------------------------------------|
| background         | string | Cor de fundo do container                          |
| sliderBackground   | string | Cor de fundo do slider                             |
| activeIconColor    | string | Cor do ícone do modo selecionado                   |
| inactiveIconColor  | string | Cor dos ícones dos modos não selecionados          |

## Variantes

### Padrão (default)

```jsx
<ThemeSelector />
```
Estilo básico com fundo e slider animado.

### Pill (arredondado)

```jsx
<ThemeSelector variant="pill" />
```
Versão com cantos completamente arredondados.

### Minimal (sem fundo)

```jsx
<ThemeSelector variant="minimal" />
```
Versão minimalista sem fundo ou slider, apenas ícones.

### Com rótulos (labeled)

```jsx
<ThemeSelector variant="labeled" showLabels={true} />
```
Versão com rótulos abaixo dos ícones.

## Tamanhos

O componente oferece quatro tamanhos:

```jsx
<ThemeSelector size="sm" /> // Pequeno
<ThemeSelector size="md" /> // Médio (padrão)
<ThemeSelector size="lg" /> // Grande
<ThemeSelector size="xl" /> // Extra grande
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
- Rótulos opcionais para maior clareza

## Compatibilidade

- iOS
- Android
- Web

## Customização

O componente pode ser personalizado através das props acima, permitindo adaptá-lo a diferentes estilos de design e necessidades. 