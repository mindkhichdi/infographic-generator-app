import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { Plus, FileText, Palette, Layout, Zap, TrendingUp, Users, BarChart3 } from 'lucide-react';
import { useBackend } from '../hooks/useBackend';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const { user } = useAuth();
  const backend = useBackend();

  const { data: projectsData } = useQuery({
    queryKey: ['projects'],
    queryFn: () => backend.infographic.listProjects(),
  });

  const { data: brandsData } = useQuery({
    queryKey: ['brands'],
    queryFn: () => backend.infographic.listBrands(),
  });

  const { data: templatesData } = useQuery({
    queryKey: ['templates'],
    queryFn: () => backend.infographic.listTemplates(),
  });

  const projects = projectsData?.projects || [];
  const brands = brandsData?.brands || [];
  const templates = templatesData?.templates || [];

  const recentProjects = projects.slice(0, 3);

  const stats = [
    {
      title: 'Total Projects',
      value: projects.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Brand Assets',
      value: brands.length,
      icon: Palette,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Templates Available',
      value: templates.length,
      icon: Layout,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'This Month',
      value: projects.filter(p => {
        const projectDate = new Date(p.createdAt);
        const now = new Date();
        return projectDate.getMonth() === now.getMonth() && projectDate.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const quickActions = [
    {
      title: 'Generate Infographic',
      description: 'Create a new infographic with AI assistance',
      icon: Zap,
      href: '/generate',
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      title: 'Browse Templates',
      description: 'Explore our collection of professional templates',
      icon: Layout,
      href: '/templates',
      color: 'bg-purple-600 hover:bg-purple-700',
    },
    {
      title: 'Manage Brands',
      description: 'Create and edit your brand assets',
      icon: Palette,
      href: '/brands',
      color: 'bg-green-600 hover:bg-green-700',
    },
    {
      title: 'View Projects',
      description: 'See all your created infographics',
      icon: FileText,
      href: '/projects',
      color: 'bg-orange-600 hover:bg-orange-700',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {user?.firstName || 'Creator'}!
        </h1>
        <p className="text-gray-600">
          Ready to create some amazing infographics today?
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Get started with these common tasks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quickActions.map((action, index) => {
                  const Icon = action.icon;
                  return (
                    <Link key={index} to={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4">
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${action.color}`}>
                              <Icon className="h-5 w-5 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-medium text-gray-900 mb-1">
                                {action.title}
                              </h3>
                              <p className="text-sm text-gray-600">
                                {action.description}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Projects */}
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Recent Projects</CardTitle>
                  <CardDescription>
                    Your latest infographics
                  </CardDescription>
                </div>
                <Link to="/projects">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentProjects.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-4">No projects yet</p>
                  <Link to="/generate">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Create First Project
                    </Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentProjects.map((project) => (
                    <Link key={project.id} to={`/editor/${project.id}`}>
                      <div className="p-3 rounded-lg border hover:bg-gray-50 transition-colors cursor-pointer">
                        <h4 className="font-medium text-gray-900 truncate">
                          {project.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {new Date(project.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
