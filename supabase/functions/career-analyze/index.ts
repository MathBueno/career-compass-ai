import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { profile, oceanScores } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const systemPrompt = `You are an expert career advisor AI. Analyze the user's professional profile and behavioral assessment to provide comprehensive career guidance.

CRITICAL RULES:
- Generate roles DYNAMICALLY based on the profile. Do NOT use a static list.
- Cover ALL industries, not just tech.
- Do NOT suggest job openings. Focus on career directions and self-improvement.
- Be specific and insightful, not generic.
- Provide strong recommendations, not neutral ones.

Return a JSON object with this EXACT structure:
{
  "profileSummary": "A compelling 2-3 sentence summary of the person's professional identity",
  "inference": {
    "seniorityLevel": "junior|mid|senior|lead",
    "profileType": "e.g. analytical-creative, strategic-operational",
    "generalistVsSpecialist": "generalist|specialist|hybrid",
    "profileClarity": "low|medium|high",
    "inconsistencies": ["any detected inconsistencies between skills/interests/behavior"]
  },
  "behavioralProfile": {
    "scores": { "openness": number, "conscientiousness": number, "extraversion": number, "agreeableness": number, "emotionalStability": number },
    "summary": "Human-readable personality interpretation for work context",
    "workTendencies": ["analytical", "creative", "structured", "social", "strategic"]
  },
  "roleMatches": [
    {
      "roleName": "Dynamic role name",
      "compatibility": 0-100,
      "seniority": "junior|mid|senior|lead",
      "technicalMatch": 0-100,
      "behavioralMatch": 0-100,
      "explanation": "Why this role fits",
      "presentSkills": ["skills the user already has"],
      "missingSkills": {
        "hard": ["missing technical skills"],
        "soft": ["missing soft skills"],
        "languages": ["missing languages if relevant"]
      },
      "effortLevel": "low|medium|high",
      "estimatedTime": "e.g. 3-6 months"
    }
  ],
  "careerDirections": [
    {
      "name": "Direction name e.g. Product, Data, Marketing",
      "compatibility": 0-100,
      "roles": [],
      "isComfortZone": true/false,
      "isGrowthZone": true/false
    }
  ],
  "skillSimulations": [
    {
      "skill": "Skill name",
      "currentMatch": number,
      "projectedMatch": number,
      "affectedRoles": ["role names"]
    }
  ],
  "riskInsights": [
    {
      "role": "Role or area name",
      "riskLevel": "low|medium|high",
      "reason": "Why there's a risk of frustration or misalignment",
      "recommendation": "Strong, specific recommendation"
    }
  ],
  "transferableSkills": ["skills that work across multiple roles"],
  "fastestPaths": ["specific actionable career path suggestions"]
}

Generate 5-8 role matches across different industries. Generate 4-6 career directions. Generate 3-5 skill simulations. Generate 2-4 risk insights. Be bold and specific in your analysis.`;

    const userMessage = `
PROFESSIONAL PROFILE:
${profile.freeText}

${profile.linkedinUrl ? `LinkedIn: ${profile.linkedinUrl}` : ''}
${profile.cvText ? `CV Content: ${profile.cvText.substring(0, 2000)}` : ''}

HARD SKILLS: ${profile.hardSkills?.map((s: any) => `${s.name} (${s.level})`).join(', ') || 'Not specified'}
SOFT SKILLS: ${profile.softSkills?.map((s: any) => `${s.name} (${s.level})`).join(', ') || 'Not specified'}
LANGUAGES: ${profile.languages?.join(', ') || 'Not specified'}
COURSES: ${profile.courses?.join(', ') || 'Not specified'}
CERTIFICATIONS: ${profile.certifications?.join(', ') || 'Not specified'}

BEHAVIORAL ASSESSMENT (Big Five OCEAN, 1-5 scale):
- Openness: ${oceanScores.openness}
- Conscientiousness: ${oceanScores.conscientiousness}
- Extraversion: ${oceanScores.extraversion}
- Agreeableness: ${oceanScores.agreeableness}
- Emotional Stability: ${oceanScores.emotionalStability}

Analyze this profile comprehensively and return the structured JSON career analysis.`;

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
        return new Response(JSON.stringify({ error: "Rate limited. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const errText = await response.text();
      console.error("AI gateway error:", response.status, errText);
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const aiResponse = await response.json();
    const content = aiResponse.choices?.[0]?.message?.content;
    
    if (!content) throw new Error("No content in AI response");

    const analysis = JSON.parse(content);

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("career-analyze error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
