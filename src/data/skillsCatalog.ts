// Multi-industry skills catalog with categories
// Used for autocomplete, validation, and normalization

export interface CatalogSkill {
  name: string;
  category: 'hard' | 'soft';
  industry: string;
}

const HARD_SKILLS: Record<string, string[]> = {
  'Tecnologia': [
    'Python', 'JavaScript', 'TypeScript', 'Java', 'C#', 'C++', 'Go', 'Rust', 'Ruby', 'PHP', 'Swift', 'Kotlin',
    'React', 'Angular', 'Vue.js', 'Next.js', 'Node.js', 'Django', 'Flask', 'Spring Boot', 'Laravel', '.NET',
    'SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Firebase',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 'CI/CD', 'Jenkins', 'GitHub Actions',
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'NLP', 'Computer Vision',
    'Data Science', 'Data Engineering', 'ETL', 'Apache Spark', 'Airflow', 'dbt',
    'REST API', 'GraphQL', 'Microservices', 'System Design', 'DevOps', 'SRE',
    'Cybersecurity', 'Pentesting', 'SIEM', 'Firewalls',
    'Git', 'Linux', 'Agile', 'Scrum', 'Kanban', 'JIRA',
    'HTML', 'CSS', 'Sass', 'Tailwind CSS', 'Figma', 'UI/UX Design',
    'React Native', 'Flutter', 'iOS Development', 'Android Development',
    'Blockchain', 'Solidity', 'Web3',
    'Power BI', 'Tableau', 'Looker', 'Metabase',
    'Selenium', 'Cypress', 'Jest', 'Unit Testing', 'QA Automation',
  ],
  'Marketing & Vendas': [
    'SEO', 'SEM', 'Google Ads', 'Meta Ads', 'LinkedIn Ads', 'TikTok Ads',
    'Google Analytics', 'Tag Manager', 'Hotjar', 'Mixpanel', 'Amplitude',
    'Email Marketing', 'Automação de Marketing', 'HubSpot', 'Salesforce', 'RD Station',
    'Copywriting', 'Content Marketing', 'Social Media', 'Branding',
    'CRM', 'Inbound Marketing', 'Outbound Sales', 'Growth Hacking',
    'A/B Testing', 'Conversion Optimization', 'Funil de Vendas',
    'Mídia Paga', 'Marketing de Influência', 'Produção de Conteúdo',
    'Inside Sales', 'SDR', 'Prospecção', 'Negociação Comercial',
  ],
  'Finanças & Contabilidade': [
    'Contabilidade', 'Controladoria', 'Auditoria', 'FP&A', 'Tesouraria',
    'Excel Avançado', 'VBA', 'SAP', 'TOTVS', 'ERP',
    'Análise Financeira', 'Modelagem Financeira', 'Valuation', 'Due Diligence',
    'Gestão de Riscos', 'Compliance', 'IFRS', 'CPC', 'Tributário',
    'Mercado de Capitais', 'Renda Fixa', 'Renda Variável', 'Derivativos',
    'Planejamento Financeiro', 'Orçamento', 'DRE', 'Balanço Patrimonial',
  ],
  'Engenharia': [
    'AutoCAD', 'SolidWorks', 'CATIA', 'Revit', 'BIM',
    'Lean Manufacturing', 'Six Sigma', 'Kaizen', '5S', 'TPM',
    'Gestão de Projetos', 'MS Project', 'Primavera P6',
    'Cálculo Estrutural', 'Mecânica dos Fluidos', 'Termodinâmica',
    'Manutenção Preditiva', 'Manutenção Preventiva', 'PCM',
    'Automação Industrial', 'CLP', 'SCADA', 'Instrumentação',
    'NR-10', 'NR-12', 'NR-35', 'Segurança do Trabalho',
    'Gestão da Qualidade', 'ISO 9001', 'ISO 14001',
  ],
  'Saúde': [
    'Enfermagem', 'Farmacologia', 'Epidemiologia', 'Bioestatística',
    'Prontuário Eletrônico', 'Telessaúde', 'Gestão Hospitalar',
    'Nutrição Clínica', 'Fisioterapia', 'Psicologia Clínica',
    'Pesquisa Clínica', 'GCP', 'Regulatório (ANVISA)',
    'Primeiros Socorros', 'ACLS', 'BLS',
  ],
  'Jurídico': [
    'Direito Civil', 'Direito Trabalhista', 'Direito Tributário', 'Direito Digital',
    'LGPD', 'GDPR', 'Compliance', 'Contratos', 'Due Diligence',
    'Direito Societário', 'M&A', 'Propriedade Intelectual',
    'Mediação', 'Arbitragem', 'Contencioso',
  ],
  'RH & Pessoas': [
    'Recrutamento e Seleção', 'Employer Branding', 'People Analytics',
    'Treinamento e Desenvolvimento', 'Avaliação de Desempenho', 'OKRs', 'KPIs',
    'Folha de Pagamento', 'eSocial', 'Benefícios',
    'Cultura Organizacional', 'Gestão de Talentos', 'Plano de Carreira',
    'Diversidade e Inclusão', 'Clima Organizacional',
  ],
  'Design & Criação': [
    'Figma', 'Sketch', 'Adobe XD', 'InVision',
    'Photoshop', 'Illustrator', 'InDesign', 'After Effects', 'Premiere Pro',
    'UI Design', 'UX Design', 'UX Research', 'Design System',
    'Prototipagem', 'Wireframing', 'Design Thinking',
    'Tipografia', 'Identidade Visual', 'Motion Design', '3D Modeling',
    'Canva', 'DaVinci Resolve',
  ],
  'Gestão & Operações': [
    'Gestão de Projetos', 'PMP', 'Prince2', 'Metodologias Ágeis',
    'Gestão de Pessoas', 'Liderança', 'Gestão de Mudanças',
    'Supply Chain', 'Logística', 'Compras', 'Procurement',
    'Business Intelligence', 'Análise de Dados', 'KPIs', 'OKRs',
    'Estratégia de Negócios', 'Business Model Canvas', 'Design Thinking',
    'Processos', 'BPMN', 'Lean', 'Melhoria Contínua',
  ],
  'Educação': [
    'Pedagogia', 'Didática', 'Metodologias Ativas',
    'EAD', 'LMS', 'Moodle', 'Design Instrucional',
    'Avaliação Educacional', 'Psicopedagogia',
    'Educação Especial', 'Inclusão', 'BNCC',
  ],
};

