import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { SkullIcon } from './ui/SkullIcon';
import charactersData from '@/data/characters.json';
import type { Character } from '@/types';
import { cn } from '@/utils/cn';
import { Search, Filter, Heart, Skull, Sword } from 'lucide-react';

export const CharacterList: React.FC = () => {
  const { language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterHouse, setFilterHouse] = useState<number | null>(null);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [showDead, setShowDead] = useState(true);

  const characters = charactersData as Character[];

  const filteredCharacters = characters.filter(char => {
    const matchesSearch = searchQuery === '' || 
      char.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.nameRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      char.house.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesHouse = filterHouse === null || char.houseNumber === filterHouse;
    const matchesRole = filterRole === 'all' || 
      (filterRole === 'necromancer' && char.isNecromancer) ||
      (filterRole === 'cavalier' && char.isCavalier);
    const matchesDead = showDead || char.isAlive;

    return matchesSearch && matchesHouse && matchesRole && matchesDead;
  });

  const houses = Array.from(new Set(characters.map(c => c.houseNumber))).sort();

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h2 className="font-display text-3xl md:text-4xl text-tomb-gold mb-2">
            {language === 'en' ? 'The Inhabitants' : 'Обитатели'}
          </h2>
          <p className="font-body text-tomb-bone/70 italic">
            {language === 'en' 
              ? 'Heirs and cavaliers of the Nine Houses' 
              : 'Наследники и кавалеры Девяти Домов'}
          </p>
        </motion.div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Search */}
          <div className="relative max-w-md mx-auto">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tomb-bone/40" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search characters...' : 'Поиск персонажей...'}
              className="w-full pl-10 pr-4 py-2 bg-tomb-dark border border-tomb-bronze/30 rounded-sm text-tomb-ivory placeholder:text-tomb-bone/30 focus:border-tomb-gold/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setFilterHouse(null)}
              className={cn(
                "px-3 py-1.5 rounded-sm font-mono text-xs transition-all",
                filterHouse === null 
                  ? "bg-tomb-gold/20 text-tomb-gold border border-tomb-gold/40" 
                  : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
              )}
            >
              {language === 'en' ? 'All Houses' : 'Все Дома'}
            </button>
            {houses.map(house => (
              <button
                key={house}
                onClick={() => setFilterHouse(filterHouse === house ? null : house)}
                className={cn(
                  "px-3 py-1.5 rounded-sm font-mono text-xs transition-all flex items-center gap-1.5",
                  filterHouse === house 
                    ? "bg-tomb-gold/20 text-tomb-gold border border-tomb-gold/40" 
                    : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
                )}
              >
                <SkullIcon size={14} house={house} />
                {language === 'en' ? `House ${house}` : `Дом ${house}`}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { key: 'all', label: 'All', labelRu: 'Все', icon: Filter },
              { key: 'necromancer', label: 'Necromancers', labelRu: 'Некроманты', icon: Heart },
              { key: 'cavalier', label: 'Cavaliers', labelRu: 'Кавалеры', icon: Sword },
            ].map(({ key, label, labelRu, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setFilterRole(key)}
                className={cn(
                  "px-3 py-1.5 rounded-sm font-mono text-xs transition-all flex items-center gap-1.5",
                  filterRole === key 
                    ? "bg-tomb-gold/20 text-tomb-gold border border-tomb-gold/40" 
                    : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
                )}
              >
                <Icon size={12} />
                {language === 'en' ? label : labelRu}
              </button>
            ))}
            <button
              onClick={() => setShowDead(!showDead)}
              className={cn(
                "px-3 py-1.5 rounded-sm font-mono text-xs transition-all flex items-center gap-1.5",
                showDead 
                  ? "bg-tomb-blood/20 text-tomb-bone/70 border border-tomb-blood/40" 
                  : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
              )}
            >
              <Skull size={12} />
              {language === 'en' ? 'Show Dead' : 'Показывать мёртвых'}
            </button>
          </div>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCharacters.map((char, index) => (
              <motion.div
                key={char.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/character/${char.id}`}
                  className={cn(
                    "block character-card h-full",
                    !char.isAlive && "opacity-60"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-16 h-16 rounded-sm flex items-center justify-center text-2xl font-display flex-shrink-0"
                      style={{ 
                        backgroundColor: char.houseNumber === 9 ? '#2a2a38' : 
                          char.houseNumber === 3 ? 'rgba(255, 215, 0, 0.2)' : 
                          char.houseNumber === 6 ? 'rgba(65, 105, 225, 0.2)' : 
                          'rgba(139, 115, 85, 0.2)' 
                      }}
                    >
                      {char.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-display text-lg text-tomb-ivory truncate">
                        {language === 'en' ? char.name : char.nameRu}
                      </h3>
                      <p className="font-mono text-xs text-tomb-bone/50 mt-1">
                        {language === 'en' ? char.house : char.houseRu}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {char.isNecromancer && (
                          <span className="px-1.5 py-0.5 bg-tomb-blood/20 text-tomb-bone/70 text-[10px] font-mono rounded">
                            {language === 'en' ? 'NECROMANCER' : 'НЕКРОМАНТ'}
                          </span>
                        )}
                        {char.isCavalier && (
                          <span className="px-1.5 py-0.5 bg-tomb-green/20 text-tomb-bone/70 text-[10px] font-mono rounded">
                            {language === 'en' ? 'CAVALIER' : 'КАВАЛЕР'}
                          </span>
                        )}
                        {!char.isAlive && (
                          <span className="px-1.5 py-0.5 bg-tomb-dark text-tomb-bone/40 text-[10px] font-mono rounded flex items-center gap-1">
                            <Skull size={10} />
                            {language === 'en' ? 'DECEASED' : 'УМЕР'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <p className="ancient-text text-sm mt-3 line-clamp-2">
                    {language === 'en' ? char.description : char.descriptionRu}
                  </p>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredCharacters.length === 0 && (
          <div className="text-center py-12">
            <SkullIcon size={48} className="text-tomb-bone/20 mx-auto mb-4" />
            <p className="font-body text-tomb-bone/50">
              {language === 'en' ? 'No characters found' : 'Персонажи не найдены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
