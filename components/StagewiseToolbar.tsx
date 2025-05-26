import React, { useEffect } from 'react';
import { Platform } from 'react-native';

// Configuração do stagewise
const stagewiseConfig = {
  plugins: []
};

export const StagewiseToolbar: React.FC = () => {
  useEffect(() => {
    // Só executar no desenvolvimento e na plataforma web
    if (process.env.NODE_ENV === 'development' && Platform.OS === 'web') {
      // Importação dinâmica para evitar problemas em outras plataformas
      import('@stagewise/toolbar-react').then(({ StagewiseToolbar }) => {
        // Criar um elemento separado para o toolbar
        const toolbarElement = document.createElement('div');
        toolbarElement.id = 'stagewise-toolbar-root';
        document.body.appendChild(toolbarElement);

        // Renderizar o toolbar em um root separado usando React 18
        import('react-dom/client').then(({ createRoot }) => {
          const root = createRoot(toolbarElement);
          root.render(React.createElement(StagewiseToolbar, { config: stagewiseConfig }));
        });
      }).catch((error) => {
        console.warn('Erro ao carregar stagewise toolbar:', error);
      });
    }

    return () => {
      // Cleanup: remover o elemento do toolbar ao desmontar
      if (Platform.OS === 'web') {
        const toolbarElement = document.getElementById('stagewise-toolbar-root');
        if (toolbarElement) {
          toolbarElement.remove();
        }
      }
    };
  }, []);

  // Não renderizar nada no componente principal
  return null;
}; 