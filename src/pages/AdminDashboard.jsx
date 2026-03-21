import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';
import { supabase } from '../supabaseClient';

export default function AdminDashboard() {
  const [projects, setProjects] = useState([]);
  const [projectForm, setProjectForm] = useState({ title: '', description: '', imageFile: null, techTags: '' });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    const { data } = await supabase.from('projects').select('*').order('created_at', { ascending: false });
    setProjects(data || []);
  };

  const saveProject = async (e) => {
    e.preventDefault();
    let imageUrl = null;
    if (projectForm.imageFile) {
      const fileExt = projectForm.imageFile.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from('project-images').upload(fileName, projectForm.imageFile);
      if (uploadError) { alert('Image upload failed: ' + uploadError.message); return; }
      const { data } = supabase.storage.from('project-images').getPublicUrl(fileName);
      imageUrl = data.publicUrl;
    }
    const tags = projectForm.techTags.split(',').map(t => t.trim()).filter(Boolean);
    const { error } = await supabase.from('projects').insert([{
      title: projectForm.title,
      description: projectForm.description,
      image_url: imageUrl,
      tech_tags: tags,
    }]);
    if (error) alert(error.message);
    else { setProjectForm({ title: '', description: '', imageFile: null, techTags: '' }); fetchProjects(); }
  };

  const deleteProject = async (id) => {
    if (!window.confirm('Delete this project?')) return;
    await supabase.from('projects').delete().eq('id', id);
    fetchProjects();
  };

  return (
    <AdminLayout>
      <h3 className="text-3xl font-bold text-earth-900 mb-8 border-b-2 border-earth-200 pb-2 inline-block font-headings uppercase">
        Manage Projects
      </h3>

      {/* Add Form */}
      <form onSubmit={saveProject} className="bg-white p-6 shadow-md border-t-4 border-earth-400 mb-10 space-y-4">
        <h4 className="font-bold text-xl uppercase mb-2 text-earth-800">Add New Project</h4>
        <input
          type="text" placeholder="Title" required
          value={projectForm.title}
          onChange={e => setProjectForm({ ...projectForm, title: e.target.value })}
          className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
        />
        <textarea
          placeholder="Description" required rows={3}
          value={projectForm.description}
          onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
          className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
        />
        <input
          type="text" placeholder="Tech Tags (comma separated, e.g., React, Supabase)"
          value={projectForm.techTags}
          onChange={e => setProjectForm({ ...projectForm, techTags: e.target.value })}
          className="w-full p-3 border-2 border-earth-200 focus:border-earth-400 outline-none"
        />
        <input
          type="file" accept="image/*"
          onChange={e => setProjectForm({ ...projectForm, imageFile: e.target.files[0] })}
          className="w-full p-3 border-2 border-earth-200"
        />
        <button type="submit" className="bg-earth-800 hover:bg-earth-900 text-white font-bold py-3 px-8 uppercase tracking-widest transition-colors shadow-lg">
          Save Project
        </button>
      </form>

      {/* Projects List */}
      <div className="space-y-4">
        {projects.length === 0 && <p className="text-earth-600 font-bold uppercase">No projects yet.</p>}
        {projects.map(p => (
          <div key={p.id} className="bg-white p-4 border border-earth-200 shadow flex justify-between items-center hover:shadow-md transition-shadow">
            <div className="flex gap-4 items-center min-w-0">
              {p.image_url && <img src={p.image_url} alt="" className="w-16 h-16 object-cover border border-earth-200 shrink-0" />}
              <div className="min-w-0">
                <h5 className="font-bold text-earth-900 uppercase truncate">{p.title}</h5>
                <p className="text-xs text-earth-500 font-bold uppercase tracking-wider mt-1">{p.tech_tags?.join(', ')}</p>
              </div>
            </div>
            <button onClick={() => deleteProject(p.id)} className="ml-4 shrink-0 bg-fire-600 text-white px-4 py-2 text-sm font-bold uppercase hover:bg-fire-700">
              Delete
            </button>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
