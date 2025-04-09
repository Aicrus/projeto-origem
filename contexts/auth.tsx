import { createContext, useContext, useEffect, useState } from 'react';
import { Platform } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { supabase } from '@/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { useToast } from '@/hooks/useToast';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Tipos
type AuthContextData = {
  session: Session | null;
  isLoading: boolean;
  isInitialized: boolean;
  signUp: (data: { email: string; password: string; name: string }) => Promise<void>;
  signIn: (data: { email: string; password: string }) => Promise<void>;
  signOut: () => Promise<void>;
  checkEmailExists: (email: string) => Promise<boolean>;
};

// Criação do contexto
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialized, setIsInitialized] = useState(false);
  const router = useRouter();
  const segments = useSegments();
  const { showToast } = useToast();

  // Função para verificar e atualizar a sessão
  const checkAndUpdateSession = async () => {
    try {
      const { data: { session: currentSession }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Erro ao verificar sessão:', error);
        setSession(null);
        return;
      }

      // Se a sessão mudou, atualiza
      if (JSON.stringify(currentSession) !== JSON.stringify(session)) {
        setSession(currentSession);
      }
    } catch (error) {
      console.error('Erro ao verificar sessão:', error);
      setSession(null);
    } finally {
      setIsLoading(false);
      setIsInitialized(true);
    }
  };

  // Efeito para verificação inicial da sessão e navegação
  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        // Mantém o loading até ter certeza do estado
        setIsLoading(true);

        // Verifica a sessão antes de qualquer coisa
        const { data: { session: currentSession }, error } = await supabase.auth.getSession();

        if (!isMounted) return;

        if (error) {
          console.error('Erro ao verificar sessão:', error);
          setSession(null);
        } else {
          setSession(currentSession);
        }

        // Marca como inicializado antes de remover o loading
        setIsInitialized(true);

        // Pequeno delay antes de remover o loading para garantir que tudo está pronto
        setTimeout(() => {
          if (isMounted) {
            setIsLoading(false);
          }
        }, 100);

      } catch (error) {
        console.error('Erro ao verificar sessão:', error);
        if (isMounted) {
          setSession(null);
          setIsInitialized(true);
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      isMounted = false;
    };
  }, []);

  // Efeito para navegação baseada no estado da sessão
  useEffect(() => {
    // Só executa quando já estiver inicializado e não estiver carregando
    if (!isInitialized || isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';
    const shouldBeInAuth = !session;

    // Se está na rota errada, navega
    if (shouldBeInAuth && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (!shouldBeInAuth && inAuthGroup) {
      // Quando temos sessão mas estamos na tela de auth, vamos para home diretamente
      router.replace('/(tabs)/home');
    }
  }, [isInitialized, isLoading, session, segments]);

  // Efeito para monitorar mudanças na sessão
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {      
      if (event === 'SIGNED_IN') {
        setSession(newSession);
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
      } else if (event === 'TOKEN_REFRESHED') {
        setSession(newSession);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!session) return;

    // Verifica a existência da conta a cada 5 minutos
    const checkInterval = setInterval(async () => {
      try {
        const { data: user, error } = await supabase.auth.getUser();
        
        if (error || !user) {
          console.error('Erro ao verificar usuário:', error);
          showToast({
            type: 'info',
            message: 'Conta não encontrada',
            description: 'Sua conta foi excluída. Você será desconectado.',
          });
          
          await signOut();
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    }, 5 * 60 * 1000); // 5 minutos

    return () => {
      clearInterval(checkInterval);
    };
  }, [session]);

  const signUp = async ({ email, password, name }: { email: string; password: string; name: string }) => {
    try {
      setIsLoading(true);
      
      // Validação dos campos
      if (!email || !password || !name) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
        });
        return;
      }

      // Validação do nome
      if (name.trim().length < 3) {
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

      if (password.length < 6) {
        showToast({
          type: 'warning',
          message: 'Senha muito curta',
          description: 'A senha deve ter pelo menos 6 caracteres.',
        });
        return;
      }
      
      const emailLowerCase = email.toLowerCase().trim();

      // Método 1: Verificação através da tentativa de login fictício
      // (Mantido como fallback e para compatibilidade)
      const { error: checkError } = await supabase.auth.signInWithPassword({
        email: emailLowerCase,
        password: 'dummy-password-for-check',
      });

      // Método 2: Verificação direta com a API admin (mais confiável)
      // Tenta criar um usuário com signUp mas sem auto-confirmar
      const { data: checkData, error: signUpCheckError } = await supabase.auth.signUp({
        email: emailLowerCase,
        password: Math.random().toString(36).substring(2, 15), // Senha aleatória para o teste
        options: {
          emailRedirectTo: Platform.OS === 'web' ? window.location.origin : undefined
        }
      });

      // Se o erro for null e identities estiver vazio OU o erro indicar que o email já existe
      const emailExists = (
        (!signUpCheckError && checkData?.user?.identities?.length === 0) || 
        signUpCheckError?.message?.includes('email already exists') ||
        signUpCheckError?.message?.includes('already registered') ||
        (!checkError || !checkError.message.includes('Invalid login credentials'))
      );

      if (emailExists) {
        showToast({
          type: 'info',
          message: 'Email já cadastrado',
          description: 'Uma conta com este email já existe. Por favor, faça login.',
        });
        
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 1500);
        return;
      }

      // Cria o usuário (nova tentativa com os dados corretos)
      const { data, error } = await supabase.auth.signUp({
        email: emailLowerCase,
        password,
        options: {
          data: {
            name,
            display_name: name,
          },
          emailRedirectTo: Platform.OS === 'web' ? window.location.origin : undefined
        }
      });

      if (error) {
        console.error('Erro no cadastro:', error);

        if (error.message?.toLowerCase().includes('password')) {
          showToast({
            type: 'error',
            message: 'Senha inválida',
            description: 'A senha deve ter pelo menos 6 caracteres.',
          });
          return;
        }

        if (error.message?.toLowerCase().includes('email')) {
          showToast({
            type: 'error',
            message: 'Email inválido',
            description: 'Por favor, insira um email válido.',
          });
          return;
        }

        showToast({
          type: 'error',
          message: 'Erro no cadastro',
          description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        });
        return;
      }

      // Verifica se o email precisa de confirmação
      if (data?.user?.identities?.length === 0) {
        showToast({
          type: 'info',
          message: 'Email já cadastrado',
          description: 'Uma conta com este email já existe. Por favor, faça login.',
        });
        
        setTimeout(() => {
          router.replace('/(auth)/login');
        }, 1500);
        return;
      }

      // Sucesso no cadastro
      showToast({
        type: 'success',
        message: 'Cadastro realizado!',
        description: 'Use suas credenciais para fazer login.',
      });

      setTimeout(() => {
        router.replace('/(auth)/login');
      }, 1500);
    } catch (error) {
      console.error('Erro no cadastro:', error);
      showToast({
        type: 'error',
        message: 'Erro no cadastro',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async ({ email, password }: { email: string; password: string }) => {
    try {
      setIsLoading(true);
      
      // Validação dos campos
      if (!email || !password) {
        showToast({
          type: 'warning',
          message: 'Campos obrigatórios',
          description: 'Por favor, preencha todos os campos.',
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
      
      const emailLowerCase = email.toLowerCase().trim();

      console.log("Iniciando tentativa de login com:", emailLowerCase);
      
      // Limpa qualquer possível toast de erro anterior
      // que poderia estar aparecendo indevidamente
      
      // Tenta fazer login - não use await aqui para evitar race conditions
      const loginPromise = supabase.auth.signInWithPassword({
        email: emailLowerCase,
        password,
      });
      
      // Dá um pequeno tempo para processar e evitar race conditions
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Agora espera a resposta
      const { data, error } = await loginPromise;
      
      console.log("Resposta do login:", { 
        sucesso: !!data?.session, 
        erro: error ? error.message : "Nenhum" 
      });

      // Trata erro explícito da API
      if (error) {
        console.error('Erro no login:', error);

        if (error.message === 'Invalid login credentials') {
          showToast({
            type: 'error',
            message: 'Credenciais inválidas',
            description: 'Email ou senha incorretos.',
          });
          return;
        }

        if (error.message?.toLowerCase().includes('email')) {
          showToast({
            type: 'error',
            message: 'Email inválido',
            description: 'Por favor, insira um email válido.',
          });
          return;
        }

        showToast({
          type: 'error',
          message: 'Erro no login',
          description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        });
        return;
      }

      // Se chegou aqui, não houve erro e o login pode ter sido bem-sucedido
      // Verifica explicitamente se temos uma sessão
      if (!data?.session) {
        console.error('Login sem sessão válida:', data);
        showToast({
          type: 'error',
          message: 'Erro no login',
          description: 'Não foi possível iniciar sua sessão. Tente novamente.',
        });
        return;
      }
      
      // Login bem-sucedido! Atualiza a sessão e mostra mensagem de sucesso
      console.log("Login bem-sucedido! Atualizando sessão e navegando...");
      setSession(data.session);
      
      showToast({
        type: 'success',
        message: 'Login realizado!',
        description: 'Bem-vindo de volta!',
      });

      // Navega diretamente para a home após um breve delay
      setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 100);

    } catch (error) {
      console.error('Erro inesperado no login:', error);
      showToast({
        type: 'error',
        message: 'Erro no login',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoading(true);

      // Lista de chaves que podem conter tokens do Supabase
      const storageKeys = [
        'supabase.auth.token',
        'supabase.auth.refreshToken',
        'supabase.auth.session',
        'sb-' + process.env.EXPO_PUBLIC_SUPABASE_URL + '-auth-token',
        'supabase.auth.expires_at',
        'supabase.auth.provider_token',
        'supabase.auth.provider_refresh_token'
      ];

      // Limpa o storage primeiro (web e nativo)
      if (Platform.OS === 'web') {
        // Para web, limpa localStorage
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.auth') || key.startsWith('sb-')) {
            try {
              localStorage.removeItem(key);
            } catch (e) {
              console.error(`Erro ao remover ${key}:`, e);
            }
          }
        });
      } else {
        // Para nativo, limpa AsyncStorage
        await Promise.all(
          storageKeys.map(async (key) => {
            try {
              await AsyncStorage.removeItem(key);
            } catch (e) {
              console.error(`Erro ao remover ${key}:`, e);
            }
          })
        );
      }

      // Remove outros dados persistentes
      await AsyncStorage.removeItem('@user_data');
      
      // Chama o signOut do Supabase
      const { error } = await supabase.auth.signOut();

      if (error) {
        console.error('Erro ao sair:', error);
        showToast({
          type: 'error',
          message: 'Erro ao sair',
          description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
        });
      } else {
        // Limpa o estado explicitamente
        setSession(null);
      }

      // A navegação acontece automaticamente no efeito de sessão
    } catch (error) {
      console.error('Erro ao sair:', error);
      showToast({
        type: 'error',
        message: 'Erro ao sair',
        description: 'Ocorreu um erro inesperado. Por favor, tente novamente.',
      });
      
      // Garante que o estado seja limpo mesmo em caso de erro
      setSession(null);
    } finally {
      setIsLoading(false);
    }
  };

  const checkEmailExists = async (email: string): Promise<boolean> => {
    try {
      // Método 1: Tentativa de login fictício
      const { error: checkError } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: 'dummy-password-for-check',
      });

      // Método 2: Tentativa de criar usuário temporário
      const { data, error: signUpCheckError } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: Math.random().toString(36).substring(2, 15), // Senha aleatória
        options: {
          emailRedirectTo: Platform.OS === 'web' ? window.location.origin : undefined
        }
      });

      // 1. A tentativa de login não retornou erro específico de credenciais inválidas OU
      // 2. O signup não deu erro mas identities está vazio OU
      // 3. Mensagem de erro indica que email já existe
      const userExists = (
        (!checkError || !checkError.message?.includes('Invalid login credentials')) ||
        (!signUpCheckError && data?.user?.identities?.length === 0) || 
        !!signUpCheckError?.message?.includes('email already exists') ||
        !!signUpCheckError?.message?.includes('already registered')
      );

      return Boolean(userExists);
    } catch (error) {
      console.error('Erro ao verificar existência do email:', error);
      return false;
    }
  };

  // Loading screen
  if (!isInitialized || isLoading) {
    return (
      <View 
        style={{ 
          flex: 1, 
          backgroundColor: '#fff',
          justifyContent: 'center',
          alignItems: 'center'
        }} 
      >
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{
      session,
      isLoading,
      isInitialized,
      signUp,
      signIn,
      signOut,
      checkEmailExists,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook personalizado
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 