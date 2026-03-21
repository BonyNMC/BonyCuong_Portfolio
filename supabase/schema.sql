-- Enable UUID extension (usually enabled by default in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Projects Table
CREATE TABLE public.projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  image_url text,
  tech_tags text[] DEFAULT '{}'::text[],
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Blog Posts Table
CREATE TABLE public.blog_posts (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  title text NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Row-Level Security Configuration

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies for Projects

-- Public: Can only SELECT
CREATE POLICY "Public profiles are viewable by everyone." 
ON public.projects FOR SELECT 
USING (true);

-- Authenticated Admin: Can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated users can insert projects." 
ON public.projects FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update projects." 
ON public.projects FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete projects." 
ON public.projects FOR DELETE 
TO authenticated 
USING (true);

-- Policies for Blog Posts

-- Public: Can only SELECT
CREATE POLICY "Public blog posts are viewable by everyone." 
ON public.blog_posts FOR SELECT 
USING (true);

-- Authenticated Admin: Can INSERT, UPDATE, DELETE
CREATE POLICY "Authenticated users can insert blog posts." 
ON public.blog_posts FOR INSERT 
TO authenticated 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update blog posts." 
ON public.blog_posts FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

CREATE POLICY "Authenticated users can delete blog posts." 
ON public.blog_posts FOR DELETE 
TO authenticated 
USING (true);


-- Storage setup (Assuming standard Supabase storage objects table configuration)
-- Creates the bucket 'project-images'
INSERT INTO storage.buckets (id, name, public) 
VALUES ('project-images', 'project-images', true) 
ON CONFLICT DO NOTHING;

-- Storage Policies for 'project-images'
-- Allow public to select files
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING (bucket_id = 'project-images');

-- Allow authenticated users to upload and manage files
CREATE POLICY "Authenticated Uploads" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'project-images');

CREATE POLICY "Authenticated Updates" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'project-images');

CREATE POLICY "Authenticated Deletes" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'project-images');
