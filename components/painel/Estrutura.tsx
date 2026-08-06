import { signOut } from "@/auth";
import Casca from "@/components/painel/Casca";
import { INSTANCIA } from "@/lib/painel/instancia";
import { mesesDisponiveis, type Periodo } from "@/lib/painel/periodo";

// A ponte entre o servidor e a casca.
//
// Existe por um motivo só: `signOut` é ação de servidor e não pode ser
// declarada dentro de um componente marcado `"use client"`. Então o formulário
// nasce aqui, no servidor, e desce para a `Casca` como propriedade — o padrão
// de "slot" do App Router.
//
// Também é aqui que a identidade do cliente entra na tela, e em nenhum outro
// lugar: `INSTANCIA` é a única fonte de nome próprio no painel inteiro.

export default function Estrutura({
  usuario,
  periodo,
  children,
}: {
  usuario: string;
  periodo: Periodo;
  children: React.ReactNode;
}) {
  return (
    <Casca
      cliente={INSTANCIA.cliente}
      subtitulo={INSTANCIA.subtitulo}
      usuario={usuario}
      periodo={periodo}
      meses={mesesDisponiveis()}
      sair={
        <form
          action={async () => {
            "use server";
            await signOut({ redirectTo: "/painel/entrar" });
          }}
        >
          <button type="submit" className="sair">
            Encerrar sessão
          </button>
        </form>
      }
    >
      {children}
    </Casca>
  );
}
