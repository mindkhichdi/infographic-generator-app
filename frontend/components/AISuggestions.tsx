import { useQuery } from '@tanstack/react-query';
import { Lightbulb, Palette, Layout, BarChart3, FileText } from 'lucide-react';
import backend from '~backend/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface AISuggestionsProps {
  content: string;
  templateId: string;
}

export default function AISuggestions({ content, templateId }: AISuggestionsProps) {
  const { data: suggestionsData, isLoading } = useQuery({
    queryKey: ['ai-suggestions', content, templateId],
    queryFn: () => backend.infographic.getAISuggestions({ content, templateId }),
    enabled: content.length > 10, // Only fetch if there's meaningful content
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'color':
        return Palette;
      case 'layout':
        return Layout;
      case 'chart':
        return BarChart3;
      case 'content':
        return FileText;
      default:
        return Lightbulb;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'color':
        return 'bg-purple-100 text-purple-800';
      case 'layout':
        return 'bg-blue-100 text-blue-800';
      case 'chart':
        return 'bg-green-100 text-green-800';
      case 'content':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!content || content.length < 10) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          Add some content to get AI-powered suggestions for improving your infographic.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  const suggestions = suggestionsData?.suggestions || [];

  if (suggestions.length === 0) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-600">
          No suggestions available at the moment. Try adding more content or changing your template.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2 mb-4">
        <Lightbulb className="h-5 w-5 text-yellow-500" />
        <span className="font-medium text-gray-900">AI Suggestions</span>
        <Badge variant="secondary">{suggestions.length}</Badge>
      </div>

      {suggestions.map((suggestion, index) => {
        const Icon = getIcon(suggestion.type);
        return (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg">
                    <Icon className="h-4 w-4 text-gray-600" />
                  </div>
                  <div>
                    <CardTitle className="text-sm">{suggestion.title}</CardTitle>
                    <Badge className={`text-xs ${getTypeColor(suggestion.type)}`}>
                      {suggestion.type}
                    </Badge>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Apply
                </Button>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-sm">
                {suggestion.description}
              </CardDescription>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
