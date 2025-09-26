import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { MapPin, CheckCircle, Circle, Clock, Plus, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

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
}

interface PlanDetailProps {
  plan: Plan;
  onBack: () => void;
}

interface PlanDetailHandle {
  addNewStep: () => void;
}

export const PlanDetail = forwardRef<PlanDetailHandle, PlanDetailProps>(function PlanDetail({ plan, onBack }, ref) {
  const [planSteps, setPlanSteps] = useState<PlanStep[]>(plan.steps);

  useImperativeHandle(ref, () => ({
    addNewStep: () => {
      const nextIndex = planSteps.length + 1;
      const newStep: PlanStep = {
        id: `${plan.id}-${nextIndex}`,
        title: `New Step ${nextIndex}`,
        description: 'Describe this step... ',
        status: 'pending',
      } as any;
      setPlanSteps(prev => [
        ...prev,
        newStep,
      ]);
    },
  }));

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'border-l-green-400 bg-green-400/5';
      case 'in-progress':
        return 'border-l-yellow-400 bg-yellow-400/5';
      default:
        return 'border-l-gray-400 bg-gray-400/5';
    }
  };

  const toggleStepStatus = (id: string) => {
    setPlanSteps(prev => prev.map(step => {
      if (step.id === id) {
        const statusOrder = ['pending', 'in-progress', 'completed'];
        const currentIndex = statusOrder.indexOf(step.status);
        const nextIndex = (currentIndex + 1) % statusOrder.length;
        return { ...step, status: statusOrder[nextIndex] as any };
      }
      return step;
    }));
  };

  return (
    <div className="flex-1 p-4 pb-24 overflow-y-auto scrollbar-hide">
      {/* Header with Back Button */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={onBack}
            className="p-2 rounded-full hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <MapPin className="w-6 h-6 text-[#C9B6E4]" />
          <h1 className="text-xl text-white">{plan.title}</h1>
        </div>
        <p className="text-[#B0B0B0] text-sm ml-12">
          {plan.description}
        </p>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-[#C9B6E4]/10 to-[#89CFF0]/10 border-[#C9B6E4]/20 p-4 rounded-2xl mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-white font-semibold">Overall Progress</h2>
          <span className="text-[#C9B6E4] text-sm">
            {planSteps.filter(p => p.status === 'completed').length} / {planSteps.length} completed
          </span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div 
            className="bg-gradient-to-r from-[#C9B6E4] to-[#89CFF0] h-2 rounded-full transition-all duration-500"
            style={{ 
              width: `${(planSteps.filter(p => p.status === 'completed').length / planSteps.length) * 100}%` 
            }}
          />
        </div>
      </Card>

      {/* Roadmap Steps */}
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg text-white">Your Roadmap</h2>
          <Button
            size="sm"
            className="bg-[#C9B6E4] hover:bg-[#B8A4D4] text-black rounded-xl"
            onClick={() => {
              const nextIndex = planSteps.length + 1;
              const newStep: PlanStep = {
                id: `${plan.id}-${nextIndex}`,
                title: `New Step ${nextIndex}`,
                description: 'Describe this step... ',
                status: 'pending',
              } as any;
              setPlanSteps(prev => [...prev, newStep]);
            }}
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Step
          </Button>
        </div>

        {planSteps.map((step, index) => (
          <Card 
            key={step.id}
            className={`border-l-4 ${getStatusColor(step.status)} bg-white/5 border-white/10 p-4 rounded-2xl transition-all duration-200 hover:bg-white/10`}
          >
            <div className="flex items-start gap-4">
              {/* Step Number & Status */}
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-[#C9B6E4] to-[#89CFF0] flex items-center justify-center text-black font-bold text-sm">
                  {index + 1}
                </div>
                <button
                  onClick={() => toggleStepStatus(step.id)}
                  className="transition-transform hover:scale-110"
                >
                  {getStatusIcon(step.status)}
                </button>
              </div>

              {/* Step Content */}
              <div className="flex-1">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-white font-semibold text-base">{step.title}</h3>
                  <div className="flex gap-2">
                    <button className="p-1 text-gray-400 hover:text-white transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="p-1 text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <p className="text-[#B0B0B0] text-sm mb-3 leading-relaxed">
                  {step.description}
                </p>

                {/* Step Details */}
                <div className="flex items-center gap-4 text-xs">
                  {step.estimatedTime && (
                    <div className="flex items-center gap-1 text-[#C9B6E4]">
                      <Clock className="w-3 h-3" />
                      <span>{step.estimatedTime}</span>
                    </div>
                  )}
                  
                  {step.dependencies && step.dependencies.length > 0 && (
                    <div className="flex items-center gap-1 text-[#89CFF0]">
                      <MapPin className="w-3 h-3" />
                      <span>Depends on: {step.dependencies.length} step(s)</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Connection Line */}
            {index < planSteps.length - 1 && (
              <div className="absolute left-8 top-16 w-0.5 h-8 bg-gradient-to-b from-[#C9B6E4]/50 to-[#89CFF0]/50" />
            )}
          </Card>
        ))}
      </div>

      {/* Tips Card */}
      <Card className="bg-gradient-to-r from-[#89CFF0]/10 to-[#C9B6E4]/10 border-[#89CFF0]/20 p-4 rounded-2xl mt-6">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-[#89CFF0] mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="text-white text-sm mb-2">Roadmap Tips</h3>
            <ul className="text-[#B0B0B0] text-xs space-y-1">
              <li>• Break large goals into smaller, manageable steps</li>
              <li>• Set realistic time estimates for each milestone</li>
              <li>• Track dependencies to plan your timeline</li>
              <li>• Celebrate each completed step to stay motivated</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
});
