-- Add user_id to projects table
ALTER TABLE projects ADD COLUMN user_id TEXT NOT NULL DEFAULT 'anonymous';

-- Add user_id to brands table  
ALTER TABLE brands ADD COLUMN user_id TEXT NOT NULL DEFAULT 'anonymous';

-- Create indexes for better performance
CREATE INDEX idx_projects_user_id ON projects(user_id);
CREATE INDEX idx_brands_user_id ON brands(user_id);
