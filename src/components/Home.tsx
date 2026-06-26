import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '../context/AppContext';
import { Map, Users, Calendar, BookOpen, Search } from 'lucide-react';
import { SkullIcon } from './ui/SkullIcon';
import { cn } from '../utils/cn';

export const Home: React.FC = () => {
  const { language, timeOfDay } = useApp();

  const features = [
    {
      path: '/map',
      icon: Map,
      title: 'Interactive Map',
      titleRu: 'Интерактивная карта',
      description: 'Explore the rooms and corridors of Canaan House',
      descriptionRu: 'Исследуйте комнаты и коридоры Каанан-Хауса',
    },
    {
      path: '/characters',
      icon: Users,
      title: 'Characters',
      titleRu: 'Персонажи',
      description: 'Meet the heirs and cavaliers of the Nine Houses',
      descriptionRu: 'Познакомьтесь с наследниками и кавалерами Девяти Домов',
    },
    {
      path: '/timeline',
      icon: Calendar,
      title: 'Timeline',
      titleRu: 'Таймлайн',
      description: 'Follow the events as they unfold day by day',
      descriptionRu: 'Следите за событиями, разворачивающимися день за днём',
    },
    {
      path: '/codex',
      icon: BookOpen,
      title: 'Codex',
      titleRu: 'Кодекс',
      description: 'Learn about the world of the Locked Tomb',
      descriptionRu: 'Узнайте о мире Запертой Гробницы',
    },
    {
      path: '/search',
      icon: Search,
      title: 'Search',
      titleRu: 'Поиск',
      description: 'Find anything across the entire archive',
      descriptionRu: 'Найдите что угодно во всём архиве',
    },
  ];

  return (
    <div className="min-h-screen pt-16">
      <div className={cn(
        "relative h-[70vh] flex items-center justify-center overflow-hidden",
        timeOfDay === 'night' ? 'brightness-75' : ''
      )}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 50% 50%, rgba(168, 148, 106, 0.3) 0%, transparent 70%)`,
          }} />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center z-10 px-4"
        >
          <SkullIcon size={80} className="text-tomb-gold mx-auto mb-6" />
          <h1 className="font-display text-4xl md:text-6xl lg:text-7xl text-tomb-gold mb-4" style={{ textShadow: '0 0 30px rgba(168, 148, 106, 0.6)' }}>
            {language === 'en' ? 'Canaan House' : 'Каанан-Хаус'}
          </h1>
          <p className="font-body text-lg md:text-xl text-tomb-bone/70 max-w-2xl mx-auto mb-2">
            {language === 'en' 
              ? 'An interactive explorer for Gideon the Ninth' 
              : 'Интерактивный проводник по «Гидеон Девятый»'}
          </p>
          <p className="font-mono text-sm text-tomb-bronze/60">
            {language === 'en' 
              ? 'By Tamsyn Muir · The Locked Tomb Trilogy' 
              : 'Тамсин Мьюр · Трилогия Запертой Гробницы'}
          </p>
        </motion.div>

        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-tomb-black to-transparent" />
      </div>

      <div className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature, index) => (
            <motion.div
              key={feature.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Link
                to={feature.path}
                className="block bg-tomb-dark/90 backdrop-blur-sm border border-tomb-bronze/30 rounded-sm p-6 hover:border-tomb-gold/50 transition-all hover:-translate-y-1 h-full"
              >
                <feature.icon size={28} className="text-tomb-gold mb-4" />
                <h3 className="font-display text-xl text-tomb-ivory mb-2">
                  {language === 'en' ? feature.title : feature.titleRu}
                </h3>
                <p className="font-body text-tomb-bone/70 text-sm">
                  {language === 'en' ? feature.description : feature.descriptionRu}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <blockquote className="font-body text-xl md:text-2xl text-tomb-bone/60 italic leading-relaxed">
          "{language === 'en' 
            ? 'One flesh, one end.' 
            : 'Одна плоть, один конец.'}"
        </blockquote>
        <cite className="font-mono text-sm text-tomb-bronze/50 mt-4 block not-italic">
          — {language === 'en' ? 'Gideon Nav' : 'Гидеон Нав'}
        </cite>
      </div>
    </div>
  );
};