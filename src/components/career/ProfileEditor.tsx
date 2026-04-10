import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, ArrowLeft, Plus, X, Edit3, Check } from 'lucide-react';
import { useCareer } from '@/contexts/CareerContext';
import type { SkillItem } from '@/types/career';

const SKILL_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;

function SkillBadge({ skill, onRemove }: { skill: SkillItem; onRemove: () => void }) {
  const levelColors: Record<string, string> = {
    beginner: 'bg-info-soft text-info',
    intermediate: 'bg-highlight-soft text-highlight',
    advanced: 'bg-success-soft text-success',
    expert: 'bg-warning-soft text-warning',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-card border border-border"
    >
      <span className="text-sm font-body text-foreground">{skill.name}</span>
      <span className={`text-xs px-1.5 py-0.5 rounded ${levelColors[skill.level]}`}>
        {skill.level}
      </span>
      <button onClick={onRemove} className="text-muted-foreground hover:text-destructive transition-colors">
        <X className="w-3 h-3" />
      </button>
    </motion.div>
  );
}

function AddSkillForm({ category, onAdd }: { category: 'hard' | 'soft'; onAdd: (skill: SkillItem) => void }) {
  const [name, setName] = useState('');
  const [level, setLevel] = useState<SkillItem['level']>('intermediate');
  const [isOpen, setIsOpen] = useState(false);

  const handleSubmit = () => {
    if (!name.trim()) return;
    onAdd({ name: name.trim(), level, category });
    setName('');
    setIsOpen(false);
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-dashed border-border text-sm text-muted-foreground hover:text-foreground hover:border-highlight/50 transition-all"
      >
        <Plus className="w-3 h-3" /> Add {category} skill
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <input
        autoFocus
        value={name}
        onChange={e => setName(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        placeholder="Skill name..."
        className="px-3 py-1.5 rounded-lg border border-border bg-surface text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
      <select
        value={level}
        onChange={e => setLevel(e.target.value as SkillItem['level'])}
        className="px-2 py-1.5 rounded-lg border border-border bg-surface text-sm text-foreground"
      >
        {SKILL_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
      </select>
      <button onClick={handleSubmit} className="p-1.5 rounded-lg bg-highlight text-accent-foreground">
        <Check className="w-4 h-4" />
      </button>
      <button onClick={() => setIsOpen(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

function EditableList({ items, onUpdate, label }: { items: string[]; onUpdate: (items: string[]) => void; label: string }) {
  const [adding, setAdding] = useState(false);
  const [newItem, setNewItem] = useState('');

  return (
    <div>
      <h4 className="font-heading text-sm font-medium text-foreground mb-2">{label}</h4>
      <div className="flex flex-wrap gap-2">
        <AnimatePresence>
          {items.map(item => (
            <motion.span
              key={item}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-secondary text-sm text-secondary-foreground"
            >
              {item}
              <button onClick={() => onUpdate(items.filter(i => i !== item))} className="hover:text-destructive">
                <X className="w-3 h-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>
        {adding ? (
          <div className="flex items-center gap-1">
            <input
              autoFocus
              value={newItem}
              onChange={e => setNewItem(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && newItem.trim()) {
                  onUpdate([...items, newItem.trim()]);
                  setNewItem('');
                  setAdding(false);
                }
              }}
              className="px-2 py-1 rounded border border-border bg-surface text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder={`Add ${label.toLowerCase()}...`}
            />
            <button onClick={() => setAdding(false)}><X className="w-3 h-3 text-muted-foreground" /></button>
          </div>
        ) : (
          <button
            onClick={() => setAdding(true)}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-lg border border-dashed border-border text-xs text-muted-foreground hover:text-foreground transition-all"
          >
            <Plus className="w-3 h-3" />
          </button>
        )}
      </div>
    </div>
  );
}

export default function ProfileEditor() {
  const { profile, updateProfile, addSkill, removeSkill, setStep } = useCareer();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-highlight-soft text-highlight text-sm font-medium mb-4">
            Step 2 of 4
          </div>
          <h2 className="text-3xl font-heading font-bold text-foreground mb-3">
            Review Your Profile
          </h2>
          <p className="text-muted-foreground font-body">
            We've extracted data from your input. Edit anything that's not right.
          </p>
        </div>

        <div className="space-y-4">
          {/* Hard Skills */}
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className="w-4 h-4 text-highlight" />
              <h3 className="font-heading font-semibold text-foreground">Hard Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {profile.hardSkills.map(s => (
                  <SkillBadge key={s.name} skill={s} onRemove={() => removeSkill(s.name, 'hard')} />
                ))}
              </AnimatePresence>
            </div>
            <AddSkillForm category="hard" onAdd={addSkill} />
          </div>

          {/* Soft Skills */}
          <div className="card-elevated p-5">
            <div className="flex items-center gap-2 mb-3">
              <Edit3 className="w-4 h-4 text-highlight" />
              <h3 className="font-heading font-semibold text-foreground">Soft Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              <AnimatePresence>
                {profile.softSkills.map(s => (
                  <SkillBadge key={s.name} skill={s} onRemove={() => removeSkill(s.name, 'soft')} />
                ))}
              </AnimatePresence>
            </div>
            <AddSkillForm category="soft" onAdd={addSkill} />
          </div>

          {/* Languages, Courses, Certs */}
          <div className="card-elevated p-5 space-y-4">
            <EditableList items={profile.languages} onUpdate={langs => updateProfile({ languages: langs })} label="Languages" />
            <EditableList items={profile.courses} onUpdate={c => updateProfile({ courses: c })} label="Courses" />
            <EditableList items={profile.certifications} onUpdate={c => updateProfile({ certifications: c })} label="Certifications" />
          </div>
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => setStep('input')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-heading font-medium hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <motion.button
            onClick={() => setStep('assessment')}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl accent-gradient text-accent-foreground font-heading font-semibold shadow-md hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Continue <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
