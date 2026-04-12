export type SkillCategory = 'hard' | 'soft';

export interface NormalizedSkill {
  name: string;
  category: SkillCategory;
}

export interface UserProfile {
  freeText: string;
  linkedinUrl?: string;
  cvText?: string;
  skills: NormalizedSkill[];
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
  reliability: ConfidenceLevel;
  note: string;
}

export interface ImprovementStep {
  order: number;
  action: string;
  skill: string;
  impact: ConfidenceLevel;
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
  missingSkills: string[];
  criticalGaps: string[];
  effortLevel: ConfidenceLevel;
  estimatedTime: string;
  confidence: ConfidenceLevel;
  readiness: ReadinessLevel;
}

export interface CareerDirection {
  name: string;
  compatibility: number;
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
  riskLevel: ConfidenceLevel;
  reason: string;
  recommendation: string;
}

export interface ProfileInference {
  seniorityLevel: string;
  profileType: string;
  generalistVsSpecialist: string;
  profileClarity: ConfidenceLevel;
  inconsistencies: string[];
}

export interface CareerPathComparison {
  pathA: string;
  pathB: string;
  effortA: ConfidenceLevel;
  effortB: ConfidenceLevel;
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

export type WizardStep = 'landing' | 'input' | 'assessment' | 'analyzing' | 'results';
