import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useApp } from '@/context/AppContext';
import { supabase } from '@/lib/supabase';
import { FileText, User, MapPin } from 'lucide-react';

export const DocumentView: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { language } = useApp();

  const [document, setDocument] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDocument() {
      if (!id) return;

      // Получаем документ + автора + комнату
      const { data, error } = await supabase
        .from('documents')
        .select(`
          *,
          author:characters(name, id),
          room:rooms(name, id)
        `)
        .eq('id', id)
        .single();

      if (error) {
        console.error('Ошибка загрузки документа:', error);
      } else {
        setDocument(data);
      }

      setLoading(false);
    }

    loadDocument();
  }, [id]);

  if (loading) {
    return <div className="p-8 text-center text-white">Загрузка документа...</div>;
  }

  if (!document) {
    return <div className="p-8 text-center text-white">Документ не найден</div>;
  }

  return (
    <div className="min-h-screen pt-16 pb-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="tomb-panel p-8"
        >
          <div className="flex items-center gap-2 text-tomb-gold text-sm font-mono mb-4">
            <FileText size={14} />
            {language === 'en' ? 'Document' : 'Документ'}
          </div>

          <h1 className="font-display text-3xl text-tomb-ivory mb-6">
            {document.title}
          </h1>

          <div className="flex flex-wrap gap-4 mb-6 text-sm font-mono text-tomb-bone/60">
            {document.author && (
              <Link
                to={`/character/${document.author.id}`}
                className="flex items-center gap-1 hover:text-tomb-gold transition-colors"
              >
                <User size={14} />
                {document.author.name}
              </Link>
            )}
            {document.room && (
              <Link
                to={`/room/${document.room.id}`}
                className="flex items-center gap-1 hover:text-tomb-gold transition-colors"
              >
                <MapPin size={14} />
                {document.room.name}
              </Link>
            )}
            {document.language && (
              <span className="px-2 py-0.5 bg-tomb-bronze/20 text-tomb-bone/70 text-xs rounded">
                {document.language}
              </span>
            )}
          </div>

          <div className="border-t border-tomb-bronze/20 pt-6">
            <div className="ancient-text text-tomb-bone/90 leading-relaxed whitespace-pre-wrap">
              {document.content}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};