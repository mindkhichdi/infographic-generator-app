import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Template {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  config: Record<string, any>;
}

interface TemplateSelectorProps {
  templates: Template[];
  selectedTemplate: string;
  onTemplateSelect: (templateId: string) => void;
}

export default function TemplateSelector({ 
  templates, 
  selectedTemplate, 
  onTemplateSelect 
}: TemplateSelectorProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {templates.map((template) => (
        <Card
          key={template.id}
          className={`cursor-pointer transition-all hover:shadow-md ${
            selectedTemplate === template.id 
              ? 'ring-2 ring-blue-500 bg-blue-50' 
              : 'hover:bg-gray-50'
          }`}
          onClick={() => onTemplateSelect(template.id)}
        >
          <CardContent className="p-4">
            <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
              <span className="text-gray-500 text-sm">Preview</span>
            </div>
            <h3 className="font-medium text-gray-900 mb-1">{template.name}</h3>
            <Badge variant="secondary" className="text-xs">
              {template.category}
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
