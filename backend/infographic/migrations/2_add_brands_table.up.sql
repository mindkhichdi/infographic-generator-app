CREATE TABLE brands (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  watermark_text TEXT,
  watermark_logo_url TEXT,
  color_palette JSONB NOT NULL DEFAULT '[]',
  heading_font TEXT NOT NULL DEFAULT 'Inter',
  body_font TEXT NOT NULL DEFAULT 'Inter',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add brand_id to projects table
ALTER TABLE projects ADD COLUMN brand_id BIGINT REFERENCES brands(id);

-- Insert default brand
INSERT INTO brands (name, watermark_text, color_palette, heading_font, body_font) VALUES
('Default Brand', 'AIgraphy', '["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"]', 'Inter', 'Inter');
