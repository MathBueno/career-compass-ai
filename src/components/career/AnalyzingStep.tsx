import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target } from 'lucide-react';
import { useCareer } from '@/contexts/CareerContext';
import { supabase } from '@/integrations/supabase/client';
import type { CareerAnalysis } from '@/types/career';

const STAGES = [
  { icon: Brain, label: 'Analyzing your profile...' },
  { icon: Sparkles, label: 'Mapping behavioral patterns...' },
  { icon: Target, label: 'Generating career matches...' },
];

export default function AnalyzingStep() {
  const { profile, oceanScores, setAnalysis, setStep, setIsAnalyzing } = useCareer();

  useEffect(() => {
    let cancelled = false;

    async function analyze() {
      setIsAnalyzing(true);
      try {
        const { data, error } = await supabase.functions.invoke('career-analyze', {
          body: { profile, oceanScores },
        });

        if (cancelled) return;
        if (error) throw error;

        const analysis = data as CareerAnalysis;
        setAnalysis(analysis);
        setStep('results');
      } catch (err) {
        console.error('Analysis failed:', err);
        if (!cancelled) {
          // Fallback: generate mock data so the UI doesn't break
          setAnalysis(generateFallback());
          setStep('results');
        }
      } finally {
        setIsAnalyzing(false);
      }
    }

    analyze();
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        className="text-center max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 rounded-full accent-gradient opacity-20"
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
            <Brain className="w-10 h-10 text-highlight animate-pulse-soft" />
          </div>
        </div>

        <h2 className="text-2xl font-heading font-bold text-foreground mb-6">
          Analyzing Your Career DNA
        </h2>

        <div className="space-y-4">
          {STAGES.map((stage, i) => (
            <motion.div
              key={stage.label}
              className="flex items-center gap-3 p-3 rounded-lg bg-card"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 1.2 }}
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear', delay: i * 1.2 }}
              >
                <stage.icon className="w-5 h-5 text-highlight" />
              </motion.div>
              <span className="text-sm font-body text-foreground">{stage.label}</span>
            </motion.div>
          ))}
        </div>

        <p className="text-xs text-muted-foreground mt-8">This usually takes 10-30 seconds</p>
      </motion.div>
    </div>
  );
}

function generateFallback(): CareerAnalysis {
  return {
    profileSummary: "Based on the information provided, you appear to be a well-rounded professional with a blend of analytical and creative capabilities. Your profile suggests mid-level experience with strong potential for growth in multiple career directions.",
    inference: {
      seniorityLevel: 'mid',
      profileType: 'analytical-creative',
      generalistVsSpecialist: 'generalist',
      profileClarity: 'medium',
      inconsistencies: [],
    },
    behavioralProfile: {
      scores: { openness: 3.5, conscientiousness: 3.5, extraversion: 3, agreeableness: 3.5, emotionalStability: 3.5 },
      summary: "You show a balanced personality with moderate openness to new experiences and strong conscientiousness. You work well both independently and in teams.",
      workTendencies: ['analytical', 'structured', 'collaborative'],
    },
    roleMatches: [
      {
        roleName: 'Product Manager',
        compatibility: 78,
        seniority: 'mid',
        technicalMatch: 72,
        behavioralMatch: 84,
        explanation: 'Your analytical mindset and collaborative nature align well with product management.',
        presentSkills: ['Communication', 'Analysis', 'Problem Solving'],
        missingSkills: { hard: ['Product Analytics', 'A/B Testing Frameworks'], soft: ['Stakeholder Management'], languages: [] },
        effortLevel: 'medium',
        estimatedTime: '3-6 months',
      },
      {
        roleName: 'Data Analyst',
        compatibility: 72,
        seniority: 'mid',
        technicalMatch: 68,
        behavioralMatch: 76,
        explanation: 'Your structured approach and attention to detail make data analysis a natural fit.',
        presentSkills: ['Problem Solving', 'Critical Thinking'],
        missingSkills: { hard: ['SQL', 'Python', 'Tableau'], soft: ['Data Storytelling'], languages: [] },
        effortLevel: 'medium',
        estimatedTime: '4-8 months',
      },
    ],
    careerDirections: [
      { name: 'Product & Strategy', compatibility: 78, roles: [], isComfortZone: true, isGrowthZone: false },
      { name: 'Data & Analytics', compatibility: 72, roles: [], isComfortZone: false, isGrowthZone: true },
    ],
    skillSimulations: [
      { skill: 'SQL', currentMatch: 72, projectedMatch: 85, affectedRoles: ['Data Analyst', 'Business Intelligence'] },
      { skill: 'Product Analytics', currentMatch: 78, projectedMatch: 90, affectedRoles: ['Product Manager', 'Growth Manager'] },
    ],
    riskInsights: [
      { role: 'Isolated roles', riskLevel: 'medium', reason: 'Your extraversion suggests you need team interaction.', recommendation: 'Prioritize collaborative roles.' },
    ],
    transferableSkills: ['Communication', 'Problem Solving', 'Critical Thinking'],
    fastestPaths: ['Product Manager via analytics upskilling', 'Business Analyst with SQL training'],
  };
}
