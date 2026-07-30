import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getPageSeo } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";

/** Marca as tags gerenciadas aqui, para poder trocá-las na navegação. */
const MANAGED = "data-seo-managed";

type MetaKey = { attr: "name" | "property"; key: string };

const upsertMeta = ({ attr, key }: MetaKey, content: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    el.setAttribute(MANAGED, "");
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

const upsertLink = (rel: string, href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", rel);
    el.setAttribute(MANAGED, "");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

/**
 * Sincroniza o <head> com a rota atual.
 *
 * As páginas estáticas geradas no build já vêm com as tags corretas no HTML
 * (ver scripts/prerender.mjs); este componente cobre a navegação no cliente,
 * quando o HTML não é recarregado.
 */
const Seo = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = getPageSeo(pathname);

    document.title = seo.title;
    upsertMeta({ attr: "name", key: "description" }, seo.description);
    upsertMeta({ attr: "name", key: "robots" }, seo.robots);
    upsertLink("canonical", seo.canonical);

    upsertMeta({ attr: "property", key: "og:type" }, seo.ogType);
    upsertMeta({ attr: "property", key: "og:site_name" }, siteConfig.professional.name);
    upsertMeta({ attr: "property", key: "og:locale" }, "pt_BR");
    upsertMeta({ attr: "property", key: "og:url" }, seo.canonical);
    upsertMeta({ attr: "property", key: "og:title" }, seo.title);
    upsertMeta({ attr: "property", key: "og:description" }, seo.description);
    upsertMeta({ attr: "property", key: "og:image" }, seo.ogImage);

    upsertMeta({ attr: "name", key: "twitter:card" }, "summary_large_image");
    upsertMeta({ attr: "name", key: "twitter:title" }, seo.title);
    upsertMeta({ attr: "name", key: "twitter:description" }, seo.description);
    upsertMeta({ attr: "name", key: "twitter:image" }, seo.ogImage);

    // JSON-LD: remove o da rota anterior antes de inserir o novo.
    document.head.querySelectorAll(`script[type="application/ld+json"][${MANAGED}]`).forEach((el) => {
      el.remove();
    });

    if (seo.jsonLd.length > 0) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute(MANAGED, "");
      script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": seo.jsonLd });
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
};

export default Seo;
