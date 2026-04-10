import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useCareer } from '@/contexts/CareerContext';
import type { OceanScores } from '@/types/career';

interface Question {
  id: number;
  text: string;
  trait: keyof OceanScores;
  reverse?: boolean;
}

const QUESTIONS: Question[] = [
  { id: 1, text: "I enjoy exploring new ideas and creative approaches.", trait: 'openness' },
  { id: 2, text: "I keep my workspace well-organized and follow through on plans.", trait: 'conscientiousness' },
  { id: 3, text: "I feel energized by working with others in a team setting.", trait: 'extraversion' },
  { id: 4, text: "I prioritize maintaining harmony in professional relationships.", trait: 'agreeableness' },
  { id: 5, text: "I stay calm and focused even under pressure.", trait: 'emotionalStability' },
  { id: 6, text: "I actively seek out new skills or knowledge areas.", trait: 'openness' },
  { id: 7, text: "I set clear goals and work systematically towards them.", trait: 'conscientiousness' },
  { id: 8, text: "I naturally take the lead in group discussions.", trait: 'extraversion' },
  { id: 9, text: "I'm good at seeing things from others' perspectives.", trait: 'agreeableness' },
  { id: 10, text: "I handle criticism constructively without taking it personally.", trait: 'emotionalStability' },
  { id: 11, text: "I prefer unconventional solutions over tried-and-true ones.", trait: 'openness' },
  { id: 12, text: "I prefer sticking to schedules and completing tasks on time.", trait: 'conscientiousness' },
  { id: 13, text: "I find networking events enjoyable rather than draining.", trait: 'extraversion' },
  { id: 14, text: "I tend to compromise rather than push my own agenda.", trait: 'agreeableness' },
  { id: 15, text: "I bounce back quickly from setbacks or failures.", trait: 'emotionalStability' },
];

const LABELS = ['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'];

export default function AssessmentStep() {
  const { setStep, setOceanScores } = useCareer();
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [currentPage, setCurrentPage] = useState(0);

  const questionsPerPage = 5;
  const totalPages = Math.ceil(QUESTIONS.length / questionsPerPage);
  const pageQuestions = QUESTIONS.slice(currentPage * questionsPerPage, (currentPage + 1) * questionsPerPage);
  const allAnswered = QUESTIONS.every(q => answers[q.id] !== undefined);
  const pageAnswered = pageQuestions.every(q => answers[q.id] !== undefined);

  const computeScores = useCallback((): OceanScores => {
    const traits: Record<keyof OceanScores, number[]> = {
      openness: [], conscientiousness: [], extraversion: [], agreeableness: [], emotionalStability: [],
    };
    QUESTIONS.forEach(q => {
      const val = answers[q.id] ?? 3;
      traits[q.trait].push(q.reverse ? 6 - val : val);
    });
    const avg = (arr: number[]) => arr.reduce((a, b) => a + b, 0) / arr.length;
    return {
      openness: avg(traits.openness),
      conscientiousness: avg(traits.conscientiousness),
      extraversion: avg(traits.extraversion),
      agreeableness: avg(traits.agreeableness),
      emotionalStability: avg(traits.emotionalStability),
    };
  }, [answers]);

  const handleFinish = () => {
    setOceanScores(computeScores());
    setStep('analyzing');
  };

  const progress = Object.keys(answers).length / QUESTIONS.length;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-highlight-soft text-highlight text-sm font-medium mb-4">
            Step 3 of 4
          </div>
          <h2 className="text-3xl font-heading font-bold text-foreground mb-3">
            Behavioral Assessment
          </h2>
          <p className="text-muted-foreground font-body max-w-md mx-auto">
            Rate how much each statement describes you. This helps us understand your work personality.
          </p>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mb-8">
          <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
        </div>

        <div className="space-y-4">
          {pageQuestions.map((q, i) => (
            <motion.div
              key={q.id}
              className="card-elevated p-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <p className="font-body text-foreground mb-4">
                <span className="text-muted-foreground font-heading text-sm mr-2">{q.id}.</span>
                {q.text}
              </p>
              <div className="flex items-center justify-between gap-1">
                {[1, 2, 3, 4, 5].map(val => (
                  <button
                    key={val}
                    onClick={() => setAnswers(prev => ({ ...prev, [q.id]: val }))}
                    className={`flex-1 py-2 px-1 rounded-lg text-xs font-body transition-all ${
                      answers[q.id] === val
                        ? 'accent-gradient text-accent-foreground shadow-sm'
                        : 'bg-secondary text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <span className="hidden sm:inline">{LABELS[val - 1]}</span>
                    <span className="sm:hidden">{val}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex justify-between mt-8">
          <button
            onClick={() => currentPage > 0 ? setCurrentPage(p => p - 1) : setStep('profile')}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-border text-foreground font-heading font-medium hover:bg-secondary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {currentPage < totalPages - 1 ? (
            <motion.button
              onClick={() => setCurrentPage(p => p + 1)}
              disabled={!pageAnswered}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl accent-gradient text-accent-foreground font-heading font-semibold disabled:opacity-40 shadow-md"
              whileHover={pageAnswered ? { scale: 1.02 } : {}}
              whileTap={pageAnswered ? { scale: 0.98 } : {}}
            >
              Next <ArrowRight className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleFinish}
              disabled={!allAnswered}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-xl accent-gradient text-accent-foreground font-heading font-semibold disabled:opacity-40 shadow-md"
              whileHover={allAnswered ? { scale: 1.02 } : {}}
              whileTap={allAnswered ? { scale: 0.98 } : {}}
            >
              Analyze My Profile <ArrowRight className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-4">
          Page {currentPage + 1} of {totalPages} · {Object.keys(answers).length}/{QUESTIONS.length} answered
        </p>
      </motion.div>
    </div>
  );
}
