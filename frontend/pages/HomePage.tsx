import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowRight, BarChart3, Palette, Zap, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
  const { isSignedIn } = useAuth();

  const features = [
    {
      icon: BarChart3,
      title: 'Smart Data Visualization',
      description: 'Transform your data into compelling charts and graphs automatically.'
    },
    {
      icon: Palette,
      title: 'Professional Templates',
      description: 'Choose from dozens of professionally designed templates for any purpose.'
    },
    {
      icon: Zap,
      title: 'AI-Powered Suggestions',
      description: 'Get intelligent recommendations to improve your infographic design.'
    },
    {
      icon: Users,
      title: 'Easy Sharing',
      description: 'Export and share your infographics in multiple formats instantly.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Turn Your Ideas Into
              <span className="text-blue-600 block">Stunning Infographics</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Transform your blog posts, notes, and data into beautiful, engaging infographics 
              with our AI-powered design platform. No design experience required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to={isSignedIn ? "/dashboard" : "/sign-in"}>
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
                  Start Creating
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to={isSignedIn ? "/templates" : "/sign-up"}>
                <Button size="lg" variant="outline" className="text-lg px-8 py-3">
                  Browse Templates
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Create Amazing Infographics
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform combines powerful AI with intuitive design tools to help you 
              create professional infographics in minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="mx-auto w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Create Your First Infographic?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using AIgraphy to 
            bring their ideas to life.
          </p>
          <Link to={isSignedIn ? "/dashboard" : "/sign-up"}>
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8 py-3">
              Get Started for Free
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
