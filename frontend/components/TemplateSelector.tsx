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
            <div className="aspect-video rounded-lg mb-3 overflow-hidden">
              <img 
                src={template.previewUrl} 
                alt={template.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMDAgMTUwTDE3NSAxMjVIMjI1TDIwMCAxNTBaIiBmaWxsPSIjOUI5QjlCIi8+CjwvZz4KPC9zdmc+';
                }}
              />
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
