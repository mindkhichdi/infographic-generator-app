import { Card } from '@/components/ui/card';

interface Template {
  id: string;
  name: string;
  category: string;
  previewUrl: string;
  config: Record<string, any>;
}

interface InfographicPreviewProps {
  title: string;
  content: string;
  template?: Template;
  designData: Record<string, any>;
}

export default function InfographicPreview({ 
  title, 
  content, 
  template, 
  designData 
}: InfographicPreviewProps) {
  if (!title && !content) {
    return (
      <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
        <p className="text-gray-500 text-sm">Preview will appear here</p>
      </div>
    );
  }

  const getTemplateColors = () => {
    if (template?.config?.colors) {
      return template.config.colors as string[];
    }
    return ['#3B82F6', '#10B981', '#F59E0B'];
  };

  const colors = getTemplateColors();

  return (
    <Card className="aspect-[3/4] p-6 bg-white overflow-hidden">
      <div className="h-full flex flex-col">
        {/* Header */}
        <div 
          className="text-center mb-6 p-4 rounded-lg"
          style={{ backgroundColor: `${colors[0]}20` }}
        >
          <h1 
            className="text-xl font-bold mb-2"
            style={{ color: colors[0] }}
          >
            {title || 'Your Title Here'}
          </h1>
        </div>

        {/* Content Preview */}
        <div className="flex-1 space-y-4">
          {template?.id === 'modern-stats' && (
            <div className="grid grid-cols-2 gap-4">
              <div 
                className="p-3 rounded-lg text-center"
                style={{ backgroundColor: `${colors[1]}20` }}
              >
                <div 
                  className="text-2xl font-bold"
                  style={{ color: colors[1] }}
                >
                  85%
                </div>
                <div className="text-sm text-gray-600">Growth</div>
              </div>
              <div 
                className="p-3 rounded-lg text-center"
                style={{ backgroundColor: `${colors[2]}20` }}
              >
                <div 
                  className="text-2xl font-bold"
                  style={{ color: colors[2] }}
                >
                  1.2K
                </div>
                <div className="text-sm text-gray-600">Users</div>
              </div>
            </div>
          )}

          {template?.id === 'timeline' && (
            <div className="space-y-3">
              {[1, 2, 3].map((step, index) => (
                <div key={step} className="flex items-center space-x-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold"
                    style={{ backgroundColor: colors[index % colors.length] }}
                  >
                    {step}
                  </div>
                  <div className="flex-1 h-2 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          )}

          <div className="text-sm text-gray-700 line-clamp-6">
            {content || 'Your content will be transformed into visual elements here...'}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 text-center">
          <div 
            className="inline-block px-3 py-1 rounded text-sm text-white"
            style={{ backgroundColor: colors[0] }}
          >
            InfographyAI
          </div>
        </div>
      </div>
    </Card>
  );
}
