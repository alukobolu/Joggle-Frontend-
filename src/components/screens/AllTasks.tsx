import React, { useState } from 'react';
import { Search, Filter, Clock, MoreVertical } from 'lucide-react';
import { Card } from '../ui/card';
import { Input } from '../ui/input';
import { Checkbox } from '../ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible';

export function AllTasks() {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedProjects, setExpandedProjects] = useState<string[]>(['work', 'personal']);

  const tasksByProject = {
    work: [
      {
        id: 1,
        title: 'Prepare investor deck presentation',
        priority: 'high',
        deadline: 'August 25',
        completed: false,
      },
      {
        id: 2,
        title: 'Review mobile app wireframes',
        priority: 'high',
        deadline: 'August 28',
        completed: false,
      },
      {
        id: 3,
        title: 'Update project documentation',
        priority: 'low',
        deadline: 'August 30',
        completed: false,
      },
      {
        id: 4,
        title: 'Call with development team',
        priority: 'medium',
        deadline: 'August 25',
        completed: true,
      },
    ],
    personal: [
      {
        id: 5,
        title: 'Buy groceries for dinner',
        priority: 'medium',
        deadline: 'Today',
        completed: false,
      },
      {
        id: 6,
        title: 'Plan weekend family trip',
        priority: 'low',
        deadline: 'This week',
        completed: false,
      },
      {
        id: 7,
        title: 'Schedule dentist appointment',
        priority: 'medium',
        deadline: 'Next week',
        completed: false,
      },
    ],
    design: [
      {
        id: 8,
        title: 'Create new logo concepts',
        priority: 'high',
        deadline: 'August 27',
        completed: false,
      },
      {
        id: 9,
        title: 'Design system documentation',
        priority: 'medium',
        deadline: 'August 30',
        completed: false,
      },
    ],
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#FF4C4C]';
      case 'medium': return 'bg-[#FFC947]';
      case 'low': return 'bg-[#4CAF50]';
      default: return 'bg-[#B0B0B0]';
    }
  };

  const getProjectColor = (project: string) => {
    switch (project) {
      case 'work': return 'text-[#89CFF0]';
      case 'personal': return 'text-[#FFF9A6]';
      case 'design': return 'text-[#A8E6CF]';
      default: return 'text-[#B0B0B0]';
    }
  };

  const toggleProject = (project: string) => {
    setExpandedProjects(prev => 
      prev.includes(project) 
        ? prev.filter(p => p !== project)
        : [...prev, project]
    );
  };

  const getTaskCount = (tasks: any[]) => {
    const incomplete = tasks.filter(task => !task.completed).length;
    const total = tasks.length;
    return `${incomplete}/${total}`;
  };

  return (
    <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-xl text-white mb-4">All Tasks</h1>
        
        {/* Search and Filter */}
        <div className="flex gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#B0B0B0]" />
            <Input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-[#B0B0B0] rounded-xl"
            />
          </div>
          <button className="p-3 bg-white/5 border border-white/10 rounded-xl">
            <Filter className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      {/* Tasks by Project */}
      <div className="space-y-4">
        {Object.entries(tasksByProject).map(([project, tasks]) => (
          <Card key={project} className="bg-white/5 border-white/10 rounded-2xl overflow-hidden">
            <Collapsible
              open={expandedProjects.includes(project)}
              onOpenChange={() => toggleProject(project)}
            >
              <CollapsibleTrigger className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getProjectColor(project).replace('text-', 'bg-')}`} />
                  <h3 className="text-white capitalize">{project}</h3>
                  <span className="text-sm text-[#B0B0B0]">{getTaskCount(tasks)}</span>
                </div>
                <div className={`transition-transform duration-200 ${expandedProjects.includes(project) ? 'rotate-90' : ''}`}>
                  <MoreVertical className="w-4 h-4 text-[#B0B0B0] rotate-90" />
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-2">
                  {tasks.map((task) => (
                    <div 
                      key={task.id}
                      className="flex items-start gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors"
                    >
                      <div className="mt-1">
                        <Checkbox
                          checked={task.completed}
                          className="data-[state=checked]:bg-[#4CAF50] data-[state=checked]:border-[#4CAF50]"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h4 className={`text-white text-sm mb-1 ${task.completed ? 'line-through opacity-60' : ''}`}>
                          {task.title}
                        </h4>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-1 text-xs text-[#B0B0B0]">
                            <Clock className="w-3 h-3" />
                            <span>{task.deadline}</span>
                          </div>
                          
                          <div className={`w-1 h-4 rounded-full ${getPriorityColor(task.priority)} ${task.completed ? 'opacity-50' : ''}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>
    </div>
  );
}