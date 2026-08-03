// Tipos e dados de conteúdo do site — Procedimentos e Áreas de Atuação
// Gerado a partir da prévia aprovada. Cole em src/lib/siteData.ts

export interface Procedure {
  title: string;
  short: string;
  detail: string;
  duracao: string;
  indicado: string;
  sessoes: string;
  recuperacao: string;
  beneficios: string[];
  passos: [string, string][];
  posCare: string[];
  faq: [string, string][];
  cta: string;
}

export interface Category {
  name: string;
  short: string;
  objetivo: string;
  escolhaSe?: string;
  queixas: string;
  indicado: string;
  procedures: string[]; // títulos referenciando Procedure.title
}

export const procedures: Procedure[] = [
  {
    title: "Toxina Botulínica",
    short: "Suaviza linhas de expressão com efeito preventivo quando aplicada precocemente.",
    detail: "A toxina botulínica bloqueia temporariamente o sinal do nervo para o músculo, reduzindo a contração responsável pelas rugas dinâmicas — as que aparecem ao movimentar o rosto. É uma das aplicações mais estudadas da estética facial, com décadas de uso documentado. O objetivo não é imobilizar a expressão, mas suavizar a repetição do movimento que aprofunda a linha ao longo do tempo. Dose e região fazem parte de um planejamento individual, respeitando a musculatura e a expressão natural de cada rosto.",
    duracao: "3 a 6 meses",
    indicado: "Rugas dinâmicas (testa, glabela, pés de galinha), prevenção de marcas de expressão, bruxismo e sudorese excessiva",
    sessoes: "Sessão única; retoque a cada 3-6 meses",
    recuperacao: "Sem afastamento; pode haver leve vermelhidão nos pontos por algumas horas",
    beneficios: ["Suaviza rugas de expressão", "Efeito preventivo quando aplicada precocemente", "Procedimento rápido (15-30 min)", "Resultado natural, sem \"congelar\" a expressão"],
    passos: [["Avaliação", "Análise da musculatura facial em repouso e em movimento para definir pontos e dose."], ["Marcação", "Demarcação dos pontos de aplicação conforme o planejamento."], ["Aplicação", "Injeção da toxina com agulha fina nos pontos marcados."], ["Orientações finais", "Recomendações pós-procedimento, como evitar deitar e exercícios intensos por algumas horas."]],
    posCare: ["Evitar deitar ou abaixar a cabeça por cerca de 4 horas", "Evitar exercícios físicos intensos no mesmo dia", "Não massagear a região tratada nas primeiras horas", "Evitar exposição solar direta prolongada nos dias seguintes"],
    faq: [["Depois de quanto tempo o efeito aparece?", "Os primeiros sinais costumam surgir entre 3 e 7 dias, com efeito completo entre 2 e 4 semanas."], ["Dá pra fazer se eu nunca fiz antes?", "Sim — inclusive de forma preventiva, com doses menores, uma das indicações mais comuns hoje."]],
    cta: "Entre em contato com o Dr. Victor e descubra se a toxina botulínica é o tratamento ideal para você.",
  },
  {
    title: "Bioestimulador de Colágeno",
    short: "Estímulo progressivo de colágeno para firmeza da pele.",
    detail: "Estimula os fibroblastos a produzir colágeno novo de forma gradual, em vez de preencher volume instantaneamente — resultado que evolui ao longo dos meses seguintes. Diferente do preenchimento, ele não entrega volume imediato — o resultado depende da resposta biológica do próprio organismo, reorganizando a estrutura de sustentação da pele ao longo do tempo. Costuma compor tanto protocolos isolados quanto combinados com outros procedimentos regenerativos.",
    duracao: "12 a 24 meses (varia conforme o produto)",
    indicado: "Flacidez leve a moderada, perda de firmeza, prevenção do envelhecimento",
    sessoes: "2 a 3 sessões, intervalo de 4 a 8 semanas",
    recuperacao: "Leve inchaço ou vermelhidão por 2 a 3 dias",
    beneficios: ["Estímulo natural de colágeno", "Resultado progressivo e duradouro", "Melhora a firmeza e qualidade geral da pele", "Baixo tempo de recuperação"],
    passos: [["Avaliação", "Análise da qualidade da pele e do grau de flacidez para escolher o produto adequado."], ["Anestesia tópica", "Creme anestésico por 20-30 minutos antes do procedimento."], ["Aplicação", "Injeção do bioestimulador nas camadas indicadas da pele."], ["Massagem e finalização", "Distribuição uniforme do produto e orientações de cuidados."]],
    posCare: ["Fazer a massagem na área conforme orientado, se indicado", "Evitar exposição solar direta nos primeiros dias", "Evitar exercícios físicos intensos nas primeiras 24-48h", "Manter boa hidratação"],
    faq: [["Por que o resultado não aparece na hora?", "Porque depende da produção natural de colágeno pelo organismo, que começa em semanas e atinge o pico em alguns meses."], ["Preciso repetir todo ano?", "Depende do produto: alguns pedem manutenção anual, outros duram até 2 anos."]],
    cta: "Entre em contato com o Dr. Victor e descubra se o bioestimulador de colágeno é o tratamento ideal para você.",
  },
  {
    title: "Preenchimento de Olheira",
    short: "Suaviza o sulco lacrimal e a aparência de cansaço.",
    detail: "Ácido hialurônico específico para a área fina da região dos olhos é injetado no sulco lacrimal, repondo volume perdido e suavizando a sombra que dá aspecto de cansaço. É considerada uma das regiões mais delicadas do rosto para trabalhar, por isso exige avaliação cuidadosa da anatomia local antes de qualquer aplicação. Quando bem indicado, devolve uniformidade sem alterar a expressão do olhar.",
    duracao: "9 a 12 meses (área com absorção mais rápida)",
    indicado: "Sulco lacrimal (olho fundo), aspecto de cansaço por perda de volume",
    sessoes: "Sessão única; retoque conforme avaliação",
    recuperacao: "Possível leve inchaço ou hematoma por 2 a 5 dias",
    beneficios: ["Suaviza o aspecto de cansaço", "Resultado imediato e natural", "Técnica pouco invasiva", "Procedimento rápido"],
    passos: [["Avaliação", "Análise da profundidade do sulco e da qualidade da pele da região."], ["Anestesia tópica", "Creme anestésico, por ser uma região sensível."], ["Aplicação com cânula", "Injeção do ácido hialurônico com cânula fina, reduzindo risco de hematomas."], ["Finalização", "Massagem leve e orientações (evitar compressão na região)."]],
    posCare: ["Evitar compressão ou manipulação da área nas primeiras 24h", "Aplicar compressa fria se houver inchaço, se orientado", "Evitar exercícios físicos intensos no mesmo dia", "Evitar exposição solar direta"],
    faq: [["Fica inchado?", "Pode haver inchaço leve nas primeiras 24-48h, que costuma ceder rápido."], ["Corrige olheira escura por pigmentação?", "Não diretamente — o preenchimento trata o sulco/volume; manchas pedem abordagem diferente, avaliada à parte."]],
    cta: "Entre em contato com o Dr. Victor e descubra se o preenchimento de olheira é o tratamento ideal para você.",
  },
  {
    title: "Reestruturação Facial",
    short: "Planejamento estrutural do rosto para equilíbrio e naturalidade.",
    detail: "Avalia o rosto como um conjunto — não como pontos isolados — redistribuindo volume e contorno entre queixo, nariz, lábios e outras estruturas, geralmente combinando ácido hialurônico em mais de uma região. Não existe uma lista fixa de etapas — o plano é desenhado a partir da avaliação de cada rosto, podendo incluir mais de uma técnica ao longo do tempo. A meta é sempre proporção e naturalidade, não um padrão estético único aplicado a todos os pacientes.",
    duracao: "12 a 18 meses (varia por área e produto)",
    indicado: "Desequilíbrio de proporções faciais, perda de contorno, planejamento facial global",
    sessoes: "Sessão inicial de planejamento; retoques conforme avaliação",
    recuperacao: "Inchaço leve por 3 a 7 dias, variando por região",
    beneficios: ["Harmonia entre as estruturas do rosto", "Resultado natural, não pontual", "Planejamento individualizado", "Sem cirurgia"],
    passos: [["Avaliação global", "Análise das proporções do rosto como um todo, não só de um ponto isolado."], ["Planejamento", "Definição de quais áreas e produtos serão usados, e em que ordem."], ["Aplicação por etapas", "Aplicação do preenchedor nas regiões definidas, com reavaliação entre etapas."], ["Reavaliação final", "Checagem da simetria e do resultado, com ajustes finos se necessário."]],
    posCare: ["Evitar exposição solar direta nos primeiros dias", "Evitar exercícios físicos intensos nas primeiras 24-48h", "Evitar manipular ou massagear as áreas tratadas sem orientação", "Seguir o cronograma de retorno combinado"],
    faq: [["É a mesma coisa que harmonização facial?", "O princípio é parecido, mas aqui o ponto de partida é sempre a avaliação estrutural do rosto como um todo, não uma lista fixa de procedimentos."], ["Preciso fazer tudo de uma vez?", "Não — o planejamento pode ser dividido em etapas, conforme prioridade do paciente."]],
    cta: "Entre em contato com o Dr. Victor e descubra se a reestruturação facial é o tratamento ideal para você.",
  },
  {
    title: "Preenchimento Labial",
    short: "Volume e contorno labial proporcionais ao rosto, sem aspecto artificial.",
    detail: "Injeção de ácido hialurônico nos lábios para repor volume, definir contorno e hidratar a região. O volume é sempre pensado em relação ao restante do rosto — lábios muito volumosos para a proporção facial tendem a parecer artificiais, por isso a quantidade de produto é calibrada individualmente.",
    duracao: "6 a 18 meses, dependendo da densidade do produto",
    indicado: "Lábios finos, assimetria labial, perda de contorno",
    sessoes: "Sessão única; retoque conforme avaliação",
    recuperacao: "Inchaço ou pequenos hematomas por 2 a 5 dias",
    beneficios: ["Volume e contorno proporcionais ao rosto", "Hidratação da região", "Resultado imediato", "Técnica ajustável (mais ou menos produto)"],
    passos: [["Avaliação", "Análise da anatomia labial e da proporção com o restante do rosto."], ["Anestesia", "Tópica ou injetável, por ser uma região sensível."], ["Aplicação", "Injeção do ácido hialurônico com agulha ou cânula, conforme técnica escolhida."], ["Modelagem e finalização", "Massagem para uniformizar o produto e ajustar simetria."]],
    posCare: ["Aplicar gelo local nas primeiras horas, se indicado", "Evitar batom ou produtos na região por algumas horas", "Evitar exercícios físicos intensos no mesmo dia", "Evitar exposição solar direta"],
    faq: [["Fica com aspecto artificial?", "O objetivo é volume proporcional ao rosto — a quantidade é ajustada para evitar o aspecto de excesso."], ["Dói muito?", "Costuma ser tolerável com anestesia tópica ou injetável; varia de pessoa para pessoa."]],
    cta: "Entre em contato com o Dr. Victor e descubra se o preenchimento labial é o tratamento ideal para você.",
  },
  {
    title: "Profiloplastia",
    short: "Reequilíbrio do perfil facial — nariz, lábios e queixo — sem cirurgia.",
    detail: "Reequilibra nariz, lábios e queixo como um conjunto, tratando o perfil facial como um todo em vez de uma região isolada, com ácido hialurônico. É uma abordagem que exige visão de conjunto: alterar só uma das três estruturas pode até acentuar o desequilíbrio em vez de corrigi-lo. Por isso, o planejamento sempre avalia nariz, lábios e queixo juntos antes de qualquer aplicação.",
    duracao: "12 a 18 meses",
    indicado: "Desequilíbrio entre nariz, lábios e queixo no perfil; queixo retraído; projeção nasal desproporcional",
    sessoes: "Sessão única; retoque conforme avaliação",
    recuperacao: "Inchaço leve por 3 a 7 dias",
    beneficios: ["Harmonia do perfil facial", "Sem cirurgia", "Resultado natural", "Planejamento conjunto das 3 áreas"],
    passos: [["Avaliação do perfil", "Análise da relação entre nariz, lábios e queixo, de perfil e de frente."], ["Anestesia", "Tópica ou local nas regiões a serem tratadas."], ["Aplicação", "Injeção do ácido hialurônico nas 3 áreas, na ordem definida no planejamento."], ["Reavaliação do perfil", "Checagem do equilíbrio final, de perfil e de frente."]],
    posCare: ["Evitar exercícios físicos intensos nas primeiras 24-48h", "Evitar exposição solar direta", "Evitar dormir de bruços nos primeiros dias", "Evitar manipular as áreas tratadas"],
    faq: [["Substitui a rinoplastia?", "Não — trata desproporções pontuais com preenchimento; mudanças estruturais maiores seguem sendo indicação cirúrgica."], ["Por que tratar 3 áreas juntas?", "Porque o desequilíbrio do perfil geralmente está na relação entre elas, não numa característica isolada."]],
    cta: "Entre em contato com o Dr. Victor e descubra se a profiloplastia é o tratamento ideal para você.",
  },
  {
    title: "Rinomodelação",
    short: "Ajustes pontuais no nariz sem cirurgia.",
    detail: "Aplicação de ácido hialurônico no dorso, ponta ou columela do nariz para corrigir pequenas irregularidades de contorno. É importante entender os limites da técnica: ela corrige contorno e simetria com preenchimento, mas não reduz o tamanho do nariz nem resolve questões estruturais internas — para isso, a indicação seria cirúrgica.",
    duracao: "12 a 18 meses",
    indicado: "Desvios leves no dorso nasal, ponta pouco definida, correções pontuais pós-rinoplastia",
    sessoes: "Sessão única; retoque anual",
    recuperacao: "Leve inchaço ou hematoma por poucos dias",
    beneficios: ["Sem cirurgia", "Resultado imediato", "Recuperação rápida", "Procedimento em consultório (~30 min)"],
    passos: [["Avaliação do nariz", "Análise do contorno nasal e do que é possível corrigir só com preenchimento."], ["Anestesia local", "Anestésico tópico ou local na região."], ["Aplicação", "Injeção do preenchedor com agulha ou cânula nos pontos definidos."], ["Verificação da simetria", "Checagem do resultado de frente e de perfil antes de finalizar."]],
    posCare: ["Evitar apoiar óculos sobre o nariz por alguns dias, se orientado", "Evitar exercícios físicos intensos no mesmo dia", "Evitar exposição solar direta", "Evitar pressão ou manipulação na região"],
    faq: [["Rinomodelação substitui rinoplastia?", "Não em todos os casos — é indicada para correções pontuais; desvios funcionais seguem sendo cirúrgicos."], ["É perigoso mexer no nariz com preenchimento?", "Exige técnica e conhecimento anatômico específico pela vascularização da região — por isso a avaliação prévia é essencial."]],
    cta: "Entre em contato com o Dr. Victor e descubra se a rinomodelação é o tratamento ideal para você.",
  },
  {
    title: "Ultrassom Microfocado",
    short: "Estímulo de colágeno em profundidade para firmar a pele sem cortes.",
    detail: "Ondas de ultrassom focalizado atingem camadas profundas da pele, estimulando produção de colágeno sem cortes. Costuma ser indicado como estratégia preventiva ou complementar, sobretudo para quem ainda não tem indicação cirúrgica, mas já percebe perda de firmeza. O resultado depende da resposta individual de colágeno de cada pessoa.",
    duracao: "12 a 18 meses",
    indicado: "Primeiros sinais de flacidez facial ou corporal, antes de indicação cirúrgica",
    sessoes: "Geralmente sessão única; retoque anual",
    recuperacao: "Nenhuma — retorno imediato às atividades",
    beneficios: ["Sem cortes nem agulhas", "Estímulo profundo de colágeno", "Sem tempo de afastamento", "Resultado progressivo ao longo dos meses"],
    passos: [["Avaliação", "Análise do grau de flacidez e das áreas a serem tratadas."], ["Gel condutor", "Aplicação de gel na pele para conduzir a energia do ultrassom."], ["Disparos por camada", "Aplicação dos disparos em diferentes profundidades da pele."], ["Orientações finais", "A paciente já pode seguir a rotina normal."]],
    posCare: ["Manter boa hidratação", "Evitar exposição solar direta nos primeiros dias", "Retorno às atividades normais costuma ser liberado no mesmo dia", "Evitar tratamentos térmicos intensos na área por alguns dias"],
    faq: [["Dói?", "Pode haver sensação de calor ou leve desconforto pontual, sem necessidade de anestesia na maioria dos casos."], ["Substitui um lifting cirúrgico?", "Não — indicado para sinais iniciais de flacidez; casos mais avançados podem exigir avaliação cirúrgica."]],
    cta: "Entre em contato com o Dr. Victor e descubra se o ultrassom microfocado é o tratamento ideal para você.",
  },
  {
    title: "Laser de CO2",
    short: "Renovação da textura da pele: manchas, poros e linhas finas.",
    detail: "O laser fracionado cria microzonas controladas de aquecimento na pele, retirando camadas danificadas e estimulando renovação e produção de colágeno. Por remover uma camada da pele de forma controlada, exige cuidados rígidos no pós-procedimento, principalmente fotoproteção. É uma das tecnologias mais estudadas para renovação de textura e tratamento de cicatrizes de acne.",
    duracao: "Efeito acumulativo ao longo das sessões, com manutenção conforme avaliação",
    indicado: "Manchas, textura irregular, poros dilatados, cicatrizes de acne, linhas finas",
    sessoes: "3 a 6 sessões, intervalo de 45 a 60 dias",
    recuperacao: "5 a 10 dias de vermelhidão e descamação",
    beneficios: ["Renovação da textura da pele", "Trata manchas e cicatrizes de acne", "Estímulo contínuo de colágeno", "Resultado que evolui por meses"],
    passos: [["Avaliação", "Análise do tipo de pele e do objetivo (manchas, cicatrizes, textura, linhas finas)."], ["Anestesia tópica", "Creme anestésico antes da sessão."], ["Aplicação do laser", "Disparos do laser fracionado nas áreas definidas."], ["Curativo e orientações", "Fotoproteção rigorosa e cremes cicatrizantes."]],
    posCare: ["Fotoproteção rigorosa é obrigatória nas semanas seguintes", "Manter a pele hidratada com produtos indicados", "Evitar sol direto e ambientes de calor intenso", "Não remover crostas ou descamação manualmente"],
    faq: [["Fica com casca no rosto?", "Sim — é comum uma fina crosta que descama em cerca de 5-8 dias; faz parte do processo de renovação."], ["Posso pegar sol depois?", "Não nas primeiras semanas — a fotoproteção rigorosa é essencial para evitar manchas."]],
    cta: "Entre em contato com o Dr. Victor e descubra se o laser de CO2 é o tratamento ideal para você.",
  },
  {
    title: "Fotona",
    short: "Laser 4D que combina duas tecnologias para firmeza e rejuvenescimento facial.",
    detail: "Combina dois comprimentos de onda de laser (Er:YAG e Nd:YAG) que atuam em diferentes profundidades da pele, estimulando colágeno com efeito de \"lifting\" não cirúrgico — sem cortes. Por combinar duas tecnologias numa mesma sessão, permite tratar camadas diferentes da pele sem precisar de múltiplos aparelhos. É uma opção para quem busca efeito tipo lifting com recuperação mais curta que lasers tradicionais.",
    duracao: "6 meses a 1 ano, conforme cuidados pós-procedimento",
    indicado: "Firmeza facial, rejuvenescimento, manchas, cicatrizes de acne, textura da pele",
    sessoes: "3 a 6 sessões, intervalo de 3 a 4 semanas",
    recuperacao: "Mínima — vermelhidão leve, retorno às atividades no mesmo dia",
    beneficios: ["Combina duas tecnologias de laser numa sessão", "Recuperação mais rápida que lasers tradicionais", "Efeito tipo \"lifting\" sem cirurgia", "Indicado para rosto e corpo"],
    passos: [["Avaliação", "Análise da pele e definição dos parâmetros do laser para o caso."], ["Anestesia tópica", "Aplicação de creme anestésico, se necessário."], ["Aplicação do laser", "Disparos nas camadas definidas, com ajuste de parâmetros durante a sessão."], ["Orientações finais", "Fotoproteção e cuidados para potencializar o resultado."]],
    posCare: ["Fotoproteção nos dias seguintes", "Evitar exposição a calor intenso (sauna, sol forte) por alguns dias", "Manter a pele hidratada", "Retorno às atividades normais costuma ser liberado rapidamente"],
    faq: [["O Fotona substitui uma cirurgia plástica?", "Não — é indicado para firmeza e rejuvenescimento não cirúrgico; flacidez avançada pode exigir avaliação cirúrgica."], ["Quantas sessões preciso fazer?", "Geralmente de 3 a 6, com intervalo de 3 a 4 semanas, variando conforme o objetivo e a resposta da pele."]],
    cta: "Entre em contato com o Dr. Victor e descubra se o Fotona é o tratamento ideal para você.",
  },
  {
    title: "Estética Regenerativa",
    short: "Protocolos regenerativos (bioestimuladores, peptídeos de cobre, PDRN e peptídeos bioativos) para renovação progressiva.",
    detail: "Combina ativos regenerativos — bioestimuladores, peptídeos de cobre, PDRN e outros peptídeos bioativos — que atuam na sinalização celular, estimulando fibroblastos e a regeneração natural da pele. O conceito por trás desses ativos é sinalizar para a própria célula que ela deve se regenerar, em vez de apenas preencher ou remover uma camada da pele. Por isso, costuma ser usada tanto isoladamente quanto associada a outros procedimentos, como parte de um protocolo de manutenção contínuo.",
    duracao: "Resultado progressivo, sustentado com protocolo contínuo",
    indicado: "Qualidade geral da pele, prevenção do envelhecimento, manutenção pós-procedimento",
    sessoes: "3 a 4 sessões, intervalo de 2 a 4 semanas",
    recuperacao: "Mínima — possível leve vermelhidão por algumas horas",
    beneficios: ["Base científica consolidada em alguns ativos (décadas de estudo)", "Atua na regeneração, não só na superfície", "Pode ser combinada com outros procedimentos", "Baixo tempo de recuperação"],
    passos: [["Avaliação", "Análise da qualidade da pele e definição de quais ativos fazem sentido para o caso."], ["Preparo da pele", "Limpeza da área e, se necessário, anestesia tópica."], ["Aplicação dos ativos", "Aplicação combinada dos ativos regenerativos definidos no planejamento."], ["Finalização", "Orientações de cuidados e continuidade do protocolo."]],
    posCare: ["Seguir o protocolo de sessões combinado", "Evitar exposição solar direta nos dias seguintes", "Manter boa hidratação", "Evitar produtos irritantes na pele nas primeiras 24h"],
    faq: [["É a mesma coisa que PRP?", "Não — este protocolo usa bioestimuladores e peptídeos como peptídeos de cobre e PDRN; não inclui PRP."], ["Em quanto tempo aparece resultado?", "Estudos com esses ativos mostram resposta documentada em 30 a 60 dias de protocolo consistente."]],
    cta: "Entre em contato com o Dr. Victor e descubra se a estética regenerativa é o tratamento ideal para você.",
  },
  {
    title: "Microagulhamento",
    short: "Renovação celular e estímulo de colágeno via microlesões controladas.",
    detail: "Microagulhas criam pequenas lesões controladas na pele, ativando o processo natural de reparo e estimulando a produção de colágeno. Também funciona como via de entrada para outros ativos na pele (drug delivery), potencializando o efeito de produtos aplicados na sessão. Costuma compor protocolos combinados com outros procedimentos regenerativos.",
    duracao: "Estímulo de colágeno sustentado por cerca de 6 a 8 meses",
    indicado: "Textura irregular, poros dilatados, cicatrizes superficiais de acne",
    sessoes: "3 a 6 sessões, intervalo de 4 a 6 semanas",
    recuperacao: "Vermelhidão leve por 2 a 3 dias",
    beneficios: ["Estimula colágeno tipo I", "Pode ser combinado com ativos (drug delivery)", "Baixo tempo de recuperação", "Indicado para diferentes tipos de pele"],
    passos: [["Avaliação", "Análise da textura da pele e definição da profundidade das agulhas."], ["Anestesia tópica", "Creme anestésico 20-30 minutos antes."], ["Passagem do dispositivo", "Deslizamento em múltiplas direções sobre a área."], ["Ativos e finalização", "Aplicação de ativos, se indicado, e orientações de cuidados."]],
    posCare: ["Evitar maquiagem por 24-48h", "Fotoproteção rigorosa nos dias seguintes", "Evitar produtos com ácidos ou irritantes por alguns dias", "Manter a pele limpa e hidratada"],
    faq: [["Sangra?", "Pode haver pequenos pontos de sangramento (petéquias) durante a sessão, que fazem parte da técnica."], ["Posso usar maquiagem depois?", "Geralmente só é liberada após 24-48h, para não comprometer a recuperação da pele."]],
    cta: "Entre em contato com o Dr. Victor e descubra se o microagulhamento é o tratamento ideal para você.",
  },
  {
    title: "Peeling Químico",
    short: "Renovação da pele com ácidos, tratando manchas e textura irregular.",
    detail: "Aplicação de ácidos que promovem esfoliação controlada da pele, removendo camadas danificadas e estimulando a renovação celular. A escolha do ácido e da profundidade depende do biotipo de pele e do objetivo — dois pacientes com a mesma queixa podem receber protocolos completamente diferentes. É uma das formas mais acessíveis de manter a renovação da pele em dia.",
    duracao: "Resultado acumulativo ao longo das sessões, com manutenção conforme indicação",
    indicado: "Manchas, textura irregular, oleosidade, sinais leves de fotoenvelhecimento",
    sessoes: "3 a 4 sessões, intervalo de 15 a 30 dias",
    recuperacao: "3 a 7 dias de vermelhidão e descamação (superficial a médio)",
    beneficios: ["Uniformiza tom e textura da pele", "Estimula renovação celular", "Procedimento rápido em consultório", "Ajustável conforme tipo de pele"],
    passos: [["Avaliação do tipo de pele", "Definição do ácido e da profundidade adequada ao caso."], ["Limpeza e desengorduramento", "Preparo da pele para melhor absorção do ácido."], ["Aplicação do ácido", "Aplicação controlada da solução química na pele."], ["Neutralização e finalização", "Neutralização, se necessário, e orientações de cuidados."]],
    posCare: ["Fotoproteção rigorosa é obrigatória", "Não descolar peles ou crostas manualmente", "Evitar produtos com ácidos por alguns dias", "Manter a pele hidratada com produtos indicados"],
    faq: [["Vai descamar muito?", "Depende da profundidade: peelings superficiais descamam pouco (3-5 dias); médios podem descamar mais (7-14 dias)."], ["Posso pegar sol logo depois?", "Não — a fotoproteção rigorosa é obrigatória nas semanas seguintes, já que a pele fica mais sensível."]],
    cta: "Entre em contato com o Dr. Victor e descubra se o peeling químico é o tratamento ideal para você.",
  },
];

