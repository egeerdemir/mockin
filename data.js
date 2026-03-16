/* ═══════════════════════════════════════════
   MockIn — Mock Data (data.js)
   Dashboard data + Exam engine data
═══════════════════════════════════════════ */

/* ── Season & Dashboard ── */
const SEASON = { name: 'Winter 2026', code: 'W26', startDate: '2026-02-04', week: 6, totalWeeks: 16 };

const CLASSES = [
  {
    id: 'metm', code: 'METM W26', fullName: 'Metallic Materials — Winter 2026', ects: 8,
    enrolled: 190, userRank: 38, userScore: 78, hasCatchup: true,
    catchupTopics: ['phase diagrams', 'alloying elements', 'crystal defects'],
    checkpoints: [
      { date: 'Jan 12', status: 'done',     score: 84 },
      { date: 'Jan 19', status: 'done',     score: 79 },
      { date: 'Jan 26', status: 'weak',     score: 61 },
      { date: 'Feb 2',  status: 'missed',   score: null },
      { date: 'Feb 9',  status: 'upcoming', score: null },
      { date: 'Feb 16', status: 'upcoming', score: null },
    ],
  },
  {
    id: 'thermo', code: 'THERMO W26', fullName: 'Thermodynamics — Winter 2026', ects: 6,
    enrolled: 145, userRank: 12, userScore: 91, hasCatchup: false, catchupTopics: [],
    checkpoints: [
      { date: 'Jan 14', status: 'done',     score: 88 },
      { date: 'Jan 21', status: 'done',     score: 92 },
      { date: 'Jan 28', status: 'done',     score: 95 },
      { date: 'Feb 4',  status: 'upcoming', score: null },
      { date: 'Feb 11', status: 'upcoming', score: null },
    ],
  },
  {
    id: 'mphy', code: 'MPHY W26', fullName: 'Mechanics of Materials — Winter 2026', ects: 7,
    enrolled: 110, userRank: 55, userScore: 64, hasCatchup: false, catchupTopics: [],
    checkpoints: [
      { date: 'Jan 13', status: 'done',     score: 70 },
      { date: 'Jan 20', status: 'weak',     score: 58 },
      { date: 'Jan 27', status: 'upcoming', score: null },
      { date: 'Feb 3',  status: 'upcoming', score: null },
      { date: 'Feb 10', status: 'upcoming', score: null },
      { date: 'Feb 17', status: 'upcoming', score: null },
    ],
  },
  {
    id: 'mchem', code: 'MCHEM W26', fullName: 'Materials Chemistry — Winter 2026', ects: 6,
    enrolled: 130, userRank: 44, userScore: 72, hasCatchup: false, catchupTopics: [],
    checkpoints: [
      { date: 'Jan 13', status: 'done',     score: 75 },
      { date: 'Jan 20', status: 'done',     score: 68 },
      { date: 'Jan 27', status: 'upcoming', score: null },
      { date: 'Feb 3',  status: 'upcoming', score: null },
      { date: 'Feb 10', status: 'upcoming', score: null },
      { date: 'Feb 17', status: 'upcoming', score: null },
    ],
  },
  {
    id: 'mphys', code: 'MPHYS W26', fullName: 'Materials Physics — Winter 2026', ects: 7,
    enrolled: 155, userRank: 29, userScore: 83, hasCatchup: false, catchupTopics: [],
    checkpoints: [
      { date: 'Jan 14', status: 'done',     score: 80 },
      { date: 'Jan 21', status: 'done',     score: 85 },
      { date: 'Jan 28', status: 'done',     score: 78 },
      { date: 'Feb 4',  status: 'upcoming', score: null },
      { date: 'Feb 11', status: 'upcoming', score: null },
      { date: 'Feb 18', status: 'upcoming', score: null },
    ],
  },
  {
    id: 'mmin', code: 'MMIN W26', fullName: 'Mineral Materials — Winter 2026', ects: 6,
    enrolled: 100, userRank: 35, userScore: 77, hasCatchup: false, catchupTopics: [],
    checkpoints: [
      { date: 'Jan 13', status: 'done',     score: 82 },
      { date: 'Jan 20', status: 'done',     score: 71 },
      { date: 'Jan 27', status: 'upcoming', score: null },
      { date: 'Feb 3',  status: 'upcoming', score: null },
      { date: 'Feb 10', status: 'upcoming', score: null },
      { date: 'Feb 17', status: 'upcoming', score: null },
    ],
  },
  {
    id: 'proctech', code: 'PROC W26', fullName: 'Process Technology — Winter 2026', ects: 5,
    enrolled: 175, userRank: 62, userScore: 65, hasCatchup: true, catchupTopics: ['heat exchangers', 'distillation'],
    checkpoints: [
      { date: 'Jan 15', status: 'done',     score: 70 },
      { date: 'Jan 22', status: 'weak',     score: 60 },
      { date: 'Jan 29', status: 'upcoming', score: null },
      { date: 'Feb 5',  status: 'upcoming', score: null },
      { date: 'Feb 12', status: 'upcoming', score: null },
    ],
  },
];

const LEADERBOARD_METM = [
  { rank: 1, name: 'Ayşe K.',   pts: 904, pct: '99', initials: 'AK', color: 'bg-yellow-500' },
  { rank: 2, name: 'Mehmet D.', pts: 871, pct: '98', initials: 'MD', color: 'bg-dk-line'    },
  { rank: 3, name: 'Sara L.',   pts: 856, pct: '97', initials: 'SL', color: 'bg-yellow-700' },
  { rank: 4, name: 'Jin W.',    pts: 832, pct: '96', initials: 'JW', color: 'bg-lavender'   },
  { rank: 5, name: 'Mia R.',    pts: 815, pct: '95', initials: 'MR', color: 'bg-mint'       },
];

const UPCOMING_EXAMS = [
  { code: 'METM W26',   title: 'Checkpoint 5', date: 'Mar 28', daysLeft: 11, type: 'mock' },
  { code: 'THERMO W26', title: 'Checkpoint 4', date: 'Apr 4',  daysLeft: 18, type: 'mock' },
  { code: 'MPHY W26',   title: 'Checkpoint 3', date: 'Apr 11', daysLeft: 25, type: 'mock' },
];

