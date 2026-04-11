import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Link2, FileText, MessageSquare, Upload, X, Zap, Layers } from 'lucide-react';
import { useCareer } from '@/contexts/CareerContext';
import type { AnalysisMode } from '@/types/career';

export default function InputStep() {
  const { profile, updateProfile, setStep, mode, setMode } = useCareer();
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || '');
  const [freeText, setFreeText] = useState(profile.freeText);
  const [cvFileName, setCvFileName] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCvFileName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => {
      updateProfile({ cvText: ev.target?.result as string });
    };
    reader.readAsText(file);
  };

  const canProceed = freeText.trim().length >= 20;

  const handleNext = () => {
    updateProfile({ freeText, linkedinUrl: linkedinUrl || undefined });
    if (mode === 'quick') {
      setStep('analyzing');
    } else {
      setStep('profile');
    }
  };

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
            Step 1 of {mode === 'quick' ? 2 : 4}
          </div>
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
            Tell us about yourself
          </h2>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Describe your skills, experience, and interests. The more detail, the better your analysis.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex rounded-xl bg-card border border-border p-1">
            {([
              { value: 'quick' as AnalysisMode, label: 'Quick Mode', icon: Zap, desc: 'Fast input → instant results' },
              { value: 'full' as AnalysisMode, label: 'Full Mode', icon: Layers, desc: 'Includes behavioral test' },
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
          {mode === 'quick' ? 'Skip the behavioral test for faster results.' : 'Full analysis with behavioral assessment for deeper insights.'}
        </p>

        {/* Free text input */}
        <div className="card-elevated p-6 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="w-5 h-5 text-highlight" />
            <h3 className="font-heading font-semibold text-foreground">Your Professional Profile</h3>
          </div>
          <textarea
            value={freeText}
            onChange={(e) => setFreeText(e.target.value)}
            placeholder="Example: I have 5 years of experience in marketing, specializing in digital campaigns and data analytics. I'm skilled in Google Ads, SEO, and A/B testing. I enjoy creative problem-solving and have recently been exploring product management..."
            className="w-full h-40 bg-surface rounded-lg border border-border p-4 text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring resize-none transition-all"
          />
          <p className="text-xs text-muted-foreground mt-2">
            {freeText.length < 20
              ? `Minimum 20 characters (${20 - freeText.length} more needed)`
              : '✓ Looking good!'}
          </p>
        </div>

        {/* Optional inputs */}
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <Link2 className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-heading text-sm font-medium text-foreground">LinkedIn URL</h4>
              <span className="text-xs text-muted-foreground ml-auto">Optional</span>
            </div>
            <input
              type="url"
              value={linkedinUrl}
              onChange={(e) => setLinkedinUrl(e.target.value)}
              placeholder="https://linkedin.com/in/..."
              className="w-full bg-surface rounded-lg border border-border px-3 py-2.5 text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
            />
          </div>

          <div className="glass-card p-5">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-muted-foreground" />
              <h4 className="font-heading text-sm font-medium text-foreground">Upload CV</h4>
              <span className="text-xs text-muted-foreground ml-auto">Optional</span>
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
                Choose file
              </button>
            )}
          </div>
        </div>

        <div className="flex justify-center">
          <motion.button
            onClick={handleNext}
            disabled={!canProceed}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl accent-gradient text-accent-foreground font-heading font-semibold disabled:opacity-40 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-shadow"
            whileHover={canProceed ? { scale: 1.02 } : {}}
            whileTap={canProceed ? { scale: 0.98 } : {}}
          >
            {mode === 'quick' ? 'Analyze Now' : 'Continue'}
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
