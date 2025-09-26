import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MapPin, Plus, Calendar, Target, TrendingUp, ArrowRight } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '../ui/dialog';
import { Input } from '../ui/input';

interface PlanStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  estimatedTime?: string;
  dependencies?: string[];
}

interface Plan {
  id: string;
  title: string;
  description: string;
  steps: PlanStep[];
  createdAt: string;
  updatedAt: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
}

interface AllPlansProps {
  onPlanSelect: (plan: Plan) => void;
}

interface AllPlansHandle {
  openAddPlan: () => void;
}

export const AllPlans = forwardRef<AllPlansHandle, AllPlansProps>(function AllPlans({ onPlanSelect }, ref) {
  const [plans, setPlans] = useState<Plan[]>([
    {
      id: '1',
      title: 'Career Development',
      description: 'Build a successful career in tech',
      category: 'Professional',
      priority: 'high',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-20',
      steps: [
        {
          id: '1-1',
          title: 'Learn React Fundamentals',
          description: 'Master components, hooks, and state management',
          status: 'completed',
          estimatedTime: '2 weeks',
          dependencies: []
        },
        {
          id: '1-2',
          title: 'Build Portfolio Website',
          description: 'Create a modern portfolio showcasing my projects',
          status: 'in-progress',
          estimatedTime: '1 week',
          dependencies: ['1-1']
        },
        {
          id: '1-3',
          title: 'Apply to Jobs',
          description: 'Submit applications to 20+ companies',
          status: 'pending',
          estimatedTime: '1 week',
          dependencies: ['1-2']
        },
        {
          id: '1-4',
          title: 'Prepare for Interviews',
          description: 'Practice coding challenges and system design',
          status: 'pending',
          estimatedTime: '2 weeks',
          dependencies: ['1-3']
        },
        {
          id: '1-5',
          title: 'Land Dream Job',
          description: 'Get hired at a top tech company',
          status: 'pending',
          estimatedTime: '1 month',
          dependencies: ['1-4']
        }
      ]
    },
    {
      id: '2',
      title: 'Fitness Journey',
      description: 'Get in shape and build healthy habits',
      category: 'Health',
      priority: 'medium',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-18',
      steps: [
        {
          id: '2-1',
          title: 'Create Workout Routine',
          description: 'Design a balanced workout plan',
          status: 'completed',
          estimatedTime: '3 days',
          dependencies: []
        },
        {
          id: '2-2',
          title: 'Start Cardio Training',
          description: 'Begin with 30 minutes daily',
          status: 'in-progress',
          estimatedTime: '2 weeks',
          dependencies: ['2-1']
        },
        {
          id: '2-3',
          title: 'Strength Training',
          description: 'Add weight lifting to routine',
          status: 'pending',
          estimatedTime: '1 month',
          dependencies: ['2-2']
        },
        {
          id: '2-4',
          title: 'Nutrition Plan',
          description: 'Optimize diet for fitness goals',
          status: 'pending',
          estimatedTime: '2 weeks',
          dependencies: ['2-1']
        }
      ]
    },
    {
      id: '3',
      title: 'Learn Spanish',
      description: 'Become conversational in Spanish',
      category: 'Education',
      priority: 'low',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-15',
      steps: [
        {
          id: '3-1',
          title: 'Basic Vocabulary',
          description: 'Learn 500 essential words',
          status: 'completed',
          estimatedTime: '1 month',
          dependencies: []
        },
        {
          id: '3-2',
          title: 'Grammar Fundamentals',
          description: 'Master present tense and basic grammar',
          status: 'in-progress',
          estimatedTime: '6 weeks',
          dependencies: ['3-1']
        },
        {
          id: '3-3',
          title: 'Conversation Practice',
          description: 'Practice speaking with native speakers',
          status: 'pending',
          estimatedTime: '2 months',
          dependencies: ['3-2']
        },
        {
          id: '3-4',
          title: 'Advanced Topics',
          description: 'Learn complex grammar and idioms',
          status: 'pending',
          estimatedTime: '3 months',
          dependencies: ['3-3']
        }
      ]
    }
  ]);

  const [isNewPlanOpen, setIsNewPlanOpen] = useState(false);
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDescription, setNewPlanDescription] = useState('');

  useImperativeHandle(ref, () => ({
    openAddPlan: () => setIsNewPlanOpen(true),
  }));

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'medium':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default:
        return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Professional':
        return <TrendingUp className="w-4 h-4" />;
      case 'Health':
        return <Target className="w-4 h-4" />;
      case 'Education':
        return <MapPin className="w-4 h-4" />;
      default:
        return <MapPin className="w-4 h-4" />;
    }
  };

  const calculateProgress = (steps: PlanStep[]) => {
    const completed = steps.filter(step => step.status === 'completed').length;
    return Math.round((completed / steps.length) * 100);
  };

  function addNewPlan() {
    const title = newPlanTitle.trim();
    if (!title) return;
    const now = new Date().toISOString();
    const newPlan: Plan = {
      id: Math.random().toString(36).slice(2),
      title,
      description: newPlanDescription.trim(),
      category: 'General',
      priority: 'medium',
      createdAt: now,
      updatedAt: now,
      steps: [],
    } as any;
    setPlans(prev => [newPlan, ...prev]);
    setIsNewPlanOpen(false);
    setNewPlanTitle('');
    setNewPlanDescription('');
  }

  return (
    <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <MapPin className="w-6 h-6 text-[#C9B6E4]" />
          <h1 className="text-xl text-white">All Plans</h1>
        </div>
        <p className="text-[#B0B0B0] text-sm">
          Manage and track all your long-term goals and roadmaps
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <Card className="bg-gradient-to-r from-[#C9B6E4]/10 to-[#89CFF0]/10 border-[#C9B6E4]/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#C9B6E4]/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-[#C9B6E4]" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">{plans.length}</p>
              <p className="text-[#B0B0B0] text-xs">Total Plans</p>
            </div>
          </div>
        </Card>
        
        <Card className="bg-gradient-to-r from-[#89CFF0]/10 to-[#C9B6E4]/10 border-[#89CFF0]/20 p-4 rounded-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#89CFF0]/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-[#89CFF0]" />
            </div>
            <div>
              <p className="text-white font-semibold text-lg">
                {Math.round(plans.reduce((acc, plan) => acc + calculateProgress(plan.steps), 0) / plans.length)}%
              </p>
              <p className="text-[#B0B0B0] text-xs">Avg Progress</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-white">Your Plans</h2>
          <Button
            size="sm"
            className="bg-[#C9B6E4] hover:bg-[#B8A4D4] text-black rounded-xl"
            onClick={() => setIsNewPlanOpen(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            New Plan
          </Button>
        </div>

        {plans.map((plan) => {
          const progress = calculateProgress(plan.steps);
          const completedSteps = plan.steps.filter(s => s.status === 'completed').length;
          const inProgressSteps = plan.steps.filter(s => s.status === 'in-progress').length;
          
          return (
            <Card 
              key={plan.id}
              className="bg-white/5 border-white/10 p-4 rounded-2xl transition-all duration-200 hover:bg-white/10 cursor-pointer group"
              onClick={() => onPlanSelect(plan)}
            >
              <div className="flex items-start gap-4">
                {/* Category Icon */}
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#C9B6E4]/20 to-[#89CFF0]/20 flex items-center justify-center flex-shrink-0">
                  {getCategoryIcon(plan.category)}
                </div>

                {/* Plan Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="text-white font-semibold text/base mb-1">{plan.title}</h3>
                      <p className="text-[#B0B0B0] text-sm">{plan.description}</p>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white transition-colors flex-shrink-0" />
                  </div>

                  {/* Plan Stats */}
                  <div className="flex items-center gap-4 mb-3 text-xs">
                    <div className="flex items-center gap-1 text-[#C9B6E4]">
                      <MapPin className="w-3 h-3" />
                      <span>{plan.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[#89CFF0]">
                      <Calendar className="w-3 h-3" />
                      <span>{plan.steps.length} steps</span>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs border ${getPriorityColor(plan.priority)}`}>
                      {plan.priority}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#B0B0B0]">
                        {completedSteps} completed, {inProgressSteps} in progress
                      </span>
                      <span className="text-[#C9B6E4] font-semibold">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-[#C9B6E4] to-[#89CFF0] h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-[#89CFF0]/10 to-[#C9B6E4]/10 border-[#89CFF0]/20 p-4 rounded-2xl mt-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#89CFF0] mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-white text-sm mb-2">Planning Tips</h3>
            <ul className="text-[#B0B0B0] text-xs space-y-1">
              <li>• Create separate plans for different life areas</li>
              <li>• Set realistic timelines for each milestone</li>
              <li>• Review and update your plans regularly</li>
              <li>• Celebrate progress to stay motivated</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* New Plan Dialog */}
      <Dialog open={isNewPlanOpen} onOpenChange={setIsNewPlanOpen}>
        <DialogContent className="bg-[#1e1e1e] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>New Plan</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input value={newPlanTitle} onChange={(e) => setNewPlanTitle(e.target.value)} placeholder="Plan title" className="bg-white/5 border-white/10" />
            <Input value={newPlanDescription} onChange={(e) => setNewPlanDescription(e.target.value)} placeholder="Short description" className="bg-white/5 border-white/10" />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsNewPlanOpen(false)}>Cancel</Button>
            <Button onClick={addNewPlan} disabled={!newPlanTitle.trim()}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
});
