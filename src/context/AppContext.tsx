import React, { createContext, useContext, useState, useCallback } from 'react';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import type { TimeOfDay, Language } from '@/types';

interface AppContextType {
  timeOfDay: TimeOfDay;
  toggleTimeOfDay: () => void;
  language: Language;
  toggleLanguage: () => void;
  visitedRooms: string[];
  markRoomVisited: (roomId: string) => void;
  collectedObjects: string[];
  collectObject: (objectId: string) => void;
  readDocuments: string[];
  markDocumentRead: (docId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [timeOfDay, setTimeOfDay] = useLocalStorage<TimeOfDay>('tomb-time', 'day');
  const [language, setLanguage] = useLocalStorage<Language>('tomb-lang', 'en');
  const [visitedRooms, setVisitedRooms] = useLocalStorage<string[]>('tomb-rooms', []);
  const [collectedObjects, setCollectedObjects] = useLocalStorage<string[]>('tomb-objects', []);
  const [readDocuments, setReadDocuments] = useLocalStorage<string[]>('tomb-docs', []);

  const toggleTimeOfDay = useCallback(() => {
    setTimeOfDay(prev => prev === 'day' ? 'night' : 'day');
  }, [setTimeOfDay]);

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en');
  }, [setLanguage]);

  const markRoomVisited = useCallback((roomId: string) => {
    setVisitedRooms(prev => prev.includes(roomId) ? prev : [...prev, roomId]);
  }, [setVisitedRooms]);

  const collectObject = useCallback((objectId: string) => {
    setCollectedObjects(prev => prev.includes(objectId) ? prev : [...prev, objectId]);
  }, [setCollectedObjects]);

  const markDocumentRead = useCallback((docId: string) => {
    setReadDocuments(prev => prev.includes(docId) ? prev : [...prev, docId]);
  }, [setReadDocuments]);

  return (
    <AppContext.Provider value={{
      timeOfDay,
      toggleTimeOfDay,
      language,
      toggleLanguage,
      visitedRooms,
      markRoomVisited,
      collectedObjects,
      collectObject,
      readDocuments,
      markDocumentRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
}
