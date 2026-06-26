import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import codexData from '@/data/codex.json';
import type { CodexEntry } from '@/types';
import { cn } from '@/utils/cn';
import { BookOpen, ChevronRight, ChevronDown, Search } from 'lucide-react';

export const Codex: React.FC = () => {
  const { language } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const entries = codexData as CodexEntry[];

  const categories = Array.from(new Set(entries.map(e => language === 'en' ? e.category : e.categoryRu)));

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = searchQuery === '' || 
      entry.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.titleRu.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.contentRu.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategory === null || 
      (language === 'en' ? entry.category : entry.categoryRu) === selectedCategory;

    return matchesSearch && matchesCategory;
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
            {language === 'en' ? 'The Codex' : 'Кодекс'}
          </h2>
          <p className="font-body text-tomb-bone/70 italic">
            {language === 'en' 
              ? 'Knowledge of the Nine Houses and the Empire' 
              : 'Знания Девяти Домов и Империи'}
          </p>
        </motion.div>

        {/* Search */}
        <div className="relative max-w-md mx-auto mb-6">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-tomb-bone/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'en' ? 'Search the codex...' : 'Поиск в кодексе...'}
            className="w-full pl-10 pr-4 py-2 bg-tomb-dark border border-tomb-bronze/30 rounded-sm text-tomb-ivory placeholder:text-tomb-bone/30 focus:border-tomb-gold/50 focus:outline-none transition-colors"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "px-3 py-1.5 rounded-sm font-mono text-xs transition-all",
              selectedCategory === null 
                ? "bg-tomb-gold/20 text-tomb-gold border border-tomb-gold/40" 
                : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
            )}
          >
            {language === 'en' ? 'All' : 'Всё'}
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
              className={cn(
                "px-3 py-1.5 rounded-sm font-mono text-xs transition-all",
                selectedCategory === cat 
                  ? "bg-tomb-gold/20 text-tomb-gold border border-tomb-gold/40" 
                  : "bg-tomb-dark text-tomb-bone/60 border border-tomb-bronze/20 hover:border-tomb-bronze/40"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Entries */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredEntries.map((entry, index) => {
              const isExpanded = expandedEntry === entry.id;

              return (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ delay: index * 0.03 }}
                >
                  <div 
                    onClick={() => setExpandedEntry(isExpanded ? null : entry.id)}
                    className={cn(
                      "codex-entry cursor-pointer",
                      isExpanded && "border-tomb-gold/50 bg-tomb-grey/70"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <BookOpen size={14} className="text-tomb-bronze" />
                          <span className="font-mono text-[10px] text-tomb-bone/40 uppercase tracking-wider">
                            {language === 'en' ? entry.category : entry.categoryRu}
                          </span>
                        </div>
                        <h3 className="font-display text-lg text-tomb-ivory">
                          {language === 'en' ? entry.title : entry.titleRu}
                        </h3>
                      </div>
                      {isExpanded ? <ChevronDown size={18} className="text-tomb-bone/40 mt-1" /> : <ChevronRight size={18} className="text-tomb-bone/40 mt-1" />}
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
                            <p className="ancient-text leading-relaxed">
                              {language === 'en' ? entry.content : entry.contentRu}
                            </p>

                            {entry.relatedEntries.length > 0 && (
                              <div className="mt-4">
                                <p className="font-mono text-[10px] text-tomb-bone/40 mb-2">
                                  {language === 'en' ? 'Related Entries:' : 'Связанные записи:'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                  {entry.relatedEntries.map(relatedId => {
                                    const related = entries.find(e => e.id === relatedId);
                                    if (!related) return null;
                                    return (
                                      <button
                                        key={relatedId}
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setExpandedEntry(relatedId);
                                        }}
                                        className="px-2 py-1 bg-tomb-dark text-tomb-bone/60 text-xs font-mono rounded-sm hover:text-tomb-gold hover:bg-tomb-bronze/10 transition-all"
                                      >
                                        {language === 'en' ? related.title : related.titleRu}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {filteredEntries.length === 0 && (
          <div className="text-center py-12">
            <BookOpen size={48} className="text-tomb-bone/20 mx-auto mb-4" />
            <p className="font-body text-tomb-bone/50">
              {language === 'en' ? 'No entries found' : 'Записи не найдены'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
