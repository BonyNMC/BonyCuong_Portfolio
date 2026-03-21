import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { motion } from 'framer-motion';
import { Facebook, Linkedin, Music, Mail } from 'lucide-react';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
};

const MainLayout = ({ children, config }) => (
  <motion.div 
    variants={pageVariants}
    initial="initial"
    animate="animate"
    exit="exit"
    className="min-h-screen bg-earth-50 text-earth-900 flex flex-col"
  >
    <header className="p-6 bg-earth-400 text-white flex justify-between items-center shadow-lg">
      <Link to="/" className="text-2xl font-bold uppercase tracking-wider font-headings">Nguyễn Mạnh Cường</Link>
      <nav className="flex gap-6">
        <Link to="/" className="hover:text-fire-200 transition-colors uppercase font-bold text-sm">Home</Link>
        <a href="#about" className="hover:text-fire-200 transition-colors uppercase font-bold text-sm">About</a>
        <a href="#projects" className="hover:text-fire-200 transition-colors uppercase font-bold text-sm">Projects</a>
        <a href="#blog" className="hover:text-fire-200 transition-colors uppercase font-bold text-sm">Blog</a>
      </nav>
    </header>
    
    <main className="flex-1 max-w-7xl mx-auto w-full p-8 space-y-24">
      {children}
    </main>

    <footer className="bg-earth-900 text-earth-200 p-12 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <p className="uppercase tracking-widest text-xs font-bold">&copy; {new Date().getFullYear()} Nguyễn Mạnh Cường. All rights reserved.</p>
        
        {/* Social Links in Footer */}
        {config && (
          <div className="flex gap-6">
            {config.facebook_url && (
              <a href={config.facebook_url} target="_blank" rel="noreferrer" className="hover:text-fire-400 transition-colors">
                <Facebook size={20} />
              </a>
            )}
            {config.linkedin_url && (
              <a href={config.linkedin_url} target="_blank" rel="noreferrer" className="hover:text-fire-400 transition-colors">
                <Linkedin size={20} />
              </a>
            )}
            {config.spotify_url && (
              <a href={config.spotify_url} target="_blank" rel="noreferrer" className="hover:text-fire-400 transition-colors">
                <Music size={20} />
              </a>
            )}
            {config.contact_email && (
              <a href={`mailto:${config.contact_email}`} className="hover:text-fire-400 transition-colors">
                <Mail size={20} />
              </a>
            )}
          </div>
        )}
      </div>
    </footer>
  </motion.div>
);

