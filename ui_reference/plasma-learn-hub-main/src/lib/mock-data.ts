export type Difficulty = "Introductory" | "Intermediate" | "Advanced";

export type Lesson = {
  id: string;
  title: string;
  body: string[];
  equation?: { latex: string; caption: string };
  diagram?: "tokamak" | "confinement" | "lawson" | "stability";
};

export type Module = {
  slug: string;
  title: string;
  category: "Physics" | "Nuclear Fusion";
  summary: string;
  difficulty: Difficulty;
  minutes: number;
  progress: number;
  topics: string[];
  lessons: Lesson[];
  check: { question: string; options: string[]; answer: number; explain: string };
};

export const modules: Module[] = [
  {
    slug: "plasma-physics",
    title: "Plasma Physics Foundations",
    category: "Physics",
    summary:
      "The fourth state of matter: quasi-neutrality, Debye shielding, and collective behaviour of charged particles.",
    difficulty: "Introductory",
    minutes: 45,
    progress: 72,
    topics: ["Debye length", "Plasma frequency", "Quasi-neutrality"],
    lessons: [
      {
        id: "l1",
        title: "What makes a gas a plasma",
        body: [
          "A plasma is an ionised gas in which collective electromagnetic interactions dominate over binary collisions. Three criteria must hold: the Debye length must be small compared with the system size, the number of particles in a Debye sphere must be large, and the plasma frequency must exceed the neutral collision frequency.",
          "Debye shielding is the mechanism by which a plasma screens out electric potentials. A test charge introduced into a plasma is surrounded by a cloud of opposite charge that exponentially attenuates its field.",
        ],
        equation: {
          latex: "λ_D = √( ε₀ k_B T_e / n_e e² )",
          caption: "Debye length — the screening scale of a quasi-neutral plasma.",
        },
        diagram: "confinement",
      },
      {
        id: "l2",
        title: "Plasma oscillations",
        body: [
          "Displace the electron fluid relative to the ions and the restoring electrostatic force produces oscillation at the electron plasma frequency. This frequency sets the natural clock of the plasma and determines which electromagnetic waves can propagate.",
        ],
        equation: {
          latex: "ω_pe = √( n_e e² / ε₀ m_e )",
          caption: "Electron plasma frequency.",
        },
      },
      {
        id: "l3",
        title: "Single particle motion",
        body: [
          "In a uniform magnetic field a charged particle gyrates at the cyclotron frequency with a Larmor radius set by its perpendicular velocity. Superimposed electric fields produce an E×B drift that is independent of charge and mass — the reason whole plasmas can be moved coherently.",
        ],
        equation: { latex: "r_L = m v_⊥ / (|q| B)", caption: "Larmor (gyro) radius." },
      },
    ],
    check: {
      question: "What happens to the Debye length as electron density increases at fixed temperature?",
      options: ["It increases", "It decreases", "It is unchanged", "It becomes imaginary"],
      answer: 1,
      explain: "λ_D ∝ 1/√n_e, so denser plasmas screen fields over shorter distances.",
    },
  },
  {
    slug: "magnetic-confinement",
    title: "Magnetic Confinement",
    category: "Nuclear Fusion",
    summary:
      "Why field lines must twist: toroidal and poloidal fields, the safety factor q, and equilibrium pressure balance.",
    difficulty: "Intermediate",
    minutes: 60,
    progress: 38,
    topics: ["Safety factor", "Beta", "Grad–Shafranov"],
    lessons: [
      {
        id: "l1",
        title: "From mirrors to tori",
        body: [
          "Straight magnetic bottles leak along the field lines. Closing the field into a torus removes the ends, but curvature and gradient drifts then separate charge vertically. A helical twist short-circuits that separation.",
        ],
        equation: { latex: "q(r) = r B_φ / ( R B_θ )", caption: "Safety factor: field-line pitch." },
        diagram: "tokamak",
      },
      {
        id: "l2",
        title: "Equilibrium and beta",
        body: [
          "In ideal MHD equilibrium the plasma pressure gradient is balanced by the Lorentz force. The dimensionless ratio beta measures how efficiently magnetic pressure is converted into confined plasma pressure — the economic figure of merit of a magnetic device.",
        ],
        equation: { latex: "∇p = J × B ,  β = 2μ₀⟨p⟩ / B²", caption: "Force balance and plasma beta." },
        diagram: "confinement",
      },
    ],
    check: {
      question: "Why must a toroidal field be combined with a poloidal field?",
      options: [
        "To increase the plasma current",
        "To cancel vertical charge separation from drifts",
        "To heat the plasma ohmically",
        "To reduce neutron flux",
      ],
      answer: 1,
      explain:
        "Curvature and grad-B drifts separate ions and electrons vertically; a rotational transform connects top and bottom so the resulting E×B outflow cancels.",
    },
  },
  {
    slug: "tokamaks",
    title: "Tokamak Engineering",
    category: "Nuclear Fusion",
    summary:
      "Central solenoid, toroidal field coils, divertor physics and the operational envelope of modern devices.",
    difficulty: "Intermediate",
    minutes: 55,
    progress: 12,
    topics: ["Divertor", "H-mode", "ITER"],
    lessons: [
      {
        id: "l1",
        title: "Anatomy of a tokamak",
        body: [
          "The central solenoid drives plasma current inductively; toroidal field coils provide the dominant field; poloidal coils shape and position the plasma. The divertor handles exhaust power and helium ash at the strike points.",
        ],
        diagram: "tokamak",
        equation: { latex: "P_fus = ¼ n² ⟨σv⟩ E_fus V", caption: "Fusion power scales as density squared." },
      },
      {
        id: "l2",
        title: "The Lawson criterion",
        body: [
          "Ignition requires the triple product of density, temperature and energy confinement time to exceed a threshold. This single number connects plasma physics, engineering and reactor economics.",
        ],
        equation: { latex: "n T τ_E ≳ 3 × 10²¹ keV·s·m⁻³", caption: "D–T triple product for ignition." },
        diagram: "lawson",
      },
    ],
    check: {
      question: "What is the primary role of the divertor?",
      options: [
        "Generate the toroidal field",
        "Exhaust heat and helium ash",
        "Initiate breakdown",
        "Measure electron temperature",
      ],
      answer: 1,
      explain: "The divertor diverts scrape-off-layer field lines to target plates that absorb heat and pump ash.",
    },
  },
  {
    slug: "plasma-stability",
    title: "Plasma Stability & MHD",
    category: "Physics",
    summary:
      "Kink and ballooning modes, tearing instabilities, disruptions, and the control systems that suppress them.",
    difficulty: "Advanced",
    minutes: 75,
    progress: 0,
    topics: ["Kink modes", "NTMs", "Disruptions"],
    lessons: [
      {
        id: "l1",
        title: "Ideal MHD instabilities",
        body: [
          "Free energy in current and pressure gradients drives kink and ballooning modes. The energy principle determines stability: if any admissible displacement lowers the potential energy, the plasma is unstable.",
        ],
        equation: { latex: "δW = ½ ∫ ξ* · F(ξ) dV < 0 ⇒ unstable", caption: "The MHD energy principle." },
        diagram: "stability",
      },
      {
        id: "l2",
        title: "Disruption mitigation",
        body: [
          "A disruption dumps stored thermal and magnetic energy in milliseconds. Massive gas or shattered-pellet injection radiates that energy isotropically before it can damage plasma-facing components.",
        ],
      },
    ],
    check: {
      question: "Neoclassical tearing modes primarily degrade which quantity?",
      options: ["Toroidal field strength", "Energy confinement time", "Neutron energy", "Coil current"],
      answer: 1,
      explain: "Magnetic islands flatten pressure profiles across the island width, reducing τ_E.",
    },
  },
  {
    slug: "fusion-materials",
    title: "Fusion Materials & Tritium",
    category: "Nuclear Fusion",
    summary:
      "Neutron damage in dpa, tungsten plasma-facing components, breeding blankets and the tritium fuel cycle.",
    difficulty: "Advanced",
    minutes: 50,
    progress: 0,
    topics: ["Tungsten", "Breeding blanket", "Neutronics"],
    lessons: [
      {
        id: "l1",
        title: "Living with 14 MeV neutrons",
        body: [
          "Fusion neutrons displace lattice atoms, produce helium by transmutation and embrittle structural steels. Damage is measured in displacements per atom; reactor-relevant lifetimes demand tens of dpa.",
        ],
        equation: { latex: "D + T → ⁴He (3.5 MeV) + n (14.1 MeV)", caption: "The deuterium–tritium reaction." },
      },
      {
        id: "l2",
        title: "Breeding the fuel",
        body: [
          "Tritium does not occur naturally in useful quantities. Lithium-bearing blankets surrounding the plasma capture neutrons and breed tritium, with a required breeding ratio slightly above unity.",
        ],
        equation: { latex: "⁶Li + n → ⁴He + T + 4.8 MeV", caption: "Tritium breeding in lithium." },
      },
    ],
    check: {
      question: "Why must the tritium breeding ratio exceed 1?",
      options: [
        "To compensate losses and decay",
        "To increase neutron energy",
        "To cool the blanket",
        "To reduce activation",
      ],
      answer: 0,
      explain: "Losses in processing, retention and radioactive decay mean a self-sufficient plant needs TBR > 1.",
    },
  },
  {
    slug: "electromagnetism",
    title: "Electromagnetism for Plasmas",
    category: "Physics",
    summary: "Maxwell's equations, magnetic pressure and tension, and the frozen-in flux theorem.",
    difficulty: "Introductory",
    minutes: 40,
    progress: 100,
    topics: ["Maxwell", "Flux freezing", "Magnetic pressure"],
    lessons: [
      {
        id: "l1",
        title: "Frozen-in flux",
        body: [
          "In a perfectly conducting fluid the magnetic flux through any co-moving surface is constant: field lines are dragged with the plasma. This single idea explains everything from solar prominences to tokamak current profiles.",
        ],
        equation: { latex: "∂B/∂t = ∇ × (v × B)", caption: "Ideal induction equation." },
      },
    ],
    check: {
      question: "Magnetic pressure is given by:",
      options: ["B²/2μ₀", "μ₀B²", "B/μ₀", "μ₀/B²"],
      answer: 0,
      explain: "Magnetic energy density and magnetic pressure are both B²/2μ₀.",
    },
  },
];

