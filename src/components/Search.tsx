import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils/cn';
import { Search as SearchIcon, Users, MapPin, Calendar, FileText } from 'lucide-react';

export const Search: React.FC = () => {
  const { language } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{
    characters: any[];
    rooms: any[];
    events: any[];
    documents: any[];
  }>({
    characters: [],
    rooms: [],
    events: [],
    documents: []
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function search() {
      if (query.length < 2) {
        setResults({ characters: [], rooms: [], events: [], documents: [] });
        return;
      }

      setLoading(true);

      // Параллельные запросы ко всем таблицам
      const [charsRes, roomsRes, eventsRes, docsRes] = await Promise.all([
        supabase
          .from('characters')
          .select('id, name, role, house:houses(name)')
          .ilike('name', `%${query}%`)
          .limit(10),
        supabase
          .from('rooms')
          .select('id, name, room_type, location:locations(name)')
          .ilike('name', `%${query}%`)
          .limit(10),
        supabase
          .from('events')
          .select('id, name, day, importance')
          .ilike('name', `%${query}%`)
          .limit(10),
        supabase
          .from('documents')
          .select('id, title, author:characters(name)')
          .ilike('title', `%${query}%`)
          .limit(10)
      ]);

      setResults({
        characters: charsRes.data || [],
        rooms: roomsRes.data || [],
        events: eventsRes.data || [],
        documents: docsRes.data || []
      });

      setLoading(false);
    }

    const timeout = setTimeout(search, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const totalResults =
    results.characters.length +
    results.rooms.length +
    results.events.length +
    results.documents.length;

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="font-display text-3xl text-tomb-ivory mb-4">
            {language === 'en' ? 'Search' : 'Поиск'}
          </h1>

          <div className="relative">
            <SearchIcon size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-tomb-bone/40" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search characters, rooms, events...' : 'Поиск персонажей, комнат, событий...'}
              className="w-full pl-12 pr-4 py-3 bg-tomb-dark border border-tomb-bronze/30 text-tomb-ivory placeholder:text-tomb-bone/40 focus:outline-none focus:border-tomb-gold/50 transition-colors"
            />
          </div>
        </motion.div>

        {loading && (
          <div className="text-center text-tomb-bone/50">
            {language === 'en' ? 'Searching...' : 'Поиск...'}
          </div>
        )}

        {!loading && query.length >= 2 && totalResults === 0 && (
          <div className="text-center text-tomb-bone/50">
            {language === 'en' ? 'No results found' : 'Ничего не найдено'}
          </div>
        )}

        {/* Персонажи */}
        {results.characters.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-xl text-tomb-gold mb-3 flex items-center gap-2">
              <Users size={18} />
              {language === 'en' ? 'Characters' : 'Персонажи'}
            </h2>
            <div className="space-y-2">
              {results.characters.map((char) => (
                <Link
                  key={char.id}
                  to={`/character/${char.id}`}
                  className="block tomb-panel p-3 hover:border-tomb-bronze/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-display text-tomb-ivory">{char.name}</h3>
                      <p className="text-xs text-tomb-bone/50 font-mono">
                        {char.role} {char.house && `• ${char.house.name}`}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Комнаты */}
        {results.rooms.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-xl text-tomb-gold mb-3 flex items-center gap-2">
              <MapPin size={18} />
              {language === 'en' ? 'Rooms' : 'Комнаты'}
            </h2>
            <div className="space-y-2">
              {results.rooms.map((room) => (
                <Link
                  key={room.id}
                  to={`/room/${room.id}`}
                  className="block tomb-panel p-3 hover:border-tomb-bronze/50 transition-all"
                >
                  <h3 className="font-display text-tomb-ivory">{room.name}</h3>
                  <p className="text-xs text-tomb-bone/50 font-mono">
                    {room.room_type} {room.location && `• ${room.location.name}`}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* События */}
        {results.events.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-xl text-tomb-gold mb-3 flex items-center gap-2">
              <Calendar size={18} />
              {language === 'en' ? 'Events' : 'События'}
            </h2>
            <div className="space-y-2">
              {results.events.map((event) => (
                <Link
                  key={event.id}
                  to={`/timeline?event=${event.id}`}
                  className="block tomb-panel p-3 hover:border-tomb-bronze/50 transition-all"
                >
                  <h3 className="font-display text-tomb-ivory">{event.name}</h3>
                  <p className="text-xs text-tomb-bone/50 font-mono">
                    {language === 'en' ? `Day ${event.day}` : `День ${event.day}`}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Документы */}
        {results.documents.length > 0 && (
          <div className="mb-6">
            <h2 className="font-display text-xl text-tomb-gold mb-3 flex items-center gap-2">
              <FileText size={18} />
              {language === 'en' ? 'Documents' : 'Документы'}
            </h2>
            <div className="space-y-2">
              {results.documents.map((doc) => (
                <Link
                  key={doc.id}
                  to={`/document/${doc.id}`}
                  className="block tomb-panel p-3 hover:border-tomb-bronze/50 transition-all"
                >
                  <h3 className="font-display text-tomb-ivory">{doc.title}</h3>
                  {doc.author && (
                    <p className="text-xs text-tomb-bone/50 font-mono">
                      {doc.author.name}
                    </p>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};