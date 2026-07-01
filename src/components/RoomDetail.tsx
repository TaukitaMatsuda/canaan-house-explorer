import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { cn } from '@/utils/cn';
import { MapPin, Users, Package, Calendar } from 'lucide-react';

export const RoomDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useApp();

  const [room, setRoom] = useState<any>(null);
  const [objects, setObjects] = useState<any[]>([]);
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadRoom() {
      if (!id) return;

      // 1. Получаем комнату + локацию
      const { data: roomData, error: roomError } = await supabase
        .from('rooms')
        .select(`
          *,
          location:locations(name, type)
        `)
        .eq('id', id)
        .single();

      if (roomError) {
        console.error('Ошибка загрузки комнаты:', roomError);
        setLoading(false);
        return;
      }

      setRoom(roomData);

      // 2. Получаем предметы в комнате
      const { data: objectsData } = await supabase
        .from('room_objects')
        .select(`
          is_hidden,
          object:objects(id, name, type, description)
        `)
        .eq('room_id', id);

      setObjects(objectsData || []);

      // 3. Получаем события, происходившие в комнате
      const { data: eventsData } = await supabase
        .from('events')
        .select('id, name, day, importance')
        .eq('location_id', id)
        .order('day', { ascending: true });

      setEvents(eventsData || []);

      setLoading(false);
    }

    loadRoom();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-white">Загрузка комнаты...</div>;
  }

  if (!room) {
    return <div className="p-8 text-center text-white">Комната не найдена</div>;
  }

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tomb-panel p-6 mb-6"
        >
          <div className="flex items-center gap-2 text-tomb-gold text-sm font-mono mb-2">
            <MapPin size={14} />
            {room.location?.name || 'Unknown Location'}
          </div>
          <h1 className="font-display text-3xl text-tomb-ivory mb-4">
            {room.name}
          </h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <span className="px-2 py-1 bg-tomb-bronze/20 text-tomb-bone/70 text-xs font-mono rounded">
              {room.room_type}
            </span>
            <span className="px-2 py-1 bg-tomb-bronze/20 text-tomb-bone/70 text-xs font-mono rounded">
              {language === 'en' ? `Floor ${room.floor_level}` : `Этаж ${room.floor_level}`}
            </span>
            {room.access_level !== 'open' && (
              <span className="px-2 py-1 bg-red-900/30 text-red-300 text-xs font-mono rounded">
                {room.access_level}
              </span>
            )}
          </div>
          {room.atmosphere && (
            <p className="ancient-text text-tomb-bone/80 leading-relaxed italic">
              {room.atmosphere}
            </p>
          )}
        </motion.div>

        {/* Предметы в комнате */}
        {objects.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mb-6"
          >
            <h2 className="font-display text-2xl text-tomb-ivory mb-4 flex items-center gap-2">
              <Package size={20} className="text-tomb-gold" />
              {language === 'en' ? 'Objects' : 'Предметы'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {objects.map((item: any) => (
                <Link
                  key={item.object.id}
                  to={`/object/${item.object.id}`}
                  className="tomb-panel p-4 hover:border-tomb-bronze/50 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-display text-lg text-tomb-ivory mb-1">
                        {item.object.name}
                      </h3>
                      <span className="px-2 py-0.5 bg-tomb-bronze/20 text-tomb-bone/70 text-xs font-mono rounded">
                        {item.object.type}
                      </span>
                    </div>
                    {item.is_hidden && (
                      <span className="text-xs text-tomb-blood font-mono">
                        hidden
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        {/* События в комнате */}
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
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-tomb-gold">
                      {language === 'en' ? `Day ${event.day}` : `День ${event.day}`}
                    </span>
                  </div>
                  <h3 className="font-display text-lg text-tomb-ivory">
                    {event.name}
                  </h3>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};