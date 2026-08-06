import { redirect } from "next/navigation";

import { auth, signIn, temAcesso } from "@/auth";
import { INSTANCIA } from "@/lib/painel/instancia";

// Tela de entrada do painel.
//
// É também a tela de erro do Auth.js (`pages.error` em `auth.ts`). A tela padrão
// da biblioteca é em inglês e fala em "provider" e "callback" — o cliente não
// tem por que entender esses termos, e um erro sem explicação vira telefonema.
//
// **Nenhuma marca de agência.** O título era "Painel Escale IA" até 06/08. Quem
// abre esta tela é o cliente, e o que ele precisa reconhecer é o próprio nome.

export const metadata = {
  title: { absolute: `Entrar — Painel ${INSTANCIA.cliente}` },
};

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
    <div className="entrada">
      <div className="entrada-caixa">
        <span className="entrada-simbolo" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="none">
            <path
              d="M5 17.5 10.7 6l3.1 6.1L16 8l3 9.5"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <h1>{INSTANCIA.cliente}</h1>
        <p>
          {INSTANCIA.subtitulo}. O acesso é restrito a uma conta Google
          autorizada.
        </p>

        {aviso ? <p className="erro">{aviso}</p> : null}

        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/painel" });
          }}
        >
          <button type="submit" className="botao">
            Entrar com a conta Google
          </button>
        </form>

        <p style={{ marginTop: 18, fontSize: 10.5 }}>
          Pedimos ao Google apenas o seu nome e endereço de e-mail, para saber quem
          está entrando. Nada da sua conta é lido.
        </p>
      </div>
    </div>
  );
}
