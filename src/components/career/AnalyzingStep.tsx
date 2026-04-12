import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Brain, Sparkles, Target, AlertTriangle } from 'lucide-react';
import { useCareer } from '@/contexts/CareerContext';
import { supabase } from '@/integrations/supabase/client';
import type { CareerAnalysis } from '@/types/career';

const STAGES = [
  { icon: Brain, label: 'Analisando seu perfil...' },
  { icon: Sparkles, label: 'Mapeando padrões comportamentais...' },
  { icon: Target, label: 'Gerando correspondências de carreira...' },
];

export default function AnalyzingStep() {
  const { profile, oceanScores, setAnalysis, setStep, setIsAnalyzing, mode } = useCareer();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function analyze() {
      setIsAnalyzing(true);
      setError(null);
      try {
        const { data, error: fnError } = await supabase.functions.invoke('career-analyze', {
          body: { profile, oceanScores, mode },
        });

        if (cancelled) return;
        if (fnError) throw fnError;
        if (data?.error) throw new Error(data.error);

        setAnalysis(data as CareerAnalysis);
        setStep('results');
      } catch (err: any) {
        console.error('Análise falhou:', err);
        if (!cancelled) {
          setError(err?.message || 'Erro ao analisar perfil. Tente novamente.');
        }
      } finally {
        setIsAnalyzing(false);
      }
    }

    analyze();
    return () => { cancelled = true; };
  }, []);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-4" />
          <h2 className="text-xl font-heading font-bold text-foreground mb-3">Erro na Análise</h2>
          <p className="text-sm text-muted-foreground mb-6">{error}</p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => setStep('input')}
              className="px-6 py-2.5 rounded-xl border border-border text-foreground font-heading font-medium hover:bg-secondary transition-colors"
            >
              Voltar
            </button>
            <button
              onClick={() => { setError(null); setStep('analyzing'); }}
              className="px-6 py-2.5 rounded-xl accent-gradient text-accent-foreground font-heading font-semibold"
            >
              Tentar Novamente
            </button>
          </div>
        </div>
      </div>
    );
  }

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
          Analisando Seu DNA Profissional
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

        <p className="text-xs text-muted-foreground mt-8">Isso geralmente leva 10-30 segundos</p>
      </motion.div>
    </div>
  );
}