export const categories: Category[] = [
  {
    name: "Arquitetura Facial",
    short: "Reequilíbrio estrutural do rosto — queixo, nariz, lábios e contorno — a partir de planejamento individual.",
    objetivo: "Reequilibrar as proporções do rosto como um todo — queixo, nariz, lábios e contorno — a partir de planejamento individual, não de protocolo padrão.",
    queixas: "Assimetria, perda de contorno, desproporção entre estruturas, desejo de resultado mais harmônico.",
    indicado: "Quem busca reequilíbrio estrutural gradual e natural do rosto.",
    procedures: ["Reestruturação Facial", "Preenchimento de Olheira", "Preenchimento Labial", "Bioestimulador de Colágeno", "Toxina Botulínica", "Profiloplastia", "Rinomodelação", "Ultrassom Microfocado", "Fotona"],
  },
  {
    name: "Estética Regenerativa",
    short: "Protocolos que estimulam a regeneração natural da pele, com ativos e tecnologias de base científica.",
    objetivo: "Estimular a capacidade natural de regeneração da pele e dos tecidos — com bioestimuladores, peptídeos de cobre, PDRN, laser e microagulhamento — em vez de só corrigir um sinal isolado.",
    escolhaSe: "sua queixa é sobre a qualidade da pele em si (textura, firmeza, viço) — não sobre a estrutura do rosto.",
    queixas: "Perda de firmeza, textura irregular, sinais de envelhecimento, recuperação pós-procedimento.",
    indicado: "Quem busca resultado progressivo e mais duradouro, com base em ativos e tecnologias com respaldo científico.",
    procedures: ["Estética Regenerativa", "Laser de CO2", "Microagulhamento", "Peeling Químico", "Bioestimulador de Colágeno"],
  },
  {
    name: "Estética Masculina",
    short: "Procedimentos adaptados às particularidades da pele e anatomia masculina, com resultado natural e sutil.",
    objetivo: "Procedimentos adaptados às particularidades da anatomia e da pele masculina — traços mais marcados, pele mais espessa, padrão de barba — sem descaracterizar o rosto.",
    queixas: "Sinais de cansaço, perda de definição da mandíbula/queixo, flacidez, textura de pele.",
    indicado: "Homens que buscam manutenção e prevenção, com resultado natural e sutil.",
    procedures: ["Toxina Botulínica", "Bioestimulador de Colágeno", "Preenchimento de Olheira", "Reestruturação Facial", "Rinomodelação", "Ultrassom Microfocado", "Laser de CO2", "Fotona", "Estética Regenerativa", "Microagulhamento", "Peeling Químico"],
  },
  {
    name: "Envelhecimento Saudável",
    short: "Manutenção progressiva da firmeza e da qualidade da pele ao longo do tempo, sem prometer reverter o relógio.",
    objetivo: "Acompanhar o processo natural de envelhecimento com manutenção contínua — não reverter o tempo, mas preservar firmeza, qualidade e saúde da pele ao longo dos anos.",
    escolhaSe: "você não tem uma queixa específica hoje, mas quer entrar numa rotina de prevenção antes que uma apareça.",
    queixas: "Perda progressiva de firmeza, textura irregular, sinais que se acumulam com o tempo.",
    indicado: "Quem busca uma rotina de manutenção contínua, com resultado que se constrói ao longo do tempo.",
    procedures: ["Estética Regenerativa", "Laser de CO2", "Microagulhamento", "Peeling Químico", "Bioestimulador de Colágeno", "Toxina Botulínica", "Reestruturação Facial", "Ultrassom Microfocado"],
  },
  {
    name: "Gerenciamento de Pele",
    short: "Foco em textura, manchas e qualidade geral da pele — tecnologias e protocolos combinados.",
    objetivo: "Cuidar da textura, manchas e qualidade geral da pele através de tecnologias e protocolos combinados, com acompanhamento contínuo.",
    escolhaSe: "sua queixa é visual e pontual (mancha, poro, textura) — não sensação de \"rosto caindo\" ou perda de contorno.",
    queixas: "Manchas, textura irregular, poros dilatados, perda de viço.",
    indicado: "Quem busca rotina de manutenção da pele com tecnologia e ativos combinados.",
    procedures: ["Fotona", "Bioestimulador de Colágeno", "Ultrassom Microfocado", "Estética Regenerativa", "Laser de CO2", "Microagulhamento", "Peeling Químico"],
  },
];

export function findProcedureIndex(title: string): number {
  return procedures.findIndex((p) => p.title === title);
}