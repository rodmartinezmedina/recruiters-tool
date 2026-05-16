export interface Candidate {
  id: number;
  name: string;
  title: string;
  company: string;
  location: string;
  country: string;
  city: string;
  experience: string;
  experienceYears: number;
  skills: string[];
  languages: string[];
  workPref: string;
  industry: string;
  matchScore: number;
  matchTags: MatchTag[];
  partialMatch?: string;
  lastActive?: string;
}

export interface MatchTag {
  label: string;
  source: "prompt" | "filter" | "partial";
}

export const candidates: Candidate[] = [
  // BACKEND ENGINEERS
  { id: 1, name: "Miriam Kohler", title: "Senior Backend Engineer", company: "DeliveryHero", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "7 years", experienceYears: 7, skills: ["Python", "Django", "PostgreSQL", "AWS", "Docker"], languages: ["German", "English"], workPref: "Remote (EU)", industry: "Delivery", matchScore: 0, matchTags: [], lastActive: "2 days ago" },
  { id: 2, name: "Tomas Novak", title: "Python Engineer", company: "N26", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "5 years", experienceYears: 5, skills: ["Python", "FastAPI", "Kubernetes", "Redis"], languages: ["Czech", "English", "German"], workPref: "Remote (EU)", industry: "Fintech", matchScore: 0, matchTags: [], lastActive: "1 week ago" },
  { id: 3, name: "Lena Schneider", title: "Backend Engineer", company: "Zalando", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "8 years", experienceYears: 8, skills: ["Python", "Go", "Kubernetes", "AWS"], languages: ["German", "English"], workPref: "Hybrid", industry: "E-commerce", matchScore: 0, matchTags: [] },
  { id: 4, name: "Roberto Sanchez", title: "Senior Backend Engineer", company: "Cabify", location: "Madrid, ES", country: "Spain", city: "Madrid", experience: "7 years", experienceYears: 7, skills: ["Python", "Django", "PostgreSQL", "GCP"], languages: ["Spanish", "English"], workPref: "Remote (EU)", industry: "Mobility", matchScore: 0, matchTags: [], lastActive: "3 days ago" },
  { id: 5, name: "Miguel Gonzalez", title: "Backend Developer", company: "Glovo", location: "Madrid, ES", country: "Spain", city: "Madrid", experience: "5 years", experienceYears: 5, skills: ["Python", "FastAPI", "Kubernetes", "Kafka"], languages: ["Spanish", "English"], workPref: "Remote (EU)", industry: "Delivery", matchScore: 0, matchTags: [] },
  { id: 6, name: "Juana Ramirez", title: "Backend Engineer", company: "Wallapop", location: "Madrid, ES", country: "Spain", city: "Madrid", experience: "4 years", experienceYears: 4, skills: ["Python", "Go", "Docker", "AWS"], languages: ["Spanish", "English"], workPref: "On-site", industry: "Marketplace", matchScore: 0, matchTags: [] },
  { id: 7, name: "Anna Petrov", title: "Senior Python Developer", company: "Spotify", location: "Stockholm, SE", country: "Sweden", city: "Stockholm", experience: "6 years", experienceYears: 6, skills: ["Python", "Flask", "PostgreSQL", "Kafka"], languages: ["Russian", "English", "Swedish"], workPref: "Remote (EU)", industry: "Music / Tech", matchScore: 0, matchTags: [] },
  { id: 8, name: "Lucas Moreau", title: "Backend Lead", company: "Datadog", location: "Paris, FR", country: "France", city: "Paris", experience: "9 years", experienceYears: 9, skills: ["Python", "Go", "Terraform", "AWS"], languages: ["French", "English"], workPref: "Hybrid", industry: "Observability", matchScore: 0, matchTags: [] },
  { id: 9, name: "Nils Andersson", title: "Senior Backend Engineer", company: "Bolt", location: "Tallinn, EE", country: "Estonia", city: "Tallinn", experience: "6 years", experienceYears: 6, skills: ["Go", "Python", "PostgreSQL", "Kafka"], languages: ["Swedish", "English", "Estonian"], workPref: "Remote (EU)", industry: "Mobility", matchScore: 0, matchTags: [] },
  { id: 10, name: "Thomas Muller", title: "Staff Backend Engineer", company: "Wolt", location: "Helsinki, FI", country: "Finland", city: "Helsinki", experience: "10 years", experienceYears: 10, skills: ["Python", "Kotlin", "gRPC", "Kubernetes"], languages: ["Finnish", "English", "German"], workPref: "Remote (EU)", industry: "Delivery", matchScore: 0, matchTags: [] },

  // JAVA BACKEND
  { id: 11, name: "Chiara Bianchi", title: "Senior Java Engineer", company: "Satispay", location: "Milan, IT", country: "Italy", city: "Milan", experience: "7 years", experienceYears: 7, skills: ["Java", "Spring", "PostgreSQL", "Kafka", "Docker"], languages: ["Italian", "English"], workPref: "Hybrid", industry: "Fintech", matchScore: 0, matchTags: [] },
  { id: 12, name: "Erik Lindqvist", title: "Java Developer", company: "Klarna", location: "Stockholm, SE", country: "Sweden", city: "Stockholm", experience: "5 years", experienceYears: 5, skills: ["Java", "Spring", "Kubernetes", "AWS"], languages: ["Swedish", "English"], workPref: "Hybrid", industry: "Fintech", matchScore: 0, matchTags: [] },
  { id: 13, name: "Andrei Popescu", title: "Senior Backend Engineer", company: "UiPath", location: "Bucharest, RO", country: "Romania", city: "Bucharest", experience: "8 years", experienceYears: 8, skills: ["Java", "C#", "Spring", "Azure", "Docker"], languages: ["Romanian", "English"], workPref: "Remote (EU)", industry: "Automation", matchScore: 0, matchTags: [] },
  { id: 14, name: "Viktor Horvat", title: "Java Backend Developer", company: "Infobip", location: "Zagreb, HR", country: "Croatia", city: "Zagreb", experience: "6 years", experienceYears: 6, skills: ["Java", "Spring", "RabbitMQ", "Docker", "PostgreSQL"], languages: ["Croatian", "English"], workPref: "Remote (EU)", industry: "Communications", matchScore: 0, matchTags: [] },

  // FRONTEND ENGINEERS
  { id: 15, name: "Sophie Laurent", title: "Senior Frontend Engineer", company: "Figma", location: "London, UK", country: "United Kingdom", city: "London", experience: "6 years", experienceYears: 6, skills: ["React", "TypeScript", "CSS", "GraphQL", "Next.js"], languages: ["French", "English"], workPref: "Remote (EU)", industry: "Design Tools", matchScore: 0, matchTags: [] },
  { id: 16, name: "Pablo Fernandez", title: "Frontend Developer", company: "Typeform", location: "Barcelona, ES", country: "Spain", city: "Barcelona", experience: "5 years", experienceYears: 5, skills: ["React", "TypeScript", "Tailwind", "Node.js"], languages: ["Spanish", "English", "Catalan"], workPref: "Hybrid", industry: "SaaS", matchScore: 0, matchTags: [] },
  { id: 17, name: "Hanna Fischer", title: "Senior Frontend Engineer", company: "Trade Republic", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "7 years", experienceYears: 7, skills: ["React", "TypeScript", "Redux", "GraphQL"], languages: ["German", "English"], workPref: "Remote (EU)", industry: "Fintech", matchScore: 0, matchTags: [] },
  { id: 18, name: "Clara Dubois", title: "Frontend Engineer", company: "BlaBlaCar", location: "Paris, FR", country: "France", city: "Paris", experience: "4 years", experienceYears: 4, skills: ["Vue", "JavaScript", "CSS", "Tailwind"], languages: ["French", "English"], workPref: "Remote (EU)", industry: "Mobility", matchScore: 0, matchTags: [] },
  { id: 19, name: "Marco Rossi", title: "Frontend Developer", company: "Bending Spoons", location: "Milan, IT", country: "Italy", city: "Milan", experience: "3 years", experienceYears: 3, skills: ["React", "JavaScript", "TypeScript", "CSS"], languages: ["Italian", "English"], workPref: "On-site", industry: "Tech", matchScore: 0, matchTags: [] },
  { id: 20, name: "Lucia Navarro", title: "Senior Frontend Engineer", company: "Factorial", location: "Barcelona, ES", country: "Spain", city: "Barcelona", experience: "6 years", experienceYears: 6, skills: ["React", "TypeScript", "Next.js", "Tailwind", "GraphQL"], languages: ["Spanish", "English", "Catalan"], workPref: "Remote (EU)", industry: "HR Tech", matchScore: 0, matchTags: [] },
  { id: 21, name: "Jan Kowalski", title: "Frontend Engineer", company: "Allegro", location: "Warsaw, PL", country: "Poland", city: "Warsaw", experience: "5 years", experienceYears: 5, skills: ["Angular", "TypeScript", "RxJS", "CSS"], languages: ["Polish", "English"], workPref: "Remote (EU)", industry: "E-commerce", matchScore: 0, matchTags: [] },
  { id: 22, name: "Pieter de Vries", title: "Senior Frontend Developer", company: "Booking.com", location: "Amsterdam, NL", country: "Netherlands", city: "Amsterdam", experience: "8 years", experienceYears: 8, skills: ["React", "TypeScript", "GraphQL", "Node.js", "CSS"], languages: ["Dutch", "English"], workPref: "Hybrid", industry: "Travel", matchScore: 0, matchTags: [] },

  // FULLSTACK
  { id: 23, name: "Sofia Almeida", title: "Senior Fullstack Engineer", company: "Farfetch", location: "Lisbon, PT", country: "Portugal", city: "Lisbon", experience: "7 years", experienceYears: 7, skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"], languages: ["Portuguese", "English", "Spanish"], workPref: "Remote (EU)", industry: "E-commerce", matchScore: 0, matchTags: [] },
  { id: 24, name: "Diogo Ferreira", title: "Fullstack Developer", company: "Talkdesk", location: "Lisbon, PT", country: "Portugal", city: "Lisbon", experience: "5 years", experienceYears: 5, skills: ["React", "Python", "Django", "PostgreSQL"], languages: ["Portuguese", "English"], workPref: "Hybrid", industry: "SaaS", matchScore: 0, matchTags: [] },
  { id: 25, name: "Carmen Diaz", title: "Senior Fullstack Engineer", company: "Seedtag", location: "Madrid, ES", country: "Spain", city: "Madrid", experience: "6 years", experienceYears: 6, skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS"], languages: ["Spanish", "English"], workPref: "Remote (EU)", industry: "AdTech", matchScore: 0, matchTags: [] },
  { id: 26, name: "Amelie Dupont", title: "Fullstack Engineer", company: "Qonto", location: "Paris, FR", country: "France", city: "Paris", experience: "4 years", experienceYears: 4, skills: ["React", "Ruby", "PostgreSQL", "Redis"], languages: ["French", "English"], workPref: "Hybrid", industry: "Fintech", matchScore: 0, matchTags: [] },
  { id: 27, name: "Max Richter", title: "Senior Fullstack Developer", company: "Jimdo", location: "Hamburg, DE", country: "Germany", city: "Hamburg", experience: "7 years", experienceYears: 7, skills: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS"], languages: ["German", "English"], workPref: "Remote (EU)", industry: "Website Builder", matchScore: 0, matchTags: [] },

  // DATA / ML
  { id: 28, name: "Katarina Johansson", title: "Senior Data Engineer", company: "Spotify", location: "Stockholm, SE", country: "Sweden", city: "Stockholm", experience: "7 years", experienceYears: 7, skills: ["Python", "Spark", "SQL", "Kafka", "AWS"], languages: ["Swedish", "English"], workPref: "Remote (EU)", industry: "Music / Tech", matchScore: 0, matchTags: [] },
  { id: 29, name: "Hugo Mendes", title: "Data Scientist", company: "Feedzai", location: "Porto, PT", country: "Portugal", city: "Porto", experience: "5 years", experienceYears: 5, skills: ["Python", "SQL", "TensorFlow", "PostgreSQL"], languages: ["Portuguese", "English"], workPref: "Remote (EU)", industry: "AI / Fraud", matchScore: 0, matchTags: [] },
  { id: 30, name: "Nina Bergmann", title: "ML Engineer", company: "SoundCloud", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "6 years", experienceYears: 6, skills: ["Python", "TensorFlow", "Kubernetes", "SQL"], languages: ["German", "English"], workPref: "Hybrid", industry: "Music / Tech", matchScore: 0, matchTags: [] },
  { id: 31, name: "Stefan Ionescu", title: "Senior Data Engineer", company: "FintechOS", location: "Bucharest, RO", country: "Romania", city: "Bucharest", experience: "8 years", experienceYears: 8, skills: ["Python", "Spark", "Kafka", "AWS", "SQL"], languages: ["Romanian", "English"], workPref: "Remote (EU)", industry: "Fintech", matchScore: 0, matchTags: [] },

  // DEVOPS / SRE
  { id: 32, name: "Felix Schmidt", title: "Senior DevOps Engineer", company: "Contentful", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "6 years", experienceYears: 6, skills: ["Terraform", "AWS", "Kubernetes", "Docker", "Python"], languages: ["German", "English"], workPref: "Remote (EU)", industry: "CMS / SaaS", matchScore: 0, matchTags: [] },
  { id: 33, name: "Marta Krol", title: "DevOps Engineer", company: "Docplanner", location: "Warsaw, PL", country: "Poland", city: "Warsaw", experience: "5 years", experienceYears: 5, skills: ["Kubernetes", "Docker", "Terraform", "GCP", "Python"], languages: ["Polish", "English"], workPref: "Remote (EU)", industry: "HealthTech", matchScore: 0, matchTags: [] },
  { id: 34, name: "Oscar Lindgren", title: "SRE Engineer", company: "Pleo", location: "Copenhagen, DK", country: "Denmark", city: "Copenhagen", experience: "7 years", experienceYears: 7, skills: ["Kubernetes", "Go", "Terraform", "AWS", "Docker"], languages: ["Danish", "English", "Swedish"], workPref: "Remote (EU)", industry: "Fintech", matchScore: 0, matchTags: [] },
  { id: 35, name: "Pierre Lefebvre", title: "Senior SRE", company: "Doctolib", location: "Paris, FR", country: "France", city: "Paris", experience: "8 years", experienceYears: 8, skills: ["Kubernetes", "Terraform", "Docker", "AWS", "Go"], languages: ["French", "English"], workPref: "On-site", industry: "HealthTech", matchScore: 0, matchTags: [] },

  // MOBILE
  { id: 36, name: "Mateo Garcia", title: "Senior iOS Engineer", company: "Glovo", location: "Barcelona, ES", country: "Spain", city: "Barcelona", experience: "6 years", experienceYears: 6, skills: ["Swift", "Kotlin", "React", "GraphQL"], languages: ["Spanish", "English"], workPref: "Hybrid", industry: "Delivery", matchScore: 0, matchTags: [] },
  { id: 37, name: "Ines Costa", title: "Android Developer", company: "OutSystems", location: "Lisbon, PT", country: "Portugal", city: "Lisbon", experience: "4 years", experienceYears: 4, skills: ["Kotlin", "Java", "React", "GraphQL"], languages: ["Portuguese", "English"], workPref: "Hybrid", industry: "Low-code", matchScore: 0, matchTags: [] },
  { id: 38, name: "Lukas Bauer", title: "Mobile Engineer", company: "Personio", location: "Munich, DE", country: "Germany", city: "Munich", experience: "5 years", experienceYears: 5, skills: ["React", "TypeScript", "Swift", "Kotlin"], languages: ["German", "English"], workPref: "Hybrid", industry: "HR Tech", matchScore: 0, matchTags: [] },

  // PRODUCT DESIGNERS
  { id: 39, name: "Elena Vasquez", title: "Senior Product Designer", company: "Cabify", location: "Madrid, ES", country: "Spain", city: "Madrid", experience: "8 years", experienceYears: 8, skills: ["Figma", "CSS", "React", "Tailwind"], languages: ["Spanish", "English", "French"], workPref: "Remote (EU)", industry: "Mobility", matchScore: 0, matchTags: [] },
  { id: 40, name: "Sara Eriksson", title: "Product Designer", company: "Storytel", location: "Stockholm, SE", country: "Sweden", city: "Stockholm", experience: "5 years", experienceYears: 5, skills: ["Figma", "CSS", "Tailwind"], languages: ["Swedish", "English"], workPref: "Remote (EU)", industry: "Media", matchScore: 0, matchTags: [] },
  { id: 41, name: "Marie Laurent", title: "Senior UX Designer", company: "Doctolib", location: "Paris, FR", country: "France", city: "Paris", experience: "7 years", experienceYears: 7, skills: ["Figma", "CSS", "React"], languages: ["French", "English"], workPref: "Hybrid", industry: "HealthTech", matchScore: 0, matchTags: [] },
  { id: 42, name: "Laura Martinez", title: "Product Designer", company: "Typeform", location: "Barcelona, ES", country: "Spain", city: "Barcelona", experience: "4 years", experienceYears: 4, skills: ["Figma", "CSS", "Tailwind"], languages: ["Spanish", "English", "Catalan"], workPref: "Hybrid", industry: "SaaS", matchScore: 0, matchTags: [] },

  // GO ENGINEERS
  { id: 43, name: "Aleksandra Nowak", title: "Senior Go Engineer", company: "Brainly", location: "Krakow, PL", country: "Poland", city: "Krakow", experience: "6 years", experienceYears: 6, skills: ["Go", "PostgreSQL", "Kubernetes", "Docker"], languages: ["Polish", "English"], workPref: "Remote (EU)", industry: "EdTech", matchScore: 0, matchTags: [] },
  { id: 44, name: "David Hoffmann", title: "Go Developer", company: "Ecosia", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "5 years", experienceYears: 5, skills: ["Go", "Terraform", "GCP", "Docker"], languages: ["German", "English"], workPref: "Hybrid", industry: "Green Tech", matchScore: 0, matchTags: [] },
  { id: 45, name: "Carlos Ruiz", title: "Senior Backend Engineer", company: "Flywire", location: "Valencia, ES", country: "Spain", city: "Valencia", experience: "7 years", experienceYears: 7, skills: ["Go", "Python", "Kafka", "PostgreSQL", "AWS"], languages: ["Spanish", "English"], workPref: "Remote (EU)", industry: "Payments", matchScore: 0, matchTags: [] },

  // PRODUCT MANAGERS
  { id: 46, name: "Isabella Romano", title: "Senior Product Manager", company: "Moneyfarm", location: "Milan, IT", country: "Italy", city: "Milan", experience: "8 years", experienceYears: 8, skills: ["SQL", "Figma"], languages: ["Italian", "English"], workPref: "Hybrid", industry: "Fintech", matchScore: 0, matchTags: [] },
  { id: 47, name: "Beatriz Lopes", title: "Product Manager", company: "Revolut", location: "Lisbon, PT", country: "Portugal", city: "Lisbon", experience: "5 years", experienceYears: 5, skills: ["SQL", "Figma"], languages: ["Portuguese", "English"], workPref: "Remote (EU)", industry: "Fintech", matchScore: 0, matchTags: [] },

  // JAVASCRIPT / NODE BACKEND
  { id: 48, name: "Julia Weber", title: "Node.js Engineer", company: "HelloFresh", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "5 years", experienceYears: 5, skills: ["Node.js", "TypeScript", "PostgreSQL", "Docker", "AWS"], languages: ["German", "English"], workPref: "On-site", industry: "Food Tech", matchScore: 0, matchTags: [] },
  { id: 49, name: "Ana Sousa", title: "Senior Node Developer", company: "Unbabel", location: "Lisbon, PT", country: "Portugal", city: "Lisbon", experience: "6 years", experienceYears: 6, skills: ["Node.js", "TypeScript", "MongoDB", "Docker", "AWS"], languages: ["Portuguese", "English", "Spanish"], workPref: "Remote (EU)", industry: "AI / Translation", matchScore: 0, matchTags: [] },
  { id: 50, name: "Jakub Wisniewski", title: "Backend Engineer", company: "Allegro", location: "Warsaw, PL", country: "Poland", city: "Warsaw", experience: "4 years", experienceYears: 4, skills: ["Node.js", "TypeScript", "PostgreSQL", "Redis"], languages: ["Polish", "English"], workPref: "On-site", industry: "E-commerce", matchScore: 0, matchTags: [] },

  // RUST ENGINEERS
  { id: 51, name: "Emil Johansson", title: "Rust Developer", company: "Tink", location: "Stockholm, SE", country: "Sweden", city: "Stockholm", experience: "4 years", experienceYears: 4, skills: ["Rust", "Go", "PostgreSQL", "Docker"], languages: ["Swedish", "English"], workPref: "Remote (EU)", industry: "Open Banking", matchScore: 0, matchTags: [] },

  // MORE REACT / FRONTEND in different cities
  { id: 52, name: "Lisa Braun", title: "React Developer", company: "AUTO1", location: "Berlin, DE", country: "Germany", city: "Berlin", experience: "4 years", experienceYears: 4, skills: ["React", "JavaScript", "TypeScript", "CSS", "Redux"], languages: ["German", "English"], workPref: "Hybrid", industry: "Automotive", matchScore: 0, matchTags: [] },
  { id: 53, name: "Eva Mulder", title: "Senior React Engineer", company: "Adyen", location: "Amsterdam, NL", country: "Netherlands", city: "Amsterdam", experience: "7 years", experienceYears: 7, skills: ["React", "TypeScript", "Next.js", "GraphQL", "CSS"], languages: ["Dutch", "English", "German"], workPref: "Hybrid", industry: "Payments", matchScore: 0, matchTags: [] },
  { id: 54, name: "Patrick O'Brien", title: "Frontend Engineer", company: "Stripe", location: "Dublin, IE", country: "Ireland", city: "Dublin", experience: "5 years", experienceYears: 5, skills: ["React", "TypeScript", "CSS", "GraphQL"], languages: ["English", "Irish"], workPref: "Hybrid", industry: "Payments", matchScore: 0, matchTags: [] },
  { id: 55, name: "Martin Novotny", title: "Senior Frontend Developer", company: "JetBrains", location: "Prague, CZ", country: "Czech Republic", city: "Prague", experience: "8 years", experienceYears: 8, skills: ["React", "TypeScript", "Kotlin", "CSS"], languages: ["Czech", "English"], workPref: "Remote (EU)", industry: "Dev Tools", matchScore: 0, matchTags: [] },

  // MORE PYTHON in Amsterdam/London
  { id: 56, name: "Daan Bakker", title: "Senior Python Engineer", company: "Booking.com", location: "Amsterdam, NL", country: "Netherlands", city: "Amsterdam", experience: "7 years", experienceYears: 7, skills: ["Python", "Django", "PostgreSQL", "Redis", "AWS"], languages: ["Dutch", "English"], workPref: "Hybrid", industry: "Travel", matchScore: 0, matchTags: [] },
  { id: 57, name: "James Chen", title: "Python Developer", company: "Monzo", location: "London, UK", country: "United Kingdom", city: "London", experience: "5 years", experienceYears: 5, skills: ["Python", "Go", "PostgreSQL", "Kubernetes"], languages: ["English", "Mandarin"], workPref: "Hybrid", industry: "Fintech", matchScore: 0, matchTags: [] },
  { id: 58, name: "Liam Murphy", title: "Senior Backend Engineer", company: "Intercom", location: "Dublin, IE", country: "Ireland", city: "Dublin", experience: "8 years", experienceYears: 8, skills: ["Python", "Ruby", "PostgreSQL", "AWS", "Redis"], languages: ["English"], workPref: "Hybrid", industry: "SaaS", matchScore: 0, matchTags: [] },

  // KUBERNETES / CLOUD specialists
  { id: 59, name: "Markus Huber", title: "Cloud Engineer", company: "Red Bull", location: "Vienna, AT", country: "Austria", city: "Vienna", experience: "6 years", experienceYears: 6, skills: ["Kubernetes", "Terraform", "AWS", "Docker", "Go"], languages: ["German", "English"], workPref: "Hybrid", industry: "Consumer", matchScore: 0, matchTags: [] },
  { id: 60, name: "Freja Nielsen", title: "Senior DevOps Engineer", company: "Maersk", location: "Copenhagen, DK", country: "Denmark", city: "Copenhagen", experience: "7 years", experienceYears: 7, skills: ["Kubernetes", "Docker", "Terraform", "Azure", "Python"], languages: ["Danish", "English"], workPref: "Hybrid", industry: "Logistics", matchScore: 0, matchTags: [] },

  // VUE / ANGULAR specialists
  { id: 61, name: "Adrian Blanc", title: "Vue.js Developer", company: "Doctolib", location: "Paris, FR", country: "France", city: "Paris", experience: "4 years", experienceYears: 4, skills: ["Vue", "JavaScript", "TypeScript", "CSS", "Tailwind"], languages: ["French", "English"], workPref: "Remote (EU)", industry: "HealthTech", matchScore: 0, matchTags: [] },
  { id: 62, name: "Teresa Silva", title: "Angular Developer", company: "Talkdesk", location: "Porto, PT", country: "Portugal", city: "Porto", experience: "5 years", experienceYears: 5, skills: ["Angular", "TypeScript", "RxJS", "CSS", "Node.js"], languages: ["Portuguese", "English"], workPref: "Remote (EU)", industry: "SaaS", matchScore: 0, matchTags: [] },

  // LONDON ENGINEERS
  { id: 63, name: "Sarah Thompson", title: "Senior Fullstack Engineer", company: "Deliveroo", location: "London, UK", country: "United Kingdom", city: "London", experience: "7 years", experienceYears: 7, skills: ["React", "Node.js", "TypeScript", "PostgreSQL", "AWS"], languages: ["English"], workPref: "Hybrid", industry: "Delivery", matchScore: 0, matchTags: [] },
  { id: 64, name: "Raj Patel", title: "Backend Engineer", company: "Revolut", location: "London, UK", country: "United Kingdom", city: "London", experience: "4 years", experienceYears: 4, skills: ["Java", "Kotlin", "Spring", "PostgreSQL", "Kubernetes"], languages: ["English", "Hindi"], workPref: "On-site", industry: "Fintech", matchScore: 0, matchTags: [] },

  // AMSTERDAM ENGINEERS
  { id: 65, name: "Sanne van der Berg", title: "Senior Backend Engineer", company: "Messagebird", location: "Amsterdam, NL", country: "Netherlands", city: "Amsterdam", experience: "6 years", experienceYears: 6, skills: ["Go", "Python", "PostgreSQL", "Kafka", "Kubernetes"], languages: ["Dutch", "English"], workPref: "Remote (EU)", industry: "Communications", matchScore: 0, matchTags: [] },
  { id: 66, name: "Tom Jansen", title: "Fullstack Engineer", company: "Miro", location: "Amsterdam, NL", country: "Netherlands", city: "Amsterdam", experience: "5 years", experienceYears: 5, skills: ["React", "TypeScript", "Node.js", "PostgreSQL"], languages: ["Dutch", "English", "German"], workPref: "Hybrid", industry: "Collaboration", matchScore: 0, matchTags: [] },

  // ZURICH / SWISS
  { id: 67, name: "Andreas Keller", title: "Senior Backend Engineer", company: "Google", location: "Zurich, CH", country: "Switzerland", city: "Zurich", experience: "9 years", experienceYears: 9, skills: ["Go", "Java", "Kubernetes", "GCP"], languages: ["German", "English", "French"], workPref: "On-site", industry: "Tech", matchScore: 0, matchTags: [] },

  // TYPESCRIPT / NEXT.JS specialists
  { id: 68, name: "Alicia Moreno", title: "Senior TypeScript Engineer", company: "Vercel", location: "Madrid, ES", country: "Spain", city: "Madrid", experience: "6 years", experienceYears: 6, skills: ["TypeScript", "React", "Next.js", "Node.js", "Tailwind"], languages: ["Spanish", "English"], workPref: "Remote (EU)", industry: "Dev Tools", matchScore: 0, matchTags: [] },
  { id: 69, name: "Henrik Berg", title: "Next.js Developer", company: "Sanity", location: "Copenhagen, DK", country: "Denmark", city: "Copenhagen", experience: "4 years", experienceYears: 4, skills: ["TypeScript", "React", "Next.js", "Tailwind", "GraphQL"], languages: ["Danish", "Norwegian", "English"], workPref: "Remote (EU)", industry: "CMS", matchScore: 0, matchTags: [] },

  // SCALA / ELIXIR niche
  { id: 70, name: "Michal Cerny", title: "Scala Engineer", company: "JetBrains", location: "Prague, CZ", country: "Czech Republic", city: "Prague", experience: "7 years", experienceYears: 7, skills: ["Scala", "Java", "Kafka", "PostgreSQL", "Docker"], languages: ["Czech", "English"], workPref: "Remote (EU)", industry: "Dev Tools", matchScore: 0, matchTags: [] },
];
