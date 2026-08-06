import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

// Autenticação do PAINEL do cliente. Não tem relação nenhuma com o site
// institucional, que continua sendo estático e público.
//
// O que existe aqui: login com a conta Google e uma lista de permissão de um
// único endereço. Não há senha definida por nós, não há cadastro e não há
// recuperação — isso está registrado como fora do escopo em 05, seção 12.4.
//
// Os escopos pedidos ao Google são apenas `openid`, `email` e `profile`, que é
// o padrão do provedor. O login serve para saber QUEM entrou; nada da conta
// Google do cliente é lido. Registrado em E0.9 de `13-evidencias.md`.

/**
 * O único endereço que pode ver o painel.
 *
 * É uma variável e não uma constante no código de propósito: trocar quem tem
 * acesso não pode exigir deploy. Um endereço só — mais de um usuário está
 * declarado fora do escopo em 05, seção 12.4.
 */
function emailAutorizado(): string | undefined {
  return process.env.PAINEL_EMAIL_AUTORIZADO?.trim().toLowerCase() || undefined;
}

/**
 * Decide se um endereço pode entrar.
 *
 * Se a variável não estiver cadastrada, **ninguém** entra. Falhar fechado é
 * deliberado: uma variável ausente por engano abriria o painel do cliente para
 * qualquer conta Google do mundo, e o erro só apareceria depois.
 */
export function temAcesso(email: string | null | undefined): boolean {
  const autorizado = emailAutorizado();
  if (!autorizado || !email) return false;
  return email.trim().toLowerCase() === autorizado;
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],

  // A aplicação responde em `dados.victorfolster.com.br`, que não é o domínio
  // que a hospedagem anuncia sozinha na variável de sistema. Sem confiar no
  // host da requisição, o endereço de retorno do login é montado errado e o
  // Google recusa a volta. O middleware só deixa o painel responder nos dois
  // hostnames conhecidos, então confiar no host aqui não amplia superfície.
  trustHost: true,

  // Sem banco de dados: a sessão vive num cookie assinado por AUTH_SECRET.
  // O adaptador de banco seria a única razão para o painel precisar de
  // infraestrutura própria, e não há por quê — há um usuário só.
  session: { strategy: "jwt" },

  pages: {
    signIn: "/painel/entrar",
    // A tela de erro é a mesma da entrada: ela lê o motivo pela URL e explica
    // em português. A tela padrão do Auth.js é em inglês e fala de "provider".
    error: "/painel/entrar",
  },

  callbacks: {
    /**
     * Primeira das duas travas. Barra a criação da sessão quando o endereço
     * não é o autorizado — quem não passa aqui nunca chega a ter cookie.
     *
     * A segunda trava é `exigirAcesso()` em `lib/painel/sessao.ts`, executada
     * a cada carregamento de página. Duas porque esta aqui roda uma vez, no
     * login, e a lista de permissão pode mudar depois que a sessão existe.
     */
    signIn({ profile }) {
      // `email_verified` vem do Google no perfil OpenID. Um endereço não
      // verificado não prova posse da caixa, e a lista de permissão é por
      // endereço.
      if (profile && profile.email_verified === false) return false;
      return temAcesso(profile?.email);
    },
  },
});
