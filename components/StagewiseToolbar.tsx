import React, { useEffect, useState } from 'react';
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
    if (typeof document !== 'undefined' && document.getElementById('stagewise-toolbar-root')) {
      return;
    }

    let mounted = true;

    const initializeToolbar = () => {
      // Usar setTimeout para evitar problemas com Metro Runtime
      setTimeout(async () => {
        try {
          // Verificar se ainda estamos montados e se o documento existe
          if (!mounted || typeof document === 'undefined') {
            return;
          }

          // Verificar novamente se não foi criado
          if (document.getElementById('stagewise-toolbar-root')) {
            return;
          }

          // Tentar carregar dinamicamente apenas se necessário
          const loadStagewise = async () => {
            try {
              const stagewiseModule = await import('@stagewise/toolbar-react');
              const reactDomModule = await import('react-dom/client');
              
              if (!mounted) return;

              const { StagewiseToolbar } = stagewiseModule;
              const { createRoot } = reactDomModule;

              // Criar elemento
              const toolbarElement = document.createElement('div');
              toolbarElement.id = 'stagewise-toolbar-root';
              document.body.appendChild(toolbarElement);

              // Criar root e renderizar
              const root = createRoot(toolbarElement);
              root.render(React.createElement(StagewiseToolbar, { config: { plugins: [] } }));
              
              console.log('StagewiseToolbar inicializado com sucesso');
            } catch (error) {
              console.warn('StagewiseToolbar não disponível:', error);
            }
          };

          await loadStagewise();
        } catch (error) {
          console.warn('Erro ao inicializar StagewiseToolbar:', error);
        }
      }, 100);
    };

    initializeToolbar();

    return () => {
      mounted = false;
    };
  }, [isClient]);

  // Não renderizar nada
  return null;
};
