import React, { useEffect } from 'react';
import { Platform } from 'react-native';

export const StagewiseToolbar: React.FC = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // Marcar que estamos no cliente
    setIsClient(true);
  }, []);

  useEffect(() => {
    // Só executar se estivermos no cliente, na web e em desenvolvimento
    if (!isClient || Platform.OS !== 'web' || process.env.NODE_ENV !== 'development') {
      return;
    }

    // Verificar se já existe
    if (document.getElementById('stagewise-toolbar-root')) {
      return;
    }

    let mounted = true;

    const initializeToolbar = async () => {
      try {
        // Import dinâmico com verificação de erro
        const [stagewiseModule, reactDomModule] = await Promise.all([
          import('@stagewise/toolbar-react').catch(() => null),
          import('react-dom/client').catch(() => null)
        ]);

        if (!mounted || !stagewiseModule || !reactDomModule) {
          return;
        }

        const { StagewiseToolbar } = stagewiseModule;
        const { createRoot } = reactDomModule;

        // Verificar novamente se não foi criado
        if (document.getElementById('stagewise-toolbar-root')) {
          return;
        }

        // Criar elemento
        const toolbarElement = document.createElement('div');
        toolbarElement.id = 'stagewise-toolbar-root';
        document.body.appendChild(toolbarElement);

        // Criar root e renderizar
        const root = createRoot(toolbarElement);
        root.render(React.createElement(StagewiseToolbar, { config: { plugins: [] } }));
        
        console.log('StagewiseToolbar inicializado com sucesso');
      } catch (error) {
        console.warn('Erro ao inicializar StagewiseToolbar:', error);
      }
    };

    initializeToolbar();

    return () => {
      mounted = false;
    };
  }, [isClient]);

  // Não renderizar nada
  return null;
}; 

function useState(arg0: boolean): [any, any] {
  throw new Error('Function not implemented.');
}
