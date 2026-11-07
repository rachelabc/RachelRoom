import { PopMartFigurine, ProjectItem, TravelDestination, GuestbookEntry, PaperStar } from '../types/game';

export const PORTRAIT_IMAGE = '/src/assets/images/hero_portrait_pixel_1793923690503.jpg';
export const POPMART_SHELF_IMAGE = '/src/assets/images/popmart_figurines_shelf_1793923691631.jpg';
export const BERKELEY_POLAROID_IMAGE = '/src/assets/images/berkeley_campus_polaroid_1793923692084.jpg';
export const TUXEDO_CAT_IMAGE = '/src/assets/images/tuxedo_cat_portrait_1793923692160.jpg';

export const ABOUT_ME = {
  name: "Rachel Li",
  title: "UC Berkeley CS & Design · Creative Frontend Engineer",
  pronouns: "she/her",
  tagline: "Building digital sanctuaries where playful aesthetics meet crisp engineering.",
  school: "University of California, Berkeley",
  major: "Computer Science & Cognitive Science / New Media",
  graduation: "Class of 2026 · Go Bears! 🐻",
  bio: "Hi there! I'm Rachel. Welcome to my cozy little slice of the web! I craft thoughtful, tactile web apps, interactive games, and delightful user interfaces. When I'm not writing TypeScript or training neural nets, I'm usually unboxing POPMART blind boxes, hunting down the best roasted oolong boba on Telegraph, or petting Soobin my tuxedo cat.",
  quickFacts: [
    { label: "Current Location", value: "Berkeley, CA (Southside)" },
    { label: "Favorite Beverage", value: "Roasted Oolong Milk Tea (30% sweet, boba)" },
    { label: "Cat's Name", value: "Soobin (Tuxedo cat · 6 yrs old · Named after TXT's Soobin!)" },
    { label: "Favorite Hobby", value: "Collecting POP MART Art Toys & Figurines" },
    { label: "Top Figurine #1", value: "Disney x Dimoo: Goofy Character" },
    { label: "Top Figurine #2", value: "Secret Brown Labubu (Gift from Best Friend)" },
  ]
};

export const POPMART_COLLECTION: PopMartFigurine[] = [
  {
    id: "dimoo-goofy",
    name: "Disney x Dimoo: Goofy",
    series: "Disney Classics Collection",
    rarity: "Top Favorite",
    color: "#84cc16",
    description: "Rachel's #1 all-time favorite pull! Adorable Dimoo sporting Goofy's green floppy hat, big friendly toothy grin, and oversized cozy sweater.",
    acquired: true,
    tag: "Top Favorite #1"
  },
  {
    id: "labubu-secret-brown",
    name: "Secret Brown Labubu",
    series: "The Monsters Secret Edition",
    rarity: "Super Secret",
    color: "#78350f",
    description: "Gifted as an unforgettable birthday surprise by Rachel's best friend! Rich mocha brown fur, signature cheeky smile, and rare golden badge.",
    acquired: true,
    tag: "Best Friend Gift #2"
  },
  {
    id: "dimoo-cloud",
    name: "Dimoo: Cloud Sprite",
    series: "Retro Boy Series",
    rarity: "Rare",
    color: "#bfdbfe",
    description: "Dreamy boy with a fluffy cumulus cloud perched like a sleep bonnet, forever gazing toward the stars.",
    acquired: true,
    tag: "POPMART Classic"
  },
  {
    id: "labubu-seat",
    name: "Labubu: Have a Seat",
    series: "The Monsters",
    rarity: "Common",
    color: "#bbf7d0",
    description: "Mischievous forest creature with signature jagged teeth and fuzzy ears. Sits right next to the keyboard.",
    acquired: true,
    tag: "Desk Companion"
  },
  {
    id: "sp-warmth",
    name: "Skullpanda: The Warmth",
    series: "The Warmth Series",
    rarity: "Rare",
    color: "#fbcfe8",
    description: "Wrapped in a cozy porcelain pink knit cowl with starry eyes. Symbolizes finding peace amidst city noise.",
    acquired: true,
    tag: "Aesthetic Idol"
  },
  {
    id: "sweet-secret",
    name: "Molly: Space Astronaut 100%",
    series: "Space Series",
    rarity: "Super Secret",
    color: "#f472b6",
    description: "The ultra-rare golden visor Molly with starry chrome backpack! Try unboxing it in the blind box simulator!",
    acquired: false,
    tag: "Secret Chaser"
  }
];

