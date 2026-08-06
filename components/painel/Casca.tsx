"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { PERIODOS, type OpcaoPeriodo, type Periodo } from "@/lib/painel/periodo";

// A casca da aplicação: barra lateral escura fixa, barra superior grudada no
// topo, gaveta no celular e alternância de tema.
//
// Copiada da demonstração (`MATERIAL/demonstracao/index.html`), com duas
// diferenças deliberadas:
//
// 1. **Nenhuma marca de agência.** O topo da barra lateral leva o nome do
//    CLIENTE, que vem de `lib/painel/instancia.ts` por propriedade — nenhum
//    nome próprio está escrito neste arquivo.
// 2. **Nenhum botão de IA.** A demonstração tem `.y-launch` abrindo um chat de
//    análises. Fora por decisão do Octavio: o painel não afirma o que não
//    mediu.
//
// É componente de cliente porque três coisas exigem navegador: a gaveta, a
// borda que a barra superior ganha ao rolar, e o tema em `localStorage`. O
// conteúdo das páginas continua sendo renderizado no servidor e entra por
// `children` — nada de dado do Analytics atravessa a fronteira do cliente.

export type ItemNav = {
  href: string;
  rotulo: string;
  /** Rótulo do grupo a que este item pertence, em maiúsculas na barra. */
  grupo: string;
  icone: React.ReactNode;
};

const ICONES = {
  geral: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="2" stroke="currentColor" />
      <rect x="14" y="3" width="7" height="7" rx="2" stroke="currentColor" />
      <rect x="3" y="14" width="7" height="7" rx="2" stroke="currentColor" />
      <rect x="14" y="14" width="7" height="7" rx="2" stroke="currentColor" />
    </svg>
  ),
  acoes: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M8 11V6a2 2 0 1 1 4 0v4-2a2 2 0 1 1 4 0v3-1a2 2 0 1 1 4 0v5c0 4-3 6-7 6h-1c-3 0-5-2-7-5l-2-3a2 2 0 0 1 3-2l2 2"
        stroke="currentColor"
        strokeLinecap="round"
      />
    </svg>
  ),
  interesse: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 20s-7-4.3-7-10a4 4 0 0 1 7-2.7A4 4 0 0 1 19 10c0 5.7-7 10-7 10Z"
        stroke="currentColor"
      />
    </svg>
  ),
  ads: (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 18V9m5 9V5m5 13v-6m5 6V3" stroke="currentColor" strokeLinecap="round" />
    </svg>
  ),
} as const;

/** As quatro páginas do painel, na ordem em que aparecem na barra lateral. */
export const PAGINAS: ItemNav[] = [
  { href: "/painel", rotulo: "Visão geral", grupo: "Acompanhar", icone: ICONES.geral },
  {
    href: "/painel/acoes",
    rotulo: "Ações comerciais",
    grupo: "Acompanhar",
    icone: ICONES.acoes,
  },
  {
    href: "/painel/interesse",
    rotulo: "Interesse e público",
    grupo: "Acompanhar",
    icone: ICONES.interesse,
  },
  { href: "/painel/ads", rotulo: "Google Ads", grupo: "Investimento", icone: ICONES.ads },
];

/** Iniciais do nome do cliente, para o quadrado da conta. `Dr. Victor` → `VF`. */
function iniciais(nome: string): string {
  const partes = nome
    .replace(/^(Dr|Dra|Sr|Sra)\.?\s+/i, "")
    .split(/\s+/)
    .filter(Boolean);
  return (partes[0]?.[0] ?? "") + (partes[partes.length - 1]?.[0] ?? "");
}

