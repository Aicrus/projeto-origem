import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform, StyleSheet } from 'react-native';
import { Toast, ToastPosition, ToastType } from '@/components/toasts/Toast';

interface ToastContextData {
  showToast: (params: ShowToastParams) => void;
}

interface ShowToastParams {
  type: ToastType;
  message: string;
  description?: string;
  position?: ToastPosition;
  duration?: number;
  closable?: boolean;
  showProgressBar?: boolean;
}

interface ToastState {
  visible: boolean;
  message: string;
  description?: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
  closable: boolean;
  showProgressBar: boolean;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    description: '',
    type: 'info',
    position: Platform.OS === 'web' ? 'bottom-right' : 'top', // Por padrão, topo para mobile
    duration: 3000,
    closable: false,
    showProgressBar: true,
  });

  const isNative = Platform.OS !== 'web';

  // Inicializa o container do portal para web
  useEffect(() => {
    if (Platform.OS === 'web') {
      // Cria o container para o portal do Toast, se ainda não existir
      const existingContainer = document.getElementById('toast-portal-container');
      if (!existingContainer) {
        const portalContainer = document.createElement('div');
        portalContainer.id = 'toast-portal-container';
        portalContainer.style.position = 'fixed';
        portalContainer.style.zIndex = '9999';
        portalContainer.style.pointerEvents = 'none';
        portalContainer.style.top = '0';
        portalContainer.style.left = '0';
        portalContainer.style.right = '0';
        portalContainer.style.bottom = '0';
        document.body.appendChild(portalContainer);
      }
    }

    // Cleanup na desmontagem
    return () => {
      if (Platform.OS === 'web') {
        const container = document.getElementById('toast-portal-container');
        if (container) {
          document.body.removeChild(container);
        }
      }
    };
  }, []);

  const showToast = useCallback(({ 
    type, 
    message, 
    description, 
    position = Platform.OS === 'web' ? 'bottom-right' : 'top', // Padrão para nativo é top
    duration = 3000,
    closable = false,
    showProgressBar = true 
  }: ShowToastParams) => {
    // Para ambiente nativo, limitamos as posições a top e bottom
    let finalPosition = position;
    if (isNative) {
      finalPosition = position.includes('top') ? 'top' : 'bottom';
    }
    
    setToast({
      visible: true,
      type,
      message,
      description,
      position: finalPosition,
      duration,
      closable,
      showProgressBar,
    });
  }, [isNative]);

  const hideToast = useCallback(() => {
    setToast(state => ({ ...state, visible: false }));
  }, []);

  // Como estamos usando o Portal, não precisamos mais do wrapper View
  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={toast.visible}
        type={toast.type}
        message={toast.message}
        description={toast.description}
        position={toast.position}
        duration={toast.duration}
        closable={toast.closable}
        showProgressBar={toast.showProgressBar}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }

  return context;
} 