import { useState, useEffect } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Save, Download, Lightbulb, Palette, Type, Image } from 'lucide-react';
import { useBackend } from '../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/components/ui/use-toast';
import { Badge } from '@/components/ui/badge';
import TemplateSelector from '../components/TemplateSelector';
import InfographicPreview from '../components/InfographicPreview';
import AISuggestions from '../components/AISuggestions';

export default function EditorPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const backend = useBackend();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern-stats');
  const [designData, setDesignData] = useState<Record<string, any>>({});

  const templateFromUrl = searchParams.get('template');

  // Load project if editing existing one
  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: () => backend.infographic.getProject({ id: parseInt(id!) }),
    enabled: !!id,
  });

  // Load templates
  const { data: templatesData } = useQuery({
    queryKey: ['templates'],
    queryFn: () => backend.infographic.listTemplates(),
  });

  useEffect(() => {
    if (project) {
      setTitle(project.title);
      setContent(project.content);
      setSelectedTemplate(project.templateId);
      setDesignData(project.designData);
    } else if (templateFromUrl) {
      setSelectedTemplate(templateFromUrl);
    }
  }, [project, templateFromUrl]);

  const saveProjectMutation = useMutation({
    mutationFn: async (data: { title: string; content: string; templateId: string; designData: Record<string, any> }) => {
      if (id) {
        return backend.infographic.updateProject({ id: parseInt(id), ...data });
      } else {
        return backend.infographic.createProject(data);
      }
    },
    onSuccess: (savedProject) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      toast({
        title: 'Project saved',
        description: 'Your infographic has been saved successfully.',
      });
      
      if (!id) {
        navigate(`/editor/${savedProject.id}`, { replace: true });
      }
    },
    onError: (error) => {
      console.error('Failed to save project:', error);
      toast({
        title: 'Error',
        description: 'Failed to save the project. Please try again.',
        variant: 'destructive',
      });
    },
  });

  const handleSave = () => {
    if (!title.trim()) {
      toast({
        title: 'Title required',
        description: 'Please enter a title for your infographic.',
        variant: 'destructive',
      });
      return;
    }

    if (!content.trim()) {
      toast({
        title: 'Content required',
        description: 'Please enter some content for your infographic.',
        variant: 'destructive',
      });
      return;
    }

    saveProjectMutation.mutate({
      title,
      content,
      templateId: selectedTemplate,
      designData,
    });
  };

  const handleExport = () => {
    // Mock export functionality
    toast({
      title: 'Export started',
      description: 'Your infographic is being prepared for download.',
    });
  };

  if (projectLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="h-64 bg-gray-200 rounded-lg"></div>
              <div className="h-32 bg-gray-200 rounded-lg"></div>
            </div>
            <div className="h-96 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  const templates = templatesData?.templates || [];
  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          {id ? 'Edit Infographic' : 'Create New Infographic'}
        </h1>
        <div className="flex space-x-4">
          <Button 
            onClick={handleSave}
            disabled={saveProjectMutation.isPending}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="h-4 w-4 mr-2" />
            {saveProjectMutation.isPending ? 'Saving...' : 'Save'}
          </Button>
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Editor Panel */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter your infographic title..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Paste your blog post, notes, or any text content here..."
                  rows={8}
                />
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="template" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="template">Template</TabsTrigger>
              <TabsTrigger value="design">Design</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="ai">AI Help</TabsTrigger>
            </TabsList>
            
            <TabsContent value="template" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Type className="h-5 w-5 mr-2" />
                    Choose Template
                  </CardTitle>
                  <CardDescription>
                    Select a template that best fits your content type and style.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <TemplateSelector
                    templates={templates}
                    selectedTemplate={selectedTemplate}
                    onTemplateSelect={setSelectedTemplate}
                  />
                  {currentTemplate && (
                    <div className="mt-4">
                      <Badge variant="secondary">{currentTemplate.category}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="design" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Palette className="h-5 w-5 mr-2" />
                    Design Customization
                  </CardTitle>
                  <CardDescription>
                    Customize colors, fonts, and layout options.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Design customization tools will be available here. You can adjust colors, 
                    fonts, spacing, and other visual elements.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="content" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Image className="h-5 w-5 mr-2" />
                    Content Elements
                  </CardTitle>
                  <CardDescription>
                    Add charts, images, and other visual elements.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Content element tools will be available here. You can add charts, 
                    images, icons, and other visual components.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="ai" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Lightbulb className="h-5 w-5 mr-2" />
                    AI Suggestions
                  </CardTitle>
                  <CardDescription>
                    Get intelligent recommendations to improve your infographic.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AISuggestions content={content} templateId={selectedTemplate} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>
                See how your infographic will look
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InfographicPreview
                title={title}
                content={content}
                template={currentTemplate}
                designData={designData}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
