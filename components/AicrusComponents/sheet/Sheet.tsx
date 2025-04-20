import React, { useRef, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Animated, Dimensions, Platform } from 'react-native';
import { useColorScheme } from '../../../components/hooks/useColorScheme';
import { colors } from '../constants/theme';

export type SheetPosition = 'top' | 'right' | 'bottom' | 'left';

export interface SheetProps {
  isOpen: boolean;
  onClose: () => void;
  position?: SheetPosition;
  children?: React.ReactNode;
  overlayOpacity?: number;
  height?: number | string;
  width?: number | string;
  borderRadius?: number;
  closeOnOverlayClick?: boolean;
  showCloseButton?: boolean;
  animationDuration?: number;
  testID?: string;
}

const Sheet: React.FC<SheetProps> = ({
  isOpen,
  onClose,
  position = 'bottom',
  children,
  overlayOpacity = 0.5,
  height = '350px',
  width = '350px',
  borderRadius = 16,
  closeOnOverlayClick = true,
  showCloseButton = false,
  animationDuration = 300,
  testID,
}) => {
  const theme = useColorScheme();
  const animation = useRef(new Animated.Value(0)).current;
  const windowWidth = Dimensions.get('window').width;
  const windowHeight = Dimensions.get('window').height;
  const [dimensions, setDimensions] = useState({ width: windowWidth, height: windowHeight });
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions({ width: window.width, height: window.height });
    });

    return () => subscription.remove();
  }, []);

  // Usar sempre a posição original, sem forçar 'bottom' em dispositivos móveis
  const finalPosition = position;

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      Animated.timing(animation, {
        toValue: 1,
        duration: animationDuration,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(animation, {
        toValue: 0,
        duration: animationDuration,
        useNativeDriver: true,
      }).start(() => {
        // Só esconde o modal depois que a animação de fechamento terminar
        setVisible(false);
      });
    }
  }, [isOpen, animation, animationDuration]);

  // Configurações de animação e estilo com base na posição
  const getAnimatedStyle = () => {
    const translateValue = animation.interpolate({
      inputRange: [0, 1],
      outputRange: [getInitialTranslate(), 0],
    });

    const animationStyle = {
      top: finalPosition === 'top' ? { transform: [{ translateY: translateValue }] } : undefined,
      bottom: finalPosition === 'bottom' ? { transform: [{ translateY: translateValue }] } : undefined,
      left: finalPosition === 'left' ? { transform: [{ translateX: translateValue }] } : undefined,
      right: finalPosition === 'right' ? { transform: [{ translateX: translateValue }] } : undefined,
    };

    return animationStyle[finalPosition];
  };

  const getInitialTranslate = () => {
    switch (finalPosition) {
      case 'top':
        return -1000;
      case 'bottom':
        return 1000;
      case 'left':
        return -1000;
      case 'right':
        return 1000;
      default:
        return 0;
    }
  };

  // Estilo do container com base na posição
  const getContainerStyle = () => {
    const isVertical = finalPosition === 'top' || finalPosition === 'bottom';
    const isHorizontal = finalPosition === 'left' || finalPosition === 'right';

    // Valores padrão baseados na posição
    const containerStyle: any = {
      width: isVertical ? '100%' : typeof width === 'number' ? width : width,
      height: isHorizontal ? '100%' : typeof height === 'number' ? height : height,
    };

    // Ajustes de borda baseados na posição
    switch (finalPosition) {
      case 'top':
        containerStyle.borderBottomLeftRadius = borderRadius;
        containerStyle.borderBottomRightRadius = borderRadius;
        break;
      case 'bottom':
        containerStyle.borderTopLeftRadius = borderRadius;
        containerStyle.borderTopRightRadius = borderRadius;
        break;
      case 'left':
        containerStyle.borderTopRightRadius = borderRadius;
        containerStyle.borderBottomRightRadius = borderRadius;
        break;
      case 'right':
        containerStyle.borderTopLeftRadius = borderRadius;
        containerStyle.borderBottomLeftRadius = borderRadius;
        break;
      default:
        break;
    }

    return containerStyle;
  };

  const getPositionStyle = () => {
    switch (finalPosition) {
      case 'top':
        return styles.topContainer;
      case 'right':
        return styles.rightContainer;
      case 'bottom':
        return styles.bottomContainer;
      case 'left':
        return styles.leftContainer;
      default:
        return styles.bottomContainer;
    }
  };

  const overlayAnimatedStyle = {
    opacity: animation.interpolate({
      inputRange: [0, 1],
      outputRange: [0, overlayOpacity],
    }),
  };

  // Se não estiver visível nem aberto, não renderize nada
  if (!visible && !isOpen) return null;

  return (
    <Modal
      transparent
      visible={visible}
      onRequestClose={onClose}
      animationType="none"
      testID={testID}
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[styles.overlay, overlayAnimatedStyle]}
          testID={`${testID}-overlay`}
        >
          <TouchableOpacity
            style={styles.overlayTouchable}
            onPress={closeOnOverlayClick ? onClose : undefined}
            activeOpacity={1}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.content,
            getPositionStyle(),
            getContainerStyle(),
            getAnimatedStyle(),
            {
              backgroundColor: theme.isDark
                ? colors.gray[800]
                : colors.white,
            },
          ]}
          testID={`${testID}-content`}
        >
          {showCloseButton && (
            <TouchableOpacity
              style={styles.closeButton}
              onPress={onClose}
              testID={`${testID}-close-button`}
            >
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          )}
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.black,
  },
  overlayTouchable: {
    flex: 1,
  },
  content: {
    position: 'absolute',
    backgroundColor: colors.white,
    overflow: 'hidden',
  },
  topContainer: {
    top: 0,
    left: 0,
    right: 0,
  },
  rightContainer: {
    top: 0,
    right: 0,
    bottom: 0,
  },
  bottomContainer: {
    bottom: 0,
    left: 0,
    right: 0,
  },
  leftContainer: {
    top: 0,
    left: 0,
    bottom: 0,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Sheet; 