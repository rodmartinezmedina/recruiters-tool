import { Filter } from "@/app/page";

const TITLE_MAP: Record<string, string> = {
  backend: "Backend Engineer",
  "back-end": "Backend Engineer",
  "back end": "Backend Engineer",
  frontend: "Frontend Engineer",
  "front-end": "Frontend Engineer",
  "front end": "Frontend Engineer",
  fullstack: "Fullstack Engineer",
  "full-stack": "Fullstack Engineer",
  "full stack": "Fullstack Engineer",
  mobile: "Mobile Engineer",
  ios: "Mobile Engineer",
  android: "Mobile Engineer",
  data: "Data Engineer",
  "data scientist": "Data Scientist",
  "data engineer": "Data Engineer",
  "machine learning": "ML Engineer",
  ml: "ML Engineer",
  devops: "DevOps Engineer",
  sre: "SRE Engineer",
  designer: "Product Designer",
  "product designer": "Product Designer",
  "ux designer": "UX Designer",
  "ui designer": "UI Designer",
  "product manager": "Product Manager",
  pm: "Product Manager",
};

const SKILL_KEYWORDS = [
  "python",
  "javascript",
  "typescript",
  "java",
  "go",
  "golang",
  "rust",
  "ruby",
  "php",
  "c#",
  "csharp",
  "c++",
  "swift",
  "kotlin",
  "scala",
  "react",
  "vue",
  "angular",
  "svelte",
  "next.js",
  "nextjs",
  "node",
  "node.js",
  "nodejs",
  "django",
  "flask",
  "fastapi",
  "spring",
  "rails",
  "express",
  "graphql",
  "sql",
  "postgresql",
  "postgres",
  "mongodb",
  "redis",
  "elasticsearch",
  "kafka",
  "rabbitmq",
  "docker",
  "kubernetes",
  "k8s",
  "terraform",
  "aws",
  "gcp",
  "azure",
  "figma",
  "css",
  "tailwind",
];

const SKILL_NORMALIZE: Record<string, string> = {
  golang: "Go",
  csharp: "C#",
  "c#": "C#",
  "c++": "C++",
  nodejs: "Node.js",
  "node.js": "Node.js",
  node: "Node.js",
  nextjs: "Next.js",
  "next.js": "Next.js",
  postgres: "PostgreSQL",
  postgresql: "PostgreSQL",
  k8s: "Kubernetes",
  rails: "Ruby on Rails",
};

const LOCATION_MAP: Record<string, string> = {
  berlin: "Berlin",
  munich: "Munich",
  hamburg: "Hamburg",
  madrid: "Madrid",
  barcelona: "Barcelona",
  valencia: "Valencia",
  amsterdam: "Amsterdam",
  rotterdam: "Rotterdam",
  paris: "Paris",
  lyon: "Lyon",
  lisbon: "Lisbon",
  porto: "Porto",
  london: "London",
  manchester: "Manchester",
  stockholm: "Stockholm",
  milan: "Milan",
  rome: "Rome",
  warsaw: "Warsaw",
  krakow: "Krakow",
  copenhagen: "Copenhagen",
  dublin: "Dublin",
  zurich: "Zurich",
  prague: "Prague",
  vienna: "Vienna",
  bucharest: "Bucharest",
  tallinn: "Tallinn",
  helsinki: "Helsinki",
  zagreb: "Zagreb",
  germany: "Germany",
  spain: "Spain",
  netherlands: "Netherlands",
  france: "France",
  portugal: "Portugal",
  uk: "United Kingdom",
  "united kingdom": "United Kingdom",
  sweden: "Sweden",
  italy: "Italy",
  poland: "Poland",
  denmark: "Denmark",
  ireland: "Ireland",
  switzerland: "Switzerland",
  eu: "EU",
};

const WORK_PREF_MAP: Record<string, string> = {
  remote: "Remote (EU)",
  "eu-remote": "Remote (EU)",
  "eu remote": "Remote (EU)",
  "fully remote": "Remote (EU)",
  hybrid: "Hybrid",
  "on-site": "On-site",
  onsite: "On-site",
  "on site": "On-site",
  office: "On-site",
  "in-office": "On-site",
};

