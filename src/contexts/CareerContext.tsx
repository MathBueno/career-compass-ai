import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserProfile, OceanScores, CareerAnalysis, WizardStep, NormalizedSkill, AnalysisMode } from '@/types/career';

interface CareerContextType {
  step: WizardStep;
  setStep: (step: WizardStep) => void;
  profile: UserProfile;
  updateProfile: (updates: Partial<UserProfile>) => void;
  oceanScores: OceanScores;
  setOceanScores: (scores: OceanScores) => void;
  analysis: CareerAnalysis | null;
  setAnalysis: (analysis: CareerAnalysis) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (v: boolean) => void;
  addSkill: (name: string, category: 'hard' | 'soft') => void;
  removeSkill: (name: string) => void;
  mode: AnalysisMode;
  setMode: (mode: AnalysisMode) => void;
}

const CareerContext = createContext<CareerContextType | null>(null);

const defaultProfile: UserProfile = {
  freeText: '',
  skills: [],
};

const defaultOcean: OceanScores = {
  openness: 3,
  conscientiousness: 3,
  extraversion: 3,
  agreeableness: 3,
  emotionalStability: 3,
};

export function CareerProvider({ children }: { children: React.ReactNode }) {
  const [step, setStep] = useState<WizardStep>('landing');
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [oceanScores, setOceanScores] = useState<OceanScores>(defaultOcean);
  const [analysis, setAnalysis] = useState<CareerAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mode, setMode] = useState<AnalysisMode>('full');

  const updateProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  }, []);

  const addSkill = useCallback((name: string, category: 'hard' | 'soft') => {
    setProfile(prev => {
      if (prev.skills.some(s => s.name.toLowerCase() === name.toLowerCase())) return prev;
      return { ...prev, skills: [...prev.skills, { name, category }] };
    });
  }, []);

  const removeSkill = useCallback((name: string) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s.name !== name),
    }));
  }, []);

  return (
    <CareerContext.Provider value={{
      step, setStep, profile, updateProfile, oceanScores, setOceanScores,
      analysis, setAnalysis, isAnalyzing, setIsAnalyzing, addSkill, removeSkill,
      mode, setMode,
    }}>
      {children}
    </CareerContext.Provider>
  );
}

export function useCareer() {
  const ctx = useContext(CareerContext);
  if (!ctx) throw new Error('useCareer must be used within CareerProvider');
  return ctx;
}
