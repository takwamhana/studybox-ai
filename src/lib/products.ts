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

export type Profile = {
  field: string;
  level: string;
  goal: string;
  style: string;
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
    .sort((a, b) => b.s - a.s)
    .slice(0, 5);

  const rationale: Record<string, string> = {};
  scored.forEach(({ prod }) => {
    rationale[prod.id] = `Matches your ${p.style} style for ${p.goal}.`;
  });
  return { products: scored.map((x) => x.prod), rationale };
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
