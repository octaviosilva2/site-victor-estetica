import { useEffect } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Seo from "@/components/Seo";
import Index from "./pages/Index";
import ProcedurePage from "./pages/ProcedurePage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

/** Sobe para o topo ao trocar de rota, exceto quando a URL tem âncora. */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) return;
    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
};

/**
 * Árvore compartilhada entre o navegador e o build estático. O router fica
 * fora daqui: no cliente é BrowserRouter, no prerender é StaticRouter.
 */
export const AppRoutes = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Seo />
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/procedimentos/:slug" element={<ProcedurePage />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      {/* Os toasters do scaffold foram removidos da árvore: nada no site
          dispara toast, e carregá-los só engordava o bundle. Os componentes
          seguem em components/ui caso um dia sejam necessários. */}
    </TooltipProvider>
  </QueryClientProvider>
);

const App = () => (
  <BrowserRouter>
    <AppRoutes />
  </BrowserRouter>
);

export default App;