export type Post = {
  id: string;
  author: string;
  handle: string;
  affiliation: string;
  time: string;
  body: string;
  tags: string[];
  upvotes: number;
  comments: { author: string; handle: string; body: string; time: string }[];
  saved?: boolean;
};

export const posts: Post[] = [
  {
    id: "p1",
    author: "Dr. Aiko Tanaka",
    handle: "@a_tanaka",
    affiliation: "Plasma Diagnostics, JT-60SA",
    time: "2h",
    body: "New Thomson scattering data suggests the pedestal in our latest H-mode shots is 15% wider than the EPED prediction. Either the model underestimates the diamagnetic stabilisation, or our edge current reconstruction is off. Anyone seen the same on AUG?",
    tags: ["#PlasmaPhysics", "#Tokamaks"],
    upvotes: 214,
    comments: [
      {
        author: "Marek Vlk",
        handle: "@mvlk",
        body: "We see similar widening at high triangularity. Check whether your kinetic EFIT includes fast-ion pressure.",
        time: "1h",
      },
      { author: "Sara Ibrahim", handle: "@s_ibrahim", body: "Would love the shot numbers — comparing to COMPASS.", time: "44m" },
    ],
  },
  {
    id: "p2",
    author: "Fusion Materials Group",
    handle: "@w_pfc",
    affiliation: "Tungsten PFC consortium",
    time: "5h",
    body: "Recrystallisation of tungsten monoblocks after 1000 ELM-like cycles at 20 MJ/m²s^0.5 — cracking initiates at grain boundaries near the cooling tube. Full micrographs in the thread.",
    tags: ["#Fusion", "#Research"],
    upvotes: 128,
    comments: [
      { author: "Elena Rossi", handle: "@e_rossi", body: "Did potassium-doped W behave better in the same run?", time: "3h" },
    ],
  },
  {
    id: "p3",
    author: "Jonas Weir",
    handle: "@jweir",
    affiliation: "MSc student, plasma control",
    time: "8h",
    body: "Wrote a tiny Grad–Shafranov solver to build intuition for shaping. Watching the separatrix form when you turn on the divertor coil is genuinely one of the nicest things in physics.",
    tags: ["#PlasmaPhysics", "#Learning"],
    upvotes: 341,
    comments: [
      { author: "Dr. Aiko Tanaka", handle: "@a_tanaka", body: "Great way to learn. Try adding a vertical stability feedback loop next.", time: "6h" },
      { author: "Priya Raman", handle: "@praman", body: "Please share the notebook!", time: "5h" },
    ],
  },
  {
    id: "p4",
    author: "Priya Raman",
    handle: "@praman",
    affiliation: "Stellarator optimisation",
    time: "1d",
    body: "Quasi-isodynamic configurations keep surprising me: near-zero bootstrap current with decent neoclassical transport. The design space is far from exhausted.",
    tags: ["#Fusion", "#Research"],
    upvotes: 96,
    comments: [],
  },
  {
    id: "p5",
    author: "Highschool Physics Club",
    handle: "@fusion_class",
    affiliation: "Classroom collective",
    time: "1d",
    body: "Our students built a magnetic-field mapper with hall sensors and plotted the field of a model toroidal coil. Their measured 1/R falloff matched theory to within 6%. Proud teacher post.",
    tags: ["#Learning", "#Tokamaks"],
    upvotes: 512,
    comments: [{ author: "Marek Vlk", handle: "@mvlk", body: "This is wonderful. Share the sensor build list?", time: "20h" }],
  },
];