const SOFT_SKILLS: string[] = [
  'Comunicação', 'Liderança', 'Trabalho em Equipe', 'Resolução de Problemas',
  'Pensamento Crítico', 'Criatividade', 'Adaptabilidade', 'Gestão do Tempo',
  'Inteligência Emocional', 'Empatia', 'Negociação', 'Persuasão',
  'Tomada de Decisão', 'Organização', 'Proatividade', 'Resiliência',
  'Apresentações', 'Oratória', 'Escuta Ativa', 'Feedback',
  'Mentoria', 'Coaching', 'Facilitação', 'Mediação de Conflitos',
  'Pensamento Estratégico', 'Visão Sistêmica', 'Inovação',
  'Autogestão', 'Autonomia', 'Colaboração', 'Flexibilidade',
  'Atenção aos Detalhes', 'Orientação a Resultados', 'Foco no Cliente',
  'Networking', 'Influência', 'Gestão de Stakeholders',
];

// Build flat catalog
export const SKILLS_CATALOG: CatalogSkill[] = [
  ...Object.entries(HARD_SKILLS).flatMap(([industry, skills]) =>
    skills.map(name => ({ name, category: 'hard' as const, industry }))
  ),
  ...SOFT_SKILLS.map(name => ({ name, category: 'soft' as const, industry: 'Transversal' })),
];