export function extractFilters(prompt: string): Filter[] {
  const lower = prompt.toLowerCase();
  const filters: Filter[] = [];
  const foundTypes = new Set<string>();

  // Title extraction (check longer phrases first)
  const titleEntries = Object.entries(TITLE_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [keyword, title] of titleEntries) {
    if (lower.includes(keyword) && !foundTypes.has("Title")) {
      filters.push({ type: "Title", value: title, source: "prompt" });
      foundTypes.add("Title");
      break;
    }
  }

  // Seniority as title prefix or experience hint
  let seniorityHint = 0;
  if (lower.includes("senior") || lower.includes("sr ") || lower.includes("sr.")) {
    seniorityHint = 5;
    if (filters.length > 0 && filters[0].type === "Title") {
      filters[0].value = "Senior " + filters[0].value;
    }
  }
  if (lower.includes("junior") || lower.includes("jr ") || lower.includes("jr.")) {
    seniorityHint = 2;
    if (filters.length > 0 && filters[0].type === "Title") {
      filters[0].value = "Junior " + filters[0].value;
    }
  }
  if (lower.includes("lead") || lower.includes("staff") || lower.includes("principal")) {
    seniorityHint = 8;
  }

  // Skills extraction
  const foundSkills: string[] = [];
  for (const skill of SKILL_KEYWORDS) {
    const regex = new RegExp(`\\b${skill.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\b`, "i");
    if (regex.test(lower)) {
      const normalized =
        SKILL_NORMALIZE[skill] || skill.charAt(0).toUpperCase() + skill.slice(1);
      if (!foundSkills.includes(normalized)) {
        foundSkills.push(normalized);
      }
    }
  }
  for (const skill of foundSkills.slice(0, 3)) {
    filters.push({ type: "Skill", value: skill, source: "prompt" });
  }

  // Location extraction (check longer phrases first)
  const locationEntries = Object.entries(LOCATION_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [keyword, location] of locationEntries) {
    if (lower.includes(keyword) && !foundTypes.has("Location")) {
      filters.push({ type: "Location", value: location, source: "prompt" });
      foundTypes.add("Location");
      break;
    }
  }

  // Experience extraction
  const expMatch = lower.match(/(\d+)\+?\s*(?:years?|yrs?|y)\b/);
  if (expMatch && !foundTypes.has("Experience")) {
    filters.push({
      type: "Experience",
      value: `+${expMatch[1]} years`,
      source: "prompt",
    });
    foundTypes.add("Experience");
  } else if (seniorityHint > 0 && !foundTypes.has("Experience")) {
    filters.push({
      type: "Experience",
      value: `+${seniorityHint} years`,
      source: "prompt",
    });
    foundTypes.add("Experience");
  }

  // Work pref extraction (check longer phrases first)
  const workEntries = Object.entries(WORK_PREF_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [keyword, pref] of workEntries) {
    if (lower.includes(keyword) && !foundTypes.has("Work pref")) {
      filters.push({ type: "Work pref", value: pref, source: "prompt" });
      foundTypes.add("Work pref");
      break;
    }
  }

  return filters;
}

export function extractLocationsFromMessage(
  message: string,
  currentFilters: Filter[]
): {
  newLocations: string[];
  existingLocations: string[];
  isAdditive: boolean;
  isReplacement: boolean;
} | null {
  const lower = message.toLowerCase();
  const existingLocations = currentFilters
    .filter((f) => f.type === "Location")
    .map((f) => f.value);

  if (existingLocations.length === 0) return null;

  const isAdditive = /\b(also|include|add|as well|too|both|additionally)\b/.test(lower);
  const isReplacement = /\b(should be|change to|switch to|make it|update to|set to|only|instead|replace)\b/.test(lower);

  const newLocations: string[] = [];
  const locationEntries = Object.entries(LOCATION_MAP).sort(
    (a, b) => b[0].length - a[0].length
  );
  for (const [keyword, location] of locationEntries) {
    if (
      lower.includes(keyword) &&
      !existingLocations.includes(location) &&
      !newLocations.includes(location)
    ) {
      newLocations.push(location);
    }
  }

  if (newLocations.length === 0) return null;

  return { newLocations, existingLocations, isAdditive, isReplacement };
}
