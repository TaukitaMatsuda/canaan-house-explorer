export interface Room {
  id: string;
  name: string;
  nameRu: string;
  description: string;
  descriptionRu: string;
  floor: number;
  position: { x: number; y: number };
  connections: string[];
  objects: string[];
  characters: string[];
  events: string[];
  image: string;
  isLocked?: boolean;
  atmosphere: 'bright' | 'dim' | 'dark' | 'ominous';
}

export interface Character {
  id: string;
  name: string;
  nameRu: string;
  house: string;
  houseRu: string;
  houseNumber: number;
  role: string;
  roleRu: string;
  description: string;
  descriptionRu: string;
  biography: string;
  biographyRu: string;
  image: string;
  rooms: string[];
  events: string[];
  isAlive: boolean;
  isNecromancer: boolean;
  isCavalier: boolean;
}

export interface Event {
  id: string;
  day: number;
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  location: string;
  characters: string[];
  chapter?: string;
  isMajor: boolean;
}

export interface Document {
  id: string;
  title: string;
  titleRu: string;
  author: string;
  authorRu: string;
  date: string;
  type: 'journal' | 'letter' | 'record' | 'manual' | 'poem' | 'contract';
  content: string[];
  contentRu: string[];
  room: string;
  relatedCharacters: string[];
  relatedEvents: string[];
}

export interface House {
  id: string;
  number: number;
  name: string;
  nameRu: string;
  epithet: string;
  epithetRu: string;
  description: string;
  descriptionRu: string;
  color: string;
  symbol: string;
  members: string[];
}

export interface CodexEntry {
  id: string;
  category: string;
  categoryRu: string;
  title: string;
  titleRu: string;
  content: string;
  contentRu: string;
  relatedEntries: string[];
}

export interface InteractiveObject {
  id: string;
  name: string;
  nameRu: string;
  type: 'book' | 'journal' | 'key' | 'sword' | 'skeleton' | 'map' | 'potion' | 'artifact';
  description: string;
  descriptionRu: string;
  room: string;
  isCollectible: boolean;
  documentId?: string;
}

export type TimeOfDay = 'day' | 'night';
export type Language = 'en' | 'ru';
