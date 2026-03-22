import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabaseClient';

export default function AdminBlog() {
  const [blogs, setBlogs] = useState([]);
  const [blogForm, setBlogForm] = useState({ title: '', excerpt: '', content: '', cover_image_url: '' });

  useEffect(() => { fetchBlogs(); }, []);

  const fetchBlogs = async () => {
    const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
    setBlogs(data || []);
  };

  const saveBlog = async (e) => {
    e.preventDefault();
    const { error } = await supabase.from('blog_posts').insert([{
      title: blogForm.title,
      excerpt: blogForm.excerpt,
      content: blogForm.content,
      cover_image_url: blogForm.cover_image_url || null,
    }]);
    if (error) alert(error.message);
    else { setBlogForm({ title: '', excerpt: '', content: '', cover_image_url: '' }); fetchBlogs(); }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm('Delete this article?')) return;
    await supabase.from('blog_posts').delete().eq('id', id);
    fetchBlogs();
  };

  return (
    <AdminLayout>
      <h3 className="text-3xl font-bold text-earth-900 mb-8 border-b-2 border-fire-200 pb-2 inline-block font-headings uppercase">
        Manage Blog Posts
      </h3>

      {/* Add Form */}
      <form onSubmit={saveBlog} className="bg-white p-6 shadow-md border-t-4 border-fire-500 mb-10 space-y-4">
        <h4 className="font-bold text-xl uppercase mb-2 text-earth-800">Add New Article</h4>
        <input
          type="text" placeholder="Title" required
          value={blogForm.title}
          onChange={e => setBlogForm({ ...blogForm, title: e.target.value })}
          className="w-full p-3 border-2 border-earth-200 focus:border-fire-400 outline-none"
        />
        <textarea
          placeholder="Excerpt (Short summary)" required rows={3}
          value={blogForm.excerpt}
          onChange={e => setBlogForm({ ...blogForm, excerpt: e.target.value })}
          className="w-full p-3 border-2 border-earth-200 focus:border-fire-400 outline-none"
        />

        {/* Cover Image URL */}
        <div className="space-y-2">
          <input
            type="url" placeholder="Ảnh bìa (Cover Image URL) — dán link ảnh vào đây"
            value={blogForm.cover_image_url}
            onChange={e => setBlogForm({ ...blogForm, cover_image_url: e.target.value })}
            className="w-full p-3 border-2 border-earth-200 focus:border-fire-400 outline-none"
          />
          {blogForm.cover_image_url && (
            <div className="border-2 border-earth-200 overflow-hidden w-full h-48">
              <img
                src={blogForm.cover_image_url}
                alt="Cover preview"
                className="w-full h-full object-cover"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}
        </div>

        <textarea
          placeholder="Full Content (Markdown supported)" required rows={8}
          value={blogForm.content}
          onChange={e => setBlogForm({ ...blogForm, content: e.target.value })}
          className="w-full p-3 border-2 border-earth-200 focus:border-fire-400 outline-none font-mono text-sm"
        />
        <button type="submit" className="bg-fire-600 hover:bg-fire-700 text-white font-bold py-3 px-8 uppercase tracking-widest transition-colors shadow-lg">
          Save Article
        </button>
      </form>

      {/* Blog List */}
      <div className="space-y-4">
        {blogs.length === 0 && <p className="text-earth-600 font-bold uppercase">No articles yet.</p>}
        {blogs.map(b => (
          <div key={b.id} className="bg-white p-4 border border-earth-200 shadow flex justify-between items-center hover:shadow-md transition-shadow gap-4">
            {/* Thumbnail */}
            {b.cover_image_url && (
              <div className="shrink-0 w-16 h-16 overflow-hidden border border-earth-200">
                <img src={b.cover_image_url} alt={b.title} className="w-full h-full object-cover" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h5 className="font-bold text-earth-900 uppercase truncate">{b.title}</h5>
              <p className="text-xs text-earth-500 font-bold uppercase tracking-wider mt-1">
                {new Date(b.created_at).toLocaleDateString('vi-VN')}
              </p>
            </div>
            <button onClick={() => deleteBlog(b.id)} className="ml-4 shrink-0 bg-fire-600 text-white px-4 py-2 text-sm font-bold uppercase hover:bg-fire-700">
              Delete
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
