import { useState, useRef } from 'react';
import { Pressable, Platform, Keyboard, View, Text, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/ThemeContext';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/useToast';
import { Mail } from 'lucide-react-native';
import { Input } from '@/components/AicrusComponents/input';
import { Button } from '@/components/AicrusComponents/button';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const { currentTheme } = useTheme();
  const { width, height } = useWindowDimensions();
  const isDesktopOrTablet = width >= 768;
  const isDark = currentTheme === 'dark';
  const { signIn, isLoading } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const senhaRef = useRef<any>(null);

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

      // Validação do formato do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast({
          type: 'warning',
          message: 'Email inválido',
          description: 'Por favor, digite um endereço de email válido.',
        });
        return;
      }

      await signIn({ email, password: senha });
    } catch (error) {
      // Erro tratado pelo contexto de autenticação
    }
  };

  const handlePressOutside = () => {
    if (Platform.OS !== 'web') {
      Keyboard.dismiss();
    }
  };

  // Estilos para garantir layout dinâmico
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
    },
    formSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 24,
      maxWidth: isDesktopOrTablet ? '50%' : '100%',
    },
    imageSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: isDark ? '#14181B' : '#F1F4F8',
      display: isDesktopOrTablet ? 'flex' : 'none',
    },
    formContainer: {
      width: '100%',
      maxWidth: 400,
    },
    fullImage: {
      width: '100%',
      height: '100%',
    }
  });

  return (
    <TouchableWithoutFeedback onPress={handlePressOutside}>
      <View className={isDark ? 'bg-bg-primary-dark' : 'bg-bg-primary-light'} style={{flex: 1}}>
        <View style={styles.container}>
          {/* Formulário de login */}
          <View style={styles.formSection}>
            <View style={styles.formContainer}>
              {/* Títulos */}
              <Text className={`text-headline-md font-jakarta-bold mb-2 ${isDark ? 'text-text-primary-dark' : 'text-text-primary-light'}`}>
                Bem-vindo de volta
              </Text>
              
              <Text className={`text-body-md font-jakarta-regular mb-8 ${isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}>
                Entre com suas credenciais para acessar sua conta
              </Text>

              {/* Campo de email */}
              <View className="mb-4">
                <Input
                  label="Email"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="Digite seu email"
                  type="email"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  disabled={isLoading}
                  onSubmitEditing={() => senhaRef.current?.focus()}
                  returnKeyType="next"
                  autoComplete="email"
                />
              </View>

              {/* Campo de senha */}
              <View className="mb-6">
                <Input
                  label="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Digite sua senha"
                  type="password"
                  disabled={isLoading}
                  returnKeyType="go"
                  onSubmitEditing={handleLogin}
                  autoComplete="current-password"
                />
              </View>

              {/* Esqueci minha senha */}
              <View className="flex-row justify-end mb-6">
                <Pressable>
                  <Text className={`text-body-sm font-jakarta-medium ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                    Esqueci minha senha
                  </Text>
                </Pressable>
              </View>

              {/* Botão de login */}
              <Button
                variant="primary"
                onPress={handleLogin}
                disabled={isLoading}
                loading={isLoading}
                loadingText="Entrando..."
                fullWidth
                leftIcon={<Mail size={18} color="#FFFFFF" />}
              >
                Entrar com Email
              </Button>

              {/* Separador "ou" */}
              <View className="flex-row items-center my-6">
                <View className={`flex-1 h-px ${isDark ? 'bg-divider-dark' : 'bg-divider-light'}`} />
                <Text className={`mx-4 text-body-sm ${isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}>
                  ou continue com
                </Text>
                <View className={`flex-1 h-px ${isDark ? 'bg-divider-dark' : 'bg-divider-light'}`} />
              </View>

              {/* Botões de login social */}
              <View className="flex-row justify-center space-x-4 mb-6">
                <Button
                  variant="outline"
                  onPress={() => {}}
                  isIconOnly
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                  }}
                >
                  <Image
                    source={require('@/assets/images/icon-apple.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </Button>
                
                <Button
                  variant="outline"
                  onPress={() => {}}
                  isIconOnly
                  style={{
                    borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                    borderWidth: 1,
                    backgroundColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.02)',
                    width: 44,
                    height: 44,
                    borderRadius: 8,
                  }}
                >
                  <Image
                    source={require('@/assets/images/icon-gmail.png')}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </Button>
              </View>

              {/* Link para cadastro */}
              <View className="flex-row justify-center mt-4">
                <Text className={`text-body-md ${isDark ? 'text-text-primary-dark' : 'text-text-primary-light'}`}>
                  Não tem uma conta?{' '}
                </Text>
                <Link href="/register" asChild>
                  <Pressable>
                    <Text className={`text-body-md font-jakarta-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                      Cadastre-se
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>

          {/* Imagem lateral (visível apenas em desktop/tablet) */}
          <View style={styles.imageSection}>
            <Image
              source={require('@/assets/images/placeholder-img.png')}
              style={styles.fullImage}
              resizeMode="cover"
            />
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
} 