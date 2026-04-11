import React, { createContext, useContext, useState, useCallback } from 'react';
import type { UserProfile, OceanScores, CareerAnalysis, WizardStep, SkillItem, AnalysisMode } from '@/types/career';

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
  addSkill: (skill: SkillItem) => void;
  removeSkill: (name: string, category: 'hard' | 'soft') => void;
  mode: AnalysisMode;
  setMode: (mode: AnalysisMode) => void;
}

const CareerContext = createContext<CareerContextType | null>(null);

const defaultProfile: UserProfile = {
  freeText: '',
  hardSkills: [],
  softSkills: [],
  languages: [],
  experience: [],
  courses: [],
  certifications: [],
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

  const addSkill = useCallback((skill: SkillItem) => {
    setProfile(prev => {
      const key = skill.category === 'hard' ? 'hardSkills' : 'softSkills';
      if (prev[key].some(s => s.name.toLowerCase() === skill.name.toLowerCase())) return prev;
      return { ...prev, [key]: [...prev[key], skill] };
    });
  }, []);

  const removeSkill = useCallback((name: string, category: 'hard' | 'soft') => {
    setProfile(prev => {
      const key = category === 'hard' ? 'hardSkills' : 'softSkills';
      return { ...prev, [key]: prev[key].filter(s => s.name !== name) };
    });
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
