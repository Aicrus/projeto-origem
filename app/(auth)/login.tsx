import { useState } from 'react';
import { TextInput, Pressable, ActivityIndicator, Platform, Keyboard, View, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/ThemeContext';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/useToast';
import { Eye, EyeOff } from 'lucide-react-native';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const { currentTheme } = useTheme();
  const { width } = useWindowDimensions();
  const isDesktopOrTablet = width >= 768;
  const isDark = currentTheme === 'dark';
  const { signIn, isLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();

  const handleLogin = async () => {
    try {
      // Validação dos campos obrigatórios
      if (!email || !senha) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      await signIn({ email, password: senha });
    } catch (error) {
      // Erro tratado pelo contexto de autenticação
    }
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.key === 'Enter') {
      handleLogin();
    }
  };

  const handlePressOutside = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  return (
    <View 
      className={`flex-1 ${isDark ? 'bg-gray-800' : 'bg-gray-100'}`}
      onTouchStart={handlePressOutside}
    >
      <View className="flex-1 flex-row">
        <View className={`flex-1 justify-center items-center p-6 ${isDesktopOrTablet ? 'max-w-[50%]' : ''}`}>
          <Text className={`text-2xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Bem-vindo de volta!
          </Text>
          
          <Text className={`text-base text-center mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Entre com suas credenciais para acessar sua conta
          </Text>

          <View className="w-full max-w-[400px] mb-4 relative">
            <TextInput
              className={`w-full h-12 rounded-md px-4 shadow-sm border ${
                isDark 
                  ? 'bg-gray-900 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
              placeholder="E-mail"
              placeholderTextColor={isDark ? '#9ca3af' : '#9ca3af'}
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
              onKeyPress={handleKeyPress}
              style={Platform.OS === 'web' ? { outline: 'none' as 'none' } : {}}
            />
          </View>

          <View className="w-full max-w-[400px] mb-4 relative">
            <TextInput
              className={`w-full h-12 rounded-md px-4 shadow-sm border ${
                isDark 
                  ? 'bg-gray-900 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
              placeholder="Senha"
              placeholderTextColor={isDark ? '#9ca3af' : '#9ca3af'}
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!showPassword}
              editable={!isLoading}
              onKeyPress={handleKeyPress}
              textContentType="password"
              autoComplete="current-password"
              style={Platform.OS === 'web' ? { outline: 'none' as 'none' } : {}}
            />
            <Pressable 
              onPress={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3 p-1"
            >
              {showPassword ? (
                <EyeOff size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
              ) : (
                <Eye size={20} color={isDark ? '#9ca3af' : '#9ca3af'} />
              )}
            </Pressable>
          </View>

          <Pressable
            className={`w-full max-w-[400px] h-12 rounded-md justify-center items-center mt-4 ${
              isLoading 
                ? 'opacity-70' 
                : isHovered ? 'opacity-80' : 'opacity-100'
            } ${isDark ? 'bg-blue-600' : 'bg-blue-500'}`}
            onPress={handleLogin}
            disabled={isLoading}
            onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
            onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Entrar
              </Text>
            )}
          </Pressable>

          <View className="flex-row items-center mt-6">
            <Text className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Ainda não tem uma conta?{' '}
            </Text>
            <Link href="/register" asChild>
              <Pressable 
                disabled={isLoading}
                onHoverIn={() => Platform.OS === 'web' && setIsLinkHovered(true)}
                onHoverOut={() => Platform.OS === 'web' && setIsLinkHovered(false)}
              >
                <Text 
                  className={`text-base font-semibold ${
                    isDark ? 'text-blue-400' : 'text-blue-600'
                  } ${isLinkHovered ? 'opacity-80' : 'opacity-100'}`}
                >
                  Cadastre-se
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>

        {isDesktopOrTablet && (
          <View className="flex-1 bg-blue-500">
            <View className="flex-1 justify-center items-center">
              <Text className="text-white text-2xl font-bold">Bem-vindo ao App</Text>
              <Text className="text-white text-center mt-2 px-8">
                Uma plataforma simples e eficiente para gerenciar seus projetos
              </Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
} 