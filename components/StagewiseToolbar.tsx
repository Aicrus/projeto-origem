import React, { useEffect } from 'react';
import { Platform } from 'react-native';

// Configuração do stagewise
const stagewiseConfig = {
  plugins: []
};

// Singleton pattern para controlar a inicialização do toolbar
class StagewiseManager {
  private static instance: StagewiseManager;
  private initialized = false;
  private toolbarRoot: any = null;

  static getInstance(): StagewiseManager {
    if (!StagewiseManager.instance) {
      StagewiseManager.instance = new StagewiseManager();
    }
    return StagewiseManager.instance;
  }

  async initializeToolbar(): Promise<void> {
    // Só executar na web durante desenvolvimento
    if (process.env.NODE_ENV !== 'development' || Platform.OS !== 'web') {
      return;
    }

    // Se já foi inicializado, não fazer nada
    if (this.initialized) {
      console.log('StagewiseToolbar já inicializado via singleton');
      return;
    }

    // Verificar se já existe no DOM
    const existingElement = document.getElementById('stagewise-toolbar-root');
    if (existingElement) {
      console.log('StagewiseToolbar já existe no DOM');
      this.initialized = true;
      return;
    }

    try {
      // Marcar como inicializado antes de começar
      this.initialized = true;

      // Importar dinamicamente
      const { StagewiseToolbar } = await import('@stagewise/toolbar-react');
      const { createRoot } = await import('react-dom/client');

      // Verificar novamente se não foi criado durante os imports
      const existingAfterImport = document.getElementById('stagewise-toolbar-root');
      if (existingAfterImport) {
        console.log('StagewiseToolbar criado durante import');
        return;
      }

      // Criar elemento
      const toolbarElement = document.createElement('div');
      toolbarElement.id = 'stagewise-toolbar-root';
      document.body.appendChild(toolbarElement);

      // Criar root e renderizar
      this.toolbarRoot = createRoot(toolbarElement);
      this.toolbarRoot.render(React.createElement(StagewiseToolbar, { config: stagewiseConfig }));
      
      console.log('StagewiseToolbar inicializado com sucesso na web');
    } catch (error) {
      console.warn('Erro ao inicializar StagewiseToolbar:', error);
      this.initialized = false;
    }
  }

  cleanup(): void {
    // Não fazer cleanup para manter o toolbar durante toda a sessão
    // O toolbar deve persistir entre navegações
  }
}

export const StagewiseToolbar: React.FC = () => {
  useEffect(() => {
    const manager = StagewiseManager.getInstance();
    manager.initializeToolbar();

    return () => {
      // Não fazer cleanup para evitar recriações
    };
  }, []);

  // Não renderizar nada no componente principal
  return null;
}; 