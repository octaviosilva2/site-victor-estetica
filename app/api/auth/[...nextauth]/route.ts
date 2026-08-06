import { handlers } from "@/auth";

// As rotas de login e de retorno do Google. Ficam fora dos route groups porque
// o Auth.js espera este caminho exato, e porque não são página — não passam por
// layout nenhum e não carregam nada do site.
//
// No domínio do site institucional este caminho responde 404, por decisão do
// `middleware.ts`: o login só existe no subdomínio do painel.
export const { GET, POST } = handlers;
