/**
 * Exportação do componente HoverableView
 * 
 * O HoverableView é um componente para criar elementos interativos com efeitos de hover:
 * 
 * PRINCIPAIS RECURSOS:
 * - Suporte a tema claro/escuro automático
 * - Diversos efeitos de hover personalizáveis (escala, movimento, rotação)
 * - Totalmente responsivo e multiplataforma (iOS, Android, Web)
 * - Transições suaves com animações configuráveis
 * 
 * PERSONALIZAÇÃO:
 * O componente pode ser totalmente personalizado através das props:
 * 
 * Efeitos de Hover:
 * - hoverScale: Escala ao passar o mouse (1 = sem escala)
 * - hoverTranslateX: Deslocamento horizontal ao passar o mouse
 * - hoverTranslateY: Deslocamento vertical ao passar o mouse
 * - hoverRotate: Rotação ao passar o mouse (em graus)
 * - hoverElevation: Elevação/sombra adicional ao passar o mouse
 * 
 * Opções de personalização:
 * - disableHoverBackground: Desativa a mudança de cor de fundo no hover
 * - disableAnimation: Desativa todas as animações
 * - animationDuration: Duração da animação em milissegundos
 * 
 * Cores:
 * - hoverColor: Cor personalizada para o estado de hover
 * - activeColor: Cor personalizada para o estado ativo
 * - backgroundColor: Cor de fundo padrão
 * 
 * Estados:
 * - isActive: Indica se o elemento está em estado ativo/selecionado
 * 
 * Exemplos de uso:
 * ```tsx
 * // HoverableView básico
 * <HoverableView className="p-4 rounded-md">
 *   <Text>Passe o mouse aqui para ver o efeito!</Text>
 * </HoverableView>
 * 
 * // HoverableView com efeito de escala
 * <HoverableView 
 *   hoverScale={1.05} 
 *   className="p-4 rounded-md bg-gray-100"
 * >
 *   <Text>Este elemento aumenta ao passar o mouse</Text>
 * </HoverableView>
 * 
 * // HoverableView com efeito de movimento e rotação
 * <HoverableView 
 *   hoverTranslateX={5}
 *   hoverTranslateY={-3}
 *   hoverRotate={2}
 *   className="p-4 rounded-md bg-blue-100" 
 * >
 *   <Text>Este elemento se move e gira levemente</Text>
 * </HoverableView>
 * 
 * // HoverableView com estado ativo
 * <HoverableView 
 *   isActive={itemSelected}
 *   activeColor="#E8DEF8"
 *   className="p-4 rounded-md"
 * >
 *   <Text>Este elemento tem um estado ativo</Text>
 * </HoverableView>
 * ```
 * 
 * Para mais detalhes, consulte a documentação completa no arquivo HoverableView.tsx
 */

import { HoverableView } from './HoverableView';
export type { HoverableViewProps } from './HoverableView';

export { HoverableView }; 