export const PROJECTS: ProjectItem[] = [
  {
    id: "pixelbloom",
    title: "PixelBloom: Cozy Garden Simulator",
    category: "Game Dev & Creative Web",
    badge: "Featured Project",
    description: "A zen browser gardening companion with real-time weather integration. Plants grow according to the actual weather in your city, with lo-fi soundscapes and hybrid seed crossbreeding mechanics.",
    highlights: [
      "Custom procedural canvas rendering with 16x16 pixel sprites",
      "Real-time OpenWeather API syncing rainfall and sunshine to soil moisture",
      "Synthesized ambient soundscapes via Web Audio API"
    ],
    tech: ["TypeScript", "React", "HTML5 Canvas", "Web Audio API", "Tailwind CSS"],
    githubUrl: "https://github.com",
    liveUrl: "#",
    iconName: "Sprout"
  },
  {
    id: "beartracks",
    title: "BearTracks: Berkeley Study Spot Navigator",
    category: "Student Utility & Full-Stack",
    badge: "Campus Favorite · 4.2k Active Users",
    description: "Crowdsourced quiet study finder for UC Berkeley students. Shows live seat occupancy across Doe, Moffitt, Kresge, and Main Stacks, noise levels, power outlet availability, and campus boba proximity.",
    highlights: [
      "Live crowd density heuristics and historical quiet-hour forecasts",
      "Interactive SVG interactive campus map with custom Berkeley pins",
      "Sub-50ms search latency across 42 study zones and cafes"
    ],
    tech: ["Next.js", "TypeScript", "PostgreSQL", "Tailwind CSS", "Prisma"],
    githubUrl: "https://github.com",
    liveUrl: "#",
    iconName: "GraduationCap"
  },
  {
    id: "popmart-collector",
    title: "BoxChaser: POPMART Blind Box Probability Tracker",
    category: "Hobby & Visual Index",
    badge: "Community Tool",
    description: "Interactive visual collection manager for art toy collectors. Calculates true probability odds of pulling secret figures, tracks collection market value, and lets collectors share swap wishlists.",
    highlights: [
      "Probability simulator for case assortment odds (1/72, 1/144)",
      "High-fidelity card animations with foil-pack tearing micro-interactions",
      "Offline-first PWA architecture with IndexedDB caching"
    ],
    tech: ["React", "TypeScript", "Framer Motion", "IndexedDB", "Tailwind CSS"],
    githubUrl: "https://github.com",
    liveUrl: "#",
    iconName: "Sparkles"
  },
  {
    id: "stardew-companion",
    title: "ValleyPlanner: Stardew Season Maximizer",
    category: "Gaming Tool",
    badge: "Open Source",
    description: "Interactive crop calendar and villager friendship guide designed to look like an authentic Pierre's General Store ledger. Calculates optimal keg schedules and seasonal greenhouse setups.",
    highlights: [
      "Dynamic ROI crop calculators based on farming profession perks",
      "Authentic SNES-era pixel aesthetic with custom handcrafted sprites",
      "Exportable printable seasonal cheat sheets"
    ],
    tech: ["TypeScript", "Canvas API", "CSS Grid", "Vite"],
    githubUrl: "https://github.com",
    liveUrl: "#",
    iconName: "Apple"
  }
];

export const BERKELEY_MEMORIES = [
  {
    title: "The Campanile at Golden Hour",
    date: "Fall 2024",
    location: "Memorial Glade",
    caption: "Sitting on the grass with a matcha latte after a grueling CS70 midterm, listening to the 6 PM carillon chimes ring over the Bay.",
    tag: "Campus Magic"
  },
  {
    title: "Moffitt 4th Floor All-Nighters",
    date: "Spring 2025",
    location: "Moffitt Library",
    caption: "Whiteboarding recursive tree algorithms with the study squad at 2 AM, surviving entirely on boba and Trader Joe's sour jelly beans.",
    tag: "Grind & Glory"
  },
  {
    title: "CalHacks 11.0 at SF Metreon",
    date: "October 2024",
    location: "San Francisco",
    caption: "Built an accessibility tool for non-verbal children using computer vision in 36 hours. Won Best Social Good Hack!",
    tag: "Hackathon Win"
  },
  {
    title: "Telegraph Ave Boba Expeditions",
    date: "Every Tuesday",
    location: "Asha Tea House / Yi Fang",
    caption: "Roasted Oolong Milk Tea, 30% sweetness, oat milk, boba. The official fuel of debugging segmentation faults.",
    tag: "Rituals"
  }
];

