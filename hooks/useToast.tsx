import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import { Toast, ToastPosition, ToastType } from '@/components/AicrusComponents/toast';

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
}

interface ToastState {
  visible: boolean;
  message: string;
  description?: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
  closable: boolean;
}

const ToastContext = createContext<ToastContextData>({} as ToastContextData);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState>({
    visible: false,
    message: '',
    description: '',
    type: 'info',
    position: 'bottom-right',
    duration: 3000,
    closable: false,
  });

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
    position = 'bottom-right',
    duration = 3000,
    closable = false 
  }: ShowToastParams) => {
    setToast({
      visible: true,
      type,
      message,
      description,
      position,
      duration,
      closable,
    });
  }, []);

  const hideToast = useCallback(() => {
    setToast(state => ({ ...state, visible: false }));
  }, []);

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