const NAV_ITEMS = [
  { id: 'dashboard',    icon: '⊞', label: 'Dashboard'    },
  { id: 'season',       icon: '◈', label: 'Season'        },
  { id: 'exams',        icon: '✎', label: 'Exams'         },
  { id: 'leaderboard',  icon: '◎', label: 'Leaderboard'   },
  { id: 'achievements', icon: '✦', label: 'Achievements'  },
  { id: 'profile',      icon: '◉', label: 'Profile'       },
  { id: 'settings',     icon: '⚙', label: 'Settings'      },
];

const SELF_STUDY_ITEMS = [
  { id: 'quizzes',   icon: '✏', label: 'Practice Quizzes' },
  { id: 'drills',    icon: '◎', label: 'Topic Drills'     },
  { id: 'exercises', icon: '≡', label: 'Exercise Sets'    },
];

/* ── Exam Config ── */
const EXAM_CONFIG = {
  id: 'metm-w26-cp5',
  title: 'Checkpoint 5 Mock Exam',
  classCode: 'METM W26',
  className: 'Metallic Materials — Winter 2026',
  checkpoint: 'Checkpoint 5',
  duration: 40 * 60,
  ects: 8,
  classAvg: 71,
};

/* ── Exam Questions (15 METM W26 questions) ── */
const EXAM_QUESTIONS = [
  {
    id: 1,
    text: 'What is the crystal structure of pure iron (α-Fe) at room temperature?',
    options: ['Face-centered cubic (FCC)', 'Body-centered cubic (BCC)', 'Hexagonal close-packed (HCP)', 'Diamond cubic (DC)'],
    correctAnswer: 1, topic: 'Crystal Structure', difficulty: 'easy',
  },
  {
    id: 2,
    text: 'In a binary eutectic system, the eutectic point represents:',
    options: ['Maximum solubility of one component in another', 'The lowest melting temperature composition in the system', 'The point at which both components have equal melting temperatures', 'The composition at which a single-phase solid forms'],
    correctAnswer: 1, topic: 'Phase Diagrams', difficulty: 'medium',
  },
  {
    id: 3,
    text: 'Which best describes the role of carbon in steel?',
    options: ['Carbon forms a substitutional solid solution in iron', 'Carbon acts as an interstitial atom in the iron lattice', 'Carbon precipitates as pure graphite in all steels', 'Carbon has no significant effect on mechanical properties'],
    correctAnswer: 1, topic: 'Alloying Elements', difficulty: 'easy',
  },
  {
    id: 4,
    text: 'The Hall-Petch relationship describes the dependence of yield strength on:',
    options: ['Temperature', 'Grain size', 'Dislocation density', 'Carbon content'],
    correctAnswer: 1, topic: 'Strengthening Mechanisms', difficulty: 'medium',
  },
  {
    id: 5,
    text: 'During quenching of austenite, martensite forms because:',
    options: ['Carbon atoms diffuse to grain boundaries rapidly', 'FCC→BCC transformation occurs with insufficient time for carbon diffusion', 'Cementite (Fe₃C) precipitates uniformly throughout the matrix', 'Austenite transforms to ferrite plus pearlite simultaneously'],
    correctAnswer: 1, topic: 'Heat Treatment', difficulty: 'hard',
  },
  {
    id: 6,
    text: 'Which alloying element primarily provides corrosion resistance in stainless steel?',
    options: ['Nickel (Ni)', 'Chromium (Cr)', 'Molybdenum (Mo)', 'Manganese (Mn)'],
    correctAnswer: 1, topic: 'Alloying Elements', difficulty: 'easy',
  },
  {
    id: 7,
    text: 'A Frenkel defect in a crystal consists of:',
    options: ['A vacancy and a substitutional impurity atom', 'An extra atom inserted between normal lattice positions', 'An atom displaced from its lattice site to an interstitial position', 'Two adjacent vacancies forming a pair'],
    correctAnswer: 2, topic: 'Crystal Defects', difficulty: 'medium',
  },
  {
    id: 8,
    text: 'The primary purpose of annealing heat treatment is to:',
    options: ['Increase hardness by forming martensite', 'Relieve internal stresses and restore ductility', 'Increase the carbon content of the surface layer', 'Form a hard case with a tough core'],
    correctAnswer: 1, topic: 'Heat Treatment', difficulty: 'easy',
  },
  {
    id: 9,
    text: 'Cold working a metal increases yield strength primarily due to:',
    options: ['Grain growth and grain boundary strengthening', 'Increase in dislocation density causing dislocation pile-ups', 'Precipitation of second-phase particles at grain boundaries', 'Solution hardening from interstitial atoms'],
    correctAnswer: 1, topic: 'Strengthening Mechanisms', difficulty: 'medium',
  },
  {
    id: 10,
    text: 'In a TTT diagram, what does the "nose" of the curve represent?',
    options: ['The temperature at which martensite start (Ms) occurs', 'The minimum time for transformation at the most favorable temperature', 'The eutectoid temperature (723°C for iron-carbon)', 'The point at which full austenitization is complete'],
    correctAnswer: 1, topic: 'Phase Diagrams', difficulty: 'hard',
  },
  {
    id: 11,
    text: 'Which heat treatment involves heating steel just above its critical temperature and slowly cooling in the furnace?',
    options: ['Normalizing', 'Quenching', 'Full annealing', 'Tempering'],
    correctAnswer: 2, topic: 'Heat Treatment', difficulty: 'medium',
  },
  {
    id: 12,
    text: 'An edge dislocation moves along the slip plane in the direction of the:',
    options: ['Dislocation line', 'Burgers vector', 'Normal to the slip plane', 'Peach-Köhler force vector'],
    correctAnswer: 1, topic: 'Crystal Defects', difficulty: 'hard',
  },
  {
    id: 13,
    text: 'In precipitation hardening, the correct sequence of treatments is:',
    options: ['Quench → Solution treat → Age', 'Solution treat → Quench → Age', 'Age → Quench → Solution treat', 'Solution treat → Age → Quench'],
    correctAnswer: 1, topic: 'Strengthening Mechanisms', difficulty: 'medium',
  },
  {
    id: 14,
    text: 'Pearlite in the iron-carbon system is a mixture of:',
    options: ['Austenite and cementite', 'Ferrite and cementite (alternating lamellae)', 'Ferrite and martensite', 'Austenite and ferrite'],
    correctAnswer: 1, topic: 'Phase Diagrams', difficulty: 'easy',
  },
  {
    id: 15,
    text: 'Which of the following is NOT a solid solution strengthening mechanism?',
    options: ['Interstitial solid solution', 'Substitutional solid solution', 'Grain boundary precipitation', 'Atomic size mismatch strain fields'],
    correctAnswer: 2, topic: 'Strengthening Mechanisms', difficulty: 'medium',
  },
];

