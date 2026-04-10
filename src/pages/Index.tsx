import { CareerProvider, useCareer } from '@/contexts/CareerContext';
import HeroSection from '@/components/career/HeroSection';
import InputStep from '@/components/career/InputStep';
import ProfileEditor from '@/components/career/ProfileEditor';
import AssessmentStep from '@/components/career/AssessmentStep';
import AnalyzingStep from '@/components/career/AnalyzingStep';
import ResultsStep from '@/components/career/ResultsStep';
import { AnimatePresence, motion } from 'framer-motion';

function CareerWizard() {
  const { step } = useCareer();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={step}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {step === 'landing' && <HeroSection />}
        {step === 'input' && <InputStep />}
        {step === 'profile' && <ProfileEditor />}
        {step === 'assessment' && <AssessmentStep />}
        {step === 'analyzing' && <AnalyzingStep />}
        {step === 'results' && <ResultsStep />}
      </motion.div>
    </AnimatePresence>
  );
}

export default function Index() {
  return (
    <CareerProvider>
      <CareerWizard />
    </CareerProvider>
  );
}
