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
('statistics-dashboard', 'Statistics Dashboard', 'data', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', '{"sections": ["header", "stats", "chart", "footer"], "colors": ["#3B82F6", "#10B981", "#F59E0B"], "layout": "grid"}'),
('timeline-process', 'Timeline Process', 'process', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=400&h=300&fit=crop', '{"sections": ["header", "timeline", "footer"], "colors": ["#8B5CF6", "#EC4899", "#06B6D4"], "layout": "vertical"}'),
('comparison-chart', 'Comparison Chart', 'comparison', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop', '{"sections": ["header", "comparison", "footer"], "colors": ["#EF4444", "#10B981", "#3B82F6"], "layout": "side-by-side"}'),
('bullet-points', 'Bullet Points List', 'list', 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=400&h=300&fit=crop', '{"sections": ["header", "bullets", "footer"], "colors": ["#F59E0B", "#8B5CF6", "#10B981"], "layout": "list"}'),
('social-media-post', 'Social Media Post', 'social', 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=400&h=300&fit=crop', '{"sections": ["header", "content", "cta"], "colors": ["#EC4899", "#8B5CF6", "#06B6D4"], "layout": "centered"}'),
('infographic-steps', 'Step-by-Step Guide', 'tutorial', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400&h=300&fit=crop', '{"sections": ["header", "steps", "footer"], "colors": ["#10B981", "#3B82F6", "#F59E0B"], "layout": "numbered"}'),
('data-visualization', 'Data Visualization', 'analytics', 'https://images.unsplash.com/photo-1543286386-713bdd548da4?w=400&h=300&fit=crop', '{"sections": ["header", "charts", "insights", "footer"], "colors": ["#6366F1", "#8B5CF6", "#EC4899"], "layout": "dashboard"}'),
('before-after', 'Before & After', 'comparison', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop', '{"sections": ["header", "before", "after", "footer"], "colors": ["#EF4444", "#10B981", "#3B82F6"], "layout": "split"}'),
('feature-highlights', 'Feature Highlights', 'marketing', 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop', '{"sections": ["header", "features", "footer"], "colors": ["#06B6D4", "#10B981", "#F59E0B"], "layout": "grid"}'),
('survey-results', 'Survey Results', 'research', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=300&fit=crop', '{"sections": ["header", "results", "charts", "footer"], "colors": ["#8B5CF6", "#EC4899", "#F59E0B"], "layout": "mixed"}'),
('tips-tricks', 'Tips & Tricks', 'educational', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400&h=300&fit=crop', '{"sections": ["header", "tips", "footer"], "colors": ["#10B981", "#F59E0B", "#3B82F6"], "layout": "cards"}'),
('product-showcase', 'Product Showcase', 'product', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400&h=300&fit=crop', '{"sections": ["header", "product", "features", "footer"], "colors": ["#3B82F6", "#10B981", "#EC4899"], "layout": "showcase"}');
