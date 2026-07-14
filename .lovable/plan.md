

# Atualização Completa de Conteúdo Textual

Substituição de todos os textos do site para o Dr. Victor Folster, sem alterar layout, imagens, cores ou fontes. As mudanças se concentram em **2 arquivos principais** + ajustes em **3 componentes de seção**.

---

## 1. Atualizar `src/lib/siteConfig.ts`

Substituir todos os dados do objeto `siteConfig`:

- **professional**: nome "Dr. Victor Folster", specialty "Estética Avançada com Base Clínica", credentials "CRF/SC 18.551 | RQE 19028-49", manter números de stats
- **about.title**: "Sobre o Profissional"
- **about.description**: novo texto fornecido no PDR
- **about.highlights**: 5 itens novos (Especialização em Estética Avançada..., Residência UFSC..., etc.)
- **procedures**: lista de 10 procedimentos (Harmonização Facial, Toxina Botulínica, Preenchimento Labial, Rinomodelação, Bioestimulador de Colágeno, Protocolo Reset, Microagulhamento, Lipo de Papada Enzimática, Lipo Enzimática Corporal, Peeling Químico)
- **contact**: phone "(48) 98814-9023", whatsapp "5548988149023", address "Rua Henrique Spengler, 90 – Vila Nova", city "Jaraguá do Sul – SC", cep "89259-280", atualizar mapEmbedUrl para novo endereço
- **social.instagram**: "https://instagram.com/dr.victorfolster"
- **cta**: heroButton "Agendar Avaliação", finalTitle "Sua melhor versão começa com um planejamento estratégico.", finalSubtitle "Agende sua avaliação personalizada e descubra o protocolo ideal para você.", finalButton "Agendar Avaliação"
- **testimonials**: remover conteúdo (array vazio), pois seção de resultados será reformulada

Adicionar novo campo para descrições detalhadas dos procedimentos (usado no accordion):

```
procedureDetails: {
  "Harmonização Facial": "Planejamento individualizado que equilibra proporções...",
  ...
}
```

---

## 2. Atualizar `src/components/sections/HeroSection.tsx`

- Adicionar texto de apoio abaixo das credentials: "Protocolos personalizados que unem ciência, precisão e naturalidade para resultados elegantes e progressivos."
- Mudar o texto do botão para usar `siteConfig.cta.heroButton` (já faz isso, será atualizado via siteConfig)

---

## 3. Atualizar `src/components/sections/ProceduresSection.tsx`

- Adicionar texto introdutório abaixo do título: "Cada procedimento é indicado após avaliação criteriosa..."
- Usar `siteConfig.procedureDetails[procedure]` para descrição específica de cada item no accordion, em vez do texto genérico atual

---

## 4. Atualizar `src/components/sections/ResultsSection.tsx`

- Título: "Resultados reais. Elegância sem exageros."
- Subtítulo: "A prioridade não é transformar, é harmonizar. Resultados progressivos, seguros e compatíveis com sua estrutura."
- Remover a imagem de resultado e o badge "Botox"
- Criar espaço reservado (placeholder) para futuras fotos de prova social, com texto indicativo

---

## 5. Atualizar `src/components/sections/FinalSection.tsx`

- Adicionar texto complementar: "Atendimentos em Jaraguá do Sul e Florianópolis."
- O botão CTA usará o texto "Agendar Avaliação" (via siteConfig)

---

## 6. Atualizar `src/components/sections/FooterSection.tsx`

- Instagram: "@dr.victorfolster" com link correto
- Adicionar mensagem institucional: "Estética com base clínica, planejamento e responsabilidade profissional."

---

## 7. Adicionar seção "Método / Posicionamento" (nova seção)

Criar `src/components/sections/MethodSection.tsx`:
- Título: "Método baseado em ciência, não em tendências"
- Texto principal conforme PDR
- Frase de impacto destacada: "Naturalidade não é acaso. É planejamento."
- Seguir mesmo padrão visual das seções existentes (FadeIn, container-narrow, section-padding)
- Inserir no `Index.tsx` entre AboutSection e ProceduresSection

---

## Detalhes Técnicos

- **Arquivos modificados**: `siteConfig.ts`, `HeroSection.tsx`, `ProceduresSection.tsx`, `ResultsSection.tsx`, `FinalSection.tsx`, `FooterSection.tsx`, `Index.tsx`
- **Arquivo criado**: `MethodSection.tsx`
- **Nenhuma alteração** em: layout, CSS, imagens, cores, fontes ou componentes UI

