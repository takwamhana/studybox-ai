import notebook from "@/assets/product-notebook.jpg";
import pen from "@/assets/product-pen.jpg";
import planner from "@/assets/product-planner.jpg";
import headphones from "@/assets/product-headphones.jpg";
import stickies from "@/assets/product-stickies.jpg";
import mug from "@/assets/product-mug.jpg";
import lamp from "@/assets/product-lamp.jpg";

export type Category = "Stationery" | "Focus" | "Tech" | "Wellness" | "Planning";

export type Product = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  category: Category;
  image: string;
  fields: string[]; // recommended fields of study
  styles: string[]; // study styles
};

export const PRODUCTS: Product[] = [
  {
    id: "focus-notebook",
    name: "Soft-touch Notebook",
    tagline: "Heavyweight matte paper",
    description:
      "A 200-page hardcover notebook with dotted, soft-touch pages designed for deep work and clean handwriting.",
    price: 24,
    category: "Stationery",
    image: notebook,
    fields: ["computer-science", "law", "medicine", "engineering"],
    styles: ["organized", "minimalistic", "visual"],
  },
  {
    id: "precision-pen",
    name: "Precision Pen",
    tagline: "Effortless every stroke",
    description:
      "A balanced matte rollerball pen with low ink drag — engineered for long writing sessions without fatigue.",
    price: 18,
    category: "Stationery",
    image: pen,
    fields: ["law", "medicine", "computer-science", "engineering"],
    styles: ["organized", "minimalistic", "last-minute"],
  },
  {
    id: "weekly-planner",
    name: "Weekly Planner",
    tagline: "One page, one week",
    description:
      "A minimal 52-week planner with time blocking, priorities and a reflection section.",
    price: 22,
    category: "Planning",
    image: planner,
    fields: ["law", "medicine", "computer-science", "engineering"],
    styles: ["organized", "visual"],
  },
  {
    id: "focus-headphones",
    name: "Quiet Headphones",
    tagline: "Cancel the noise, keep the focus",
    description:
      "Over-ear active noise cancelling headphones tuned for speech clarity and 30h battery life.",
    price: 129,
    category: "Tech",
    image: headphones,
    fields: ["computer-science", "engineering", "law", "medicine"],
    styles: ["last-minute", "minimalistic", "organized"],
  },
  {
    id: "color-system",
    name: "Color Recall Pack",
    tagline: "Visual memory, organized",
    description:
      "A curated set of pastel sticky notes and pigment liners — built for colour-coded notes and active recall.",
    price: 14,
    category: "Stationery",
    image: stickies,
    fields: ["medicine", "law", "computer-science"],
    styles: ["visual", "last-minute"],
  },
  {
    id: "deep-mug",
    name: "Deep Work Mug",
    tagline: "Warm focus, ceramic feel",
    description:
      "A 320ml stoneware mug with a soft-touch finish that keeps your coffee warm for the next chapter.",
    price: 19,
    category: "Wellness",
    image: mug,
    fields: ["computer-science", "medicine", "law", "engineering"],
    styles: ["organized", "last-minute", "minimalistic"],
  },
  {
    id: "warm-lamp",
    name: "Warm Desk Lamp",
    tagline: "Soft light, sharp mind",
    description:
      "A dimmable warm-light desk lamp with anti-glare diffuser, designed to ease eye strain during late nights.",
    price: 64,
    category: "Focus",
    image: lamp,
    fields: ["computer-science", "engineering", "medicine"],
    styles: ["organized", "last-minute", "minimalistic"],
  },
  // Law & Legal Studies
  {
    id: "case-highlighter-set",
    name: "Case Law Highlighter Set",
    tagline: "Color-code legal briefs",
    description:
      "Professional-grade highlighter set (4 colors) optimized for legal document annotation without bleeding through thin case law pages.",
    price: 16,
    category: "Stationery",
    image: stickies,
    fields: ["law", "political-science"],
    styles: ["organized", "visual"],
  },
  {
    id: "legal-pad-pro",
    name: "Legal Pad Pro",
    tagline: "Yellow perfection",
    description:
      "Traditional 50-sheet legal pad with premium paper quality, ideal for case notes and statutory analysis.",
    price: 12,
    category: "Stationery",
    image: notebook,
    fields: ["law"],
    styles: ["organized", "last-minute"],
  },
  {
    id: "statute-tracker",
    name: "Statute Tracking Planner",
    tagline: "Track amendments and updates",
    description:
      "Specialized planner for law students to track statutory changes, case amendments, and study topics with reference columns.",
    price: 28,
    category: "Planning",
    image: planner,
    fields: ["law", "political-science"],
    styles: ["organized", "visual"],
  },
  // Medicine & Healthcare
  {
    id: "anatomy-flashcards",
    name: "Anatomy Flashcard Deck",
    tagline: "Memorize systems fast",
    description:
      "1000+ medical imagery flashcards with Latin terms, organized by body system. Perfect for pre-clinical and clinical study.",
    price: 35,
    category: "Stationery",
    image: stickies,
    fields: ["medicine", "nursing", "pharmacy"],
    styles: ["visual", "organized"],
  },
  {
    id: "med-study-timer",
    name: "Pomodoro Study Timer",
    tagline: "60 min blocks for exams",
    description:
      "Physical timer optimized for medical study sessions with 25/60 min intervals, reducing screen time during long study hours.",
    price: 26,
    category: "Tech",
    image: lamp,
    fields: ["medicine", "nursing", "pharmacy"],
    styles: ["organized", "last-minute"],
  },
  {
    id: "eponyms-reference",
    name: "Medical Eponyms Reference",
    tagline: "500+ diseases & tests",
    description:
      "Laminated pocket reference guide for medical eponyms, syndromes, and clinical tests — perfect for hospital rounds and exams.",
    price: 15,
    category: "Stationery",
    image: notebook,
    fields: ["medicine"],
    styles: ["minimalistic", "visual"],
  },
  // Computer Science & Engineering
  {
    id: "code-notebook",
    name: "Code Pattern Notebook",
    tagline: "Algorithms & data structures",
    description:
      "Engineering notebook pre-printed with code templates and algorithm patterns for CS students learning design patterns.",
    price: 27,
    category: "Stationery",
    image: notebook,
    fields: ["computer-science", "engineering", "data-science"],
    styles: ["organized", "minimalistic"],
  },
  {
    id: "math-compass-set",
    name: "Engineering Compass Set",
    tagline: "Precision for diagrams",
    description:
      "Professional-grade compass, protractor, and ruler set for creating precise technical diagrams and circuit sketches.",
    price: 21,
    category: "Stationery",
    image: pen,
    fields: ["engineering", "architecture", "mathematics", "physics"],
    styles: ["organized", "minimalistic"],
  },
  {
    id: "graph-paper-pad",
    name: "Grid Pattern Pad (20 sheets)",
    tagline: "Perfect for sketches",
    description:
      "Premium graph paper for circuit diagrams, 3D sketches, and mathematical graphs. 50gsm prevents bleeding from ink pens.",
    price: 11,
    category: "Stationery",
    image: notebook,
    fields: ["computer-science", "engineering", "mathematics", "physics", "architecture"],
    styles: ["organized", "visual"],
  },
  // Business & Economics
  {
    id: "excel-shortcut-guide",
    name: "Excel Keyboard Guide",
    tagline: "Laminated shortcut reference",
    description:
      "Pocket-sized laminated cheat sheet with 100+ Excel shortcuts for financial modeling, accounting, and data analysis.",
    price: 8,
    category: "Stationery",
    image: pen,
    fields: ["business", "finance", "economics", "data-science"],
    styles: ["minimalistic"],
  },
  {
    id: "financial-calculator",
    name: "Scientific Calculator",
    tagline: "TI-approved for finance",
    description:
      "Financial calculator with NPV, IRR, and cash flow functions. Approved for exams in accounting, finance, and economics courses.",
    price: 45,
    category: "Tech",
    image: headphones,
    fields: ["business", "finance", "economics"],
    styles: ["organized"],
  },
  {
    id: "case-study-organizer",
    name: "Business Case Organizer",
    tagline: "Structured case analysis",
    description:
      "Pre-formatted workbook for case study analysis with sections for SWOT, Porter's Five Forces, and strategic recommendations.",
    price: 19,
    category: "Planning",
    image: planner,
    fields: ["business", "marketing"],
    styles: ["organized", "visual"],
  },
  // Psychology & Social Sciences
  {
    id: "research-notebook",
    name: "Research Methods Notebook",
    tagline: "Lab & study tracking",
    description:
      "Specialized notebook with pre-printed sections for hypothesis, methodology, data, and conclusions for psychology research.",
    price: 23,
    category: "Stationery",
    image: notebook,
    fields: ["psychology", "biology", "education"],
    styles: ["organized"],
  },
  {
    id: "theory-index-cards",
    name: "Theory Index Card Set",
    tagline: "300 cards for theories",
    description:
      "Pre-cut index cards ideal for organizing psychological theories, cognitive concepts, and behavioral models by school of thought.",
    price: 9,
    category: "Stationery",
    image: stickies,
    fields: ["psychology", "education", "literature"],
    styles: ["organized", "visual"],
  },
  // Languages & Literature
  {
    id: "translation-notebook",
    name: "Bilingual Translation Pad",
    tagline: "Side-by-side format",
    description:
      "Notebook divided into two columns for translating between languages while studying literature and linguistics.",
    price: 20,
    category: "Stationery",
    image: notebook,
    fields: ["languages", "literature"],
    styles: ["organized"],
  },
  {
    id: "etymology-flashcards",
    name: "Etymology Flashcard Deck",
    tagline: "500+ word roots & prefixes",
    description:
      "Master language acquisition through etymological patterns. Covers prefixes, suffixes, and roots across Romance and Germanic languages.",
    price: 18,
    category: "Stationery",
    image: stickies,
    fields: ["languages", "literature"],
    styles: ["visual", "organized"],
  },
  // Sciences (Physics, Chemistry, Biology)
  {
    id: "periodic-table-poster",
    name: "Periodic Table Poster",
    tagline: "Laminated A1 size",
    description:
      "Large laminated periodic table with oxidation states, electron configurations, and common reactions. Perfect for desk reference.",
    price: 14,
    category: "Stationery",
    image: notebook,
    fields: ["chemistry", "physics", "biology"],
    styles: ["minimalistic", "visual"],
  },
  {
    id: "lab-safety-kit",
    name: "Study Space Safety Kit",
    tagline: "Desk safety essentials",
    description:
      "Ergonomic desk accessories including wrist rest, monitor stand, and posture guide for long lab report and problem set sessions.",
    price: 32,
    category: "Tech",
    image: lamp,
    fields: ["chemistry", "biology", "physics", "engineering"],
    styles: ["organized"],
  },
  {
    id: "molecular-model-set",
    name: "Molecular Model Kit",
    tagline: "Build 3D structures",
    description:
      "Comprehensive molecular model kit with 50+ atoms and bonds to construct organic compounds and crystal structures for chemistry study.",
    price: 38,
    category: "Tech",
    image: headphones,
    fields: ["chemistry", "biology"],
    styles: ["visual"],
  },
  // Architecture & Design
  {
    id: "sketching-pencil-set",
    name: "Professional Sketching Set",
    tagline: "12-grade pencil range",
    description:
      "Complete series of drawing pencils (2H to 8B) for architectural sketches, 3D renderings, and design ideation work.",
    price: 29,
    category: "Stationery",
    image: pen,
    fields: ["architecture", "design"],
    styles: ["visual"],
  },
  {
    id: "scale-ruler",
    name: "Architect Scale Ruler",
    tagline: "6 different scales",
    description:
      "Triangular scale ruler with 6 architectural scales for accurate drawing proportions in design studio projects and presentations.",
    price: 17,
    category: "Stationery",
    image: pen,
    fields: ["architecture", "design", "engineering"],
    styles: ["organized"],
  },
];

