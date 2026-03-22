import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';

export default function ProjectDetail() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').eq('id', id).single()
      .then(({ data, error }) => {
        if (!error && data) setProject(data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center">
        <p className="text-earth-700 font-bold uppercase tracking-widest animate-pulse">Loading Project...</p>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-earth-50 flex items-center justify-center flex-col gap-4">
        <p className="text-earth-700 font-bold uppercase tracking-widest">Project Not Found</p>
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
        <div className="max-w-4xl mx-auto flex items-center">
          <Link to="/" className="text-white hover:text-earth-100 font-bold uppercase text-sm flex items-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-8 space-y-12 py-16">
        <div className="text-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-earth-900 font-headings uppercase mb-6">{project.title}</h1>
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {project.tech_tags?.map(tag => (
              <span key={tag} className="bg-earth-200 text-earth-800 text-xs font-bold px-3 py-1 uppercase border border-earth-300">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {project.image_url && (
          <div className="border-4 border-earth-400 p-2 shadow-xl bg-earth-100 flex justify-center">
            <img src={project.image_url} alt={project.title} className="max-w-full max-h-[600px] object-contain" />
          </div>
        )}

        <div className="bg-white p-8 md:p-12 border-t-8 border-earth-700 shadow-xl">
          <h2 className="text-2xl font-bold uppercase text-earth-800 mb-6 border-b-2 border-earth-100 pb-3">Project Overview</h2>
          <div className="prose prose-earth max-w-none text-earth-800 leading-relaxed whitespace-pre-wrap">
            {project.description}
          </div>
        </div>
      </main>
    </motion.div>
  );
}
