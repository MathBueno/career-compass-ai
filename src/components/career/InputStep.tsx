import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Link2, MessageSquare, Upload, X, Zap, Layers, FileText, Loader2 } from 'lucide-react';
import { useCareer } from '@/contexts/CareerContext';
import { supabase } from '@/integrations/supabase/client';
import SkillAutocomplete from './SkillAutocomplete';
import type { AnalysisMode } from '@/types/career';
import { toast } from '@/hooks/use-toast';

export default function InputStep() {
  const { profile, updateProfile, setStep, mode, setMode, addSkill, removeSkill } = useCareer();
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || '');
  const [freeText, setFreeText] = useState(profile.freeText);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFileName(file.name);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result as string;
      updateProfile({ cvText: text });
      // Auto-extract skills from CV
      await extractProfile(undefined, text);
    };
    reader.readAsText(file);
  };

  const extractProfile = async (url?: string, cvText?: string) => {
    const linkedIn = url || linkedinUrl;
    if (!linkedIn && !cvText) return;

    setIsExtracting(true);
    try {
      const { data, error } = await supabase.functions.invoke('extract-profile', {
        body: { linkedinUrl: linkedIn || undefined, cvText: cvText || undefined },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      // Auto-fill extracted skills
      if (data?.skills && Array.isArray(data.skills)) {
        data.skills.forEach((s: { name: string; category: 'hard' | 'soft' }) => {
          if (s.name && s.category) {
            addSkill(s.name, s.category);
          }
        });
      }

      // Auto-fill summary if free text is empty
      if (data?.summary && !freeText.trim()) {
        setFreeText(data.summary);
        updateProfile({ freeText: data.summary });
      }

      toast({
        title: '✓ Perfil extraído',
        description: `${data?.skills?.length || 0} habilidades encontradas`,
      });
    } catch (err: any) {
      console.error('Extraction failed:', err);
      toast({
        title: 'Erro na extração',
        description: err?.message || 'Não foi possível extrair o perfil.',
        variant: 'destructive',
      });
    } finally {
      setIsExtracting(false);
    }
  };

  const handleLinkedinBlur = () => {
    if (linkedinUrl.trim() && linkedinUrl.includes('linkedin.com')) {
      extractProfile(linkedinUrl);
    }
  };

  const canProceed = freeText.trim().length >= 20;

  const handleNext = () => {
    updateProfile({ freeText, linkedinUrl: linkedinUrl || undefined });
    if (mode === 'quick') {
      setStep('analyzing');
    } else {
      setStep('assessment');
    }
  };

  const totalSteps = mode === 'quick' ? 2 : 3;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-highlight-soft text-highlight text-sm font-medium mb-4">
            Passo 1 de {totalSteps}
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Conte sobre você
          </h2>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Descreva suas habilidades, experiência e interesses. Quanto mais detalhes, melhor a análise.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-card border border-border p-1">
            {([
              { value: 'quick' as AnalysisMode, label: 'Modo Rápido', icon: Zap, desc: 'Entrada rápida → resultados instantâneos' },
              { value: 'full' as AnalysisMode, label: 'Modo Completo', icon: Layers, desc: 'Inclui teste comportamental' },
            ]).map(opt => (
              <button
                key={opt.value}
                onClick={() => setMode(opt.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-heading font-medium transition-all ${
                  mode === opt.value
                    ? 'bg-highlight text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <opt.icon className="w-4 h-4" />
                {opt.label}
              </button>
            ))}
          </div>
        </div>
        <p className="text-center text-xs text-muted-foreground mb-6">
          {mode === 'quick' ? 'Pula o teste comportamental para resultados mais rápidos.' : 'Análise completa com avaliação comportamental para insights mais profundos.'}
        </p>

        {/* Free text input */}
        <div className="card-elevated p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-highlight" />
            <h3 className="font-heading font-semibold text-foreground">Seu Perfil Profissional</h3>
          </div>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Exemplo: Tenho 5 anos de experiência em marketing, especializado em campanhas digitais e análise de dados. Tenho habilidades em Google Ads, SEO e testes A/B. Gosto de resolver problemas de forma criativa e recentemente tenho explorado gestão de produtos..."
            className="w-full h-40 bg-surface rounded-lg border border-border p-4 text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {freeText.length < 20
              ? `Mínimo 20 caracteres (faltam ${20 - freeText.length})`
              : '✓ Ótimo!'}
          </p>
        </div>

        {/* Skills Autocomplete */}
        <div className="card-elevated p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-5 h-5 text-highlight" />
            <h3 className="font-heading font-semibold text-foreground">Habilidades</h3>
            <span className="text-xs text-muted-foreground ml-auto">Catálogo com autocomplete e correção</span>
          </div>
          <SkillAutocomplete
            onAdd={addSkill}
            existingSkills={profile.skills.map(s => s.name)}
          />
          {profile.skills.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              <AnimatePresence>
                {profile.skills.map(skill => (
                  <motion.span
                    key={skill.name}
                    layout
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm ${
                      skill.category === 'hard'
                        ? 'bg-highlight-soft text-highlight border-highlight/20'
                        : 'bg-success-soft text-success border-success/20'
                    }`}
                  >
                    {skill.name}
                    <button onClick={() => removeSkill(skill.name)} className="hover:opacity-70">
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>

        {/* Optional inputs */}
        <div className="grid md:grid-cols-2 gap-4 mb-4">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-heading text-sm font-medium text-foreground">LinkedIn</h4>
              <span className="text-xs text-muted-foreground ml-auto">Opcional</span>
            </div>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              onBlur={handleLinkedinBlur}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-surface rounded-lg border border-border px-3 py-2.5 text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Cole a URL e as habilidades serão extraídas automaticamente
            </p>
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-heading text-sm font-medium text-foreground">Upload CV</h4>
              <span className="text-xs text-muted-foreground ml-auto">Opcional</span>
            </div>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.txt,.doc,.docx"
              onChange={handleFileUpload}
              className="hidden"
            />
            {cvFileName ? (
              <div className="flex items-center gap-2 bg-surface rounded-lg border border-border px-3 py-2.5">
                <FileText className="w-4 h-4 text-highlight" />
                <span className="text-sm text-foreground truncate flex-1">{cvFileName}</span>
                <button onClick={() => { setCvFileName(null); updateProfile({ cvText: undefined }); }}>
                  <X className="w-4 h-4 text-muted-foreground hover:text-destructive transition-colors" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => fileRef.current?.click()}
                className="w-full flex items-center justify-center gap-2 bg-surface rounded-lg border border-dashed border-border px-3 py-2.5 text-sm text-muted-foreground hover:text-foreground hover:border-highlight/50 transition-all"
              >
                <Upload className="w-4 h-4" />
                Escolher arquivo
              </button>
            )}
          </div>
        </div>

        {/* Extraction status */}
        {isExtracting && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 p-3 mb-4 rounded-lg bg-highlight-soft text-highlight text-sm"
          >
            <Loader2 className="w-4 h-4 animate-spin" />
            Extraindo habilidades do perfil...
          </motion.div>
        )}

        <div className="flex justify-center mt-4">
          <motion.button
            onClick={handleNext}
            disabled={!canProceed || isExtracting}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl accent-gradient text-accent-foreground font-heading font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-shadow"
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
          >
            {mode === 'quick' ? 'Analisar Agora' : 'Continuar'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