export const topics = ["#Fusion", "#PlasmaPhysics", "#Tokamaks", "#Research", "#Learning", "#Stellarators"];

export type Proposal = {
  id: string;
  kind: "research" | "classroom";
  title: string;
  field: string;
  difficulty: Difficulty;
  skills: string[];
  team: string;
  spots: number;
  lead: string;
  summary: string;
  detail: string[];
};

export const proposals: Proposal[] = [
  {
    id: "r1",
    kind: "research",
    title: "Disruption prediction from magnetic pickup coils",
    field: "Plasma control",
    difficulty: "Advanced",
    skills: ["Signal processing", "Python", "MHD"],
    team: "4–6 people",
    spots: 2,
    lead: "Dr. Aiko Tanaka",
    summary:
      "Build an open, reproducible benchmark of precursor detection on public tokamak disruption datasets.",
    detail: [
      "We want a shared benchmark that treats disruption precursors as a time-series problem with strictly causal features — no leakage from post-disruption samples.",
      "Deliverables: a curated dataset description, a baseline detector, and a public leaderboard protocol with clearly stated warning-time metrics.",
    ],
  },
  {
    id: "r2",
    kind: "research",
    title: "Tungsten dust transport in the divertor scrape-off layer",
    field: "Materials",
    difficulty: "Advanced",
    skills: ["Monte Carlo", "Fluid dynamics", "Fortran"],
    team: "3 people",
    spots: 1,
    lead: "Elena Rossi",
    summary: "Couple a dust transport code to an existing SOL plasma solution and compare with camera data.",
    detail: [
      "Dust remobilisation sets a mobilisable inventory limit for licensing. Existing codes are rarely benchmarked against fast-camera trajectories.",
      "Looking for a collaborator comfortable with stochastic particle transport.",
    ],
  },
  {
    id: "r3",
    kind: "research",
    title: "Open Grad–Shafranov equilibrium library",
    field: "Computational physics",
    difficulty: "Intermediate",
    skills: ["Numerical methods", "Python", "Docs"],
    team: "5 people",
    spots: 3,
    lead: "Jonas Weir",
    summary: "A readable, well-documented free-boundary equilibrium solver aimed at students.",
    detail: [
      "Most equilibrium codes are excellent and unreadable. We want one that a second-year student can follow line by line.",
      "Contributions welcome in solver internals, notebooks, or documentation.",
    ],
  },
  {
    id: "c1",
    kind: "classroom",
    title: "Build a Hall-sensor magnetic field mapper",
    field: "Experimental physics",
    difficulty: "Introductory",
    skills: ["Arduino", "Plotting", "Lab safety"],
    team: "Groups of 3",
    spots: 8,
    lead: "Highschool Physics Club",
    summary: "A four-week classroom project measuring the 1/R field of a model toroidal coil.",
    detail: [
      "Students assemble a two-axis stage, log Hall sensor readings, and compare with the analytic toroidal field.",
      "Includes assessment rubric and a safety checklist for low-voltage coil work.",
    ],
  },
  {
    id: "c2",
    kind: "classroom",
    title: "Lawson criterion spreadsheet challenge",
    field: "Fusion energy",
    difficulty: "Introductory",
    skills: ["Algebra", "Spreadsheets"],
    team: "Pairs",
    spots: 12,
    lead: "Sara Ibrahim",
    summary: "Students derive the triple product and evaluate real devices against ignition.",
    detail: [
      "Pairs estimate nTτ for six historical devices using published parameters and plot progress over six decades.",
      "Great bridge between algebra class and real reactor physics.",
    ],
  },
  {
    id: "c3",
    kind: "classroom",
    title: "Plasma in a jar: safe glow discharge demo",
    field: "Demonstrations",
    difficulty: "Intermediate",
    skills: ["Vacuum basics", "Electronics"],
    team: "Whole class",
    spots: 5,
    lead: "Marek Vlk",
    summary: "A low-pressure glow discharge demonstration with a full risk assessment.",
    detail: [
      "Demonstrates ionisation, striations and pressure dependence with inexpensive equipment.",
      "Teacher supervision and a documented risk assessment are required.",
    ],
  },
];

