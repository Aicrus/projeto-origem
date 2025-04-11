# AicrusComponents

Biblioteca de componentes React Native com suporte a TailwindCSS e temas claros/escuros para o projeto Aicrus.

## Estrutura do Projeto

A biblioteca está organizada da seguinte forma:

```
components/AicrusComponents/
├── constants/         # Constantes e configurações compartilhadas
│   └── theme.ts       # Definições de cores e temas para componentes
├── select/            # Componente Select e suas variações
│   ├── Select.tsx     # Implementação do componente
│   └── index.ts       # Exporta o componente (permite import da pasta)
├── [outros-componentes]/ # Outros componentes futuros
├── index.ts           # Exporta todos os componentes de uma vez
└── README.md          # Esta documentação
```

### Propósito de cada arquivo

- **constants/theme.ts**: Define cores e estilos para uso nos componentes via JavaScript
- **select/index.ts**: Facilita importações do componente (`import { Select } from '../select'`)  
- **index.ts**: Permite importar todos os componentes com uma única linha (`import { Select, ... } from '../AicrusComponents'`)

## Como importar componentes

```tsx
// RECOMENDADO: Importação via barrel index (todos os componentes)
import { Select, /* outros componentes futuros */ } from '../../components/AicrusComponents';

// Alternativa: Importação direta de um componente específico
import { Select } from '../../components/AicrusComponents/select';
```

## Gestão de temas e cores

### IMPORTANTE: Sistema duplo de cores

Atualmente, as cores estão definidas em dois lugares:

1. **tailwind.config.js**: Define as classes Tailwind (ex: `bg-primary-dark`) 
2. **constants/theme.ts**: Define cores para uso em propriedades JavaScript

Ao modificar cores, é necessário atualizar AMBOS os arquivos para manter consistência!

```tsx
// Em tailwind.config.js - para classes Tailwind
colors: {
  'primary-light': '#892CDC',
  // outras cores...
}

// Em constants/theme.ts - para uso via JavaScript
export const colors = {
  primary: {
    main: '#892CDC',
    // outras cores...
  }
}
```

## Adicionando novos componentes

Para adicionar um novo componente à biblioteca:

1. **Crie uma nova pasta** com o nome do componente em minúsculas (ex: `button/`)
2. **Implemente o componente** principal (ex: `Button.tsx`)
3. **Crie um arquivo index.ts** na pasta para exportar o componente:
   ```tsx
   // button/index.ts
   export * from './Button';
   ```
4. **Atualize o index.ts principal** da biblioteca para exportar o novo componente:
   ```tsx
   // index.ts
   export * from './select';
   export * from './button'; // Adicione esta linha
   ```
5. **Documente o componente** neste README

## Componentes Disponíveis

### Select

Componente de seleção dropdown que suporta seleção única ou múltipla, com suporte a tema claro/escuro.

#### Propriedades

| Propriedade     | Tipo                   | Descrição                                   | Padrão              |
|-----------------|------------------------|---------------------------------------------|---------------------|
| options         | `DropdownOption[]`     | Lista de opções para o dropdown             | Obrigatório         |
| value           | `string` ou `string[]` | Valor(es) selecionado(s)                    | Obrigatório         |
| setValue        | `Function`             | Função para atualizar o valor               | Obrigatório         |
| multiple        | `boolean`              | Habilita seleção múltipla                   | `false`             |
| placeholder     | `string`               | Texto do placeholder                        | "Selecione uma opção" |
| label           | `string`               | Texto do label acima do dropdown            | -                   |
| disabled        | `boolean`              | Desabilita o componente                     | `false`             |
| loading         | `boolean`              | Mostra indicador de carregamento            | `false`             |
| searchable      | `boolean`              | Habilita busca no dropdown                  | `false`             |
| zIndex          | `number`               | Z-index do componente                       | 1000                |
| zIndexInverse   | `number`               | Z-index inverso para componentes aninhados  | 1000                |
| maxHeight       | `number`               | Altura máxima do dropdown                   | 160                 |
| min             | `number`               | Quantidade mínima de itens (só em múltipla) | -                   |
| max             | `number`               | Quantidade máxima de itens (só em múltipla) | -                   |
| onOpen          | `() => void`           | Callback quando o dropdown abre             | -                   |
| onClose         | `() => void`           | Callback quando o dropdown fecha            | -                   |

#### Exemplos

**Seleção única:**

```tsx
const [value, setValue] = useState('');
const options = [
  { label: 'Opção 1', value: 'opcao1' },
  { label: 'Opção 2', value: 'opcao2' }
];

<Select 
  options={options}
  value={value}
  setValue={setValue}
  placeholder="Selecione uma opção"
  label="Selecione uma opção"
/>
```

**Seleção múltipla:**

```tsx
const [values, setValues] = useState<string[]>([]);
const options = [
  { label: 'Opção 1', value: 'opcao1' },
  { label: 'Opção 2', value: 'opcao2' }
];

<Select 
  options={options}
  value={values}
  setValue={setValues}
  multiple={true}
  placeholder="Selecione várias opções"
  label="Selecione várias opções"
/>
``` 