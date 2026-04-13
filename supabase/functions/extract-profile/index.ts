import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { linkedinUrl, cvText } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    if (!linkedinUrl && !cvText) {
      return new Response(JSON.stringify({ error: "Nenhum dado fornecido." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const prompt = `Analise o conteúdo abaixo e extraia informações profissionais estruturadas.

${linkedinUrl ? `URL do LinkedIn: ${linkedinUrl}` : ''}
${cvText ? `Conteúdo do CV:\n${cvText.substring(0, 4000)}` : ''}

Extraia e retorne um JSON com:
{
  "skills": [
    { "name": "Nome normalizado da habilidade", "category": "hard|soft" }
  ],
  "summary": "Resumo breve do perfil profissional em português",
  "experience": "Nível de experiência detectado (junior/mid/senior)",
  "languages": ["idiomas detectados"]
}

REGRAS:
- Normalize nomes de habilidades (ex: "pithon" → "Python", "machine learnig" → "Machine Learning")
- Classifique cada skill como "hard" (técnica) ou "soft" (comportamental)
- Expanda abreviações (ex: "ML" → "Machine Learning", "CFD" → "Computational Fluid Dynamics")
- Remova duplicatas
- Máximo 30 habilidades mais relevantes
- TUDO em português brasileiro exceto nomes próprios de tecnologias
- Se a URL do LinkedIn for fornecida mas você não conseguir acessá-la, analise o texto disponível e retorne o que puder inferir da URL`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: "Você é um assistente especializado em extrair informações de perfis profissionais. Retorne APENAS JSON válido." },
          { role: "user", content: prompt },
        ],
        response_format: { type: "json_object" },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Limite de requisições atingido. Tente novamente." }), {
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

    const extracted = JSON.parse(content);

    return new Response(JSON.stringify(extracted), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("extract-profile error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Erro desconhecido" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
