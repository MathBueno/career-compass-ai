import { motion } from 'framer-motion';
import { ArrowRight, Brain, Target, Compass, Sparkles } from 'lucide-react';
import { useCareer } from '@/contexts/CareerContext';

export default function HeroSection() {
  const { setStep } = useCareer();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="hero-gradient flex-1 flex items-center justify-center px-4 py-20 relative overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 -left-20 w-72 h-72 rounded-full bg-accent/10 blur-3xl" />
          <div className="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-accent/5 blur-3xl" />
        </div>

        <div className="max-w-3xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-foreground/20 bg-primary-foreground/5 mb-8">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-body text-primary-foreground/80">Diagnóstico de Carreira com IA</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading font-bold text-primary-foreground leading-tight mb-6">
              Descubra Onde Você
              <br />
              <span className="text-accent">Realmente Pertence</span>
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/70 font-body max-w-xl mx-auto mb-10 leading-relaxed">
              Um conselheiro de carreira inteligente que analisa suas habilidades, comportamento e experiência para revelar sua direção ideal.
            </p>

            <motion.button
              onClick={() => setStep('input')}
              className="group inline-flex items-center gap-3 px-8 py-4 rounded-xl accent-gradient text-accent-foreground font-heading font-semibold text-lg shadow-lg hover:shadow-xl transition-shadow"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              Começar Diagnóstico
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </motion.button>

            <p className="mt-4 text-sm text-primary-foreground/40">Sem login · Gratuito · 5 minutos</p>
          </motion.div>

          <motion.div
            className="grid grid-cols-3 gap-6 mt-20"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            {[
              { icon: Brain, title: 'Análise Comportamental', desc: 'Mapeamento de personalidade OCEAN' },
              { icon: Target, title: 'Roles Dinâmicos', desc: 'Cargos gerados por IA' },
              { icon: Compass, title: 'Direções de Carreira', desc: 'Zonas de conforto e crescimento' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-3 p-4">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/10 flex items-center justify-center">
                  <item.icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="font-heading font-semibold text-primary-foreground text-sm">{item.title}</h3>
                <p className="text-xs text-primary-foreground/50">{item.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
