import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { useParallax } from '@/hooks/useParallax';
import roomsData from '@/data/rooms.json';
import type { Room } from '@/types';
import { cn } from '@/utils/cn';
import { Lock, Eye } from 'lucide-react';

export const MapView: React.FC = () => {
  const { timeOfDay, language, visitedRooms } = useApp();
  const { ref, offset } = useParallax(15);
  const rooms = roomsData as Room[];

  const getAtmosphereColor = (atmosphere: Room['atmosphere']) => {
    switch (atmosphere) {
      case 'bright': return timeOfDay === 'day' ? 'bg-tomb-sage/30' : 'bg-tomb-green/20';
      case 'dim': return 'bg-tomb-bronze/20';
      case 'dark': return 'bg-tomb-blood/20';
      case 'ominous': return 'bg-tomb-blood/30';
      default: return 'bg-tomb-bronze/20';
    }
  };

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl text-tomb-gold mb-2">
            {language === 'en' ? 'Canaan House' : 'Каанан-Хаус'}
          </h2>
          <p className="font-body text-tomb-bone/70 italic">
            {language === 'en' 
              ? 'Explore the ancient palace of the First House' 
              : 'Исследуйте древний дворец Первого Дома'}
          </p>
        </motion.div>

        <div 
          ref={ref}
          className="relative w-full aspect-[4/3] max-w-4xl mx-auto tomb-panel overflow-hidden"
        >
          {/* Background layers with parallax */}
          <div 
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage: `radial-gradient(circle at 30% 40%, rgba(74, 90, 72, 0.3) 0%, transparent 50%),
                               radial-gradient(circle at 70% 60%, rgba(139, 115, 85, 0.2) 0%, transparent 50%)`,
              transform: `translate(${offset.x * 0.5}px, ${offset.y * 0.5}px)`,
            }}
          />

          {/* Grid pattern */}
          <div 
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(rgba(139, 115, 85, 0.3) 1px, transparent 1px),
                linear-gradient(90deg, rgba(139, 115, 85, 0.3) 1px, transparent 1px)
              `,
              backgroundSize: '40px 40px',
            }}
          />

          {/* Room nodes */}
          {rooms.map((room, index) => {
            const isVisited = visitedRooms.includes(room.id);
            const isLocked = room.isLocked;

            return (
              <motion.div
                key={room.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="absolute"
                style={{
                  left: `${room.position.x}%`,
                  top: `${room.position.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
              >
                <Link
                  to={`/room/${room.id}`}
                  className={cn(
                    "group relative flex flex-col items-center",
                    isLocked && "pointer-events-none opacity-50"
                  )}
                >
                  {/* Room marker */}
                  <div className={cn(
                    "relative w-16 h-16 md:w-20 md:h-20 rounded-sm border-2 transition-all duration-500 flex items-center justify-center",
                    getAtmosphereColor(room.atmosphere),
                    isVisited 
                      ? "border-tomb-gold/60 group-hover:border-tomb-gold" 
                      : "border-tomb-bronze/40 group-hover:border-tomb-bronze",
                    !isLocked && "group-hover:scale-110 group-hover:shadow-lg",
                    timeOfDay === 'night' && "brightness-75"
                  )}>
                    {isLocked ? (
                      <Lock size={20} className="text-tomb-bone/40" />
                    ) : (
                      <>
                        <span className="font-display text-xs md:text-sm text-tomb-ivory text-center px-1">
                          {language === 'en' ? room.name : room.nameRu}
                        </span>
                        {isVisited && (
                          <Eye size={12} className="absolute top-1 right-1 text-tomb-gold" />
                        )}
                      </>
                    )}
                  </div>

                  {/* Floor indicator */}
                  <span className={cn(
                    "mt-1 font-mono text-[10px]",
                    room.floor < 0 ? "text-tomb-blood/60" : "text-tomb-bronze/60"
                  )}>
                    {room.floor === 0 ? 'G' : room.floor > 0 ? `F${room.floor}` : `B${Math.abs(room.floor)}`}
                  </span>
                </Link>
              </motion.div>
            );
          })}

          {/* Connection lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
            {rooms.map(room => 
              room.connections.map(connId => {
                const targetRoom = rooms.find(r => r.id === connId);
                if (!targetRoom || room.id > connId) return null;
                return (
                  <line
                    key={`${room.id}-${connId}`}
                    x1={`${room.position.x}%`}
                    y1={`${room.position.y}%`}
                    x2={`${targetRoom.position.x}%`}
                    y2={`${targetRoom.position.y}%`}
                    stroke="rgba(139, 115, 85, 0.5)"
                    strokeWidth="1"
                    strokeDasharray="4 4"
                  />
                );
              })
            )}
          </svg>
        </div>

        {/* Legend */}
        <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs font-mono text-tomb-bone/50">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-tomb-sage/30 border border-tomb-bronze/40" /> Bright
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-tomb-bronze/20 border border-tomb-bronze/40" /> Dim
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-tomb-blood/20 border border-tomb-bronze/40" /> Dark
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 bg-tomb-blood/30 border border-tomb-bronze/40" /> Ominous
          </span>
        </div>
      </div>
    </div>
  );
};
