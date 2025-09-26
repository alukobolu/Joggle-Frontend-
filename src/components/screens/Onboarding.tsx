import React, { useState } from 'react';
import { ChevronRight, Check, Briefcase, GraduationCap, Heart, Lightbulb, Home, Dumbbell } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const categories = [
    { id: 'work', name: 'Work', icon: Briefcase, color: 'bg-[#89CFF0]' },
    { id: 'family', name: 'Family', icon: Heart, color: 'bg-[#FF9AA2]' },
    { id: 'school', name: 'School', icon: GraduationCap, color: 'bg-[#A8E6CF]' },
    { id: 'side-hustle', name: 'Side Hustle', icon: Lightbulb, color: 'bg-[#FFF9A6]' },
    { id: 'home', name: 'Home', icon: Home, color: 'bg-[#C9B6E4]' },
    { id: 'health', name: 'Health', icon: Dumbbell, color: 'bg-[#FFB366]' },
  ];

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const steps = [
    {
      title: "Welcome to Joggle Task",
      subtitle: "Stay on top of everything that matters",
      content: (
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#C9B6E4] to-[#89CFF0] rounded-3xl flex items-center justify-center">
            <div className="text-4xl">🎯</div>
          </div>
          <p className="text-[#B0B0B0] text-sm leading-relaxed">
            An AI-native productivity app designed for multi-taskers. 
            Combine the simplicity of notes with the power of intelligent task management.
          </p>
        </div>
      )
    },
    {
      title: "Choose Your Categories",
      subtitle: "Select the areas of your life you want to organize",
      content: (
        <div>
          <div className="grid grid-cols-2 gap-3 mb-6">
            {categories.map((category) => {
              const Icon = category.icon;
              const isSelected = selectedCategories.includes(category.id);
              
              return (
                <Card
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`p-4 rounded-2xl cursor-pointer transition-all duration-200 border-2 ${
                    isSelected 
                      ? `${category.color} border-white/20 text-black scale-95` 
                      : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                  }`}
                >
                  <div className="flex flex-col items-center text-center">
                    <div className="relative">
                      <Icon className="w-6 h-6 mb-2" />
                      {isSelected && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-2 h-2 text-black" />
                        </div>
                      )}
                    </div>
                    <span className="text-sm">{category.name}</span>
                  </div>
                </Card>
              );
            })}
          </div>
          <p className="text-[#B0B0B0] text-xs text-center">
            You can always add or remove categories later in settings.
          </p>
        </div>
      )
    },
    {
      title: "Enable Notifications",
      subtitle: "Stay updated with your tasks and deadlines",
      content: (
        <div className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-[#FFC947] to-[#FF9AA2] rounded-3xl flex items-center justify-center">
            <div className="text-4xl">🔔</div>
          </div>
          <p className="text-[#B0B0B0] text-sm leading-relaxed mb-6">
            Get gentle reminders about your tasks and never miss an important deadline. 
            You can customize notification preferences anytime.
          </p>
          <div className="space-y-3">
            <Button className="w-full bg-gradient-to-r from-[#C9B6E4] to-[#89CFF0] hover:from-[#B8A4D4] hover:to-[#78B8E0] text-black rounded-xl py-3">
              Enable Notifications
            </Button>
            <Button variant="ghost" className="w-full text-[#B0B0B0] hover:text-white hover:bg-white/5 rounded-xl py-3">
              Maybe Later
            </Button>
          </div>
        </div>
      )
    }
  ];

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const handleNext = () => {
    if (isLastStep) {
      onComplete();
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const canProceed = currentStep !== 1 || selectedCategories.length > 0;

  return (
    <div className="min-h-screen flex flex-col p-4">
      {/* Progress Indicators */}
      <div className="flex justify-center gap-2 mb-8 mt-4">
        {steps.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentStep
                ? 'bg-[#C9B6E4] w-6'
                : index < currentStep
                ? 'bg-[#C9B6E4]'
                : 'bg-white/20'
            }`}
          />
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        <div className="mb-8">
          <h1 className="text-2xl text-white text-center mb-2">
            {currentStepData.title}
          </h1>
          <p className="text-[#B0B0B0] text-center text-sm">
            {currentStepData.subtitle}
          </p>
        </div>

        <div className="mb-8">
          {currentStepData.content}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3 pb-8">
        {currentStep > 0 && (
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="flex-1 text-[#B0B0B0] hover:text-white hover:bg-white/5 rounded-xl py-3"
          >
            Back
          </Button>
        )}
        
        <Button
          onClick={handleNext}
          disabled={!canProceed}
          className="flex-1 bg-gradient-to-r from-[#C9B6E4] to-[#89CFF0] hover:from-[#B8A4D4] hover:to-[#78B8E0] text-black rounded-xl py-3 disabled:opacity-50"
        >
          <span>{isLastStep ? 'Get Started' : 'Continue'}</span>
          <ChevronRight className="w-4 h-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}