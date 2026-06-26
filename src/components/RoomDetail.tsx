import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, BookOpen, Users, Calendar } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { useParallax } from '@/hooks/useParallax';
import roomsData from '@/data/rooms.json';
import charactersData from '@/data/characters.json';
import eventsData from '@/data/events.json';
import documentsData from '@/data/documents.json';
import type { Room, Character, Event, Document } from '@/types';
import { cn } from '@/utils/cn';

export const RoomDetail: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const { timeOfDay, language, markRoomVisited } = useApp();
  const { ref, offset } = useParallax(10);

  const room = (roomsData as Room[]).find(r => r.id === roomId);

  useEffect(() => {
    if (roomId) markRoomVisited(roomId);
  }, [roomId, markRoomVisited]);

  if (!room) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <h2 className="font-display text-2xl text-tomb-gold">Room Not Found</h2>
        <Link to="/" className="text-tomb-bronze hover:text-tomb-gold mt-4 inline-block">
          Return to Map
        </Link>
      </div>
    );
  }

  const relatedCharacters = (charactersData as Character[])
    .filter(c => room.characters.includes(c.id));
  const relatedEvents = (eventsData as Event[])
    .filter(e => room.events.includes(e.id));
  const relatedDocuments = (documentsData as Document[])
    .filter(d => d.room === room.id);

  const getAtmosphereClass = (atmosphere: Room['atmosphere']) => {
    switch (atmosphere) {
      case 'bright': return 'from-tomb-sage/20 to-transparent';
      case 'dim': return 'from-tomb-bronze/20 to-transparent';
      case 'dark': return 'from-tomb-blood/20 to-transparent';
      case 'ominous': return 'from-tomb-blood/30 to-transparent';
      default: return 'from-tomb-bronze/20 to-transparent';
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-8">
      {/* Hero Section */}
      <div 
        ref={ref}
        className={cn(
          "relative h-64 md:h-80 overflow-hidden",
          timeOfDay === 'night' ? 'brightness-75' : ''
        )}
      >
        <div 
          className={cn("absolute inset-0 bg-gradient-to-b", getAtmosphereClass(room.atmosphere))}
          style={{
            transform: `translate(${offset.x}px, ${offset.y}px) scale(1.1)`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tomb-black via-tomb-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 text-tomb-bronze hover:text-tomb-gold mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="font-body text-sm">{language === 'en' ? 'Back to Map' : 'Назад к карте'}</span>
            </Link>

            <h1 className="font-display text-3xl md:text-5xl text-tomb-gold mb-2">
              {language === 'en' ? room.name : room.nameRu}
            </h1>
            <p className="font-mono text-sm text-tomb-bone/60">
              {language === 'en' ? `Floor ${room.floor === 0 ? 'Ground' : room.floor}` : `Этаж ${room.floor === 0 ? 'Первый' : room.floor}`}
              {' · '}
              <span className="capitalize">{room.atmosphere}</span>
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="document-page mb-8"
        >
          <p className="ancient-text text-lg leading-relaxed">
            {language === 'en' ? room.description : room.descriptionRu}
          </p>
        </motion.div>

        {/* Connected Rooms */}
        {room.connections.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="font-display text-xl text-tomb-gold mb-4 flex items-center gap-2">
              <ArrowRight size={18} />
              {language === 'en' ? 'Connected Rooms' : 'Связанные комнаты'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {room.connections.map(connId => {
                const connRoom = (roomsData as Room[]).find(r => r.id === connId);
                if (!connRoom) return null;
                return (
                  <Link
                    key={connId}
                    to={`/room/${connId}`}
                    className="tomb-panel p-3 hover:border-tomb-gold/50 transition-all hover:-translate-y-0.5"
                  >
                    <span className="font-display text-sm text-tomb-ivory">
                      {language === 'en' ? connRoom.name : connRoom.nameRu}
                    </span>
                  </Link>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* Characters */}
        {relatedCharacters.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="font-display text-xl text-tomb-gold mb-4 flex items-center gap-2">
              <Users size={18} />
              {language === 'en' ? 'Characters Present' : 'Присутствующие персонажи'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {relatedCharacters.map(char => (
                <Link
                  key={char.id}
                  to={`/character/${char.id}`}
                  className="character-card flex items-center gap-4"
                >
                  <div 
                    className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-display"
                    style={{ backgroundColor: char.houseNumber === 9 ? '#1a1a1a' : char.houseNumber === 3 ? '#FFD700' : char.houseNumber === 6 ? '#4169E1' : '#8b7355' }}
                  >
                    {char.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-display text-sm text-tomb-ivory">{language === 'en' ? char.name : char.nameRu}</p>
                    <p className="font-mono text-xs text-tomb-bone/50">{language === 'en' ? char.house : char.houseRu}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Events */}
        {relatedEvents.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="font-display text-xl text-tomb-gold mb-4 flex items-center gap-2">
              <Calendar size={18} />
              {language === 'en' ? 'Events' : 'События'}
            </h3>
            <div className="space-y-3">
              {relatedEvents.map(event => (
                <Link
                  key={event.id}
                  to={`/timeline?event=${event.id}`}
                  className="block tomb-panel p-4 hover:border-tomb-gold/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-display text-sm text-tomb-ivory">{language === 'en' ? event.title : event.titleRu}</p>
                      <p className="font-mono text-xs text-tomb-bone/50 mt-1">
                        {language === 'en' ? `Day ${event.day}` : `День ${event.day}`}
                        {event.chapter && ` · ${event.chapter}`}
                      </p>
                    </div>
                    {event.isMajor && (
                      <span className="px-2 py-1 bg-tomb-blood/30 text-tomb-bone/70 text-xs font-mono rounded">
                        {language === 'en' ? 'Major' : 'Главное'}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* Documents */}
        {relatedDocuments.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mb-8"
          >
            <h3 className="font-display text-xl text-tomb-gold mb-4 flex items-center gap-2">
              <BookOpen size={18} />
              {language === 'en' ? 'Documents Found' : 'Найденные документы'}
            </h3>
            <div className="space-y-3">
              {relatedDocuments.map(doc => (
                <Link
                  key={doc.id}
                  to={`/document/${doc.id}`}
                  className="block tomb-panel p-4 hover:border-tomb-gold/50 transition-all"
                >
                  <p className="font-display text-sm text-tomb-ivory">{language === 'en' ? doc.title : doc.titleRu}</p>
                  <p className="font-mono text-xs text-tomb-bone/50 mt-1">
                    {language === 'en' ? doc.author : doc.authorRu} · {doc.type}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
