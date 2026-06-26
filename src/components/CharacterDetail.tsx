import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Calendar, BookOpen, Heart, Sword, Skull } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import charactersData from '@/data/characters.json';
import roomsData from '@/data/rooms.json';
import eventsData from '@/data/events.json';
import documentsData from '@/data/documents.json';
import type { Character, Room, Event, Document } from '@/types';
import { cn } from '@/utils/cn';

export const CharacterDetail: React.FC = () => {
  const { characterId } = useParams<{ characterId: string }>();
  const { language } = useApp();

  const character = (charactersData as Character[]).find(c => c.id === characterId);

  if (!character) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <h2 className="font-display text-2xl text-tomb-gold">Character Not Found</h2>
        <Link to="/characters" className="text-tomb-bronze hover:text-tomb-gold mt-4 inline-block">
          Return to Characters
        </Link>
      </div>
    );
  }

  const relatedRooms = (roomsData as Room[])
    .filter(r => character.rooms.includes(r.id));
  const relatedEvents = (eventsData as Event[])
    .filter(e => character.events.includes(e.id));
  const relatedDocuments = (documentsData as Document[])
    .filter(d => d.relatedCharacters.includes(character.id));

  return (
    <div className="min-h-screen pt-16 pb-8">
      {/* Hero */}
      <div className="relative h-72 md:h-96 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${
              character.houseNumber === 9 ? 'rgba(42, 42, 56, 0.5)' :
              character.houseNumber === 3 ? 'rgba(255, 215, 0, 0.2)' :
              character.houseNumber === 6 ? 'rgba(65, 105, 225, 0.2)' :
              'rgba(139, 115, 85, 0.3)'
            } 0%, transparent 60%)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-tomb-black via-tomb-black/50 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Link 
              to="/characters" 
              className="inline-flex items-center gap-2 text-tomb-bronze hover:text-tomb-gold mb-4 transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="font-body text-sm">{language === 'en' ? 'Back to Characters' : 'Назад к персонажам'}</span>
            </Link>

            <div className="flex items-end gap-6">
              <div 
                className="w-24 h-24 md:w-32 md:h-32 rounded-sm flex items-center justify-center text-4xl md:text-5xl font-display flex-shrink-0 border-2"
                style={{ 
                  backgroundColor: character.houseNumber === 9 ? '#2a2a38' : 
                    character.houseNumber === 3 ? 'rgba(255, 215, 0, 0.15)' : 
                    character.houseNumber === 6 ? 'rgba(65, 105, 225, 0.15)' : 
                    'rgba(139, 115, 85, 0.15)',
                  borderColor: character.houseNumber === 9 ? '#4a4a5a' : 
                    character.houseNumber === 3 ? 'rgba(255, 215, 0, 0.3)' : 
                    character.houseNumber === 6 ? 'rgba(65, 105, 225, 0.3)' : 
                    'rgba(139, 115, 85, 0.3)'
                }}
              >
                {character.name.charAt(0)}
              </div>
              <div>
                <h1 className="font-display text-3xl md:text-5xl text-tomb-gold mb-2">
                  {language === 'en' ? character.name : character.nameRu}
                </h1>
                <p className="font-mono text-sm text-tomb-bone/60">
                  {language === 'en' ? character.house : character.houseRu}
                  {' · '}
                  {language === 'en' ? character.role : character.roleRu}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  {character.isNecromancer && (
                    <span className="px-2 py-1 bg-tomb-blood/20 text-tomb-bone/70 text-xs font-mono rounded flex items-center gap-1">
                      <Heart size={12} />
                      {language === 'en' ? 'NECROMANCER' : 'НЕКРОМАНТ'}
                    </span>
                  )}
                  {character.isCavalier && (
                    <span className="px-2 py-1 bg-tomb-green/20 text-tomb-bone/70 text-xs font-mono rounded flex items-center gap-1">
                      <Sword size={12} />
                      {language === 'en' ? 'CAVALIER' : 'КАВАЛЕР'}
                    </span>
                  )}
                  {!character.isAlive && (
                    <span className="px-2 py-1 bg-tomb-dark text-tomb-bone/40 text-xs font-mono rounded flex items-center gap-1">
                      <Skull size={12} />
                      {language === 'en' ? 'DECEASED' : 'УМЕР'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Description */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="document-page mb-8"
        >
          <p className="ancient-text text-lg leading-relaxed mb-6">
            {language === 'en' ? character.description : character.descriptionRu}
          </p>
          <div className="skull-divider">
            <Skull size={16} className="text-tomb-bronze/40" />
          </div>
          <h3 className="font-display text-xl text-tomb-gold mb-4">
            {language === 'en' ? 'Biography' : 'Биография'}
          </h3>
          <p className="ancient-text leading-relaxed">
            {language === 'en' ? character.biography : character.biographyRu}
          </p>
        </motion.div>

        {/* Rooms */}
        {relatedRooms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h3 className="font-display text-xl text-tomb-gold mb-4 flex items-center gap-2">
              <MapPin size={18} />
              {language === 'en' ? 'Known Locations' : 'Известные места'}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {relatedRooms.map(room => (
                <Link
                  key={room.id}
                  to={`/room/${room.id}`}
                  className="tomb-panel p-3 hover:border-tomb-gold/50 transition-all hover:-translate-y-0.5"
                >
                  <span className="font-display text-sm text-tomb-ivory">
                    {language === 'en' ? room.name : room.nameRu}
                  </span>
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
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <h3 className="font-display text-xl text-tomb-gold mb-4 flex items-center gap-2">
              <Calendar size={18} />
              {language === 'en' ? 'Involved Events' : 'Участие в событиях'}
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
            transition={{ delay: 0.5 }}
            className="mb-8"
          >
            <h3 className="font-display text-xl text-tomb-gold mb-4 flex items-center gap-2">
              <BookOpen size={18} />
              {language === 'en' ? 'Related Documents' : 'Связанные документы'}
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
