import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight, ChevronDown, ChevronUp, Zap, Shield, Target, Compass, Brain, BarChart3, RefreshCw, ListOrdered, GitCompare, ShieldCheck, Award } from 'lucide-react';
import { useState } from 'react';
import { useCareer } from '@/contexts/CareerContext';
import type { RoleMatch, CareerDirection, SkillSimulation, RiskInsight, SkillValidation, ImprovementStep, CareerPathComparison, ConfidenceLevel, ReadinessLevel } from '@/types/career';

function ConfidenceBadge({ level }: { level: ConfidenceLevel }) {
  const styles = { low: 'bg-destructive/10 text-destructive', medium: 'bg-warning-soft text-warning', high: 'bg-success-soft text-success' };
  return <span className={`text-xs px-2 py-0.5 rounded font-medium capitalize ${styles[level]}`}>
    {level === 'low' ? 'Baixa' : level === 'medium' ? 'Média' : 'Alta'} confiança
  </span>;
}

function ReadinessBadge({ level }: { level: ReadinessLevel }) {
  const map = {
    not_ready: { label: 'Não Pronto', cls: 'bg-destructive/10 text-destructive' },
    almost_ready: { label: 'Quase Pronto', cls: 'bg-warning-soft text-warning' },
    ready: { label: 'Pronto', cls: 'bg-success-soft text-success' },
  };
  const { label, cls } = map[level] || map.not_ready;
  return <span className={`text-xs px-2 py-0.5 rounded font-medium ${cls}`}>{label}</span>;
}

function CompatibilityRing({ value, size = 60 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 75 ? 'hsl(160, 60%, 40%)' : value >= 50 ? 'hsl(38, 90%, 50%)' : 'hsl(0, 72%, 55%)';
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(215, 20%, 88%)" strokeWidth="4" />
        <motion.circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }} animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-heading font-bold text-foreground">{value}%</span>
    </div>
  );
}

function RoleCard({ role, index }: { role: RoleMatch; index: number }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <motion.div className="card-elevated p-5 cursor-pointer" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} onClick={() => setExpanded(!expanded)}>
      <div className="flex items-start gap-4">
        <CompatibilityRing value={role.compatibility} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-heading font-bold text-foreground">{role.roleName}</h3>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground capitalize">{role.seniority}</span>
            <ReadinessBadge level={role.readiness} />
            <ConfidenceBadge level={role.confidence} />
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{role.explanation}</p>
          <div className="flex gap-4 mt-3 flex-wrap">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-highlight" />
              <span className="text-xs text-muted-foreground">Técnico: {role.technicalMatch}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Comportamental: {role.behavioralMatch}%</span>
            </div>
            <span className={`text-xs px-2 py-0.5 rounded ${role.effortLevel === 'low' ? 'bg-success-soft text-success' : role.effortLevel === 'medium' ? 'bg-warning-soft text-warning' : 'bg-destructive/10 text-destructive'}`}>
              {role.effortLevel === 'low' ? 'Baixo' : role.effortLevel === 'medium' ? 'Médio' : 'Alto'} esforço
            </span>
          </div>
        </div>
        <button className="text-muted-foreground mt-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>
      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 pt-4 border-t border-border space-y-3">
          <div>
            <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Habilidades que Você Tem</h4>
            <div className="flex flex-wrap gap-1.5">
              {role.presentSkills.map(s => <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-success-soft text-success text-xs"><CheckCircle2 className="w-3 h-3" />{s}</span>)}
            </div>
          </div>
          {role.missingSkills.length > 0 && (
            <div>
              <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Habilidades a Desenvolver</h4>
              <div className="flex flex-wrap gap-1.5">
                {role.missingSkills.map(s => <span key={s} className="px-2 py-1 rounded bg-warning-soft text-warning text-xs">{s}</span>)}
              </div>
            </div>
          )}
          {role.criticalGaps.length > 0 && (
            <div>
              <h4 className="text-xs font-heading font-semibold text-destructive mb-1.5 uppercase tracking-wider">⚠ Gaps Críticos (Bloqueadores)</h4>
              <div className="flex flex-wrap gap-1.5">
                {role.criticalGaps.map(s => <span key={s} className="px-2 py-1 rounded bg-destructive/10 text-destructive text-xs font-medium">{s}</span>)}
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">⏱ Tempo estimado para 100%: <strong className="text-foreground">{role.estimatedTime}</strong></p>
        </motion.div>
      )}
    </motion.div>
  );
}