export const TRAVEL_JOURNAL: TravelDestination[] = [
  {
    city: "Kyoto & Tokyo",
    country: "Japan",
    year: "Summer 2024",
    favoriteSpot: "Shimokitazawa vintage shops & Arashiyama bamboo grove at 6 AM",
    vibe: "Serene temples, quiet alleyway cafes, and wall-to-wall Gachapon machines.",
    notes: "Spent three hours admiring handcrafted ceramic tea bowls in Kiyomizu-dera. Brought home two pottery pieces and four limited POPMART Labubus!",
    tags: ["Ceramics", "Matcha", "Art Toys", "Stationery"]
  },
  {
    city: "Seoul",
    country: "South Korea",
    year: "Spring 2024",
    favoriteSpot: "Yeonnam-dong canal walk & stationary bookshops",
    vibe: "Cozy minimalist cafes, cherry blossoms falling like confetti, midnight street food.",
    notes: "Worked on my laptop from a quiet rooftop cafe overlooking Hongdae while drinking iced Einspänner coffee.",
    tags: ["Cafes", "Design", "Foodie", "Night Walks"]
  },
  {
    city: "Yosemite National Park",
    country: "USA (California)",
    year: "Autumn 2024",
    favoriteSpot: "Mist Trail & Glacier Point starry night",
    vibe: "Crisp pine air, massive granite cliffs, complete digital detox.",
    notes: "Camped under the stars without cellular reception. Drew watercolor sketches of Half Dome in my travel journal.",
    tags: ["Nature", "Camping", "Watercolor", "Detox"]
  },
  {
    city: "London & Edinburgh",
    country: "United Kingdom",
    year: "Winter 2023",
    favoriteSpot: "Daunt Books Marylebone & Edinburgh Old Town cobblestones",
    vibe: "Rainy afternoons with English breakfast tea, vintage bookstores, and castle skylines.",
    notes: "Spent entire afternoons reading fiction inside cozy corner cafes while raindrops tapped against leaded glass.",
    tags: ["Books", "Rainy Days", "Architecture", "History"]
  }
];

export const INITIAL_GUESTBOOK_NOTES: GuestbookEntry[] = [
  {
    id: "note-1",
    author: "Sophie (Cal CS '25)",
    message: "Rachel! This pixel room is literally you down to the Cal sweater and matcha mug!! Love Mochi so much 🐾",
    timestamp: "2 hours ago",
    sticker: "cat"
  },
  {
    id: "note-2",
    author: "Alex K.",
    message: "The POPMART blind box unboxing minigame on your shelf is genius!! Got the secret Molly on my second try haha!",
    timestamp: "Yesterday",
    sticker: "sparkle"
  },
  {
    id: "note-3",
    author: "Devin (Hacker Friend)",
    message: "Bookmarked BearTracks, seriously the best study spot finder on campus. Go Bears!! 🐻",
    timestamp: "3 days ago",
    sticker: "star"
  },
  {
    id: "note-4",
    author: "Claire",
    message: "Sending hugs to Mochi from a fellow tuxedo cat parent! Your pixel art animations are so soothing.",
    timestamp: "Last week",
    sticker: "heart"
  }
];

export const INITIAL_PAPER_STARS: PaperStar[] = [
  {
    id: "star-1",
    author: "Rachel Li",
    message: "May everyone who visits this little world find warmth, peace, and creative inspiration! ✨",
    color: "#fde047", // Yellow star
    timestamp: "Original wish"
  },
  {
    id: "star-2",
    author: "Cal Study Buddy",
    message: "Good luck on finals and software engineering projects! Go Bears! 🐻",
    color: "#a78bfa", // Lavender star
    timestamp: "Yesterday"
  },
  {
    id: "star-3",
    author: "Mochi 🐾",
    message: "Purrrrr~ (more crunchy salmon treats please!)",
    color: "#f472b6", // Pink star
    timestamp: "2 days ago"
  },
  {
    id: "star-4",
    author: "Art Toy Fan",
    message: "Loved your POPMART shelf and the origami star jar! So creative!",
    color: "#67e8f9", // Mint star
    timestamp: "3 days ago"
  }
];
