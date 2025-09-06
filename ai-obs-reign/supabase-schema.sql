-- Media Library Database Schema for Supabase
-- Run this in your Supabase SQL editor

-- Enable Row Level Security
ALTER TABLE IF EXISTS media_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS media_folders ENABLE ROW LEVEL SECURITY;

-- Create media_folders table
CREATE TABLE IF NOT EXISTS media_folders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  parent_id UUID REFERENCES media_folders(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by TEXT DEFAULT 'anonymous',
  description TEXT DEFAULT ''
);

-- Create media_files table
CREATE TABLE IF NOT EXISTS media_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  original_name TEXT NOT NULL,
  url TEXT NOT NULL, -- base64 data URL
  thumbnail_url TEXT,
  type TEXT NOT NULL CHECK (type IN ('image', 'video', 'document', 'audio')),
  mime_type TEXT NOT NULL,
  size BIGINT NOT NULL,
  width INTEGER,
  height INTEGER,
  duration INTEGER, -- for video/audio in seconds
  alt TEXT DEFAULT '',
  caption TEXT DEFAULT '',
  tags TEXT[] DEFAULT '{}',
  folder TEXT DEFAULT 'uploads',
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by TEXT DEFAULT 'anonymous',
  is_public BOOLEAN DEFAULT true,
  metadata JSONB DEFAULT '{}'
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_media_files_folder ON media_files(folder);
CREATE INDEX IF NOT EXISTS idx_media_files_type ON media_files(type);
CREATE INDEX IF NOT EXISTS idx_media_files_uploaded_at ON media_files(uploaded_at DESC);
CREATE INDEX IF NOT EXISTS idx_media_files_tags ON media_files USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_media_folders_parent_id ON media_folders(parent_id);

-- Row Level Security Policies
-- Allow public read access to public files
CREATE POLICY "Public files are viewable by everyone" ON media_files
  FOR SELECT USING (is_public = true);

-- Allow authenticated users to insert files
CREATE POLICY "Authenticated users can upload files" ON media_files
  FOR INSERT WITH CHECK (true);

-- Allow users to update their own files
CREATE POLICY "Users can update their own files" ON media_files
  FOR UPDATE USING (uploaded_by = auth.uid()::text OR uploaded_by = 'anonymous');

-- Allow users to delete their own files
CREATE POLICY "Users can delete their own files" ON media_files
  FOR DELETE USING (uploaded_by = auth.uid()::text OR uploaded_by = 'anonymous');

-- Folder policies
CREATE POLICY "Folders are viewable by everyone" ON media_folders
  FOR SELECT USING (true);

CREATE POLICY "Authenticated users can create folders" ON media_folders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update their own folders" ON media_folders
  FOR UPDATE USING (created_by = auth.uid()::text OR created_by = 'anonymous');

CREATE POLICY "Users can delete their own folders" ON media_folders
  FOR DELETE USING (created_by = auth.uid()::text OR created_by = 'anonymous');

-- Create a function to get storage stats
CREATE OR REPLACE FUNCTION get_media_stats()
RETURNS TABLE (
  total_files BIGINT,
  total_size BIGINT,
  files_by_type JSONB,
  recent_uploads JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*) as total_files,
    COALESCE(SUM(size), 0) as total_size,
    jsonb_object_agg(type, type_count) as files_by_type,
    jsonb_agg(
      jsonb_build_object(
        'id', id,
        'name', name,
        'type', type,
        'uploaded_at', uploaded_at
      ) ORDER BY uploaded_at DESC LIMIT 10
    ) as recent_uploads
  FROM (
    SELECT 
      type,
      COUNT(*) as type_count,
      id,
      name,
      uploaded_at
    FROM media_files
    GROUP BY type, id, name, uploaded_at
  ) t;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
