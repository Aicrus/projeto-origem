import { useState } from 'react';
import { TextInput, Pressable, ActivityIndicator, Platform, Keyboard, View, Text } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/ThemeContext';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/useToast';
import { Eye, EyeOff } from 'lucide-react-native';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);
  const { currentTheme } = useTheme();
  const { width } = useWindowDimensions();
  const { signUp, isLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const isDark = currentTheme === 'dark';
  const isDesktopOrTablet = width >= 768;

  const handleRegister = async () => {
    try {
      // Validações
      if (!nome || !email || !senha || !confirmarSenha) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      if (senha !== confirmarSenha) {
        showToast({
          type: 'error',
          message: 'Senhas diferentes',
          description: 'As senhas não coincidem.',
        });
        return;
      }

      if (senha.length < 6) {
        showToast({
          type: 'warning',
          message: 'Senha muito curta',
          description: 'A senha deve ter pelo menos 6 caracteres.',
        });
        return;
      }

      await signUp({ email, password: senha, name: nome });
      showToast({
        type: 'success',
        message: 'Cadastro realizado!',
        description: 'Sua conta foi criada com sucesso. Faça login para continuar.',
      });
      
      // Navega para a tela de login após um pequeno delay para o usuário ver a mensagem de sucesso
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (error: any) {
      // Log detalhado do erro para debug
      console.error('Erro detalhado no cadastro:', {
        message: error.message,
        code: error.code,
        details: error.details,
        status: error.status,
        name: error.name,
        error: error
      });

      if (error.message === 'EMAIL_ALREADY_EXISTS') {
        showToast({
          type: 'info',
          message: 'Email já cadastrado',
          description: 'Uma conta com este email já existe. Por favor, faça login para acessar.',
        });
        
        setTimeout(() => {
          router.replace('/login');
        }, 2000);
        return;
      }

      // Tratamento específico para erros do Supabase
      if (error?.message?.toLowerCase().includes('invalid email') || 
          error?.message?.toLowerCase().includes('email format is invalid')) {
        showToast({
          type: 'error',
          message: 'Email inválido',
          description: 'Por favor, insira um endereço de email válido.',
        });
        return;
      }

      if (error?.message?.toLowerCase().includes('password') && 
          error?.message?.toLowerCase().includes('characters')) {
        showToast({
          type: 'error',
          message: 'Senha inválida',
          description: 'A senha deve ter pelo menos 6 caracteres.',
        });
        return;
      }

      if (error?.message?.toLowerCase().includes('network') || 
          error?.message?.toLowerCase().includes('connection') ||
          error?.code === 'NETWORK_ERROR') {
        showToast({
          type: 'error',
          message: 'Erro de conexão',
          description: 'Verifique sua conexão com a internet e tente novamente.',
        });
        return;
      }

      if (error?.message?.toLowerCase().includes('timeout')) {
        showToast({
          type: 'error',
          message: 'Tempo excedido',
          description: 'O servidor demorou para responder. Por favor, tente novamente.',
        });
        return;
      }

      if (error?.message?.toLowerCase().includes('rate limit') || 
          error?.status === 429) {
        showToast({
          type: 'error',
          message: 'Muitas tentativas',
          description: 'Por favor, aguarde alguns minutos antes de tentar novamente.',
        });
        return;
      }

      // Se chegou aqui, é um erro não mapeado
      showToast({
        type: 'error',
        message: 'Não foi possível criar sua conta',
        description: 'Por favor, verifique seus dados e tente novamente.',
      });
    }
  };

  const handleKeyPress = (e: any) => {
    if (Platform.OS === 'web' && e.key === 'Enter') {
      handleRegister();
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

        <View className={`flex-1 justify-center items-center p-6 ${isDesktopOrTablet ? 'max-w-[50%]' : ''}`}>
          <Text className={`text-2xl font-bold text-center mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Crie sua conta
          </Text>
          
          <Text className={`text-base text-center mb-8 ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
            Preencha seus dados para começar
          </Text>

          <View className="w-full max-w-[400px] mb-4 relative">
            <TextInput
              className={`w-full h-12 rounded-md px-4 shadow-sm border ${
                isDark 
                  ? 'bg-gray-900 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
              placeholder="Nome completo"
              placeholderTextColor={isDark ? '#9ca3af' : '#9ca3af'}
              value={nome}
              onChangeText={setNome}
              autoCapitalize="words"
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
              textContentType="newPassword"
              passwordRules="minlength: 6;"
              autoComplete="new-password"
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

          <View className="w-full max-w-[400px] mb-4 relative">
            <TextInput
              className={`w-full h-12 rounded-md px-4 shadow-sm border ${
                isDark 
                  ? 'bg-gray-900 text-white border-gray-700' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
              placeholder="Confirmar senha"
              placeholderTextColor={isDark ? '#9ca3af' : '#9ca3af'}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              secureTextEntry={!showConfirmPassword}
              editable={!isLoading}
              onKeyPress={handleKeyPress}
              textContentType="newPassword"
              passwordRules="minlength: 6;"
              autoComplete="new-password"
              style={Platform.OS === 'web' ? { outline: 'none' as 'none' } : {}}
            />
            <Pressable 
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-4 top-3 p-1"
            >
              {showConfirmPassword ? (
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
            onPress={handleRegister}
            disabled={isLoading}
            onHoverIn={() => Platform.OS === 'web' && setIsHovered(true)}
            onHoverOut={() => Platform.OS === 'web' && setIsHovered(false)}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-white font-semibold text-base">
                Cadastrar
              </Text>
            )}
          </Pressable>

          <View className="flex-row items-center mt-6">
            <Text className={`text-base ${isDark ? 'text-white' : 'text-gray-900'}`}>
              Já tem uma conta?{' '}
            </Text>
            <Link href="/login" asChild>
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
                  Faça login
                </Text>
              </Pressable>
            </Link>
          </View>
        </View>
      </View>
    </View>
  );
} 