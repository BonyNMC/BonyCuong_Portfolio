import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar } from 'lucide-react';

export default function BlogDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (!error && data) setPost(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <p className="text-earth-700 font-bold uppercase tracking-widest animate-pulse">Loading Article...</p>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center flex-col gap-4">
        <p className="text-earth-700 font-bold uppercase tracking-widest">Article Not Found</p>
        <Link to="/" className="text-fire-600 font-bold uppercase text-sm flex items-center gap-2 hover:text-fire-700">
          <ArrowLeft size={16} /> Back to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-earth-50 text-earth-900"
    >
      <header className="p-6 bg-earth-400 text-white shadow-lg">
        <div className="max-w-3xl mx-auto flex items-center">
          <Link to="/" className="text-white hover:text-earth-100 font-bold uppercase text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto p-8 py-16">
        <article className="bg-white p-8 md:p-12 border-l-8 border-fire-500 shadow-2xl">
          <header className="mb-10 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-earth-900 font-headings uppercase mb-6 leading-tight">
              {post.title?.normalize('NFC')}
            </h1>
            <div className="flex items-center justify-center gap-2 text-fire-600 font-bold uppercase tracking-widest text-sm">
              <Calendar size={18} />
              <time>{new Date(post.created_at).toLocaleDateString('vi-VN')}</time>
            </div>
          </header>

          {/* Cover Image */}
          {post.cover_image_url && (
            <div className="mb-10 -mx-8 md:-mx-12 overflow-hidden border-b-4 border-fire-500">
              <img
                src={post.cover_image_url}
                alt={post.title}
                className="w-full max-h-96 object-cover"
              />
            </div>
          )}

          <div className="prose prose-earth prose-lg max-w-none text-earth-800 leading-relaxed whitespace-pre-wrap">
            {post.content?.normalize('NFC')}
          </div>
        </article>
      </main>
    </motion.div>
  );
}