const ProjectsSection = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('projects').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setProjects(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="projects" className="py-24 border-t-4 border-earth-400">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-earth-900 font-headings uppercase border-b-4 border-earth-200 pb-2 inline-block">Projects</h3>
      </div>
      
      {loading ? (
        <p className="text-center text-earth-700 font-bold uppercase tracking-widest">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-center text-earth-700 font-bold uppercase tracking-widest">No projects found.</p>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map(project => (
            <Link key={project.id} to={`/project/${project.id}`} className="group bg-white border-2 border-earth-200 shadow-xl transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col">
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-48 object-cover border-b-2 border-earth-200" />
              ) : (
                <div className="w-full h-48 bg-earth-200 flex items-center justify-center text-earth-700 uppercase font-bold text-sm tracking-widest">
                  No Image
                </div>
              )}
              <div className="p-6 flex-1 flex flex-col">
                <h4 className="text-xl font-bold text-earth-900 mb-2 font-headings uppercase group-hover:text-earth-600 transition-colors">{project.title}</h4>
                <p className="text-earth-700 text-sm mb-4 line-clamp-3 flex-1">{project.description}</p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tech_tags?.map(tag => (
                    <span key={tag} className="bg-earth-100 text-earth-800 text-xs font-bold px-2 py-1 uppercase border border-earth-300">{tag}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
};

const BlogSection = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from('blog_posts').select('*').order('created_at', { ascending: false })
      .then(({ data, error }) => {
        if (!error) setPosts(data || []);
        setLoading(false);
      });
  }, []);

  return (
    <section id="blog" className="py-24 border-t-4 border-fire-500">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-earth-900 font-headings uppercase border-b-4 border-fire-200 pb-2 inline-block">Latest Articles</h3>
      </div>
      
      {loading ? (
        <p className="text-center text-earth-700 font-bold uppercase tracking-widest">Loading articles...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-earth-700 font-bold uppercase tracking-widest">No articles found.</p>
      ) : (
        <div className="space-y-8 max-w-4xl mx-auto">
          {posts.map(post => (
            <article key={post.id} className="bg-white p-8 border-l-8 border-fire-500 shadow-md hover:shadow-xl transition-shadow">
              <h4 className="text-2xl font-bold text-earth-900 mb-2 font-headings hover:text-fire-600 transition-colors">
                <Link to={`/blog/${post.id}`}>{post.title}</Link>
              </h4>
              <p className="text-sm text-fire-600 font-bold mb-4 uppercase tracking-wider">
                {new Date(post.created_at).toLocaleDateString('vi-VN')}
              </p>
              <p className="text-earth-800 leading-relaxed mb-6">{post.excerpt}</p>
              <Link to={`/blog/${post.id}`} className="inline-block bg-fire-50 text-fire-700 font-bold uppercase text-xs px-4 py-2 hover:bg-fire-100 transition-colors border border-fire-200">
                Read Article &rarr;
              </Link>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};

const DEFAULT_CONFIG = {
  hero_title: 'Building Strong Foundations on the Web',
  hero_subtitle: 'I am an expert Full-stack Developer specializing in high-performance web applications with React. Creating structured, modern digital experiences.',
  about_text: "I combine Earth's stability with Fire's passion to engineer robust software solutions. My focus is on structured layouts, elegant code, and optimal performance.",
  profile_photo_url: null,
  contact_email: null,
  facebook_url: null,
  linkedin_url: null,
  spotify_url: null,
};

export default function Home() {
  const [config, setConfig] = useState(DEFAULT_CONFIG);
  const [configLoading, setConfigLoading] = useState(true);

  useEffect(() => {
    supabase.from('site_config').select('*').limit(1).single()
      .then(({ data, error }) => {
        if (!error && data) setConfig(data);
        setConfigLoading(false);
      });
  }, []);

  const TECH_STACK = ['React', 'Tailwind CSS', 'Supabase', 'Node.js', 'Vite'];

  return (
    <MainLayout config={config}>
      {/* Hero Section */}
      <section className="text-center py-24 mb-12 border-b-4 border-earth-400">
        <h1 className="text-5xl md:text-6xl font-extrabold text-earth-800 mb-6 font-headings transition-all uppercase leading-tight">
          {configLoading ? (
            <span className="inline-block w-96 h-12 bg-earth-200 animate-pulse" />
          ) : (
            config.hero_title
          )}
        </h1>
        <p className="text-xl text-earth-700 max-w-2xl mx-auto mb-10 leading-relaxed">
          {configLoading ? (
            <span className="inline-block w-64 h-6 bg-earth-200 animate-pulse" />
          ) : (
            config.hero_subtitle
          )}
        </p>

        <div className="flex flex-col items-center gap-6">
          <a
            href={config.contact_email ? `mailto:${config.contact_email}` : '#'}
            className="inline-block bg-earth-400 hover:bg-earth-500 text-white font-bold py-4 px-10 transition-all transform hover:scale-105 uppercase tracking-widest shadow-xl"
          >
            Get In Touch
          </a>
          
          {/* Social Links Hero */}
          <div className="flex gap-4 mt-4">
            {config.facebook_url && (
              <a href={config.facebook_url} target="_blank" rel="noreferrer" className="bg-earth-200 text-earth-800 p-3 hover:bg-earth-300 transition-colors">
                <Facebook size={24} />
              </a>
            )}
            {config.linkedin_url && (
              <a href={config.linkedin_url} target="_blank" rel="noreferrer" className="bg-earth-200 text-earth-800 p-3 hover:bg-earth-300 transition-colors">
                <Linkedin size={24} />
              </a>
            )}
            {config.spotify_url && (
              <a href={config.spotify_url} target="_blank" rel="noreferrer" className="bg-earth-200 text-earth-800 p-3 hover:bg-earth-300 transition-colors">
                <Music size={24} />
              </a>
            )}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="shadow-2xl relative overflow-hidden aspect-square bg-earth-200">
          {config.profile_photo_url ? (
            <img
              src={config.profile_photo_url}
              alt="Nguyễn Mạnh Cường"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-earth-700">
              <div className="absolute inset-4 border-2 border-earth-400 flex items-center justify-center font-bold uppercase tracking-widest text-sm">
                Awaiting Photo Upload
              </div>
            </div>
          )}
          {/* Decorative border overlay */}
          <div className="absolute inset-0 border-4 border-transparent hover:border-earth-400 transition-colors pointer-events-none" />
        </div>

        <div>
          <h3 className="text-3xl font-bold mb-6 text-earth-900 font-headings border-l-8 border-earth-400 pl-4 uppercase">
            About Me
          </h3>
          <p className="text-earth-800 leading-relaxed mb-8 text-lg whitespace-pre-wrap">
            {configLoading ? (
              <span className="inline-block w-full h-24 bg-earth-200 animate-pulse" />
            ) : (
              config.about_text
            )}
          </p>
          <div className="flex flex-wrap gap-3">
            {TECH_STACK.map((tech) => (
              <span key={tech} className="bg-fire-500 text-white px-4 py-2 font-bold text-sm uppercase shadow-md">
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      <ProjectsSection />
      <BlogSection />
    </MainLayout>
  );
}
