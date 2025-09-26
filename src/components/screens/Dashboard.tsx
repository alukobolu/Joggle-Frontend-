import React from 'react';
import { Briefcase, GraduationCap, Heart, Lightbulb, Clock, Users, MoreHorizontal } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

export function Dashboard() {
  const projects = [
    {
      id: 1,
      name: 'Mobile',
      icon: Briefcase,
      taskCount: 12,
      color: 'bg-[#C9B6E4]',
      textColor: 'text-black',
    },
    {
      id: 2,
      name: 'Wireframe',
      icon: Lightbulb,
      taskCount: 12,
      color: 'bg-[#A8E6CF]',
      textColor: 'text-black',
    },
    {
      id: 3,
      name: 'Website',
      icon: GraduationCap,
      taskCount: 6,
      color: 'bg-[#FFF9A6]',
      textColor: 'text-black',
    },
    {
      id: 4,
      name: 'Family',
      icon: Heart,
      taskCount: 3,
      color: 'bg-[#89CFF0]',
      textColor: 'text-black',
    },
  ];

  const ongoingTasks = [
    {
      id: 1,
      title: 'Salon App Wireframe',
      project: 'Mobile',
      priority: 'high',
      deadline: 'August 25',
      progress: 82,
      timeRange: '10:00 AM - 06:00 PM',
      collaborators: [
        '/api/placeholder/32/32',
        '/api/placeholder/32/32',
      ],
    },
    {
      id: 2,
      title: 'Marketing Website',
      project: 'Website',
      priority: 'medium',
      deadline: 'August 28',
      progress: 64,
      timeRange: 'Due Friday',
      collaborators: [],
    },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-[#FF4C4C]';
      case 'medium': return 'bg-[#FFC947]';
      case 'low': return 'bg-[#4CAF50]';
      default: return 'bg-[#B0B0B0]';
    }
  };

  return (
    <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-xl text-white">Hello Rakib 👋</h1>
            <p className="text-[#B0B0B0] text-sm">Manage Your Daily Task</p>
          </div>
          <button className="p-2 rounded-lg bg-white/5 border border-white/10">
            <MoreHorizontal className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Project Overview Cards */}
      <div className="mb-6">
        <div className="flex gap-3 overflow-x-auto pb-2">
          {projects.map((project) => {
            const Icon = project.icon;
            return (
              <Card 
                key={project.id}
                className={`${project.color} ${project.textColor} min-w-[120px] border-0 p-4 rounded-2xl shadow-sm hover:scale-105 transition-all duration-200`}
              >
                <div className="flex flex-col items-center text-center">
                  <Icon className="w-6 h-6 mb-2" />
                  <h3 className="text-sm mb-1">{project.name}</h3>
                  <p className="text-xs opacity-70">{project.taskCount} Tasks</p>
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Ongoing Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-white">Ongoing</h2>
          <button className="text-[#C9B6E4] text-sm">See All</button>
        </div>

        <div className="space-y-3">
          {ongoingTasks.map((task) => (
            <Card key={task.id} className="bg-white/5 border-white/10 p-4 rounded-2xl hover:bg-white/10 transition-all duration-200">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <div className={`w-1 h-6 rounded-full ${getPriorityColor(task.priority)}`} />
                    <div>
                      <h3 className="text-white text-sm">{task.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-[#B0B0B0] mt-1">
                        <Clock className="w-3 h-3" />
                        <span>{task.timeRange}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-[#B0B0B0]">Due Date: {task.deadline}</span>
                    <span className="text-xs text-white">{task.progress}%</span>
                  </div>
                  
                  <Progress 
                    value={task.progress} 
                    className="h-1 mt-2 bg-white/10"
                  />
                </div>

                {task.collaborators.length > 0 && (
                  <div className="flex -space-x-2 ml-3">
                    {task.collaborators.map((avatar, index) => (
                      <img
                        key={index}
                        src={avatar}
                        alt={`Collaborator ${index + 1}`}
                        className="w-6 h-6 rounded-full border-2 border-[#121212]"
                      />
                    ))}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}