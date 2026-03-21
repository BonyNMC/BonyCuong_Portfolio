import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
    } else {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-earth-900 flex items-center justify-center p-4">
      <form onSubmit={handleLogin} className="bg-earth-50 p-12 max-w-md w-full shadow-2xl rounded-none border-t-8 border-fire-500">
        <h2 className="text-3xl font-bold text-earth-900 mb-8 font-headings uppercase text-center border-b-2 border-earth-200 pb-4">Admin Access</h2>
        {error && <p className="text-fire-600 mb-4 font-bold text-sm uppercase text-center">{error}</p>}
        <input 
          type="email" 
          placeholder="Email" 
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full mb-6 p-4 bg-white border-2 border-earth-200 outline-none focus:border-earth-400 text-earth-900 rounded-none transition-colors" 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-8 p-4 bg-white border-2 border-earth-200 outline-none focus:border-earth-400 text-earth-900 rounded-none transition-colors" 
        />
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-earth-400 hover:bg-earth-500 text-white font-bold py-4 rounded-none transition-colors shadow-lg uppercase tracking-widest disabled:opacity-50 mt-4"
        >
          {loading ? 'Authenticating...' : 'Login'}
        </button>
      </form>
    </div>
  );
}
