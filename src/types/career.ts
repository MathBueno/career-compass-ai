export interface SkillItem {
  name: string;
  level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  category: 'hard' | 'soft';
}

export interface UserProfile {
  freeText: string;
  linkedinUrl?: string;
  cvText?: string;
  hardSkills: SkillItem[];
  softSkills: SkillItem[];
  languages: string[];
  experience: string[];
  courses: string[];
  certifications: string[];
}

export interface OceanScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  emotionalStability: number;
}

export interface BehavioralProfile {
  scores: OceanScores;
  summary: string;
  workTendencies: string[];
}

export type ConfidenceLevel = 'low' | 'medium' | 'high';
export type ReadinessLevel = 'not_ready' | 'almost_ready' | 'ready';
export type AnalysisMode = 'quick' | 'full';

export interface SkillValidation {
  skill: string;
  declared: boolean;
  evidencedByExperience: boolean;
  alignedWithBehavior: boolean;
  reliability: 'low' | 'medium' | 'high';
  note: string;
}

export interface ImprovementStep {
  order: number;
  action: string;
  skill: string;
  impact: 'low' | 'medium' | 'high';
  timeEstimate: string;
  reason: string;
}

export interface RoleMatch {
  roleName: string;
  compatibility: number;
  seniority: 'junior' | 'mid' | 'senior' | 'lead';
  technicalMatch: number;
  behavioralMatch: number;
  explanation: string;
  presentSkills: string[];
  missingSkills: {
    hard: string[];
    soft: string[];
    languages: string[];
  };
  effortLevel: 'low' | 'medium' | 'high';
  estimatedTime: string;
  confidence: ConfidenceLevel;
  readiness: ReadinessLevel;
  criticalGaps: string[];
}

export interface CareerDirection {
  name: string;
  compatibility: number;
  roles: RoleMatch[];
  isComfortZone: boolean;
  isGrowthZone: boolean;
}

export interface SkillSimulation {
  skill: string;
  currentMatch: number;
  projectedMatch: number;
  affectedRoles: string[];
}

export interface RiskInsight {
  role: string;
  riskLevel: 'low' | 'medium' | 'high';
  reason: string;
  recommendation: string;
}

export interface ProfileInference {
  seniorityLevel: string;
  profileType: string;
  generalistVsSpecialist: string;
  profileClarity: 'low' | 'medium' | 'high';
  inconsistencies: string[];
}

export interface CareerPathComparison {
  pathA: string;
  pathB: string;
  effortA: 'low' | 'medium' | 'high';
  effortB: 'low' | 'medium' | 'high';
  timeA: string;
  timeB: string;
  compatibilityA: number;
  compatibilityB: number;
  verdict: string;
}

export interface CareerAnalysis {
  profileSummary: string;
  overallConfidence: ConfidenceLevel;
  inference: ProfileInference;
  behavioralProfile: BehavioralProfile;
  roleMatches: RoleMatch[];
  careerDirections: CareerDirection[];
  skillSimulations: SkillSimulation[];
  riskInsights: RiskInsight[];
  transferableSkills: string[];
  fastestPaths: string[];
  skillValidations: SkillValidation[];
  improvementPlan: ImprovementStep[];
  careerComparisons: CareerPathComparison[];
}

export type WizardStep = 'landing' | 'input' | 'profile' | 'assessment' | 'analyzing' | 'results';
