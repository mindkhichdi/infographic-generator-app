import { api } from "encore.dev/api";

export interface AISuggestionsRequest {
  content: string;
  templateId: string;
}

export interface AISuggestion {
  type: 'color' | 'layout' | 'content' | 'chart';
  title: string;
  description: string;
  value: any;
}

export interface AISuggestionsResponse {
  suggestions: AISuggestion[];
}

// Generates AI-powered suggestions for improving the infographic.
export const getAISuggestions = api<AISuggestionsRequest, AISuggestionsResponse>(
  { expose: true, method: "POST", path: "/ai/suggestions" },
  async (req) => {
    // Mock AI suggestions for now - in a real app, this would integrate with an AI service
    const suggestions: AISuggestion[] = [];
    
    // Analyze content length and suggest layout
    if (req.content.length > 500) {
      suggestions.push({
        type: 'layout',
        title: 'Consider Multi-Column Layout',
        description: 'Your content is quite lengthy. A multi-column layout would improve readability.',
        value: { columns: 2 }
      });
    }
    
    // Suggest colors based on template
    if (req.templateId === 'modern-stats') {
      suggestions.push({
        type: 'color',
        title: 'Professional Blue Palette',
        description: 'Use a professional blue color scheme for data-focused content.',
        value: { primary: '#2563EB', secondary: '#1E40AF', accent: '#3B82F6' }
      });
    }
    
    // Content suggestions
    if (!req.content.includes('statistics') && !req.content.includes('data')) {
      suggestions.push({
        type: 'content',
        title: 'Add Supporting Data',
        description: 'Consider adding statistics or data points to strengthen your message.',
        value: { suggestion: 'Include relevant statistics or data points' }
      });
    }
    
    // Chart suggestions
    if (req.content.includes('increase') || req.content.includes('growth')) {
      suggestions.push({
        type: 'chart',
        title: 'Add Growth Chart',
        description: 'Your content mentions growth. A line chart would visualize this effectively.',
        value: { chartType: 'line', data: 'growth-trend' }
      });
    }
    
    return { suggestions };
  }
);
