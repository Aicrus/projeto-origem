/**
 * Exportação do componente Input
 * 
 * O Input é um componente altamente personalizável que pode ser usado para diversos cenários:
 * 
 * PRINCIPAIS RECURSOS:
 * - Suporte a tema claro/escuro automático
 * - Máscaras para CPF, CNPJ, telefone, CEP, data e moeda
 * - Diferentes tipos: texto, senha, pesquisa, email, número
 * - Totalmente responsivo e multiplataforma (iOS, Android, Web)
 * 
 * PERSONALIZAÇÃO:
 * O componente pode ser totalmente personalizado através das props:
 * 
 * Opções básicas:
 * - value: Valor atual do input (obrigatório)
 * - onChangeText: Função chamada quando o valor muda (obrigatório)
 * - placeholder: Texto de placeholder
 * - label: Texto do rótulo acima do input (pode ser omitido)
 * - error: Mensagem de erro (opcional)
 * - disabled: Desabilita o input
 * 
 * Máscaras disponíveis:
 * - mask="cpf" -> 000.000.000-00
 * - mask="cnpj" -> 00.000.000/0000-00
 * - mask="phone" -> (00) 00000-0000
 * - mask="date" -> 00/00/0000
 * - mask="cep" -> 00000-000
 * - mask="currency" -> R$ 0,00
 * - mask="none" -> Sem máscara (padrão)
 * 
 * Tipos de input:
 * - type="text" -> Campo de texto padrão
 * - type="password" -> Campo de senha com botão de mostrar/ocultar
 * - type="search" -> Campo de pesquisa com ícone de lupa
 * - type="number" -> Campo para números
 * - type="email" -> Campo para email
 * 
 * Aparência:
 * - style: Estilo personalizado para o container do input
 * - inputStyle: Estilo personalizado para o campo de texto
 * 
 * Exemplos de uso:
 * ```tsx
 * // Input básico
 * <Input 
 *   value={nome} 
 *   onChangeText={setNome} 
 *   placeholder="Digite seu nome"
 *   label="Nome completo" 
 * />
 * 
 * // Input com máscara
 * <Input 
 *   value={cpf} 
 *   onChangeText={setCpf} 
 *   placeholder="000.000.000-00"
 *   label="CPF" 
 *   mask="cpf"
 *   keyboardType="numeric" 
 * />
 * 
 * // Input de pesquisa
 * <Input 
 *   value={busca}
 *   onChangeText={setBusca}
 *   type="search"
 *   placeholder="Pesquisar..."
 *   onClear={() => setBusca('')}
 * />
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo Input.tsx
 */

export { Input } from './Input';
export type { InputProps } from './Input';
export { DateInput } from './DateInput';
export type { DateInputProps } from './DateInput'; 