/**
 * Mock para @supabase/node-fetch
 * 
 * Este arquivo impede que o Supabase tente importar o node-fetch em ambiente web/móvel,
 * redirecionando para o fetch nativo.
 */

// Exportar o fetch nativo como default
export default fetch;

// Para compatibilidade com imports nomeados
export const Headers = global.Headers;
export const Request = global.Request;
export const Response = global.Response; 