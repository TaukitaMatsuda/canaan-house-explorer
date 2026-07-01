import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils/cn';
import { Calendar, MapPin, Users, ChevronDown, ChevronUp, Skull } from 'lucide-react';

export const Timeline: React.FC = () => {
  const { language } = useApp();
  const [searchParams] = useSearchParams();
  const highlightEvent = searchParams.get('event');

  // ВСЕ useState в самом начале
  const [expandedEvent, setExpandedEvent] = useState<string | null>(highlightEvent);
  const [filterMajor, setFilterMajor] = useState(false);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ВСЕ useEffect после всех useState
  useEffect(() => {
    async function loadEvents() {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          room:rooms(name),
          participants:event_participants(
            character:characters(name)
          )
        `)
        .order('day', { ascending: true })
        .order('sequence_order', { ascending: true });

      if (error) {
        console.error('Ошибка загрузки событий:', error);
      } else {
        setEvents(data || []);
      }
      setLoading(false);
    }

    loadEvents();
  }, []);

  useEffect(() => {
    if (highlightEvent) {
      setExpandedEvent(highlightEvent);
      const element = document.getElementById(`event-${highlightEvent}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [highlightEvent]);

  // ТОЛЬКО ПОСЛЕ всех хуков можно делать ранний return
  if (loading) {
    return <div className="p-8 text-center text-white">Загрузка событий из базы...</div>;
  }

  // Вся остальная логика после проверки loading
  const sortedEvents = [...events].sort((a, b) => a.day - b.day);
  const days = Array.from(new Set(sortedEvents.map(e => e.day))).sort((a, b) => a - b);

  const filteredEvents = sortedEvents.filter(event => {
    if (filterMajor && event.importance !== 'critical' && event.importance !== 'major') return false;
    if (selectedDay !== null && event.day !== selectedDay) return false;
    return true;
  });

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl text-tomb-gold mb-2">
            {language === 'en' ? 'Timeline of Events' : 'Хронология событий'}
          </h2>
          <p className="font-body text-tomb-bone/70 italic">
            {language === 'en' 
              ? 'The days unfold at Canaan House' 
              : 'Дни разворачиваются в Доме Ханаанском'}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => setFilterMajor(!filterMajor)}
            className={cn(
              "px-3 py-1.5 rounded-sm font-mono text-xs transition-all flex items-center gap-1.5",
              filterMajor 
                ? "bg-tomb-blood/20 text-tomb-bone/70 border border-tomb-blood/40" 
                : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
            )}
          >
            <Skull size={12} />
            {language === 'en' ? 'Major Events Only' : 'Только главные события'}
          </button>

          <button
            onClick={() => setSelectedDay(null)}
            className={cn(
              "px-3 py-1.5 rounded-sm font-mono text-xs transition-all",
              selectedDay === null 
                ? "bg-tomb-gold/20 text-tomb-gold border border-tomb-gold/40" 
                : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
            )}
          >
            {language === 'en' ? 'All Days' : 'Все дни'}
          </button>

          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(selectedDay === day ? null : day)}
              className={cn(
                "px-3 py-1.5 rounded-sm font-mono text-xs transition-all",
                selectedDay === day 
                  ? "bg-tomb-gold/20 text-tomb-gold border border-tomb-gold/40" 
                  : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
              )}
            >
              {language === 'en' ? `Day ${day}` : `День ${day}`}
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px bg-tomb-bronze/30 -translate-x-1/2" />

          <div className="space-y-6">
            {filteredEvents.map((event, index) => {
              const isExpanded = expandedEvent === event.id;
              const isHighlighted = highlightEvent === event.id;
              const isMajor = event.importance === 'critical' || event.importance === 'major';
              const participantsCount = event.participants?.length || 0;

              return (
                <motion.div
                  key={event.id}
                  id={`event-${event.id}`}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={cn(
                    "relative pl-12 md:pl-0",
                    index % 2 === 0 ? "md:pr-[calc(50%+2rem)]" : "md:pl-[calc(50%+2rem)]"
                  )}
                >
                  <div className={cn(
                    "absolute left-4 md:left-1/2 top-3 w-3 h-3 rounded-full border-2 -translate-x-1/2 z-10 transition-all",
                    isHighlighted 
                      ? "border-tomb-gold bg-tomb-gold/30 shadow-lg shadow-tomb-gold/20" 
                      : isMajor
                        ? "border-tomb-blood bg-tomb-blood/20" 
                        : "border-tomb-bronze bg-tomb-dark"
                  )} />

                  <div 
                    onClick={() => setExpandedEvent(isExpanded ? null : event.id)}
                    className={cn(
                      "tomb-panel cursor-pointer transition-all hover:border-tomb-bronze/50",
                      isHighlighted && "border-tomb-gold/50 shadow-lg shadow-tomb-gold/10"
                    )}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-mono text-xs text-tomb-gold">
                              {language === 'en' ? `Day ${event.day}` : `День ${event.day}`}
                            </span>
                            {isMajor && (
                              <span className="px-1.5 py-0.5 bg-tomb-blood/20 text-tomb-bone/70 text-[10px] font-mono rounded">
                                {language === 'en' ? 'MAJOR' : 'ГЛАВНОЕ'}
                              </span>
                            )}
                          </div>
                          <h3 className="font-display text-lg text-tomb-ivory">
                            {event.name}
                          </h3>
                        </div>
                        {isExpanded ? <ChevronUp size={18} className="text-tomb-bone/40" /> : <ChevronDown size={18} className="text-tomb-bone/40" />}
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="pt-4 mt-4 border-t border-tomb-bronze/20">
                              <p className="ancient-text text-sm leading-relaxed mb-4">
                                {event.description}
                              </p>

                              <div className="flex flex-wrap gap-4 text-xs font-mono text-tomb-bone/50">
                                {event.room?.name && (
                                  <Link 
                                    to={`/room/${event.location_id}`}
                                    className="flex items-center gap-1 hover:text-tomb-gold transition-colors"
                                  >
                                    <MapPin size={12} />
                                    {event.room.name}
                                  </Link>
                                )}
                                {participantsCount > 0 && (
                                  <span className="flex items-center gap-1">
                                    <Users size={12} />
                                    {participantsCount} {language === 'en' ? 'characters' : 'персонажей'}
                                  </span>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {filteredEvents.length === 0 && (
          <div className="text-center py-12">
            <Calendar size={48} className="text-tomb-bone/20 mx-auto mb-4" />
            <p className="font-body text-tomb-bone/50">
              {language === 'en' ? 'No events found' : 'События не найдены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};