export const FIELDS = [
  { value: "computer-science", label: "Computer Science" },
  { value: "medicine", label: "Medicine" },
  { value: "law", label: "Law" },
  { value: "engineering", label: "Engineering" },
  { value: "business", label: "Business" },
  { value: "design", label: "Design" },
  { value: "psychology", label: "Psychology" },
  { value: "economics", label: "Economics" },
  { value: "biology", label: "Biology" },
  { value: "chemistry", label: "Chemistry" },
  { value: "physics", label: "Physics" },
  { value: "mathematics", label: "Mathematics" },
  { value: "architecture", label: "Architecture" },
  { value: "literature", label: "Literature" },
  { value: "history", label: "History" },
  { value: "political-science", label: "Political Science" },
  { value: "communication", label: "Communication & Media" },
  { value: "education", label: "Education" },
  { value: "nursing", label: "Nursing" },
  { value: "pharmacy", label: "Pharmacy" },
  { value: "data-science", label: "Data Science & AI" },
  { value: "marketing", label: "Marketing" },
  { value: "finance", label: "Finance & Accounting" },
  { value: "languages", label: "Languages & Linguistics" },
] as const;

export const LEVELS = [
  { value: "high-school", label: "High School", desc: "Preparing for university" },
  { value: "undergraduate", label: "Undergraduate", desc: "Bachelor's / Licence" },
  { value: "graduate", label: "Graduate", desc: "Master's level" },
  { value: "phd", label: "PhD", desc: "Doctoral research" },
  { value: "professional", label: "Professional Development", desc: "Continuing education" },
] as const;

