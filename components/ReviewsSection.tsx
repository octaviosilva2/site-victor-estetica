import { siteConfig } from "@/lib/siteConfig";

// Avaliações reais do perfil do Google, transcritas em 2026-08-05.
//
// UMA substituição, feita em 2026-08-07: na terceira avaliação, "botox" virou
// "toxina botulínica". "Botox" é marca registrada de um fabricante específico;
// o nome técnico do procedimento é toxina botulínica, e é assim que o site o
// chama em `lib/siteData.ts` e na URL `/procedimentos/toxina-botulinica`. É a
// única palavra alterada em todo o conjunto — o restante das avaliações é
// transcrição literal do que cada paciente escreveu.
//
// O artigo e o adjetivo acompanharam por concordância ("o botox ... ficou
// maravilhoso" → "a toxina botulínica ... ficou maravilhosa"): o termo novo é
// feminino, e sem isso a frase ficaria agramatical. Nenhuma outra alteração.
//
// Por causa dessa troca, o texto da seção deixou de afirmar "transcritas na
// íntegra". As avaliações originais continuam públicas no perfil do Google,
// onde qualquer pessoa pode comparar, e a afirmação deixaria de ser verdade.
//
// NÃO há integração automática: avaliação nova que entrar no perfil não
// aparece aqui sozinha. Para atualizar, edite esta lista à mão.
//
// Publicadas sem o nome de quem avaliou, por decisão do cliente. Por isso o
// card não tem mais a linha de assinatura.
const googleReviews = [
  "Fiz uma rinomodelação com ele e amei o resultado! Superou minhas expectativas. É um profissional muito atencioso, cuidadoso e competente. Durante todo o processo e também no pós, sempre responde minhas dúvidas com rapidez e dá todo o suporte necessário. Recomendo muito! Olha esse antes e depois 😍",
  "Excelente profissional. O Victor é muito atencioso, explica tudo com clareza e passa bastante segurança no atendimento. O resultado ficou super natural e do jeito que eu queria. Recomendo muito!",
  "Amei minha experiência! 🥰 O preenchimento labial ficou super natural, exatamente como eu queria, e a toxina botulínica também ficou maravilhosa, super recomendo o Victor e a clínica Gaya pelo atendimento e atenção com seus clientes",
];

export default function ReviewsSection() {
  return (
    <section
      id="avaliacoes"
      style={{ background: "var(--bg-alt)", paddingTop: 88, paddingBottom: 88 }}
    >
      <div className="container">
        <p className="eyebrow fade">Avaliações</p>
        <h2 className="section-title fade">O que dizem no Google</h2>
        <p className="section-sub fade">
          Avaliações publicadas por pacientes no perfil do Google.
        </p>

        <div className="review-grid">
          {googleReviews.map((text, index) => (
            <div className="review-card fade" key={index}>
              <div className="review-stars" aria-label="5 de 5 estrelas">
                ★★★★★
              </div>
              <div className="review-text">&ldquo;{text}&rdquo;</div>
              <div className="review-badge">Avaliação do Google</div>
            </div>
          ))}
        </div>

        {/* data-track: lido pela medição. Não remover em refatoração.
            Este link vai para o mesmo endereço do Google Maps que o botão da
            seção de contato, e por isso cai na mesma tag de endereço. Sem o
            atributo, o evento chegava sem posição e virava "(not set)" no
            relatório — achado E0.5, corrigido em 2026-08-05. */}
        <p className="review-note fade">
          <a
            href={siteConfig.links.googleBusiness}
            target="_blank"
            rel="noopener noreferrer"
            data-track="avaliacoes"
          >
            Ver todas as avaliações no perfil do Google
          </a>
        </p>
      </div>
    </section>
  );
}
