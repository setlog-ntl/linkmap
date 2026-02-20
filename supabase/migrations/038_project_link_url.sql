-- Add link_url column to projects table
ALTER TABLE projects ADD COLUMN IF NOT EXISTS link_url TEXT;

-- Add check constraint for max length
ALTER TABLE projects ADD CONSTRAINT projects_link_url_length CHECK (char_length(link_url) <= 500);
