import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function TemplatesPage() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const { data: templatesData, isLoading, error } = useQuery({
    queryKey: ['templates'],
    queryFn: () => backend.infographic.listTemplates(),
  });

  const templates = templatesData?.templates || [];
  const categories = ['all', ...new Set(templates.map(t => t.category))];

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleUseTemplate = (templateId: string) => {
    navigate(`/editor?template=${templateId}`);
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'data': 'bg-blue-100 text-blue-800',
      'process': 'bg-purple-100 text-purple-800',
      'comparison': 'bg-green-100 text-green-800',
      'list': 'bg-orange-100 text-orange-800',
      'social': 'bg-pink-100 text-pink-800',
      'tutorial': 'bg-indigo-100 text-indigo-800',
      'analytics': 'bg-cyan-100 text-cyan-800',
      'marketing': 'bg-emerald-100 text-emerald-800',
      'research': 'bg-violet-100 text-violet-800',
      'educational': 'bg-amber-100 text-amber-800',
      'product': 'bg-rose-100 text-rose-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="h-80 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Error Loading Templates</h2>
          <p className="text-gray-600">Failed to load templates. Please try again.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Infographic Templates</h1>
        <p className="text-gray-600 mb-6">
          Choose from our collection of professionally designed templates to create stunning infographics.
        </p>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category.charAt(0).toUpperCase() + category.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {filteredTemplates.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Templates Found</h2>
          <p className="text-gray-600">
            Try adjusting your search terms or category filter.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <Card key={template.id} className="hover:shadow-lg transition-shadow group">
              <CardHeader className="p-0">
                <div className="aspect-video rounded-t-lg overflow-hidden">
                  <img 
                    src={template.previewUrl} 
                    alt={template.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxMjVIMjI1TDIwMCAxNTBaIiBmaWxsPSIjOUI5QjlCIi8+CjwvZz4KPC9zdmc+';
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
                    {template.category}
                  </Badge>
                </div>
                <CardDescription className="text-sm text-gray-600 mb-4">
                  Perfect for {template.category} content and visual storytelling
                </CardDescription>
                <Button 
                  onClick={() => handleUseTemplate(template.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  Use This Template
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Template Categories Info */}
      <div className="mt-16 bg-gray-50 rounded-lg p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Template Categories</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Data & Analytics</h4>
            <p className="text-gray-600">Perfect for statistics, charts, and data visualization</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Process & Tutorial</h4>
            <p className="text-gray-600">Step-by-step guides and workflow illustrations</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Lists & Bullets</h4>
            <p className="text-gray-600">Organize information with bullet points and lists</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Comparison</h4>
            <p className="text-gray-600">Before/after and side-by-side comparisons</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Marketing</h4>
            <p className="text-gray-600">Product features, benefits, and promotional content</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-900 mb-2">Social Media</h4>
            <p className="text-gray-600">Optimized for social platforms and sharing</p>
          </div>
        </div>
      </div>
    </div>
  );
}
