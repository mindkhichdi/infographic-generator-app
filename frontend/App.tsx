import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import HomePage from './pages/HomePage';
import ProjectsPage from './pages/ProjectsPage';
import EditorPage from './pages/EditorPage';
import TemplatesPage from './pages/TemplatesPage';
import Navbar from './components/Navbar';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/templates" element={<TemplatesPage />} />
            <Route path="/editor/:id?" element={<EditorPage />} />
          </Routes>
          <Toaster />
        </div>
      </Router>
    </QueryClientProvider>
  );
}
