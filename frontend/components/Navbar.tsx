import { Link, useLocation } from 'react-router-dom';
import { BarChart3, FileText, Layout, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/projects', label: 'Projects', icon: FileText },
    { path: '/templates', label: 'Templates', icon: Layout },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">InfographyAI</span>
          </Link>

          <div className="flex items-center space-x-4">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link key={item.path} to={item.path}>
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Button>
                </Link>
              );
            })}
            
            <Link to="/editor">
              <Button className="bg-blue-600 hover:bg-blue-700">
                Create New
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