/* ── Question Banks (per-class question sets) ── */
const QUESTION_BANKS = {
  metm: EXAM_QUESTIONS,

  thermo: [
    {
      id: 1,
      text: 'The first law of thermodynamics states that for a closed system:',
      options: ['Heat always flows from cold to hot bodies', 'Energy cannot be created or destroyed, only converted', 'Entropy of an isolated system always increases', 'The work done by a system equals the heat added to it'],
      correctAnswer: 1, topic: 'First Law', difficulty: 'easy',
    },
    {
      id: 2,
      text: 'Enthalpy H is defined as:',
      options: ['H = U − PV', 'H = U + PV', 'H = G + TS', 'H = A + PV'],
      correctAnswer: 1, topic: 'State Functions', difficulty: 'easy',
    },
    {
      id: 3,
      text: 'Which equation correctly states the ideal gas law?',
      options: ['PV = nRT', 'PV = nR/T', 'P/V = nRT', 'PV = nRT²'],
      correctAnswer: 0, topic: 'Ideal Gas', difficulty: 'easy',
    },
    {
      id: 4,
      text: 'At constant pressure, the heat added to a substance relates to temperature change by:',
      options: ['Q = mcᵥΔT', 'Q = mcₚΔT', 'Q = mΔH/T', 'Q = mRT'],
      correctAnswer: 1, topic: 'Heat Capacity', difficulty: 'easy',
    },
    {
      id: 5,
      text: 'The thermal efficiency of a Carnot engine operating between reservoirs T_H and T_C is:',
      options: ['η = T_C / T_H', 'η = 1 − T_H / T_C', 'η = 1 − T_C / T_H', 'η = (T_H − T_C) / T_C'],
      correctAnswer: 2, topic: 'Carnot Cycle', difficulty: 'easy',
    },
    {
      id: 6,
      text: 'For a reversible process, the differential entropy change is defined as:',
      options: ['dS = δQ_rev / T²', 'dS = T · δQ_rev', 'dS = δQ_rev / T', 'dS = δW_rev / T'],
      correctAnswer: 2, topic: 'Second Law', difficulty: 'medium',
    },
    {
      id: 7,
      text: 'The Clausius inequality states that for any cyclic process:',
      options: ['∮ δQ/T ≥ 0', '∮ δQ/T ≤ 0', '∮ δQ/T = 0 always', '∮ δQ · T = 0'],
      correctAnswer: 1, topic: 'Second Law', difficulty: 'medium',
    },
    {
      id: 8,
      text: 'A process at constant T and P is spontaneous if:',
      options: ['ΔG > 0', 'ΔG = 0', 'ΔG < 0', 'ΔH > 0'],
      correctAnswer: 2, topic: 'Gibbs Free Energy', difficulty: 'medium',
    },
    {
      id: 9,
      text: 'In the Gibbs phase rule F = C − P + 2, F represents:',
      options: ['Number of phases in equilibrium', 'Number of chemical components', 'Degrees of freedom (independent intensive variables)', 'Number of reactions occurring'],
      correctAnswer: 2, topic: 'Phase Equilibrium', difficulty: 'medium',
    },
    {
      id: 10,
      text: 'For an ideal gas, the relationship between Cₚ and Cᵥ is:',
      options: ['Cₚ = Cᵥ', 'Cₚ − Cᵥ = R', 'Cₚ + Cᵥ = R', 'Cₚ / Cᵥ = R'],
      correctAnswer: 1, topic: 'Heat Capacity', difficulty: 'medium',
    },
    {
      id: 11,
      text: 'In an ideal Otto cycle, the two adiabatic processes are:',
      options: ['Heat addition and heat rejection', 'Compression and expansion strokes', 'Intake and exhaust strokes', 'All four processes are adiabatic'],
      correctAnswer: 1, topic: 'Power Cycles', difficulty: 'medium',
    },
    {
      id: 12,
      text: 'The Joule-Thomson coefficient μ_JT = (∂T/∂P)_H is positive when:',
      options: ['The gas heats up during isenthalpic expansion', 'The gas cools down during isenthalpic expansion', 'The process is irreversible', 'Enthalpy increases during expansion'],
      correctAnswer: 1, topic: 'Real Gases', difficulty: 'hard',
    },
    {
      id: 13,
      text: 'Fugacity f of a real gas satisfies:',
      options: ['f = P for all real gases', 'f → P as P → 0', 'f = φP where φ > 1 always', 'f is only defined for ideal gases'],
      correctAnswer: 1, topic: 'Real Gases', difficulty: 'hard',
    },
    {
      id: 14,
      text: 'Which Maxwell relation is derived from the Gibbs free energy G?',
      options: ['(∂S/∂P)_T = (∂V/∂T)_P', '(∂S/∂P)_T = −(∂V/∂T)_P', '(∂T/∂V)_S = −(∂P/∂S)_V', '(∂P/∂T)_V = −(∂S/∂V)_T'],
      correctAnswer: 1, topic: 'Maxwell Relations', difficulty: 'hard',
    },
    {
      id: 15,
      text: 'The third law of thermodynamics states that:',
      options: ['No process can be 100% efficient', 'The entropy of a perfect crystal approaches zero as T → 0 K', 'The internal energy of a crystal is zero at 0 K', 'Absolute zero can be reached in a finite number of steps'],
      correctAnswer: 1, topic: 'Third Law', difficulty: 'hard',
    },
  ],

  mphy: [
    {
      id: 1,
      text: 'Hooke\'s law for a linearly elastic material states that:',
      options: ['Stress is proportional to strain squared', 'Stress is proportional to strain', 'Strain is independent of stress', 'Stress equals Young\'s modulus divided by strain'],
      correctAnswer: 1, topic: 'Elasticity', difficulty: 'easy',
    },
    {
      id: 2,
      text: 'Engineering stress is defined as the applied force divided by:',
      options: ['The instantaneous cross-sectional area', 'The original undeformed cross-sectional area', 'The volume of the specimen', 'The length of the specimen'],
      correctAnswer: 1, topic: 'Stress & Strain', difficulty: 'easy',
    },
    {
      id: 3,
      text: 'Poisson\'s ratio ν is defined as:',
      options: ['Axial strain divided by lateral strain', 'The negative of lateral strain divided by axial strain', 'Shear stress divided by shear strain', 'Young\'s modulus divided by shear modulus'],
      correctAnswer: 1, topic: 'Elasticity', difficulty: 'easy',
    },
    {
      id: 4,
      text: 'For an axially loaded bar with force F and cross-sectional area A, the normal stress σ is:',
      options: ['σ = F·A', 'σ = A/F', 'σ = F/A', 'σ = F²/A'],
      correctAnswer: 2, topic: 'Stress & Strain', difficulty: 'easy',
    },
    {
      id: 5,
      text: 'For an isotropic material, the shear modulus G relates to E and ν by:',
      options: ['G = E / (2(1 + ν))', 'G = E / (1 − 2ν)', 'G = 2E(1 + ν)', 'G = Eν / 2'],
      correctAnswer: 0, topic: 'Elasticity', difficulty: 'easy',
    },
    {
      id: 6,
      text: 'In a beam under pure bending, the normal stress at distance y from the neutral axis is:',
      options: ['σ = My / I', 'σ = MI / y', 'σ = M / (Iy)', 'σ = y / (MI)'],
      correctAnswer: 0, topic: 'Bending', difficulty: 'medium',
    },
    {
      id: 7,
      text: 'For a circular shaft of polar moment J under torque T, the maximum shear stress at radius c is:',
      options: ['τ_max = Tc / J', 'τ_max = TJ / c', 'τ_max = T / (cJ)', 'τ_max = c / (TJ)'],
      correctAnswer: 0, topic: 'Torsion', difficulty: 'medium',
    },
    {
      id: 8,
      text: 'The Euler critical buckling load for a pin-pin column of length L and flexural rigidity EI is:',
      options: ['P_cr = π²EI / (4L²)', 'P_cr = π²EI / L²', 'P_cr = 2πEI / L²', 'P_cr = EI / L²'],
      correctAnswer: 1, topic: 'Buckling', difficulty: 'medium',
    },
    {
      id: 9,
      text: 'On Mohr\'s circle for plane stress, the radius of the circle represents:',
      options: ['The maximum normal stress', 'The average normal stress', 'The maximum in-plane shear stress', 'The hydrostatic stress'],
      correctAnswer: 2, topic: 'Stress Transformation', difficulty: 'medium',
    },
    {
      id: 10,
      text: 'A bar is fixed at both ends and undergoes a temperature increase ΔT. The induced thermal stress is:',
      options: ['σ = EαΔT (tensile)', 'σ = −EαΔT (compressive)', 'σ = αΔT / E (compressive)', 'σ = 0 because expansion is unconstrained'],
      correctAnswer: 1, topic: 'Thermal Stress', difficulty: 'medium',
    },
    {
      id: 11,
      text: 'The stress concentration factor K_t is defined as the ratio of:',
      options: ['Average stress to maximum stress', 'Maximum stress to nominal stress', 'Nominal stress to yield stress', 'Maximum stress to ultimate stress'],
      correctAnswer: 1, topic: 'Stress Concentrations', difficulty: 'medium',
    },
    {
      id: 12,
      text: 'For plane stress with σ_x, σ_y, and τ_xy, the maximum principal stress σ₁ is:',
      options: ['(σ_x+σ_y)/2 + √[((σ_x−σ_y)/2)²+τ_xy²]', '(σ_x+σ_y)/2 − √[((σ_x−σ_y)/2)²+τ_xy²]', '√(σ_x²+σ_y²+τ_xy²)', 'σ_x+σ_y+2τ_xy'],
      correctAnswer: 0, topic: 'Principal Stresses', difficulty: 'hard',
    },
    {
      id: 13,
      text: 'In linear elastic fracture mechanics, the mode-I stress intensity factor K_I depends on:',
      options: ['Applied stress and yield strength only', 'Applied stress, crack length, and geometry factor', 'Crack length and material toughness only', 'Temperature and crack propagation speed'],
      correctAnswer: 1, topic: 'Fracture Mechanics', difficulty: 'hard',
    },
    {
      id: 14,
      text: 'The endurance limit on an S-N (Wöhler) curve for a ferrous metal is the stress amplitude below which:',
      options: ['Fatigue failure occurs after 10³ cycles', 'The material will not fail regardless of the number of cycles', 'Crack propagation rate is maximum', 'Creep becomes the dominant failure mode'],
      correctAnswer: 1, topic: 'Fatigue', difficulty: 'hard',
    },
    {
      id: 15,
      text: 'The von Mises yield criterion states that yielding begins when:',
      options: ['The maximum principal stress reaches the uniaxial yield stress', 'The maximum shear stress reaches half the yield stress', 'The distortion energy equals that at yield in uniaxial tension', 'The hydrostatic stress exceeds the yield stress'],
      correctAnswer: 2, topic: 'Yield Criteria', difficulty: 'hard',
    },
  ],

  mchem: [
    {
      id: 1,
      text: 'Which type of chemical bond results from the electrostatic attraction between oppositely charged ions?',
      options: ['Covalent bond', 'Metallic bond', 'Ionic bond', 'Van der Waals bond'],
      correctAnswer: 2, topic: 'Atomic Bonding', difficulty: 'easy',
    },
    {
      id: 2,
      text: 'Electronegativity generally increases across a period in the periodic table because:',
      options: ['Atomic radius increases', 'Nuclear charge increases while shielding stays roughly constant', 'The number of valence electrons decreases', 'Ionization energy decreases'],
      correctAnswer: 1, topic: 'Electronegativity', difficulty: 'easy',
    },
    {
      id: 3,
      text: 'In crystal chemistry, the coordination number of an ion refers to:',
      options: ['The number of unit cells surrounding the ion', 'The number of nearest-neighbour ions of opposite charge', 'The number of electrons in the outer shell', 'The number of possible oxidation states'],
      correctAnswer: 1, topic: 'Crystal Chemistry', difficulty: 'easy',
    },
    {
      id: 4,
      text: 'The NaCl crystal structure has a coordination number of:',
      options: ['4', '8', '6', '12'],
      correctAnswer: 2, topic: 'Crystal Chemistry', difficulty: 'easy',
    },
    {
      id: 5,
      text: 'A Schottky defect in an ionic crystal consists of:',
      options: ['An interstitial cation and a cation vacancy', 'Equal numbers of cation and anion vacancies', 'A substitutional impurity on a cation site', 'An anion displaced to an interstitial position'],
      correctAnswer: 1, topic: 'Defects in Ionic Crystals', difficulty: 'medium',
    },
    {
      id: 6,
      text: 'The Madelung constant A in the lattice energy formula depends on:',
      options: ['The charge of the ions only', 'The crystal structure geometry', 'The temperature of the crystal', 'The ionic radius ratio only'],
      correctAnswer: 1, topic: 'Madelung Constant', difficulty: 'medium',
    },
    {
      id: 7,
      text: 'The Born-Haber cycle is used to calculate:',
      options: ['The melting point of an ionic compound', 'The lattice energy of an ionic crystal indirectly via Hess\'s law', 'The solubility product of a salt in water', 'The activation energy of an ionic reaction'],
      correctAnswer: 1, topic: 'Born-Haber Cycle', difficulty: 'medium',
    },
    {
      id: 8,
      text: 'In a substitutional solid solution, solute atoms replace solvent atoms when:',
      options: ['The solute has a much larger atomic radius than the solvent', 'The atomic radii differ by less than ~15% and crystal structures are compatible', 'The solute and solvent have completely different electronegativities', 'The solute concentration exceeds 50 at%'],
      correctAnswer: 1, topic: 'Solid Solutions', difficulty: 'medium',
    },
    {
      id: 9,
      text: 'According to band theory, a material is an electrical insulator when:',
      options: ['The valence band is completely empty', 'The conduction band is completely filled', 'There is a large energy gap between a filled valence band and an empty conduction band', 'The Fermi energy lies within the conduction band'],
      correctAnswer: 2, topic: 'Band Theory', difficulty: 'medium',
    },
    {
      id: 10,
      text: 'In galvanic corrosion, the metal acting as the anode:',
      options: ['Is reduced and gains electrons', 'Is oxidised and loses electrons (corrodes)', 'Is protected by the formation of a passive oxide film', 'Acts as the positive terminal in the electrochemical cell'],
      correctAnswer: 1, topic: 'Corrosion Electrochemistry', difficulty: 'medium',
    },
    {
      id: 11,
      text: 'The oxidation state of chromium in Cr₂O₃ is:',
      options: ['+2', '+4', '+3', '+6'],
      correctAnswer: 2, topic: 'Oxidation States', difficulty: 'easy',
    },
    {
      id: 12,
      text: 'An Ellingham diagram plots the standard Gibbs energy of oxide formation versus temperature. A metal can reduce an oxide of another metal when:',
      options: ['Its Ellingham line lies above the other metal\'s line', 'Its Ellingham line lies below the other metal\'s line', 'Both lines intersect at room temperature', 'The slope of its line is positive'],
      correctAnswer: 1, topic: 'Ellingham Diagrams', difficulty: 'hard',
    },
    {
      id: 13,
      text: 'Van der Waals forces are the dominant intermolecular interaction in:',
      options: ['NaCl crystal', 'Diamond', 'Solid argon', 'Metallic copper'],
      correctAnswer: 2, topic: 'Atomic Bonding', difficulty: 'easy',
    },
    {
      id: 14,
      text: 'The radius ratio rule predicts that tetrahedral coordination (CN = 4) is stable when the cation-to-anion radius ratio r_c/r_a lies in the range:',
      options: ['0.155 – 0.225', '0.225 – 0.414', '0.414 – 0.732', '0.732 – 1.000'],
      correctAnswer: 1, topic: 'Crystal Chemistry', difficulty: 'hard',
    },
    {
      id: 15,
      text: 'In metallic bonding, the sea of delocalised electrons is responsible for:',
      options: ['High electrical resistivity', 'High hardness and brittleness', 'High electrical and thermal conductivity and ductility', 'Directional bonding between atoms'],
      correctAnswer: 2, topic: 'Atomic Bonding', difficulty: 'easy',
    },
  ],

  mphys: [
    {
      id: 1,
      text: 'The de Broglie wavelength of a particle with momentum p is:',
      options: ['λ = p / h', 'λ = h · p', 'λ = h / p', 'λ = p / (2h)'],
      correctAnswer: 2, topic: 'Quantum Mechanics', difficulty: 'easy',
    },
    {
      id: 2,
      text: 'The Heisenberg uncertainty principle states that:',
      options: ['ΔE · Δt ≥ ħ/2 and Δx · Δp ≥ ħ/2', 'Position and momentum can both be measured exactly simultaneously', 'Energy is always conserved in a quantum measurement', 'The wave function must be zero at all boundaries'],
      correctAnswer: 0, topic: 'Quantum Mechanics', difficulty: 'easy',
    },
    {
      id: 3,
      text: 'In the free electron model, the Fermi energy E_F at T = 0 K is the energy of:',
      options: ['The lowest occupied electron state', 'The highest occupied electron state', 'The average energy of all conduction electrons', 'The energy gap between valence and conduction bands'],
      correctAnswer: 1, topic: 'Free Electron Model', difficulty: 'easy',
    },
    {
      id: 4,
      text: 'The effective mass m* of an electron in a crystal lattice differs from the free electron mass because:',
      options: ['Relativistic effects become important at lattice velocities', 'The periodic potential of the lattice modifies the electron\'s response to external forces', 'Electrons collide with phonons at very high frequencies', 'The band gap determines the vacuum electron mass directly'],
      correctAnswer: 1, topic: 'Band Structure', difficulty: 'medium',
    },
    {
      id: 5,
      text: 'An intrinsic semiconductor has equal electron and hole concentrations n = p = n_i because:',
      options: ['All donor and acceptor impurities are ionised', 'Thermal excitation across the band gap creates electron-hole pairs', 'The Fermi level lies in the conduction band', 'Phonon scattering creates additional carriers'],
      correctAnswer: 1, topic: 'Semiconductors', difficulty: 'medium',
    },
    {
      id: 6,
      text: 'N-type doping of silicon with phosphorus increases electron concentration because:',
      options: ['Phosphorus has one fewer valence electron, creating holes', 'Phosphorus has one extra valence electron that is donated to the conduction band', 'Phosphorus reduces the band gap of silicon', 'Phosphorus creates acceptor levels near the valence band'],
      correctAnswer: 1, topic: 'Semiconductors', difficulty: 'medium',
    },
    {
      id: 7,
      text: 'Phonons are:',
      options: ['Photons trapped inside a crystal lattice', 'Quantised units of lattice vibrational energy', 'Electrons localised on lattice sites', 'Free electrons in a metallic crystal'],
      correctAnswer: 1, topic: 'Phonons', difficulty: 'easy',
    },
    {
      id: 8,
      text: 'The Debye model improves upon the Einstein model for heat capacity at low temperatures because:',
      options: ['It assumes all phonons have the same frequency', 'It treats electrons as classical particles', 'It uses a continuous distribution of phonon frequencies up to a cutoff (Debye frequency)', 'It ignores quantisation of vibrational energy'],
      correctAnswer: 2, topic: 'Heat Capacity', difficulty: 'medium',
    },
    {
      id: 9,
      text: 'The Wiedemann-Franz law relates electrical conductivity σ and thermal conductivity κ_e of a metal as:',
      options: ['κ_e / σ = LT, where L is the Lorenz number', 'κ_e · σ = LT', 'κ_e = σ / (LT)', 'κ_e / σ = L / T'],
      correctAnswer: 0, topic: 'Thermal Conductivity', difficulty: 'hard',
    },
    {
      id: 10,
      text: 'The electrical resistivity of a pure metal increases with temperature primarily because:',
      options: ['The number of conduction electrons decreases', 'Increased lattice vibrations (phonons) scatter conduction electrons more frequently', 'The Fermi energy decreases with temperature', 'The band gap increases with temperature'],
      correctAnswer: 1, topic: 'Electrical Conductivity', difficulty: 'medium',
    },
    {
      id: 11,
      text: 'A diamagnetic material placed in an external magnetic field:',
      options: ['Is strongly attracted to the field', 'Creates a magnetisation parallel to the applied field', 'Develops a weak magnetisation opposing the applied field', 'Retains its magnetisation after the field is removed'],
      correctAnswer: 2, topic: 'Magnetic Properties', difficulty: 'medium',
    },
    {
      id: 12,
      text: 'Above the Curie temperature, a ferromagnetic material becomes:',
      options: ['Diamagnetic', 'Superconducting', 'Paramagnetic', 'Antiferromagnetic'],
      correctAnswer: 2, topic: 'Magnetic Properties', difficulty: 'medium',
    },
    {
      id: 13,
      text: 'In a superconductor below T_c, the Meissner effect refers to:',
      options: ['Zero electrical resistance only', 'Perfect expulsion of magnetic flux from the interior of the material', 'Enhanced optical reflectivity', 'Quantised energy levels for conduction electrons'],
      correctAnswer: 1, topic: 'Superconductivity', difficulty: 'hard',
    },
    {
      id: 14,
      text: 'The optical absorption edge of a semiconductor occurs at photon energy approximately equal to:',
      options: ['The Fermi energy E_F', 'Twice the thermal energy k_B T', 'The band gap energy E_g', 'The Debye energy ħω_D'],
      correctAnswer: 2, topic: 'Optical Properties', difficulty: 'medium',
    },
    {
      id: 15,
      text: 'According to the time-independent Schrödinger equation, the wave function ψ of a particle in a 1D box of length L must satisfy which boundary condition?',
      options: ['ψ is non-zero at the walls', 'ψ = 0 at x = 0 and x = L (infinite potential walls)', 'dψ/dx = 0 at both walls', 'ψ has a maximum at both walls'],
      correctAnswer: 1, topic: 'Quantum Mechanics', difficulty: 'medium',
    },
  ],

  mmin: [
    {
      id: 1,
      text: 'Nesosilicates are characterised by:',
      options: ['Infinite chains of linked SiO₄ tetrahedra', 'Isolated SiO₄⁴⁻ tetrahedra not linked to each other', 'Sheets of corner-sharing SiO₄ tetrahedra', 'Three-dimensional frameworks of SiO₄ tetrahedra'],
      correctAnswer: 1, topic: 'Silicate Structures', difficulty: 'easy',
    },
    {
      id: 2,
      text: 'In the ASTM cement notation, C3S refers to:',
      options: ['3CaO·SiO₂ (tricalcium silicate, alite)', 'CaO·3SiO₂', '3CaO·Al₂O₃', 'CaO·3SO₃'],
      correctAnswer: 0, topic: 'Portland Cement', difficulty: 'easy',
    },
    {
      id: 3,
      text: 'During Portland cement hydration, the rapid initial set is primarily caused by:',
      options: ['Slow hydration of C2S', 'Rapid hydration of C3A forming ettringite', 'Evaporation of mixing water', 'Carbonation of calcium silicate hydrate (C-S-H)'],
      correctAnswer: 1, topic: 'Hydration Reactions', difficulty: 'medium',
    },
    {
      id: 4,
      text: 'The Si/O ratio in a tectosilicate framework (e.g. quartz) is:',
      options: ['1:4', '1:3', '1:2', '2:5'],
      correctAnswer: 2, topic: 'Silicate Structures', difficulty: 'medium',
    },
    {
      id: 5,
      text: 'Glass is best described as:',
      options: ['A crystalline solid with long-range order', 'An amorphous solid with short-range order but no long-range order', 'A supercooled liquid with crystalline domains', 'A polycrystalline material with nanoscale grains'],
      correctAnswer: 1, topic: 'Glass Structure', difficulty: 'easy',
    },
    {
      id: 6,
      text: 'The role of Na₂O as a network modifier in silicate glass is to:',
      options: ['Increase the connectivity of the SiO₄ network', 'Break Si–O–Si bonds, creating non-bridging oxygens and lowering viscosity', 'Increase the refractive index without affecting viscosity', 'Introduce aluminium into tetrahedral sites'],
      correctAnswer: 1, topic: 'Glass Structure', difficulty: 'medium',
    },
    {
      id: 7,
      text: 'Sintering is a densification process driven primarily by:',
      options: ['External pressure applied above the melting point', 'Reduction of total surface energy through diffusion at elevated temperature', 'Rapid quenching from the liquid state', 'Chemical reaction between powder particles'],
      correctAnswer: 1, topic: 'Ceramics Processing', difficulty: 'medium',
    },
    {
      id: 8,
      text: 'On the Mohs hardness scale, which mineral defines hardness level 7?',
      options: ['Feldspar', 'Quartz', 'Topaz', 'Corundum'],
      correctAnswer: 1, topic: 'Hardness', difficulty: 'easy',
    },
    {
      id: 9,
      text: 'The fracture toughness K_Ic of ceramics is generally low because:',
      options: ['Ceramics have very high yield stresses making plastic deformation easy', 'Ceramics lack mobile dislocations that could relax stress concentrations at crack tips', 'Ceramics are typically porous materials', 'Ceramics form in the cubic crystal system only'],
      correctAnswer: 1, topic: 'Fracture Toughness', difficulty: 'medium',
    },
    {
      id: 10,
      text: 'Thermal shock resistance of a ceramic is improved by:',
      options: ['Increasing the coefficient of thermal expansion', 'Reducing fracture toughness', 'High thermal conductivity and low elastic modulus (low stored elastic energy)', 'Increasing grain size to maximise porosity'],
      correctAnswer: 2, topic: 'Thermal Shock Resistance', difficulty: 'hard',
    },
    {
      id: 11,
      text: 'Phyllosilicates (e.g. clay minerals, mica) are characterised by:',
      options: ['Isolated SiO₄ tetrahedra', 'Single chains of SiO₄ tetrahedra (Si₂O₆ repeat)', 'Infinite sheets of corner-sharing SiO₄ tetrahedra (Si₂O₅ repeat)', 'Three-dimensional framework of SiO₄ tetrahedra'],
      correctAnswer: 2, topic: 'Silicate Structures', difficulty: 'medium',
    },
    {
      id: 12,
      text: 'Portland cement clinker constituent C4AF (ferrite phase) primarily influences:',
      options: ['Early strength development', 'The grey colour of cement and moderate heat of hydration', 'Flash setting if not controlled by gypsum', 'Long-term strength gain via slow hydration'],
      correctAnswer: 1, topic: 'Portland Cement', difficulty: 'hard',
    },
    {
      id: 13,
      text: 'Refractory materials must resist high temperatures primarily because they have:',
      options: ['Low melting points and high ductility', 'High melting points, chemical inertness, and thermal stability', 'High thermal expansion coefficients', 'Low thermal conductivity and high porosity only'],
      correctAnswer: 1, topic: 'Refractory Materials', difficulty: 'easy',
    },
    {
      id: 14,
      text: 'Open porosity in a ceramic is detrimental to mechanical strength because:',
      options: ['Pores increase the density of the material', 'Pores act as stress concentrators and reduce the effective load-bearing cross-section', 'Pores enhance crack deflection toughening mechanisms', 'Pores reduce the coefficient of thermal expansion'],
      correctAnswer: 1, topic: 'Porosity and Density', difficulty: 'medium',
    },
    {
      id: 15,
      text: 'Kaolinite, a common clay mineral, has the ideal composition:',
      options: ['Al₂Si₄O₁₀(OH)₂', 'Al₂Si₂O₅(OH)₄', 'Mg₃Si₄O₁₀(OH)₂', 'KAl₂(AlSi₃O₁₀)(OH)₂'],
      correctAnswer: 1, topic: 'Clay Minerals', difficulty: 'hard',
    },
  ],

  proctech: [
    {
      id: 1,
      text: 'The continuity equation for steady-state flow in a pipe states that:',
      options: ['Pressure is constant along the pipe', 'ρ₁A₁v₁ = ρ₂A₂v₂ (mass flow rate is conserved)', 'Velocity is constant along the pipe', 'Density decreases linearly with pipe length'],
      correctAnswer: 1, topic: 'Mass Balance', difficulty: 'easy',
    },
    {
      id: 2,
      text: 'The Bernoulli equation (for incompressible, inviscid, steady flow) states that along a streamline:',
      options: ['Pressure is constant', 'P + ½ρv² + ρgz = constant', 'P · ρv² = constant', 'P − ½ρv² = constant'],
      correctAnswer: 1, topic: 'Fluid Mechanics', difficulty: 'easy',
    },
    {
      id: 3,
      text: 'For a continuously stirred tank reactor (CSTR) operating at steady state with first-order reaction (rate = kC_A), the design equation gives outlet conversion X_A as:',
      options: ['X_A = kτ', 'X_A = kτ / (1 + kτ)', 'X_A = 1 − e^(−kτ)', 'X_A = kτ²'],
      correctAnswer: 1, topic: 'Reactor Types', difficulty: 'medium',
    },
    {
      id: 4,
      text: 'A plug flow reactor (PFR) differs from a CSTR in that:',
      options: ['It operates at a single uniform concentration throughout', 'Composition varies along the reactor length with no axial mixing', 'It is always operated at higher temperature', 'It can only handle liquid-phase reactions'],
      correctAnswer: 1, topic: 'Reactor Types', difficulty: 'medium',
    },
    {
      id: 5,
      text: 'The Log Mean Temperature Difference (LMTD) method for heat exchanger design defines LMTD as:',
      options: ['(ΔT₁ + ΔT₂) / 2', '(ΔT₁ − ΔT₂) / ln(ΔT₁/ΔT₂)', '(ΔT₁ · ΔT₂)^0.5', 'ΔT₁ · ln(ΔT₂/ΔT₁)'],
      correctAnswer: 1, topic: 'Heat Exchangers', difficulty: 'medium',
    },
    {
      id: 6,
      text: 'The Reynolds number Re = ρvD/μ characterises flow regime. Turbulent flow in a smooth pipe typically occurs for Re:',
      options: ['Re < 100', '100 < Re < 1000', 'Re < 2300', 'Re > 4000'],
      correctAnswer: 3, topic: 'Dimensionless Numbers', difficulty: 'easy',
    },
    {
      id: 7,
      text: 'In distillation, the McCabe-Thiele method uses:',
      options: ['Energy balances only to find the number of theoretical stages', 'Graphical construction on a y-x diagram using operating lines and equilibrium curve', 'The Fenske equation for minimum reflux', 'A differential equation for the column height'],
      correctAnswer: 1, topic: 'Distillation', difficulty: 'medium',
    },
    {
      id: 8,
      text: 'Increasing the reflux ratio in a distillation column above the minimum value:',
      options: ['Reduces the number of theoretical stages required but increases energy consumption', 'Reduces both the number of stages and energy consumption', 'Increases the number of theoretical stages required', 'Has no effect on separation sharpness'],
      correctAnswer: 0, topic: 'Distillation', difficulty: 'hard',
    },
    {
      id: 9,
      text: 'The Hagen-Poiseuille law gives the pressure drop for laminar flow in a pipe as:',
      options: ['ΔP = 8μLQ / (πR⁴)', 'ΔP = 8μLQ / (πR²)', 'ΔP = ρv²L / (2D)', 'ΔP = μvL / R'],
      correctAnswer: 0, topic: 'Fluid Mechanics', difficulty: 'hard',
    },
    {
      id: 10,
      text: 'The Nusselt number Nu = hD/k relates:',
      options: ['Viscous forces to inertial forces', 'Convective to conductive heat transfer at a surface', 'Momentum diffusivity to thermal diffusivity', 'Inertial forces to buoyancy forces'],
      correctAnswer: 1, topic: 'Dimensionless Numbers', difficulty: 'medium',
    },
    {
      id: 11,
      text: 'During crystallisation from solution, supersaturation is the driving force for:',
      options: ['Dissolution of the solute', 'Nucleation and crystal growth', 'Evaporation of the solvent only', 'Filtration of the product'],
      correctAnswer: 1, topic: 'Crystallization', difficulty: 'easy',
    },
    {
      id: 12,
      text: 'In spray drying, the primary heat and mass transfer mechanism for removing moisture from droplets is:',
      options: ['Conduction through the droplet surface', 'Convective heat transfer from hot gas to droplet surface, and diffusion of water vapour from surface to gas', 'Radiation from the dryer walls to the droplets', 'Direct contact heating between droplets'],
      correctAnswer: 1, topic: 'Drying', difficulty: 'medium',
    },
    {
      id: 13,
      text: 'For a batch reactor with first-order reaction rate −r_A = kC_A, the concentration at time t is:',
      options: ['C_A = C_A0 − kt', 'C_A = C_A0 · e^(−kt)', 'C_A = C_A0 / (1 + kC_A0 t)', 'C_A = C_A0 · kt'],
      correctAnswer: 1, topic: 'Reactor Types', difficulty: 'medium',
    },
    {
      id: 14,
      text: 'The Darcy-Weisbach equation for pressure drop in pipe flow is:',
      options: ['ΔP = f · (L/D) · (ρv²/2)', 'ΔP = f · (D/L) · (ρv²/2)', 'ΔP = f · L · D · ρv', 'ΔP = f · (L/D) · (ρv)'],
      correctAnswer: 0, topic: 'Fluid Mechanics', difficulty: 'medium',
    },
    {
      id: 15,
      text: 'An energy balance on a steady-state open system (e.g. a heat exchanger) without shaft work reduces to:',
      options: ['Q = ΔU', 'Q = ΔH (difference in enthalpy of outlet and inlet streams)', 'Q = ΔG', 'Q = −W_shaft'],
      correctAnswer: 1, topic: 'Energy Balance', difficulty: 'medium',
    },
  ],
};

