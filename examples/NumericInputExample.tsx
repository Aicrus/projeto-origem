import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Input } from '../components/AicrusComponents/input/Input';

const NumericInputExample = () => {
  const [count, setCount] = useState('0');
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Exemplo de Input Numérico</Text>
      
      <Text style={styles.subtitle}>Input Numérico com Controles</Text>
      <Input 
        value={count}
        onChangeText={setCount}
        type="number"
        label="Quantidade"
        placeholder="0"
        keyboardType="numeric"
        min={0}
        max={100}
        step={1}
        showNumberControls={true}
        style={styles.input}
      />
      
      <Text style={styles.value}>Valor atual: {count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    maxWidth: 500,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 8,
  },
  input: {
    marginBottom: 16,
  },
  value: {
    fontSize: 16,
    marginTop: 8,
    fontWeight: '500',
  }
});

export default NumericInputExample; 