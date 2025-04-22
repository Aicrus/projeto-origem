import { useState, useRef } from 'react';
import { Pressable, Platform, Keyboard, View, Text, TouchableWithoutFeedback, Image, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useTheme } from '@/hooks/ThemeContext';
import { useWindowDimensions } from 'react-native';
import { useAuth } from '@/contexts/auth';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/AicrusComponents/input';
import { Button } from '@/components/AicrusComponents/button';
import { UserRound } from 'lucide-react-native';

export default function Register() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  
  // Adicionando as referências para os campos
  const emailRef = useRef<any>(null);
  const senhaRef = useRef<any>(null);
  const confirmarSenhaRef = useRef<any>(null);
  
  const { currentTheme } = useTheme();
  const { width, height } = useWindowDimensions();
  const { signUp, isLoading, checkEmailExists } = useAuth();
  const { showToast } = useToast();
  const router = useRouter();
  const isDark = currentTheme === 'dark';
  const isDesktopOrTablet = width >= 768;

  const handleRegister = async () => {
    try {
      // Validações básicas
      if (!nome || !email || !senha || !confirmarSenha) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      // Validação do nome
      if (nome.trim().length < 3) {
        showToast({
          type: 'warning',
          message: 'Nome inválido',
          description: 'O nome deve ter pelo menos 3 caracteres.',
        });
        return;
      }

      // Validação do email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showToast({
          type: 'warning',
          message: 'Email inválido',
          description: 'Por favor, digite um endereço de email válido.',
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
        description: 'Sua conta foi criada com sucesso. Verifique seu email para confirmação.',
      });
      
      // Navega para a tela de login após um pequeno delay para o usuário ver a mensagem de sucesso
      setTimeout(() => {
        router.replace('/login');
      }, 1500);
    } catch (error: any) {
      // Tratamento de erros conforme implementação existente
      console.error('Erro detalhado no cadastro:', error);
      
      // Se chegou aqui, é um erro não mapeado
      showToast({
        type: 'error',
        message: 'Não foi possível criar sua conta',
        description: 'Por favor, verifique seus dados e tente novamente.',
      });
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
          {/* Imagem lateral (visível apenas em desktop/tablet) */}
          <View style={styles.imageSection}>
            <Image
              source={require('@/assets/images/placeholder-img.png')}
              style={styles.fullImage}
              resizeMode="cover"
            />
          </View>

          {/* Formulário de cadastro */}
          <View style={styles.formSection}>
            <View style={styles.formContainer}>
              {/* Títulos */}
              <Text className={`text-headline-md font-jakarta-bold mb-2 ${isDark ? 'text-text-primary-dark' : 'text-text-primary-light'}`}>
                Crie sua conta
              </Text>
              
              <Text className={`text-body-md font-jakarta-regular mb-8 ${isDark ? 'text-text-secondary-dark' : 'text-text-secondary-light'}`}>
                Preencha seus dados para começar
              </Text>

              {/* Campo de nome */}
              <View className="mb-4">
                <Input
                  label="Nome completo"
                  value={nome}
                  onChangeText={setNome}
                  placeholder="Digite seu nome completo"
                  autoCapitalize="words"
                  disabled={isLoading}
                  returnKeyType="next"
                  onSubmitEditing={() => emailRef.current?.focus()}
                  autoComplete="name"
                />
              </View>

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
                  returnKeyType="next"
                  onSubmitEditing={() => senhaRef.current?.focus()}
                  autoComplete="email"
                />
              </View>

              {/* Campo de senha */}
              <View className="mb-4">
                <Input
                  label="Senha"
                  value={senha}
                  onChangeText={setSenha}
                  placeholder="Digite sua senha"
                  type="password"
                  disabled={isLoading}
                  returnKeyType="next"
                  onSubmitEditing={() => confirmarSenhaRef.current?.focus()}
                  autoComplete="new-password"
                />
              </View>

              {/* Campo de confirmar senha */}
              <View className="mb-6">
                <Input
                  label="Confirmar senha"
                  value={confirmarSenha}
                  onChangeText={setConfirmarSenha}
                  placeholder="Confirme sua senha"
                  type="password"
                  disabled={isLoading}
                  returnKeyType="go"
                  onSubmitEditing={handleRegister}
                  autoComplete="new-password"
                />
              </View>

              {/* Botão de cadastro */}
              <Button
                variant="primary"
                onPress={handleRegister}
                disabled={isLoading}
                loading={isLoading}
                loadingText="Cadastrando..."
                fullWidth
                leftIcon={<UserRound size={18} color="#FFFFFF" />}
              >
                Criar conta
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

              {/* Link para login */}
              <View className="flex-row justify-center mt-4">
                <Text className={`text-body-md ${isDark ? 'text-text-primary-dark' : 'text-text-primary-light'}`}>
                  Já tem uma conta?{' '}
                </Text>
                <Link href="/login" asChild>
                  <Pressable>
                    <Text className={`text-body-md font-jakarta-semibold ${isDark ? 'text-primary-dark' : 'text-primary-light'}`}>
                      Faça login
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
} 