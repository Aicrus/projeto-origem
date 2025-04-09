import React, { useEffect } from 'react';
import { Animated, Text, View } from 'react-native';
import { useTheme } from '../hooks/ThemeContext';

export type ToastType = 'success' | 'error' | 'info' | 'warning';
export type ToastPosition = 'top' | 'bottom';

interface ToastProps {
  visible: boolean;
  message: string;
  description?: string;
  type: ToastType;
  position: ToastPosition;
  duration: number;
  onHide: () => void;
}

export function Toast({
  visible,
  message,
  description,
  type,
  position,
  duration,
  onHide,
}: ToastProps) {
  const { currentTheme } = useTheme();
  const opacity = React.useRef(new Animated.Value(0)).current;
  
  const getBackgroundColor = () => {
    const isDark = currentTheme === 'dark';
    
    switch (type) {
      case 'success':
        return isDark ? 'bg-green-700' : 'bg-green-500';
      case 'error':
        return isDark ? 'bg-red-700' : 'bg-red-500';
      case 'warning':
        return isDark ? 'bg-yellow-700' : 'bg-yellow-500';
      case 'info':
      default:
        return isDark ? 'bg-blue-700' : 'bg-blue-500';
    }
  };

  useEffect(() => {
    if (visible) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start();

      const timer = setTimeout(() => {
        Animated.timing(opacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start(() => {
          onHide();
        });
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible, duration, opacity, onHide]);

  if (!visible) return null;

  return (
    <Animated.View
      style={{
        opacity,
        position: 'absolute',
        left: 16,
        right: 16,
        [position]: 50,
        zIndex: 9999,
      }}
    >
      <View className={`p-4 rounded-lg shadow-lg ${getBackgroundColor()}`}>
        <Text className="text-white font-bold">{message}</Text>
        {description ? (
          <Text className="text-white mt-1">{description}</Text>
        ) : null}
      </View>
    </Animated.View>
  );
} 