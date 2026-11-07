export type ZoneId = 
  | 'bed' 
  | 'door' 
  | 'cat' 
  | 'bookshelf' 
  | 'desk' 
  | 'bulletin'
  | 'starjar'; // bedside table paper star jar

export type TimeOfDay = 'sunny' | 'rainy' | 'night';

export type Direction = 'down' | 'up' | 'left' | 'right';

export interface InteractiveZone {
  id: ZoneId;
  name: string;
  subtext: string;
  x: number;
  y: number;
  radius: number;
  label: string;
}

export interface PaperStar {
  id: string;
  message: string;
  author: string;
  color: string;
  timestamp: string;
}

export interface PopMartFigurine {
  id: string;
  name: string;
  series: string;
  rarity: 'Common' | 'Rare' | 'Super Secret' | 'Top Favorite';
  color: string;
  description: string;
  acquired: boolean;
  tag: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  highlights: string[];
  tech: string[];
  githubUrl?: string;
  liveUrl?: string;
  iconName: string;
}

export interface TravelDestination {
  city: string;
  country: string;
  year: string;
  favoriteSpot: string;
  vibe: string;
  notes: string;
  tags: string[];
}

export interface GuestbookEntry {
  id: string;
  author: string;
  message: string;
  timestamp: string;
  sticker: 'star' | 'heart' | 'cat' | 'matcha' | 'sparkle';
}