function DirectionBar({ direction }: { direction: CareerDirection }) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span className="font-heading font-semibold text-sm text-foreground">{direction.name}</span>
          {direction.isComfortZone && <span className="text-xs px-1.5 py-0.5 rounded bg-success-soft text-success">Conforto</span>}
          {direction.isGrowthZone && <span className="text-xs px-1.5 py-0.5 rounded bg-highlight-soft text-highlight">Crescimento</span>}
        </div>
        <div className="progress-bar h-1.5">
          <motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${direction.compatibility}%` }} transition={{ duration: 1, ease: 'easeOut' }} />
        </div>
      </div>
      <span className="font-heading font-bold text-sm text-foreground">{direction.compatibility}%</span>
    </div>
  );
}

function SimulationCard({ sim }: { sim: SkillSimulation }) {
  const gain = sim.projectedMatch - sim.currentMatch;
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50">
      <Zap className="w-5 h-5 text-warning flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-body text-foreground">Aprender <strong className="text-highlight">{sim.skill}</strong></p>
        <p className="text-xs text-muted-foreground">Match: {sim.currentMatch}% → <strong className="text-success">{sim.projectedMatch}%</strong> (+{gain}%)</p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-success flex-shrink-0" />
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskInsight }) {
  const Icon = risk.riskLevel === 'high' ? AlertTriangle : risk.riskLevel === 'medium' ? Shield : CheckCircle2;
  const levelColor = risk.riskLevel === 'high' ? 'text-destructive' : risk.riskLevel === 'medium' ? 'text-warning' : 'text-success';
  const riskLabel = risk.riskLevel === 'high' ? 'Alto' : risk.riskLevel === 'medium' ? 'Médio' : 'Baixo';
  return (
    <div className="p-3 rounded-lg bg-card border border-border/50">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${levelColor}`} />
        <span className="font-heading text-sm font-semibold text-foreground">{risk.role}</span>
        <span className={`text-xs ${levelColor}`}>{riskLabel} risco</span>
      </div>
      <p className="text-xs text-muted-foreground">{risk.reason}</p>
      <p className="text-xs text-highlight mt-1">💡 {risk.recommendation}</p>
    </div>
  );
}

function SkillValidationCard({ validation }: { validation: SkillValidation }) {
  const reliabilityColor = validation.reliability === 'high' ? 'text-success' : validation.reliability === 'medium' ? 'text-warning' : 'text-destructive';
  const reliabilityLabel = validation.reliability === 'high' ? 'Alta' : validation.reliability === 'medium' ? 'Média' : 'Baixa';
  return (
    <div className="p-3 rounded-lg bg-card border border-border/50">
      <div className="flex items-center gap-2 mb-1">
        <ShieldCheck className={`w-4 h-4 ${reliabilityColor}`} />
        <span className="font-heading text-sm font-semibold text-foreground">{validation.skill}</span>
        <span className={`text-xs capitalize ${reliabilityColor}`}>{reliabilityLabel} confiabilidade</span>
      </div>
      <div className="flex gap-3 mt-1 mb-1">
        <span className={`text-xs ${validation.declared ? 'text-success' : 'text-muted-foreground'}`}>{validation.declared ? '✓' : '✗'} Declarada</span>
        <span className={`text-xs ${validation.evidencedByExperience ? 'text-success' : 'text-muted-foreground'}`}>{validation.evidencedByExperience ? '✓' : '✗'} Evidenciada</span>
        <span className={`text-xs ${validation.alignedWithBehavior ? 'text-success' : 'text-muted-foreground'}`}>{validation.alignedWithBehavior ? '✓' : '✗'} Alinhada</span>
      </div>
      <p className="text-xs text-muted-foreground">{validation.note}</p>
    </div>
  );
}

