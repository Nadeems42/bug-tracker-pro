
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Lightbulb, LightbulbOff } from 'lucide-react';

export const ThemeToggle = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const initialTheme = savedTheme || systemTheme;
    
    setTheme(initialTheme);
    document.documentElement.classList.toggle('dark', initialTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative transition-all duration-200 hover:scale-110"
    >
      <div className="relative">
        {theme === 'light' ? (
          <Lightbulb className="h-4 w-4 transition-all duration-300 rotate-0 scale-100" />
        ) : (
          <LightbulbOff className="h-4 w-4 transition-all duration-300 rotate-0 scale-100" />
        )}
      </div>
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
};
