import React, { createContext, useContext, useState, useCallback } from 'react';
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