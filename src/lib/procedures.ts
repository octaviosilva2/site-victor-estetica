// ============================================
// PROCEDIMENTOS — fonte única de verdade
//
// Ordem e conteúdo definidos no handoff. Os dados clínicos são
// FAIXAS DE REFERÊNCIA de literatura geral, não promessa de resultado
// individual — revisar com o Dr. Victor antes de publicar.
//
// Removidos nesta versão: Lipo de Papada Enzimática, Lipo Enzimática
// Corporal, Protocolo Reset.
// "Harmonização Facial" foi renomeada para "Reestruturação Facial".
// ============================================

export interface ProcedureStep {
  title: string;
  description: string;
}

export interface ProcedureFaq {
  question: string;
  answer: string;
}

export interface Procedure {
  /** Identificador estável para links e âncoras. */
  slug: string;
  title: string;
  /**
   * Artigo definido do nome do procedimento ("a toxina botulínica",
   * "o bioestimulador"). Usado para montar títulos em português correto.
   */
  article: "o" | "a";
  /** Linha curta, exibida no card da listagem. */
  short: string;
  /** Descrição completa, exibida na tela de detalhe. */
  detail: string;
  duracao: string;
  indicado: string;
  sessoes: string;
  recuperacao: string;
  beneficios: string[];
  passos: ProcedureStep[];
  faq: ProcedureFaq[];
  /** Texto do card "Próximo passo" na tela de detalhe. */
  cta: string;
}

