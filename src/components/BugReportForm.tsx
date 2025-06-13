
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { Upload, X, Image, Send } from 'lucide-react';

interface BugReport {
  title: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | '';
  reporter: string;
  screenshot?: File;
}

interface BugReportFormProps {
  onSubmit: (bug: Omit<BugReport, 'screenshot'> & { screenshot?: string }) => void;
}

const BugReportForm = ({ onSubmit }: BugReportFormProps) => {
  const [formData, setFormData] = useState<BugReport>({
    title: '',
    description: '',
    priority: '',
    reporter: '',
    screenshot: undefined
  });
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field: keyof BugReport, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image smaller than 5MB",
          variant: "destructive"
        });
        return;
      }

      setFormData(prev => ({ ...prev, screenshot: file }));
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const removeFile = () => {
    setFormData(prev => ({ ...prev, screenshot: undefined }));
    setPreviewUrl('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate form
      if (!formData.title.trim() || !formData.description.trim() || !formData.priority || !formData.reporter.trim()) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }

      // Simulate file upload and form submission
      let screenshotUrl = '';
      if (formData.screenshot) {
        // In a real app, this would upload to a server
        screenshotUrl = URL.createObjectURL(formData.screenshot);
      }

      const bugReport = {
        title: formData.title,
        description: formData.description,
        priority: formData.priority as 'Low' | 'Medium' | 'High',
        reporter: formData.reporter,
        screenshot: screenshotUrl
      };

      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API call
      
      onSubmit(bugReport);
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        priority: '',
        reporter: '',
        screenshot: undefined
      });
      setPreviewUrl('');

      toast({
        title: "Bug Report Submitted!",
        description: "Your bug report has been successfully submitted and assigned a tracking ID.",
      });

    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit bug report. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto glass-morphism border-border/20 animate-fade-in">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
          Report a Bug
        </CardTitle>
        <p className="text-muted-foreground">Help us improve by reporting issues you encounter</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Bug Title *
            </Label>
            <Input
              id="title"
              placeholder="Brief description of the bug"
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">
              Description *
            </Label>
            <Textarea
              id="description"
              placeholder="Detailed description of the bug, steps to reproduce, expected behavior..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[100px] transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              required
            />
          </div>

          {/* Priority and Reporter Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority Level *
              </Label>
              <Select
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
                required
              >
                <SelectTrigger className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Low">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      <span>Low</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="Medium">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-yellow-500"></div>
                      <span>Medium</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="High">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span>High</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reporter" className="text-sm font-medium">
                Your Name *
              </Label>
              <Input
                id="reporter"
                placeholder="Enter your name"
                value={formData.reporter}
                onChange={(e) => handleInputChange('reporter', e.target.value)}
                className="transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
                required
              />
            </div>
          </div>

          {/* File Upload */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Screenshot (Optional)</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-6 transition-all duration-200 hover:border-blue-500/50">
              {!previewUrl ? (
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <div className="text-sm text-muted-foreground mb-2">
                    Click to upload or drag and drop
                  </div>
                  <div className="text-xs text-muted-foreground">
                    PNG, JPG, GIF up to 5MB
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              ) : (
                <div className="relative">
                  <img
                    src={previewUrl}
                    alt="Screenshot preview"
                    className="max-h-48 mx-auto rounded-lg shadow-md"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={removeFile}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 hover:scale-105 text-white"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Submitting...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Send className="h-4 w-4" />
                <span>Submit Bug Report</span>
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BugReportForm;
