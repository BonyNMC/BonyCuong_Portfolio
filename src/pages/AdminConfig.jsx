import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabaseClient';

export default function AdminConfig() {
  const [config, setConfig] = useState({
    id: null,
    hero_title: '',
    hero_subtitle: '',
    about_text: '',
    profile_photo_url: '',
    contact_email: '',
    facebook_url: '',
    linkedin_url: '',
    spotify_url: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);

  useEffect(() => {
    supabase.from('site_config').select('*').limit(1).single()
      .then(({ data, error }) => {
        if (!error && data) {
          setConfig({
            id: data.id,
            hero_title: data.hero_title || '',
            hero_subtitle: data.hero_subtitle || '',
            about_text: data.about_text || '',
            profile_photo_url: data.profile_photo_url || '',
            contact_email: data.contact_email || '',
            facebook_url: data.facebook_url || '',
            linkedin_url: data.linkedin_url || '',
            spotify_url: data.spotify_url || '',
          });
        }
        setLoading(false);
      });
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    let photoUrl = config.profile_photo_url;

    // Upload new profile photo if selected
    if (photoFile) {
      const fileExt = photoFile.name.split('.').pop();
      const fileName = `profile-photo.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('project-images')
        .upload(fileName, photoFile, { upsert: true });

      if (uploadError) {
        setMessage({ type: 'error', text: `Photo upload failed: ${uploadError.message}` });
        setSaving(false);
        return;
      }
      const { data: urlData } = supabase.storage.from('project-images').getPublicUrl(fileName);
      photoUrl = urlData.publicUrl;
    }

    const { error } = await supabase
      .from('site_config')
      .update({
        hero_title: config.hero_title,
        hero_subtitle: config.hero_subtitle,
        about_text: config.about_text,
        profile_photo_url: photoUrl,
        contact_email: config.contact_email,
        facebook_url: config.facebook_url,
        linkedin_url: config.linkedin_url,
        spotify_url: config.spotify_url,
      })
      .eq('id', config.id);

    if (error) {
      setMessage({ type: 'error', text: error.message });
    } else {
      setConfig(prev => ({ ...prev, profile_photo_url: photoUrl }));
      setPhotoFile(null);
      setMessage({ type: 'success', text: '✓ Lưu thành công! Changes are now live on the site.' });
    }
    setSaving(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <p className="text-earth-700 font-bold uppercase tracking-widest animate-pulse">Loading configuration...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <h3 className="text-3xl font-bold text-earth-900 mb-8 border-b-2 border-earth-200 pb-2 inline-block font-headings uppercase">
        General Settings
      </h3>

      <form onSubmit={handleSave} className="space-y-8 max-w-3xl">

        {/* Hero Section */}
        <div className="bg-white p-6 shadow-md border-t-4 border-earth-400">
          <h4 className="font-bold text-lg uppercase mb-5 text-earth-800 border-b border-earth-100 pb-3">
            Hero Section
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-earth-600 mb-1 tracking-wider">Hero Title</label>
              <input
                type="text"
                value={config.hero_title}
                onChange={(e) => setConfig({ ...config, hero_title: e.target.value })}
                className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-earth-600 mb-1 tracking-wider">Hero Subtitle</label>
              <textarea
                rows={3}
                value={config.hero_subtitle}
                onChange={(e) => setConfig({ ...config, hero_subtitle: e.target.value })}
                className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* About Me Section */}
        <div className="bg-white p-6 shadow-md border-t-4 border-fire-500">
          <h4 className="font-bold text-lg uppercase mb-5 text-earth-800 border-b border-earth-100 pb-3">
            About Me Section
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-earth-600 mb-1 tracking-wider">Profile Photo</label>
              {config.profile_photo_url && (
                <img
                  src={config.profile_photo_url}
                  alt="Current profile"
                  className="w-32 h-32 object-cover border-4 border-earth-400 mb-3 shadow-md"
                />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setPhotoFile(e.target.files[0])}
                className="w-full p-3 border-2 border-earth-200 text-sm"
              />
              <p className="text-xs text-earth-500 mt-1 mb-2">Or paste a direct image URL:</p>
              <input
                type="url"
                placeholder="https://..."
                value={config.profile_photo_url}
                onChange={(e) => setConfig({ ...config, profile_photo_url: e.target.value })}
                className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-earth-600 mb-1 tracking-wider">About Me Text</label>
              <textarea
                rows={5}
                value={config.about_text}
                onChange={(e) => setConfig({ ...config, about_text: e.target.value })}
                className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="bg-white p-6 shadow-md border-t-4 border-earth-700">
          <h4 className="font-bold text-lg uppercase mb-5 text-earth-800 border-b border-earth-100 pb-3">
            Contact Settings
          </h4>
          <label className="block text-xs font-bold uppercase text-earth-600 mb-1 tracking-wider">Contact Email</label>
          <input
            type="email"
            placeholder="your@email.com"
            value={config.contact_email}
            onChange={(e) => setConfig({ ...config, contact_email: e.target.value })}
            className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
          />
          
          <h4 className="font-bold text-lg uppercase mt-8 mb-5 text-earth-800 border-b border-earth-100 pb-3">
            Social Links
          </h4>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase text-earth-600 mb-1 tracking-wider">Facebook URL</label>
              <input
                type="url"
                placeholder="https://facebook.com/..."
                value={config.facebook_url}
                onChange={(e) => setConfig({ ...config, facebook_url: e.target.value })}
                className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-earth-600 mb-1 tracking-wider">LinkedIn URL</label>
              <input
                type="url"
                placeholder="https://linkedin.com/in/..."
                value={config.linkedin_url}
                onChange={(e) => setConfig({ ...config, linkedin_url: e.target.value })}
                className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase text-earth-600 mb-1 tracking-wider">Spotify URL</label>
              <input
                type="url"
                placeholder="https://open.spotify.com/..."
                value={config.spotify_url}
                onChange={(e) => setConfig({ ...config, spotify_url: e.target.value })}
                className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Feedback */}
        {message && (
          <p className={`font-bold text-sm p-4 ${
            message.type === 'success'
              ? 'bg-earth-100 text-earth-900 border-l-4 border-earth-400'
              : 'bg-fire-50 text-fire-800 border-l-4 border-fire-500'
          }`}>
            {message.text}
          </p>
        )}

        <button
          type="submit"
          disabled={saving}
          className="bg-earth-800 hover:bg-earth-900 text-white font-bold py-4 px-10 uppercase tracking-widest transition-colors shadow-lg disabled:opacity-50"
        >
          {saving ? 'Saving...' : 'Save All Changes'}
        </button>
      </form>
    </AdminLayout>
  );
}