const ACHIEVEMENTS = [
  { id: 'first_step',  name: 'First Step',      icon: '◉',  desc: 'Complete your first checkpoint' },
  { id: 'sharp_mind',  name: 'Sharp Mind',       icon: '✦',  desc: 'Score 90 or above on any checkpoint' },
  { id: 'perfect',     name: 'Perfect Score',    icon: '★',  desc: 'Score 100 on any checkpoint' },
  { id: 'on_a_roll',   name: 'On a Roll',        icon: '⟳',  desc: 'Complete 3 consecutive checkpoints in one class' },
  { id: 'halfway',     name: 'Halfway There',    icon: '◈',  desc: 'Complete 3 or more checkpoints total' },
  { id: 'consistent',  name: 'Consistent',       icon: '≡',  desc: 'Score 70+ on 3 or more checkpoints' },
  { id: 'points_300',  name: 'Point Hoarder',    icon: '◎',  desc: 'Earn 300 total points' },
  { id: 'season_done', name: 'Season Complete',  icon: '✦✦', desc: 'Complete all 6 checkpoints in one class' },
];

/* ── Community seed questions (static, never written to localStorage) ── */
const COMMUNITY_SEED_QUESTIONS = [
  {
    id: 'seed-metm-1',
    classId: 'metm',
    topic: 'Crystal Structure',
    difficulty: 'medium',
    text: 'Face-centred cubic (FCC) metals generally have higher ductility than body-centred cubic (BCC) metals at room temperature because:',
    options: [
      'FCC has a higher atomic packing factor than BCC',
      'FCC has 12 slip systems compared to BCC\'s 6, enabling easier dislocation glide',
      'FCC metals always have lower yield strength than BCC metals',
      'BCC metals lack close-packed planes on which slip can occur',
    ],
    correctAnswer: 1,
    submittedBy: 'Anna K.',
    submittedAt: '2026-02-18',
  },
  {
    id: 'seed-metm-2',
    classId: 'metm',
    topic: 'Strengthening Mechanisms',
    difficulty: 'easy',
    text: 'Grain refinement strengthens a metal primarily because:',
    options: [
      'Smaller grains have fewer dislocations',
      'Grain boundaries act as barriers to dislocation motion',
      'Smaller grains increase the vacancy concentration',
      'Grain boundaries reduce the elastic modulus',
    ],
    correctAnswer: 1,
    submittedBy: 'Leon B.',
    submittedAt: '2026-02-21',
  },
  {
    id: 'seed-thermo-1',
    classId: 'thermo',
    topic: 'Second Law',
    difficulty: 'medium',
    text: 'Which statement correctly describes an irreversible process?',
    options: [
      'The total entropy of the universe remains constant',
      'The process can be reversed with no net change in the surroundings',
      'The total entropy of the universe increases',
      'The system returns to its initial state after the process',
    ],
    correctAnswer: 2,
    submittedBy: 'Priya M.',
    submittedAt: '2026-02-25',
  },
  {
    id: 'seed-thermo-2',
    classId: 'thermo',
    topic: 'Gibbs Free Energy',
    difficulty: 'hard',
    text: 'For a chemical reaction at equilibrium at constant T and P, which of the following is true?',
    options: [
      'ΔG = ΔH',
      'ΔG° = 0',
      'ΔG = 0',
      'ΔS = 0',
    ],
    correctAnswer: 2,
    submittedBy: 'Jonas W.',
    submittedAt: '2026-03-01',
  },
  {
    id: 'seed-mphy-1',
    classId: 'mphy',
    topic: 'Bending',
    difficulty: 'medium',
    text: 'In a simply supported beam under a central point load, the maximum bending moment occurs:',
    options: [
      'At the supports',
      'At the quarter-span points',
      'At the midspan, directly under the load',
      'At the point of zero shear force closest to the right support',
    ],
    correctAnswer: 2,
    submittedBy: 'Felix S.',
    submittedAt: '2026-02-28',
  },
  {
    id: 'seed-mphy-2',
    classId: 'mphy',
    topic: 'Fatigue',
    difficulty: 'hard',
    text: 'According to the Goodman criterion, a component under combined mean stress σ_m and alternating stress σ_a fails by fatigue when:',
    options: [
      'σ_a / S_e + σ_m / S_ut = 1',
      'σ_a / S_ut + σ_m / S_e = 1',
      'σ_a + σ_m = S_e',
      'σ_a · σ_m = S_e · S_ut',
    ],
    correctAnswer: 0,
    submittedBy: 'Lukas N.',
    submittedAt: '2026-03-05',
  },
];
