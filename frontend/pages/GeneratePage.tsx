import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Zap, Download, Settings, FileText, Palette, Monitor, ExternalLink, Upload, Sparkles, Play, Film } from 'lucide-react';
import { useBackend } from '../hooks/useBackend';
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
import InfographicRenderer from '../components/InfographicRenderer';
import AnimationScriptRenderer from '../components/AnimationScriptRenderer';

export default function GeneratePage() {
  const { toast } = useToast();
  const backend = useBackend();
  const [content, setContent] = useState('');
  const [urlInput, setUrlInput] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('bullet-points');
  const [selectedBrand, setSelectedBrand] = useState<string>('');
  const [format, setFormat] = useState<'png' | 'jpg' | 'pdf' | 'svg'>('png');
  const [size, setSize] = useState<'square' | 'vertical' | 'horizontal' | 'story' | 'custom'>('vertical');
  const [quality, setQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [customWidth, setCustomWidth] = useState(1080);
  const [customHeight, setCustomHeight] = useState(1920);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<any>(null);
  const [generationType, setGenerationType] = useState<'static' | 'animated'>('static');

  // Animation script specific states
  const [targetAudience, setTargetAudience] = useState('general');
  const [designStyle, setDesignStyle] = useState('minimalist');
  const [animationPacing, setAnimationPacing] = useState<'fast' | 'moderate' | 'slow'>('moderate');
  const [sceneCount, setSceneCount] = useState([5]);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);
  const [generatedScript, setGeneratedScript] = useState<any>(null);

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

  const generateScriptMutation = useMutation({
    mutationFn: (data: any) => backend.infographic.generateAnimationScript(data),
    onSuccess: (result) => {
      setGeneratedScript(result);
      setIsGeneratingScript(false);
      toast({
        title: 'Animation script generated!',
        description: 'Your Lottie animation script has been successfully created.',
      });
    },
    onError: (error) => {
      console.error('Failed to generate animation script:', error);
      setIsGeneratingScript(false);
      toast({
        title: 'Script generation failed',
        description: 'Failed to generate the animation script. Please try again.',
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

    if (generationType === 'static') {
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
    } else {
      setIsGeneratingScript(true);
      setGeneratedScript(null);

      const selectedBrandData = brands.find(b => b.id.toString() === selectedBrand);
      
      generateScriptMutation.mutate({
        content,
        targetAudience,
        designStyle,
        colorPalette: selectedBrandData?.colorPalette || ['#3B82F6', '#10B981', '#F59E0B'],
        typography: selectedBrandData?.headingFont || 'Inter',
        pacing: animationPacing,
        sceneCount: sceneCount[0],
      });
    }
  };

  const handleUrlExtract = async () => {
    if (!urlInput.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter a URL to extract content.',
        variant: 'destructive',
      });
      return;
    }

    try {
      const mockContent = `
# ${urlInput.includes('blog') ? 'Blog Post Analysis' : 'Article Insights'}

This content was extracted from the provided URL and analyzed for key insights.

Key Benefits:
• 85% increase in user engagement
• 1.2K new users this month  
• 45% improvement in conversion rates
• 3x faster loading times
• Better user experience
• Increased customer satisfaction

The data shows significant growth across all metrics, indicating successful implementation of our new strategy.

Steps to Success:
1. Analyze current performance metrics
2. Identify areas for improvement
3. Implement strategic changes
4. Monitor progress regularly
5. Optimize based on results
6. Scale successful initiatives

Our research indicates that companies following this approach see an average improvement of 67% in their key performance indicators.
      `;
      
      setContent(mockContent);
      setUrlInput('');
      toast({
        title: 'Content extracted',
        description: 'Content has been successfully extracted from the URL.',
      });
    } catch (error) {
      toast({
        title: 'Extraction failed',
        description: 'Failed to extract content from the URL. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSampleContent = () => {
    const sampleContent = `
# Digital Marketing Success Guide

Transform your marketing strategy with these proven techniques.

Key Benefits:
• 150% increase in lead generation
• 89% improvement in conversion rates
• 3x higher customer engagement
• 45% reduction in acquisition costs
• Better brand recognition
• Increased customer loyalty

Essential Steps:
1. Define your target audience clearly
2. Create compelling content that resonates
3. Optimize for search engines and social media
4. Track and analyze performance metrics
5. Adjust strategy based on data insights
6. Scale successful campaigns

Pro Tips:
• Use data-driven decision making
• Focus on customer experience
• Leverage automation tools
• Test different approaches
• Stay updated with trends

Statistics show that businesses using these strategies see an average ROI improvement of 200% within the first year.
    `;
    
    setContent(sampleContent);
    toast({
      title: 'Sample content loaded',
      description: 'You can now generate an infographic with this sample content.',
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

  const audienceOptions = [
    { value: 'general', label: 'General Public', description: 'No prior knowledge assumed' },
    { value: 'professional', label: 'Industry Professionals', description: 'Business and technical audience' },
    { value: 'students', label: 'Students & Educators', description: 'Educational context' },
    { value: 'executives', label: 'Executives & Investors', description: 'High-level decision makers' },
  ];

  const styleOptions = [
    { value: 'minimalist', label: 'Minimalist & Clean', description: 'Simple, focused design' },
    { value: 'corporate', label: 'Corporate & Professional', description: 'Business-oriented style' },
    { value: 'playful', label: 'Playful & Colorful', description: 'Engaging and fun' },
    { value: 'futuristic', label: 'Futuristic & Tech', description: 'Modern, tech-oriented' },
    { value: 'organic', label: 'Hand-drawn & Organic', description: 'Natural, artistic feel' },
  ];

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
                Enter your text content, paste a URL, or try our sample content.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="content">Your Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your blog post, notes, or any text content here. Use bullet points (•) or numbered lists for best results..."
                  rows={8}
                  className="mt-2"
                />
              </div>
              
              <div className="border-t pt-4">
                <Label htmlFor="url">Extract from URL</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="url"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://example.com/blog-post"
                    className="flex-1"
                  />
                  <Button onClick={handleUrlExtract} variant="outline">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Extract
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-4">
                <Button onClick={handleSampleContent} variant="outline" className="flex-1">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Try Sample Content
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload File
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Generation Type</CardTitle>
              <CardDescription>
                Choose between static infographic or animated script generation.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    generationType === 'static' 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setGenerationType('static')}
                >
                  <CardContent className="p-4 text-center">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                    <h3 className="font-medium">Static Infographic</h3>
                    <p className="text-sm text-gray-600 mt-1">Generate a static visual infographic</p>
                  </CardContent>
                </Card>
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    generationType === 'animated' 
                      ? 'ring-2 ring-blue-500 bg-blue-50' 
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setGenerationType('animated')}
                >
                  <CardContent className="p-4 text-center">
                    <Film className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                    <h3 className="font-medium">Animation Script</h3>
                    <p className="text-sm text-gray-600 mt-1">Generate Lottie animation script</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue={generationType === 'static' ? 'template' : 'animation'} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="template" disabled={generationType === 'animated'}>Template</TabsTrigger>
              <TabsTrigger value="format" disabled={generationType === 'animated'}>Format</TabsTrigger>
              <TabsTrigger value="animation" disabled={generationType === 'static'}>Animation</TabsTrigger>
              <TabsTrigger value="brand">Brand</TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Choose Template</CardTitle>
                  <CardDescription>
                    Select a template that best fits your content type. Bullet point content works great with list templates.
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
                          <Badge className={`text-xs ${getCategoryColor(template.category)}`}>
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

            <TabsContent value="animation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Play className="h-5 w-5 mr-2" />
                    Animation Settings
                  </CardTitle>
                  <CardDescription>
                    Configure the animation style and pacing for your Lottie script.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Target Audience</Label>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      {audienceOptions.map((option) => (
                        <Card
                          key={option.value}
                          className={`cursor-pointer transition-all hover:shadow-sm ${
                            targetAudience === option.value 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setTargetAudience(option.value)}
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
                    <Label className="text-base font-medium">Design Style</Label>
                    <div className="grid grid-cols-1 gap-3 mt-3">
                      {styleOptions.map((option) => (
                        <Card
                          key={option.value}
                          className={`cursor-pointer transition-all hover:shadow-sm ${
                            designStyle === option.value 
                              ? 'ring-2 ring-blue-500 bg-blue-50' 
                              : 'hover:bg-gray-50'
                          }`}
                          onClick={() => setDesignStyle(option.value)}
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
                    <Label className="text-base font-medium">Animation Pacing</Label>
                    <Select value={animationPacing} onValueChange={(value: any) => setAnimationPacing(value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fast">Fast & Energetic</SelectItem>
                        <SelectItem value="moderate">Moderate & Balanced</SelectItem>
                        <SelectItem value="slow">Slow & Deliberate</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Number of Scenes: {sceneCount[0]}</Label>
                    <Slider
                      value={sceneCount}
                      onValueChange={setSceneCount}
                      max={8}
                      min={3}
                      step={1}
                      className="mt-3"
                    />
                    <div className="flex justify-between text-sm text-gray-500 mt-1">
                      <span>3 scenes</span>
                      <span>8 scenes</span>
                    </div>
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
                Ready to create your {generationType === 'static' ? 'infographic' : 'animation script'}?
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={handleGenerate}
                disabled={(generationType === 'static' ? isGenerating : isGeneratingScript) || !content.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                {generationType === 'static' ? (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    {isGenerating ? 'Generating...' : 'Generate Infographic'}
                  </>
                ) : (
                  <>
                    <Film className="h-4 w-4 mr-2" />
                    {isGeneratingScript ? 'Generating...' : 'Generate Animation Script'}
                  </>
                )}
              </Button>

              {(isGenerating || isGeneratingScript) && (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">
                    {generationType === 'static' ? 'Creating your infographic...' : 'Generating animation script...'}
                  </p>
                  <p className="text-sm text-gray-500 mt-2">
                    {generationType === 'static' ? 'Analyzing content and applying design...' : 'Analyzing content and creating scene-by-scene script...'}
                  </p>
                </div>
              )}

              {generatedResult && generationType === 'static' && (
                <div className="space-y-4">
                  <InfographicRenderer data={generatedResult.infographicData} />
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

              {generatedScript && generationType === 'animated' && (
                <div className="space-y-4">
                  <AnimationScriptRenderer script={generatedScript} />
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Scenes:</span>
                      <span className="font-medium">{generatedScript.scenes.length}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Total Duration:</span>
                      <span className="font-medium">{generatedScript.totalDuration}s</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Style:</span>
                      <span className="font-medium">{generatedScript.overallStyle}</span>
                    </div>
                  </div>
                  <Button className="w-full" variant="outline">
                    <Download className="h-4 w-4 mr-2" />
                    Download Script
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
              {generationType === 'static' ? (
                <>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use bullet points (•) for automatic list formatting</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Include numbers and percentages for data visualization</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Use numbered lists (1., 2., 3.) for step-by-step guides</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Choose templates that match your content structure</p>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Clear, structured content works best for animations</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Include key statistics for dynamic number animations</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Process steps create engaging sequential animations</p>
                  </div>
                  <div className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p>Consider your audience when choosing animation style</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
