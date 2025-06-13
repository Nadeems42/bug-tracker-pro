
import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';
import { Bug, Settings, Plus, Search } from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl group-hover:scale-110 transition-transform duration-200">
                <Bug className="h-6 w-6 text-white" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
                  BugTracker Pro
                </h1>
                <p className="text-xs text-muted-foreground">Issue Management System</p>
              </div>
            </Link>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-1">
              <Button
                variant={isActive('/') ? "secondary" : "ghost"}
                asChild
                className="transition-all duration-200 hover:scale-105"
              >
                <Link to="/" className="flex items-center space-x-2">
                  <Search className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </Button>
              <Button
                variant={isActive('/report') ? "secondary" : "ghost"}
                asChild
                className="transition-all duration-200 hover:scale-105"
              >
                <Link to="/report" className="flex items-center space-x-2">
                  <Plus className="h-4 w-4" />
                  <span>Report Bug</span>
                </Link>
              </Button>
            </nav>

            {/* Actions */}
            <div className="flex items-center space-x-2">
              <ThemeToggle />
              <Button
                size="sm"
                className="hidden sm:flex items-center space-x-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105"
                asChild
              >
                <Link to="/report">
                  <Plus className="h-4 w-4" />
                  <span>New Bug</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="md:hidden border-b border-border/40 bg-card/50 backdrop-blur-xl">
        <div className="container mx-auto px-4">
          <div className="flex space-x-1 py-2">
            <Button
              variant={isActive('/') ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="flex-1 transition-all duration-200"
            >
              <Link to="/" className="flex items-center justify-center space-x-2">
                <Search className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
            </Button>
            <Button
              variant={isActive('/report') ? "secondary" : "ghost"}
              size="sm"
              asChild
              className="flex-1 transition-all duration-200"
            >
              <Link to="/report" className="flex items-center justify-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Report</span>
              </Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-card/30 backdrop-blur-xl mt-auto">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2024 BugTracker Pro. Built with React & Tailwind CSS</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