function ImprovementPlanSection({ steps }: { steps: ImprovementStep[] }) {
  return (
    <div className="space-y-2">
      {steps.map(step => {
        const impactColor = step.impact === 'high' ? 'bg-success-soft text-success' : step.impact === 'medium' ? 'bg-warning-soft text-warning' : 'bg-secondary text-muted-foreground';
        const impactLabel = step.impact === 'high' ? 'Alto' : step.impact === 'medium' ? 'Médio' : 'Baixo';
        return (
          <div key={step.order} className="flex gap-3 p-3 rounded-lg bg-card border border-border/50">
            <div className="flex-shrink-0 w-7 h-7 rounded-full bg-highlight flex items-center justify-center text-white text-xs font-bold">{step.order}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                <span className="font-heading text-sm font-semibold text-foreground">{step.action}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${impactColor}`}>{impactLabel} impacto</span>
              </div>
              <p className="text-xs text-muted-foreground">Skill: <strong className="text-highlight">{step.skill}</strong> · {step.timeEstimate}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{step.reason}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ComparisonCard({ comparison }: { comparison: CareerPathComparison }) {
  const effortLabel = (l: ConfidenceLevel) => l === 'low' ? 'Baixo' : l === 'medium' ? 'Médio' : 'Alto';
  const effortColors = { low: 'text-success', medium: 'text-warning', high: 'text-destructive' };
  return (
    <div className="p-4 rounded-lg bg-card border border-border/50">
      <div className="grid grid-cols-2 gap-4 mb-3">
        <div className="text-center p-3 rounded-lg bg-secondary">
          <h4 className="font-heading font-bold text-foreground text-sm mb-2">{comparison.pathA}</h4>
          <p className="text-xs text-muted-foreground">Compatibilidade: <strong className="text-foreground">{comparison.compatibilityA}%</strong></p>
          <p className="text-xs text-muted-foreground">Tempo: <strong className="text-foreground">{comparison.timeA}</strong></p>
          <p className={`text-xs ${effortColors[comparison.effortA]}`}>{effortLabel(comparison.effortA)} esforço</p>
        </div>
        <div className="text-center p-3 rounded-lg bg-secondary">
          <h4 className="font-heading font-bold text-foreground text-sm mb-2">{comparison.pathB}</h4>
          <p className="text-xs text-muted-foreground">Compatibilidade: <strong className="text-foreground">{comparison.compatibilityB}%</strong></p>
          <p className="text-xs text-muted-foreground">Tempo: <strong className="text-foreground">{comparison.timeB}</strong></p>
          <p className={`text-xs ${effortColors[comparison.effortB]}`}>{effortLabel(comparison.effortB)} esforço</p>
        </div>
      </div>
      <p className="text-sm text-highlight font-body">💡 {comparison.verdict}</p>
    </div>
  );
}

export default function ResultsStep() {
  const { analysis, setStep } = useCareer();
  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-soft text-success text-sm font-medium mb-4">
            ✓ Análise Concluída
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Seu Relatório de Inteligência de Carreira
          </h1>
        </motion.div>

        {/* Summary */}
        <motion.div className="card-elevated p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Resumo do Perfil</h2>
            <ConfidenceBadge level={analysis.overallConfidence} />
          </div>
          <p className="text-sm font-body text-muted-foreground leading-relaxed">{analysis.profileSummary}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            {[
              { label: 'Senioridade', value: analysis.inference.seniorityLevel },
              { label: 'Tipo de Perfil', value: analysis.inference.profileType },
              { label: 'Orientação', value: analysis.inference.generalistVsSpecialist },
              { label: 'Clareza', value: analysis.inference.profileClarity === 'high' ? 'Alta' : analysis.inference.profileClarity === 'medium' ? 'Média' : 'Baixa' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-lg bg-secondary text-center">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="font-heading font-bold text-foreground capitalize">{item.value}</p>
              </div>
            ))}
          </div>
          {analysis.inference.inconsistencies?.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-warning-soft border border-warning/20">
              <p className="text-xs font-heading font-semibold text-warning mb-1">⚠ Inconsistências Detectadas</p>
              <ul className="space-y-1">
                {analysis.inference.inconsistencies.map((inc, i) => (
                  <li key={i} className="text-xs text-muted-foreground">• {inc}</li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* Behavioral */}
        <motion.div className="card-elevated p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Perfil Comportamental (OCEAN)</h2>
          </div>
          <div className="space-y-3 mb-4">
            {[
              { label: 'Abertura', value: analysis.behavioralProfile.scores.openness },
              { label: 'Conscienciosidade', value: analysis.behavioralProfile.scores.conscientiousness },
              { label: 'Extroversão', value: analysis.behavioralProfile.scores.extraversion },
              { label: 'Amabilidade', value: analysis.behavioralProfile.scores.agreeableness },
              { label: 'Estabilidade Emocional', value: analysis.behavioralProfile.scores.emotionalStability },
            ].map(trait => (
              <div key={trait.label} className="flex items-center gap-3">
                <span className="text-sm font-body text-muted-foreground w-44">{trait.label}</span>
                <div className="flex-1 progress-bar h-2">
                  <motion.div className="progress-bar-fill" initial={{ width: 0 }} animate={{ width: `${(trait.value / 5) * 100}%` }} transition={{ duration: 0.8 }} />
                </div>
                <span className="text-sm font-heading font-bold text-foreground w-8 text-right">{trait.value.toFixed(1)}</span>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{analysis.behavioralProfile.summary}</p>
          <div className="flex flex-wrap gap-2 mt-3">
            {analysis.behavioralProfile.workTendencies.map(t => (
              <span key={t} className="px-2 py-1 rounded bg-highlight-soft text-highlight text-xs capitalize">{t}</span>
            ))}
          </div>
        </motion.div>

        {/* Roles */}
        <motion.div className="mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Melhores Correspondências</h2>
          </div>
          <div className="space-y-3">
            {analysis.roleMatches.map((role, i) => <RoleCard key={role.roleName} role={role} index={i} />)}
          </div>
        </motion.div>

        {/* Directions */}
        <motion.div className="card-elevated p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Direções de Carreira</h2>
          </div>
          <div className="space-y-3">
            {analysis.careerDirections.map(d => <DirectionBar key={d.name} direction={d} />)}
          </div>
        </motion.div>

        {/* Comparisons */}
        {analysis.careerComparisons?.length > 0 && (
          <motion.div className="card-elevated p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.27 }}>
            <div className="flex items-center gap-2 mb-4">
              <GitCompare className="w-5 h-5 text-highlight" />
              <h2 className="font-heading font-bold text-foreground">Comparação de Caminhos</h2>
            </div>
            <div className="space-y-3">
              {analysis.careerComparisons.map((c, i) => <ComparisonCard key={i} comparison={c} />)}
            </div>
          </motion.div>
        )}

        {/* Improvement Plan */}
        {analysis.improvementPlan?.length > 0 && (
          <motion.div className="card-elevated p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <div className="flex items-center gap-2 mb-4">
              <ListOrdered className="w-5 h-5 text-highlight" />
              <h2 className="font-heading font-bold text-foreground">Plano de Melhoria</h2>
              <span className="text-xs text-muted-foreground ml-auto">Priorizado por impacto</span>
            </div>
            <ImprovementPlanSection steps={analysis.improvementPlan} />
          </motion.div>
        )}

        {/* Simulations */}
        {analysis.skillSimulations?.length > 0 && (
          <motion.div className="card-elevated p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.33 }}>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-highlight" />
              <h2 className="font-heading font-bold text-foreground">Simulação de Impacto</h2>
              <span className="text-xs text-muted-foreground ml-auto">E se você aprendesse...</span>
            </div>
            <div className="space-y-2">
              {analysis.skillSimulations.map(sim => <SimulationCard key={sim.skill} sim={sim} />)}
            </div>
          </motion.div>
        )}

        {/* Validations */}
        {analysis.skillValidations?.length > 0 && (
          <motion.div className="card-elevated p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
            <div className="flex items-center gap-2 mb-4">
              <Award className="w-5 h-5 text-highlight" />
              <h2 className="font-heading font-bold text-foreground">Validação de Habilidades</h2>
              <span className="text-xs text-muted-foreground ml-auto">Cruzado com seu perfil</span>
            </div>
            <div className="space-y-2">
              {analysis.skillValidations.map(v => <SkillValidationCard key={v.skill} validation={v} />)}
            </div>
          </motion.div>
        )}

        {/* Risks */}
        {analysis.riskInsights?.length > 0 && (
          <motion.div className="card-elevated p-6 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.38 }}>
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-warning" />
              <h2 className="font-heading font-bold text-foreground">Riscos e Insights</h2>
            </div>
            <div className="space-y-2">
              {analysis.riskInsights.map(risk => <RiskCard key={risk.role} risk={risk} />)}
            </div>
          </motion.div>
        )}

        {/* Fastest Paths */}
        {analysis.fastestPaths?.length > 0 && (
          <motion.div className="card-elevated p-6 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-success" />
              <h2 className="font-heading font-bold text-foreground">Caminhos Mais Rápidos</h2>
            </div>
            <ul className="space-y-2">
              {analysis.fastestPaths.map((path, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowUpRight className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />{path}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        <div className="text-center">
          <button onClick={() => setStep('landing')} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-heading font-medium hover:bg-secondary transition-colors">
            <RefreshCw className="w-4 h-4" /> Recomeçar
          </button>
        </div>
      </div>
    </div>
  );
}