// Common typo corrections map
const TYPO_MAP: Record<string, string> = {
  'pithon': 'Python', 'piton': 'Python', 'pyton': 'Python', 'phyton': 'Python',
  'javasript': 'JavaScript', 'javascrip': 'JavaScript', 'javacript': 'JavaScript', 'java script': 'JavaScript',
  'typesript': 'TypeScript', 'typscript': 'TypeScript',
  'reack': 'React', 'react.js': 'React', 'reactjs': 'React',
  'angula': 'Angular', 'agular': 'Angular',
  'nod.js': 'Node.js', 'nodejs': 'Node.js', 'node': 'Node.js',
  'postgre': 'PostgreSQL', 'postgres': 'PostgreSQL', 'postgressql': 'PostgreSQL',
  'mangodb': 'MongoDB', 'mogodb': 'MongoDB', 'mongo': 'MongoDB',
  'doker': 'Docker', 'dokcer': 'Docker',
  'kubernets': 'Kubernetes', 'kuberntes': 'Kubernetes', 'k8s': 'Kubernetes',
  'exel': 'Excel Avançado', 'excel': 'Excel Avançado',
  'lideranca': 'Liderança', 'liderança': 'Liderança',
  'comunicacao': 'Comunicação', 'comunicação': 'Comunicação',
  'photoshp': 'Photoshop', 'fotoshop': 'Photoshop',
  'ilustrator': 'Illustrator', 'ilustreitor': 'Illustrator',
  'machine learnig': 'Machine Learning', 'machinelearning': 'Machine Learning', 'ml': 'Machine Learning',
  'deep learnig': 'Deep Learning', 'deeplearning': 'Deep Learning', 'dl': 'Deep Learning',
  'inteligencia emocional': 'Inteligência Emocional',
  'trabalho em equipe': 'Trabalho em Equipe',
  'resolucao de problemas': 'Resolução de Problemas',
  'pensamento critico': 'Pensamento Crítico',
  'gestao do tempo': 'Gestão do Tempo',
  'power bi': 'Power BI', 'powerbi': 'Power BI',
  'figam': 'Figma', 'fima': 'Figma',
  'salesforse': 'Salesforce', 'salesforece': 'Salesforce',
  'hubspost': 'HubSpot', 'hub spot': 'HubSpot',
  'seo': 'SEO', 'sem': 'SEM',
  'ux': 'UX Design', 'ui': 'UI Design',
  'devops': 'DevOps', 'dev ops': 'DevOps',
  'cicd': 'CI/CD', 'ci cd': 'CI/CD',
  'aws': 'AWS', 'azur': 'Azure', 'gcp': 'Google Cloud',
};

function levenshtein(a: string, b: string): number {
  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;
  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      matrix[i][j] = b[i - 1] === a[j - 1]
        ? matrix[i - 1][j - 1]
        : Math.min(matrix[i - 1][j - 1] + 1, matrix[i][j - 1] + 1, matrix[i - 1][j] + 1);
    }
  }
  return matrix[b.length][a.length];
}

export function normalizeSkill(input: string): string {
  const lower = input.trim().toLowerCase();
  
  // Check typo map first
  if (TYPO_MAP[lower]) return TYPO_MAP[lower];
  
  // Exact match (case-insensitive)
  const exact = SKILLS_CATALOG.find(s => s.name.toLowerCase() === lower);
  if (exact) return exact.name;
  
  // Fuzzy match with levenshtein
  let bestMatch = '';
  let bestDist = Infinity;
  for (const skill of SKILLS_CATALOG) {
    const dist = levenshtein(lower, skill.name.toLowerCase());
    if (dist < bestDist) {
      bestDist = dist;
      bestMatch = skill.name;
    }
  }
  
  // Accept if distance is small enough relative to word length
  const threshold = Math.max(2, Math.floor(lower.length * 0.35));
  if (bestDist <= threshold) return bestMatch;
  
  // Return capitalized original if no match
  return input.trim().charAt(0).toUpperCase() + input.trim().slice(1);
}

export function searchSkills(query: string, limit = 8): CatalogSkill[] {
  if (!query.trim()) return [];
  const lower = query.trim().toLowerCase();
  
  // Check typo correction first
  const corrected = TYPO_MAP[lower];
  if (corrected) {
    const match = SKILLS_CATALOG.find(s => s.name === corrected);
    if (match) return [match];
  }
  
  // Starts with
  const startsWith = SKILLS_CATALOG.filter(s => s.name.toLowerCase().startsWith(lower));
  
  // Contains
  const contains = SKILLS_CATALOG.filter(s => 
    !s.name.toLowerCase().startsWith(lower) && s.name.toLowerCase().includes(lower)
  );
  
  // Fuzzy (for short queries)
  const fuzzy: CatalogSkill[] = [];
  if (lower.length >= 3 && startsWith.length + contains.length < limit) {
    for (const skill of SKILLS_CATALOG) {
      if (startsWith.includes(skill) || contains.includes(skill)) continue;
      const dist = levenshtein(lower, skill.name.toLowerCase().slice(0, lower.length + 2));
      if (dist <= 2) fuzzy.push(skill);
    }
  }
  
  return [...startsWith, ...contains, ...fuzzy].slice(0, limit);
}

export function getSkillCategory(name: string): 'hard' | 'soft' {
  const found = SKILLS_CATALOG.find(s => s.name.toLowerCase() === name.toLowerCase());
  return found?.category || 'hard';
}
