import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils/cn';
import { Calendar, BookOpen, Lightbulb, Palette, Church, User, FileText } from 'lucide-react';

// Маппинг категорий аннотаций на иконки и цвета
const annotationConfig: Record<string, { icon: React.ReactNode; label: string; color: string }> = {
  latin_etymology: {
    icon: <BookOpen size={16} />,
    label: 'Латынь',
    color: 'bg-purple-900/30 text-purple-300 border-purple-500/30'
  },
  name_etymology: {
    icon: <FileText size={16} />,
    label: 'Этимология',
    color: 'bg-blue-900/30 text-blue-300 border-blue-500/30'
  },
  religious_ref: {
    icon: <Church size={16} />,
    label: 'Религия',
    color: 'bg-amber-900/30 text-amber-300 border-amber-500/30'
  },
  art_ref: {
    icon: <Palette size={16} />,
    label: 'Искусство',
    color: 'bg-pink-900/30 text-pink-300 border-pink-500/30'
  },
  fan_theory: {
    icon: <Lightbulb size={16} />,
    label: 'Теория',
    color: 'bg-green-900/30 text-green-300 border-green-500/30'
  },
  personal_note: {
    icon: <User size={16} />,
    label: 'Заметка',
    color: 'bg-gray-900/30 text-gray-300 border-gray-500/30'
  },
  author_fact: {
    icon: <BookOpen size={16} />,
    label: 'Факт',
    color: 'bg-indigo-900/30 text-indigo-300 border-indigo-500/30'
  }
};

export const CharacterDetail: React.FC = () => {
  const params = useParams();
  const location = useLocation();
  const { language } = useApp();
  
  // Получаем ID из URL
  let id = params.id;
  if (!id) {
    const pathParts = location.pathname.split('/');
    id = pathParts[pathParts.length - 1];
  }
  
  const [character, setCharacter] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [annotations, setAnnotations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCharacter() {
      if (!id) {
        setError('ID не указан');
        setLoading(false);
        return;
      }

      try {
        const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
        
        let charData: any = null;

        if (isUUID) {
          const { data, error } = await supabase
            .from('characters')
            .select(`*, house:houses(name, number, colors)`)
            .eq('id', id)
            .maybeSingle();

          if (error) {
            setError('Ошибка базы данных');
            setLoading(false);
            return;
          }
          charData = data;
        } else {
          const { data, error } = await supabase
            .from('characters')
            .select(`*, house:houses(name, number, colors)`)
            .ilike('name', `%${id}%`)
            .limit(1);

          if (error) {
            setError('Ошибка базы данных');
            setLoading(false);
            return;
          }

          charData = data && data.length > 0 ? data[0] : null;
        }

        if (!charData) {
          setError('Персонаж не найден');
          setLoading(false);
          return;
        }

        setCharacter(charData);

        // Загружаем события
        const { data: eventsData } = await supabase
          .from('event_participants')
          .select(`
            role_in_event,
            event:events(
              id, name, day, importance, description
            )
          `)
          .eq('character_id', charData.id);

        if (eventsData) {
          const formattedEvents = eventsData.map((ep: any) => ({
            ...ep.event,
            role: ep.role_in_event
          }));
          setEvents(formattedEvents);
        }

        // Загружаем аннотации
        const { data: annotationsData } = await supabase
          .from('annotations')
          .select('*')
          .eq('target_type', 'character')
          .eq('target_id', charData.id)
          .order('category');

        if (annotationsData) {
          setAnnotations(annotationsData);
        }

        setLoading(false);
      } catch (err) {
        setError('Произошла ошибка при загрузке');
        setLoading(false);
      }
    }

    loadCharacter();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-white">Загрузка персонажа...</div>;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-white">
        <p className="text-tomb-blood mb-2">{error}</p>
        <p className="text-tomb-bone/50 text-sm">
          ID в URL: <code className="bg-tomb-dark px-2 py-1 rounded">{id}</code>
        </p>
      </div>
    );
  }

  if (!character) {
    return <div className="p-8 text-center text-white">Персонаж не найден</div>;
  }

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Основная карточка персонажа */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tomb-panel p-6 mb-6"
        >
          <div className="flex items-start gap-6">
            {character.portrait_url && (
              <img
                src={character.portrait_url}
                alt={character.name}
                className="w-32 h-32 rounded-sm object-cover border border-tomb-bronze/30"
              />
            )}
            <div className="flex-1">
              <h1 className="font-display text-3xl text-tomb-ivory mb-2">
                {character.name}
              </h1>
              {character.house && (
                <Link
                  to={`/house/${character.house.id}`}
                  className="inline-flex items-center gap-2 text-tomb-gold hover:text-tomb-gold/80 transition-colors mb-3"
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{
                      backgroundColor: character.house.colors?.[0] || '#888'
                    }}
                  />
                  {character.house.name}
                </Link>
              )}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="px-2 py-1 bg-tomb-bronze/20 text-tomb-bone/70 text-xs font-mono rounded">
                  {character.role}
                </span>
                <span className={cn(
                  "px-2 py-1 text-xs font-mono rounded",
                  character.status === 'alive'
                    ? "bg-green-900/30 text-green-300"
                    : "bg-red-900/30 text-red-300"
                )}>
                  {character.status}
                </span>
                {character.is_beguiling && (
                  <span className="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs font-mono rounded">
                    beguiling corpse
                  </span>
                )}
              </div>
              <p className="ancient-text text-tomb-bone/80 leading-relaxed">
                {character.bio}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Блок аннотаций */}
        {annotations.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="font-display text-2xl text-tomb-ivory mb-4 flex items-center gap-2">
              <Lightbulb size={20} className="text-tomb-gold" />
              {language === 'en' ? 'Research Notes' : 'Исследовательские заметки'}
            </h2>
            <div className="space-y-3">
              {annotations.map((annotation) => {
                const config = annotationConfig[annotation.category] || annotationConfig.personal_note;
                
                return (
                  <div
                    key={annotation.id}
                    className={cn(
                      "tomb-panel p-4 border-l-4",
                      config.color
                    )}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {config.icon}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-lg text-tomb-ivory mb-2">
                          {annotation.title}
                        </h3>
                        <p className="ancient-text text-sm text-tomb-bone/80 leading-relaxed mb-2">
                          {annotation.content}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-tomb-bone/50">
                          <span className="font-mono">{config.label}</span>
                          {annotation.source && (
                            <>
                              <span>•</span>
                              <span>{annotation.source}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* События с участием персонажа */}
        {events.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="font-display text-2xl text-tomb-ivory mb-4 flex items-center gap-2">
              <Calendar size={20} className="text-tomb-gold" />
              {language === 'en' ? 'Events' : 'События'}
            </h2>
            <div className="space-y-3">
              {events.map((event) => (
                <Link
                  key={event.id}
                  to={`/timeline?event=${event.id}`}
                  className="block tomb-panel p-4 hover:border-tomb-bronze/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono text-xs text-tomb-gold">
                          {language === 'en' ? `Day ${event.day}` : `День ${event.day}`}
                        </span>
                        {event.role && (
                          <span className="px-1.5 py-0.5 bg-tomb-blood/20 text-tomb-bone/70 text-[10px] font-mono rounded">
                            {event.role}
                          </span>
                        )}
                      </div>
                      <h3 className="font-display text-lg text-tomb-ivory">
                        {event.name}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};