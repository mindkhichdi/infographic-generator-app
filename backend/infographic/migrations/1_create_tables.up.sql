CREATE TABLE projects (
  id BIGSERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  template_id TEXT NOT NULL,
  design_data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE templates (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  preview_url TEXT NOT NULL,
  config JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

INSERT INTO templates (id, name, category, preview_url, config) VALUES
('modern-stats', 'Modern Statistics', 'data', '/templates/modern-stats.png', '{"sections": ["header", "stats", "chart", "footer"], "colors": ["#3B82F6", "#10B981", "#F59E0B"]}'),
('timeline', 'Timeline Infographic', 'process', '/templates/timeline.png', '{"sections": ["header", "timeline", "footer"], "colors": ["#8B5CF6", "#EC4899", "#06B6D4"]}'),
('comparison', 'Comparison Chart', 'comparison', '/templates/comparison.png', '{"sections": ["header", "comparison", "footer"], "colors": ["#EF4444", "#10B981", "#3B82F6"]}'),
('process-flow', 'Process Flow', 'process', '/templates/process-flow.png', '{"sections": ["header", "steps", "footer"], "colors": ["#F59E0B", "#8B5CF6", "#10B981"]}'),
('social-media', 'Social Media Post', 'social', '/templates/social-media.png', '{"sections": ["header", "content", "cta"], "colors": ["#EC4899", "#8B5CF6", "#06B6D4"]}');
