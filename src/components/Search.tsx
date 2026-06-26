import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Search as SearchIcon, MapPin, Users, Calendar, BookOpen, FileText } from 'lucide-react';
import roomsData from '../data/rooms.json';
import charactersData from '../data/characters.json';
import eventsData from '../data/events.json';
import documentsData from '../data/documents.json';
import codexData from '../data/codex.json';
import { cn } from '../utils/cn';

type SearchResult = {
  id: string;
  type: 'room' | 'character' | 'event' | 'document' | 'codex';
  title: string;
  titleRu: string;
  description: string;
  descriptionRu: string;
  url: string;
};

export const Search: React.FC = () => {
  const { language } = useApp();
  const [query, setQuery] = useState('');

  const allItems: SearchResult[] = useMemo(() => {
    const items: SearchResult[] = [];
    
    (roomsData as any[]).forEach(room => {
      items.push({
        id: room.id,
        type: 'room',
        title: room.name,
        titleRu: room.nameRu,
        description: room.description,
        descriptionRu: room.descriptionRu,
        url: `/room/${room.id}`,
      });
    });
    
    (charactersData as any[]).forEach(char => {
      items.push({
        id: char.id,
        type: 'character',
        title: char.name,
        titleRu: char.nameRu,
        description: char.description,
        descriptionRu: char.descriptionRu,
        url: `/character/${char.id}`,
      });
    });
    
    (eventsData as any[]).forEach(event => {
      items.push({
        id: event.id,
        type: 'event',
        title: event.title,
        titleRu: event.titleRu,
        description: event.description,
        descriptionRu: event.descriptionRu,
        url: `/timeline?event=${event.id}`,
      });
    });
    
    (documentsData as any[]).forEach(doc => {
      items.push({
        id: doc.id,
        type: 'document',
        title: doc.title,
        titleRu: doc.titleRu,
        description: `${doc.author} · ${doc.type}`,
        descriptionRu: `${doc.authorRu} · ${doc.type}`,
        url: `/document/${doc.id}`,
      });
    });
    
    (codexData as any[]).forEach(entry => {
      items.push({
        id: entry.id,
        type: 'codex',
        title: entry.title,
        titleRu: entry.titleRu,
        description: entry.content.substring(0, 100) + '...',
        descriptionRu: entry.contentRu.substring(0, 100) + '...',
        url: `/codex?entry=${entry.id}`,
      });
    });
    
    return items;
  }, []);

  const results = useMemo(() => {
    if (!query.trim()) return [];
    const lowerQuery = query.toLowerCase();
    return allItems.filter(item => 
      item.title.toLowerCase().includes(lowerQuery) ||
      item.titleRu.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery) ||
      item.descriptionRu.toLowerCase().includes(lowerQuery)
    );
  }, [query, allItems]);

  const typeIcons = {
    room: MapPin,
    character: Users,
    event: Calendar,
    document: FileText,
    codex: BookOpen,
  };

  const typeLabels = {
    room: { en: 'Room', ru: 'Комната' },
    character: { en: 'Character', ru: 'Персонаж' },
    event: { en: 'Event', ru: 'Событие' },
    document: { en: 'Document', ru: 'Документ' },
    codex: { en: 'Codex', ru: 'Кодекс' },
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl text-tomb-gold mb-2">
            {language === 'en' ? 'Search' : 'Поиск'}
          </h2>
          <p className="font-body text-tomb-bone/70 italic">
            {language === 'en' 
              ? 'Search rooms, characters, events, and documents' 
              : 'Ищите комнаты, персонажей, события и документы'}
          </p>
        </motion.div>

        <div className="relative mb-8">
          <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-tomb-bone/40" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={language === 'en' ? 'Enter search term...' : 'Введите поисковый запрос...'}
            className="w-full pl-12 pr-4 py-3 bg-tomb-dark border border-tomb-bronze/30 rounded-sm text-tomb-ivory placeholder:text-tomb-bone/30 focus:border-tomb-gold/50 focus:outline-none transition-colors text-lg"
            autoFocus
          />
        </div>

        {query.trim() && (
          <div className="space-y-3">
            {results.map((result, index) => {
              const Icon = typeIcons[result.type];
              return (
                <motion.div
                  key={result.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <Link
                    to={result.url}
                    className="block bg-tomb-dark/90 backdrop-blur-sm border border-tomb-bronze/30 rounded-sm p-4 hover:border-tomb-gold/50 transition-all"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-tomb-bronze/10 rounded-sm">
                        <Icon size={18} className="text-tomb-bronze" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[10px] text-tomb-bone/40 uppercase">
                            {typeLabels[result.type][language]}
                          </span>
                        </div>
                        <h3 className="font-display text-lg text-tomb-ivory mb-1">
                          {language === 'en' ? result.title : result.titleRu}
                        </h3>
                        <p className="font-body text-tomb-bone/70 text-sm line-clamp-2">
                          {language === 'en' ? result.description : result.descriptionRu}
                        </p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
            
            {results.length === 0 && (
              <div className="text-center py-12">
                <SearchIcon size={48} className="text-tomb-bone/20 mx-auto mb-4" />
                <p className="font-body text-tomb-bone/50">
                  {language === 'en' ? 'No results found' : 'Результаты не найдены'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};