export const recommendations = [
  {
    title: "Magnetic Confinement",
    type: "Module",
    href: "/learn/magnetic-confinement",
    reason: "You completed Electromagnetism for Plasmas and scored highly on flux freezing.",
    confidence: 0.92,
  },
  {
    title: "Pedestal width vs EPED — open thread",
    type: "Discussion",
    href: "/community/p1",
    reason: "Matches your saved topic #Tokamaks and three lessons on transport.",
    confidence: 0.78,
  },
  {
    title: "Open Grad–Shafranov equilibrium library",
    type: "Project",
    href: "/collaborate",
    reason: "Skill overlap: numerical methods, Python. Difficulty one step above your current level.",
    confidence: 0.71,
  },
];

export const weeklyActivity = [
  { day: "Mon", minutes: 24, lessons: 1 },
  { day: "Tue", minutes: 46, lessons: 2 },
  { day: "Wed", minutes: 12, lessons: 0 },
  { day: "Thu", minutes: 68, lessons: 3 },
  { day: "Fri", minutes: 38, lessons: 2 },
  { day: "Sat", minutes: 82, lessons: 4 },
  { day: "Sun", minutes: 30, lessons: 1 },
];

export const topicMastery = [
  { topic: "Plasma", value: 78 },
  { topic: "MHD", value: 54 },
  { topic: "Materials", value: 31 },
  { topic: "Diagnostics", value: 46 },
  { topic: "Reactors", value: 62 },
];

export const engagementSeries = [
  { month: "Jan", learners: 1820, completion: 41 },
  { month: "Feb", learners: 2140, completion: 44 },
  { month: "Mar", learners: 2610, completion: 47 },
  { month: "Apr", learners: 3080, completion: 52 },
  { month: "May", learners: 3465, completion: 55 },
  { month: "Jun", learners: 4120, completion: 58 },
];

export const popularTopics = [
  { topic: "Tokamaks", sessions: 3820 },
  { topic: "Plasma physics", sessions: 3410 },
  { topic: "Materials", sessions: 1980 },
  { topic: "Stellarators", sessions: 1240 },
  { topic: "Diagnostics", sessions: 960 },
];
