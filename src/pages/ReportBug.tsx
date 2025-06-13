
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BugReportForm from '@/components/BugReportForm';
import { Bug } from '@/components/BugDashboard';

const ReportBug = () => {
  const navigate = useNavigate();

  const handleSubmit = (bugData: Omit<Bug, 'id' | 'status' | 'createdAt'>) => {
    // Create new bug with generated ID and default status
    const newBug: Bug = {
      ...bugData,
      id: `bug-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'Open',
      createdAt: new Date()
    };

    // Load existing bugs from localStorage
    const existingBugs = JSON.parse(localStorage.getItem('bugTracker_bugs') || '[]');
    
    // Add new bug
    const updatedBugs = [newBug, ...existingBugs];
    
    // Save to localStorage
    localStorage.setItem('bugTracker_bugs', JSON.stringify(updatedBugs));

    // Navigate to dashboard after a short delay
    setTimeout(() => {
      navigate('/');
    }, 1500);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Report a New Bug
        </h1>
        <p className="text-muted-foreground mt-2">
          Help us improve by reporting issues you've encountered
        </p>
      </div>

      <BugReportForm onSubmit={handleSubmit} />
    </div>
  );
};

export default ReportBug;
