import { motion } from 'framer-motion';
import { TrendingUp, AlertTriangle, CheckCircle2, ArrowUpRight, ChevronDown, ChevronUp, Zap, Shield, Target, Compass, Brain, BarChart3, RefreshCw } from 'lucide-react';
import { useState } from 'react';
import { useCareer } from '@/contexts/CareerContext';
import type { RoleMatch, CareerDirection, SkillSimulation, RiskInsight } from '@/types/career';

function CompatibilityRing({ value, size = 60 }: { value: number; size?: number }) {
  const radius = (size - 8) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;
  const color = value >= 75 ? 'hsl(160, 60%, 40%)' : value >= 50 ? 'hsl(38, 90%, 50%)' : 'hsl(0, 72%, 55%)';

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="hsl(215, 20%, 88%)" strokeWidth="4" />
        <motion.circle
          cx={size / 2} cy={size / 2} r={radius} fill="none" stroke={color} strokeWidth="4"
          strokeLinecap="round" strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: 'easeOut' }}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-sm font-heading font-bold text-foreground">{value}%</span>
    </div>
  );
}

function RoleCard({ role, index }: { role: RoleMatch; index: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      className="card-elevated p-5 cursor-pointer"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => setExpanded(!expanded)}
    >
      <div className="flex items-start gap-4">
        <CompatibilityRing value={role.compatibility} />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-heading font-bold text-foreground">{role.roleName}</h3>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-secondary text-secondary-foreground capitalize">{role.seniority}</span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">{role.explanation}</p>

          <div className="flex gap-4 mt-3">
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-highlight" />
              <span className="text-xs text-muted-foreground">Tech: {role.technicalMatch}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span className="text-xs text-muted-foreground">Behavioral: {role.behavioralMatch}%</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className={`text-xs px-2 py-0.5 rounded ${
                role.effortLevel === 'low' ? 'bg-success-soft text-success' :
                role.effortLevel === 'medium' ? 'bg-warning-soft text-warning' :
                'bg-destructive/10 text-destructive'
              }`}>{role.effortLevel} effort</span>
            </div>
          </div>
        </div>
        <button className="text-muted-foreground mt-1">
          {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {expanded && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="mt-4 pt-4 border-t border-border space-y-3"
        >
          <div>
            <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Skills You Have</h4>
            <div className="flex flex-wrap gap-1.5">
              {role.presentSkills.map(s => (
                <span key={s} className="inline-flex items-center gap-1 px-2 py-1 rounded bg-success-soft text-success text-xs">
                  <CheckCircle2 className="w-3 h-3" />{s}
                </span>
              ))}
            </div>
          </div>
          {(role.missingSkills.hard.length > 0 || role.missingSkills.soft.length > 0) && (
            <div>
              <h4 className="text-xs font-heading font-semibold text-muted-foreground mb-1.5 uppercase tracking-wider">Skills to Develop</h4>
              <div className="flex flex-wrap gap-1.5">
                {role.missingSkills.hard.map(s => (
                  <span key={s} className="px-2 py-1 rounded bg-warning-soft text-warning text-xs">{s}</span>
                ))}
                {role.missingSkills.soft.map(s => (
                  <span key={s} className="px-2 py-1 rounded bg-info-soft text-info text-xs">{s}</span>
                ))}
              </div>
            </div>
          )}
          <p className="text-xs text-muted-foreground">
            ⏱ Estimated time to reach 100%: <strong className="text-foreground">{role.estimatedTime}</strong>
          </p>
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
          {direction.isComfortZone && <span className="text-xs px-1.5 py-0.5 rounded bg-success-soft text-success">Comfort</span>}
          {direction.isGrowthZone && <span className="text-xs px-1.5 py-0.5 rounded bg-highlight-soft text-highlight">Growth</span>}
        </div>
        <div className="progress-bar h-1.5">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: 0 }}
            animate={{ width: `${direction.compatibility}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
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
        <p className="text-sm font-body text-foreground">
          Learn <strong className="text-highlight">{sim.skill}</strong>
        </p>
        <p className="text-xs text-muted-foreground">
          Match: {sim.currentMatch}% → <strong className="text-success">{sim.projectedMatch}%</strong> (+{gain}%)
        </p>
      </div>
      <ArrowUpRight className="w-4 h-4 text-success flex-shrink-0" />
    </div>
  );
}

function RiskCard({ risk }: { risk: RiskInsight }) {
  const levelIcon = risk.riskLevel === 'high' ? AlertTriangle : risk.riskLevel === 'medium' ? Shield : CheckCircle2;
  const Icon = levelIcon;
  const levelColor = risk.riskLevel === 'high' ? 'text-destructive' : risk.riskLevel === 'medium' ? 'text-warning' : 'text-success';

  return (
    <div className="p-3 rounded-lg bg-card border border-border/50">
      <div className="flex items-center gap-2 mb-1">
        <Icon className={`w-4 h-4 ${levelColor}`} />
        <span className="font-heading text-sm font-semibold text-foreground">{risk.role}</span>
        <span className={`text-xs capitalize ${levelColor}`}>{risk.riskLevel} risk</span>
      </div>
      <p className="text-xs text-muted-foreground">{risk.reason}</p>
      <p className="text-xs text-highlight mt-1">💡 {risk.recommendation}</p>
    </div>
  );
}

export default function ResultsStep() {
  const { analysis, setStep } = useCareer();
  if (!analysis) return null;

  return (
    <div className="min-h-screen bg-background px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-success-soft text-success text-sm font-medium mb-4">
            ✓ Analysis Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Your Career Intelligence Report
          </h1>
        </motion.div>

        {/* Summary */}
        <motion.div
          className="card-elevated p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <Brain className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Profile Summary</h2>
          </div>
          <p className="text-sm font-body text-muted-foreground leading-relaxed">{analysis.profileSummary}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
            <div className="p-3 rounded-lg bg-secondary text-center">
              <p className="text-xs text-muted-foreground">Seniority</p>
              <p className="font-heading font-bold text-foreground capitalize">{analysis.inference.seniorityLevel}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary text-center">
              <p className="text-xs text-muted-foreground">Profile Type</p>
              <p className="font-heading font-bold text-foreground capitalize">{analysis.inference.profileType}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary text-center">
              <p className="text-xs text-muted-foreground">Orientation</p>
              <p className="font-heading font-bold text-foreground capitalize">{analysis.inference.generalistVsSpecialist}</p>
            </div>
            <div className="p-3 rounded-lg bg-secondary text-center">
              <p className="text-xs text-muted-foreground">Clarity</p>
              <p className="font-heading font-bold text-foreground capitalize">{analysis.inference.profileClarity}</p>
            </div>
          </div>
        </motion.div>

        {/* Behavioral Profile */}
        <motion.div
          className="card-elevated p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
        >
          <div className="flex items-center gap-2 mb-3">
            <BarChart3 className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Behavioral Profile (OCEAN)</h2>
          </div>
          <div className="space-y-3 mb-4">
            {[
              { label: 'Openness', value: analysis.behavioralProfile.scores.openness },
              { label: 'Conscientiousness', value: analysis.behavioralProfile.scores.conscientiousness },
              { label: 'Extraversion', value: analysis.behavioralProfile.scores.extraversion },
              { label: 'Agreeableness', value: analysis.behavioralProfile.scores.agreeableness },
              { label: 'Emotional Stability', value: analysis.behavioralProfile.scores.emotionalStability },
            ].map(trait => (
              <div key={trait.label} className="flex items-center gap-3">
                <span className="text-sm font-body text-muted-foreground w-40">{trait.label}</span>
                <div className="flex-1 progress-bar h-2">
                  <motion.div
                    className="progress-bar-fill"
                    initial={{ width: 0 }}
                    animate={{ width: `${(trait.value / 5) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  />
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

        {/* Role Matches */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Best Role Matches</h2>
          </div>
          <div className="space-y-3">
            {analysis.roleMatches.map((role, i) => (
              <RoleCard key={role.roleName} role={role} index={i} />
            ))}
          </div>
        </motion.div>

        {/* Career Directions */}
        <motion.div
          className="card-elevated p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <Compass className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Career Directions</h2>
          </div>
          <div className="space-y-3">
            {analysis.careerDirections.map(d => (
              <DirectionBar key={d.name} direction={d} />
            ))}
          </div>
        </motion.div>

        {/* Skill Simulations */}
        <motion.div
          className="card-elevated p-6 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-highlight" />
            <h2 className="font-heading font-bold text-foreground">Skill Impact Simulation</h2>
            <span className="text-xs text-muted-foreground ml-auto">What if you learned...</span>
          </div>
          <div className="space-y-2">
            {analysis.skillSimulations.map(sim => (
              <SimulationCard key={sim.skill} sim={sim} />
            ))}
          </div>
        </motion.div>

        {/* Risk & Insights */}
        {analysis.riskInsights.length > 0 && (
          <motion.div
            className="card-elevated p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Shield className="w-5 h-5 text-warning" />
              <h2 className="font-heading font-bold text-foreground">Risk & Insights</h2>
            </div>
            <div className="space-y-2">
              {analysis.riskInsights.map(risk => (
                <RiskCard key={risk.role} risk={risk} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Fastest Paths */}
        {analysis.fastestPaths.length > 0 && (
          <motion.div
            className="card-elevated p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center gap-2 mb-3">
              <Zap className="w-5 h-5 text-success" />
              <h2 className="font-heading font-bold text-foreground">Fastest Career Paths</h2>
            </div>
            <ul className="space-y-2">
              {analysis.fastestPaths.map((path, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <ArrowUpRight className="w-4 h-4 text-success flex-shrink-0 mt-0.5" />
                  {path}
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Restart */}
        <div className="text-center">
          <button
            onClick={() => setStep('landing')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-heading font-medium hover:bg-secondary transition-colors"
          >
            <RefreshCw className="w-4 h-4" /> Start Over
          </button>
        </div>
      </div>
    </div>
  );
}
