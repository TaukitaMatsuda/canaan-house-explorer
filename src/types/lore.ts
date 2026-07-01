// src/types/lore.ts

// Базовые сущности
export interface House {
  id: string;
  number: number;
  name: string; // e.g., "Ninth House"
  title: string; // e.g., "Keepers of the Locked Tomb"
  colors: string[]; // ["black", "white", "gray"]
  symbol: string;
  necromantic_specialty: string;
  canon_status: 'canon' | 'probable' | 'reconstruction';
}

export interface Character {
  id: string;
  house_id: string;
  name: string; // e.g., "Harrowhark Nonagesimus"
  role: 'necromancer' | 'cavalier' | 'lyctor' | 'priest' | 'construct';
  status: 'alive' | 'dead' | 'beguiling_corpse' | 'lyctor';
  is_beguiling: boolean;
  bio: string;
  portrait_url?: string;
}

export interface Location {
  id: string;
  name: string; // e.g., "Canaan House"
  type: 'planet' | 'building' | 'complex' | 'wing';
  description: string;
}

export interface Room {
  id: string;
  location_id: string;
  name: string; // e.g., "Fencing Hall"
  floor_level: number;
  room_type: 'public' | 'private' | 'lab' | 'trial' | 'secret';
  access_level: 'open' | 'locked' | 'restricted';
  required_key_id?: string;
  atmosphere: string;
}

// Интерфейс самого сервиса (Репозитория)
export interface ILoreService {
  getHouses(): Promise<House[]>;
  getCharactersByHouse(houseId: string): Promise<Character[]>;
  getRoomsByLocation(locationId: string): Promise<Room[]>;
  // В будущем добавим графовые запросы
  getCharacterRelationships(characterId: string): Promise<Relationship[]>;
}