
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/hooks/use-toast';
import { Search, Filter, Eye, User, Clock, Settings, Plus, Minus } from 'lucide-react';

export interface Bug {
  id: string;
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed';
  reporter: string;
  assignedTo?: string;
  createdAt: Date;
  screenshot?: string;
}

interface BugDashboardProps {
  bugs: Bug[];
  onStatusChange: (bugId: string, newStatus: Bug['status']) => void;
  onAssigneeChange: (bugId: string, assignee: string) => void;
}

const BugDashboard = ({ bugs, onStatusChange, onAssigneeChange }: BugDashboardProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);

  const teamMembers = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson', 'Alex Chen'];

  const filteredBugs = useMemo(() => {
    return bugs.filter(bug => {
      const matchesSearch = bug.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bug.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           bug.reporter.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || bug.status === statusFilter;
      const matchesPriority = priorityFilter === 'all' || bug.priority === priorityFilter;
      
      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [bugs, searchTerm, statusFilter, priorityFilter]);

  const handleStatusChange = (bugId: string, newStatus: Bug['status']) => {
    onStatusChange(bugId, newStatus);
    toast({
      title: "Status Updated",
      description: `Bug status changed to ${newStatus}`,
    });
  };

  const handleAssigneeChange = (bugId: string, assignee: string) => {
    onAssigneeChange(bugId, assignee);
    toast({
      title: "Assignee Updated",
      description: `Bug assigned to ${assignee}`,
    });
  };

  const getPriorityColor = (priority: Bug['priority']) => {
    switch (priority) {
      case 'High': return 'priority-high';
      case 'Medium': return 'priority-medium';
      case 'Low': return 'priority-low';
      default: return 'priority-low';
    }
  };

  const getStatusColor = (status: Bug['status']) => {
    switch (status) {
      case 'Open': return 'status-open';
      case 'In Progress': return 'status-progress';
      case 'Resolved': return 'status-resolved';
      case 'Closed': return 'status-closed';
      default: return 'status-open';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="glass-morphism border-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Bugs</p>
                <p className="text-2xl font-bold">{bugs.length}</p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Search className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Open</p>
                <p className="text-2xl font-bold text-blue-500">
                  {bugs.filter(b => b.status === 'Open').length}
                </p>
              </div>
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                <p className="text-2xl font-bold text-yellow-500">
                  {bugs.filter(b => b.status === 'In Progress').length}
                </p>
              </div>
              <div className="p-3 bg-yellow-500/10 rounded-lg">
                <Settings className="h-6 w-6 text-yellow-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-morphism border-border/20">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                <p className="text-2xl font-bold text-green-500">
                  {bugs.filter(b => b.status === 'Resolved').length}
                </p>
              </div>
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Plus className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="glass-morphism border-border/20">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search bugs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="Open">Open</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Resolved">Resolved</SelectItem>
                  <SelectItem value="Closed">Closed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Priority</label>
              <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Priority</SelectItem>
                  <SelectItem value="High">High</SelectItem>
                  <SelectItem value="Medium">Medium</SelectItem>
                  <SelectItem value="Low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setStatusFilter('all');
                  setPriorityFilter('all');
                }}
                className="w-full"
              >
                <Filter className="h-4 w-4 mr-2" />
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Bug List */}
      <div className="space-y-4">
        {filteredBugs.length === 0 ? (
          <Card className="glass-morphism border-border/20">
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No bugs found</h3>
              <p className="text-muted-foreground">
                {bugs.length === 0 
                  ? "No bugs have been reported yet. Great job!" 
                  : "Try adjusting your search filters to find specific bugs."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredBugs.map((bug) => (
            <Card 
              key={bug.id} 
              className="glass-morphism border-border/20 hover:border-border/40 transition-all duration-200 hover:shadow-lg animate-fade-in"
            >
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="text-lg font-semibold hover:text-primary transition-colors">
                          {bug.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {bug.description}
                        </p>
                      </div>
                      {bug.screenshot && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setSelectedBug(bug)}
                          className="ml-2 hover:scale-110 transition-transform"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{bug.reporter}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(bug.createdAt)}</span>
                      </div>
                      {bug.assignedTo && (
                        <div className="flex items-center space-x-1">
                          <span>Assigned to:</span>
                          <span className="font-medium">{bug.assignedTo}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col lg:flex-row items-start lg:items-center space-y-3 lg:space-y-0 lg:space-x-4">
                    <div className="flex items-center space-x-2">
                      <Badge className={`priority-badge ${getPriorityColor(bug.priority)}`}>
                        {bug.priority}
                      </Badge>
                      <Badge className={`status-badge ${getStatusColor(bug.status)}`}>
                        {bug.status}
                      </Badge>
                    </div>

                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                      <Select
                        value={bug.status}
                        onValueChange={(value: Bug['status']) => handleStatusChange(bug.id, value)}
                      >
                        <SelectTrigger className="w-full sm:w-36">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Open">Open</SelectItem>
                          <SelectItem value="In Progress">In Progress</SelectItem>
                          <SelectItem value="Resolved">Resolved</SelectItem>
                          <SelectItem value="Closed">Closed</SelectItem>
                        </SelectContent>
                      </Select>

                      <Select
                        value={bug.assignedTo || 'unassigned'}
                        onValueChange={(value) => handleAssigneeChange(bug.id, value === 'unassigned' ? '' : value)}
                      >
                        <SelectTrigger className="w-full sm:w-36">
                          <SelectValue placeholder="Assign to..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unassigned">Unassigned</SelectItem>
                          {teamMembers.map((member) => (
                            <SelectItem key={member} value={member}>
                              {member}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Screenshot Modal */}
      {selectedBug?.screenshot && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedBug(null)}
        >
          <div className="bg-card rounded-lg p-4 max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">{selectedBug.title}</h3>
              <Button variant="ghost" size="icon" onClick={() => setSelectedBug(null)}>
                <Minus className="h-4 w-4" />
              </Button>
            </div>
            <img
              src={selectedBug.screenshot}
              alt="Bug screenshot"
              className="max-w-full max-h-[70vh] object-contain rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default BugDashboard;
