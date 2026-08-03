// Injeta um bloco de dados estruturados na página.
// Renderiza no servidor, então o Google lê no primeiro acesso — sem depender de JS.

export default function JsonLd({ data }: { data: object | object[] }) {
  const payload = Array.isArray(data) ? data : [data];

  return (
    <>
      {payload.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          // O conteúdo é nosso, gerado em lib/seo.ts — não vem de entrada do usuário.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item) }}
        />
      ))}
    </>
  );
}