export const GOALS = [
  { value: "exams", label: "Exams", desc: "Final-stretch revision" },
  { value: "projects", label: "Projects", desc: "Long-form group work" },
  { value: "revision", label: "Revision", desc: "Steady weekly study" },
  { value: "internship", label: "Internship", desc: "Career-ready toolkit" },
] as const;

export const STYLES = [
  { value: "organized", label: "Organized", desc: "Lists, structure, calendars" },
  { value: "last-minute", label: "Last-minute", desc: "Sprint sessions, max focus" },
  { value: "visual", label: "Visual learner", desc: "Color, diagrams, mind maps" },
  { value: "minimalistic", label: "Minimalistic", desc: "Less stuff, more clarity" },
] as const;

export const BUDGETS = [
  { value: 50, label: "Budget-friendly", desc: "Under $50" },
  { value: 100, label: "Balanced", desc: "$50 - $100" },
  { value: 150, label: "Premium", desc: "$100 - $150" },
  { value: 300, label: "Complete kit", desc: "$150+" },
] as const;

export type Profile = {
  field: string;
  level: string;
  goal: string;
  style: string;
  budget?: number;
};

export function generateBox(p: Profile): { products: Product[]; rationale: Record<string, string> } {
  const scored = PRODUCTS.map((prod) => {
    let s = 0;
    if (prod.fields.includes(p.field)) s += 3;
    if (prod.styles.includes(p.style)) s += 2;
    if (p.goal === "exams" && prod.category === "Focus") s += 1;
    if (p.goal === "projects" && prod.category === "Planning") s += 1;
    if (p.goal === "internship" && prod.category === "Tech") s += 1;
    if (p.goal === "revision" && prod.category === "Stationery") s += 1;
    return { prod, s };
  })
    .sort((a, b) => b.s - a.s);

  // Filter by budget and build box
  const budget = p.budget ?? 150;
  const selected: typeof scored = [];
  let total = 0;

  for (const item of scored) {
    if (total + item.prod.price <= budget) {
      selected.push(item);
      total += item.prod.price;
    }
  }

  // Ensure at least 3 items if budget allows
  const result = selected.slice(0, 8);

  const rationale: Record<string, string> = {};
  result.forEach(({ prod }) => {
    rationale[prod.id] = `Matches your ${p.style} style for ${p.goal}.`;
  });
  return { products: result.map((x) => x.prod), rationale };
}

export type SavedBox = {
  id: string;
  createdAt: string;
  profile: Profile;
  productIds: string[];
};

const KEY = "studybox.saved";

export function listSaved(): SavedBox[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}
export function saveBox(box: SavedBox) {
  const all = listSaved();
  all.unshift(box);
  localStorage.setItem(KEY, JSON.stringify(all.slice(0, 20)));
}