export default function Casca({
  cliente,
  subtitulo,
  usuario,
  periodo,
  meses,
  sair,
  children,
}: {
  cliente: string;
  subtitulo: string;
  /** E-mail de quem está lendo. Aparece no pé da barra lateral. */
  usuario: string;
  periodo: Periodo;
  meses: OpcaoPeriodo[];
  /** O formulário de encerrar sessão. Vem pronto do servidor — `signOut` é
      ação de servidor e não pode ser declarada num componente de cliente. */
  sair: React.ReactNode;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const caminho = usePathname();
  const [menuAberto, setMenuAberto] = useState(false);
  const [rolou, setRolou] = useState(false);
  const [tema, setTema] = useState<"light" | "dark">("light");
  const dica = useRef<HTMLDivElement>(null);

  const paginaAtual = PAGINAS.find((p) => p.href === caminho) ?? PAGINAS[0];

  // Estado inicial do tema. O script do layout já pintou a tela antes da
  // hidratação; aqui só sincronizamos o botão com o que ele decidiu.
  useEffect(() => {
    const atual = document.documentElement.dataset.theme;
    setTema(atual === "dark" ? "dark" : "light");
  }, []);

  // A barra superior ganha borda quando a página sai do topo — é o que separa
  // o cabeçalho do conteúdo sem desenhar uma linha permanente.
  useEffect(() => {
    const aoRolar = () => setRolou(window.scrollY > 4);
    aoRolar();
    window.addEventListener("scroll", aoRolar, { passive: true });
    return () => window.removeEventListener("scroll", aoRolar);
  }, []);

  // Trava a rolagem do corpo enquanto a gaveta estiver aberta no celular.
  useEffect(() => {
    document.body.classList.toggle("nav-open", menuAberto);
    return () => document.body.classList.remove("nav-open");
  }, [menuAberto]);

  // Fecha a gaveta a cada troca de página: no celular ela cobre o conteúdo, e
  // quem clicou num item quer ver o item, não a lista de novo.
  useEffect(() => {
    setMenuAberto(false);
  }, [caminho]);

  // Balão flutuante para tudo o que tem `data-tip`. Um só ouvinte no
  // documento, e não um por elemento: os gráficos têm dezenas de alvos.
  //
  // **Isto é atalho, nunca a única via.** O mesmo texto existe escrito no
  // glossário ao pé de cada página, porque em celular não há ponteiro para
  // passar por cima e uma explicação que só aparece no hover não existe para
  // metade dos leitores.
  useEffect(() => {
    const balao = dica.current;
    if (!balao) return;

    const mostrar = (evento: Event) => {
      const alvo = (evento.target as HTMLElement | null)?.closest<HTMLElement>("[data-tip]");
      if (!alvo) return;
      balao.textContent = alvo.dataset.tip ?? "";
      const caixa = alvo.getBoundingClientRect();
      balao.classList.add("show");
      const largura = balao.offsetWidth;
      balao.style.left = `${Math.min(
        Math.max(caixa.left + caixa.width / 2 - largura / 2, 8),
        window.innerWidth - largura - 8,
      )}px`;
      balao.style.top = `${Math.max(caixa.top - balao.offsetHeight - 8, 8)}px`;
    };

    const esconder = () => balao.classList.remove("show");

    document.addEventListener("mouseover", mostrar);
    document.addEventListener("mouseout", esconder);
    document.addEventListener("focusin", mostrar);
    document.addEventListener("focusout", esconder);
    return () => {
      document.removeEventListener("mouseover", mostrar);
      document.removeEventListener("mouseout", esconder);
      document.removeEventListener("focusin", mostrar);
      document.removeEventListener("focusout", esconder);
    };
  }, []);

  function trocarTema() {
    const novo = tema === "dark" ? "light" : "dark";
    setTema(novo);
    document.documentElement.dataset.theme = novo;
    // Falha em silêncio de propósito: em navegação privada de alguns
    // navegadores gravar aqui lança, e perder a preferência é um problema
    // menor do que derrubar o painel.
    try {
      localStorage.setItem("painel-tema", novo);
    } catch {}
  }

  function irPara(destino: string) {
    router.push(`${destino}?periodo=${periodo.chave}`);
  }

  // Grupos na ordem de primeira aparição, sem repetir rótulo.
  const grupos = PAGINAS.reduce<{ nome: string; itens: ItemNav[] }[]>((acumulado, item) => {
    const grupo = acumulado.find((g) => g.nome === item.grupo);
    if (grupo) grupo.itens.push(item);
    else acumulado.push({ nome: item.grupo, itens: [item] });
    return acumulado;
  }, []);

  return (
    <div className="app">
      <aside
        className={`sidebar${menuAberto ? " open" : ""}`}
        id="sidebar"
        aria-label="Navegação do painel"
      >
        {/* O topo leva o cliente. Nenhuma marca de agência na tela. */}
        <div className="brand">
          <div className="brand-mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none">
              <path
                d="M5 17.5 10.7 6l3.1 6.1L16 8l3 9.5"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="brand-copy">
            <strong>{cliente}</strong>
            <span>{subtitulo}</span>
          </div>
        </div>

        <div className="account">
          <div className="account-logo" aria-hidden="true">
            {iniciais(cliente)}
          </div>
          <div>
            <strong>Site do consultório</strong>
            <span>Conta única</span>
          </div>
        </div>

        {grupos.map((grupo) => (
          <div key={grupo.nome}>
            <div className="nav-label">{grupo.nome}</div>
            <nav className="nav-list">
              {grupo.itens.map((item) => (
                <button
                  key={item.href}
                  type="button"
                  className="nav-button"
                  aria-current={item.href === caminho ? "page" : undefined}
                  onClick={() => irPara(item.href)}
                >
                  {item.icone}
                  {item.rotulo}
                </button>
              ))}
            </nav>
          </div>
        ))}

        <div className="sidebar-bottom">
          <div className="health">
            <i />
            Leitura atualizada a cada 12 horas
          </div>
          <div className="user">
            <div className="avatar" aria-hidden="true">
              {usuario.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <strong>{usuario}</strong>
              <span>Acesso autorizado</span>
            </div>
          </div>
          {sair}
        </div>
      </aside>

      <div
        className={`menu-backdrop${menuAberto ? " open" : ""}`}
        onClick={() => setMenuAberto(false)}
        aria-hidden="true"
      />

      <main className="main">
        <header className={`topbar${rolou ? " scrolled" : ""}`}>
          <div className="crumb">
            <button
              type="button"
              className="icon-btn menu-btn"
              aria-label="Abrir menu"
              aria-controls="sidebar"
              aria-expanded={menuAberto}
              onClick={() => setMenuAberto((aberto) => !aberto)}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeLinecap="round" />
              </svg>
            </button>
            <span>{cliente}</span>
            <i>/</i>
            <strong>{paginaAtual.rotulo}</strong>
          </div>

          <div className="top-actions">
            {/* O seletor de período. As opções são as mesmas de antes — esta
                troca é de aparência, não de comportamento: quem escolhe o
                recorte continua sendo `lib/painel/periodo.ts`. */}
            <select
              className="period"
              aria-label="Selecionar período"
              value={periodo.chave}
              onChange={(evento) =>
                router.push(`${caminho}?periodo=${evento.target.value}`)
              }
            >
              {PERIODOS.map((opcao) => (
                <option key={opcao.chave} value={opcao.chave}>
                  {opcao.rotulo}
                </option>
              ))}
              <optgroup label="Escolher um mês">
                {meses.map((mes) => (
                  <option key={mes.chave} value={mes.chave}>
                    {mes.rotulo}
                  </option>
                ))}
              </optgroup>
            </select>

            <button
              type="button"
              className="icon-btn"
              onClick={trocarTema}
              aria-label={tema === "dark" ? "Usar tema claro" : "Usar tema escuro"}
            >
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20 15.2A8 8 0 1 1 8.8 4 6.5 6.5 0 0 0 20 15.2Z"
                  stroke="currentColor"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </header>

        <div className="content">{children}</div>
      </main>

      <div className="tooltip" ref={dica} role="status" aria-live="polite" />
    </div>
  );
}
