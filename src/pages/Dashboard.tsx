
import { useState, useEffect } from 'react';
import BugDashboard, { Bug } from '@/components/BugDashboard';

const Dashboard = () => {
  const [bugs, setBugs] = useState<Bug[]>([]);

  useEffect(() => {
    // Load bugs from localStorage
    const savedBugs = localStorage.getItem('bugTracker_bugs');
    if (savedBugs) {
      const parsedBugs = JSON.parse(savedBugs).map((bug: any) => ({
        ...bug,
        createdAt: new Date(bug.createdAt)
      }));
      setBugs(parsedBugs);
    }
  }, []);

  const handleStatusChange = (bugId: string, newStatus: Bug['status']) => {
    setBugs(prevBugs => {
      const updatedBugs = prevBugs.map(bug =>
        bug.id === bugId ? { ...bug, status: newStatus } : bug
      );
      localStorage.setItem('bugTracker_bugs', JSON.stringify(updatedBugs));
      return updatedBugs;
    });
  };

  const handleAssigneeChange = (bugId: string, assignee: string) => {
    setBugs(prevBugs => {
      const updatedBugs = prevBugs.map(bug =>
        bug.id === bugId ? { ...bug, assignedTo: assignee || undefined } : bug
      );
      localStorage.setItem('bugTracker_bugs', JSON.stringify(updatedBugs));
      return updatedBugs;
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Bug Dashboard
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage and track all reported bugs in one centralized location
        </p>
      </div>

      <BugDashboard
        bugs={bugs}
        onStatusChange={handleStatusChange}
        onAssigneeChange={handleAssigneeChange}
      />
    </div>
  );
};

export default Dashboard;
