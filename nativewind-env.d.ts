/// <reference types="nativewind/types" />

// React Native tem suporte para className embutido
import 'react-native';

declare module 'react-native' {
  interface ViewProps {
    className?: string;
  }
  interface TextProps {
    className?: string;
  }
  interface ImageProps {
    className?: string;
  }
}

// Adicione outras interfaces conforme necessário para seus componentes 