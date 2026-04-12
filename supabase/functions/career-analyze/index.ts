import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, oceanScores, mode } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!profile?.freeText || profile.freeText.trim().length < 10) {
      return new Response(JSON.stringify({ error: "Texto do perfil muito curto." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const isQuick = mode === 'quick';

    const systemPrompt = `Você é um consultor de carreira especialista com IA. Analise o perfil profissional do usuário${isQuick ? '' : ' e avaliação comportamental'} para fornecer orientação de carreira abrangente.

REGRAS CRÍTICAS:
- TODAS as respostas devem ser em PORTUGUÊS BRASILEIRO.
- Gere cargos DINAMICAMENTE baseado no perfil. NÃO use uma lista estática de cargos.
- Cubra TODAS as indústrias, não apenas tecnologia.
- NÃO sugira vagas de emprego. Foque em direções de carreira e autodesenvolvimento.
- Seja específico e perspicaz, não genérico.
- Forneça recomendações fortes, não neutras.
- Adicione níveis de confiança (low/medium/high) a TODOS os outputs baseado na qualidade dos dados.
- Detecte gaps CRÍTICOS de habilidades que bloqueiam a entrada em cargos.
- Classifique prontidão para cada cargo: not_ready, almost_ready, ou ready.
- Cruze habilidades declaradas com experiência e comportamento. Sinalize inconsistências.
- Gere planos de melhoria passo a passo, priorizando habilidades de alto impacto primeiro.
- Compare os principais caminhos de carreira mostrando diferenças em esforço, tempo e compatibilidade.
- Normalize nomes de habilidades (ex: "pithon" → "Python").

Retorne um objeto JSON com esta estrutura EXATA:
{
  "profileSummary": "Resumo convincente de 2-3 frases da identidade profissional da pessoa em português",
  "overallConfidence": "low|medium|high",
  "inference": {
    "seniorityLevel": "junior|mid|senior|lead",
    "profileType": "ex: analítico-criativo, estratégico-operacional",
    "generalistVsSpecialist": "generalista|especialista|híbrido",
    "profileClarity": "low|medium|high",
    "inconsistencies": ["inconsistências detectadas em português"]
  },
  "behavioralProfile": {
    "scores": { "openness": number, "conscientiousness": number, "extraversion": number, "agreeableness": number, "emotionalStability": number },
    "summary": "Interpretação da personalidade para contexto de trabalho em português",
    "workTendencies": ["analítico", "criativo", "estruturado", "social", "estratégico"]
  },
  "roleMatches": [
    {
      "roleName": "Nome do cargo em português",
      "compatibility": 0-100,
      "seniority": "junior|mid|senior|lead",
      "technicalMatch": 0-100,
      "behavioralMatch": 0-100,
      "explanation": "Por que esse cargo se encaixa, em português",
      "presentSkills": ["habilidades que o usuário já possui"],
      "missingSkills": ["habilidades que faltam - lista simples"],
      "criticalGaps": ["habilidades que BLOQUEIAM a entrada - vazio se não houver"],
      "effortLevel": "low|medium|high",
      "estimatedTime": "ex: 3-6 meses",
      "confidence": "low|medium|high",
      "readiness": "not_ready|almost_ready|ready"
    }
  ],
  "careerDirections": [
    {
      "name": "Nome da direção em português",
      "compatibility": 0-100,
      "isComfortZone": true/false,
      "isGrowthZone": true/false
    }
  ],
  "skillSimulations": [
    {
      "skill": "Nome da habilidade",
      "currentMatch": number,
      "projectedMatch": number,
      "affectedRoles": ["nomes dos cargos"]
    }
  ],
  "riskInsights": [
    {
      "role": "Nome do cargo ou área",
      "riskLevel": "low|medium|high",
      "reason": "Motivo do risco em português",
      "recommendation": "Recomendação específica em português"
    }
  ],
  "skillValidations": [
    {
      "skill": "Nome da habilidade",
      "declared": true/false,
      "evidencedByExperience": true/false,
      "alignedWithBehavior": true/false,
      "reliability": "low|medium|high",
      "note": "Explicação da validação em português"
    }
  ],
  "improvementPlan": [
    {
      "order": 1,
      "action": "Ação específica em português",
      "skill": "Habilidade a desenvolver",
      "impact": "low|medium|high",
      "timeEstimate": "ex: 2-4 semanas",
      "reason": "Por que essa etapa importa em português"
    }
  ],
  "careerComparisons": [
    {
      "pathA": "Nome do caminho A",
      "pathB": "Nome do caminho B",
      "effortA": "low|medium|high",
      "effortB": "low|medium|high",
      "timeA": "ex: 3 meses",
      "timeB": "ex: 12 meses",
      "compatibilityA": 0-100,
      "compatibilityB": 0-100,
      "verdict": "Recomendação clara em português"
    }
  ],
  "transferableSkills": ["habilidades transferíveis em português"],
  "fastestPaths": ["caminhos mais rápidos específicos em português"]
}

Gere 5-8 correspondências de cargo em diferentes indústrias. Gere 4-6 direções de carreira. Gere 3-5 simulações de habilidade. Gere 2-4 insights de risco. Gere 3-6 validações de habilidades. Gere 4-8 passos de melhoria ordenados. Gere 2-3 comparações de caminho. Seja ousado e específico.`;

    const skills = profile.skills || [];
    const hardSkills = skills.filter((s: any) => s.category === 'hard').map((s: any) => s.name);
    const softSkills = skills.filter((s: any) => s.category === 'soft').map((s: any) => s.name);

    const userMessage = `
PERFIL PROFISSIONAL:
${profile.freeText}

${profile.linkedinUrl ? `LinkedIn: ${profile.linkedinUrl}` : ''}
${profile.cvText ? `Conteúdo do CV: ${profile.cvText.substring(0, 2000)}` : ''}

HARD SKILLS: ${hardSkills.length > 0 ? hardSkills.join(', ') : 'Não especificado'}
SOFT SKILLS: ${softSkills.length > 0 ? softSkills.join(', ') : 'Não especificado'}

${isQuick ? 'MODO: Análise rápida (sem teste comportamental). Use scores OCEAN neutros (3/5 para todos) e note que o matching comportamental tem menor confiança.' : `AVALIAÇÃO COMPORTAMENTAL (Big Five OCEAN, escala 1-5):
- Abertura: ${oceanScores.openness}
- Conscienciosidade: ${oceanScores.conscientiousness}
- Extroversão: ${oceanScores.extraversion}
- Amabilidade: ${oceanScores.agreeableness}
- Estabilidade Emocional: ${oceanScores.emotionalStability}`}

Analise este perfil de forma abrangente e retorne a análise de carreira em JSON estruturado. TUDO em português brasileiro.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente em instantes." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Créditos de IA esgotados." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`Erro no gateway de IA: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    if (!content) throw new Error("Sem conteúdo na resposta da IA");

    const analysis = JSON.parse(content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("career-analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