export const procedures: Procedure[] = [
  {
    slug: "toxina-botulinica",
    title: "Toxina Botulínica",
    article: "a",
    short: "Suaviza linhas de expressão com efeito preventivo quando aplicada precocemente.",
    detail:
      "A toxina botulínica bloqueia temporariamente o sinal do nervo para o músculo, reduzindo a contração responsável pelas rugas dinâmicas — as que aparecem ao movimentar o rosto.",
    duracao: "3 a 6 meses",
    indicado:
      "Rugas dinâmicas (testa, glabela, pés de galinha), prevenção de marcas de expressão, bruxismo e sudorese excessiva",
    sessoes: "Sessão única; retoque a cada 3-6 meses",
    recuperacao: "Sem afastamento; pode haver leve vermelhidão nos pontos por algumas horas",
    beneficios: [
      "Suaviza rugas de expressão",
      "Efeito preventivo quando aplicada precocemente",
      "Procedimento rápido (15-30 min)",
      'Resultado natural, sem "congelar" a expressão',
    ],
    passos: [
      {
        title: "Avaliação",
        description: "Análise da musculatura facial em repouso e em movimento para definir pontos e dose.",
      },
      { title: "Marcação", description: "Demarcação dos pontos de aplicação conforme o planejamento." },
      { title: "Aplicação", description: "Injeção da toxina com agulha fina nos pontos marcados." },
      {
        title: "Orientações finais",
        description:
          "Recomendações pós-procedimento, como evitar deitar e exercícios intensos por algumas horas.",
      },
    ],
    faq: [
      {
        question: "Depois de quanto tempo o efeito aparece?",
        answer:
          "Os primeiros sinais costumam surgir entre 3 e 7 dias, com efeito completo entre 2 e 4 semanas.",
      },
      {
        question: "Dá pra fazer se eu nunca fiz antes?",
        answer:
          "Sim — inclusive de forma preventiva, com doses menores, uma das indicações mais comuns hoje.",
      },
    ],
    cta: "Entre em contato com o Dr. Victor e descubra se a toxina botulínica é o tratamento ideal para você.",
  },
  {
    slug: "bioestimulador-de-colageno",
    title: "Bioestimulador de Colágeno",
    article: "o",
    short: "Estímulo progressivo de colágeno para firmeza da pele.",
    detail:
      "Estimula os fibroblastos a produzir colágeno novo de forma gradual, em vez de preencher volume instantaneamente — resultado que evolui ao longo dos meses seguintes.",
    duracao: "12 a 24 meses (varia conforme o produto)",
    indicado: "Flacidez leve a moderada, perda de firmeza, prevenção do envelhecimento",
    sessoes: "2 a 3 sessões, intervalo de 4 a 8 semanas",
    recuperacao: "Leve inchaço ou vermelhidão por 2 a 3 dias",
    beneficios: [
      "Estímulo natural de colágeno",
      "Resultado progressivo e duradouro",
      "Melhora a firmeza e qualidade geral da pele",
      "Baixo tempo de recuperação",
    ],
    passos: [
      {
        title: "Avaliação",
        description: "Análise da qualidade da pele e do grau de flacidez para escolher o produto adequado.",
      },
      {
        title: "Anestesia tópica",
        description: "Creme anestésico por 20-30 minutos antes do procedimento.",
      },
      { title: "Aplicação", description: "Injeção do bioestimulador nas camadas indicadas da pele." },
      {
        title: "Massagem e finalização",
        description: "Distribuição uniforme do produto e orientações de cuidados.",
      },
    ],
    faq: [
      {
        question: "Por que o resultado não aparece na hora?",
        answer:
          "Porque depende da produção natural de colágeno pelo organismo, que começa em semanas e atinge o pico em alguns meses.",
      },
      {
        question: "Preciso repetir todo ano?",
        answer: "Depende do produto: alguns pedem manutenção anual, outros duram até 2 anos.",
      },
    ],
    cta:
      "Entre em contato com o Dr. Victor e descubra se o bioestimulador de colágeno é o tratamento ideal para você.",
  },
  {
    slug: "preenchimento-de-olheira",
    title: "Preenchimento de Olheira",
    article: "o",
    short: "Suaviza o sulco lacrimal e a aparência de cansaço.",
    detail:
      "Ácido hialurônico específico para a área fina da região dos olhos é injetado no sulco lacrimal, repondo volume perdido e suavizando a sombra que dá aspecto de cansaço.",
    duracao: "9 a 12 meses (área com absorção mais rápida)",
    indicado: "Sulco lacrimal (olho fundo), aspecto de cansaço por perda de volume",
    sessoes: "Sessão única; retoque conforme avaliação",
    recuperacao: "Possível leve inchaço ou hematoma por 2 a 5 dias",
    beneficios: [
      "Suaviza o aspecto de cansaço",
      "Resultado imediato e natural",
      "Técnica pouco invasiva",
      "Procedimento rápido",
    ],
    passos: [
      {
        title: "Avaliação",
        description: "Análise da profundidade do sulco e da qualidade da pele da região.",
      },
      { title: "Anestesia tópica", description: "Creme anestésico, por ser uma região sensível." },
      {
        title: "Aplicação com cânula",
        description: "Injeção do ácido hialurônico com cânula fina, reduzindo risco de hematomas.",
      },
      { title: "Finalização", description: "Massagem leve e orientações (evitar compressão na região)." },
    ],
    faq: [
      {
        question: "Fica inchado?",
        answer: "Pode haver inchaço leve nas primeiras 24-48h, que costuma ceder rápido.",
      },
      {
        question: "Corrige olheira escura por pigmentação?",
        answer:
          "Não diretamente — o preenchimento trata o sulco/volume; manchas pedem abordagem diferente, avaliada à parte.",
      },
    ],
    cta:
      "Entre em contato com o Dr. Victor e descubra se o preenchimento de olheira é o tratamento ideal para você.",
  },
  {
    slug: "reestruturacao-facial",
    title: "Reestruturação Facial",
    article: "a",
    short: "Planejamento estrutural do rosto para equilíbrio e naturalidade.",
    detail:
      "Avalia o rosto como um conjunto — não como pontos isolados — redistribuindo volume e contorno entre queixo, nariz, lábios e outras estruturas, geralmente combinando ácido hialurônico em mais de uma região.",
    duracao: "12 a 18 meses (varia por área e produto)",
    indicado: "Desequilíbrio de proporções faciais, perda de contorno, planejamento facial global",
    sessoes: "Sessão inicial de planejamento; retoques conforme avaliação",
    recuperacao: "Inchaço leve por 3 a 7 dias, variando por região",
    beneficios: [
      "Harmonia entre as estruturas do rosto",
      "Resultado natural, não pontual",
      "Planejamento individualizado",
      "Sem cirurgia",
    ],
    passos: [
      {
        title: "Avaliação global",
        description: "Análise das proporções do rosto como um todo, não só de um ponto isolado.",
      },
      {
        title: "Planejamento",
        description: "Definição de quais áreas e produtos serão usados, e em que ordem.",
      },
      {
        title: "Aplicação por etapas",
        description: "Aplicação do preenchedor nas regiões definidas, com reavaliação entre etapas.",
      },
      {
        title: "Reavaliação final",
        description: "Checagem da simetria e do resultado, com ajustes finos se necessário.",
      },
    ],
    faq: [
      {
        question: "É a mesma coisa que harmonização facial?",
        answer:
          "O princípio é parecido, mas aqui o ponto de partida é sempre a avaliação estrutural do rosto como um todo, não uma lista fixa de procedimentos.",
      },
      {
        question: "Preciso fazer tudo de uma vez?",
        answer: "Não — o planejamento pode ser dividido em etapas, conforme prioridade do paciente.",
      },
    ],
    cta:
      "Entre em contato com o Dr. Victor e descubra se a reestruturação facial é o tratamento ideal para você.",
  },
  {
    slug: "preenchimento-labial",
    title: "Preenchimento Labial",
    article: "o",
    short: "Volume e contorno labial proporcionais ao rosto, sem aspecto artificial.",
    detail:
      "Injeção de ácido hialurônico nos lábios para repor volume, definir contorno e hidratar a região.",
    duracao: "6 a 18 meses, dependendo da densidade do produto",
    indicado: "Lábios finos, assimetria labial, perda de contorno",
    sessoes: "Sessão única; retoque conforme avaliação",
    recuperacao: "Inchaço ou pequenos hematomas por 2 a 5 dias",
    beneficios: [
      "Volume e contorno proporcionais ao rosto",
      "Hidratação da região",
      "Resultado imediato",
      "Técnica ajustável (mais ou menos produto)",
    ],
    passos: [
      {
        title: "Avaliação",
        description: "Análise da anatomia labial e da proporção com o restante do rosto.",
      },
      { title: "Anestesia", description: "Tópica ou injetável, por ser uma região sensível." },
      {
        title: "Aplicação",
        description: "Injeção do ácido hialurônico com agulha ou cânula, conforme técnica escolhida.",
      },
      {
        title: "Modelagem e finalização",
        description: "Massagem para uniformizar o produto e ajustar simetria.",
      },
    ],
    faq: [
      {
        question: "Fica com aspecto artificial?",
        answer:
          "O objetivo é volume proporcional ao rosto — a quantidade é ajustada para evitar o aspecto de excesso.",
      },
      {
        question: "Dói muito?",
        answer: "Costuma ser tolerável com anestesia tópica ou injetável; varia de pessoa para pessoa.",
      },
    ],
    cta:
      "Entre em contato com o Dr. Victor e descubra se o preenchimento labial é o tratamento ideal para você.",
  },
  {
    slug: "profiloplastia",
    title: "Profiloplastia",
    article: "a",
    short: "Reequilíbrio do perfil facial — nariz, lábios e queixo — sem cirurgia.",
    detail:
      "Reequilibra nariz, lábios e queixo como um conjunto, tratando o perfil facial como um todo em vez de uma região isolada, com ácido hialurônico.",
    duracao: "12 a 18 meses",
    indicado:
      "Desequilíbrio entre nariz, lábios e queixo no perfil; queixo retraído; projeção nasal desproporcional",
    sessoes: "Sessão única; retoque conforme avaliação",
    recuperacao: "Inchaço leve por 3 a 7 dias",
    beneficios: [
      "Harmonia do perfil facial",
      "Sem cirurgia",
      "Resultado natural",
      "Planejamento conjunto das 3 áreas",
    ],
    passos: [
      {
        title: "Avaliação do perfil",
        description: "Análise da relação entre nariz, lábios e queixo, de perfil e de frente.",
      },
      { title: "Anestesia", description: "Tópica ou local nas regiões a serem tratadas." },
      {
        title: "Aplicação",
        description: "Injeção do ácido hialurônico nas 3 áreas, na ordem definida no planejamento.",
      },
      {
        title: "Reavaliação do perfil",
        description: "Checagem do equilíbrio final, de perfil e de frente.",
      },
    ],
    faq: [
      {
        question: "Substitui a rinoplastia?",
        answer:
          "Não — trata desproporções pontuais com preenchimento; mudanças estruturais maiores seguem sendo indicação cirúrgica.",
      },
      {
        question: "Por que tratar 3 áreas juntas?",
        answer:
          "Porque o desequilíbrio do perfil geralmente está na relação entre elas, não numa característica isolada.",
      },
    ],
    cta: "Entre em contato com o Dr. Victor e descubra se a profiloplastia é o tratamento ideal para você.",
  },
  {
    slug: "rinomodelacao",
    title: "Rinomodelação",
    article: "a",
    short: "Ajustes pontuais no nariz sem cirurgia.",
    detail:
      "Aplicação de ácido hialurônico no dorso, ponta ou columela do nariz para corrigir pequenas irregularidades de contorno.",
    duracao: "12 a 18 meses",
    indicado: "Desvios leves no dorso nasal, ponta pouco definida, correções pontuais pós-rinoplastia",
    sessoes: "Sessão única; retoque anual",
    recuperacao: "Leve inchaço ou hematoma por poucos dias",
    beneficios: [
      "Sem cirurgia",
      "Resultado imediato",
      "Recuperação rápida",
      "Procedimento em consultório (~30 min)",
    ],
    passos: [
      {
        title: "Avaliação do nariz",
        description: "Análise do contorno nasal e do que é possível corrigir só com preenchimento.",
      },
      { title: "Anestesia local", description: "Anestésico tópico ou local na região." },
      {
        title: "Aplicação",
        description: "Injeção do preenchedor com agulha ou cânula nos pontos definidos.",
      },
      {
        title: "Verificação da simetria",
        description: "Checagem do resultado de frente e de perfil antes de finalizar.",
      },
    ],
    faq: [
      {
        question: "Rinomodelação substitui rinoplastia?",
        answer:
          "Não em todos os casos — é indicada para correções pontuais; desvios funcionais seguem sendo cirúrgicos.",
      },
      {
        question: "É perigoso mexer no nariz com preenchimento?",
        answer:
          "Exige técnica e conhecimento anatômico específico pela vascularização da região — por isso a avaliação prévia é essencial.",
      },
    ],
    cta: "Entre em contato com o Dr. Victor e descubra se a rinomodelação é o tratamento ideal para você.",
  },
  {
    slug: "ultrassom-microfocado",
    title: "Ultrassom Microfocado",
    article: "o",
    short: "Estímulo de colágeno em profundidade para firmar a pele sem cortes.",
    detail:
      "Ondas de ultrassom focalizado atingem camadas profundas da pele, estimulando produção de colágeno sem cortes.",
    duracao: "12 a 18 meses",
    indicado: "Primeiros sinais de flacidez facial ou corporal, antes de indicação cirúrgica",
    sessoes: "Geralmente sessão única; retoque anual",
    recuperacao: "Nenhuma — retorno imediato às atividades",
    beneficios: [
      "Sem cortes nem agulhas",
      "Estímulo profundo de colágeno",
      "Sem tempo de afastamento",
      "Resultado progressivo ao longo dos meses",
    ],
    passos: [
      { title: "Avaliação", description: "Análise do grau de flacidez e das áreas a serem tratadas." },
      { title: "Gel condutor", description: "Aplicação de gel na pele para conduzir a energia do ultrassom." },
      {
        title: "Disparos por camada",
        description: "Aplicação dos disparos em diferentes profundidades da pele.",
      },
      { title: "Orientações finais", description: "O paciente já pode seguir a rotina normal." },
    ],
    faq: [
      {
        question: "Dói?",
        answer:
          "Pode haver sensação de calor ou leve desconforto pontual, sem necessidade de anestesia na maioria dos casos.",
      },
      {
        question: "Substitui um lifting cirúrgico?",
        answer:
          "Não — indicado para sinais iniciais de flacidez; casos mais avançados podem exigir avaliação cirúrgica.",
      },
    ],
    cta:
      "Entre em contato com o Dr. Victor e descubra se o ultrassom microfocado é o tratamento ideal para você.",
  },
  {
    slug: "laser-de-co2",
    title: "Laser de CO2",
    article: "o",
    short: "Renovação da textura da pele: manchas, poros e linhas finas.",
    detail:
      "O laser fracionado cria microzonas controladas de aquecimento na pele, retirando camadas danificadas e estimulando renovação e produção de colágeno.",
    duracao: "Efeito acumulativo ao longo das sessões, com manutenção conforme avaliação",
    indicado: "Manchas, textura irregular, poros dilatados, cicatrizes de acne, linhas finas",
    sessoes: "3 a 6 sessões, intervalo de 45 a 60 dias",
    recuperacao: "5 a 10 dias de vermelhidão e descamação",
    beneficios: [
      "Renovação da textura da pele",
      "Trata manchas e cicatrizes de acne",
      "Estímulo contínuo de colágeno",
      "Resultado que evolui por meses",
    ],
    passos: [
      {
        title: "Avaliação",
        description: "Análise do tipo de pele e do objetivo (manchas, cicatrizes, textura, linhas finas).",
      },
      { title: "Anestesia tópica", description: "Creme anestésico antes da sessão." },
      { title: "Aplicação do laser", description: "Disparos do laser fracionado nas áreas definidas." },
      { title: "Curativo e orientações", description: "Fotoproteção rigorosa e cremes cicatrizantes." },
    ],
    faq: [
      {
        question: "Fica com casca no rosto?",
        answer:
          "Sim — é comum uma fina crosta que descama em cerca de 5-8 dias; faz parte do processo de renovação.",
      },
      {
        question: "Posso pegar sol depois?",
        answer:
          "Não nas primeiras semanas — a fotoproteção rigorosa é essencial para evitar manchas.",
      },
    ],
    cta: "Entre em contato com o Dr. Victor e descubra se o laser de CO2 é o tratamento ideal para você.",
  },
  {
    slug: "estetica-regenerativa",
    title: "Estética Regenerativa",
    article: "a",
    short:
      "Protocolos regenerativos (bioestimuladores, GHK-Cu, PDRN, peptídeos) para renovação progressiva.",
    detail:
      "Combina ativos regenerativos — bioestimuladores, GHK-Cu, PDRN e peptídeos — que atuam na sinalização celular, estimulando fibroblastos e a regeneração natural da pele.",
    duracao: "Resultado progressivo, sustentado com protocolo contínuo",
    indicado: "Qualidade geral da pele, prevenção do envelhecimento, manutenção pós-procedimento",
    sessoes: "3 a 4 sessões, intervalo de 2 a 4 semanas",
    recuperacao: "Mínima — possível leve vermelhidão por algumas horas",
    beneficios: [
      "Base científica consolidada em alguns ativos (décadas de estudo)",
      "Atua na regeneração, não só na superfície",
      "Pode ser combinada com outros procedimentos",
      "Baixo tempo de recuperação",
    ],
    passos: [
      {
        title: "Avaliação",
        description: "Análise da qualidade da pele e definição de quais ativos fazem sentido para o caso.",
      },
      { title: "Preparo da pele", description: "Limpeza da área e, se necessário, anestesia tópica." },
      {
        title: "Aplicação dos ativos",
        description: "Aplicação combinada dos ativos regenerativos definidos no planejamento.",
      },
      { title: "Finalização", description: "Orientações de cuidados e continuidade do protocolo." },
    ],
    faq: [
      {
        question: "É a mesma coisa que PRP?",
        answer:
          "Não — este protocolo usa bioestimuladores e peptídeos como GHK-Cu e PDRN; não inclui PRP.",
      },
      {
        question: "Em quanto tempo aparece resultado?",
        answer:
          "Estudos com esses ativos mostram resposta documentada em 30 a 60 dias de protocolo consistente.",
      },
    ],
    cta:
      "Entre em contato com o Dr. Victor e descubra se a estética regenerativa é o tratamento ideal para você.",
  },
  {
    slug: "microagulhamento",
    title: "Microagulhamento",
    article: "o",
    short: "Renovação celular e estímulo de colágeno via microlesões controladas.",
    detail:
      "Microagulhas criam pequenas lesões controladas na pele, ativando o processo natural de reparo e estimulando a produção de colágeno.",
    duracao: "Estímulo de colágeno sustentado por cerca de 6 a 8 meses",
    indicado: "Textura irregular, poros dilatados, cicatrizes superficiais de acne",
    sessoes: "3 a 6 sessões, intervalo de 4 a 6 semanas",
    recuperacao: "Vermelhidão leve por 2 a 3 dias",
    beneficios: [
      "Estimula colágeno tipo I",
      "Pode ser combinado com ativos (drug delivery)",
      "Baixo tempo de recuperação",
      "Indicado para diferentes tipos de pele",
    ],
    passos: [
      {
        title: "Avaliação",
        description: "Análise da textura da pele e definição da profundidade das agulhas.",
      },
      { title: "Anestesia tópica", description: "Creme anestésico 20-30 minutos antes." },
      { title: "Passagem do dispositivo", description: "Deslizamento em múltiplas direções sobre a área." },
      {
        title: "Ativos e finalização",
        description: "Aplicação de ativos, se indicado, e orientações de cuidados.",
      },
    ],
    faq: [
      {
        question: "Sangra?",
        answer:
          "Pode haver pequenos pontos de sangramento (petéquias) durante a sessão, que fazem parte da técnica.",
      },
      {
        question: "Posso usar maquiagem depois?",
        answer: "Geralmente só é liberada após 24-48h, para não comprometer a recuperação da pele.",
      },
    ],
    cta: "Entre em contato com o Dr. Victor e descubra se o microagulhamento é o tratamento ideal para você.",
  },
  {
    slug: "peeling-quimico",
    title: "Peeling Químico",
    article: "o",
    short: "Renovação da pele com ácidos, tratando manchas e textura irregular.",
    detail:
      "Aplicação de ácidos que promovem esfoliação controlada da pele, removendo camadas danificadas e estimulando a renovação celular.",
    duracao: "Resultado acumulativo ao longo das sessões, com manutenção conforme indicação",
    indicado: "Manchas, textura irregular, oleosidade, sinais leves de fotoenvelhecimento",
    sessoes: "3 a 4 sessões, intervalo de 15 a 30 dias",
    recuperacao: "3 a 7 dias de vermelhidão e descamação (superficial a médio)",
    beneficios: [
      "Uniformiza tom e textura da pele",
      "Estimula renovação celular",
      "Procedimento rápido em consultório",
      "Ajustável conforme tipo de pele",
    ],
    passos: [
      {
        title: "Avaliação do tipo de pele",
        description: "Definição do ácido e da profundidade adequada ao caso.",
      },
      {
        title: "Limpeza e desengorduramento",
        description: "Preparo da pele para melhor absorção do ácido.",
      },
      { title: "Aplicação do ácido", description: "Aplicação controlada da solução química na pele." },
      {
        title: "Neutralização e finalização",
        description: "Neutralização, se necessário, e orientações de cuidados.",
      },
    ],
    faq: [
      {
        question: "Vai descamar muito?",
        answer:
          "Depende da profundidade: peelings superficiais descamam pouco (3-5 dias); médios podem descamar mais (7-14 dias).",
      },
      {
        question: "Posso pegar sol logo depois?",
        answer:
          "Não — a fotoproteção rigorosa é obrigatória nas semanas seguintes, já que a pele fica mais sensível.",
      },
    ],
    cta: "Entre em contato com o Dr. Victor e descubra se o peeling químico é o tratamento ideal para você.",
  },
];
