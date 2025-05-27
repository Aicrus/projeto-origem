import React from 'react';
import { View, StyleSheet } from 'react-native';
import { DropdownMenu } from './DropdownMenu';

export const DropdownMenuExample = () => {
  const handleOptionSelect = (optionId: string) => {
    console.log('✅ Opção selecionada:', optionId);
  };

  return (
    <View style={styles.container}>
      <DropdownMenu 
        buttonText="Menu" 
        submenuWidth={110} // Largura customizada para mobile
        onOptionSelect={handleOptionSelect}
        onOpen={() => console.log('📂 Menu aberto')}
        onClose={() => console.log('📁 Menu fechado')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default DropdownMenuExample; 