import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, Plus, Check } from 'lucide-react';
import { searchSkills, normalizeSkill, type CatalogSkill } from '@/data/skillsCatalog';

interface Props {
  onAdd: (name: string, category: 'hard' | 'soft') => void;
  existingSkills: string[];
  placeholder?: string;
}

export default function SkillAutocomplete({ onAdd, existingSkills, placeholder = 'Digite uma habilidade...' }: Props) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<CatalogSkill[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (query.trim().length >= 2) {
      const found = searchSkills(query).filter(
        s => !existingSkills.some(e => e.toLowerCase() === s.name.toLowerCase())
      );
      setResults(found);
      setShowDropdown(true);
      setSelectedIndex(-1);
    } else {
      setResults([]);
      setShowDropdown(false);
    }
  }, [query, existingSkills]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node) &&
          inputRef.current && !inputRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSkill = (name: string, category: 'hard' | 'soft') => {
    if (existingSkills.some(e => e.toLowerCase() === name.toLowerCase())) return;
    onAdd(name, category);
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(i => Math.max(i - 1, -1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedIndex >= 0 && results[selectedIndex]) {
        addSkill(results[selectedIndex].name, results[selectedIndex].category);
      } else if (query.trim().length >= 2) {
        // Normalize and add as custom
        const normalized = normalizeSkill(query);
        const catalogMatch = results.find(r => r.name === normalized);
        addSkill(normalized, catalogMatch?.category || 'hard');
      }
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const correctedName = query.trim().length >= 2 ? normalizeSkill(query) : null;
  const isTypo = correctedName && correctedName.toLowerCase() !== query.trim().toLowerCase() && 
    !results.some(r => r.name === correctedName);

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.trim().length >= 2 && setShowDropdown(true)}
          placeholder={placeholder}
          className="w-full pl-10 pr-10 py-2.5 rounded-lg border border-border bg-surface text-foreground font-body text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setShowDropdown(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
          </button>
        )}
      </div>

      {isTypo && (
        <p className="text-xs text-highlight mt-1">
          Você quis dizer: <button onClick={() => { addSkill(correctedName, 'hard'); }} className="font-semibold underline">{correctedName}</button>?
        </p>
      )}

      <AnimatePresence>
        {showDropdown && results.length > 0 && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute z-50 w-full mt-1 bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {results.map((skill, i) => (
              <button
                key={skill.name}
                onClick={() => addSkill(skill.name, skill.category)}
                className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm transition-colors ${
                  i === selectedIndex ? 'bg-highlight-soft' : 'hover:bg-secondary'
                }`}
              >
                <Plus className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                <span className="flex-1 text-foreground">{skill.name}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded ${
                  skill.category === 'hard' ? 'bg-highlight-soft text-highlight' : 'bg-success-soft text-success'
                }`}>
                  {skill.category === 'hard' ? 'Técnica' : 'Comportamental'}
                </span>
                <span className="text-xs text-muted-foreground">{skill.industry}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
