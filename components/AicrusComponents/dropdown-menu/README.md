# DropdownMenu Component

Componente de menu dropdown responsivo com suporte a submenus.

## Funcionalidades

- ✅ Responsivo (Web, iOS, Android)
- ✅ Tema claro/escuro automático
- ✅ Submenu para "Invite users"
- ✅ Posicionamento inteligente
- ✅ **Largura ajustável do submenu (novo!)**

## Propriedades

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `buttonText` | `string` | `"Open"` | Texto do botão que abre o menu |
| `onOptionSelect` | `(optionId: string) => void` | - | Função chamada quando uma opção é selecionada |
| `disabled` | `boolean` | `false` | Se o menu está desabilitado |
| `maxHeight` | `number` | `400` | Altura máxima do dropdown |
| `zIndex` | `number` | `9999` | Posição Z do dropdown |
| `onOpen` | `() => void` | - | Callback quando o menu abre |
| `onClose` | `() => void` | - | Callback quando o menu fecha |
| `submenuWidth` | `number` | - | **Largura customizada do submenu** |

## Uso Básico

```tsx
import { DropdownMenu } from './components/AicrusComponents/dropdown-menu/DropdownMenu';

function App() {
  return (
    <DropdownMenu 
      buttonText="Menu" 
      onOptionSelect={(optionId) => {
        console.log('Opção selecionada:', optionId);
      }} 
    />
  );
}
```

## Largura Customizada do Submenu

A propriedade `submenuWidth` permite ajustar a largura do submenu, especialmente útil para dispositivos móveis onde o espaço é limitado:

```tsx
// Submenu mais estreito para mobile
<DropdownMenu 
  buttonText="Menu" 
  submenuWidth={100} // 100px de largura
  onOptionSelect={(optionId) => console.log(optionId)} 
/>

// Submenu mais largo para desktop
<DropdownMenu 
  buttonText="Menu" 
  submenuWidth={180} // 180px de largura
  onOptionSelect={(optionId) => console.log(optionId)} 
/>
```

## Larguras Padrão

Se `submenuWidth` não for especificada, o componente usa larguras padrão otimizadas:

- **Web**: 140px
- **Mobile (iOS/Android)**: 120px

## Opções do Menu

O menu inclui as seguintes opções:

- **Team** - Gerenciar equipe
- **Invite users** - Convidar usuários (com submenu)
  - Email
  - Message  
  - More...
- **New Team** - Criar nova equipe
- **GitHub** - Integração GitHub
- **Support** - Suporte
- **API** - Documentação da API
- **Log out** - Sair (separado)

## Responsividade

O componente se adapta automaticamente à plataforma:

- **Web**: Usa posicionamento absoluto com portal
- **Mobile**: Usa Modal nativo do React Native
- **Submenu**: Largura ajustável baseada na plataforma e propriedade customizada 