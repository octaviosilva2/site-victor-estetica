import { Link } from "react-router-dom";
import { procedures } from "@/lib/procedures";
import { procedurePath } from "@/lib/seo";
import ScheduleButton from "@/components/ScheduleButton";

/**
 * Página não encontrada. Marcada como noindex pelo componente <Seo>.
 *
 * Em vez de um beco sem saída, oferece caminhos de volta — reduz abandono e
 * distribui links internos.
 */
const NotFound = () => (
    <div className="flex min-h-screen items-center justify-center bg-background px-6 py-20">
      <div className="mx-auto max-w-xl text-center">
        <p className="eyebrow m-0">Erro 404</p>
        <h1 className="mb-4 mt-3 text-[27px] font-normal">Página não encontrada</h1>
        <p className="mb-8 text-[15px] leading-[1.6] text-foreground-muted">
          Este endereço não existe ou foi movido. Talvez você esteja procurando um destes procedimentos:
        </p>

        <ul className="mx-auto mb-9 grid list-none gap-2 p-0 text-left sm:grid-cols-2">
          {procedures.slice(0, 6).map((procedure) => (
            <li key={procedure.slug}>
              <Link
                to={procedurePath(procedure.slug)}
                className="block rounded-[2px] border border-border bg-white px-4 py-3 text-[13.5px] text-foreground-muted no-underline transition-colors hover:border-primary hover:text-primary"
              >
                {procedure.title}
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap justify-center gap-2.5">
          <ScheduleButton />
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-[2px] border border-primary px-6 py-3.5 text-[12.5px] font-semibold uppercase tracking-[0.05em] text-primary no-underline transition-colors hover:bg-primary/10"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
);

export default NotFound;
