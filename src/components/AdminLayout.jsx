import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const navItems = [
    { to: '/admin/config', label: 'General Settings', border: 'border-fire-400' },
    { to: '/admin',        label: 'Projects',          border: 'border-earth-400' },
    { to: '/admin/blog',   label: 'Blog Posts',        border: 'border-fire-500' },
  ];

  return (
    <div className="min-h-screen bg-earth-50 flex flex-col md:flex-row">
      <aside className="w-full md:w-64 bg-earth-900 text-earth-100 flex flex-col p-6 shrink-0">
        <h2 className="text-xl font-bold uppercase font-headings text-white mb-1">Admin Panel</h2>
        <p className="text-earth-400 text-xs uppercase tracking-widest border-b border-earth-700 pb-4 mb-6">Nguyễn Mạnh Cường</p>
        <nav className="space-y-1 flex-1">
          {navItems.map(({ to, label, border }) => {
            const active = to === '/admin'
              ? location.pathname === '/admin'
              : location.pathname.startsWith(to);
            return (
              <Link
                key={to}
                to={to}
                className={`block font-bold uppercase p-3 transition-colors text-sm tracking-wide ${
                  active
                    ? `bg-earth-700 text-white border-l-4 ${border}`
                    : 'text-earth-300 hover:bg-earth-800 hover:text-white'
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
        <a href="/" target="_blank" rel="noopener noreferrer"
          className="mt-4 block text-center bg-earth-700 hover:bg-earth-600 text-white font-bold py-2 uppercase tracking-widest transition-colors text-xs">
          View Site ↗
        </a>
        <button onClick={handleLogout}
          className="mt-2 w-full bg-fire-700 hover:bg-fire-600 text-white font-bold py-3 uppercase tracking-widest transition-colors shadow-lg">
          Logout
        </button>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
