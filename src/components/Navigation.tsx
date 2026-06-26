import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Map, Users, Calendar, BookOpen, Search, Sun, Moon, Globe } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SkullIcon } from './ui/SkullIcon';
import { cn } from '@/utils/cn';

export const Navigation: React.FC = () => {
  const location = useLocation();
  const { timeOfDay, toggleTimeOfDay, language, toggleLanguage } = useApp();

  const navItems = [
    { path: '/', icon: Map, label: 'Map', labelRu: 'Карта' },
    { path: '/characters', icon: Users, label: 'Characters', labelRu: 'Персонажи' },
    { path: '/timeline', icon: Calendar, label: 'Timeline', labelRu: 'Таймлайн' },
    { path: '/codex', icon: BookOpen, label: 'Codex', labelRu: 'Кодекс' },
    { path: '/search', icon: Search, label: 'Search', labelRu: 'Поиск' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className={cn(
      "fixed top-0 left-0 right-0 z-50 h-16 border-b transition-colors duration-500",
      timeOfDay === 'night' 
        ? "bg-tomb-black/95 border-tomb-bronze/20" 
        : "bg-tomb-dark/95 border-tomb-bronze/30"
    )}>
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <SkullIcon 
            size={28} 
            className="text-tomb-gold transition-transform group-hover:scale-110" 
          />
          <div className="hidden sm:block">
            <h1 className="font-display text-tomb-gold text-sm tracking-widest">
              CANAAN HOUSE
            </h1>
            <p className="font-mono text-[10px] text-tomb-bronze tracking-wider">
              EXPLORER
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          {navItems.map(({ path, icon: Icon, label, labelRu }) => (
            <Link
              key={path}
              to={path}
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-sm transition-all duration-300",
                isActive(path)
                  ? "text-tomb-gold bg-tomb-bronze/20"
                  : "text-tomb-bone/60 hover:text-tomb-ivory hover:bg-tomb-bronze/10"
              )}
            >
              <Icon size={18} />
              <span className="hidden md:inline font-body text-sm">
                {language === 'en' ? label : labelRu}
              </span>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleLanguage}
            className="p-2 rounded-sm text-tomb-bone/60 hover:text-tomb-gold hover:bg-tomb-bronze/10 transition-all"
            title={language === 'en' ? 'Switch to Russian' : 'Switch to English'}
          >
            <Globe size={18} />
            <span className="ml-1 text-xs font-mono">{language.toUpperCase()}</span>
          </button>
          <button
            onClick={toggleTimeOfDay}
            className="p-2 rounded-sm text-tomb-bone/60 hover:text-tomb-gold hover:bg-tomb-bronze/10 transition-all"
            title={timeOfDay === 'day' ? 'Switch to Night' : 'Switch to Day'}
          >
            {timeOfDay === 'day' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </nav>
  );
};
