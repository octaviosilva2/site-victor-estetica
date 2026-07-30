import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { procedures } from "@/lib/procedures";
import { procedurePath, TARGET_CITY } from "@/lib/seo";
import { siteConfig } from "@/lib/siteConfig";
import ScheduleButton from "@/components/ScheduleButton";
import WhatsAppButton from "@/components/WhatsAppButton";
import NotFound from "@/pages/NotFound";

/**
 * Página própria de cada procedimento (/procedimentos/:slug).
 *
 * Antes isso era um overlay, que não gerava URL nenhuma — ou seja, 12
 * páginas invisíveis para busca. Agora cada procedimento tem endereço
 * próprio, título, descrição e dados estruturados, mantendo a entrada
 * deslizando da direita que foi aprovada no layout.
 */
const ProcedurePage = () => {
  const { slug } = useParams<{ slug: string }>();
  const procedure = procedures.find((p) => p.slug === slug);

  if (!procedure) return <NotFound />;

  const others = procedures.filter((p) => p.slug !== procedure.slug).slice(0, 6);

  return (
    <div className="min-h-screen animate-slide-in-right bg-background">
      <header className="sticky top-0 z-30 flex items-center gap-3.5 bg-primary px-5 py-4 text-white">
        <Link
          to="/#procedimentos"
          aria-label="Voltar para a lista de procedimentos"
          className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-white text-white transition-colors hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <h1 className="font-serif text-[19px] font-normal">{procedure.title}</h1>
      </header>

      <main className="mx-auto max-w-[40rem] px-6 pb-16 pt-7">
        <nav aria-label="Você está em" className="mb-5 text-[11px] text-foreground-muted">
          <Link to="/" className="hover:text-primary">
            Início
          </Link>
          <span aria-hidden="true"> › </span>
          <Link to="/#procedimentos" className="hover:text-primary">
            Procedimentos
          </Link>
          <span aria-hidden="true"> › </span>
          <span className="text-primary">{procedure.title}</span>
        </nav>

        <p className="eyebrow m-0 mb-4">{`Procedimento · ${TARGET_CITY} – SC`}</p>

        <p className="mb-7 text-[15px] leading-[1.7] text-foreground-muted">{procedure.detail}</p>

        <dl className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            { label: "Duração do efeito", value: procedure.duracao },
            { label: "Indicado para", value: procedure.indicado },
            { label: "Sessões", value: procedure.sessoes },
            { label: "Recuperação", value: procedure.recuperacao },
          ].map((info) => (
            <div key={info.label} className="rounded-[2px] border border-border bg-white p-4">
              <dt className="mb-1.5 text-[10.5px] font-bold uppercase tracking-[0.08em] text-primary">
                {info.label}
              </dt>
              <dd className="m-0 text-[13.5px] italic leading-[1.5] text-foreground-muted">
                {info.value}
              </dd>
            </div>
          ))}
        </dl>

        <h2 className="mb-3.5 mt-8 font-serif text-[16px] font-normal text-primary">
          {`Benefícios d${procedure.article} ${procedure.title}`}
        </h2>
        <ul className="m-0 list-none p-0">
          {procedure.beneficios.map((benefit) => (
            <li
              key={benefit}
              className="relative border-t border-border py-2.5 pl-5 text-[14px] text-foreground-muted"
            >
              <span aria-hidden="true" className="absolute left-0 font-bold text-primary">
                —
              </span>
              {benefit}
            </li>
          ))}
        </ul>

        <h2 className="mb-3.5 mt-8 font-serif text-[16px] font-normal text-primary">
          Como é feito, passo a passo
        </h2>
        <ol className="m-0 flex list-none flex-col gap-2.5 p-0">
          {procedure.passos.map((step, index) => (
            <li key={step.title} className="flex gap-3 rounded-[2px] border border-border bg-white p-3.5">
              <span
                aria-hidden="true"
                className="flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-white"
              >
                {index + 1}
              </span>
              <span>
                <span className="mb-0.5 block text-[13.5px] font-bold text-foreground">{step.title}</span>
                <span className="block text-[13px] leading-[1.5] text-foreground-muted">
                  {step.description}
                </span>
              </span>
            </li>
          ))}
        </ol>

        <h2 className="mb-3.5 mt-8 font-serif text-[16px] font-normal text-primary">
          {`Perguntas frequentes sobre ${procedure.title}`}
        </h2>
        <dl className="m-0">
          {procedure.faq.map((item) => (
            <div key={item.question} className="border-t border-border py-3.5 last:border-b">
              <dt className="mb-1.5 text-[13.5px] font-bold">{item.question}</dt>
              <dd className="m-0 text-[13px] leading-[1.55] text-foreground-muted">{item.answer}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-9 rounded-[2px] bg-primary px-6 py-8 text-center text-white">
          <p className="eyebrow m-0 text-white/65">Próximo passo</p>
          <h2 className="mb-2.5 mt-2 font-serif text-[19px] font-normal text-white">
            Pronto para agendar sua avaliação?
          </h2>
          <p className="mb-5 text-[13.5px] leading-[1.55] text-white/75">{procedure.cta}</p>
          <ScheduleButton
            variant="light"
            message={`Olá! Gostaria de agendar uma avaliação sobre ${procedure.title} com o ${siteConfig.professional.name}.`}
          />
        </div>

        {/* Links internos: ajudam o rastreamento e a navegação entre procedimentos. */}
        <h2 className="mb-3.5 mt-12 font-serif text-[16px] font-normal text-primary">
          Outros procedimentos
        </h2>
        <ul className="m-0 grid list-none gap-2 p-0 sm:grid-cols-2">
          {others.map((other) => (
            <li key={other.slug}>
              <Link
                to={procedurePath(other.slug)}
                className="block rounded-[2px] border border-border bg-white px-4 py-3 text-[13.5px] text-foreground-muted no-underline transition-colors hover:border-primary hover:text-primary"
              >
                {other.title}
              </Link>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-center text-[13px] text-foreground-muted">
          <Link to="/" className="underline hover:text-primary">
            Voltar para a página inicial
          </Link>
        </p>
      </main>

      <WhatsAppButton />
    </div>
  );
};

export default ProcedurePage;
