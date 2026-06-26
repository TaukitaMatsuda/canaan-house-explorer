import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, Calendar, MapPin, FileText } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import documentsData from '@/data/documents.json';
import charactersData from '@/data/characters.json';
import eventsData from '@/data/events.json';
import type { Document, Character, Event } from '@/types';
import { cn } from '@/utils/cn';

export const DocumentView: React.FC = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { language, markDocumentRead } = useApp();

  const document = (documentsData as Document[]).find(d => d.id === documentId);

  useEffect(() => {
    if (documentId) markDocumentRead(documentId);
  }, [documentId, markDocumentRead]);

  if (!document) {
    return (
      <div className="min-h-screen pt-24 px-4 text-center">
        <h2 className="font-display text-2xl text-tomb-gold">Document Not Found</h2>
        <Link to="/" className="text-tomb-bronze hover:text-tomb-gold mt-4 inline-block">
          Return to Map
        </Link>
      </div>
    );
  }

  const relatedCharacters = (charactersData as Character[])
    .filter(c => document.relatedCharacters.includes(c.id));
  const relatedEvents = (eventsData as Event[])
    .filter(e => document.relatedEvents.includes(e.id));

  const typeLabels = {
    journal: { en: 'Journal', ru: 'Дневник' },
    letter: { en: 'Letter', ru: 'Письмо' },
    record: { en: 'Record', ru: 'Запись' },
    manual: { en: 'Manual', ru: 'Руководство' },
    poem: { en: 'Poem', ru: 'Стихотворение' },
    contract: { en: 'Contract', ru: 'Контракт' },
  };

  const content = language === 'en' ? document.content : document.contentRu;

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Link 
            to={`/room/${document.room}`}
            className="inline-flex items-center gap-2 text-tomb-bronze hover:text-tomb-gold mb-6 transition-colors"
          >
            <ArrowLeft size={16} />
            <span className="font-body text-sm">{language === 'en' ? 'Back to Room' : 'Назад в комнату'}</span>
          </Link>

          {/* Document Header */}
          <div className="document-page mb-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText size={16} className="text-tomb-bronze" />
              <span className="font-mono text-xs text-tomb-bone/50 uppercase tracking-wider">
                {typeLabels[document.type][language]}
              </span>
            </div>

            <h1 className="font-display text-2xl md:text-3xl text-tomb-gold mb-4">
              {language === 'en' ? document.title : document.titleRu}
            </h1>

            <div className="flex flex-wrap gap-4 text-xs font-mono text-tomb-bone/50 mb-6 pb-4 border-b border-tomb-bronze/20">
              <span className="flex items-center gap-1">
                <User size={12} />
                {language === 'en' ? document.author : document.authorRu}
              </span>
              <span className="flex items-center gap-1">
                <Calendar size={12} />
                {document.date}
              </span>
              <Link 
                to={`/room/${document.room}`}
                className="flex items-center gap-1 hover:text-tomb-gold transition-colors"
              >
                <MapPin size={12} />
                {language === 'en' ? 'Found in room' : 'Найдено в комнате'}
              </Link>
            </div>

            {/* Document Content */}
            <div className="space-y-6">
              {content.map((paragraph, index) => (
                <motion.p
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + index * 0.1 }}
                  className="ancient-text leading-relaxed first-letter:text-3xl first-letter:font-display first-letter:text-tomb-gold first-letter:float-left first-letter:mr-2 first-letter:mt-1"
                >
                  {paragraph}
                </motion.p>
              ))}
            </div>
          </div>

          {/* Related Characters */}
          {relatedCharacters.length > 0 && (
            <div className="mb-6">
              <h3 className="font-display text-lg text-tomb-gold mb-3">
                {language === 'en' ? 'Mentioned Characters' : 'Упомянутые персонажи'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedCharacters.map(char => (
                  <Link
                    key={char.id}
                    to={`/character/${char.id}`}
                    className="px-3 py-1.5 bg-tomb-dark border border-tomb-bronze/30 rounded-sm text-sm text-tomb-ivory hover:border-tomb-gold/50 transition-all"
                  >
                    {language === 'en' ? char.name : char.nameRu}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Related Events */}
          {relatedEvents.length > 0 && (
            <div className="mb-6">
              <h3 className="font-display text-lg text-tomb-gold mb-3">
                {language === 'en' ? 'Related Events' : 'Связанные события'}
              </h3>
              <div className="flex flex-wrap gap-2">
                {relatedEvents.map(event => (
                  <Link
                    key={event.id}
                    to={`/timeline?event=${event.id}`}
                    className="px-3 py-1.5 bg-tomb-dark border border-tomb-bronze/30 rounded-sm text-sm text-tomb-ivory hover:border-tomb-gold/50 transition-all"
                  >
                    {language === 'en' ? event.title : event.titleRu}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};
