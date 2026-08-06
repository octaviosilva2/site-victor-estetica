import { redirect } from "next/navigation";

import { auth, signIn, temAcesso } from "@/auth";

// Tela de entrada do painel.
//
// É também a tela de erro do Auth.js (`pages.error` em `auth.ts`). A tela
// padrão da biblioteca é em inglês e fala em "provider" e "callback" — o
// cliente não tem por que entender esses termos, e um erro sem explicação vira
// telefonema.

export const metadata = { title: { absolute: "Entrar — Painel Dr. Victor Folster" } };

/** Traduz os motivos que podem chegar pela URL. */
function mensagem(motivo: string | undefined): string | null {
  switch (motivo) {
    // Nosso: sessão válida, mas o endereço deixou de estar na lista.
    case "sem-acesso":
    // Do Auth.js: o callback `signIn` recusou o endereço.
    case "AccessDenied":
      return "Esta conta Google não tem acesso ao painel. Entre com a conta cadastrada — se você acredita que deveria ter acesso, fale com o Octavio.";
    case "Configuration":
      return "O acesso está temporariamente indisponível por um problema de configuração. Avise o Octavio.";
    case "Verification":
      return "O link de entrada expirou. Tente entrar de novo.";
    default:
      return motivo ? "Não foi possível entrar. Tente de novo." : null;
  }
}

export default async function Entrar({
  searchParams,
}: {
  searchParams: Promise<{ motivo?: string; error?: string }>;
}) {
  const { motivo, error } = await searchParams;

  // Quem já entrou e está autorizado não precisa ver esta tela.
  const sessao = await auth();
  if (temAcesso(sessao?.user?.email)) {
    redirect("/painel");
  }

  const aviso = mensagem(motivo ?? error);

  return (
    <div className="pnl-entrada">
      <div className="pnl-entrada-caixa">
        <h1>Painel de resultados</h1>
        <p>
          Os números do site do Dr. Victor Folster. O acesso é restrito a uma
          conta Google.
        </p>

        {aviso ? <p className="pnl-erro">{aviso}</p> : null}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/painel" });
          }}
        >
          <button type="submit" className="pnl-botao">
            Entrar com a conta Google
          </button>
        </form>

        <p style={{ marginTop: 18, marginBottom: 0, fontSize: 12 }}>
          Pedimos ao Google apenas o seu nome e endereço de e-mail, para saber
          quem está entrando. Nada da sua conta é lido.
        </p>
      </div>
    </div>
  );
}
