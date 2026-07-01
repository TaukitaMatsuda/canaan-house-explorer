// src/services/loreService.ts
import { supabase } from '../lib/supabase';
import type { House, Character, Room, ILoreService } from '../types/lore';

export const loreService: ILoreService = {
  // Получить все Дома
  async getHouses(): Promise<House[]> {
    const { data, error } = await supabase
      .from('houses')
      .select('*')
      .order('number');
    
    if (error) {
      console.error('Ошибка загрузки домов:', error);
      return [];
    }
    return data || [];
  },

  // Получить персонажей по ID Дома
  async getCharactersByHouse(houseId: string): Promise<Character[]> {
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .eq('house_id', houseId)
      .order('name');
    
    if (error) {
      console.error('Ошибка загрузки персонажей:', error);
      return [];
    }
    return data || [];
  },

  // Получить комнаты по ID локации
  async getRoomsByLocation(locationId: string): Promise<Room[]> {
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('location_id', locationId)
      .order('floor_level', 'name');
    
    if (error) {
      console.error('Ошибка загрузки комнат:', error);
      return [];
    }
    return data || [];
  },

  // Получить связи персонажа
  async getCharacterRelationships(characterId: string): Promise<any[]> {
    const { data, error } = await supabase
      .from('character_relationships')
      .select('*')
      .or(`source_character_id.eq.${characterId},target_character_id.eq.${characterId}`);
    
    if (error) {
      console.error('Ошибка загрузки связей:', error);
      return [];
    }
    return data || [];
  }
};