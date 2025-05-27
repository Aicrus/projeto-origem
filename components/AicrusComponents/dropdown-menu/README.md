# DropdownMenu Components

Sistema de menus dropdown responsivos e modulares com suporte a triggers customizáveis e submenus.

## 📁 Estrutura

```
dropdown-menu/
├── DropdownMenu.tsx          # Componente base genérico
├── types.ts                  # Interfaces compartilhadas
├── menus/
│   ├── TeamMenu.tsx          # Menu de equipe (original)
│   ├── NotificationsMenu.tsx # Menu de notificações
│   └── ProfileMenu.tsx       # Menu de perfil
├── README.md
└── index.ts
```

## 🚀 Funcionalidades

- ✅ **Componente base genérico** - Reutilizável para qualquer tipo de menu
- ✅ **Trigger customizável** - Botão, ícone, ou qualquer elemento
- ✅ **Menus específicos** - TeamMenu, NotificationsMenu, ProfileMenu
- ✅ **Submenus** - Suporte completo a submenus aninhados
- ✅ **Responsivo** - Web, iOS, Android
- ✅ **Tema automático** - Claro/escuro
- ✅ **Posicionamento inteligente** - Ajuste automático de posição
- ✅ **TypeScript** - Tipagem completa

## 📖 Uso

### 1. Componente Base (DropdownMenu)

```tsx
import { DropdownMenu } from './components/AicrusComponents/dropdown-menu';

// Com botão padrão
<DropdownMenu 
  buttonText="Menu" 
  options={menuOptions}
  onOptionSelect={(optionId) => console.log(optionId)} 
/>

// Com trigger customizado (ícone)
<DropdownMenu 
  trigger={<TouchableOpacity><Bell size={20} /></TouchableOpacity>}
  options={menuOptions}
  onOptionSelect={(optionId) => console.log(optionId)} 
/>
```

### 2. Menu de Equipe (TeamMenu)

```tsx
import { TeamMenu } from './components/AicrusComponents/dropdown-menu';

// Com botão padrão
<TeamMenu 
  onTeamOptionSelect={(optionId) => {
    console.log('Team option:', optionId);
  }}
  onInviteSubmenuSelect={(optionId) => {
    console.log('Invite submenu:', optionId);
  }}
/>

// Com trigger customizado
<TeamMenu 
  trigger={<TouchableOpacity><Users size={20} /></TouchableOpacity>}
  onTeamOptionSelect={(optionId) => {
    console.log('Team option:', optionId);
  }}
/>
```

**Opções disponíveis:**
- `team` - Gerenciar equipe
- `invite` - Convidar usuários (com submenu: email, message, more)
- `newteam` - Criar nova equipe
- `github` - Integração GitHub
- `support` - Suporte
- `api` - Documentação da API
- `logout` - Sair

### 3. Menu de Notificações (NotificationsMenu)

```tsx
import { NotificationsMenu } from './components/AicrusComponents/dropdown-menu';

// Com ícone de sino
<NotificationsMenu 
  trigger={<TouchableOpacity><Bell size={20} /></TouchableOpacity>}
  onNotificationOptionSelect={(optionId) => {
    console.log('Notification option:', optionId);
  }}
  onActionSubmenuSelect={(optionId) => {
    console.log('Action submenu:', optionId);
  }}
/>
```

**Opções disponíveis:**
- `all` - Todas as notificações
- `unread` - Apenas não lidas
- `mentions` - Menções (com submenu: mark_read, delete, more)
- `settings` - Configurações
- `archive` - Arquivar
- `clear` - Limpar todas

### 4. Menu de Perfil (ProfileMenu)

```tsx
import { ProfileMenu } from './components/AicrusComponents/dropdown-menu';

// Com avatar
<ProfileMenu 
  trigger={<TouchableOpacity><User size={20} /></TouchableOpacity>}
  onProfileOptionSelect={(optionId) => {
    console.log('Profile option:', optionId);
  }}
  onEditSubmenuSelect={(optionId) => {
    console.log('Edit submenu:', optionId);
  }}
/>
```

**Opções disponíveis:**
- `profile` - Ver perfil
- `edit` - Editar perfil (com submenu: edit_info, change_photo, more)
- `settings` - Configurações
- `security` - Segurança
- `billing` - Cobrança
- `help` - Ajuda
- `logout` - Sair

## 🎨 Exemplos de Triggers Customizados

```tsx
// Ícone simples
<TeamMenu 
  trigger={<Bell size={20} color="#666" />}
/>

// Botão com ícone
<NotificationsMenu 
  trigger={
    <TouchableOpacity style={styles.iconButton}>
      <Bell size={20} />
      <Text>3</Text> {/* Badge de notificações */}
    </TouchableOpacity>
  }
/>

// Avatar do usuário
<ProfileMenu 
  trigger={
    <TouchableOpacity>
      <Image source={{ uri: userAvatar }} style={styles.avatar} />
    </TouchableOpacity>
  }
/>

// Botão customizado
<TeamMenu 
  trigger={
    <TouchableOpacity style={styles.customButton}>
      <Users size={16} />
      <Text>Team</Text>
      <ChevronDown size={14} />
    </TouchableOpacity>
  }
/>
```

## ⚙️ Propriedades Comuns

| Propriedade | Tipo | Padrão | Descrição |
|-------------|------|--------|-----------|
| `trigger` | `React.ReactNode` | - | Elemento que dispara o menu (opcional) |
| `buttonText` | `string` | - | Texto do botão padrão |
| `onOptionSelect` | `(optionId: string) => void` | - | Callback geral para qualquer opção |
| `disabled` | `boolean` | `false` | Se o menu está desabilitado |
| `maxHeight` | `number` | `400` | Altura máxima do dropdown |
| `zIndex` | `number` | `9999` | Posição Z do dropdown |
| `onOpen` | `() => void` | - | Callback quando abre |
| `onClose` | `() => void` | - | Callback quando fecha |
| `submenuWidth` | `number` | - | Largura customizada do submenu |

## 🔧 Criando Novos Menus

Para criar um novo menu, siga o padrão dos menus existentes:

```tsx
// menus/CustomMenu.tsx
import React from 'react';
import { DropdownMenu } from '../DropdownMenu';
import { DropdownMenuOption } from '../types';

export const CustomMenu = ({ trigger, onOptionSelect, ...props }) => {
  const menuOptions: DropdownMenuOption[] = [
    {
      id: 'option1',
      label: 'Option 1',
      icon: <Icon size={16} />,
      action: () => onOptionSelect?.('option1')
    }
    // ... mais opções
  ];

  return (
    <DropdownMenu
      trigger={trigger}
      options={menuOptions}
      onOptionSelect={onOptionSelect}
      {...props}
    />
  );
};
```

## 📱 Responsividade

- **Web**: Posicionamento absoluto com portal
- **Mobile**: Modal nativo do React Native
- **Submenu**: Largura ajustável baseada na plataforma

## 🎯 Migração

Se você estava usando o DropdownMenu antigo:

```tsx
// Antes
<DropdownMenu buttonText="Menu" onOptionSelect={handleSelect} />

// Depois - usando TeamMenu (mantém as mesmas opções)
<TeamMenu buttonText="Menu" onOptionSelect={handleSelect} />

// Ou usando o componente base com opções customizadas
<DropdownMenu 
  buttonText="Menu" 
  options={customOptions}
  onOptionSelect={handleSelect} 
/>
``` 