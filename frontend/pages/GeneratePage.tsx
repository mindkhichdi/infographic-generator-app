import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Zap, Download, Settings, FileText, Palette, Monitor } from 'lucide-react';
import backend from '~backend/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';

export default function GeneratePage() {
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-stats');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [format, setFormat] = useState<'png' | 'jpg' | 'pdf' | 'svg'>('png');
  const [size, setSize] = useState<'square' | 'vertical' | 'horizontal' | 'story' | 'custom'>('vertical');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1920);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);

  const { data: templatesData } = useQuery({
    queryKey: ['templates'],
    queryFn: () => backend.infographic.listTemplates(),
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => backend.infographic.listBrands(),
  });

  const generateMutation = useMutation({
    mutationFn: (data: any) => backend.infographic.generateInfographic(data),
    onSuccess: (result) => {
      setGeneratedResult(result);
      setIsGenerating(false);
      toast({
        title: 'Infographic generated!',
        description: 'Your infographic has been successfully generated.',
      });
    },
    onError: (error) => {
      console.error('Failed to generate infographic:', error);
      setIsGenerating(false);
      toast({
        title: 'Generation failed',
        description: 'Failed to generate the infographic. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleGenerate = () => {
    if (!content.trim()) {
      toast({
        title: 'Content required',
        description: 'Please enter some content to generate an infographic.',
        variant: 'destructive',
      });
      return;
    }

    setIsGenerating(true);
    setGeneratedResult(null);

    generateMutation.mutate({
      content,
      templateId: selectedTemplate,
      brandId: selectedBrand ? parseInt(selectedBrand) : undefined,
      format,
      size,
      customWidth: size === 'custom' ? customWidth : undefined,
      customHeight: size === 'custom' ? customHeight : undefined,
      quality,
    });
  };

  const templates = templatesData?.templates || [];
  const brands = brandsData?.brands || [];

  const sizeOptions = [
    { value: 'square', label: 'Square (1:1)', description: '1080 × 1080px' },
    { value: 'vertical', label: 'Vertical (9:16)', description: '1080 × 1920px' },
    { value: 'horizontal', label: 'Horizontal (16:9)', description: '1920 × 1080px' },
    { value: 'story', label: 'Story (9:16)', description: '1080 × 1920px' },
    { value: 'custom', label: 'Custom', description: 'Set your own dimensions' },
  ];

  const formatOptions = [
    { value: 'png', label: 'PNG', description: 'Best for web and transparency' },
    { value: 'jpg', label: 'JPG', description: 'Smaller file size' },
    { value: 'pdf', label: 'PDF', description: 'Print-ready format' },
    { value: 'svg', label: 'SVG', description: 'Vector format, scalable' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Generate Your Infographic
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Transform your content into beautiful infographics with AI-powered design.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Content Input
              </CardTitle>
              <CardDescription>
                Enter your text content or paste a URL to generate an infographic.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Your Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your blog post, notes, or any text content here. You can also paste a URL to extract content automatically..."
                  rows={8}
                  className="mt-2"
                />
              </div>
              <div className="flex gap-4">
                <Button variant="outline" className="flex-1">
                  <FileText className="h-4 w-4 mr-2" />
                  Attach Files
                </Button>
                <Button variant="outline" className="flex-1">
                  Extract from URL
                </Button>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="format">Format</TabsTrigger>
              <TabsTrigger value="brand">Brand</TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Template</CardTitle>
                  <CardDescription>
                    Select a template that best fits your content type.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {templates.map((template) => (
                      <Card
                        key={template.id}
                        className={`cursor-pointer transition-all hover:shadow-md ${
                          selectedTemplate === template.id 
                            ? 'ring-2 ring-blue-500 bg-blue-50' 
                            : 'hover:bg-gray-50'
                        }`}
                        onClick={() => setSelectedTemplate(template.id)}
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
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="format" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Format & Size Options
                  </CardTitle>
                  <CardDescription>
                    Configure the output format and dimensions for your infographic.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">File Format</Label>
                    <div className="grid grid-cols-2 gap-3 mt-3">
                      {formatOptions.map((option) => (
                        <Card
                          key={option.value}
                          className={`cursor-pointer transition-all hover:shadow-sm ${
                            format === option.value 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setFormat(option.value as any)}
                        >
                          <CardContent className="p-3">
                            <div className="font-medium">{option.label}</div>
                            <div className="text-sm text-gray-600">{option.description}</div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Size</Label>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      {sizeOptions.map((option) => (
                        <Card
                          key={option.value}
                          className={`cursor-pointer transition-all hover:shadow-sm ${
                            size === option.value 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setSize(option.value as any)}
                        >
                          <CardContent className="p-3">
                            <div className="flex justify-between items-center">
                              <div>
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-600">{option.description}</div>
                              </div>
                              <Monitor className="h-5 w-5 text-gray-400" />
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </div>

                  {size === 'custom' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="width">Width (px)</Label>
                        <Input
                          id="width"
                          type="number"
                          value={customWidth}
                          onChange={(e) => setCustomWidth(parseInt(e.target.value) || 1080)}
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label htmlFor="height">Height (px)</Label>
                        <Input
                          id="height"
                          type="number"
                          value={customHeight}
                          onChange={(e) => setCustomHeight(parseInt(e.target.value) || 1920)}
                          className="mt-1"
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <Label className="text-base font-medium">Quality</Label>
                    <Select value={quality} onValueChange={(value: any) => setQuality(value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (Fast generation)</SelectItem>
                        <SelectItem value="medium">Medium (Balanced)</SelectItem>
                        <SelectItem value="high">High (Best quality)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="brand" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Brand Settings
                  </CardTitle>
                  <CardDescription>
                    Apply your brand identity to the infographic.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div>
                    <Label htmlFor="brand">Select Brand (Optional)</Label>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose a brand or leave default" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="">Default (No brand)</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand.id} value={brand.id.toString()}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Generation Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Generate</CardTitle>
              <CardDescription>
                Ready to create your infographic?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGenerate}
                disabled={isGenerating || !content.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <Zap className="h-4 w-4 mr-2" />
                {isGenerating ? 'Generating...' : 'Generate Infographic'}
              </Button>

              {isGenerating && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Creating your infographic...</p>
                </div>
              )}

              {generatedResult && (
                <div className="space-y-4">
                  <div className="aspect-[3/4] bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Generated Preview</p>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Format:</span>
                      <span className="font-medium">{generatedResult.format.toUpperCase()}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium">{generatedResult.size}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Generated:</span>
                      <span className="font-medium">
                        {new Date(generatedResult.generatedAt).toLocaleTimeString()}
                      </span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Tips</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-gray-600">
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Use clear, concise content for better results</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Include data points and statistics when possible</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Choose templates that match your content type</p>
              </div>
              <div className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                <p>Apply your brand for consistent styling</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
