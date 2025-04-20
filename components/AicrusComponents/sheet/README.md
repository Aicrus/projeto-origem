# Sheet

O componente Sheet permite exibir conteúdo em uma janela modal deslizante que pode vir de qualquer direção (top, right, bottom, left).

## Recursos

- **Responsividade**: Em dispositivos móveis, o Sheet só abre de baixo para cima (bottom), enquanto no desktop pode abrir de qualquer direção.
- **Animação suave**: Transição fluida e configurável.
- **Overlay personalizável**: Controle de opacidade do fundo.
- **Botão de fechamento**: Opção para mostrar ou ocultar o botão de fechar.
- **Dimensões configuráveis**: Controle de altura, largura e raio das bordas.

## Instalação

O componente Sheet é parte do pacote AicrusComponents e já está disponível após a instalação do projeto.

## Uso

```jsx
import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
import { Sheet } from 'components/AicrusComponents';

function SheetExample() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <View>
      <Button
        title="Abrir Sheet"
        onPress={() => setIsOpen(true)}
      />
      
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position="bottom"
        height="50%"
        width="80%"
        borderRadius={16}
        closeOnOverlayClick={true}
        showCloseButton={true}
        overlayOpacity={0.5}
        animationDuration={300}
      >
        <View style={{ padding: 20 }}>
          <Text>Conteúdo do Sheet</Text>
          <Button
            title="Fechar"
            onPress={() => setIsOpen(false)}
          />
        </View>
      </Sheet>
    </View>
  );
}

export default SheetExample;
```

## Propriedades

| Propriedade         | Tipo               | Padrão     | Descrição                                                  |
|---------------------|--------------------|-----------|------------------------------------------------------------|
| isOpen              | boolean            | -         | Controla a visibilidade do Sheet                           |
| onClose             | function           | -         | Função chamada quando o Sheet é fechado                    |
| position            | SheetPosition      | 'bottom'  | Posição do Sheet ('top', 'right', 'bottom', 'left')        |
| children            | ReactNode          | -         | Conteúdo a ser renderizado dentro do Sheet                 |
| overlayOpacity      | number             | 0.5       | Opacidade do overlay de fundo                              |
| height              | number \| string   | '50%'     | Altura do Sheet                                            |
| width               | number \| string   | '80%'     | Largura do Sheet                                           |
| borderRadius        | number             | 16        | Raio da borda do Sheet                                     |
| closeOnOverlayClick | boolean            | true      | Se o Sheet deve fechar ao clicar no overlay                |
| showCloseButton     | boolean            | false     | Se deve mostrar o botão de fechar                          |
| animationDuration   | number             | 300       | Duração da animação em milissegundos                       |
| testID              | string             | undefined | ID para testes automatizados                               |

## Notas de Implementação

- Em dispositivos móveis (telas pequenas ou plataformas nativas), o Sheet só abre na posição 'bottom', independentemente da propriedade `position`.
- As bordas arredondadas são aplicadas automaticamente com base na direção de abertura do Sheet.
- O Sheet adapta-se automaticamente ao tema claro/escuro do aplicativo.

## Exemplos

### Exemplo com diferentes posições

```jsx
import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { Sheet } from 'components/AicrusComponents';

function SheetPositionsExample() {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState('bottom');
  
  const openSheet = (pos) => {
    setPosition(pos);
    setIsOpen(true);
  };
  
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
      <Button title="De Cima" onPress={() => openSheet('top')} />
      <Button title="Da Direita" onPress={() => openSheet('right')} />
      <Button title="De Baixo" onPress={() => openSheet('bottom')} />
      <Button title="Da Esquerda" onPress={() => openSheet('left')} />
      
      <Sheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        position={position}
      >
        {/* Conteúdo do Sheet */}
      </Sheet>
    </View>
  );
}
```

## Melhores Práticas

1. **Conteúdo Conciso**: Mantenha o conteúdo do Sheet focado e relevante.
2. **Adaptação à Plataforma**: Lembre-se que em mobile apenas a posição 'bottom' é suportada.
3. **Feedback Visual**: Forneça botões claros para fechar o Sheet.
4. **Controle de Altura**: Defina uma altura adequada para não ocupar toda a tela desnecessariamente. 