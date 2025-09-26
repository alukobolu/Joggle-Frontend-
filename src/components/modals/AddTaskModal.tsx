import React, { useState } from 'react';
import { Calendar, Flag, Folder, NotebookPen, FormInput, Sparkles } from 'lucide-react';
import { Drawer, DrawerContent } from '../ui/drawer';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';

interface AddTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: any) => void;
}

export function AddTaskModal({ isOpen, onClose, onSave }: AddTaskModalProps) {
  const [activeTab, setActiveTab] = useState('notepad');
  const [notepadText, setNotepadText] = useState('');
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    project: '',
    priority: 'medium',
    deadline: '',
  });

  const projects = [
    { id: 'work', name: 'Work', color: 'bg-[#89CFF0]' },
    { id: 'personal', name: 'Personal', color: 'bg-[#FFF9A6]' },
    { id: 'design', name: 'Design', color: 'bg-[#A8E6CF]' },
    { id: 'family', name: 'Family', color: 'bg-[#FF9AA2]' },
  ];

  const priorities = [
    { id: 'high', name: 'High Priority', color: 'bg-[#FF4C4C]' },
    { id: 'medium', name: 'Medium Priority', color: 'bg-[#FFC947]' },
    { id: 'low', name: 'Low Priority', color: 'bg-[#4CAF50]' },
  ];

  const handleSave = () => {
    if (activeTab === 'notepad') {
      if (!notepadText.trim()) return;
      
      // For notepad mode, we'll create a task with the raw text
      // In a real app, this would be processed by AI to extract structured data
      const newTask = {
        id: Date.now(),
        title: notepadText.split('\n')[0] || 'New Task', // Use first line as title
        description: notepadText,
        project: '',
        priority: 'medium',
        deadline: '',
        completed: false,
        createdAt: new Date().toISOString(),
        isNotepadTask: true, // Flag to indicate this came from notepad
      };
      
      onSave(newTask);
      setNotepadText('');
    } else {
      if (!taskData.title.trim()) return;
      
      const newTask = {
        id: Date.now(),
        ...taskData,
        completed: false,
        createdAt: new Date().toISOString(),
        isNotepadTask: false,
      };
      
      onSave(newTask);
      setTaskData({
        title: '',
        description: '',
        project: '',
        priority: 'medium',
        deadline: '',
      });
    }
    
    onClose();
  };

  const handleProcessNotepad = () => {
    // Simulate AI processing of notepad text
    // In a real app, this would call an AI API to extract structured data
    if (!notepadText.trim()) return;
    
    const lines = notepadText.split('\n').filter(line => line.trim());
    const title = lines[0] || 'New Task';
    const description = lines.slice(1).join(' ') || '';
    
    // Simple priority detection
    let priority = 'medium';
    if (notepadText.toLowerCase().includes('urgent') || notepadText.toLowerCase().includes('asap')) {
      priority = 'high';
    } else if (notepadText.toLowerCase().includes('low priority') || notepadText.toLowerCase().includes('when possible')) {
      priority = 'low';
    }
    
    // Simple project detection
    let project = '';
    if (notepadText.toLowerCase().includes('work')) project = 'work';
    else if (notepadText.toLowerCase().includes('personal')) project = 'personal';
    else if (notepadText.toLowerCase().includes('design')) project = 'design';
    else if (notepadText.toLowerCase().includes('family')) project = 'family';
    
    setTaskData({
      title,
      description,
      project,
      priority,
      deadline: '',
    });
    
    setActiveTab('form');
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }} direction="bottom">
      <DrawerContent className="bg-[#1e1e1e] border-white/10 text-white rounded-t-2xl w-full max-w-none p-4 data-[vaul-drawer-direction=bottom]:max-h-[90vh]">
        {/* <DialogHeader>
          <DialogTitle className="text-lg text-white">Add New Task</DialogTitle>
          <DialogDescription className="text-[#B0B0B0]">
            Choose your preferred way to create a new task.
          </DialogDescription>
        </DialogHeader> */}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/5 rounded-xl">
            <TabsTrigger 
              value="notepad" 
              className="flex items-center gap-2 text-[#B0B0B0] data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg"
            >
              <NotebookPen className="w-4 h-4" />
              Notepad
            </TabsTrigger>
            <TabsTrigger 
              value="form" 
              className="flex items-center gap-2 text-[#B0B0B0] data-[state=active]:text-white data-[state=active]:bg-white/10 rounded-lg"
            >
              <FormInput className="w-4 h-4" />
              Form
            </TabsTrigger>
          </TabsList>

          <TabsContent value="notepad" className="mt-4 space-y-4">
            <div>
              {/* <label className="block text-sm text-[#B0B0B0] mb-2">
                Write naturally, we'll organize it for you
              </label> */}
              <Textarea
                value={notepadText}
                onChange={(e) => setNotepadText(e.target.value)}
                placeholder="e.g., 'Call mom about dinner plans this weekend - family project, urgent'"
                className="bg-transparent w-full border-0 focus-visible:ring-0 focus-visible:border-0 outline-none text-white placeholder:text-[#B0B0B0] min-h-[200px] resize-none"
              />
              {/* <p className="text-xs text-[#B0B0B0] mt-2">
                Tip: Mention priority (urgent, low priority) and project (work, personal, family, design) for better organization
              </p> */}
            </div>

            {/* AI Process Button */}
            {notepadText.trim() && (
              <Button
                onClick={handleProcessNotepad}
                variant="ghost"
                className="w-full text-[#C9B6E4] hover:text-white hover:bg-white/5 rounded-xl border border-[#C9B6E4]/30"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Process with AI & Switch to Form
              </Button>
            )}

            {/* Actions for Notepad */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1 text-[#B0B0B0] hover:text-white hover:bg-white/5 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!notepadText.trim()}
                className="flex-1 bg-gradient-to-r from-[#C9B6E4] to-[#89CFF0] hover:from-[#B8A4D4] hover:to-[#78B8E0] text-black rounded-xl disabled:opacity-50"
              >
                Save Task
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="form" className="mt-4 space-y-4">
            {/* Task Title */}
            <div>
              <label className="block text-sm text-[#B0B0B0] mb-2">Task Title</label>
              <Input
                value={taskData.title}
                onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
                placeholder="Enter task title..."
                className="bg-white/5 border-white/10 text-white placeholder:text-[#B0B0B0] rounded-xl"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm text-[#B0B0B0] mb-2">Description (Optional)</label>
              <Textarea
                value={taskData.description}
                onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
                placeholder="Add more details..."
                className="bg-transparent border-0 focus-visible:ring-0 focus-visible:border-0 outline-none text-white placeholder:text-[#B0B0B0] min-h-[120px] resize-none"
              />
            </div>

            {/* Project */}
            <div>
              <label className="block text-sm text-[#B0B0B0] mb-2">Project</label>
              <Select value={taskData.project} onValueChange={(value) => setTaskData({ ...taskData, project: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                  <div className="flex items-center gap-2">
                    <Folder className="w-4 h-4" />
                    <SelectValue placeholder="Select project" />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-white/10">
                  {projects.map((project) => (
                    <SelectItem key={project.id} value={project.id} className="text-white hover:bg-white/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${project.color}`} />
                        <span>{project.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm text-[#B0B0B0] mb-2">Priority</label>
              <Select value={taskData.priority} onValueChange={(value) => setTaskData({ ...taskData, priority: value })}>
                <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl">
                  <div className="flex items-center gap-2">
                    <Flag className="w-4 h-4" />
                    <SelectValue />
                  </div>
                </SelectTrigger>
                <SelectContent className="bg-[#1e1e1e] border-white/10">
                  {priorities.map((priority) => (
                    <SelectItem key={priority.id} value={priority.id} className="text-white hover:bg-white/5">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${priority.color}`} />
                        <span>{priority.name}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Deadline */}
            <div>
              <label className="block text-sm text-[#B0B0B0] mb-2">Deadline (Optional)</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0B0B0]" />
                <Input
                  type="date"
                  value={taskData.deadline}
                  onChange={(e) => setTaskData({ ...taskData, deadline: e.target.value })}
                  className="pl-10 bg-white/5 border-white/10 text-white rounded-xl"
                />
              </div>
            </div>

            {/* Actions for Form */}
            <div className="flex gap-3 pt-4">
              <Button
                variant="ghost"
                onClick={onClose}
                className="flex-1 text-[#B0B0B0] hover:text-white hover:bg-white/5 rounded-xl"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={!taskData.title.trim()}
                className="flex-1 bg-gradient-to-r from-[#C9B6E4] to-[#89CFF0] hover:from-[#B8A4D4] hover:to-[#78B8E0] text-black rounded-xl disabled:opacity-50"
              >
                Save Task
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DrawerContent>
    </Drawer>
  );
}