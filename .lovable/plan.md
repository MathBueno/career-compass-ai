

## Internacionalização para Português

O sistema está atualmente todo em inglês. O usuário quer que a interface esteja em português.

### Plano

Traduzir todo o conteúdo visível ao usuário para português (PT-BR) nos seguintes arquivos:

1. **`src/components/career/HeroSection.tsx`** — Título, subtítulo, botão CTA, cards de features
2. **`src/components/career/InputStep.tsx`** — Labels, placeholders, botões, toggle de modo
3. **`src/components/career/ProfileEditor.tsx`** — Títulos de seções, labels de skills, botões
4. **`src/components/career/AssessmentStep.tsx`** — Perguntas do OCEAN, labels da escala Likert, botões de navegação
5. **`src/components/career/AnalyzingStep.tsx`** — Mensagens de loading/progresso
6. **`src/components/career/ResultsStep.tsx`** — Todas as seções de resultados (roles, career directions, simulações, planos, comparações)
7. **`supabase/functions/career-analyze/index.ts`** — System prompt do AI para gerar respostas em português
8. **`index.html`** — Title e meta description

### Detalhes técnicos

- Tradução direta nos componentes (sem biblioteca i18n, já que o app é single-language)
- O prompt da edge function será atualizado para instruir o AI a responder em português
- Escala Likert: "Discordo Totalmente", "Discordo", "Neutro", "Concordo", "Concordo Totalmente"
- Manter termos técnicos reconhecíveis (ex: "hard skills", "soft skills") quando apropriado

